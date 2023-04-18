import{V as z,P as V,U as X,S as j,F as A,T as Q,W as Z,a as O,b as N,O as _,E as G,R as C,c as k,d as q,e as K,f as I,M as W,A as b,g as S,h as H,i as D,j as J,C as $,k as ee,l as te,m as ne,L as U,n as oe}from"./location-29467292.js";import{R as ae}from"./Reflector-3035bc40.js";import{G as Y}from"./GLTFLoader-35a30342.js";const ie={uniforms:{tDiffuse:{value:null},tSize:{value:new z(256,256)},center:{value:new z(.5,.5)},angle:{value:1.57},scale:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {

			vec4 color = texture2D( tDiffuse, vUv );

			float average = ( color.r + color.g + color.b ) / 3.0;

			gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );

		}`};class re extends V{constructor(e,a,i){super();const t=ie;this.uniforms=X.clone(t.uniforms),e!==void 0&&this.uniforms.center.value.copy(e),a!==void 0&&(this.uniforms.angle.value=a),i!==void 0&&(this.uniforms.scale.value=i),this.material=new j({uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new A(this.material)}render(e,a,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.tSize.value.set(i.width,i.height),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}new Q;let d,l,w,u,M,m,g,E,R;$.enabled=!0;ce();me();T(50,0,0,0,-Math.PI/4,0,"models/Human LowPoly.gltf");T(-50,0,-80,0,0,0,"models/Human LowPoly.gltf");T(-20,0,-150,0,Math.PI/5,0,"models/Human LowPoly.gltf");se(0,30,10,-Math.PI/6,Math.PI/4,0,"models/cube logo.gltf");window.addEventListener("resize",L);B();function T(r,e,a,i,t,o,s,c=.5,h=.5,f=.5){new Y().load(s,n=>{n.scene.position.set(r,e,a),n.scene.rotation.set(i,t,o),n.scene.scale.set(c,h,f),l.add(n.scene)},n=>{console.log(n.loaded/n.total*100+"% loaded")},n=>{console.error("An error occurred while loading the GLTF model:",n)})}function se(r,e,a,i,t,o,s,c=.5,h=.5,f=.5){new Y().load(s,n=>{n.scene.position.set(r,e,a),n.scene.rotation.set(i,t,o),n.scene.scale.set(c,h,f),l.add(n.scene),R=n.scene},n=>{console.log(n.loaded/n.total*100+"% loaded")},n=>{console.error("An error occurred while loading the GLTF model:",n)})}function de(r,e){const a=document.createElement("canvas");a.width=r,a.height=e;const i=a.getContext("2d"),t=i.createImageData(r,e);for(let s=0;s<t.data.length;s+=4){const c=Math.floor(Math.random()*255);t.data[s]=c,t.data[s+1]=c,t.data[s+2]=c,t.data[s+3]=255}i.putImageData(t,0,0);const o=new ee(a);return o.wrapS=o.wrapT=te,o.repeat.set(50,50),o}function le(r){const e=new ne(r);return e.minFilter=U,e.magFilter=U,e.format=oe,e}function ce(){const r=document.getElementById("container");w=new Z({antialias:!0}),w.setPixelRatio(window.devicePixelRatio),w.setSize(window.innerWidth,window.innerHeight),r.appendChild(w.domElement),l=new O,d=new N(45,window.innerWidth/window.innerHeight,1,5e4),d.position.set(-10,34,-340),d.rotation.set(0,3,0),u=new _(d,w.domElement),u.target.set(0,50,0),u.maxDistance=1500,u.minDistance=10,u.update(),m=new G(w);const e=new C(l,d);m.addPass(e);const a=new re;m.addPass(a);const i=new C(l,d),t=new k(.5,.5,10,!1);g=new q(K),g.uniforms.screenWidth.value=window.innerWidth*window.devicePixelRatio,g.uniforms.screenHeight.value=window.innerHeight*window.devicePixelRatio,m=new G(w),m.addPass(i),m.addPass(t),m.addPass(g);const o=new I(200,100),s=new I(2e3,2e3);let c;de(512,512),c=new I(5e3,5e3),M=new ae(c,{clipBias:.002,textureWidth:window.innerWidth*window.devicePixelRatio,textureHeight:window.innerHeight*window.devicePixelRatio,color:7829367}),M.rotateX(-Math.PI/2),l.add(M);const h=document.getElementById("myVideo"),f=le(h);h.play();const F=new W({map:f}),n=new W({color:16777215,transparent:!0,opacity:.3,blending:b}),v=new S(o,F);v.position.z=50,v.position.y=70,v.rotateY(Math.PI),l.add(v);const p=new S(o,n);p.name="planeFrontGlow",p.position.z=50,p.position.y=70,p.rotateY(Math.PI),l.add(p),E=new H({map:f,color:16777215,emissive:0,roughness:.5,metalness:.5}),new H({color:16777215,emissive:16777215,roughness:.5,metalness:.5,transparent:!0,opacity:.06,blending:b});const P=new S(s,E);P.position.z=60,P.position.y=70,P.rotateY(Math.PI),l.add(P);const x=new D(15198183,50,60);x.position.y=50,x.position.z=-30,x.name="mainLight",l.add(x);const y=new D(15198183,1.8,250);y.position.y=60,y.name="subLight",l.add(y),window.addEventListener("resize",L),L()}function me(){const r=new dat.GUI,e=r.addFolder("Camera");e.add(d.position,"x",-500,500).name("Position X"),e.add(d.position,"y",-500,500).name("Position Y"),e.add(d.position,"z",-500,500).name("Position Z"),e.add(d.rotation,"x",-Math.PI,Math.PI).name("Rotation X"),e.add(d.rotation,"y",-Math.PI,Math.PI).name("Rotation Y"),e.add(d.rotation,"z",-Math.PI,Math.PI).name("Rotation Z");const a=r.addFolder("Plane Front Glow"),i=l.getObjectByName("planeFrontGlow");a.addColor(i.material,"color").name("Color"),a.add(i.material,"opacity",0,1).name("Power");const t=r.addFolder("Light"),o=l.getObjectByName("mainLight");t.addColor(o,"color").name("Color"),t.add(o.position,"x",-100,100).name("Position X"),t.add(o.position,"y",-100,100).name("Position Y"),t.add(o.position,"z",-100,100).name("Position Z"),t.add(o.rotation,"x",-Math.PI,Math.PI).name("rotation X"),t.add(o.rotation,"y",-Math.PI,Math.PI).name("rotation Y"),t.add(o.rotation,"z",-Math.PI,Math.PI).name("rotation Z");const s=r.addFolder("Target");s.add(u.target,"x",-100,100).name("Target X"),s.add(u.target,"y",-100,100).name("Target Y"),s.add(u.target,"z",-100,100).name("Target Z"),r.hide()}function L(){d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight),M.getRenderTarget().setSize(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio),m.setSize(window.innerWidth,window.innerHeight),g.uniforms.screenWidth.value=window.innerWidth*window.devicePixelRatio,g.uniforms.screenHeight.value=window.innerHeight*window.devicePixelRatio}J(d);function B(){requestAnimationFrame(B),R&&(R.rotation.y-=.005),m.render()}
//# sourceMappingURL=main-c54fab9f.js.map
