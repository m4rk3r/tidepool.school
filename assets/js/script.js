
const pools = document.querySelector('#pools');
const scrollToOcean = document.querySelector('a[href="#ocean"]');
scrollToOcean.addEventListener('click', function (evt) {
  evt.preventDefault();

  document.querySelector('#ocean').scrollIntoView({ behavior: 'smooth' });
});

const stones = pools.querySelectorAll('.pool').length * 5;
const bcr = pools.getBoundingClientRect();

for (i = 0; i < stones; i++) {
  const s = document.createElement('object');
  s.type = "image/svg+xml";
  s.data = `/assets/img/stone${1 + Math.round(Math.random() * 13)}.svg`;
  s.className = 'stone';
  s.style.right = `${Math.random() * 95}%`;
  s.style.top = `${150 + Math.random() * (bcr.height - 200)}px`;
  s.style.transform = `rotateZ(${Math.random() * 360}deg)`;
  s.style.zIndex = 0;
  document.body.appendChild(s);
}

document.addEventListener('keydown', (evt) => {
  if (evt.altKey && evt.key === 'u') {
    const url = prompt('url?');
    const wrapper = document.querySelector('#playlist-wrapper');
    wrapper.querySelector('.urlbar').innerHTML = `🔊&nbsp;&nbsp;${url}`;
    wrapper.classList.add('show');
    wrapper.querySelector('iframe').src = url;
    console.log(url);
  }

  if (evt.altKey && evt.key === 'm') {
    const msg = prompt('msg?');
    const msgBox = document.querySelector('#msg');
    msgBox.innerHTML = msg;
    msgBox.classList.add('show');
  }
});
