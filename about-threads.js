/* Quille Designs "About us" background. Threads from React Bits (https://reactbits.dev) by David Haz. MIT + Commons Clause License, Copyright (c) 2026 David Haz. Used as part of this website only. */
(()=>{var H=[];var E=r=>({current:r}),$=r=>{H.push(r)},ke="fragment";function b(r,u,...l){if(u=u||{},typeof r=="function")return r({...u,children:l});let s=r===ke?document.createDocumentFragment():document.createElement(r);for(let[i,o]of Object.entries(u))o==null||o===!1||i==="children"||(i==="ref"?o.current=s:i==="className"?s.className=o:i==="style"&&typeof o=="object"?Object.assign(s.style,o):i.startsWith("on")||s.setAttribute(i,o===!0?"":o));for(let i of l.flat(1/0))i==null||i===!1||i===!0||s.append(i instanceof Node?i:String(i));return s}function ye(r,u,l){H=[];let s=r(u);l.append(s);let i=H.splice(0).map(o=>o()).filter(o=>typeof o=="function");return()=>{i.forEach(o=>o()),s.remove()}}var Xe=`#version 300 es
precision highp float;
in vec2 aPoint;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFrame;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uCount;
uniform float uThickness;
uniform float uSoftness;
uniform float uWaves;
uniform float uSplit;
uniform float uFray;
uniform float uSeed;
uniform vec2 uTurn;
uniform vec4 uPart;
uniform float uTaper;
out float vEdge;
out float vBand;
out float vDraw;
out float vAlpha;
out float vIndex;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

void main() {
  float perc = float(gl_InstanceID) / uCount;
  float x = aPoint.x;
  float pixel = 1.0 / max(uResolution.x, uResolution.y);
  float splitPoint = uSplit + perc * uFray;
  float amplitudeNormal = smoothstep(splitPoint, max(0.7, splitPoint + 0.2), x);
  float finalAmplitude = amplitudeNormal * 0.5 * uAmplitude * (1.0 + (uMouse.y - 0.5) * 0.2);
  float timeScaled = uTime / 10.0 + (uMouse.x - 0.5);
  float blur = smoothstep(splitPoint, splitPoint + 0.05, x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(timeScaled * 2.5 + uSeed, (x * uWaves + perc) * 2.5)),
    Perlin2D(vec2(timeScaled * 3.5 + uSeed, (x * uWaves + timeScaled) * 3.5)) / 1.5,
    x * 0.3
  );
  float y = 0.5 + (perc - 0.5) * uDistance + xnoise / 2.0 * finalAmplitude;
  vec2 local = vec2((x - 0.5) * uFrame.x, (y - 0.5) * uFrame.y);
  if (uPart.z > 0.0) {
    vec2 delta = local - uPart.xy;
    float reach = uPart.w;
    float pull = exp(-dot(delta, delta) / (reach * reach));
    local.y += delta.y * pull * uPart.z;
  }
  float width = 7.0 * uThickness * pixel * (1.0 - perc);
  float band = (width / 2.0 + 10.0 * uSoftness * pixel * blur) * uFrame.y;
  float draw = max(band, 1.0);
  local.y += aPoint.y * draw;
  vec2 turned = vec2(local.x * uTurn.x - local.y * uTurn.y, local.x * uTurn.y + local.y * uTurn.x);
  gl_Position = vec4(turned / (uResolution * 0.5), 0.0, 1.0);
  vEdge = aPoint.y * draw;
  vBand = band;
  vDraw = draw;
  vAlpha = 1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3)) * uTaper;
  vIndex = perc;
}`,Ve=`#version 300 es
precision highp float;
in float vEdge;
in float vBand;
in float vDraw;
in float vAlpha;
in float vIndex;
uniform vec3 uColor;
uniform vec3 uAccent;
out vec4 outColor;
void main() {
  float coverage = (1.0 - smoothstep(0.0, vDraw, abs(vEdge))) * (vBand / vDraw) * vAlpha;
  outColor = vec4(mix(uColor, uAccent, vIndex) * coverage, coverage);
}`,ze=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ge=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uLines;
uniform vec2 uResolution;
uniform float uFade;
uniform float uOpacity;
uniform float uCurve;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / edge, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec4 lines = texture(uLines, vUv);
  float alpha = lines.a;
  vec3 color = alpha > 0.0001 ? lines.rgb / alpha : vec3(0.0);
  float mask = uOpacity;
  if (uFade > 0.0) {
    vec2 px = vUv * uResolution;
    float edge = uFade * min(uResolution.x, uResolution.y) * 0.5;
    mask *= smootherstep(edge, px.x) * smootherstep(edge, uResolution.x - px.x);
    mask *= smootherstep(edge, px.y) * smootherstep(edge, uResolution.y - px.y);
  }
  outColor = vec4(color * pow(alpha, uCurve), alpha) * mask;
}`,Ee=1920,x=(r,u,l)=>Math.min(l,Math.max(u,r)),be=(r,u,l)=>{let s=r.createShader(u);return s?(r.shaderSource(s,l),r.compileShader(s),r.getShaderParameter(s,r.COMPILE_STATUS)?s:(r.deleteShader(s),null)):null},Pe=(r,u,l)=>{let s=be(r,r.VERTEX_SHADER,u),i=be(r,r.FRAGMENT_SHADER,l),o=r.createProgram();return!s||!i||!o?null:(r.attachShader(o,s),r.attachShader(o,i),r.linkProgram(o),r.deleteShader(s),r.deleteShader(i),r.getProgramParameter(o,r.LINK_STATUS)?o:(r.deleteProgram(o),null))},Re=(r,u,l)=>{let s={};for(let i of l)s[i]=r.getUniformLocation(u,i);return s},We=({color:r=[1,1,1],accentColor:u,amplitude:l=1.7,distance:s=.4,enableMouseInteraction:i=!1,lineCount:o=90,thickness:v=.6,softness:p=1.3,speed:h=.6,waves:_=1.05,split:k=.04,fray:L=.5,angle:X=25,seed:B=0,parting:F=0,taper:Me=.85,brightness:_e=1.4,fade:Fe=0,opacity:we=1,paused:Se=!1,...Ce})=>{let J=E(null),Z=E(null),I=E(null),De=`${Array.isArray(r)?r.join(","):String(r)}|${Array.isArray(u)?u.join(","):String(u??"")}`,ee={color:r,accentColor:u,colorKey:De,amplitude:l,distance:s,enableMouseInteraction:i,lineCount:x(Math.round(o),1,400),thickness:Math.max(0,v),softness:Math.max(0,p),speed:h,waves:Math.max(0,_),split:x(k,0,1),fray:x(L,0,1),angle:X,seed:B,parting:x(F,0,1),taper:x(Me,0,1),brightness:x(_e,.25,2),fade:x(Fe,0,1),opacity:x(we,0,1),paused:Se},N=E(ee);N.current=ee,$(()=>{let P=J.current,g=Z.current,e=g?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!P||!g||!e)return;let w=Pe(e,Xe,Ve),S=Pe(e,ze,Ge);if(!w||!S)return;let f=Re(e,w,["uTime","uResolution","uFrame","uAmplitude","uDistance","uMouse","uCount","uThickness","uSoftness","uWaves","uSplit","uFray","uSeed","uTurn","uPart","uTaper","uColor","uAccent"]),C=Re(e,S,["uLines","uResolution","uFade","uOpacity","uCurve"]),V=e.createVertexArray(),z=e.createBuffer();e.bindVertexArray(V),e.bindBuffer(e.ARRAY_BUFFER,z);let re=e.getAttribLocation(w,"aPoint");e.enableVertexAttribArray(re),e.vertexAttribPointer(re,2,e.FLOAT,!1,0,0);let G=e.createVertexArray(),oe=e.createBuffer();e.bindVertexArray(G),e.bindBuffer(e.ARRAY_BUFFER,oe),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let ae=e.getAttribLocation(S,"aPosition");e.enableVertexAttribArray(ae),e.vertexAttribPointer(ae,2,e.FLOAT,!1,0,0),e.bindVertexArray(null);let D=e.createTexture(),W=e.createFramebuffer();e.bindTexture(e.TEXTURE_2D,D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let q=document.createElement("canvas");q.width=1,q.height=1;let R=q.getContext("2d",{willReadFrequently:!0}),Le=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,t={time:0,width:1,height:1,segments:0,colorKey:"",color:[1,1,1],accent:[1,1,1],mouse:[.5,.5],targetMouse:[.5,.5],pointer:[0,0],targetPointer:[0,0],presence:0,inside:!1},A=0,T=0,O=!0,Y=!0,ie=n=>{if(Array.isArray(n))return[0,1,2].map(m=>x(Number(n[m]??1),0,1));if(!R)return[1,1,1];R.clearRect(0,0,1,1),R.fillStyle="#ffffff",R.fillStyle=String(n),R.fillRect(0,0,1,1);let[a,c,d]=R.getImageData(0,0,1,1).data;return[a/255,c/255,d/255]},Be=n=>{n.colorKey!==t.colorKey&&(t.colorKey=n.colorKey,t.color=ie(n.color),t.accent=n.accentColor===void 0||n.accentColor===null?t.color:ie(n.accentColor))},Ie=n=>{if(n===t.segments)return;t.segments=n;let a=new Float32Array((n+1)*4);for(let c=0;c<=n;c++){let d=c/n;a.set([d,-1,d,1],c*4)}e.bindBuffer(e.ARRAY_BUFFER,z),e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW)},se=()=>{let n=Math.max(1,P.clientWidth),a=Math.max(1,P.clientHeight),c=Math.min(window.devicePixelRatio||1,2),d=Math.max(n,a)*c,m=d>Ee?c*Ee/d:c;g.width=Math.max(1,Math.round(n*m)),g.height=Math.max(1,Math.round(a*m)),t.width=n,t.height=a,e.bindTexture(e.TEXTURE_2D,D),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,g.width,g.height,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindFramebuffer(e.FRAMEBUFFER,W),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,D,0),e.bindFramebuffer(e.FRAMEBUFFER,null),Ie(x(Math.round(n/3),96,640)),K()},K=()=>{let n=N.current;Be(n);let a=g.width,c=g.height,d=n.angle*Math.PI/180,m=Math.cos(d),y=Math.sin(d),j=Math.abs(a*m)+Math.abs(c*y),Ne=Math.abs(a*y)+Math.abs(c*m),pe=a/t.width,he=n.enableMouseInteraction?t.mouse:[.5,.5],Oe=n.parting*t.presence*2,ve=t.pointer[0]*pe,xe=t.pointer[1]*pe,ge=[ve*m+xe*y,-ve*y+xe*m];e.bindFramebuffer(e.FRAMEBUFFER,W),e.viewport(0,0,a,c),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.useProgram(w),e.uniform1f(f.uTime,t.time),e.uniform2f(f.uResolution,a,c),e.uniform2f(f.uFrame,j,Ne),e.uniform1f(f.uAmplitude,n.amplitude),e.uniform1f(f.uDistance,n.distance),e.uniform2f(f.uMouse,he[0],he[1]),e.uniform1f(f.uCount,n.lineCount),e.uniform1f(f.uThickness,n.thickness),e.uniform1f(f.uSoftness,n.softness),e.uniform1f(f.uWaves,n.waves),e.uniform1f(f.uSplit,n.split),e.uniform1f(f.uFray,n.fray),e.uniform1f(f.uSeed,n.seed*13.37),e.uniform2f(f.uTurn,m,y),e.uniform4f(f.uPart,ge[0],ge[1],Oe,Math.min(a,c)*.16),e.uniform1f(f.uTaper,n.taper),e.uniform3f(f.uColor,t.color[0],t.color[1],t.color[2]),e.uniform3f(f.uAccent,t.accent[0],t.accent[1],t.accent[2]),e.bindVertexArray(V),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,(t.segments+1)*2,n.lineCount),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,a,c),e.disable(e.BLEND),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(S),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,D),e.uniform1i(C.uLines,0),e.uniform2f(C.uResolution,a,c),e.uniform1f(C.uFade,n.fade),e.uniform1f(C.uOpacity,n.opacity),e.uniform1f(C.uCurve,2/n.brightness),e.bindVertexArray(G),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null)},ue=n=>{if(A=0,!Y||!O||document.hidden)return;let a=N.current,c=T?Math.min(.05,(n-T)/1e3):1/60;T=n;let d=!a.paused&&!Le;d&&(t.time+=c*a.speed);let m=1-Math.exp(-c*3);t.mouse[0]+=(t.targetMouse[0]-t.mouse[0])*m,t.mouse[1]+=(t.targetMouse[1]-t.mouse[1])*m;let y=1-Math.exp(-c*10);t.pointer[0]+=(t.targetPointer[0]-t.pointer[0])*y,t.pointer[1]+=(t.targetPointer[1]-t.pointer[1])*y,t.presence+=((t.inside&&a.parting>0?1:0)-t.presence)*(1-Math.exp(-c*4)),K();let j=Math.abs(t.targetMouse[0]-t.mouse[0])>5e-4||Math.abs(t.targetMouse[1]-t.mouse[1])>5e-4||Math.abs(t.targetPointer[0]-t.pointer[0])>.05||Math.abs(t.targetPointer[1]-t.pointer[1])>.05||Math.abs((t.inside&&a.parting>0?1:0)-t.presence)>.002;d||j?A=requestAnimationFrame(ue):T=0},U=()=>{!A&&Y&&O&&!document.hidden&&(A=requestAnimationFrame(ue))},ce=n=>{let a=P.getBoundingClientRect(),c=(n.clientX-a.left)/Math.max(1,a.width),d=(n.clientY-a.top)/Math.max(1,a.height),m=c>=0&&c<=1&&d>=0&&d<=1;m?(t.targetMouse=[c,1-d],t.targetPointer=[n.clientX-a.left-a.width/2,a.height/2-(n.clientY-a.top)],!t.inside&&t.presence<.01&&(t.pointer=[...t.targetPointer])):t.inside&&(t.targetMouse=[.5,.5]),t.inside=m,U()},le=()=>{t.inside=!1,t.targetMouse=[.5,.5],U()},fe=()=>{T=0,U()},de=new ResizeObserver(se);de.observe(P);let me=new IntersectionObserver(n=>{O=n.some(a=>a.isIntersecting),O&&(T=0,U())});return me.observe(P),window.addEventListener("pointermove",ce,{passive:!0}),document.documentElement.addEventListener("pointerleave",le),document.addEventListener("visibilitychange",fe),se(),I.current=()=>{A||K(),U()},()=>{Y=!1,cancelAnimationFrame(A),I.current=null,de.disconnect(),me.disconnect(),window.removeEventListener("pointermove",ce),document.documentElement.removeEventListener("pointerleave",le),document.removeEventListener("visibilitychange",fe),e.deleteFramebuffer(W),e.deleteTexture(D),e.deleteBuffer(z),e.deleteBuffer(oe),e.deleteVertexArray(V),e.deleteVertexArray(G),e.deleteProgram(w),e.deleteProgram(S)}},[]),$(()=>{I.current?.()});let{className:te="",control:ne,...Ue}=Ce;return ne&&(ne.current={settings:N,wake:()=>I.current?.()}),b("div",{ref:J,className:`threads-container${te?` ${te}`:""}`,...Ue},b("canvas",{ref:Z,className:"threads-canvas","aria-hidden":"true"}))},Ae=We;var M=[{amplitude:2.1,distance:.55,brightness:1.15,angle:28,speed:.35,parting:.6},{amplitude:1.6,distance:.4,brightness:1.25,angle:22,speed:.45,parting:.6},{amplitude:1.1,distance:.26,brightness:1.4,angle:16,speed:.55,parting:.6},{amplitude:.65,distance:.14,brightness:1.6,angle:10,speed:.6,parting:.6}],qe={color:"#4a86bd",accentColor:"#7fb2e0",lineCount:70,thickness:.6,softness:1.3,waves:1.05,fray:.5,taper:.85,opacity:.85,enableMouseInteraction:!0},Ye=(r,u,l)=>r+(u-r)*l;function Q(r,u){let l=E(null),s=ye(Ae,{...qe,...M[0],control:l,style:{position:"absolute",inset:"0",width:"100%",height:"100%"}},r),i=0,o=0,v=!0,p=()=>{if(!v)return;i=requestAnimationFrame(p);let h=Math.max(0,Math.min(M.length-1,u()));if(Math.abs(h-o)<.001)return;o+=(h-o)*.08;let _=Math.min(M.length-2,Math.floor(o)),k=o-_,L=M[_],X=M[_+1],B=l.current&&l.current.settings.current;if(B){for(let F of Object.keys(L))B[F]=Ye(L[F],X[F],k);l.current.wake()}};return i=requestAnimationFrame(p),()=>{v=!1,cancelAnimationFrame(i),s()}}typeof window<"u"&&(window.QuilleThreads={mount:Q,STEPS:M});function Ke(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}function Te(){let r=document.querySelector("[data-process-threads]"),u=document.getElementById("process");if(!r||!u||!Ke())return;let l=[...u.querySelectorAll("[data-step]")],s=()=>{if(!l.length)return 0;let v=innerHeight*.5,p=l.map(h=>h.getBoundingClientRect().top);if(v<=p[0])return 0;for(let h=0;h<p.length-1;h++)if(v<p[h+1])return h+(v-p[h])/(p[h+1]-p[h]);return p.length-1},i=()=>{Q(r,s),u.classList.add("process-threads-ready")};if(!("IntersectionObserver"in window)){i();return}let o=new IntersectionObserver(v=>{v.some(p=>p.isIntersecting)&&(o.disconnect(),i())},{rootMargin:"100% 0px"});o.observe(u)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te,{once:!0}):Te();})();
