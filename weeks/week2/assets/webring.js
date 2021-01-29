const emails = [
  "zhank356@newschool.edu",
  "marrs331@newschool.edu",
  "mae268@newschool.edu",
  "xing801@newschool.edu",
  "bohac717@newschool.edu",
  "angj428@newschool.edu",
  "renoa112@newschool.edu",
  "bergd838@newschool.edu",
  "panjj122@newschool.edu",
  "kapli712@newschool.edu",
  "huans764@newschool.edu",
  "xuk543@newschool.edu",
  "goyad512@newschool.edu",
  "hercj191@newschool.edu",
  "tani347@newschool.edu",
  "gibsm545@newschool.edu",
  "parky030@newschool.edu",
  "baekj792@newschool.edu"
];
const order = [
  'zhank356@newschool.edu',
  'kapli712@newschool.edu',
  'parky030@newschool.edu',
  'renoa112@newschool.edu',
  'xing801@newschool.edu',
  'panjj122@newschool.edu',
  'angj428@newschool.edu',
  'hercj191@newschool.edu',
  'marrs331@newschool.edu',
  'gibsm545@newschool.edu',
  'baekj792@newschool.edu',
  'bohac717@newschool.edu',
  'goyad512@newschool.edu',
  'mae268@newschool.edu',
  'tani347@newschool.edu',
  'bergd838@newschool.edu',
  'huans764@newschool.edu',
  'xuk543@newschool.edu'
];

const coords = {};
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const theta = Math.PI * 2 / emails.length;
const w = 800;
let angle = 0;
const ring = document.querySelector('#web-ring-map');
for (i = 0; i < emails.length; i++) {
  const x = (w*0.5) + (w*0.5) * Math.cos(angle);
  const y = (w*0.5) + (w*0.5) * Math.sin(angle);

  const ang = Math.atan2(y - w*0.5, x - w*0.5) * (180/Math.PI);

  const u = document.createElement('a');
  u.href = `mailto:${emails[i]}`;
  u.innerText = emails[i];
  u.className = 'student';
  ring.appendChild(u);

  coords[emails[i]] = {'x': x, 'y': y};

  requestAnimationFrame(() => {
    const bcr = u.getBoundingClientRect();
    u.style.transform = `translate(${x - bcr.width*0.5}px, ${y - bcr.height * 0.5}px) `;//rotateZ(${ang}deg)
  })

  const l = document.createElement('div');
  l.className = 'line';
  l.style.background = `hsl(${ang*2}deg, 40%, 80%)`;
  l.style.transform = `rotateZ(${ang}deg)`;
  //ring.appendChild(l);

  angle += theta;
}

for(i = 0; i < order.length; i++){
  const from = coords[order[i]];
  const to = coords[order[(i + 1) % order.length]];

  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineWidth = 1;
  ctx.strokeStyle = `hsl(${(360/order.length) * i}deg, 50%, 70%)`;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  const ah = 10;
  const angle = Math.atan2(to.y-from.y, to.x-from.x);
  const pt = { x: (from.x + to.x) * 0.5, y: (from.y + to.y) * 0.5};
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.5;
  ctx.moveTo(pt.x, pt.y);
  ctx.lineTo(pt.x - ah * Math.cos(angle - Math.PI / 6), pt.y - ah * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(pt.x, pt.y);
  ctx.lineTo(pt.x - ah * Math.cos(angle + Math.PI / 6), pt.y - ah * Math.sin(angle + Math.PI / 6));
  ctx.stroke();

  // ctx.beginPath();
  // ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2, true);
  // ctx.stroke();
  // console.log(from, to)

}
