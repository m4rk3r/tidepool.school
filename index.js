require('dotenv').config();
const express = require('express');
const uuid = require('uuid');
const Redis = require('ioredis');
const redis = new Redis({password: process.env.DB_PW, db: 2});

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379, password: process.env.DB_PW}));

const lifespan = 2 * 60;
const DEBUG = true;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (DEBUG) {
  app.use('/assets', express.static('assets'));
  app.use('/weeks', express.static('weeks'));
}

const getPeople = async () => {
  const batch = redis.pipeline();
  const queue = await redis.lrange('queue', 0, -1);
  queue.forEach(k => batch.call('json.get', `q:${k}`));
  return (await batch.exec()).map(r => JSON.parse(r[1]));
}

const exists = async (id) => {
  const queue = await redis.lrange('queue', 0, -1);
  return queue.includes(id);
}

app.get('/admin', async (req, res) => {
  res.render('admin', {
    people: await getPeople()
  });
});

app.get('/', async (req, res) => {
  res.render('index');
});

app.get('/api/queue', async (req, res) => {
  res.json({
    people: await getPeople()
  });
});

app.post('/', async (req, res) => {
  if (!req.body.name) {
    return;
  }

  const uid = uuid.v1();
  const data = {
    name: req.body.name,
    complete: false,
    current: false,
    joined: new Date(),
    id: uid
  };
  redis.rpush('queue', uid);
  redis.call('json.set', `q:${uid}`, '.', JSON.stringify(data));

  res.json({
    people: await getPeople()
  });
});


app.post('/current', async (req, res) => {
  const { id } = req.body;
  if (!exists(id)) {
    return res.status(400).end();
  }

  const people = await getPeople();
  const isCurrent = people.find(person => person.current);
  if (isCurrent) {
    isCurrent.current = false;
    redis.call('json.set', `q:${isCurrent.id}`, '.', JSON.stringify(isCurrent));

    // toggling current person
    if (isCurrent.id === id) {
      return res.json({
        people: await getPeople()
      });
    }
  }

  const nextCurrent = people.find(person => person.id === id);
  if (nextCurrent) {
    nextCurrent.current = true;
    redis.call('json.set', `q:${nextCurrent.id}`, '.', JSON.stringify(nextCurrent));
  }

  return res.json({
    people: await getPeople()
  });
});


app.post('/complete', async (req, res) => {
  const { id } = req.body;
  if (!exists(id)) {
    return res.status(400).end();
  }

  const people = await getPeople();
  const person = people.find(person => person.id === id);
  if (person) {
    person.complete = true;
    person.current = false;
    redis.call('json.set', `q:${person.id}`, '.', JSON.stringify(person));
  }

  return res.json({
    people: await getPeople()
  });
});


app.post('/remove', async (req, res) => {
  const { id } = req.body;
  if (!exists(id)) {
    return res.status(400).end();
  }

  redis.del(`q:${id}`);
  redis.lrem('queue', 1, id);

  return res.json({
    people: await getPeople()
  });
});

app.get('/poem-data', async (req, res) => {
  let poemData = {};
  const keys = await redis.keys('poem:*');
  for(k of keys) {
    poemData[k.split(':')[1]] = await redis.hgetall(k);
  }
  
  res.json(poemData);
});

const getCreatures = async (ignore = '') => {
    const keys = await redis.keys('u:*');
    const pipe = redis.pipeline();
    keys.forEach(k => { if (k !== ignore) pipe.hgetall(k); });
    return (await pipe.exec()).map(([e, r]) => r);
}

const getActivities = async () => {
  const keys = await redis.keys('a:*');
  const cursor = redis.pipeline();
  keys.forEach(k => cursor.hgetall(k));
  const res = (await cursor.exec()).map(([e, r]) => {
    return { ts: Date.now(), ...r};
  });
  return res;
}

io.on('connection', async socket => {
  console.log('socket connected...');

  socket.on('clickEvt', async data => {
    const k = `a:${data.id}:${data.evtIdx}`;
    data = { created: Date.now(), lifespan, ...data};
    redis.hset(k, 'x', data.x, 'y', data.y, 'id', data.id, 'creature', data.creature, 'nickname', data.nickname, 'evtIdx', data.evtIdx, 'created', Date.now(), 'lifespan', lifespan);
    redis.expire(k, lifespan);
    socket.broadcast.emit('activity', data);
  });

  // broadcast curent events
  const activity = await getActivities();
  socket.emit('activity', activity);

  socket.on('frame', async data => {
    const k = `u:${data.id}`;
    redis.hset(k, 'x', data.x, 'y', data.y, 'id', data.id, 'creature', data.creature, 'nickname', data.nickname);
    redis.expire(k, 15);
    const creatures = await getCreatures();
    socket.emit('pong', creatures);
  });

  socket.on('typing', data => {
    socket.broadcast.emit('question', data.text);
  });

  socket.on('poem-input', data => {
    socket.broadcast.emit('poem-output', data);
    const [ person, part ] = data.key.split('-');
    redis.hset(`poem:${part}`, person, data.text);
  });

  socket.on('get-code', async () => {
    let poemData = {};
    const keys = await redis.keys('poem:*');
    for(k of keys) {
      poemData[k.split(':')[1]] = await redis.hvals(k);
    }
    socket.emit('code', poemData);
  });
});

server.listen(4000);
