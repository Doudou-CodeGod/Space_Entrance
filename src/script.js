import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { TextureLoader } from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const myTexture = new TextureLoader()

let camera, scene, renderer;

let cameraControls;
let groundMirror;
let composer;

let planeFrontMaterial2;
let planeFrontGlowMaterial2;
let gltfCube;


THREE.ColorManagement.enabled = true;



init();
initGUI(); // Add this line after the init() function call
addGLTFModel(50, 0, 0, 0, -Math.PI / 4, 0, 'models/Human LowPoly.gltf');
addGLTFModel(-50, 0, -80, 0, 0, 0, 'models/Human LowPoly.gltf');
addGLTFModel(-20, 0, -150, 0, Math.PI / 5, 0, 'models/Human LowPoly.gltf');
addGLTFCube(0, 30, 10, -Math.PI/6, Math.PI / 4, 0, 'models/cube logo.gltf');
window.addEventListener('resize', onWindowResize); // Add this line
animate();

//glt models
function addGLTFModel(x, y, z, rx, ry, rz, modelPath, scaleX = 0.5, scaleY = 0.5, scaleZ = 0.5) {
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
        gltf.scene.position.set(x, y, z);
        gltf.scene.rotation.set(rx, ry, rz);
        gltf.scene.scale.set(scaleX, scaleY, scaleZ);
        scene.add(gltf.scene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );
}


function addGLTFCube(x, y, z, rx, ry, rz, modelPath, scaleX = 0.5, scaleY = 0.5, scaleZ = 0.5) {
  const loader1 = new GLTFLoader();
  loader1.load(
    modelPath,
    (gltf) => {
        gltf.scene.position.set(x, y, z);
        gltf.scene.rotation.set(rx, ry, rz);
        gltf.scene.scale.set(scaleX, scaleY, scaleZ);
        scene.add(gltf.scene);


        gltfCube = gltf.scene; 
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );
}



  function createNoiseTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
  
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
  
    for (let i = 0; i < imgData.data.length; i += 4) {
      const gray = Math.floor(Math.random() * 255);
      imgData.data[i] = gray;
      imgData.data[i + 1] = gray;
      imgData.data[i + 2] = gray;
      imgData.data[i + 3] = 255;
    }
  
    ctx.putImageData(imgData, 0, 0);
  
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
  
    return texture;
  }

function createVideoTexture(videoElement) {
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    return videoTexture;
  }

function init() {
    const container = document.getElementById('container');

// renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
  
// scene
    scene = new THREE.Scene();
  
// camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
    camera.position.set(-10, 34, -340);
    camera.rotation.set(0,3,0);
  
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 50, 0);
    cameraControls.maxDistance = 1500;
    cameraControls.minDistance = 10;
    cameraControls.update();
  
// Initialize the composer variable
   composer = new EffectComposer(renderer);
   const renderPass = new RenderPass(scene, camera);
   composer.addPass(renderPass);



//

    const planeGeo = new THREE.PlaneGeometry( 200, 100 );
    const planeGeo2 = new THREE.PlaneGeometry( 2000, 2000 );

// reflectors/mirrors

    let geometry, material;

    const noiseTexture = createNoiseTexture(512, 512);
    const roughnessMap = noiseTexture;
    
    geometry = new THREE.PlaneGeometry(5000, 5000);

    
    groundMirror = new Reflector(geometry, {
      clipBias: 0.002,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x777777,
    });

    groundMirror.rotateX( - Math.PI / 2 );
    scene.add( groundMirror );


// walls


    const video = document.getElementById('myVideo');
    const videoTexture = createVideoTexture(video);
    video.play();
    
    const planeFrontMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const planeFrontGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    
    const planeFront = new THREE.Mesh(planeGeo, planeFrontMaterial);
    planeFront.position.z = 50;
    planeFront.position.y = 70;
    
    planeFront.rotateY(Math.PI);
    scene.add(planeFront);

    
    
    const planeFrontGlow = new THREE.Mesh(planeGeo, planeFrontGlowMaterial);
    planeFrontGlow.name = 'planeFrontGlow';
    planeFrontGlow.position.z = 50;
    planeFrontGlow.position.y = 70;
    planeFrontGlow.rotateY(Math.PI);
    scene.add(planeFrontGlow);
    
// new BG wall
    // Create new MeshPhysicalMaterial for planeFront2
    planeFrontMaterial2 = new THREE.MeshPhysicalMaterial({
      map: videoTexture,
      color: 0xffffff,
      emissive: 0x000000,
      roughness: 0.5,
      metalness: 0.5,
      //opacity: 0.06
    });

    // Create new MeshPhysicalMaterial for planeFrontGlow2
    planeFrontGlowMaterial2 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      roughness: 0.5,
      metalness: 0.5,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });

// Duplicate planeFront as planeFront2
const planeFront2 = new THREE.Mesh(planeGeo2, planeFrontMaterial2);
planeFront2.position.z = 60;
planeFront2.position.y = 70;
planeFront2.rotateY(Math.PI);
scene.add(planeFront2);

// Duplicate planeFrontGlow as planeFrontGlow2
//const planeFrontGlow2 = new THREE.Mesh(planeGeo2, planeFrontMaterial2);
//planeFrontGlow2.position.y = 0;
//planeFrontGlow2.rotateX( - Math.PI / 2 );

//scene.add(planeFrontGlow2);



 // lights
  const mainLight = new THREE.PointLight(0xe7e7e7, 50, 60);
  mainLight.position.y = 50;
  mainLight.position.z = -30;
  mainLight.name = 'mainLight';
  scene.add(mainLight);

  const subLight = new THREE.PointLight(0xe7e7e7, 1.8, 250);
  subLight.position.y = 60;
  subLight.name = 'subLight';
  scene.add(subLight);

//
    window.addEventListener( 'resize', onWindowResize );
  
}

//GUI
function initGUI() {
  const gui = new dat.GUI();

  // Camera position
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'x', -500, 500).name('Position X');
  cameraFolder.add(camera.position, 'y', -500, 500).name('Position Y');
  cameraFolder.add(camera.position, 'z', -500, 500).name('Position Z');

  // Camera rotation
  cameraFolder.add(camera.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
  cameraFolder.add(camera.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
  cameraFolder.add(camera.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z');

   // Add a new folder for Plane Front Glow properties
  const planeFrontGlowFolder = gui.addFolder('Plane Front Glow');
  const planeFrontGlow = scene.getObjectByName('planeFrontGlow');

  // Add GUI for Plane Front Glow color and opacity (power)
  planeFrontGlowFolder.addColor(planeFrontGlow.material, 'color').name('Color');
  planeFrontGlowFolder.add(planeFrontGlow.material, 'opacity', 0, 1).name('Power');

  // Light settings
  const lightFolder = gui.addFolder('Light');
  const mainLight = scene.getObjectByName('mainLight');
  lightFolder.addColor(mainLight, 'color').name('Color');
  lightFolder.add(mainLight.position, 'x', -100, 100).name('Position X');
  lightFolder.add(mainLight.position, 'y', -100, 100).name('Position Y');
  lightFolder.add(mainLight.position, 'z', -100, 100).name('Position Z');
  lightFolder.add(mainLight.rotation, 'x',-Math.PI, Math.PI).name('rotation X');
  lightFolder.add(mainLight.rotation, 'y', -Math.PI, Math.PI).name('rotation Y');
  lightFolder.add(mainLight.rotation, 'z', -Math.PI, Math.PI).name('rotation Z');

  const targetFolder = gui.addFolder('Target');
  targetFolder.add(cameraControls.target, 'x', -100, 100).name('Target X');
  targetFolder.add(cameraControls.target, 'y', -100, 100).name('Target Y');
  targetFolder.add(cameraControls.target, 'z', -100, 100).name('Target Z');

  gui.open();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    groundMirror.getRenderTarget().setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
    );

}

function animate() {
  requestAnimationFrame(animate);

  const timer = Date.now() * 0.01;

  if (gltfCube) {
    gltfCube.rotation.y -= 0.005; // Rotate the GLTFCube
  }
  // composer is now accessible here
  composer.render();
}