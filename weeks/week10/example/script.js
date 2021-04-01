const count = 6;
const leafColors = [
  'linear-gradient(150deg, rgb(90, 191, 97), rgb(133, 148, 71), rgb(198, 196, 27), rgb(233, 195, 31), rgb(255, 92, 0), rgb(179, 119, 30), rgb(121, 97, 62), rgb(129, 116, 99))',
  'linear-gradient(200deg, rgb(87, 186, 94), rgb(72, 142, 81), rgb(110, 143, 68), rgb(212, 223, 79), rgb(238, 96, 58), rgb(223, 172, 57), rgb(145, 126, 44), rgb(128, 118, 96))',
  'linear-gradient(230deg, rgb(147, 226, 138), rgb(96, 193, 85), rgb(139, 193, 85), rgb(191, 209, 47), rgb(255, 243, 79), rgb(231, 214, 67), rgb(199, 188, 98), rgb(176, 170, 126))',
  'linear-gradient(190deg, rgb(82, 166, 75), rgb(87, 140, 82), rgb(104, 140, 82), rgb(180, 191, 47), rgb(245, 152, 29), rgb(221, 159, 77), rgb(149, 113, 64), rgb(116, 104, 89))',
  'linear-gradient(145deg, rgb(71, 179, 98), rgb(78, 161, 96), rgb(103, 153, 114), rgb(140, 153, 103), rgb(199, 227, 64), rgb(235, 246, 22), rgb(98, 125, 105), rgb(93, 90, 74))',
  'linear-gradient(195deg, rgb(96, 186, 85), rgb(133, 207, 124), rgb(160, 207, 124), rgb(210, 213, 73), rgb(232, 75, 75), rgb(182, 80, 62), rgb(180, 155, 92), rgb(110, 100, 75))',
];
let mask = document.querySelector('.mask');

function scrollCheck() {
  // check for when we are at the bottom of the page
  if (window.scrollY >= document.body.scrollHeight - window.innerHeight) {
    window.scrollTo(0, 0);

    let anotherMask = Math.floor(Math.random() * leafColors.length);
    document.body.style.background = leafColors[anotherMask];
    mask.style.maskImage = `url('masks/leaf-0${anotherMask + 1}.svg')`;
    mask.style.webkitMaskImage = `url('masks/leaf-0${anotherMask + 1}.svg')`;
  }
}


let newMask = Math.floor(Math.random() * leafColors.length);
document.body.style.background = leafColors[newMask];
mask.style.maskImage = `url('masks/leaf-0${newMask + 1}.svg')`;
mask.style.webkitMaskImage = `url('masks/leaf-0${newMask + 1}.svg')`;

// add scroll event listener
document.addEventListener('scroll', scrollCheck);
