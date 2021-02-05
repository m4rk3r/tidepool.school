const output = document.querySelector('.est-time');

output.innerText = moment().tz("America/New_York").format("h:mm:ss a");

setInterval(() => {
  output.innerText = moment().tz("America/New_York").format("h:mm:ss a");
}, 1000);


const trs = document.querySelectorAll('tr');

let h = 9;
let m = 30;

trs.forEach((tr) => {
  const td = tr.querySelector('td:last-child');
  if (td) {
    td.innerText = `${h}:${String(m).padStart(2, '0')}`;
    m += 5;
    if (m == 60) {
      h += 1;
      m = 0;
    }
  }
})
