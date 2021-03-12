const output = document.querySelector('.est-time');

output.innerText = moment().tz("America/New_York").format("h:mm:ss a");

setInterval(() => {
  output.innerText = moment().tz("America/New_York").format("h:mm:ss a");
}, 1000);


const trs = document.querySelectorAll('tr');

const start = moment('2021-03-12 09:05:00');
const meetingLength = 7;

trs.forEach((tr) => {
  const td = tr.querySelector('td:last-child');
  if (td) {
    td.innerText = start.format("h:mm a");
    start.add(meetingLength, 'minutes');
  }
})
