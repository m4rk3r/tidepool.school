const list = document.querySelector('ol');

function updateList(people) {
  list.innerHTML = '';
  people.forEach(function (person) {
    const removeBtn = `<button data-action="remove" data-id="${person.id}" type="button">Remove</button>`;
    const btn = `
      <button data-id="${person.id}" type="button" data-action="current">Mark Current</button> /
      <button data-action="complete" data-id="${person.id}" type="button">Mark Complete</button> /
      ${removeBtn}`;
    let classes = person.complete ? 'complete' : '';
    classes = person.current ? `current ${classes}` : classes;
    list.innerHTML += `<li class="${classes}">${ person.name } ${!person.complete ? btn : removeBtn }</li>`;
  });
}

function markComplete(evt) {
  if (evt.target.tagName === 'BUTTON') {
    let data = new URLSearchParams();
    data.append('id', evt.target.dataset.id);
    fetch(`/${evt.target.dataset.action}`, {
      method: 'post',
      body: data
    }).then(res => {
      res.json().then(data => {
        updateList(data.people);
      });
    });
  }
}

setInterval(function () {
  fetch('/api/queue').then(res =>
    res.json().then(data => updateList(data.people))
  );
}, 1000);

list.addEventListener('click', markComplete);

var socket;
if (window.location.hostname.includes('localhost')) {
 socket = io('http://localhost:4000', { transports: ['websocket']});
} else {
  socket = io('https://tidepool.school', {
      path: '/ws',
      transports: ['websocket']
  });
}

socket.on('connect', () => {
  console.log('connected...')

});

const textarea = document.querySelector('textarea');
textarea.addEventListener('keyup', function () {
  socket.emit('typing', {text: textarea.value});
});
