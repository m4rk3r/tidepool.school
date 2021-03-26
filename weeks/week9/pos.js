const students = [
  'Jaskirat',
  'Isabelle',
  'Rachel',
  'Danielle',
  'Grace',
  'Julia',
  'Agathe',
  'Sophia',
  'Celeste',
  'Maggie',
  'Elan',
  'Stella',
  'Kaitlyn',
  'Kat',
  'Jenni',
  'Dhriti',
  'Jewel',
  'Irem',
  'Mark'
];

String.prototype.hashCode = function() {
    var hash = 0, i = 0, len = this.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
    }
    return hash;
};

const bin = document.querySelector('#pos');
const codeEle = document.querySelector('code');
const fields = ['noun', 'emotion', 'verb', 'adjective'];
const fieldLabel = {
  noun: 'a noun like: a tree',
  verb: 'a verb like: dreaming of',
  emotion: 'an emotion like: content',
  adjective: 'an adjective like: oblong',
}


students.forEach((s) => {
  const person = document.createElement('div');
  person.innerText = s;
  bin.appendChild(person);

  fields.forEach((f) => {
    const input = document.createElement('input');
    input.placeholder = `${fieldLabel[f]}`;
    input.id = `${s.toLowerCase()}-${f}`;
    bin.appendChild(input);
  });
});

bin.addEventListener('keyup', (evt) => {
  if (evt.target.tagName.toLowerCase() === 'input') {
    socket.emit('poem-input', {
      key: evt.target.id,
      text: evt.target.value
    });
  }
});


var socket;
if (window.location.hostname.includes('localhost')) {
 socket = io('http://localhost:4000', { transports: ['websocket']});
} else {
  socket = io('https://tidepool.school', {
      path: '/ws',
      transports: ['websocket']
  });
}

socket.on('poem-output', function (data) {
  if (data.key) {
    document.querySelector(`#${data.key}`).value = data.text;
  }
});


let lastHash;
socket.on('code', function (code) {
  if (JSON.stringify(code).hashCode() != lastHash) {
    lastHash = JSON.stringify(code).hashCode();

    const codeTemplate = `
  let poemFragments = {
    'noun': ${JSON.stringify(code.noun || [])},
    'adjective': ${JSON.stringify(code.adjective || [])},
    'verb': ${JSON.stringify(code.verb || [])},
    'emotion': ${JSON.stringify(code.emotion || [])}
  };
    `;
      codeEle.innerText = codeTemplate;
  }
});

setInterval(function () {
  socket.emit('get-code');
}, 1500);
