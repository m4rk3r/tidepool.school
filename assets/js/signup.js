
const signup = document.querySelector('#signup');
const form = signup.querySelector('form');
const list = signup.querySelector('ol');

function displayPeople(data) {
  list.innerHTML = '';
  data.people.forEach(function (person) {
    let classes = person.complete ? 'complete' : '';
    classes = person.current ? `current ${classes}` : classes;
    list.innerHTML += `<li class="${classes}">${ person.name }</li>`;
  });
}


form.addEventListener('submit', function (evt) {
  evt.preventDefault();
  const input = form.querySelector('input[name="name"]')

  fetch('/', {
    method: 'POST',
    body: JSON.stringify({
        name: input.value
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  }).then(function (res) {
    input.value = '';
    res.json().then(displayPeople);
  })
})

setInterval(function () {
  fetch('/api/queue').then(function (res) {
    res.json().then(displayPeople);
  });
}, 1000);
