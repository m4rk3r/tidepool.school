// airtable base https://airtable.com/shrr7iCIfnpo44hZe

let poets = [];
let poetsElement = document.querySelector('#poets');

let Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzwwUOzmCKuXxbq'}).base('apphHPPnjo6UiTDiU');

base('Poets').select({view: "Grid view"}).eachPage(gotPageOfPoets, gotAllPoets);


function gotPageOfPoets(records, fetchNextPage) {

  poets.push(...records);

  // fetch any more pages if they exist
  fetchNextPage();
}

function gotAllPoets(err) {
  // report an error, you'd want to do something better than this in production
  if (err) {
    console.log("error loading fragments");
    return;
    console.error(err);
  }

  try {
    displayPoets();
  } catch (e) {
    console.log(e);
  }
}


function displayPoets() {
  poets.forEach(function (poet) {
    let li = document.createElement('li');
    li.innerText = `${poet.fields.Name} (${poet.fields.Date})`;
    li.dataset.name = poet.fields.Name;
    li.dataset.date = poet.fields.Date;
    poetsElement.append(li);
  });
}


function recentPoets() {
  let allPoets = poetsElement.querySelectorAll('li');
  allPoets.forEach(function (poet) {
    if (poet.dataset.date.startsWith('20')) {
      poet.style.display = 'list-item';
    } else {
      poet.style.display = 'none';
    }
  });
}

document.querySelector('#recent').addEventListener('click', recentPoets);


function sortAlpha() {
  // delete our ul items
  poetsElement.innerHTML = '';

  poets.sort(function (a, b) {
    let nameA = a.fields.Name;
    let nameB = b.fields.Name;

    let firstLastA = nameA.split(' ');
    let firstLastB = nameB.split(' ');

    let lastNameA = firstLastA[firstLastA.length - 1];
    let lastNameB = firstLastB[firstLastB.length - 1];

    if (lastNameA > lastNameB) {
      return 1;
    } else {
      return -1;
    }
  });

  displayPoets();
}

document.querySelector('#alpha').addEventListener('click', sortAlpha);


function search(event) {
  let allPoets = poetsElement.querySelectorAll('li');
  allPoets.forEach(function (poet) {
    if (poet.dataset.name.toLowerCase().includes(event.target.value.toLowerCase())) {
      poet.style.display = 'list-item';
    } else {
      poet.style.display = 'none';
    }
  });
}

document.querySelector('#search').addEventListener('keyup', search);


function showAll() {
  let allPoets = poetsElement.querySelectorAll('li');
  allPoets.forEach(function (poet) {
    poet.style.display = 'list-item';
  });
  document.querySelector('#search').value = '';
}

document.querySelector('#all').addEventListener('click', showAll);
