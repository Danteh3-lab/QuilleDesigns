/* Quille Designs hero background. Landing band and Dot Grid from React Bits (https://reactbits.dev) by David Haz. MIT + Commons Clause License, Copyright (c) 2026 David Haz. Used as part of this website only. */
var QuilleHeroBackground=(()=>{var Ve=Object.defineProperty;var Rt=Object.getOwnPropertyDescriptor;var Mt=Object.getOwnPropertyNames;var bt=Object.prototype.hasOwnProperty;var Ft=(o,n)=>{for(var d in n)Ve(o,d,{get:n[d],enumerable:!0})},St=(o,n,d,u)=>{if(n&&typeof n=="object"||typeof n=="function")for(let f of Mt(n))!bt.call(o,f)&&f!==d&&Ve(o,f,{get:()=>n[f],enumerable:!(u=Rt(n,f))||u.enumerable});return o};var Et=o=>St(Ve({},"__esModule",{value:!0}),o);var Pt={};Ft(Pt,{BAND:()=>pt,DOTS:()=>gt,mount:()=>je});var We=[],he=o=>({current:o}),ve=o=>{We.push(o)},Lt="fragment";function ne(o,n,...d){if(n=n||{},typeof o=="function")return o({...n,children:d});let u=o===Lt?document.createDocumentFragment():document.createElement(o);for(let[f,A]of Object.entries(n))A==null||A===!1||f==="children"||(f==="ref"?A.current=u:f==="className"?u.className=A:f==="style"&&typeof A=="object"?Object.assign(u.style,A):f.startsWith("on")||u.setAttribute(f,A===!0?"":A));for(let f of d.flat(1/0))f==null||f===!1||f===!0||u.append(f instanceof Node?f:String(f));return u}function Xe(o,n,d){We=[];let u=o(n);d.append(u);let f=We.splice(0).map(A=>A()).filter(A=>typeof A=="function");return()=>{f.forEach(A=>A()),u.remove()}}var Bt=`
precision mediump float;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform vec3 uColor;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform float uNoise;
uniform float uBandWidth;
uniform float uYOffset;
uniform float uFadeTop;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform int uIterations;
uniform float uIntensity;
uniform float uLightMode;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;
  uv.y += uYOffset;
  vec2 p = uv * 2.0 - 1.0;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  float aspect = uCanvas.x / uCanvas.y;
  vec2 q = vec2(rp.x * aspect, rp.y);
  float invScale = 1.0 / max(uScale, 0.0001);
  q *= invScale;
  q /= 0.5 + 0.2 * dot(q, q);
  q += (uPointer - rp) * uMouseInfluence * 0.2;
  q += 0.2 * cos(t) - 7.56;

  for (int i = 0; i < 5; i++) {
    if (i >= uIterations) break;
    vec2 r = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q = q + (r - q) * uWarpStrength;
  }

  float m = length(q + sin(5.0 * q.y * uFrequency - 3.0 * t) * 0.25);

  float w = 1.0 - exp(-6.0 / exp(6.0 * m));
  w = pow(clamp(w, 0.0, 1.0), uBandWidth);
  w *= smoothstep(uFadeTop, 0.0, vUv.y);
  w *= uIntensity;

  float grain = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;

  if (uLightMode > 0.5) {
    float alpha = clamp(w * 0.78, 0.0, 0.8);
    vec3 lightCol = mix(vec3(1.0), uColor, 0.96);
    lightCol = clamp(lightCol + uColor * grain * uNoise * 0.45, 0.0, 1.0);
    gl_FragColor = vec4(lightCol * alpha, alpha);
    return;
  }

  vec3 col = uColor * w;
  col += grain * uNoise;
  col = clamp(col, 0.0, 1.0) * w;

  gl_FragColor = vec4(col, w);
}
`,Ct=`attribute vec2 position;
varying vec2 vUv;
void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`;function ut({className:o="",style:n,color:d="#A855F7",rotation:u=0,speed:f=.2,scale:A=1,frequency:Oe=1,warpStrength:Pe=11,noise:De=.05,bandWidth:Ne=1.4,yOffset:Ue=0,fadeTop:Ae=.3,mouseInfluence:Re=.3,iterations:Me=1,intensity:be=1}){let pe=he(null),Fe=ne("div",{ref:pe,className:o,style:n});return ve(()=>{let D=pe.current,z=document.createElement("canvas");z.style.cssText="width:100%;height:100%;display:block;";let t=null;try{t=z.getContext("webgl",{antialias:!1,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance"})}catch{}if(!t)return;D.append(z);let ge=(s,q)=>{let F=t.createShader(s);return t.shaderSource(F,q),t.compileShader(F),F},j=t.createProgram();t.attachShader(j,ge(t.VERTEX_SHADER,Ct)),t.attachShader(j,ge(t.FRAGMENT_SHADER,Bt)),t.linkProgram(j),t.useProgram(j),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);let Se=t.getAttribLocation(j,"position");t.enableVertexAttribArray(Se),t.vertexAttribPointer(Se,2,t.FLOAT,!1,0,0);let y=s=>t.getUniformLocation(j,s),le=d.replace("#","");t.uniform3f(y("uColor"),parseInt(le.slice(0,2),16)/255,parseInt(le.slice(2,4),16)/255,parseInt(le.slice(4,6),16)/255);let oe=u*Math.PI/180;t.uniform2f(y("uRot"),Math.cos(oe),Math.sin(oe)),t.uniform1f(y("uSpeed"),f),t.uniform1f(y("uScale"),A),t.uniform1f(y("uFrequency"),Oe),t.uniform1f(y("uWarpStrength"),Pe),t.uniform1f(y("uNoise"),De),t.uniform1f(y("uBandWidth"),Ne),t.uniform1f(y("uYOffset"),Ue),t.uniform1f(y("uFadeTop"),Ae),t.uniform1f(y("uMouseInfluence"),Re),t.uniform1i(y("uIterations"),Me),t.uniform1f(y("uIntensity"),be),t.uniform1f(y("uLightMode"),0),t.clearColor(0,0,0,0);let Ee=y("uCanvas"),L=y("uTime"),I=y("uPointer"),e=D.getBoundingClientRect(),T=()=>{let s=D.clientWidth||1,q=D.clientHeight||1;z.width=s,z.height=q,t.viewport(0,0,s,q),t.uniform2f(Ee,s,q),e=D.getBoundingClientRect()};T();let b="ResizeObserver"in window?new ResizeObserver(T):null;b?b.observe(D):window.addEventListener("resize",T);let ue=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,re={x:0,y:0},O={x:0,y:0},$=s=>{e=D.getBoundingClientRect(),re.x=(s.clientX-e.left)/(e.width||1)*2-1,re.y=-((s.clientY-e.top)/(e.height||1)*2-1)};ue||window.addEventListener("mousemove",$,{passive:!0});let g=0,R=performance.now(),B=0,h=!0,v=()=>{t.uniform1f(L,g),t.uniform2f(I,O.x,O.y),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_STRIP,0,4)},K=s=>{B=requestAnimationFrame(K);let q=Math.min((s-R)/1e3,.05);if(R=s,!h)return;g+=q;let F=Math.min(1,q*4);O.x+=(re.x-O.x)*F,O.y+=(re.y-O.y)*F,v()},k="IntersectionObserver"in window?new IntersectionObserver(([s])=>{h=s.isIntersecting}):null;return k&&k.observe(D),ue?v():B=requestAnimationFrame(K),()=>{cancelAnimationFrame(B),k&&k.disconnect(),b?b.disconnect():window.removeEventListener("resize",T),window.removeEventListener("mousemove",$);let s=t.getExtension("WEBGL_lose_context");s&&s.loseContext(),z.remove()}}),Fe}var It=`#version 300 es
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
`,Tt=`#version 300 es
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
`,ft=o=>{let n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(o).trim());if(!n)return[1,1,1];let d=n[1].length===3?n[1].replace(/./g,u=>u+u):n[1];return[0,2,4].map(u=>parseInt(d.slice(u,u+2),16)/255)},He=o=>{let n=Math.min(1,Math.max(0,o));return n*n*n*(n*(n*6-15)+10)},qt=o=>{let d=o-1;return 1+d*d*((1.9+1)*d+1.9)},dt=(o,n,d)=>{let u=o.createShader(n);return o.shaderSource(u,d),o.compileShader(u),u},_t=({dotSize:o=5,gap:n=18,baseColor:d="#3a3446",activeColor:u="#ffffff",proximity:f=140,strength:A=1,bounce:Oe=.6,tension:Pe=.4,returnDuration:De=.8,shockRadius:Ne=320,shockStrength:Ue=5,swell:Ae=.8,stretch:Re=.5,glow:Me=.5,shape:be="circle",fade:pe=0,opacity:Fe=1,intro:D=!0,mouseInteraction:z=!0,clickShock:t=!0,paused:ge=!1,dpr:j,className:Se="",style:y})=>{let le=he(null),oe=he(null),Ee={dotSize:o,gap:n,baseColor:d,activeColor:u,proximity:f,strength:A,bounce:Oe,tension:Pe,returnDuration:De,shockRadius:Ne,shockStrength:Ue,swell:Ae,stretch:Re,glow:Me,shape:be,fade:pe,opacity:Fe,intro:D,mouseInteraction:z,clickShock:t,paused:ge,dpr:j},L=he(Ee);return L.current=Ee,ve(()=>{let I=le.current;if(!I)return;let e=I.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!e)return;let T=e.createProgram();if(e.attachShader(T,dt(e,e.VERTEX_SHADER,It)),e.attachShader(T,dt(e,e.FRAGMENT_SHADER,Tt)),e.linkProgram(T),!e.getProgramParameter(T,e.LINK_STATUS))return;let b={};for(let a of["uResolution","uSize","uSwell","uStretch","uGlow","uBase","uActive","uOpacity","uFade","uShape"])b[a]=e.getUniformLocation(T,a);let ue=e.createVertexArray();e.bindVertexArray(ue);let re=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,re),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let O=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,O),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,24,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,2,e.FLOAT,!1,24,16),e.vertexAttribDivisor(2,1),e.bindVertexArray(null);let $=window.matchMedia("(prefers-reduced-motion: reduce)").matches,g={width:0,height:0,left:0,top:0,ratio:1},R={count:0,cols:1,rows:1,cell:1,centerX:0,centerY:0,reach:1},B=new Float32Array(0),h=new Float32Array(0),v=new Float32Array(0),K=new Float32Array(0),k=new Float32Array(0),s=new Float32Array(0),q=new Float32Array(0),F=new Float32Array(0),r={x:0,y:0,vx:0,vy:0,time:0,inside:!1,presence:0},ie=[],P=L.current.intro&&!$?-1:null,Le=!0,ae=0,Ye=0,$e=()=>{let{dotSize:a,gap:i}=L.current,c=Math.max(2,a+i),M=Math.max(1,Math.floor((g.width+i)/c)),_=Math.max(1,Math.floor((g.height+i)/c)),N=(g.width-(M*c-i))/2+a/2,C=(g.height-(_*c-i))/2+a/2,x=M*_;B=new Float32Array(x*2),h=new Float32Array(x*2),v=new Float32Array(x*2),K=new Float32Array(x*2),k=new Float32Array(x*2),s=new Float32Array(x*4),q=new Float32Array(x),F=new Float32Array(x*6);for(let E=0;E<_;E++)for(let w=0;w<M;w++){let U=(E*M+w)*2;B[U]=N+w*c,B[U+1]=C+E*c}Object.assign(R,{count:x,cols:M,rows:_,cell:c,centerX:g.width/2,centerY:g.height/2,reach:Math.hypot(g.width,g.height)/2}),e.bindBuffer(e.ARRAY_BUFFER,O),e.bufferData(e.ARRAY_BUFFER,F.byteLength,e.DYNAMIC_DRAW)},Ke=()=>{let a=I.getBoundingClientRect(),i=Math.min(L.current.dpr??window.devicePixelRatio??1,2),c=Math.max(1,Math.round(a.width)),M=Math.max(1,Math.round(a.height));Object.assign(g,{width:c,height:M,left:a.left,top:a.top,ratio:i}),I.width=Math.round(c*i),I.height=Math.round(M*i),$e(),Be(performance.now())},yt=(a,i)=>{let c=L.current,M=$?0:1,_=1-.85*Math.min(1,Math.max(0,c.bounce)),N=4/(_*Math.max(.2,c.returnDuration)),C=N*N,x=2*_*N,E=Math.max(1,c.proximity),w=Math.hypot(r.vx,r.vy),U=c.mouseInteraction&&r.inside?6500*Math.tanh(w/900)*c.strength*M:0,Ce=w>.001?r.vx/w:0,Ie=w>.001?r.vy/w:0,V=R.cell*1.4,ye=650,W=ie.map(p=>{let m=(i-p.start)/1e3*ye,S=He(1-m/Math.max(1,c.shockRadius));return{...p,front:m,amplitude:S*c.shockStrength*R.cell*.24*M}}),Y=(Math.max(0,c.tension)*900)**2/(R.cell*R.cell),ce=Math.sqrt(Y)*.06,wt=Math.sqrt(C+8*Y)+x+8*ce,it=Math.min(24,Math.max(1,Math.ceil(a/Math.min(1/120,1.2/wt)))),ke=a/it;for(let p=0;p<R.count;p++){let m=p*2,S=B[m],l=B[m+1],fe=0,de=0;if(U>0){let X=S+h[m]-r.x,xe=l+h[m+1]-r.y,H=Math.hypot(X,xe);if(H<E){let se=He(1-H/E)*U,me=H>.001?X/H:0,we=H>.001?xe/H:0;fe+=se*(Ce+me*.6),de+=se*(Ie+we*.6)}}let Q=0,Z=0,ee=0,te=0;for(let X of W){if(X.amplitude<=0)continue;let xe=S-X.x,H=l-X.y,se=Math.hypot(xe,H),me=(se-X.front)/V;if(Math.abs(me)<3&&se>.001){let we=xe/se,Ge=H/se,st=Math.exp(-me*me),_e=X.amplitude*st,lt=X.amplitude*2*me*st/V*ye;Q+=we*_e,Z+=Ge*_e,ee+=we*lt,te+=Ge*lt,fe+=we*_e*C*.35,de+=Ge*_e*C*.35}}K[m]=fe,K[m+1]=de;let qe=p*4;s[qe]=Q,s[qe+1]=Z,s[qe+2]=ee,s[qe+3]=te}let{cols:Te,rows:at}=R,J=Te*2;for(let p=0;p<it;p++){for(let m=0;m<at;m++)for(let S=0;S<Te;S++){let l=(m*Te+S)*2,fe=K[l]-C*h[l]-x*v[l],de=K[l+1]-C*h[l+1]-x*v[l+1];if(Y>0){let Q=-4*h[l],Z=-4*h[l+1],ee=-4*v[l],te=-4*v[l+1];S>0&&(Q+=h[l-2],Z+=h[l-1],ee+=v[l-2],te+=v[l-1]),S<Te-1&&(Q+=h[l+2],Z+=h[l+3],ee+=v[l+2],te+=v[l+3]),m>0&&(Q+=h[l-J],Z+=h[l-J+1],ee+=v[l-J],te+=v[l-J+1]),m<at-1&&(Q+=h[l+J],Z+=h[l+J+1],ee+=v[l+J],te+=v[l+J+1]),fe+=Y*Q+ce*ee,de+=Y*Z+ce*te}k[l]=v[l]+fe*ke,k[l+1]=v[l+1]+de*ke}for(let m=0;m<h.length;m++)v[m]=k[m],h[m]+=v[m]*ke}for(let p=0;p<R.count;p++){let m=p*2,S=p*4;q[p]=Math.min(1,Math.hypot(v[m]+s[S+2],v[m+1]+s[S+3])/380*.85+Math.hypot(h[m]+s[S],h[m+1]+s[S+1])/(R.cell*2.2)*.35)}for(let p=ie.length-1;p>=0;p--)W[p].front>c.shockRadius+V*3&&ie.splice(p,1);let ct=1-Math.exp(-a/.08);r.vx-=r.vx*ct,r.vy-=r.vy*ct;let At=c.mouseInteraction&&r.inside?1:0;r.presence+=(At-r.presence)*(1-Math.exp(-a/.2))},Be=a=>{let i=L.current,c=Math.max(1,i.proximity),_=(P===null?1/0:P<0?0:(a-P)/1e3)*R.reach*1.25,N=R.cell*4;for(let E=0;E<R.count;E++){let w=E*2,U=E*4,Ce=B[w]+h[w]+s[U],Ie=B[w+1]+h[w+1]+s[U+1],V=q[E];if(r.presence>.001){let Y=Math.hypot(Ce-r.x,Ie-r.y);Y<c&&(V=Math.max(V,He(1-Y/c)*.4*r.presence))}let ye=1;if(P!==null){let Y=Math.hypot(B[w]-R.centerX,B[w+1]-R.centerY),ce=Math.min(1,Math.max(0,(_-Y)/N));ye=ce>=1?1:Math.max(0,qt(ce)),V=Math.max(V,Math.sin(ce*Math.PI)*.6)}let W=E*6;F[W]=Ce,F[W+1]=Ie,F[W+2]=v[w]+s[U+2],F[W+3]=v[w+1]+s[U+3],F[W+4]=V,F[W+5]=ye}let C=ft(i.baseColor),x=ft(i.activeColor);e.viewport(0,0,I.width,I.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.useProgram(T),e.uniform2f(b.uResolution,g.width,g.height),e.uniform1f(b.uSize,Math.max(.5,i.dotSize)),e.uniform1f(b.uSwell,$?0:Math.max(0,i.swell)),e.uniform1f(b.uStretch,$?0:Math.max(0,i.stretch)),e.uniform1f(b.uGlow,Math.max(0,i.glow)),e.uniform3f(b.uBase,C[0],C[1],C[2]),e.uniform3f(b.uActive,x[0],x[1],x[2]),e.uniform1f(b.uOpacity,Math.min(1,Math.max(0,i.opacity))),e.uniform1f(b.uFade,Math.min(1,Math.max(0,i.fade))),e.uniform1i(b.uShape,i.shape==="square"?1:0),e.bindVertexArray(ue),e.bindBuffer(e.ARRAY_BUFFER,O),e.bufferSubData(e.ARRAY_BUFFER,0,F),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,R.count),e.bindVertexArray(null)},xt=a=>{if(ie.length)return!1;if(P!==null){if(P<0||(a-P)/1e3<1.6)return!1;P=null}if(Math.abs(r.vx)+Math.abs(r.vy)>1)return!1;let i=L.current.mouseInteraction&&r.inside?1:0;if(Math.abs(i-r.presence)>.002)return!1;for(let c=0;c<h.length;c++)if(Math.abs(h[c])>.02||Math.abs(v[c])>.5)return!1;return!0},Je=a=>{if(ae=0,L.current.paused||!Le)return;P!==null&&P<0&&(P=a);let i=Math.min(.05,(a-Ye)/1e3||0);Ye=a,yt(i,a),Be(a),xt(a)||(ae=requestAnimationFrame(Je))},G=()=>{ae||L.current.paused||!Le||(Ye=performance.now(),ae=requestAnimationFrame(Je))},Qe=a=>{let i=I.getBoundingClientRect();return g.left=i.left,g.top=i.top,[a.clientX-i.left,a.clientY-i.top]},Ze=a=>{if(!L.current.mouseInteraction)return;let[i,c]=Qe(a),M=i>=0&&c>=0&&i<=g.width&&c<=g.height,_=a.timeStamp||performance.now();if(M&&r.inside&&r.time){let N=Math.max(4,_-r.time)/1e3,C=(i-r.x)/N,x=(c-r.y)/N;r.vx+=(C-r.vx)*.6,r.vy+=(x-r.vy)*.6}else r.vx=0,r.vy=0;r.x=i,r.y=c,r.time=_,(M!==r.inside||M)&&(r.inside=M,G())},ze=()=>{r.inside=!1,r.time=0,G()},et=a=>{a.relatedTarget||ze()},tt=a=>{if(!L.current.clickShock||$)return;let[i,c]=Qe(a);i<0||c<0||i>g.width||c>g.height||(ie.push({x:i,y:c,start:performance.now()}),ie.length>6&&ie.shift(),G())};window.addEventListener("pointermove",Ze,{passive:!0}),window.addEventListener("pointerdown",tt,{passive:!0}),window.addEventListener("pointerout",et),window.addEventListener("blur",ze);let nt=new ResizeObserver(()=>{Ke(),G()});nt.observe(I);let ot=new IntersectionObserver(([a])=>{Le=a.isIntersecting,Le&&G()});ot.observe(I);let rt=()=>{document.hidden?(cancelAnimationFrame(ae),ae=0):G()};return document.addEventListener("visibilitychange",rt),Ke(),G(),oe.current={rebuild:()=>{$e(),Be(performance.now()),G()},refresh:()=>{Be(performance.now()),G()}},()=>{cancelAnimationFrame(ae),nt.disconnect(),ot.disconnect(),window.removeEventListener("pointermove",Ze),window.removeEventListener("pointerdown",tt),window.removeEventListener("pointerout",et),window.removeEventListener("blur",ze),document.removeEventListener("visibilitychange",rt),e.deleteBuffer(re),e.deleteBuffer(O),e.deleteVertexArray(ue),e.deleteProgram(T),oe.current=null}},[]),ve(()=>{oe.current?.rebuild()},[o,n]),ve(()=>{oe.current?.refresh()},[d,u,Ae,Re,Me,be,pe,Fe,ge,f,z]),ne("div",{className:`dot-grid ${Se}`.trim(),style:y},ne("canvas",{ref:le,className:"dot-grid__canvas"}))},mt=_t;var pt={color:"#4a86bd",speed:.2,frequency:1,noise:.15,bandWidth:.14,rotation:90,fadeTop:.75,iterations:1,intensity:1.25,scale:1,warpStrength:1,yOffset:.3,mouseInfluence:.3},gt={dotSize:2,gap:22,baseColor:"#2a4a68",activeColor:"#d6e9fa",proximity:180,strength:1.2,swell:1.4,glow:1,opacity:.9,shockRadius:280,shockStrength:5},ht={position:"absolute",inset:"0",width:"100%",height:"100%"};function Ot(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}function je(o,n){if(!Ot())return()=>{};let d=[];return o&&d.push(Xe(ut,{...pt,style:ht},o)),n&&d.push(Xe(mt,{...gt,style:ht},n)),document.documentElement.classList.add("hero-bg-ready"),()=>d.forEach(u=>u())}function vt(){let o=document.querySelector("[data-hero-band]"),n=document.querySelector("[data-hero-dots]");if(!o&&!n)return;if(!(document.documentElement.classList.contains("qd-intro-pending")||window.quilleIntro?.active)){je(o,n);return}let u=!1,f=()=>{u||(u=!0,je(o,n))};document.addEventListener("quille-intro-leave",f,{once:!0}),document.addEventListener("quille-intro-done",f,{once:!0}),setTimeout(f,8e3)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vt,{once:!0}):vt();return Et(Pt);})();
