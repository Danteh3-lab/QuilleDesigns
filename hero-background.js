/* Quille Designs hero background. Beams and Dot Grid from React Bits (https://reactbits.dev) by David Haz. MIT + Commons Clause License, Copyright (c) 2026 David Haz. Used as part of this website only. */
var QuilleHeroBackground=(()=>{var at=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var St=Object.getOwnPropertyNames;var Lt=Object.prototype.hasOwnProperty;var zt=(o,i)=>{for(var d in i)at(o,d,{get:i[d],enumerable:!0})},_t=(o,i,d,l)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of St(i))!Lt.call(o,s)&&s!==d&&at(o,s,{get:()=>i[s],enumerable:!(l=Tt(i,s))||l.enumerable});return o};var It=o=>_t(at({},"__esModule",{value:!0}),o);var qt={};zt(qt,{BEAMS:()=>Rt,DOTS:()=>At,mount:()=>lt});var it=[],H=o=>({current:o}),re=o=>{it.push(o)},Ke="fragment";function ue(o,i,...d){if(i=i||{},typeof o=="function")return o({...i,children:d});let l=o===Ke?document.createDocumentFragment():document.createElement(o);for(let[s,M]of Object.entries(i))M==null||M===!1||s==="children"||(s==="ref"?M.current=l:s==="className"?l.className=M:s==="style"&&typeof M=="object"?Object.assign(l.style,M):s.startsWith("on")||l.setAttribute(s,M===!0?"":M));for(let s of d.flat(1/0))s==null||s===!1||s===!0||l.append(s instanceof Node?s:String(s));return l}function De(o,i,d){it=[];let l=o(i);d.append(l);let s=it.splice(0).map(M=>M()).filter(M=>typeof M=="function");return()=>{s.forEach(M=>M()),l.remove()}}var Ct=`#version 300 es
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
}`,Ot=1.6,ht=16e5,fe=(o,i,d)=>Math.min(d,Math.max(i,o)),vt=(o,i,d)=>{let l=o.createShader(i);return l?(o.shaderSource(l,d),o.compileShader(l),o.getShaderParameter(l,o.COMPILE_STATUS)?l:(o.deleteShader(l),null)):null},gt=(o,i)=>{let d=vt(o,o.VERTEX_SHADER,Ct),l=vt(o,o.FRAGMENT_SHADER,i),s=o.createProgram();if(!d||!l||!s)return null;if(o.attachShader(s,d),o.attachShader(s,l),o.bindAttribLocation(s,0,"aPosition"),o.linkProgram(s),o.deleteShader(d),o.deleteShader(l),!o.getProgramParameter(s,o.LINK_STATUS))return o.deleteProgram(s),null;let M={},we=o.getProgramParameter(s,o.ACTIVE_UNIFORMS);for(let ae=0;ae<we;ae++){let ie=o.getActiveUniform(s,ae);ie&&(M[ie.name]=o.getUniformLocation(s,ie.name))}return{program:s,uniforms:M}},pt=({color:o="#ffffff",beamWidth:i=140,rotation:d=30,speed:l=1,waveLength:s=233,depth:M=1,sharpness:we=.6,twist:ae=0,fillLight:ie=.3,glow:Qe=.6,brightness:Je=1.6,variation:Be=0,grain:Oe=.35,quality:Ue=.75,mouseInteraction:ke=!0,mouseStrength:Ge=1,intro:Ne=!0,fade:Ze=0,opacity:Xe=1,lightMode:et=!1,backgroundColor:be,paused:tt=!1,dpr:ot,className:qe="",style:Me,...de})=>{let Ee=H(null),B=H(null),A=H(null),t={color:String(o),beamWidth:Math.max(8,i),rotation:d,speed:l,waveLength:Math.max(20,s),depth:Math.max(0,M),sharpness:fe(we,0,1),twist:fe(ae,0,2),fillLight:fe(ie,0,1.5),glow:Math.max(0,Qe),brightness:Math.max(0,Je),variation:Number(Be)||0,grain:Math.max(0,Oe),quality:fe(Ue,.25,1),mouseInteraction:ke,mouseStrength:Math.max(0,Ge),intro:Ne,fade:fe(Ze,0,1),opacity:fe(Xe,0,1),lightMode:et,paused:tt,dpr:ot},I=H(t);return I.current=t,re(()=>{var Le,ze;let F=Ee.current,O=B.current,e=O==null?void 0:O.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!F||!O||!e)return;let me=!!e.getExtension("EXT_color_buffer_float"),V=gt(e,Dt),P=gt(e,Bt);if(!V||!P)return;let z=e.createBuffer(),k=e.createVertexArray();e.bindVertexArray(k),e.bindBuffer(e.ARRAY_BUFFER,z),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let h=null,w=e.createFramebuffer(),U={width:0,height:0},he=(c,n)=>{if(U.width===c&&U.height===n)return;U.width=c,U.height=n,h&&e.deleteTexture(h),h=e.createTexture(),e.bindTexture(e.TEXTURE_2D,h);let r=Math.floor(Math.log2(Math.max(c,n)))+1;e.texStorage2D(e.TEXTURE_2D,r,me?e.RGBA16F:e.RGBA8,c,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,w),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,h,0)},L=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),J=(ze=(Le=window.matchMedia)==null?void 0:Le.call(window,"(prefers-reduced-motion: reduce)").matches)!=null?ze:!1,G=new Map,u=c=>{let n=G.get(c);if(n)return n;let r=[1,1,1];if(L){L.clearRect(0,0,1,1),L.fillStyle="#ffffff",L.fillStyle=c,L.fillRect(0,0,1,1);let[a,v,m]=L.getImageData(0,0,1,1).data;r=[a,v,m].map(x=>Math.pow(x/255,2.2))}return G.set(c,r),r},b={width:1,height:1,fieldWidth:1,fieldHeight:1},p={x:0,y:0,inside:!1},f={clock:0,intro:I.current.intro&&!J?0:1,reach:0,x:0,y:0,lightY:0},C=0,W=0,ce=!0,ve=()=>{let c=I.current,n=f.intro*f.intro*f.intro*(f.intro*(f.intro*6-15)+10);e.bindVertexArray(k),he(b.fieldWidth,b.fieldHeight);let r=c.rotation*Math.PI/180,a=(1-n)*-9,v=f.reach*c.mouseStrength,m=V.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,w),e.viewport(0,0,U.width,U.height),e.useProgram(V.program),e.uniform2f(m.uView,b.width,b.height),e.uniform2f(m.uScale,b.width/U.width,b.height/U.height),e.uniform2f(m.uTurn,Math.cos(r),Math.sin(r)),e.uniform1f(m.uTime,f.clock*.12%289),e.uniform1f(m.uWidth,c.beamWidth),e.uniform1f(m.uWave,c.waveLength),e.uniform1f(m.uDepth,c.depth),e.uniform1f(m.uRough,.55-c.sharpness*.5),e.uniform1f(m.uSeed,c.variation),e.uniform1f(m.uTwist,c.twist),e.uniform1f(m.uFill,c.fillLight),e.uniform3f(m.uLight,0,3+a+f.lightY*v,10),e.uniform1f(m.uCamera,b.height*1.866),e.uniform4f(m.uPointer,f.x,b.height-f.y,v,Math.max(b.height,b.width)*.28),e.drawArrays(e.TRIANGLES,0,3),e.bindTexture(e.TEXTURE_2D,h),e.generateMipmap(e.TEXTURE_2D);let x=P.uniforms,T=u(c.color),E=.2126*T[0]+.7152*T[1]+.0722*T[2],_=Math.min(1,.18/Math.max(E,.001)),R=T.map(X=>Math.pow(Math.min(1,X*_),1/2.2));e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,O.width,O.height),e.useProgram(P.program),e.uniform2f(x.uResolution,O.width,O.height),e.uniform3fv(x.uColor,T),e.uniform3fv(x.uInk,R),e.uniform1f(x.uGain,c.brightness),e.uniform1f(x.uGlow,c.glow),e.uniform1f(x.uPresence,n),e.uniform1f(x.uGrain,c.grain*1.75),e.uniform1f(x.uFade,c.fade),e.uniform1f(x.uOpacity,c.opacity),e.uniform1f(x.uLightMode,c.lightMode?1:0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.uniform1i(x.uField,0),e.drawArrays(e.TRIANGLES,0,3)},Ve=c=>{if(C=0,!ce||document.hidden)return;let n=I.current,r=W?Math.min(.05,(c-W)/1e3):1/60;W=c;let a=!n.paused&&!J;a&&(f.clock+=r*n.speed),!n.intro||J?f.intro=1:f.intro<1&&(f.intro=Math.min(1,f.intro+r/Ot));let v=n.mouseInteraction&&p.inside&&!J;v&&f.reach<.01&&(f.x=p.x,f.y=p.y);let m=1-Math.exp(-r*7);f.x+=(p.x-f.x)*m,f.y+=(p.y-f.y)*m,f.reach+=((v?1:0)-f.reach)*(1-Math.exp(-r*(v?3.2:1.8)));let x=n.rotation*Math.PI/180,T=f.x-b.width/2,E=b.height/2-f.y,_=-Math.sin(x)*T+Math.cos(x)*E;f.lightY=fe(_/(b.height*.5)*3,-4,4),ve();let R=f.intro<1||Math.abs((v?1:0)-f.reach)>.002||Math.abs(p.x-f.x)+Math.abs(p.y-f.y)>.3;a||R?C=requestAnimationFrame(Ve):W=0},q=()=>{!C&&ce&&!document.hidden&&(C=requestAnimationFrame(Ve))},Re=()=>{let c=I.current,n=Math.max(1,F.clientWidth),r=Math.max(1,F.clientHeight),a=Math.min(c.dpr||window.devicePixelRatio||1,2);b.width=n,b.height=r,O.width=Math.max(1,Math.round(n*a)),O.height=Math.max(1,Math.round(r*a));let v=c.quality*a;n*r*v*v>ht&&(v=Math.sqrt(ht/(n*r))),b.fieldWidth=Math.max(1,Math.round(n*v)),b.fieldHeight=Math.max(1,Math.round(r*v)),C||ve(),q()},Ae=c=>{let n=F.getBoundingClientRect();p.x=c.clientX-n.left,p.y=c.clientY-n.top,p.inside=p.x>=0&&p.y>=0&&p.x<=n.width&&p.y<=n.height,q()},N=()=>{p.inside=!1,q()},Pe=()=>{W=0,q()},Fe=new ResizeObserver(Re);Fe.observe(F);let ge=new IntersectionObserver(c=>{ce=c.some(n=>n.isIntersecting),ce&&(W=0,q())});ge.observe(F),window.addEventListener("pointermove",Ae,{passive:!0}),document.documentElement.addEventListener("pointerleave",N),document.addEventListener("visibilitychange",Pe),Re();let Te=I.current.quality,Se=I.current.dpr;return A.current=()=>{let c=I.current;if(c.quality!==Te||c.dpr!==Se){Te=c.quality,Se=c.dpr,Re();return}C||ve(),q()},()=>{var c;cancelAnimationFrame(C),A.current=null,Fe.disconnect(),ge.disconnect(),window.removeEventListener("pointermove",Ae),document.documentElement.removeEventListener("pointerleave",N),document.removeEventListener("visibilitychange",Pe),h&&e.deleteTexture(h),e.deleteFramebuffer(w),e.deleteProgram(V.program),e.deleteProgram(P.program),e.deleteBuffer(z),e.deleteVertexArray(k),(c=e.getExtension("WEBGL_lose_context"))==null||c.loseContext()}},[]),re(()=>{var F;(F=A.current)==null||F.call(A)}),ue("div",{ref:Ee,className:`beams-container${qe?` ${qe}`:""}`,style:be?{background:be,...Me}:Me,...de},ue("canvas",{ref:B,className:"beams-canvas","aria-hidden":"true"}))};var Ut=`#version 300 es
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
`,yt=o=>{let i=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(o).trim());if(!i)return[1,1,1];let d=i[1].length===3?i[1].replace(/./g,l=>l+l):i[1];return[0,2,4].map(l=>parseInt(d.slice(l,l+2),16)/255)},ct=o=>{let i=Math.min(1,Math.max(0,o));return i*i*i*(i*(i*6-15)+10)},Gt=o=>{let d=o-1;return 1+d*d*((1.9+1)*d+1.9)},wt=(o,i,d)=>{let l=o.createShader(i);return o.shaderSource(l,d),o.compileShader(l),l},Nt=({dotSize:o=5,gap:i=18,baseColor:d="#3a3446",activeColor:l="#ffffff",proximity:s=140,strength:M=1,bounce:we=.6,tension:ae=.4,returnDuration:ie=.8,shockRadius:Qe=320,shockStrength:Je=5,swell:Be=.8,stretch:Oe=.5,glow:Ue=.5,shape:ke="circle",fade:Ge=0,opacity:Ne=1,intro:Ze=!0,mouseInteraction:Xe=!0,clickShock:et=!0,paused:be=!1,dpr:tt,className:ot="",style:qe})=>{let Me=H(null),de=H(null),Ee={dotSize:o,gap:i,baseColor:d,activeColor:l,proximity:s,strength:M,bounce:we,tension:ae,returnDuration:ie,shockRadius:Qe,shockStrength:Je,swell:Be,stretch:Oe,glow:Ue,shape:ke,fade:Ge,opacity:Ne,intro:Ze,mouseInteraction:Xe,clickShock:et,paused:be,dpr:tt},B=H(Ee);return B.current=Ee,re(()=>{let A=Me.current;if(!A)return;let t=A.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!t)return;let I=t.createProgram();if(t.attachShader(I,wt(t,t.VERTEX_SHADER,Ut)),t.attachShader(I,wt(t,t.FRAGMENT_SHADER,kt)),t.linkProgram(I),!t.getProgramParameter(I,t.LINK_STATUS))return;let F={};for(let n of["uResolution","uSize","uSwell","uStretch","uGlow","uBase","uActive","uOpacity","uFade","uShape"])F[n]=t.getUniformLocation(I,n);let O=t.createVertexArray();t.bindVertexArray(O);let e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let me=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,me),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,24,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,24,16),t.vertexAttribDivisor(2,1),t.bindVertexArray(null);let V=window.matchMedia("(prefers-reduced-motion: reduce)").matches,P={width:0,height:0,left:0,top:0,ratio:1},z={count:0,cols:1,rows:1,cell:1,centerX:0,centerY:0,reach:1},k=new Float32Array(0),h=new Float32Array(0),w=new Float32Array(0),U=new Float32Array(0),he=new Float32Array(0),L=new Float32Array(0),J=new Float32Array(0),G=new Float32Array(0),u={x:0,y:0,vx:0,vy:0,time:0,inside:!1,presence:0},b=[],p=B.current.intro&&!V?-1:null,f=!0,C=0,W=0,ce=()=>{let{dotSize:n,gap:r}=B.current,a=Math.max(2,n+r),v=Math.max(1,Math.floor((P.width+r)/a)),m=Math.max(1,Math.floor((P.height+r)/a)),x=(P.width-(v*a-r))/2+n/2,T=(P.height-(m*a-r))/2+n/2,E=v*m;k=new Float32Array(E*2),h=new Float32Array(E*2),w=new Float32Array(E*2),U=new Float32Array(E*2),he=new Float32Array(E*2),L=new Float32Array(E*4),J=new Float32Array(E),G=new Float32Array(E*6);for(let _=0;_<m;_++)for(let R=0;R<v;R++){let X=(_*v+R)*2;k[X]=x+R*a,k[X+1]=T+_*a}Object.assign(z,{count:E,cols:v,rows:m,cell:a,centerX:P.width/2,centerY:P.height/2,reach:Math.hypot(P.width,P.height)/2}),t.bindBuffer(t.ARRAY_BUFFER,me),t.bufferData(t.ARRAY_BUFFER,G.byteLength,t.DYNAMIC_DRAW)},ve=()=>{var m,x;let n=A.getBoundingClientRect(),r=Math.min((x=(m=B.current.dpr)!=null?m:window.devicePixelRatio)!=null?x:1,2),a=Math.max(1,Math.round(n.width)),v=Math.max(1,Math.round(n.height));Object.assign(P,{width:a,height:v,left:n.left,top:n.top,ratio:r}),A.width=Math.round(a*r),A.height=Math.round(v*r),ce(),q(performance.now())},Ve=(n,r)=>{let a=B.current,v=V?0:1,m=1-.85*Math.min(1,Math.max(0,a.bounce)),x=4/(m*Math.max(.2,a.returnDuration)),T=x*x,E=2*m*x,_=Math.max(1,a.proximity),R=Math.hypot(u.vx,u.vy),X=a.mouseInteraction&&u.inside?6500*Math.tanh(R/900)*a.strength*v:0,We=R>.001?u.vx/R:0,Ye=R>.001?u.vy/R:0,j=z.cell*1.4,_e=650,$=b.map(S=>{let y=(r-S.start)/1e3*_e,D=ct(1-y/Math.max(1,a.shockRadius));return{...S,front:y,amplitude:D*a.shockStrength*z.cell*.24*v}}),Y=(Math.max(0,a.tension)*900)**2/(z.cell*z.cell),le=Math.sqrt(Y)*.06,Pt=Math.sqrt(T+8*Y)+E+8*le,st=Math.min(24,Math.max(1,Math.ceil(n/Math.min(1/120,1.2/Pt)))),nt=n/st;for(let S=0;S<z.count;S++){let y=S*2,D=k[y],g=k[y+1],xe=0,pe=0;if(X>0){let K=D+h[y]-u.x,Ie=g+h[y+1]-u.y,Q=Math.hypot(K,Ie);if(Q<_){let se=ct(1-Q/_)*X,ye=Q>.001?K/Q:0,Ce=Q>.001?Ie/Q:0;xe+=se*(We+ye*.6),pe+=se*(Ye+Ce*.6)}}let ee=0,te=0,oe=0,ne=0;for(let K of $){if(K.amplitude<=0)continue;let Ie=D-K.x,Q=g-K.y,se=Math.hypot(Ie,Q),ye=(se-K.front)/j;if(Math.abs(ye)<3&&se>.001){let Ce=Ie/se,rt=Q/se,dt=Math.exp(-ye*ye),$e=K.amplitude*dt,mt=K.amplitude*2*ye*dt/j*_e;ee+=Ce*$e,te+=rt*$e,oe+=Ce*mt,ne+=rt*mt,xe+=Ce*$e*T*.35,pe+=rt*$e*T*.35}}U[y]=xe,U[y+1]=pe;let je=S*4;L[je]=ee,L[je+1]=te,L[je+2]=oe,L[je+3]=ne}let{cols:He,rows:ut}=z,Z=He*2;for(let S=0;S<st;S++){for(let y=0;y<ut;y++)for(let D=0;D<He;D++){let g=(y*He+D)*2,xe=U[g]-T*h[g]-E*w[g],pe=U[g+1]-T*h[g+1]-E*w[g+1];if(Y>0){let ee=-4*h[g],te=-4*h[g+1],oe=-4*w[g],ne=-4*w[g+1];D>0&&(ee+=h[g-2],te+=h[g-1],oe+=w[g-2],ne+=w[g-1]),D<He-1&&(ee+=h[g+2],te+=h[g+3],oe+=w[g+2],ne+=w[g+3]),y>0&&(ee+=h[g-Z],te+=h[g-Z+1],oe+=w[g-Z],ne+=w[g-Z+1]),y<ut-1&&(ee+=h[g+Z],te+=h[g+Z+1],oe+=w[g+Z],ne+=w[g+Z+1]),xe+=Y*ee+le*oe,pe+=Y*te+le*ne}he[g]=w[g]+xe*nt,he[g+1]=w[g+1]+pe*nt}for(let y=0;y<h.length;y++)w[y]=he[y],h[y]+=w[y]*nt}for(let S=0;S<z.count;S++){let y=S*2,D=S*4;J[S]=Math.min(1,Math.hypot(w[y]+L[D+2],w[y+1]+L[D+3])/380*.85+Math.hypot(h[y]+L[D],h[y+1]+L[D+1])/(z.cell*2.2)*.35)}for(let S=b.length-1;S>=0;S--)$[S].front>a.shockRadius+j*3&&b.splice(S,1);let ft=1-Math.exp(-n/.08);u.vx-=u.vx*ft,u.vy-=u.vy*ft;let Ft=a.mouseInteraction&&u.inside?1:0;u.presence+=(Ft-u.presence)*(1-Math.exp(-n/.2))},q=n=>{let r=B.current,a=Math.max(1,r.proximity),m=(p===null?1/0:p<0?0:(n-p)/1e3)*z.reach*1.25,x=z.cell*4;for(let _=0;_<z.count;_++){let R=_*2,X=_*4,We=k[R]+h[R]+L[X],Ye=k[R+1]+h[R+1]+L[X+1],j=J[_];if(u.presence>.001){let Y=Math.hypot(We-u.x,Ye-u.y);Y<a&&(j=Math.max(j,ct(1-Y/a)*.4*u.presence))}let _e=1;if(p!==null){let Y=Math.hypot(k[R]-z.centerX,k[R+1]-z.centerY),le=Math.min(1,Math.max(0,(m-Y)/x));_e=le>=1?1:Math.max(0,Gt(le)),j=Math.max(j,Math.sin(le*Math.PI)*.6)}let $=_*6;G[$]=We,G[$+1]=Ye,G[$+2]=w[R]+L[X+2],G[$+3]=w[R+1]+L[X+3],G[$+4]=j,G[$+5]=_e}let T=yt(r.baseColor),E=yt(r.activeColor);t.viewport(0,0,A.width,A.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(I),t.uniform2f(F.uResolution,P.width,P.height),t.uniform1f(F.uSize,Math.max(.5,r.dotSize)),t.uniform1f(F.uSwell,V?0:Math.max(0,r.swell)),t.uniform1f(F.uStretch,V?0:Math.max(0,r.stretch)),t.uniform1f(F.uGlow,Math.max(0,r.glow)),t.uniform3f(F.uBase,T[0],T[1],T[2]),t.uniform3f(F.uActive,E[0],E[1],E[2]),t.uniform1f(F.uOpacity,Math.min(1,Math.max(0,r.opacity))),t.uniform1f(F.uFade,Math.min(1,Math.max(0,r.fade))),t.uniform1i(F.uShape,r.shape==="square"?1:0),t.bindVertexArray(O),t.bindBuffer(t.ARRAY_BUFFER,me),t.bufferSubData(t.ARRAY_BUFFER,0,G),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,z.count),t.bindVertexArray(null)},Re=n=>{if(b.length)return!1;if(p!==null){if(p<0||(n-p)/1e3<1.6)return!1;p=null}if(Math.abs(u.vx)+Math.abs(u.vy)>1)return!1;let r=B.current.mouseInteraction&&u.inside?1:0;if(Math.abs(r-u.presence)>.002)return!1;for(let a=0;a<h.length;a++)if(Math.abs(h[a])>.02||Math.abs(w[a])>.5)return!1;return!0},Ae=n=>{if(C=0,B.current.paused||!f)return;p!==null&&p<0&&(p=n);let r=Math.min(.05,(n-W)/1e3||0);W=n,Ve(r,n),q(n),Re(n)||(C=requestAnimationFrame(Ae))},N=()=>{C||B.current.paused||!f||(W=performance.now(),C=requestAnimationFrame(Ae))},Pe=n=>{let r=A.getBoundingClientRect();return P.left=r.left,P.top=r.top,[n.clientX-r.left,n.clientY-r.top]},Fe=n=>{if(!B.current.mouseInteraction)return;let[r,a]=Pe(n),v=r>=0&&a>=0&&r<=P.width&&a<=P.height,m=n.timeStamp||performance.now();if(v&&u.inside&&u.time){let x=Math.max(4,m-u.time)/1e3,T=(r-u.x)/x,E=(a-u.y)/x;u.vx+=(T-u.vx)*.6,u.vy+=(E-u.vy)*.6}else u.vx=0,u.vy=0;u.x=r,u.y=a,u.time=m,(v!==u.inside||v)&&(u.inside=v,N())},ge=()=>{u.inside=!1,u.time=0,N()},Te=n=>{n.relatedTarget||ge()},Se=n=>{if(!B.current.clickShock||V)return;let[r,a]=Pe(n);r<0||a<0||r>P.width||a>P.height||(b.push({x:r,y:a,start:performance.now()}),b.length>6&&b.shift(),N())};window.addEventListener("pointermove",Fe,{passive:!0}),window.addEventListener("pointerdown",Se,{passive:!0}),window.addEventListener("pointerout",Te),window.addEventListener("blur",ge);let Le=new ResizeObserver(()=>{ve(),N()});Le.observe(A);let ze=new IntersectionObserver(([n])=>{f=n.isIntersecting,f&&N()});ze.observe(A);let c=()=>{document.hidden?(cancelAnimationFrame(C),C=0):N()};return document.addEventListener("visibilitychange",c),ve(),N(),de.current={rebuild:()=>{ce(),q(performance.now()),N()},refresh:()=>{q(performance.now()),N()}},()=>{cancelAnimationFrame(C),Le.disconnect(),ze.disconnect(),window.removeEventListener("pointermove",Fe),window.removeEventListener("pointerdown",Se),window.removeEventListener("pointerout",Te),window.removeEventListener("blur",ge),document.removeEventListener("visibilitychange",c),t.deleteBuffer(e),t.deleteBuffer(me),t.deleteVertexArray(O),t.deleteProgram(I),de.current=null}},[]),re(()=>{var A;(A=de.current)==null||A.rebuild()},[o,i]),re(()=>{var A;(A=de.current)==null||A.refresh()},[d,l,Be,Oe,Ue,ke,Ge,Ne,be,s,Xe]),ue("div",{className:`dot-grid ${ot}`.trim(),style:qe},ue("canvas",{ref:Me,className:"dot-grid__canvas"}))},bt=Nt;var Rt={color:"#7fb2e0",beamWidth:150,rotation:30,speed:.8,brightness:1.2,glow:.5,grain:.3,backgroundColor:"#00050d",mouseStrength:.6},At={dotSize:2,gap:22,baseColor:"#2a4a68",activeColor:"#d6e9fa",proximity:180,strength:1.2,swell:1.4,glow:1,opacity:.9,shockRadius:280,shockStrength:5},Mt={position:"absolute",inset:"0",width:"100%",height:"100%"};function Xt(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}function lt(o,i){if(!Xt())return()=>{};let d=[];return o&&d.push(De(pt,{...Rt,style:Mt},o)),i&&d.push(De(bt,{...At,style:Mt},i)),document.documentElement.classList.add("hero-bg-ready"),()=>d.forEach(l=>l())}function Et(){var M;let o=document.querySelector("[data-hero-beams]"),i=document.querySelector("[data-hero-dots]");if(!o&&!i)return;if(!(document.documentElement.classList.contains("qd-intro-pending")||((M=window.quilleIntro)==null?void 0:M.active))){lt(o,i);return}let l=!1,s=()=>{l||(l=!0,lt(o,i))};document.addEventListener("quille-intro-leave",s,{once:!0}),document.addEventListener("quille-intro-done",s,{once:!0}),setTimeout(s,8e3)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Et,{once:!0}):Et();return It(qt);})();
