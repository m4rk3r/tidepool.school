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
  let month = months.indexOf(event.target.dataset.month);
  let allImages = document.querySelectorAll('.produce');

  allImages.forEach(function (item) {
    let availRange = item.dataset.available.split(' - ');
    let start = availRange[0];
    let end = availRange[1];

    if (month >= months.indexOf(start) && month <= months.indexOf(end)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function filterByTag(event) {
  let allImages = document.querySelectorAll('.produce');
  allImages.forEach(function (img) {
    if (img.classList.contains(event.target.dataset.type)) {
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }
  });
}

function showInfo(event) {
  if (event.target.classList.contains('produce')) {
    let produceItem = produce.find(function (item) {
      if (item.fields.Name == event.target.dataset.name) {
        return true;
      }
    });

    infoDetails.innerHTML = `
      <h1>${produceItem.fields.Name}</h1>
      <h4>Available: ${produceItem.fields.Availability}</h4>
      <h4>Origin: ${produceItem.fields.Origin.join(', ')}</h4>
    `;

    infoElement.classList.add('show');
  }
}

function closeInfo() {
  infoElement.classList.remove('show');
}

function displayProduce() {
  let ourTags = []; // pass 2

  months.forEach(function (item, i) {
    let month = document.createElement('button');
    month.innerText = item;
    month.dataset.month = item;
    if (i == new Date().getMonth()) {
      month.classList.add('current');
    }
    month.addEventListener('click', filterByMonth);
    monthElement.append(month);
  });

  produce.forEach(function (item) {
    /* first add tags w/o dupe checking */
    // add tags
    item.fields.Tags.forEach(function (tagItem) {
      if (!ourTags.includes(tagItem)) {
        let tag = document.createElement('button');
        tag.innerText = tagItem;
        tag.dataset.type = tagItem;
        tag.addEventListener('click', filterByTag);
        tagElement.append(tag);
        ourTags.push(tagItem);
      }
    });

    // plot images
    item.fields.Pictures.forEach(function (picture) {
      let img = document.createElement('img');
      img.src = picture.thumbnails.large.url;

      img.style.left = `calc(${Math.random()} * (100% - 75px))`;
      img.style.top = `calc(${Math.random()} * (100% - 75px))`;

      // add unifying class
      img.classList.add('produce');

      // add tags as classes
      item.fields.Tags.forEach(function (tagItem) {
        img.classList.add(tagItem);
      });

      // associate Availability
      img.dataset.available = item.fields.Availability;

      // associate name
      img.dataset.name = item.fields.Name;

      produceElement.append(img);
    });
  });
}

produceElement.addEventListener('click', showInfo);
closeInfoButton.addEventListener('click', closeInfo);
