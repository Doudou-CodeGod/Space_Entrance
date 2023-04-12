// boxButton.js

const boxButton = document.getElementById('boxButton');
const cube = document.querySelector('.cube');
let isMouseDown = false;
let startPosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };
let currentRotation = { x: -40, y:15, z: -5 };
const rotationStep = 90;

function updateBoxButtonPosition() {
  boxButton.style.top = `${currentPosition.y}px`;
  boxButton.style.left = `${currentPosition.x}px`;
  boxButton.style.transform = `translate(-50%, -50%)`;
  updateCubeRotation();
}

function updateCubeRotation() {
  const controller = document.getElementById('controller');
  const controllerBounds = controller.getBoundingClientRect();
  const left = (controllerBounds.left / window.innerWidth) * 100;
  const top = (controllerBounds.top / window.innerHeight) * 100;
  cube.style.transformOrigin = `${left}% ${top}%`;

  cube.style.transform = `rotateY(${currentRotation.y}deg) rotateX(${currentRotation.x}deg) rotateZ(${currentRotation.z}deg) scale(0.7)`;
}

function setInitialBoxButtonPosition() {
  const yOffset = 200;
  const xOffset = -500; // Change this value to adjust the vertical offset
  currentPosition = {
    x: window.innerWidth / 2+ xOffset, 
    y: window.innerHeight / 2 + yOffset,
  };
  updateBoxButtonPosition();
}

setInitialBoxButtonPosition();

boxButton.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  startPosition = { x: event.clientX, y: event.clientY };
  currentPosition = {
    x: parseFloat(boxButton.style.left) || 0,
    y: parseFloat(boxButton.style.top) || 0,
  };
  boxButton.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
  if (!isMouseDown) return;

  const deltaX = event.clientX - startPosition.x;
  const deltaY = event.clientY - startPosition.y;

  currentPosition.x += deltaX;
  currentPosition.y += deltaY;

  updateBoxButtonPosition();

  startPosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
  boxButton.style.cursor = 'grab';
});

document.addEventListener('mouseleave', () => {
  isMouseDown = false;
  boxButton.style.cursor = 'grab';
});

document.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 'arrowup':
      currentRotation.x -= rotationStep;
      break;
    case 'arrowleft':
      currentRotation.y -= rotationStep;
      break;
    case 'arrowdown':
      currentRotation.x += rotationStep;
      break;
    case 'arrowright':
      currentRotation.y += rotationStep;
      break;
    default:
      return;
  }
  updateCubeRotation();
});

