// our airtable collection
// https://airtable.com/shrop5UF4QrGtzdqy

let Airtable = require('airtable');
let produce = [];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let base = new Airtable({apiKey: 'keyzwwUOzmCKuXxbq'}).base('appeT8cFAvPrr5xfM');

base('Produce').select({}).eachPage(getPageOfProduce, gotAllProduce);

function getPageOfProduce(records, fetchNextPage) {
  console.log('got page of produce...');

  produce.push(...records);

  fetchNextPage();
}

function gotAllProduce(err) {
  if (err) {
    console.log("error loading produce");
    console.error(err);
    return;
  }

  try {
    displayProduce();
  } catch(e) {
    console.error(e);
  }
};


// elements of page
let tagElement = document.querySelector('#tags');
let monthElement = document.querySelector('#months');
let produceElement = document.querySelector('#produce');

// detal modal
let infoElement = document.querySelector('#info');
let infoDetails = document.querySelector('#details');
let closeInfoButton = document.querySelector('#close-info');


function filterByMonth(event) {

}

function filterByTag(event) {

}

function showInfo(event) {

}

function closeInfo() {

}

function displayProduce() {

}
