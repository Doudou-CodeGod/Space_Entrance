import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader.js';
import { initKeyboardControls } from './keyboardCameraControl.js';

            let container;
            let camera, scene, renderer;
            let controls, water, sun, mesh;
            let model, landmodel;
            let composer, effectFocus;
            
            init();
            animate();

            function init() {

                container = document.getElementById( 'container' );

                //

                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                container.appendChild( renderer.domElement );

                //

                scene = new THREE.Scene();
                const loader = new GLTFLoader();

                loader.load('models/John_the_Baptist.gltf', function (gltf) {
                    gltf.scene.scale.set(0.5, 0.5, 0.5);
                    gltf.scene.position.set(0, -1.5, 0);
                    gltf.scene.rotation.y = Math.PI * 4.5;
                    gltf.scene.rotation.x = 0.08;
                    model = gltf.scene;
                    scene.add(model);
                }, undefined, function (error) {
                    console.error(error);
                });

                loader.load('models/land.gltf', function (gltf) {
                    gltf.scene.scale.set(0.5, 0.5, 0.5);
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.rotation.y = Math.PI * 4.5;
                    gltf.scene.rotation.x = 0.08;
                    landmodel = gltf.scene;
                    scene.add(landmodel);
                }, undefined, function (error) {
                    console.error(error);
                });
                             


                camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
                camera.position.set( 15, -200,0 );

                //

                sun = new THREE.Vector3();

                // Water

                const waterGeometry = new THREE.PlaneGeometry( 4000, 4000 );

                water = new Water(
                    waterGeometry,
                    {
                        textureWidth: 512,
                        textureHeight: 512,
                        waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                        } ),
                        sunDirection: new THREE.Vector3(),
                        sunColor: 0xffffff,
                        waterColor: 0x001e0f,
                        distortionScale: 8,
                        fog: scene.fog !== undefined
                    }
                );

                water.rotation.x = - Math.PI / 2;
                

                scene.add( water );

                // Skybox

                const sky = new Sky();
                sky.scale.setScalar( 10000 );
                scene.add( sky );

                const skyUniforms = sky.material.uniforms;

                skyUniforms[ 'turbidity' ].value = 10;
                skyUniforms[ 'rayleigh' ].value = 2;
                skyUniforms[ 'mieCoefficient' ].value = 0.005;
                skyUniforms[ 'mieDirectionalG' ].value = 0.8;

                const now = new Date();
                const currentTimeRatio = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
            
                const minAzimuth = -180;
                const maxAzimuth = 180;
                const currentAzimuth = minAzimuth + currentTimeRatio * (maxAzimuth - minAzimuth);
            
                const parameters = {
                    elevation: 2,
                    azimuth: currentAzimuth // Set the azimuth based on real-life time
                };

                const pmremGenerator = new THREE.PMREMGenerator( renderer );
                let renderTarget;

                function updateSun() {

                    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
                    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

                    sun.setFromSphericalCoords( 1, phi, theta );

                    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
                    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

                    if ( renderTarget !== undefined ) renderTarget.dispose();

                    renderTarget = pmremGenerator.fromScene( sky );

                    scene.environment = renderTarget.texture;

                }

                updateSun();

                //

                controls = new OrbitControls( camera, renderer.domElement );
                controls.maxPolarAngle = Math.PI * 0.495;
                controls.target.set( 0, 10, 0 );
                controls.minDistance = 30.0;
                controls.maxDistance = 100.0;
                controls.update();

                				// postprocessing

				const renderModel = new RenderPass( scene, camera );
				const effectBloom = new BloomPass( 0.75 );
				const effectFilm = new FilmPass( 0.5, 0.5, 1448, false );

				effectFocus = new ShaderPass( FocusShader );

				effectFocus.uniforms[ 'screenWidth' ].value = window.innerWidth * window.devicePixelRatio;
				effectFocus.uniforms[ 'screenHeight' ].value = window.innerHeight * window.devicePixelRatio;

				composer = new EffectComposer( renderer );

				composer.addPass( renderModel );
				composer.addPass( effectBloom );
				composer.addPass( effectFilm );
				composer.addPass( effectFocus );



                //

                window.addEventListener( 'resize', onWindowResize );

            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            function animate() {
                requestAnimationFrame(animate);
            
                if (model) {
                    const time = performance.now() * 0.002;
                    model.position.y = -1.5 + Math.sin(time) * 0.6;
                    model.position.x = Math.sin(time * 0.3) * 0.2;
                    model.rotation.y = Math.PI * 4.5 + Math.sin(time * 0.5) * 0.1;
                    model.rotation.x = 0.08 + Math.sin(time * 0.7) * 0.05;
                    model.rotation.z = Math.sin(time * 0.4) * 0.1;
                }
            
                render();
            }
            

            function render() {
                

                const time = performance.now() * 0.001;
                water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
                renderer.render( scene, camera );
                //composer.render();

            }

            initKeyboardControls(camera);
