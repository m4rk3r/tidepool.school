
let poemFragments = {
  noun: [],
  verb: [],
  adjective: [],
  emotion: [],
};

let Airtable = require('airtable');
// https://gist.github.com/m4rk3r/39a07cf6fb87a5b0a5ed60387c3f60ef
var base = new Airtable({apiKey: 'keyzwwUOzmCKuXxbq'}).base('appIQorANZvYFOqnN');

base('Poem fragments').select({}).eachPage(gotPageOfFragments, gotAllFragments);

function gotPageOfFragments(records, fetchNextPage) {
  console.log('gotPageOfFragments')

  records.forEach(function(record) {
    poemFragments.noun.push(record.fields.noun);
    poemFragments.verb.push(record.fields.verb);
    poemFragments.adjective.push(record.fields.adjective);
    poemFragments.emotion.push(record.fields.emotion);
  });

  fetchNextPage();
}

function gotAllFragments(err) {

  // report an error, you'd want to do something better than this in production
  if (err) {
    console.log("error loading books");
    console.error(err);
    return;
  }
}


//
// const poem = document.querySelector('#poem');
// poem.addEventListener('mouseover', function (evt) {
//   let itemClass = evt.target.className;
//   if (['noun', 'verb', 'adjective', 'emotion'].includes(itemClass)) {
//     evt.target.innerText = parts[itemClass][Math.floor(Math.random() * parts[itemClass].length)];
//   }
// });
//


setInterval(function () {
  let elements = document.querySelectorAll('#poem > span');
  let element = elements[Math.floor(Math.random() * elements.length)];
  let itemClass = element.className;
  if (['noun', 'verb', 'adjective', 'emotion'].includes(itemClass)) {
    element.innerText = poemFragments[itemClass][Math.floor(Math.random() * poemFragments[itemClass].length)];
  }

  document.body.style.backgroundColor = 'hsl(' + Math.round(Math.random() * 360)+', 50%, 70%)';
}, 5000);
