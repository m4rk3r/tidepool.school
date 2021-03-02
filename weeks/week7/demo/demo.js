// select our two blockquote elements
let quoteOne = document.querySelector('.quote-one');
let quoteTwo = document.querySelector('.quote-two');

let options = {
  rootMargin: '0px',
  threshold: 0.5 // how much of the item is viewable before animation is triggered (aka 50% viewable before animating)
};

// function to call when the element enters the browser screen
function animate(entries, observer) {
  for(let entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  }
}

// create an "observer" to watch our elements
let observer = new IntersectionObserver(animate, options);
// watch for our first blockquote
observer.observe(quoteOne);
// watch for our second blockquote
observer.observe(quoteTwo);
// can add more here etc
