
let Airtable = require('airtable');


let base = new Airtable({apiKey: 'keyzwwUOzmCKuXxbq'}).base('appeT8cFAvPrr5xfM');

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let produce = [];

function displayProduce() {
  let currMonth = new Date().getMonth();

  document.querySelector('.month').innerText = months[currMonth];

  produce.forEach(function (item) {
    if (item['Field Availability']) {
      let availRange = item['Field Availability'].split(' - ');
      let start = availRange[0];
      let end = availRange[1];

      if (currMonth >= months.indexOf(start) && currMonth <= months.indexOf(end)) {
        const produceItem = document.createElement('div');
        produceItem.innerHTML = '<img src="'+item.Pictures[0].url+'">';
        document.body.appendChild(produceItem);
      }

    }
  });
}


base('Produce').select({
    view: 'All'
}).firstPage(function(err, records) {
  if (err) {
    console.error(err);
    return;
  }

  records.forEach(function(record) {
      produce.push(record.fields);
  });

  try {
    displayProduce();
  } catch(e) {
    console.log(e);
  }
});
