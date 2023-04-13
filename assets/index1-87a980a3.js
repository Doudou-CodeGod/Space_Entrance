import{c as te,j as n,k as F,F as ce,l as ue,m as O,P as oe,n as de,U as V,o as J,S as ne,p as Q,B as me,q as fe,W as ve,r as he,a as pe,b as ge,T as we,R as xe,s as ye,O as Se,i as Me,t as Y}from"./location-0716c822.js";import{G as Pe}from"./GLTFLoader-31769430.js";import{R as Ce,a as Ee,S as Re,b as be,E as ze}from"./FocusShader-65b10d51.js";import{B as _e}from"./BloomPass-c72e2c83.js";class De extends te{constructor(h,e={}){super(h),this.isWater=!0;const a=this,R=e.textureWidth!==void 0?e.textureWidth:512,N=e.textureHeight!==void 0?e.textureHeight:512,b=e.clipBias!==void 0?e.clipBias:0,K=e.alpha!==void 0?e.alpha:1,Z=e.time!==void 0?e.time:0,z=e.waterNormals!==void 0?e.waterNormals:null,k=e.sunDirection!==void 0?e.sunDirection:new n(.70707,.70707,0),g=new F(e.sunColor!==void 0?e.sunColor:16777215),I=new F(e.waterColor!==void 0?e.waterColor:8355711),_=e.eye!==void 0?e.eye:new n(0,0,0),G=e.distortionScale!==void 0?e.distortionScale:20,H=e.side!==void 0?e.side:ce,t=e.fog!==void 0?e.fog:!1,m=new ue,p=new n,w=new n,U=new n,S=new O,D=new n(0,0,-1),u=new Q,M=new n,T=new n,P=new Q,W=new O,i=new oe,q=new de(R,N),j={uniforms:V.merge([J.fog,J.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new O},sunColor:{value:new F(8355711)},sunDirection:{value:new n(.70707,.70707,0)},eye:{value:new n},waterColor:{value:new F(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <fog_fragment>
				}`},r=new ne({fragmentShader:j.fragmentShader,vertexShader:j.vertexShader,uniforms:V.clone(j.uniforms),lights:!0,side:H,fog:t});r.uniforms.mirrorSampler.value=q.texture,r.uniforms.textureMatrix.value=W,r.uniforms.alpha.value=K,r.uniforms.time.value=Z,r.uniforms.normalSampler.value=z,r.uniforms.sunColor.value=g,r.uniforms.waterColor.value=I,r.uniforms.sunDirection.value=k,r.uniforms.distortionScale.value=G,r.uniforms.eye.value=_,a.material=r,a.onBeforeRender=function(o,ae,x){if(w.setFromMatrixPosition(a.matrixWorld),U.setFromMatrixPosition(x.matrixWorld),S.extractRotation(a.matrixWorld),p.set(0,0,1),p.applyMatrix4(S),M.subVectors(w,U),M.dot(p)>0)return;M.reflect(p).negate(),M.add(w),S.extractRotation(x.matrixWorld),D.set(0,0,-1),D.applyMatrix4(S),D.add(U),T.subVectors(w,D),T.reflect(p).negate(),T.add(w),i.position.copy(M),i.up.set(0,1,0),i.up.applyMatrix4(S),i.up.reflect(p),i.lookAt(T),i.far=x.far,i.updateMatrixWorld(),i.projectionMatrix.copy(x.projectionMatrix),W.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),W.multiply(i.projectionMatrix),W.multiply(i.matrixWorldInverse),m.setFromNormalAndCoplanarPoint(p,w),m.applyMatrix4(i.matrixWorldInverse),u.set(m.normal.x,m.normal.y,m.normal.z,m.constant);const s=i.projectionMatrix;P.x=(Math.sign(u.x)+s.elements[8])/s.elements[0],P.y=(Math.sign(u.y)+s.elements[9])/s.elements[5],P.z=-1,P.w=(1+s.elements[10])/s.elements[14],u.multiplyScalar(2/u.dot(P)),s.elements[2]=u.x,s.elements[6]=u.y,s.elements[10]=u.z+1-b,s.elements[14]=u.w,_.setFromMatrixPosition(x.matrixWorld);const re=o.getRenderTarget(),se=o.xr.enabled,le=o.shadowMap.autoUpdate;a.visible=!1,o.xr.enabled=!1,o.shadowMap.autoUpdate=!1,o.setRenderTarget(q),o.state.buffers.depth.setMask(!0),o.autoClear===!1&&o.clear(),o.render(ae,i),a.visible=!0,o.xr.enabled=se,o.shadowMap.autoUpdate=le,o.setRenderTarget(re);const X=x.viewport;X!==void 0&&o.state.viewport(X)}}}class A extends te{constructor(){const h=A.SkyShader,e=new ne({name:"SkyShader",fragmentShader:h.fragmentShader,vertexShader:h.vertexShader,uniforms:V.clone(h.uniforms),side:me,depthWrite:!1});super(new fe(1,1,1),e),this.isSky=!0}}A.SkyShader={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new n},up:{value:new n(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPos );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <encodings_fragment>

		}`};let $,v,d,l,y,E,L,f,ee,C,B;Te();ie();function Te(){$=document.getElementById("container"),l=new ve,l.setPixelRatio(window.devicePixelRatio),l.setSize(window.innerWidth,window.innerHeight),l.toneMapping=he,$.appendChild(l.domElement),d=new pe;const c=new Pe;c.load("models/John_the_Baptist.gltf",function(t){t.scene.scale.set(.5,.5,.5),t.scene.position.set(0,-1.5,0),t.scene.rotation.y=Math.PI*4.5,t.scene.rotation.x=.08,f=t.scene,d.add(f)},void 0,function(t){console.error(t)}),c.load("models/land.gltf",function(t){t.scene.scale.set(.5,.5,.5),t.scene.position.set(0,0,0),t.scene.rotation.y=Math.PI*4.5,t.scene.rotation.x=.08,ee=t.scene,d.add(ee)},void 0,function(t){console.error(t)}),v=new oe(40,window.innerWidth/window.innerHeight,1,2e4),v.position.set(15,-200,0),L=new n;const h=new ge(4e3,4e3);E=new De(h,{textureWidth:512,textureHeight:512,waterNormals:new we().load("textures/waternormals.jpg",function(t){t.wrapS=t.wrapT=xe}),sunDirection:new n,sunColor:16777215,waterColor:7695,distortionScale:8,fog:d.fog!==void 0}),E.rotation.x=-Math.PI/2,d.add(E);const e=new A;e.scale.setScalar(1e4),d.add(e);const a=e.material.uniforms;a.turbidity.value=10,a.rayleigh.value=2,a.mieCoefficient.value=.005,a.mieDirectionalG.value=.8;const R=new Date,N=(R.getHours()*60+R.getMinutes())/(24*60),b=-180,z={elevation:2,azimuth:b+N*(180-b)},k=new ye(l);let g;function I(){const t=Y.degToRad(90-z.elevation),m=Y.degToRad(z.azimuth);L.setFromSphericalCoords(1,t,m),e.material.uniforms.sunPosition.value.copy(L),E.material.uniforms.sunDirection.value.copy(L).normalize(),g!==void 0&&g.dispose(),g=k.fromScene(e),d.environment=g.texture}I(),y=new Se(v,l.domElement),y.maxPolarAngle=Math.PI*.495,y.target.set(0,10,0),y.minDistance=30,y.maxDistance=100,y.update();const _=new Ce(d,v),G=new _e(.75),H=new Ee(.5,.5,1448,!1);B=new Re(be),B.uniforms.screenWidth.value=window.innerWidth*window.devicePixelRatio,B.uniforms.screenHeight.value=window.innerHeight*window.devicePixelRatio,C=new ze(l),C.addPass(_),C.addPass(G),C.addPass(H),C.addPass(B),window.addEventListener("resize",We)}function We(){v.aspect=window.innerWidth/window.innerHeight,v.updateProjectionMatrix(),l.setSize(window.innerWidth,window.innerHeight)}function ie(){if(requestAnimationFrame(ie),f){const c=performance.now()*.002;f.position.y=-1.5+Math.sin(c)*.6,f.position.x=Math.sin(c*.3)*.2,f.rotation.y=Math.PI*4.5+Math.sin(c*.5)*.1,f.rotation.x=.08+Math.sin(c*.7)*.05,f.rotation.z=Math.sin(c*.4)*.1}Fe()}function Fe(){performance.now()*.001,E.material.uniforms.time.value+=1/60,l.render(d,v)}Me(v);
//# sourceMappingURL=index1-87a980a3.js.map
