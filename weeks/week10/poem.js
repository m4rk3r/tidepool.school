
let poemFragments = {
  'noun': ["a mountain","Leaf","a grandma","a field","a cup","a horse","an ocean","a walnut","a desert","a cat","a branch","a diaper","socks","a cupcake","a pillow","a coffee","cat","girl","a cherry"],
  'adjective': ["Tiring","rotund","hideous","breakable","sparkly","smooth","fluffy","fragile","delicious","lovely","hot","strange","smooth","ample","warm","colossal","rough","tiny","dark"],
  'verb': ["Overthinking","thinking of","bouncing on","sculpting","waiting for","wanting","napping","thinking","hoping for","wanting","dancing","sleeping","frustra","brightening","skipping","looking for","swimming","thinking of","making"],
  'emotion': ["sorrowful","Anxious","confused","yearning","angry","frustrated","melancholy","overwhelm","anxious","excited ","sleepy","triggered","excited","tired","joyful","disturbed","happy","delighted","upset"]
};

/*
let Airtable = require('airtable');

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
}*/


//
// const poem = document.querySelector('#poem');
// poem.addEventListener('mouseover', function (evt) {
//   let itemClass = evt.target.className;
//   if (['noun', 'verb', 'adjective', 'emotion'].includes(itemClass)) {
//     evt.target.innerText = parts[itemClass][Math.floor(Math.random() * parts[itemClass].length)];
//   }
// });


// run this anonymous function at 5 sec (5000 ms) intervals
setInterval(function () {
  // select all our spans
  let elements = document.querySelectorAll('#poem > span');
  // choose one at random
  let element = elements[Math.floor(Math.random() * elements.length)];

  // roughly the same code from our event listener after this...
  let itemClass = element.className;
  if (['noun', 'verb', 'adjective', 'emotion'].includes(itemClass)) {
    element.innerText = poemFragments[itemClass][Math.floor(Math.random() * poemFragments[itemClass].length)];
  }

  document.body.style.backgroundColor = 'hsl(' + Math.round(Math.random() * 360)+', 50%, 70%)';
}, 5000);
