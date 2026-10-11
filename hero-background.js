/* Quille Designs hero background. Beams and Dot Grid from React Bits (https://reactbits.dev) by David Haz. MIT + Commons Clause License, Copyright (c) 2026 David Haz. Used as part of this website only. */
var QuilleHeroBackground=(()=>{var at=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var St=Object.getOwnPropertyNames;var zt=Object.prototype.hasOwnProperty;var Lt=(n,i)=>{for(var d in i)at(n,d,{get:i[d],enumerable:!0})},_t=(n,i,d,s)=>{if(i&&typeof i=="object"||typeof i=="function")for(let u of St(i))!zt.call(n,u)&&u!==d&&at(n,u,{get:()=>i[u],enumerable:!(s=Tt(i,u))||s.enumerable});return n};var It=n=>_t(at({},"__esModule",{value:!0}),n);var qt={};Lt(qt,{BEAMS:()=>Rt,DOTS:()=>At,mount:()=>Et});var it=[],H=n=>({current:n}),re=n=>{it.push(n)},Ke="fragment";function ue(n,i,...d){if(i=i||{},typeof n=="function")return n({...i,children:d});let s=n===Ke?document.createDocumentFragment():document.createElement(n);for(let[u,P]of Object.entries(i))P==null||P===!1||u==="children"||(u==="ref"?P.current=s:u==="className"?s.className=P:u==="style"&&typeof P=="object"?Object.assign(s.style,P):u.startsWith("on")||s.setAttribute(u,P===!0?"":P));for(let u of d.flat(1/0))u==null||u===!1||u===!0||s.append(u instanceof Node?u:String(u));return s}function De(n,i,d){it=[];let s=n(i);d.append(s);let u=it.splice(0).map(P=>P()).filter(P=>typeof P=="function");return()=>{u.forEach(P=>P()),s.remove()}}var Ct=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Dt=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform vec2 uTurn;
uniform float uTime;
uniform float uWidth;
uniform float uWave;
uniform float uDepth;
uniform float uRough;
uniform float uSeed;
uniform float uTwist;
uniform vec3 uLight;
uniform float uFill;
uniform float uCamera;
uniform vec4 uPointer;
out vec4 outColor;

const float PI = 3.141592653589793;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float laneHash(float lane) {
  return fract(sin(lane * 91.3458 + uSeed * 17.17) * 47453.5453);
}

float lobe(float nh, float nl, float nv, float vh, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = nh * nh * (a2 - 1.0) + 1.0;
  float distribution = a2 / (PI * d * d);
  float gv = nl * sqrt(nv * nv * (1.0 - a2) + a2);
  float gl = nv * sqrt(nl * nl * (1.0 - a2) + a2);
  float visibility = 0.5 / max(gv + gl, 0.0001);
  float fresnel = 0.028 + 0.972 * pow(1.0 - vh, 5.0);
  return distribution * visibility * fresnel * nl;
}

vec2 glint(float lane, vec2 local) {
  float along = local.y / uWave - laneHash(lane) * 60.0;
  float step = 0.01;
  float slope = (cnoise(vec3(0.0, along + step, uTime)) - cnoise(vec3(0.0, along - step, uTime))) / (2.0 * step);
  slope *= 0.2 * uDepth;
  float spin = laneHash(lane + 0.37);
  float tilt = ((spin - 0.5) * 0.5 + sin(uTime * 2.1 + spin * 6.2831) * 0.06) * uTwist;
  vec3 normal = normalize(vec3(tilt, -slope, 1.0));
  vec3 view = normalize(vec3(-local, uCamera));
  float nv = max(dot(normal, view), 0.0001);
  vec3 light = normalize(uLight);
  vec3 halfway = normalize(light + view);
  float core = lobe(max(dot(normal, halfway), 0.0), max(dot(normal, light), 0.0), nv, max(dot(view, halfway), 0.0), uRough);
  vec3 fill = normalize(vec3(0.0, -uLight.y * 1.25, uLight.z));
  vec3 fillHalf = normalize(fill + view);
  core += uFill * lobe(max(dot(normal, fillHalf), 0.0), max(dot(normal, fill), 0.0), nv, max(dot(view, fillHalf), 0.0), uRough);
  return vec2(core, core);
}

void main() {
  vec2 css = gl_FragCoord.xy * uScale;
  vec2 centered = css - uView * 0.5;
  vec2 local = mat2(uTurn.x, -uTurn.y, uTurn.y, uTurn.x) * centered;

  float across = local.x / uWidth + 0.5;
  float lane = floor(across);
  float u = across - lane;
  vec2 value = glint(lane, local);

  float pixel = max(uScale.x, uScale.y);
  float seam = min(u, 1.0 - u) * uWidth;
  if (seam < pixel * 1.5) {
    float other = u < 0.5 ? lane - 1.0 : lane + 1.0;
    float blend = 0.5 * (1.0 - smoothstep(0.0, pixel * 1.5, seam));
    value = mix(value, glint(other, local), blend);
  }

  vec2 toPointer = css - uPointer.xy;
  float near = exp(-dot(toPointer, toPointer) / (2.0 * uPointer.w * uPointer.w)) * uPointer.z;
  value *= 1.0 + near * 0.8;
  float hot = max(value.y - 0.18, 0.0);
  outColor = vec4(value.x, value.y, min(hot, 6.0), 1.0);
}`,Bt=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uGain;
uniform float uGlow;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uLightMode;
out vec4 outColor;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float grainNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 acesFilmic(vec3 color) {
  const mat3 inputMatrix = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outputMatrix = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color = inputMatrix * (color / 0.6);
  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  color = outputMatrix * (a / b);
  return clamp(color, 0.0, 1.0);
}

vec3 toSrgb(vec3 color) {
  return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}

float feather(float x, float edge) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float radiance = textureLod(uField, uv, 0.0).r;
  float bloom = 0.0;
  bloom += textureLod(uField, uv, 2.0).b * 0.3;
  bloom += textureLod(uField, uv, 3.0).b * 0.3;
  bloom += textureLod(uField, uv, 4.0).b * 0.22;
  bloom += textureLod(uField, uv, 5.0).b * 0.18;

  float hot = textureLod(uField, uv, 0.0).g;
  vec3 light = uColor * (radiance + bloom * uGlow) * uGain;
  light += mix(uColor, vec3(1.0), 0.7) * hot * hot * 0.12 * uGain;
  light *= uPresence;
  vec3 color = toSrgb(acesFilmic(light));
  color -= grainNoise(gl_FragCoord.xy) / 15.0 * uGrain;
  color = max(color, 0.0);

  float edge = uFade * 0.5;
  float mask = feather(uv.x, edge) * feather(1.0 - uv.x, edge) * feather(uv.y, edge) * feather(1.0 - uv.y, edge);
  mask *= uOpacity;
  float dither = (random(gl_FragCoord.yx + 31.7) - 0.5) / 255.0;

  float peak = max(color.r, max(color.g, color.b));
  if (uLightMode > 0.5) {
    float alpha = clamp(peak * 0.9 + dither, 0.0, 1.0) * mask;
    outColor = vec4(uInk * alpha, alpha);
  } else {
    color = clamp(color + dither, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,Ot=1.6,dt=16e5,fe=(n,i,d)=>Math.min(d,Math.max(i,n)),ht=(n,i,d)=>{let s=n.createShader(i);return s?(n.shaderSource(s,d),n.compileShader(s),n.getShaderParameter(s,n.COMPILE_STATUS)?s:(n.deleteShader(s),null)):null},vt=(n,i)=>{let d=ht(n,n.VERTEX_SHADER,Ct),s=ht(n,n.FRAGMENT_SHADER,i),u=n.createProgram();if(!d||!s||!u)return null;if(n.attachShader(u,d),n.attachShader(u,s),n.bindAttribLocation(u,0,"aPosition"),n.linkProgram(u),n.deleteShader(d),n.deleteShader(s),!n.getProgramParameter(u,n.LINK_STATUS))return n.deleteProgram(u),null;let P={},we=n.getProgramParameter(u,n.ACTIVE_UNIFORMS);for(let ae=0;ae<we;ae++){let ie=n.getActiveUniform(u,ae);ie&&(P[ie.name]=n.getUniformLocation(u,ie.name))}return{program:u,uniforms:P}},xt=({color:n="#ffffff",beamWidth:i=140,rotation:d=30,speed:s=1,waveLength:u=233,depth:P=1,sharpness:we=.6,twist:ae=0,fillLight:ie=.3,glow:Qe=.6,brightness:Je=1.6,variation:Be=0,grain:Oe=.35,quality:Ue=.75,mouseInteraction:ke=!0,mouseStrength:Ge=1,intro:Ne=!0,fade:Ze=0,opacity:Xe=1,lightMode:et=!1,backgroundColor:be,paused:tt=!1,dpr:ot,className:qe="",style:Me,...me})=>{let Re=H(null),B=H(null),A=H(null),t={color:String(n),beamWidth:Math.max(8,i),rotation:d,speed:s,waveLength:Math.max(20,u),depth:Math.max(0,P),sharpness:fe(we,0,1),twist:fe(ae,0,2),fillLight:fe(ie,0,1.5),glow:Math.max(0,Qe),brightness:Math.max(0,Je),variation:Number(Be)||0,grain:Math.max(0,Oe),quality:fe(Ue,.25,1),mouseInteraction:ke,mouseStrength:Math.max(0,Ge),intro:Ne,fade:fe(Ze,0,1),opacity:fe(Xe,0,1),lightMode:et,paused:tt,dpr:ot},I=H(t);return I.current=t,re(()=>{var ze,Le;let F=Re.current,O=B.current,e=O==null?void 0:O.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!F||!O||!e)return;let de=!!e.getExtension("EXT_color_buffer_float"),V=vt(e,Dt),E=vt(e,Bt);if(!V||!E)return;let L=e.createBuffer(),k=e.createVertexArray();e.bindVertexArray(k),e.bindBuffer(e.ARRAY_BUFFER,L),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let h=null,w=e.createFramebuffer(),U={width:0,height:0},he=(c,o)=>{if(U.width===c&&U.height===o)return;U.width=c,U.height=o,h&&e.deleteTexture(h),h=e.createTexture(),e.bindTexture(e.TEXTURE_2D,h);let r=Math.floor(Math.log2(Math.max(c,o)))+1;e.texStorage2D(e.TEXTURE_2D,r,de?e.RGBA16F:e.RGBA8,c,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,w),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,h,0)},z=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),J=(Le=(ze=window.matchMedia)==null?void 0:ze.call(window,"(prefers-reduced-motion: reduce)").matches)!=null?Le:!1,G=new Map,l=c=>{let o=G.get(c);if(o)return o;let r=[1,1,1];if(z){z.clearRect(0,0,1,1),z.fillStyle="#ffffff",z.fillStyle=c,z.fillRect(0,0,1,1);let[a,v,m]=z.getImageData(0,0,1,1).data;r=[a,v,m].map(x=>Math.pow(x/255,2.2))}return G.set(c,r),r},b={width:1,height:1,fieldWidth:1,fieldHeight:1},p={x:0,y:0,inside:!1},f={clock:0,intro:I.current.intro&&!J?0:1,reach:0,x:0,y:0,lightY:0},C=0,W=0,ce=!0,ve=()=>{let c=I.current,o=f.intro*f.intro*f.intro*(f.intro*(f.intro*6-15)+10);e.bindVertexArray(k),he(b.fieldWidth,b.fieldHeight);let r=c.rotation*Math.PI/180,a=(1-o)*-9,v=f.reach*c.mouseStrength,m=V.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,w),e.viewport(0,0,U.width,U.height),e.useProgram(V.program),e.uniform2f(m.uView,b.width,b.height),e.uniform2f(m.uScale,b.width/U.width,b.height/U.height),e.uniform2f(m.uTurn,Math.cos(r),Math.sin(r)),e.uniform1f(m.uTime,f.clock*.12%289),e.uniform1f(m.uWidth,c.beamWidth),e.uniform1f(m.uWave,c.waveLength),e.uniform1f(m.uDepth,c.depth),e.uniform1f(m.uRough,.55-c.sharpness*.5),e.uniform1f(m.uSeed,c.variation),e.uniform1f(m.uTwist,c.twist),e.uniform1f(m.uFill,c.fillLight),e.uniform3f(m.uLight,0,3+a+f.lightY*v,10),e.uniform1f(m.uCamera,b.height*1.866),e.uniform4f(m.uPointer,f.x,b.height-f.y,v,Math.max(b.height,b.width)*.28),e.drawArrays(e.TRIANGLES,0,3),e.bindTexture(e.TEXTURE_2D,h),e.generateMipmap(e.TEXTURE_2D);let x=E.uniforms,T=l(c.color),M=.2126*T[0]+.7152*T[1]+.0722*T[2],_=Math.min(1,.18/Math.max(M,.001)),R=T.map(X=>Math.pow(Math.min(1,X*_),1/2.2));e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,O.width,O.height),e.useProgram(E.program),e.uniform2f(x.uResolution,O.width,O.height),e.uniform3fv(x.uColor,T),e.uniform3fv(x.uInk,R),e.uniform1f(x.uGain,c.brightness),e.uniform1f(x.uGlow,c.glow),e.uniform1f(x.uPresence,o),e.uniform1f(x.uGrain,c.grain*1.75),e.uniform1f(x.uFade,c.fade),e.uniform1f(x.uOpacity,c.opacity),e.uniform1f(x.uLightMode,c.lightMode?1:0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.uniform1i(x.uField,0),e.drawArrays(e.TRIANGLES,0,3)},Ve=c=>{if(C=0,!ce||document.hidden)return;let o=I.current,r=W?Math.min(.05,(c-W)/1e3):1/60;W=c;let a=!o.paused&&!J;a&&(f.clock+=r*o.speed),!o.intro||J?f.intro=1:f.intro<1&&(f.intro=Math.min(1,f.intro+r/Ot));let v=o.mouseInteraction&&p.inside&&!J;v&&f.reach<.01&&(f.x=p.x,f.y=p.y);let m=1-Math.exp(-r*7);f.x+=(p.x-f.x)*m,f.y+=(p.y-f.y)*m,f.reach+=((v?1:0)-f.reach)*(1-Math.exp(-r*(v?3.2:1.8)));let x=o.rotation*Math.PI/180,T=f.x-b.width/2,M=b.height/2-f.y,_=-Math.sin(x)*T+Math.cos(x)*M;f.lightY=fe(_/(b.height*.5)*3,-4,4),ve();let R=f.intro<1||Math.abs((v?1:0)-f.reach)>.002||Math.abs(p.x-f.x)+Math.abs(p.y-f.y)>.3;a||R?C=requestAnimationFrame(Ve):W=0},q=()=>{!C&&ce&&!document.hidden&&(C=requestAnimationFrame(Ve))},Ae=()=>{let c=I.current,o=Math.max(1,F.clientWidth),r=Math.max(1,F.clientHeight),a=Math.min(c.dpr||window.devicePixelRatio||1,2);b.width=o,b.height=r,O.width=Math.max(1,Math.round(o*a)),O.height=Math.max(1,Math.round(r*a));let v=c.quality*a;o*r*v*v>dt&&(v=Math.sqrt(dt/(o*r))),b.fieldWidth=Math.max(1,Math.round(o*v)),b.fieldHeight=Math.max(1,Math.round(r*v)),C||ve(),q()},Ee=c=>{let o=F.getBoundingClientRect();p.x=c.clientX-o.left,p.y=c.clientY-o.top,p.inside=p.x>=0&&p.y>=0&&p.x<=o.width&&p.y<=o.height,q()},N=()=>{p.inside=!1,q()},Pe=()=>{W=0,q()},Fe=new ResizeObserver(Ae);Fe.observe(F);let ge=new IntersectionObserver(c=>{ce=c.some(o=>o.isIntersecting),ce&&(W=0,q())});ge.observe(F),window.addEventListener("pointermove",Ee,{passive:!0}),document.documentElement.addEventListener("pointerleave",N),document.addEventListener("visibilitychange",Pe),Ae();let Te=I.current.quality,Se=I.current.dpr;return A.current=()=>{let c=I.current;if(c.quality!==Te||c.dpr!==Se){Te=c.quality,Se=c.dpr,Ae();return}C||ve(),q()},()=>{var c;cancelAnimationFrame(C),A.current=null,Fe.disconnect(),ge.disconnect(),window.removeEventListener("pointermove",Ee),document.documentElement.removeEventListener("pointerleave",N),document.removeEventListener("visibilitychange",Pe),h&&e.deleteTexture(h),e.deleteFramebuffer(w),e.deleteProgram(V.program),e.deleteProgram(E.program),e.deleteBuffer(L),e.deleteVertexArray(k),(c=e.getExtension("WEBGL_lose_context"))==null||c.loseContext()}},[]),re(()=>{var F;(F=A.current)==null||F.call(A)}),ue("div",{ref:Re,className:`beams-container${qe?` ${qe}`:""}`,style:be?{background:be,...Me}:Me,...me},ue("canvas",{ref:B,className:"beams-canvas","aria-hidden":"true"}))};var Ut=`#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in vec2 aState;

uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uStretch;
uniform float uGlow;

out vec2 vLocal;
out vec2 vPoint;
out float vLength;
out float vRadius;
out float vEnergy;

void main() {
  float energy = aState.x;
  float radius = 0.5 * uSize * aState.y * (1.0 + uSwell * energy);
  float speed = length(aMotion.zw);
  float angle = speed > 0.001 ? atan(aMotion.w, aMotion.z) : 0.0;
  float axis = floor(angle / 1.5707963 + 0.5) * 1.5707963;
  angle = axis + (angle - axis) * smoothstep(8.0, 70.0, speed);
  vec2 dir = vec2(cos(angle), sin(angle));
  float halfLength = min(uSize * 2.0, speed * uStretch * 0.02);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * vec2(halfLength + pad, pad);
  vec2 point = aMotion.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  vLocal = local;
  vPoint = point;
  vLength = halfLength;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`,kt=`#version 300 es
precision highp float;

in vec2 vLocal;
in vec2 vPoint;
in float vLength;
in float vRadius;
in float vEnergy;

uniform vec2 uResolution;
uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uOpacity;
uniform float uFade;
uniform int uShape;

out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float d;
  if (uShape == 1) {
    float corner = vRadius * 0.3;
    vec2 q = abs(vLocal) - vec2(vLength + vRadius, vRadius) + corner;
    d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
  } else {
    d = length(vec2(max(abs(vLocal.x) - vLength, 0.0), vLocal.y)) - vRadius;
  }
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float alpha = body + (1.0 - body) * halo;
  vec3 color = mix(uBase, uActive, clamp(vEnergy * 1.2, 0.0, 1.0));
  float fade = 1.0;
  if (uFade > 0.0) {
    vec2 edge = min(vPoint, uResolution - vPoint) / (uFade * 0.4 * min(uResolution.x, uResolution.y));
    fade = smootherstep01(edge.x) * smootherstep01(edge.y);
  }
  alpha *= uOpacity * fade;
  outColor = vec4(color * alpha, alpha);
}
`,pt=n=>{let i=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(n).trim());if(!i)return[1,1,1];let d=i[1].length===3?i[1].replace(/./g,s=>s+s):i[1];return[0,2,4].map(s=>parseInt(d.slice(s,s+2),16)/255)},ct=n=>{let i=Math.min(1,Math.max(0,n));return i*i*i*(i*(i*6-15)+10)},Gt=n=>{let d=n-1;return 1+d*d*((1.9+1)*d+1.9)},yt=(n,i,d)=>{let s=n.createShader(i);return n.shaderSource(s,d),n.compileShader(s),s},Nt=({dotSize:n=5,gap:i=18,baseColor:d="#3a3446",activeColor:s="#ffffff",proximity:u=140,strength:P=1,bounce:we=.6,tension:ae=.4,returnDuration:ie=.8,shockRadius:Qe=320,shockStrength:Je=5,swell:Be=.8,stretch:Oe=.5,glow:Ue=.5,shape:ke="circle",fade:Ge=0,opacity:Ne=1,intro:Ze=!0,mouseInteraction:Xe=!0,clickShock:et=!0,paused:be=!1,dpr:tt,className:ot="",style:qe})=>{let Me=H(null),me=H(null),Re={dotSize:n,gap:i,baseColor:d,activeColor:s,proximity:u,strength:P,bounce:we,tension:ae,returnDuration:ie,shockRadius:Qe,shockStrength:Je,swell:Be,stretch:Oe,glow:Ue,shape:ke,fade:Ge,opacity:Ne,intro:Ze,mouseInteraction:Xe,clickShock:et,paused:be,dpr:tt},B=H(Re);return B.current=Re,re(()=>{let A=Me.current;if(!A)return;let t=A.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!t)return;let I=t.createProgram();if(t.attachShader(I,yt(t,t.VERTEX_SHADER,Ut)),t.attachShader(I,yt(t,t.FRAGMENT_SHADER,kt)),t.linkProgram(I),!t.getProgramParameter(I,t.LINK_STATUS))return;let F={};for(let o of["uResolution","uSize","uSwell","uStretch","uGlow","uBase","uActive","uOpacity","uFade","uShape"])F[o]=t.getUniformLocation(I,o);let O=t.createVertexArray();t.bindVertexArray(O);let e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let de=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,de),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,24,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,24,16),t.vertexAttribDivisor(2,1),t.bindVertexArray(null);let V=window.matchMedia("(prefers-reduced-motion: reduce)").matches,E={width:0,height:0,left:0,top:0,ratio:1},L={count:0,cols:1,rows:1,cell:1,centerX:0,centerY:0,reach:1},k=new Float32Array(0),h=new Float32Array(0),w=new Float32Array(0),U=new Float32Array(0),he=new Float32Array(0),z=new Float32Array(0),J=new Float32Array(0),G=new Float32Array(0),l={x:0,y:0,vx:0,vy:0,time:0,inside:!1,presence:0},b=[],p=B.current.intro&&!V?-1:null,f=!0,C=0,W=0,ce=()=>{let{dotSize:o,gap:r}=B.current,a=Math.max(2,o+r),v=Math.max(1,Math.floor((E.width+r)/a)),m=Math.max(1,Math.floor((E.height+r)/a)),x=(E.width-(v*a-r))/2+o/2,T=(E.height-(m*a-r))/2+o/2,M=v*m;k=new Float32Array(M*2),h=new Float32Array(M*2),w=new Float32Array(M*2),U=new Float32Array(M*2),he=new Float32Array(M*2),z=new Float32Array(M*4),J=new Float32Array(M),G=new Float32Array(M*6);for(let _=0;_<m;_++)for(let R=0;R<v;R++){let X=(_*v+R)*2;k[X]=x+R*a,k[X+1]=T+_*a}Object.assign(L,{count:M,cols:v,rows:m,cell:a,centerX:E.width/2,centerY:E.height/2,reach:Math.hypot(E.width,E.height)/2}),t.bindBuffer(t.ARRAY_BUFFER,de),t.bufferData(t.ARRAY_BUFFER,G.byteLength,t.DYNAMIC_DRAW)},ve=()=>{var m,x;let o=A.getBoundingClientRect(),r=Math.min((x=(m=B.current.dpr)!=null?m:window.devicePixelRatio)!=null?x:1,2),a=Math.max(1,Math.round(o.width)),v=Math.max(1,Math.round(o.height));Object.assign(E,{width:a,height:v,left:o.left,top:o.top,ratio:r}),A.width=Math.round(a*r),A.height=Math.round(v*r),ce(),q(performance.now())},Ve=(o,r)=>{let a=B.current,v=V?0:1,m=1-.85*Math.min(1,Math.max(0,a.bounce)),x=4/(m*Math.max(.2,a.returnDuration)),T=x*x,M=2*m*x,_=Math.max(1,a.proximity),R=Math.hypot(l.vx,l.vy),X=a.mouseInteraction&&l.inside?6500*Math.tanh(R/900)*a.strength*v:0,We=R>.001?l.vx/R:0,Ye=R>.001?l.vy/R:0,j=L.cell*1.4,_e=650,$=b.map(S=>{let y=(r-S.start)/1e3*_e,D=ct(1-y/Math.max(1,a.shockRadius));return{...S,front:y,amplitude:D*a.shockStrength*L.cell*.24*v}}),Y=(Math.max(0,a.tension)*900)**2/(L.cell*L.cell),le=Math.sqrt(Y)*.06,Pt=Math.sqrt(T+8*Y)+M+8*le,lt=Math.min(24,Math.max(1,Math.ceil(o/Math.min(1/120,1.2/Pt)))),nt=o/lt;for(let S=0;S<L.count;S++){let y=S*2,D=k[y],g=k[y+1],xe=0,pe=0;if(X>0){let K=D+h[y]-l.x,Ie=g+h[y+1]-l.y,Q=Math.hypot(K,Ie);if(Q<_){let se=ct(1-Q/_)*X,ye=Q>.001?K/Q:0,Ce=Q>.001?Ie/Q:0;xe+=se*(We+ye*.6),pe+=se*(Ye+Ce*.6)}}let ee=0,te=0,oe=0,ne=0;for(let K of $){if(K.amplitude<=0)continue;let Ie=D-K.x,Q=g-K.y,se=Math.hypot(Ie,Q),ye=(se-K.front)/j;if(Math.abs(ye)<3&&se>.001){let Ce=Ie/se,rt=Q/se,ft=Math.exp(-ye*ye),$e=K.amplitude*ft,mt=K.amplitude*2*ye*ft/j*_e;ee+=Ce*$e,te+=rt*$e,oe+=Ce*mt,ne+=rt*mt,xe+=Ce*$e*T*.35,pe+=rt*$e*T*.35}}U[y]=xe,U[y+1]=pe;let je=S*4;z[je]=ee,z[je+1]=te,z[je+2]=oe,z[je+3]=ne}let{cols:He,rows:st}=L,Z=He*2;for(let S=0;S<lt;S++){for(let y=0;y<st;y++)for(let D=0;D<He;D++){let g=(y*He+D)*2,xe=U[g]-T*h[g]-M*w[g],pe=U[g+1]-T*h[g+1]-M*w[g+1];if(Y>0){let ee=-4*h[g],te=-4*h[g+1],oe=-4*w[g],ne=-4*w[g+1];D>0&&(ee+=h[g-2],te+=h[g-1],oe+=w[g-2],ne+=w[g-1]),D<He-1&&(ee+=h[g+2],te+=h[g+3],oe+=w[g+2],ne+=w[g+3]),y>0&&(ee+=h[g-Z],te+=h[g-Z+1],oe+=w[g-Z],ne+=w[g-Z+1]),y<st-1&&(ee+=h[g+Z],te+=h[g+Z+1],oe+=w[g+Z],ne+=w[g+Z+1]),xe+=Y*ee+le*oe,pe+=Y*te+le*ne}he[g]=w[g]+xe*nt,he[g+1]=w[g+1]+pe*nt}for(let y=0;y<h.length;y++)w[y]=he[y],h[y]+=w[y]*nt}for(let S=0;S<L.count;S++){let y=S*2,D=S*4;J[S]=Math.min(1,Math.hypot(w[y]+z[D+2],w[y+1]+z[D+3])/380*.85+Math.hypot(h[y]+z[D],h[y+1]+z[D+1])/(L.cell*2.2)*.35)}for(let S=b.length-1;S>=0;S--)$[S].front>a.shockRadius+j*3&&b.splice(S,1);let ut=1-Math.exp(-o/.08);l.vx-=l.vx*ut,l.vy-=l.vy*ut;let Ft=a.mouseInteraction&&l.inside?1:0;l.presence+=(Ft-l.presence)*(1-Math.exp(-o/.2))},q=o=>{let r=B.current,a=Math.max(1,r.proximity),m=(p===null?1/0:p<0?0:(o-p)/1e3)*L.reach*1.25,x=L.cell*4;for(let _=0;_<L.count;_++){let R=_*2,X=_*4,We=k[R]+h[R]+z[X],Ye=k[R+1]+h[R+1]+z[X+1],j=J[_];if(l.presence>.001){let Y=Math.hypot(We-l.x,Ye-l.y);Y<a&&(j=Math.max(j,ct(1-Y/a)*.4*l.presence))}let _e=1;if(p!==null){let Y=Math.hypot(k[R]-L.centerX,k[R+1]-L.centerY),le=Math.min(1,Math.max(0,(m-Y)/x));_e=le>=1?1:Math.max(0,Gt(le)),j=Math.max(j,Math.sin(le*Math.PI)*.6)}let $=_*6;G[$]=We,G[$+1]=Ye,G[$+2]=w[R]+z[X+2],G[$+3]=w[R+1]+z[X+3],G[$+4]=j,G[$+5]=_e}let T=pt(r.baseColor),M=pt(r.activeColor);t.viewport(0,0,A.width,A.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(I),t.uniform2f(F.uResolution,E.width,E.height),t.uniform1f(F.uSize,Math.max(.5,r.dotSize)),t.uniform1f(F.uSwell,V?0:Math.max(0,r.swell)),t.uniform1f(F.uStretch,V?0:Math.max(0,r.stretch)),t.uniform1f(F.uGlow,Math.max(0,r.glow)),t.uniform3f(F.uBase,T[0],T[1],T[2]),t.uniform3f(F.uActive,M[0],M[1],M[2]),t.uniform1f(F.uOpacity,Math.min(1,Math.max(0,r.opacity))),t.uniform1f(F.uFade,Math.min(1,Math.max(0,r.fade))),t.uniform1i(F.uShape,r.shape==="square"?1:0),t.bindVertexArray(O),t.bindBuffer(t.ARRAY_BUFFER,de),t.bufferSubData(t.ARRAY_BUFFER,0,G),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,L.count),t.bindVertexArray(null)},Ae=o=>{if(b.length)return!1;if(p!==null){if(p<0||(o-p)/1e3<1.6)return!1;p=null}if(Math.abs(l.vx)+Math.abs(l.vy)>1)return!1;let r=B.current.mouseInteraction&&l.inside?1:0;if(Math.abs(r-l.presence)>.002)return!1;for(let a=0;a<h.length;a++)if(Math.abs(h[a])>.02||Math.abs(w[a])>.5)return!1;return!0},Ee=o=>{if(C=0,B.current.paused||!f)return;p!==null&&p<0&&(p=o);let r=Math.min(.05,(o-W)/1e3||0);W=o,Ve(r,o),q(o),Ae(o)||(C=requestAnimationFrame(Ee))},N=()=>{C||B.current.paused||!f||(W=performance.now(),C=requestAnimationFrame(Ee))},Pe=o=>{let r=A.getBoundingClientRect();return E.left=r.left,E.top=r.top,[o.clientX-r.left,o.clientY-r.top]},Fe=o=>{if(!B.current.mouseInteraction)return;let[r,a]=Pe(o),v=r>=0&&a>=0&&r<=E.width&&a<=E.height,m=o.timeStamp||performance.now();if(v&&l.inside&&l.time){let x=Math.max(4,m-l.time)/1e3,T=(r-l.x)/x,M=(a-l.y)/x;l.vx+=(T-l.vx)*.6,l.vy+=(M-l.vy)*.6}else l.vx=0,l.vy=0;l.x=r,l.y=a,l.time=m,(v!==l.inside||v)&&(l.inside=v,N())},ge=()=>{l.inside=!1,l.time=0,N()},Te=o=>{o.relatedTarget||ge()},Se=o=>{if(!B.current.clickShock||V)return;let[r,a]=Pe(o);r<0||a<0||r>E.width||a>E.height||(b.push({x:r,y:a,start:performance.now()}),b.length>6&&b.shift(),N())};window.addEventListener("pointermove",Fe,{passive:!0}),window.addEventListener("pointerdown",Se,{passive:!0}),window.addEventListener("pointerout",Te),window.addEventListener("blur",ge);let ze=new ResizeObserver(()=>{ve(),N()});ze.observe(A);let Le=new IntersectionObserver(([o])=>{f=o.isIntersecting,f&&N()});Le.observe(A);let c=()=>{document.hidden?(cancelAnimationFrame(C),C=0):N()};return document.addEventListener("visibilitychange",c),ve(),N(),me.current={rebuild:()=>{ce(),q(performance.now()),N()},refresh:()=>{q(performance.now()),N()}},()=>{cancelAnimationFrame(C),ze.disconnect(),Le.disconnect(),window.removeEventListener("pointermove",Fe),window.removeEventListener("pointerdown",Se),window.removeEventListener("pointerout",Te),window.removeEventListener("blur",ge),document.removeEventListener("visibilitychange",c),t.deleteBuffer(e),t.deleteBuffer(de),t.deleteVertexArray(O),t.deleteProgram(I),me.current=null}},[]),re(()=>{var A;(A=me.current)==null||A.rebuild()},[n,i]),re(()=>{var A;(A=me.current)==null||A.refresh()},[d,s,Be,Oe,Ue,ke,Ge,Ne,be,u,Xe]),ue("div",{className:`dot-grid ${ot}`.trim(),style:qe},ue("canvas",{ref:Me,className:"dot-grid__canvas"}))},wt=Nt;var Rt={color:"#7fb2e0",beamWidth:150,rotation:30,speed:.8,brightness:1.2,glow:.5,grain:.3,backgroundColor:"#00050d",mouseStrength:.6},At={dotSize:2,gap:22,baseColor:"#2a4a68",activeColor:"#d6e9fa",proximity:180,strength:1.2,swell:1.4,glow:1,opacity:.9,shockRadius:280,shockStrength:5},bt={position:"absolute",inset:"0",width:"100%",height:"100%"};function Xt(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}function Et(n,i){if(!Xt())return()=>{};let d=[];return n&&d.push(De(xt,{...Rt,style:bt},n)),i&&d.push(De(wt,{...At,style:bt},i)),document.documentElement.classList.add("hero-bg-ready"),()=>d.forEach(s=>s())}function Mt(){let n=document.querySelector("[data-hero-beams]"),i=document.querySelector("[data-hero-dots]");(n||i)&&Et(n,i)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Mt,{once:!0}):Mt();return It(qt);})();
