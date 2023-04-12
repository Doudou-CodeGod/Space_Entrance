// Create a variable to store the pressed keys
const keysPressed = {};

// Update the camera position based on pressed keys
function updateCameraPosition(camera) {
  const speed = 0.05; // Adjust the speed to your liking

  if (keysPressed['KeyW']) {
    camera.position.z -= speed;
  }
  if (keysPressed['KeyS']) {
    camera.position.z += speed;
  }
  if (keysPressed['KeyA']) {
    camera.position.x -= speed;
  }
  if (keysPressed['KeyD']) {
    camera.position.x += speed;
  }
}

// Animate the camera movement
function animateCamera(camera) {
  updateCameraPosition(camera);
  requestAnimationFrame(() => animateCamera(camera));
}

// Add event listeners to update the keysPressed object
document.addEventListener('keydown', (e) => {
  keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.code] = false;
});

export function initKeyboardControls(camera) {
  animateCamera(camera);
}
