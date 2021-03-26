
document.addEventListener('keyup', (evt) => {
  let section;
  const sections = document.querySelectorAll('section');
  for (let sec of sections) {
    let rect = sec.getBoundingClientRect();
    if (rect.top < 0 && rect.bottom > 0) {
      section = sec;
      break;
    }
  }

  if (evt.keyCode === 65) { // a
    section.querySelector('iframe:first-of-type').style.width = '100%';
    section.querySelector('iframe:last-of-type').style.width = 0;
  } else if (evt.keyCode === 66) { // b
    section.querySelector('iframe:first-of-type').style.width = 0;
    section.querySelector('iframe:last-of-type').style.width = '100%';
  } else if (evt.keyCode === 82) {
    section.querySelector('iframe:first-of-type').style.width = '100%';
    section.querySelector('iframe:last-of-type').style.width = '100%';
  }
});


const visibilityCheck = () => {
  const sections = document.querySelectorAll('section');
  for (let sec of sections) {
    let rect = sec.getBoundingClientRect();
    if (rect.top < 0 && rect.bottom > 0) {
      const iframes = sec.querySelectorAll('iframe');
      for (let iframe of iframes) {
        if (iframe.src === window.location.href) {
          iframe.src = iframe.dataset.src;
        }
      }
    } else {
      const iframes = sec.querySelectorAll('iframe');
      for (let iframe of iframes) {
        if (iframe.src !== window.location.href) {
          iframe.src = "";
        }
      }
    }
  }
}

var check = Date.now();
document.addEventListener('scroll', () => {
  if (Date.now() - check > 2000) {
    check = Date.now();
    window.requestAnimationFrame(visibilityCheck);
  }
});

document.addEventListener('DOMContentLoaded', visibilityCheck);
