
let preTags = document.querySelectorAll('pre');
let positions = [];
let x; let y;
let placed;
const buffer = 12;
const ocean = document.querySelector('#ocean');
const s = document.querySelector('#signup').getBoundingClientRect();
let drawing = true;

preTags.forEach(function (tag) {
  placed = false;
  loopBreak = 0;

  while(!placed) {
    x = Math.round(Math.random() * 95);
    y = Math.round(Math.random() * 95);

    let spacing = (pos) => {
      let fit = false;
       fit = (x > pos.x - buffer && x < pos.x + buffer) &&
             (y > pos.y - buffer && y < pos.y + buffer);

      const bcr = tag.getBoundingClientRect();
      const xPos = window.innerWidth * x/100 + bcr.width/2;
      const yPos = window.innerHeight * y/100 + bcr.height;
      const inSignup = (xPos > s.x && xPos < s.x + s.width && yPos > s.y && yPos < s.y + s.height);
      return fit || inSignup;
    }

    if (positions.find(spacing) === undefined) {
      positions.push({ x, y});
      tag.style.left = `${x}%`;
      tag.style.top = `${y}%`;
      placed = true;
    }

    if(loopBreak++ > 5000) {
      console.log('loop break..')
      placed = true;
    }
  }
});


// telepresent creatures : )
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
const creatureEvent = {
  whale: '🌊',
  dolphin: '💦',
  fish: '<span class="airbubble"></span>',
  tropical_fish: '<span class="airbubble"></span>',
  duck: '💧',
  blowfish: '<span class="airbubble"></span>',
  shark: '🌊',
  octopus: '💧',
  turtle: '💧',
  shell: '<span class="airbubble"></span>',
  crab: '<span class="airbubble"></span>',
  squid: '💦',
  penguin: '🌊',
  shrimp: '<span class="airbubble"></span>'
};
const creatures = Object.keys(creatureIcons);
let nickname = window.localStorage.getItem('tidepool-nickname') || '';

let creature = creatures[Math.round(Math.random() * (creatures.length-1))];
const creatureSelect = document.querySelector('#creature-select');
creatures.forEach(c => creatureSelect.innerHTML += `<option value="${c}" ${ creature === c ? 'selected="true"' : ''}>${creatureIcons[c]} ${c}</option>`);

creatureSelect.addEventListener('click', (evt) => evt.stopPropagation());
creatureSelect.addEventListener('change', (evt) => {
  creature = evt.target.value;
});

const sendMouseAction = () => {
  if (!drawing) {
    return;
  }

  const data = { id: uid, creature: creature, evtIdx: evtIdx++, x: posX, y: posY }
  socket.emit('clickEvt', data);
  createEvent(data);
  setTimeout(() => fadeCreature(`#event-${data.id}-${data.evtIdx}`), (2 * 60) * 1000);
}

let mouseDown = false;
let lastEvt = 0;
let inOcean = false;
ocean.addEventListener('mouseout', (evt) => {
    inOcean = false;
    mouseDown = false;
});

let oceanBcr = ocean.getBoundingClientRect();
const recalBcr = function () {
  oceanBcr = ocean.getBoundingClientRect();
}
window.addEventListener('resize', function (){
  requestAnimationFrame(recalBcr);
});
window.addEventListener('scroll', function (){
  requestAnimationFrame(recalBcr);
});


ocean.addEventListener('mousemove', (evt) => {
  posX = evt.clientX / window.innerWidth * 100;
  posY = (evt.clientY - oceanBcr.top) / oceanBcr.height * 100;
  inOcean = true;

  if (mouseDown && socket && Date.now() - lastEvt > 150) {
    lastEvt = Date.now();
    sendMouseAction();
  }
});

ocean.addEventListener('click', (evt) => {
  if (socket) {
    sendMouseAction();
  }
});
ocean.addEventListener('mousedown', (evt) => {
  mouseDown = true;
});
ocean.addEventListener('mouseup', (evt) => {
  mouseDown = false;
});


document.querySelector('#nickname').addEventListener('input', evt => {
  nickname = evt.target.value;
  window.localStrage.setItem('tidepool-nickname', nickname);
});


const fadeCreature = (id) => {
  console.log('fading', id);
  const creature = document.querySelector(id);
  creature.classList.add('fade');
  creature.addEventListener('transitionend', () => {
    ocean.removeChild(creature);
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
      ocean.append(newCreature);

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

const createEvent = data => {
  let e = document.createElement('div');
  e.id = `event-${data.id}-${data.evtIdx}`;
  e.className = 'event';
  e.style.left = `${data.x}%`;
  e.style.top = `${data.y}%`;
  e.innerHTML = creatureEvent[data.creature];
  ocean.appendChild(e);
}

socket.on('connect', () => {
  console.log('connected...')
  let ts = Date.now();
  const tick = () => {
    if (Date.now() - ts > 16 && inOcean) {
      socket.emit('frame', { id: uid, nickname: nickname, creature: creature, x: posX, y: posY });
      ts = Date.now();
    }
    requestAnimationFrame(tick);
  };
  tick();
});

socket.on('pong', drawCreatures);

socket.on('activity', data => {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      createEvent(d);
      setTimeout(() => fadeCreature(`#event-${d.id}-${d.evtIdx}`), (d.lifespan * 1000) - (d.ts - d.created));
    });
  } else {
    createEvent(data);
    setTimeout(() => fadeCreature(`#event-${data.id}-${data.evtIdx}`), data.lifespan * 1000);
  }
});

// document.addEventListener('keyup', (evt) => {
//   if (evt.key === 'm' && evt.target.tagName !== "TEXTAREA") {
//     document.querySelector('#msg').classList.toggle('hidden');
//   }
// })
