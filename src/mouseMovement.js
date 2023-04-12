// mouseMovement.js

const intro = document.querySelector(".intro");
const floatingButton = document.getElementById("floatingButton");
const soundButton = document.getElementById("soundButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const leftArrow = document.querySelector("img[src='img/left.png']");
const rightArrow = document.querySelector("img[src='img/right.png']");

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const deltaX = (mouseX - centerX) / centerX;
  const deltaY = (mouseY - centerY) / centerY;

  const rotationY = deltaX * 30; // Adjust the multiplier for more or less rotation
  const rotationX = deltaY * -30; // Adjust the multiplier for more or less rotation

  floatingButton.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
  soundButton.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`; // Apply the same effect to the sound button
});

floatingButton.addEventListener("click", () => {
  if (intro.classList.contains("visible")) {
    intro.classList.remove("visible");
  } else {
    intro.classList.add("visible");
  }
});

soundButton.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});

function invertColor(event) {
  const targetElement = event.target;
  targetElement.classList.add('invert');
  setTimeout(() => {
    targetElement.classList.remove('invert');
  }, 100);
}

const sides = document.querySelectorAll('.sideA, .sideB, .sideC');
sides.forEach(side => {
  side.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains("sideA") || event.target.classList.contains("sideB") || event.target.classList.contains("sideC")) {
      invertColor(event);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const leftSide = document.querySelector('.sideC.left');
  const rightSide = document.querySelector('.sideC.right');

  switch (window.location.pathname) {
    case '/index0.html':
      leftSide.addEventListener('click', () => { window.location.href = 'index1.html'; });
      rightSide.addEventListener('click', () => { window.location.href = 'index2.html'; });
      break;
    case '/index1.html':
      leftSide.addEventListener('click', () => { window.location.href = 'index3.html'; });
      rightSide.addEventListener('click', () => { window.location.href = 'index.html'; });
      break;
    case '/index2.html':
      leftSide.addEventListener('click', () => { window.location.href = 'index1.html'; });
      rightSide.addEventListener('click', () => { window.location.href = 'index3.html'; });
      break;
    case '/index3.html':
      leftSide.addEventListener('click', () => { window.location.href = 'index2.html'; });
      rightSide.addEventListener('click', () => { window.location.href = 'index.html'; });
      break;
    default:
      // Default behavior
      leftSide.addEventListener('click', () => { window.location.href = 'index1.html'; });
      rightSide.addEventListener('click', () => { window.location.href = 'index2.html'; });
      break;
  }
});

