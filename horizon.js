/*
 * Quille Designs "Horizon": one shared background behind the partners,
 * the client testimonials and the contact section on the homepage. A dark planet rim
 * with a blue atmosphere under a starry sky; as you scroll from the
 * testimonials into "Let's start your project", a sun rises over the rim.
 * Clicking the sky raises a soft blue aurora. Original WebGL code for this
 * website (idea inspired by React Bits Pro "Horizon Bloom"; no code from it).
 */
(() => {
  'use strict';
  const wrap = document.querySelector('[data-horizon]');
  const host = wrap && wrap.querySelector('[data-horizon-canvas]');
  if (!wrap || !host) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  let gl = null;
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (_) { /* no WebGL */ }
  if (!gl) return;
  host.append(canvas);

  const VERT = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uRise;      // 0 = night (sun below the rim), 1 = sun up
uniform float uAurora;    // 0..1, raised by a click
uniform vec2 uPointer;    // -1..1, smoothed
uniform vec3 uInk;        // sky
uniform vec3 uGlow;       // atmosphere
uniform vec3 uLight;      // atmosphere highlight
uniform vec3 uSun;        // sun core

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1., 0.)), c = hash(i + vec2(0., 1.)), d = hash(i + vec2(1., 1.));
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main(){
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((vUv.x - .5) * aspect, vUv.y);
  p += uPointer * vec2(.025, .012);                       // gentle parallax

  // Planet: a huge circle whose top edge is the horizon.
  float horizon = mix(.15, .18, uRise);
  float R = 2.6;
  vec2 c = vec2(0., horizon - R);
  float d = length(p - c) - R;                            // >0 sky, <0 planet

  // Sun sits on the rim, left of centre, and climbs with uRise.
  float sx = .07 * aspect;
  vec2 rimPt = c + normalize(vec2(sx, horizon) - c) * R;
  vec2 n = normalize(rimPt - c);
  vec2 sun = rimPt + n * mix(-.04, .018, uRise);
  vec2 ds = p - sun;
  float along = abs(ds.x);

  vec3 col = uInk;

  // Sky gradient: a little lighter towards the rim, warmer near the sun.
  float skyLift = exp(-max(d, 0.) * 3.2);
  col += uGlow * .10 * skyLift;
  col += uLight * .22 * uRise * exp(-length(ds) * 2.2);

  // Stars: two layers (many faint, a few bright), twinkling, all over the sky.
  float starFade = smoothstep(.0, .06, d) * (1. - skyLift * .55) * (1. - uRise * .25);
  for (int layer = 0; layer < 2; layer++) {
    float scale = layer == 0 ? 220. : 90.;
    vec2 g = vUv * vec2(aspect, 1.) * scale + float(layer) * 31.7;
    vec2 cell = floor(g);
    float h = hash(cell);
    float limit = layer == 0 ? .90 : .955;
    if (h > limit) {
      vec2 sp = fract(g) - .5 - (vec2(hash(cell + 7.), hash(cell + 13.)) - .5) * .7;
      float tw = .5 + .5 * sin(uTime * (.7 + h * 2.6) + h * 57.);
      float size = layer == 0 ? .16 : .11;
      float bright = layer == 0 ? .45 + .4 * hash(cell + 3.) : .9;
      float star = smoothstep(size, 0., length(sp)) * mix(.35, 1., tw) * bright;
      col += vec3(.78, .87, 1.) * star * starFade;
    }
  }

  // Aurora: soft curtains above the rim, raised by a click.
  float band = smoothstep(0., .05, d) * exp(-d * 4.5);
  float curtain = noise(vec2(p.x * 3.2 + uTime * .05, uTime * .08)) * noise(vec2(p.x * 9. - uTime * .12, 1.7));
  float rays = .6 + .4 * sin(p.x * 38. + noise(vec2(p.x * 4., uTime * .2)) * 6.);
  col += mix(uGlow, uLight, .5) * band * curtain * rays * (.12 + uAurora * 1.1);

  // Atmosphere: a thin bright rim and a wider halo, strongest towards the sun.
  float toSun = exp(-along * mix(2.6, 1.6, uRise));
  float rim = exp(-abs(d) * 160.) * (.35 + 1.2 * toSun) * (.5 + .7 * uRise);
  float halo = exp(-max(d, 0.) * 14.) * smoothstep(-.012, .004, d) * (.25 + .9 * toSun) * (.4 + .8 * uRise);
  col += uLight * rim + uGlow * halo * .9;

  // Planet surface: near-black navy, lit faintly just under the rim.
  if (d < 0.) {
    float under = exp(d * 22.);
    vec3 ground = uInk * .55 + uGlow * .05;
    ground += uGlow * under * (.18 + .5 * toSun * uRise);
    ground += noise(p * vec2(18., 60.)) * .012;
    col = mix(col, ground, smoothstep(0., -.006, d));
  }

  // Sun: core visible only above the rim, a halo and a horizontal flare.
  float sunVis = smoothstep(-.004, .01, d + .002);
  float core = exp(-length(ds) * 120.) * sunVis;
  float glow = exp(-length(ds) * 11.) * .4;
  float flare = exp(-abs(ds.y) * 220.) * exp(-along * 4.) * .35;
  col += uSun * (core * 1.6 + glow * uRise + flare * uRise * sunVis);

  // Fine grain against banding.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - .5) * .018;
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (name) => gl.getUniformLocation(prog, name);
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  // Quille palette: ink #00050d, accent #4a86bd, light #7fb2e0, surface #e6eff7.
  gl.uniform3fv(U('uInk'), rgb('#00050d'));
  gl.uniform3fv(U('uGlow'), rgb('#4a86bd'));
  gl.uniform3fv(U('uLight'), rgb('#7fb2e0'));
  gl.uniform3fv(U('uSun'), rgb('#e6eff7'));
  const uRes = U('uRes'), uTime = U('uTime'), uRise = U('uRise'), uAurora = U('uAurora'), uPointer = U('uPointer');

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = () => {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    draw();
  };

  // Sunrise follows the scroll: night over the testimonials, up at the contact section.
  const contact = wrap.querySelector('#contact');
  const targetRise = () => {
    if (!contact) return 1;
    const top = contact.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * 0.85)));
  };

  let rise = targetRise(), aurora = 0, time = 0, last = performance.now(), raf = 0, visible = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const draw = () => {
    gl.uniform1f(uTime, time);
    gl.uniform1f(uRise, rise);
    gl.uniform1f(uAurora, aurora);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const frame = (now) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    time += dt;
    rise += (targetRise() - rise) * Math.min(1, dt * 4);
    aurora += (0 - aurora) * Math.min(1, dt * 0.35);
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    draw();
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  if (reduce) {
    // One still frame, redrawn only when the scroll changes the sunrise.
    addEventListener('scroll', () => { rise = targetRise(); draw(); }, { passive: true });
  } else {
    addEventListener('pointermove', (e) => { pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
    wrap.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, input, textarea, select, [role="button"]')) return;
      aurora = Math.min(1, aurora + 0.75);
    });
  }
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }, { rootMargin: '10% 0px' });
  io.observe(wrap);
  document.addEventListener('visibilitychange', () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else start(); });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else addEventListener('resize', resize);
  resize();
  wrap.classList.add('is-horizon-ready');
})();
