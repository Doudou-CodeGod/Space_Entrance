import{V as l,n as m,U as f,S as v,A as c}from"./location-0716c822.js";import{P as h,F as g}from"./FocusShader-65b10d51.js";const d={defines:{KERNEL_SIZE_FLOAT:"25.0",KERNEL_SIZE_INT:"25"},uniforms:{tDiffuse:{value:null},uImageIncrement:{value:new l(.001953125,0)},cKernel:{value:[]}},vertexShader:`

		uniform vec2 uImageIncrement;

		varying vec2 vUv;

		void main() {

			vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float cKernel[ KERNEL_SIZE_INT ];

		uniform sampler2D tDiffuse;
		uniform vec2 uImageIncrement;

		varying vec2 vUv;

		void main() {

			vec2 imageCoord = vUv;
			vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

			for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {

				sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];
				imageCoord += uImageIncrement;

			}

			gl_FragColor = sum;

		}`,buildKernel:function(a){let t=2*Math.ceil(a*3)+1;t>25&&(t=25);const n=(t-1)*.5,i=new Array(t);let o=0;for(let r=0;r<t;++r)i[r]=S(r-n,a),o+=i[r];for(let r=0;r<t;++r)i[r]/=o;return i}};function S(a,e){return Math.exp(-(a*a)/(2*e*e))}class s extends h{constructor(e=1,t=25,n=4){super(),this.renderTargetX=new m,this.renderTargetX.texture.name="BloomPass.x",this.renderTargetY=new m,this.renderTargetY.texture.name="BloomPass.y",this.combineUniforms=f.clone(u.uniforms),this.combineUniforms.strength.value=e,this.materialCombine=new v({uniforms:this.combineUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:c,transparent:!0});const i=d;this.convolutionUniforms=f.clone(i.uniforms),this.convolutionUniforms.uImageIncrement.value=s.blurX,this.convolutionUniforms.cKernel.value=d.buildKernel(n),this.materialConvolution=new v({uniforms:this.convolutionUniforms,vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,defines:{KERNEL_SIZE_FLOAT:t.toFixed(1),KERNEL_SIZE_INT:t.toFixed(0)}}),this.needsSwap=!1,this.fsQuad=new g(null)}render(e,t,n,i,o){o&&e.state.buffers.stencil.setTest(!1),this.fsQuad.material=this.materialConvolution,this.convolutionUniforms.tDiffuse.value=n.texture,this.convolutionUniforms.uImageIncrement.value=s.blurX,e.setRenderTarget(this.renderTargetX),e.clear(),this.fsQuad.render(e),this.convolutionUniforms.tDiffuse.value=this.renderTargetX.texture,this.convolutionUniforms.uImageIncrement.value=s.blurY,e.setRenderTarget(this.renderTargetY),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialCombine,this.combineUniforms.tDiffuse.value=this.renderTargetY.texture,o&&e.state.buffers.stencil.setTest(!0),e.setRenderTarget(n),this.clear&&e.clear(),this.fsQuad.render(e)}setSize(e,t){this.renderTargetX.setSize(e,t),this.renderTargetY.setSize(e,t)}dispose(){this.renderTargetX.dispose(),this.renderTargetY.dispose(),this.materialCombine.dispose(),this.materialConvolution.dispose(),this.fsQuad.dispose()}}const u={uniforms:{tDiffuse:{value:null},strength:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float strength;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = strength * texel;

		}`};s.blurX=new l(.001953125,0);s.blurY=new l(0,.001953125);export{s as B};
//# sourceMappingURL=BloomPass-c72e2c83.js.map
