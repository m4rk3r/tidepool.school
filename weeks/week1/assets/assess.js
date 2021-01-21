const ocean = document.querySelector('#ocean');
let drawing = false;

var socket;
if (window.location.hostname.includes('localhost')) {
 socket = io('http://localhost:4000', { transports: ['websocket']});
} else {
  socket = io('https://tidepool.school', {
      path: '/ws',
      transports: ['websocket']
  });
}

const uid = Math.random().toString(36).substr(2, 9);
let posX = 0,
    posY = 0,
    evtIdx = 0;

let offsetX = 15 / window.innerWidth * 100;
let offsetY = 15 / window.innerHeight * 100;

const creatureExpiry = {};
const creatureIcons = {
  cricket: '🦗',
  bee: '🐝',
  butterfly: '🦋',
  ant: '🐜',
  duck: '🦆',
  turtle: '🐢',
  ladybug: '🐞',
  bug: '🐛',
  snail: '🐌',
  whale: '🐳',
  dolphin: '🐬',
  fish: '🐟',
  tropical_fish: '🐠',
  duck: '🦆',
  turtle: '🐢',
  blowfish: '🐡',
  shark: '🦈',
  octopus: '🐙',
  shell: '🐚',
  crab: '🦀',
  squid: '🦑',
  penguin: '🐧',
  shrimp: '🦐',
};

const creatures = Object.keys(creatureIcons);
let nickname = '';

let creature = creatures[Math.round(Math.random() * (creatures.length-1))];
const creatureSelect = document.querySelector('#creature-select');
creatures.forEach(c => creatureSelect.innerHTML += `<option value="${c}" ${ creature === c ? 'selected="true"' : ''}>${creatureIcons[c]} ${c}</option>`);

creatureSelect.addEventListener('click', (evt) => evt.stopPropagation());
creatureSelect.addEventListener('change', (evt) => {
  creature = evt.target.value;
});

document.addEventListener('mousemove', (evt) => {
  posX = evt.clientX / window.innerWidth * 100;
  posY = evt.clientY / window.innerHeight * 100;
});

document.querySelector('#nickname').addEventListener('input', evt => {
  nickname = evt.target.value;
});


const fadeCreature = (id) => {
  console.log('fading', id);
  const creature = document.querySelector(id);
  creature.classList.add('fade');
  creature.addEventListener('transitionend', () => {
    document.body.removeChild(creature);
  }, { once: true });
}


const drawCreatures = creatures => {
  if (!creatures || typeof creatures !== "object") {
    return;
  }

  creatures.forEach(creature => {
    if (!document.querySelector(`#creature-${creature.id}`)) {
      console.log('creating creature', creature.id);
      const newCreature = document.createElement('div');
      const bug = document.createElement('span');
      bug.innerHTML = creatureIcons[creature.creature];
      newCreature.append(bug);

      const name = document.createElement('span');
      name.innerHTML = creature.nickname;
      name.className = 'name';
      newCreature.append(name);

      newCreature.id = `creature-${creature.id}`;
      newCreature.title = creature.nickname;
      newCreature.className = `creature ${creature.creature} ${ uid === creature.id ? 'self' : ''}`;
      newCreature.style.left = `${creature.x - offsetX}%`;
      newCreature.style.top = `${creature.y - offsetY}%`;
      document.body.append(newCreature);

      const bcr = newCreature.getBoundingClientRect();
      offsetX = (bcr.width * 0.5) / window.innerWidth * 100;
      offsetY = (bcr.height * 0.5) / window.innerHeight * 100;

      // add fade timeouts for other bugs
      if (creature.id !== uid) {
        if (creatureExpiry[creature.id]) {
          clearTimeout(creatureExpiry[creature.id])
        }
        creatureExpiry[creature.id] = setTimeout(() => fadeCreature(`#creature-${creature.id}`), 1000);
      }

    } else {
      const c = document.querySelector(`#creature-${creature.id}`);
      c.style.left = `${creature.x - offsetX}%`;
      c.style.top = `${creature.y - offsetY}%`;

      if (creature.nickname !== c.title) {
        c.title = creature.nickname;
        c.querySelector('.name').innerHTML = creature.nickname;
      }

      if (!c.classList.contains(creature.creature)) {
        c.querySelector('span').innerText = creatureIcons[creature.creature];
        c.className = `creature ${creature.creature} ${ uid === creature.id ? 'self' : ''}`;
      }

      // add fade timeouts for other bugs
      if (creature.id !== uid) {
        clearTimeout(creatureExpiry[creature.id]);
        creatureExpiry[creature.id] = setTimeout(() => fadeCreature(`#creature-${creature.id}`), 1000);
      }
    }
  });
}


socket.on('connect', () => {
  console.log('connected...')
  let ts = Date.now();
  const tick = () => {
    if (Date.now() - ts > 16) {
      socket.emit('frame', { id: uid, nickname: nickname, creature: creature, x: posX, y: posY });
      ts = Date.now();
    }
    requestAnimationFrame(tick);
  };
  tick();
});

const q = document.querySelector('#question');
socket.on('question', (text) => {
  q.innerHTML = text;
})

socket.on('pong', drawCreatures);
