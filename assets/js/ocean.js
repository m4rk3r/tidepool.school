
const mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const isMobile = mobileCheck();

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
if (!isMobile) {
  if (window.location.hostname.includes('localhost')) {
   socket = io('http://localhost:4000', { transports: ['websocket']});
  } else {
    socket = io('https://tidepool.school', {
        path: '/ws',
        transports: ['websocket']
    });
  }
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

const storedCreature = window.localStorage.getItem('tidepool-creature');
let creature = storedCreature && creatures.includes(storedCreature) ? storedCreature : creatures[Math.round(Math.random() * (creatures.length-1))];
const creatureSelect = document.querySelector('#creature-select');
creatures.forEach(c => creatureSelect.innerHTML += `<option value="${c}" ${ creature === c ? 'selected="true"' : ''}>${creatureIcons[c]} ${c}</option>`);

creatureSelect.addEventListener('click', (evt) => evt.stopPropagation());
creatureSelect.addEventListener('change', (evt) => {
  creature = evt.target.value;
  window.localStorage.setItem('tidepool-creature', creature);
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

if (!isMobile) {
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
    window.localStorage.setItem('tidepool-nickname', nickname);
  });
}

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
