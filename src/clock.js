// clock.js

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  hourHand.setAttribute("transform", `rotate(${hourAngle}, 50, 50)`);
  minuteHand.setAttribute("transform", `rotate(${minuteAngle}, 50, 50)`);
  secondHand.setAttribute("transform", `rotate(${secondAngle}, 50, 50)`);
}

setInterval(updateClock, 1000);