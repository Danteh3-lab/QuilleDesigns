/* Quille Designs — 20s promo. Deterministic timeline: window.seek(t) paints time t. */
(() => {
'use strict';
const W = 1920, H = 1080, DUR = 22;
const SVC_STEP = 1.0; // seconds per WHAT WE DO item (2 beats @120 BPM)
const SH = 2.0;       // everything after the services section is pushed back one bar
const C = { ink: '#00050d', navy: '#00162a', navy2: '#123555', blue: '#0074f3', accent: '#245a86', mid: '#4a86bd', light: '#7fb2e0', pale: '#e6eff7', muted: '#486883' };

// ---------- utils
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, x) => a + (b - a) * x;
const P = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  lin: x => x,
  inQuad: x => x * x,
  outCubic: x => 1 - (1 - x) ** 3,
  inCubic: x => x ** 3,
  inOutCubic: x => x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2,
  outQuart: x => 1 - (1 - x) ** 4,
  outQuint: x => 1 - (1 - x) ** 5,
  outExpo: x => x >= 1 ? 1 : 1 - 2 ** (-10 * x),
  inExpo: x => x <= 0 ? 0 : 2 ** (10 * x - 10),
  inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2,
  outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
  outBackBig: x => { const c1 = 2.6, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
};
const tw = (t, a, b, e = E.outExpo) => e(P(t, a, b));
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let r = Math.imul(seed ^ seed >>> 15, 1 | seed); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
function mk(tag, parent, css, html) { const e = document.createElement(tag); if (css) Object.assign(e.style, css); if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
const abs = (css = {}) => Object.assign({ position: 'absolute' }, css);
const NS = 'http://www.w3.org/2000/svg';
function sv(tag, parent, attrs = {}) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function show(el, on) { const v = on ? '' : 'none'; if (el.style.display !== v) el.style.display = v; }
function chars(parent, text, css = {}) {
  const out = [];
  for (const ch of text) out.push(mk('span', parent, Object.assign({}, css), ch === ' ' ? ' ' : ch)), out[out.length - 1].className = 'c';
  return out;
}
const imgs = [];
function img(src, parent, css = {}) { const i = mk('img', parent, Object.assign({ width: '100%', height: '100%', objectFit: 'cover' }, css)); i.src = src; imgs.push(i); return i; }
const MONT = 'Montserrat, sans-serif';
const updates = [];

const stage = document.getElementById('stage');
const cam = mk('div', stage, abs({ inset: 0 }));

// =============================================================== BACKGROUND
const bg = mk('div', cam, abs({ inset: 0, background: C.ink, overflow: 'hidden' }));
const glowA = mk('div', bg, abs({ width: '1700px', height: '1700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,116,243,.30) 0%, rgba(0,116,243,.08) 35%, rgba(0,116,243,0) 62%)' }));
const glowB = mk('div', bg, abs({ width: '1300px', height: '1300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,178,224,.16) 0%, rgba(127,178,224,0) 60%)' }));
const dots = mk('div', bg, abs({ inset: '-88px', backgroundImage: 'radial-gradient(circle, rgba(74,134,189,.75) 1.4px, transparent 2.1px)', backgroundSize: '44px 44px', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 15%, transparent 100%)' }));
updates.push(t => {
  glowA.style.transform = `translate(${960 - 850 + 380 * Math.sin(t * .35)}px, ${540 - 850 + 220 * Math.cos(t * .27)}px)`;
  glowB.style.transform = `translate(${960 - 650 - 420 * Math.sin(t * .22 + 1)}px, ${540 - 650 + 260 * Math.sin(t * .31 + 2)}px)`;
  dots.style.transform = `translate(${(-t * 14) % 44}px, ${(-t * 9) % 44}px)`;
  dots.style.opacity = (0.55 * tw(t, 0, 1.2, E.outCubic)).toFixed(3);
});

// =============================================================== S3: WORK WALL (below others)
const s3 = mk('div', cam, abs({ inset: 0, overflow: 'hidden' }));
const wallWrap = mk('div', s3, abs({ inset: 0, perspective: '1800px' }));
const plane = mk('div', wallWrap, abs({ left: '50%', top: '50%', width: '4200px', height: '2400px', marginLeft: '-2100px', marginTop: '-1200px' }));
const WORK = [
  ['img/film-smartwigi.jpg', 16 / 9], ['img/poster1.jpg', 1], ['L:img/logo3.png', 1], ['img/film-baby.jpg', 9 / 16], ['img/film-terzol.jpg', 16 / 9],
  ['img/poster4.jpg', 1], ['img/film-mage-ev.jpg', 9 / 16], ['L:img/logo5.png', 1], ['img/poster6.jpg', 1], ['img/film-fake-alexa.jpg', 9 / 16],
  ['L:img/logo7.png', 1], ['L:img/logo1.png', 1], ['L:img/logo4.png', 1], ['L:img/logo6.png', 1], ['L:img/logo2.png', 1],
];
const ROWH = 300, GAP = 28, rows = [];
for (let r = 0; r < 7; r++) {
  const row = mk('div', plane, abs({ top: `${r * (ROWH + GAP) + 50}px`, left: '-600px', height: `${ROWH}px`, display: 'flex', gap: `${GAP}px` }));
  let w = 0, k = r * 4;
  while (w < 6400) {
    const [src, ar] = WORK[k++ % WORK.length];
    const cw = Math.round(ROWH * ar);
    const card = mk('div', row, { width: `${cw}px`, height: `${ROWH}px`, flex: 'none', borderRadius: '14px', overflow: 'hidden', background: '#0b1726', boxShadow: '0 20px 60px rgba(0,0,0,.5)', position: 'relative' });
    if (src.startsWith('L:')) { card.style.background = 'radial-gradient(circle at 50% 30%, #12304f, #07111d)'; img(src.slice(2), card, abs({ left: '12%', top: '12%', width: '76%', height: '76%' })); }
    else img(src, card);
    w += cw + GAP;
  }
  rows.push(row);
}
const wallShade = mk('div', s3, abs({ inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,5,13,.82) 0%, rgba(0,5,13,.45) 60%, rgba(0,5,13,.75) 100%)', opacity: 0 }));
const wallDim = mk('div', s3, abs({ inset: 0, background: 'rgba(0,5,13,1)', opacity: 0 }));

// "IDEAS / IN MOTION."
const s3text = mk('div', s3, abs({ inset: 0 }));
const ideasL1 = mk('div', s3text, abs({ left: 0, right: 0, top: '300px', textAlign: 'center', font: `900 210px/1 ${MONT}`, letterSpacing: '-0.03em' }));
const ideasL2 = mk('div', s3text, abs({ left: 0, right: 0, top: '520px', textAlign: 'center', font: `900 210px/1 ${MONT}`, letterSpacing: '-0.03em' }));
const ideasC1 = chars(ideasL1, 'IDEAS');
const ideasC2 = [...chars(ideasL2, 'IN '), ...chars(ideasL2, 'MOTION.', { fontStyle: 'italic', fontWeight: 800, color: C.light })];

// Editor window
const editor = mk('div', s3, abs({ left: '210px', top: '125px', width: '1140px', height: '830px', borderRadius: '18px', background: 'linear-gradient(#0d1a29, #08121d)', border: '1px solid rgba(127,178,224,.18)', boxShadow: '0 60px 160px rgba(0,0,0,.7), 0 0 0 1px rgba(0,0,0,.4)', overflow: 'hidden', transformOrigin: '50% 100%' }));
const edBar = mk('div', editor, abs({ left: 0, right: 0, top: 0, height: '46px', borderBottom: '1px solid rgba(127,178,224,.12)', display: 'flex', alignItems: 'center', gap: '9px', padding: '0 18px' }));
for (const c of ['#ff5f57', '#febc2e', '#28c840']) mk('div', edBar, { width: '13px', height: '13px', borderRadius: '50%', background: c });
mk('div', edBar, { marginLeft: '18px', font: `500 16px Jost`, color: '#8fb0cc', letterSpacing: '.04em' }, 'smartwigi_promo — Quille Designs');
const edTC = mk('div', edBar, { marginLeft: 'auto', font: `500 16px Jost`, color: C.light, letterSpacing: '.12em', fontVariantNumeric: 'tabular-nums' }, '00:00:00:00');
const viewer = mk('div', editor, abs({ left: '24px', top: '62px', width: '1092px', height: '588px', borderRadius: '8px', overflow: 'hidden', background: '#000' }));
const viewerImg = img('img/film-smartwigi.jpg', viewer);
// lower third inside viewer (motion graphics demo)
const lt = mk('div', viewer, abs({ right: '60px', top: '60px', height: '96px', display: 'flex', alignItems: 'stretch' }));
const ltBar = mk('div', lt, { width: '10px', background: C.blue });
const ltBox = mk('div', lt, { background: 'rgba(0,5,13,.86)', padding: '14px 30px 0 24px', overflow: 'hidden', whiteSpace: 'nowrap' });
const ltT1 = mk('div', ltBox, { font: `800 34px/1.1 ${MONT}`, color: '#fff' }, 'SMARTWIGI');
const ltT2 = mk('div', ltBox, { font: `400 19px/1.4 Jost`, color: C.light, letterSpacing: '.14em' }, 'HOME AUTOMATION');
const sel = mk('div', viewer, abs({ border: `1.5px solid ${C.light}` }));
for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1], [.5, 0], [.5, 1], [0, .5], [1, .5]]) mk('div', sel, abs({ left: `calc(${x * 100}% - 5px)`, top: `calc(${y * 100}% - 5px)`, width: '10px', height: '10px', background: '#fff', border: `1.5px solid ${C.blue}` }));
for (const [l, tp, w, h] of [[.05, .05, .9, .9], [.1, .1, .8, .8]]) mk('div', viewer, abs({ left: `${l * 100}%`, top: `${tp * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, border: '1px dashed rgba(255,255,255,.18)' }));
// timeline
const tl = mk('div', editor, abs({ left: '24px', right: '24px', top: '664px', bottom: '18px' }));
const ruler = mk('div', tl, abs({ left: '150px', right: 0, top: 0, height: '20px', backgroundImage: 'repeating-linear-gradient(90deg, rgba(143,176,204,.45) 0 1px, transparent 1px 24px)', backgroundSize: '100% 7px', backgroundRepeat: 'repeat-x', backgroundPosition: '0 100%' }));
const TRACKS = [['Lower third', C.blue, [[.06, .5]], [.06, .2, .44]], ['Logo reveal', C.mid, [[.42, .95]], [.42, .6, .88]], ['Footage', C.accent, [[0, .58], [.6, 1]], []], ['Music', '#2c3e52', [[0, 1]], []]];
const diamonds = [];
TRACKS.forEach(([name, col, clips, keys], i) => {
  const y = 28 + i * 32;
  mk('div', tl, abs({ left: 0, top: `${y}px`, width: '140px', height: '26px', font: '500 15px/26px Jost', color: '#8fb0cc' }), name);
  for (const [a, b] of clips) mk('div', tl, abs({ left: `calc(150px + (100% - 150px) * ${a})`, width: `calc((100% - 150px) * ${b - a} - 3px)`, top: `${y}px`, height: '26px', borderRadius: '5px', background: col, opacity: .9 }));
  for (const k of keys) diamonds.push([k, mk('div', tl, abs({ left: `calc(150px + (100% - 150px) * ${k} - 7px)`, top: `${y + 6}px`, width: '14px', height: '14px', background: '#fff', transform: 'rotate(45deg)', boxShadow: '0 0 0 2px #08121d' }))]);
});
const playhead = mk('div', tl, abs({ top: '-4px', bottom: 0, width: '2px', background: '#fff', boxShadow: `0 0 12px ${C.light}` }));
mk('div', playhead, abs({ left: '-7px', top: '-2px', width: '16px', height: '12px', background: '#fff', clipPath: 'polygon(0 0,100% 0,100% 55%,50% 100%,0 55%)' }));
// phone
const phone = mk('div', s3, abs({ left: '1395px', top: '210px', width: '340px', height: '660px', borderRadius: '50px', background: '#05080c', padding: '11px', boxShadow: '0 60px 140px rgba(0,0,0,.75), inset 0 0 0 2px #26313d' }));
const screen = mk('div', phone, { position: 'relative', width: '100%', height: '100%', borderRadius: '40px', overflow: 'hidden', background: '#000' });
const phoneImg = img('img/film-mage-ev.jpg', screen);
mk('div', screen, abs({ left: '50%', top: '12px', width: '96px', height: '26px', marginLeft: '-48px', borderRadius: '14px', background: '#000' }));
const igBars = mk('div', screen, abs({ left: '14px', right: '14px', top: '48px', display: 'flex', gap: '5px' }));
const igFill = [];
for (let i = 0; i < 3; i++) { const b = mk('div', igBars, { flex: 1, height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.35)', overflow: 'hidden' }); igFill.push(mk('div', b, { height: '100%', width: '0%', background: '#fff' })); }
const igHead = mk('div', screen, abs({ left: '14px', top: '62px', display: 'flex', alignItems: 'center', gap: '9px', font: '600 15px Jost', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.6)' }));
const igAv = mk('div', igHead, { width: '30px', height: '30px', borderRadius: '50%', background: '#fff', border: `2px solid ${C.blue}`, overflow: 'hidden' });
img('img/favicon.png', igAv);
mk('span', igHead, null, 'quilledesigns');
const heart = mk('div', screen, abs({ right: '18px', bottom: '120px', width: '44px', height: '44px' }), `<svg viewBox="0 0 24 24" width="44" height="44"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="#ff3b5c" stroke="#fff" stroke-width="1.2"/></svg>`);
const heartRing = mk('div', screen, abs({ right: '6px', bottom: '108px', width: '68px', height: '68px', borderRadius: '50%', border: '3px solid #ff3b5c' }));
const igCap = mk('div', screen, abs({ left: '16px', right: '70px', bottom: '28px', font: '400 15px/1.35 Jost', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.7)' }), '<b style="font-weight:600">quilledesigns</b> New reel for Mage EV ⚡');
// chips
const chip = (txt, x, y) => mk('div', s3, abs({ left: `${x}px`, top: `${y}px`, padding: '12px 22px', borderRadius: '40px', background: C.blue, font: '500 21px Jost', letterSpacing: '.06em', color: '#fff', boxShadow: '0 16px 40px rgba(0,116,243,.45)', whiteSpace: 'nowrap', transformOrigin: '0 50%' }), txt);
const chip1 = chip('● Promo production', 150, 912);
const chip2 = chip('● Social media', 1540, 150);

updates.push(t => {
  t -= SH;
  const on = t >= 6.9 && t < 11.75;
  show(s3, on); if (!on) return;
  const pull = tw(t, 6.95, 8.3, E.outExpo);
  const dz = lerp(1050, 0, pull) - 140 * P(t, 8.3, 11.6);
  plane.style.transform = `translateZ(${dz}px) rotateX(${lerp(14, 26, pull)}deg) rotateZ(${lerp(-4, -13, pull)}deg)`;
  rows.forEach((row, i) => { const dir = i % 2 ? 1 : -1; row.style.transform = `translateX(${dir * (t - 6.9) * (70 + i * 12) - (i % 2 ? 300 : 0)}px)`; });
  // text phase
  wallShade.style.opacity = (tw(t, 7.3, 7.9, E.outCubic) * (1 - tw(t, 9.1, 9.5, E.outCubic))).toFixed(3);
  show(s3text, t > 7.3 && t < 9.4);
  const setLetters = (arr, t0) => arr.forEach((c, i) => {
    const mid = (arr.length - 1) / 2, k = i - mid;
    const e = tw(t, t0 + Math.abs(k) * .03, t0 + .75 + Math.abs(k) * .03, E.outExpo);
    const out = tw(t, 8.95, 9.3, E.inCubic);
    c.style.opacity = (e * (1 - out)).toFixed(3);
    c.style.filter = `blur(${((1 - e) * 22 + out * 12).toFixed(1)}px)`;
    c.style.transform = `translateX(${(k * 90 * (1 - e) + k * 160 * out).toFixed(1)}px) scale(${(1 + .35 * (1 - e) + .5 * out).toFixed(3)})`;
  });
  setLetters(ideasC1, 7.4); setLetters(ideasC2, 7.62);
  // editor phase
  const dim = tw(t, 9.0, 9.5, E.outCubic);
  wallDim.style.opacity = (dim * .62).toFixed(3);
  wallWrap.style.filter = dim > 0 ? `blur(${(dim * 7).toFixed(1)}px)` : '';
  const ein = tw(t, 9.05, 9.75, E.outExpo);
  show(editor, t > 9.05);
  editor.style.opacity = Math.min(1, ein * 2).toFixed(3);
  editor.style.transform = `perspective(1600px) translateY(${(1 - ein) * 260}px) rotateX(${(1 - ein) * 32}deg) scale(${lerp(.82, 1, ein)})`;
  viewerImg.style.transform = `scale(${lerp(1.18, 1.02, P(t, 9.05, 11.5))})`;
  const lt1 = tw(t, 9.6, 10.1, E.outExpo), lt2 = tw(t, 9.75, 10.25, E.outExpo);
  ltBar.style.transform = `scaleY(${lt1})`;
  ltBox.style.clipPath = `inset(0 ${100 - 100 * lt2}% 0 0)`;
  ltT1.style.transform = `translateY(${(1 - lt2) * 40}px)`; ltT2.style.opacity = tw(t, 9.95, 10.35).toFixed(3);
  const sb = lt.getBoundingClientRect(), vb = viewer.getBoundingClientRect(), sc = vb.width / 1092 || 1;
  sel.style.left = `${(sb.left - vb.left) / sc - 8}px`; sel.style.top = `${(sb.top - vb.top) / sc - 8}px`;
  sel.style.width = `${sb.width / sc + 16}px`; sel.style.height = `${sb.height / sc + 16}px`;
  sel.style.opacity = (tw(t, 10.2, 10.3) * (1 - tw(t, 10.9, 11.0))).toFixed(3);
  const ph = P(t, 9.3, 11.5);
  playhead.style.left = `calc(150px + (100% - 150px) * ${ph.toFixed(4)})`;
  diamonds.forEach(([k, d]) => { const hit = clamp((ph - k) * 30 + 1); const pop = hit > 0 && hit < 1 ? 1 + .9 * Math.sin(hit * Math.PI) : 1; d.style.transform = `rotate(45deg) scale(${pop})`; d.style.background = ph >= k ? C.light : '#fff'; });
  const f = Math.floor((t - 9.3) * 60) + 180, ss = Math.floor(Math.max(0, f) / 60), ff = Math.max(0, f) % 60;
  edTC.textContent = `00:00:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`;
  // phone
  const pin = tw(t, 9.45, 10.15, E.outExpo);
  show(phone, t > 9.45);
  phone.style.transform = `perspective(1400px) translateX(${(1 - pin) * 700}px) translateY(${Math.sin(t * 1.6) * 8}px) rotateY(${lerp(-55, -14, pin)}deg) rotateZ(${lerp(10, 3, pin)}deg)`;
  phoneImg.style.transform = `scale(${lerp(1.15, 1.0, P(t, 9.45, 11.5))})`;
  igFill.forEach((b, i) => b.style.width = `${clamp((t - 9.6 - i * .6) / .6) * 100}%`);
  const hp = P(t, 10.55, 10.95);
  heart.style.transform = `scale(${t < 10.55 ? 0 : E.outBackBig(hp)})`;
  heartRing.style.transform = `scale(${lerp(.4, 1.8, E.outCubic(hp))})`; heartRing.style.opacity = (hp > 0 ? (1 - hp) : 0).toFixed(3);
  const c1 = tw(t, 9.75, 10.2, E.outBack), c2 = tw(t, 10.0, 10.45, E.outBack);
  chip1.style.transform = `scale(${c1})`; chip1.style.opacity = Math.min(1, c1 * 2);
  chip2.style.transform = `scale(${c2})`; chip2.style.opacity = Math.min(1, c2 * 2);
  // whip out
  const whip = tw(t, 11.2, 11.62, E.inExpo);
  s3.style.transform = `translateX(${-2600 * whip}px)`;
});

// =============================================================== S4: CLIENTS ORBIT
const s4 = mk('div', cam, abs({ inset: 0 }));
const s4label = mk('div', s4, abs({ left: 0, right: 0, top: '372px', textAlign: 'center', font: '500 22px Jost', letterSpacing: '.38em', color: C.light, zIndex: 10 }), 'SELECTED CLIENTS');
const s4h = mk('div', s4, abs({ left: 0, right: 0, top: '414px', textAlign: 'center', zIndex: 10 }));
const s4l1 = mk('div', s4h, { overflow: 'hidden', font: `800 88px/1.12 ${MONT}`, letterSpacing: '-0.035em', paddingBottom: '6px' });
const s4l2 = mk('div', s4h, { overflow: 'hidden', font: `italic 300 88px/1.12 ${MONT}`, letterSpacing: '-0.03em', color: C.light, paddingBottom: '10px' });
const s4c = [...chars(s4l1, "Brands we've"), ...chars(s4l2, 'brought to life.')];
const orbit = [];
for (let i = 0; i < 7; i++) {
  const o = mk('div', s4, abs({ left: 0, top: 0, width: '210px', height: '210px', borderRadius: '50%', boxShadow: '0 24px 60px rgba(0,0,0,.55), 0 0 0 3px rgba(127,178,224,.35)' }));
  img(`img/logo${i + 1}.png`, o, { borderRadius: '50%' });
  orbit.push(o);
}
const marq = mk('div', s4, abs({ left: 0, right: 0, top: '902px', height: '92px', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)', zIndex: 30 }));
const marqIn = mk('div', marq, abs({ left: 0, top: '6px', display: 'flex', gap: '26px' }));
const PARTNERS = ['incrediently', 'sansoer', 'terzol', 'xus', 'smartwigi'];
for (let k = 0; k < 4; k++) for (const p of PARTNERS) {
  const dark = p === 'sansoer' || p === 'smartwigi';
  const pill = mk('div', marqIn, { flex: 'none', height: '80px', padding: '12px 34px', borderRadius: '40px', background: dark ? '#0d2238' : '#fff', border: dark ? '1.5px solid rgba(127,178,224,.4)' : 'none', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.35)' });
  img(`img/partner_${p}.png`, pill, { height: '56px', width: 'auto', objectFit: 'contain' });
}
const s4ring = sv('svg', s4, { width: W, height: H, style: 'position:absolute;inset:0;z-index:1' });
const orbitEllipse = sv('ellipse', s4ring, { cx: 960, cy: 495, rx: 720, ry: 280, fill: 'none', stroke: 'rgba(127,178,224,.22)', 'stroke-width': 1.5, 'stroke-dasharray': '4 10' });
updates.push(t => {
  t -= SH;
  const on = t >= 11.2 && t < 15.1;
  show(s4, on); if (!on) return;
  const enter = tw(t, 11.3, 11.85, E.outExpo);
  const col = tw(t, 14.35, 14.98, E.inExpo);
  s4.style.transform = `translateX(${2600 * (1 - enter)}px)`;
  s4label.style.opacity = (tw(t, 11.55, 11.9) * (1 - tw(t, 14.2, 14.45))).toFixed(3);
  s4label.style.letterSpacing = `${lerp(.9, .38, tw(t, 11.55, 12.2))}em`;
  s4c.forEach((c, i) => {
    const e = tw(t, 11.62 + i * .018, 12.3 + i * .018, E.outExpo);
    const o = tw(t, 14.25 + i * .008, 14.6 + i * .008, E.inCubic);
    c.style.transform = `translateY(${(1 - e) * 110 - o * 110}%) rotate(${(1 - e) * 6}deg)`;
  });
  const rf = 1 - col;
  const spin = (t - 11.3) * .32 + 7 * E.inCubic(P(t, 14.2, 14.98));
  orbitEllipse.setAttribute('rx', 720 * rf); orbitEllipse.setAttribute('ry', 280 * rf);
  orbitEllipse.style.opacity = (tw(t, 11.7, 12.4) * rf).toFixed(3);
  orbitEllipse.style.strokeDashoffset = -t * 30;
  orbit.forEach((o, i) => {
    const th = i / 7 * Math.PI * 2 + spin + .4;
    const x = 960 + Math.cos(th) * 720 * rf, y = 495 + Math.sin(th) * 280 * rf;
    const z = Math.sin(th);
    const pop = t < 11.75 + i * .1 ? 0 : E.outBack(P(t, 11.75 + i * .1, 12.3 + i * .1));
    const s = (0.72 + 0.34 * (z + 1) / 2) * pop * lerp(1, .15, col);
    o.style.transform = `translate(${x - 105}px, ${y - 105}px) scale(${s.toFixed(4)})`;
    o.style.zIndex = z > 0 ? 20 : 5;
    o.style.filter = `brightness(${(0.55 + .45 * (z + 1) / 2).toFixed(3)}) blur(${(Math.max(0, -z) * 2.2).toFixed(2)}px)`;
  });
  const mp = tw(t, 12.3, 12.9);
  marq.style.opacity = (mp * (1 - tw(t, 14.1, 14.4))).toFixed(3);
  marqIn.style.transform = `translateX(${-200 - (t - 11.3) * 140}px) translateY(${(1 - mp) * 40}px)`;
});

// =============================================================== S2b: SERVICES
const s2b = mk('div', cam, abs({ inset: 0 }));
const svcRing = sv('svg', s2b, { width: W, height: H, style: 'position:absolute;inset:0' });
const ringA = sv('circle', svcRing, { cx: 1400, cy: 540, r: 390, fill: 'none', stroke: 'rgba(127,178,224,.28)', 'stroke-width': 1.5, 'stroke-dasharray': '2 14' });
const ringB = sv('circle', svcRing, { cx: 1400, cy: 540, r: 455, fill: 'none', stroke: 'rgba(0,116,243,.35)', 'stroke-width': 2, 'stroke-dasharray': '120 40 8 40' });
const svcLabel = mk('div', s2b, abs({ left: '150px', top: '300px', display: 'flex', alignItems: 'center', gap: '18px', font: '500 22px Jost', letterSpacing: '.36em', color: C.light }));
const svcLabelLine = mk('div', svcLabel, { width: '60px', height: '2px', background: C.blue, transformOrigin: '0 50%' });
mk('span', svcLabel, null, 'WHAT WE DO');
const ITEMS = [
  { word: 'LOGOS', sub: 'Logos & business cards', src: 'img/logo2.png', shape: [520, 520, 260] },
  { word: 'POSTERS', sub: 'Posters that stop the scroll', src: 'img/poster1.jpg', shape: [600, 600, 26] },
  { word: 'PROMOS', sub: 'Promo production', src: 'img/film-smartwigi.jpg', shape: [840, 473, 22] },
  { word: 'SOCIAL', sub: 'Social media', src: 'img/film-mage-ev.jpg', shape: [340, 604, 46] },
];
const TI = i => 4.0 + SVC_STEP * i;
const lag = mk('div', s2b, abs({ border: `1.5px solid rgba(127,178,224,.55)` }));
const card = mk('div', s2b, abs({ overflow: 'hidden', background: '#000', boxShadow: '0 40px 140px rgba(0,116,243,.32), 0 30px 80px rgba(0,0,0,.6)' }));
const layers = ITEMS.map(it => { const l = mk('div', card, abs({ inset: 0, overflow: 'hidden' })); const im = img(it.src, l); return { l, im }; });
const wipeBar = mk('div', card, abs({ left: 0, right: 0, height: '16px', background: C.blue, boxShadow: `0 0 30px ${C.blue}` }));
const bezel = mk('div', card, abs({ inset: 0, border: '0px solid #05080c' }));
const notch = mk('div', card, abs({ left: '50%', top: '14px', width: '90px', height: '24px', marginLeft: '-45px', borderRadius: '14px', background: '#05080c' }));
const wordBox = mk('div', s2b, abs({ left: '130px', top: '350px', width: '1300px', height: '200px', overflow: 'hidden', mixBlendMode: 'difference' }));
const words = ITEMS.map(it => { const w = mk('div', wordBox, abs({ left: '10px', top: 0, font: `900 182px/200px ${MONT}`, letterSpacing: '-0.04em', color: '#fff', whiteSpace: 'nowrap' })); return chars(w, it.word); });
const subBox = mk('div', s2b, abs({ left: '150px', top: '572px', width: '900px', height: '52px', overflow: 'hidden' }));
const subs = ITEMS.map(it => mk('div', subBox, abs({ left: 0, top: 0, font: '400 36px/52px Jost', color: '#b1beca' }), it.sub));
const counter = mk('div', s2b, abs({ left: '150px', top: '730px', display: 'flex', alignItems: 'flex-end', gap: '14px' }));
const cnt = mk('div', counter, { font: `300 72px/72px ${MONT}`, display: 'flex' });
mk('span', cnt, null, '0');
const digWin = mk('div', cnt, { height: '72px', overflow: 'hidden' });
const digStrip = mk('div', digWin, null, '1<br>2<br>3<br>4');
mk('div', counter, { font: '500 22px/34px Jost', color: '#6f8aa3', letterSpacing: '.2em' }, '/ 04');
const segs = mk('div', s2b, abs({ left: '150px', top: '826px', display: 'flex', gap: '10px' }));
const segF = ITEMS.map(() => { const s = mk('div', segs, { width: '74px', height: '3px', background: 'rgba(127,178,224,.22)', overflow: 'hidden' }); return mk('div', s, { width: '100%', height: '100%', background: C.blue, transformOrigin: '0 50%' }); });

function shapeAt(t) {
  let w = 0, h = 0, r = 0, cx = 1400, cy = 540;
  const e0 = tw(t, TI(0) - .05, TI(0) + .55, E.outExpo);
  [w, h, r] = ITEMS[0].shape.map(v => v * e0); r = 260;
  for (let i = 1; i < ITEMS.length; i++) {
    const e = tw(t, TI(i) - .06, TI(i) + .55, E.outExpo);
    if (e <= 0) break;
    const [pw, ph, pr] = ITEMS[i - 1].shape, [nw, nh, nr] = ITEMS[i].shape;
    w = lerp(pw, nw, e); h = lerp(ph, nh, e); r = lerp(Math.min(pr, pw / 2), nr, e);
  }
  const ex = tw(t, 6.22 + SH, 6.98 + SH, E.inOutExpo);
  if (ex > 0) { w = lerp(w, W, ex); h = lerp(h, H, ex); r = lerp(r, 0, ex); cx = lerp(cx, 960, ex); cy = lerp(cy, 540, ex); }
  return { w, h, r, cx, cy, ex };
}
updates.push(t => {
  const on = t >= 3.8 && t < 7.0 + SH;
  show(s2b, on); if (!on) return;
  const s = shapeAt(t), sl = shapeAt(t - .09);
  Object.assign(card.style, { left: `${s.cx - s.w / 2}px`, top: `${s.cy - s.h / 2}px`, width: `${s.w}px`, height: `${s.h}px`, borderRadius: `${s.r}px` });
  const pad = 22 * (1 - s.ex);
  Object.assign(lag.style, { left: `${sl.cx - sl.w / 2 - pad}px`, top: `${sl.cy - sl.h / 2 - pad}px`, width: `${sl.w + pad * 2}px`, height: `${sl.h + pad * 2}px`, borderRadius: `${sl.r + pad}px`, opacity: (1 - s.ex) * tw(t, 4.1, 4.4) });
  const ph = tw(t, TI(3) - .06, TI(3) + .4) * (1 - s.ex);
  bezel.style.borderWidth = `${11 * ph}px`; bezel.style.borderRadius = `${s.r}px`;
  notch.style.opacity = (ph * (1 - P(s.ex, 0, .15))).toFixed(3);
  let wipeShown = false;
  layers.forEach(({ l, im }, i) => {
    const e = i === 0 ? 1 : tw(t, TI(i) - .06, TI(i) + .45, E.outExpo);
    show(l, t >= TI(i) - .06 || i === 0);
    l.style.clipPath = i === 0 ? '' : `inset(${(100 * (1 - e)).toFixed(2)}% 0 0 0)`;
    im.style.transform = `scale(${lerp(1.35, 1.0, tw(t, TI(i) - .06, TI(i) + 1.1, E.outCubic))})`;
    if (i > 0 && e > 0 && e < .995) { wipeShown = true; wipeBar.style.top = `${(1 - e) * s.h - 8}px`; }
  });
  show(wipeBar, wipeShown);
  // words
  words.forEach((cs, i) => {
    const tin = TI(i), tout = i < 3 ? TI(i + 1) - .02 : 6.1 + SH;
    cs.forEach((c, k) => {
      const e = tw(t, tin + k * .03, tin + .65 + k * .03, E.outExpo);
      const o = tw(t, tout + k * .014, tout + .2 + k * .014, E.inCubic);
      c.style.transform = `translateY(${(1 - e) * 105 - o * 105}%)`;
    });
  });
  subs.forEach((sb, i) => {
    const tin = TI(i) + .08, tout = i < 3 ? TI(i + 1) - .02 : 6.1 + SH;
    const e = tw(t, tin, tin + .6), o = tw(t, tout, tout + .18, E.inCubic);
    sb.style.transform = `translateY(${(1 - e) * 100 - o * 100}%)`;
  });
  { const k = clamp(Math.floor((t - 3.95) / SVC_STEP), 0, 3); digStrip.style.transform = `translateY(${k === 0 ? 0 : -72 * (k - 1 + tw(t, TI(k) - .05, TI(k) + .35))}px)`; }
  segF.forEach((f, i) => f.style.transform = `scaleX(${tw(t, TI(i), TI(i) + .45, E.outExpo)})`);
  const uiOut = tw(t, 6.08 + SH, 6.3 + SH, E.inCubic), uiIn = tw(t, 4.02, 4.5);
  for (const el of [svcLabel, counter, segs]) { el.style.opacity = (uiIn * (1 - uiOut)).toFixed(3); el.style.transform = `translateY(${(1 - uiIn) * 30 - uiOut * 30}px)`; }
  svcLabelLine.style.transform = `scaleX(${uiIn})`;
  svcRing.style.opacity = (tw(t, 4.0, 4.6) * (1 - s.ex)).toFixed(3);
  ringA.setAttribute('transform', `rotate(${t * 22} 1400 540)`);
  ringB.setAttribute('transform', `rotate(${-t * 34} 1400 540)`);
  ringA.setAttribute('r', 390 + 30 * Math.sin(t * 2));
});

// =============================================================== S2: BLUE KINETIC TYPE
const s2 = mk('div', cam, abs({ inset: 0, overflow: 'hidden' }));
mk('div', s2, abs({ inset: 0, background: 'radial-gradient(120% 95% at 72% 18%, #3d97ff 0%, #0074f3 38%, #0052bd 78%, #003f94 100%)' }));
const stripes = mk('div', s2, abs({ inset: '-100px', backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, transparent 2px 30px)' }));
const s2in = mk('div', s2, abs({ inset: 0, transformOrigin: '960px 540px' }));
const LINES = [
  { text: 'WE MAKE', size: 150, top: 205, color: '#fff', t0: 3.0, dir: -1 },
  { text: 'BRANDS', size: 262, top: 330, color: C.ink, t0: 3.1, dir: 1 },
  { text: 'MOVE.', size: 262, top: 572, outline: true, t0: 3.45, dir: -1 },
];
const lineEls = LINES.map(L => {
  const box = mk('div', s2in, abs({ left: '130px', top: `${L.top}px`, overflow: 'hidden', padding: '0 24px', height: `${L.size * 1.02}px`, font: `900 ${L.size}px/${L.size * 1.02}px ${MONT}`, letterSpacing: '-0.035em', color: L.color, whiteSpace: 'nowrap' }));
  const cs = chars(box, L.text);
  const fills = [];
  if (L.outline) cs.forEach(c => { c.style.color = 'transparent'; c.style.webkitTextStroke = '3px #fff'; c.style.position = 'relative'; const f = mk('span', c, abs({ left: 0, top: 0, color: '#fff', webkitTextStroke: '0' }), c.textContent); fills.push(f); });
  return { L, box, cs, fills };
});
// rotating badge
const badge = sv('svg', s2in, { width: 260, height: 260, viewBox: '-130 -130 260 260', style: 'position:absolute;left:1500px;top:150px;overflow:visible' });
const bdefs = sv('defs', badge); sv('path', bdefs, { id: 'bcirc', d: 'M -100 0 A 100 100 0 1 1 100 0 A 100 100 0 1 1 -100 0' });
const bg2 = sv('g', badge);
const btxt = sv('text', bg2, { fill: '#fff', 'font-family': 'Jost', 'font-weight': 500, 'font-size': 21, 'letter-spacing': 5.2 });
const btp = sv('textPath', btxt, { href: '#bcirc' }); btp.textContent = 'QUILLE DESIGNS ✦ CREATIVE STUDIO ✦ ';
sv('circle', badge, { r: 72, fill: '#fff', style: 'filter:drop-shadow(0 6px 14px rgba(0,22,42,.35))' });
const bmark = sv('g', badge, { transform: 'scale(.158) translate(-338.5 -345.5)' }); // QD mark (mark.js) centred on the disc
for (const m of MARK) sv('path', bmark, { d: m.d, 'fill-rule': 'evenodd', fill: m.fill });
// small tags
const s2tag = mk('div', s2in, abs({ left: '154px', top: '880px', font: '500 22px Jost', letterSpacing: '.34em', color: 'rgba(255,255,255,.85)' }), 'BRANDING — MOTION — CONTENT');
updates.push(t => {
  const on = t >= 2.2 && t < 4.3;
  show(s2, on); if (!on) return;
  const z = E.inExpo(P(t, 2.45, 3.0));
  const R = 146 * (1 + 15 * z);
  s2.style.clipPath = t < 3.0 ? `circle(${R}px at 960px 540px)` : `inset(0 0 ${(100 * tw(t, 3.9, 4.22, E.inOutExpo)).toFixed(2)}% 0)`;
  const imp = t >= 3.0 ? Math.exp(-(t - 3.0) * 9) : 0;
  s2in.style.transform = `scale(${(t < 3.0 ? lerp(.5, 1, z) : 1 + .05 * imp).toFixed(4)})`;
  stripes.style.transform = `translate(${(t * 40) % 42.4}px, 0)`;
  lineEls.forEach(({ L, cs, fills }, li) => {
    cs.forEach((c, k) => {
      const e = tw(t, L.t0 + k * .03, L.t0 + .6 + k * .03, E.outExpo);
      const o = tw(t, 3.8 + li * .04 + k * .008, 4.08 + li * .04 + k * .008, E.inExpo);
      c.style.transform = `translate(${L.dir * o * 2300}px, ${(1 - e) * 108}%) rotate(${(1 - e) * 10}deg)`;
    });
    fills.forEach((f, k) => { const e = tw(t, 3.72 + k * .045, 3.95 + k * .045, E.outCubic); f.style.clipPath = `inset(${(100 * (1 - e)).toFixed(1)}% 0 0 0)`; });
  });
  const bp = t < 3.25 ? 0 : E.outBack(P(t, 3.25, 3.7));
  badge.style.transform = `scale(${bp}) rotate(${(1 - bp) * -90}deg)`;
  bg2.setAttribute('transform', `rotate(${t * 50})`);
  const tg = tw(t, 3.4, 3.8);
  s2tag.style.opacity = (tg * (1 - tw(t, 3.8, 3.95))).toFixed(3);
  s2tag.style.letterSpacing = `${lerp(.8, .34, tg)}em`;
});

// =============================================================== S1: THE LINE
const s1 = mk('div', cam, abs({ inset: 0, transformOrigin: '960px 540px' }));
const s1svg = sv('svg', s1, { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;inset:0;overflow:visible' });
const d1 = sv('defs', s1svg);
const fb = sv('filter', d1, { id: 'blur14', x: '-20%', y: '-20%', width: '140%', height: '140%' }); sv('feGaussianBlur', fb, { stdDeviation: 12 });
const rg = sv('radialGradient', d1, { id: 'headG' });
sv('stop', rg, { offset: '0', 'stop-color': '#ffffff', 'stop-opacity': 1 }); sv('stop', rg, { offset: '.25', 'stop-color': '#8cc4ff', 'stop-opacity': .8 }); sv('stop', rg, { offset: '1', 'stop-color': C.blue, 'stop-opacity': 0 });
const DPRE = 'M -90 790 C 230 790 300 300 560 350 C 790 394 730 660 575 618 C 430 578 520 390 760 390 C 860 390 905 390 960 390';
const DFULL = DPRE + ' A 150 150 0 0 1 960 690 A 150 150 0 0 1 960 390';
const measure = sv('path', s1svg, { d: DPRE, fill: 'none', stroke: 'none' });
const strokeG = sv('g', s1svg);
const pGlow = sv('path', strokeG, { d: DFULL, fill: 'none', stroke: C.blue, 'stroke-width': 30, 'stroke-linecap': 'round', opacity: .6, filter: 'url(#blur14)', pathLength: 1 });
const pMain = sv('path', strokeG, { d: DFULL, fill: 'none', stroke: '#2a8cff', 'stroke-width': 9, 'stroke-linecap': 'round', pathLength: 1 });
const pCore = sv('path', strokeG, { d: DFULL, fill: 'none', stroke: '#e6f3ff', 'stroke-width': 2.6, 'stroke-linecap': 'round', pathLength: 1 });
const fullLen = pMain.getTotalLength(), preLen = measure.getTotalLength(), FC = preLen / fullLen;
measure.remove();
const headGlow = sv('circle', s1svg, { r: 70, fill: 'url(#headG)' });
const headCore = sv('circle', s1svg, { r: 7, fill: '#fff' });
const s1canvas = mk('canvas', s1, abs({ inset: 0 })); s1canvas.width = W; s1canvas.height = H;
const s1ctx = s1canvas.getContext('2d');
const headP = t => E.inOutCubic(P(t, .22, 2.32));
const tailP = t => E.inOutCubic(P(t, .8, 2.42)) * FC;
const PARTS = []; { const r = rng(7); for (let i = 0; i < 340; i++) { const ts = .25 + r() * 2.1; const a = r() * Math.PI * 2, sp = 20 + r() * 150; PARTS.push({ ts, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, life: .5 + r() * 1.1, sz: .8 + r() * 2.6, w: r() }); } }
const ptCache = new Map();
const pointAt = p => { const k = Math.round(p * 4000); if (!ptCache.has(k)) { const q = pMain.getPointAtLength(k / 4000 * fullLen); ptCache.set(k, { x: q.x, y: q.y }); } return ptCache.get(k); };
const s1text = mk('div', s1, abs({ left: 0, right: 0, top: '772px', textAlign: 'center' }));
const s1l1 = mk('div', s1text, { overflow: 'hidden', font: `700 80px/1.15 ${MONT}`, letterSpacing: '-0.035em', paddingBottom: '4px' });
const s1l2 = mk('div', s1text, { overflow: 'hidden', font: `700 80px/1.15 ${MONT}`, letterSpacing: '-0.035em', paddingBottom: '14px' });
const mkWords = (line, list) => list.map(([w, css]) => { const s = mk('span', line, Object.assign({ display: 'inline-block', marginRight: '.24em' }, css || {}), w); return s; });
const s1w = [
  ...mkWords(s1l1, [['Every'], ['brand'], ['begins']]),
  ...mkWords(s1l2, [['with'], ['a'], ['single', { fontStyle: 'italic', fontWeight: 300, color: C.light }], ['line.', { fontStyle: 'italic', fontWeight: 300, color: C.light, marginRight: 0 }]]),
];
s1w[2].style.marginRight = 0;
const S1W_T = [.35, .5, .65, 1.0, 1.12, 1.24, 1.4];
updates.push(t => {
  const on = t < 3.02;
  show(s1, on); if (!on) return;
  const z = E.inExpo(P(t, 2.45, 3.0));
  s1.style.transform = `scale(${1 + 15 * z})`;
  s1.style.opacity = (1 - P(t, 2.9, 3.0)).toFixed(3);
  const p = headP(t), q = tailP(t);
  show(strokeG, p > 0);
  for (const el of [pGlow, pMain, pCore]) { el.setAttribute('stroke-dasharray', `${Math.max(0, p - q).toFixed(5)} 3`); el.setAttribute('stroke-dashoffset', (-q).toFixed(5)); }
  const pulse = Math.exp(-Math.max(0, t - 2.32) * 6) * (t > 2.32 ? 1 : 0);
  pMain.setAttribute('stroke-width', 9 + 6 * pulse); pGlow.setAttribute('opacity', (.6 + .4 * pulse).toFixed(3));
  const hp = pointAt(p), hv = p > 0 && p < 1 ? 1 : 0;
  const hf = hv * (1 - P(p, .96, 1));
  headGlow.setAttribute('cx', hp.x); headGlow.setAttribute('cy', hp.y); headGlow.setAttribute('opacity', hf.toFixed(3));
  headCore.setAttribute('cx', hp.x); headCore.setAttribute('cy', hp.y); headCore.setAttribute('opacity', hf.toFixed(3));
  // particles
  s1ctx.clearRect(0, 0, W, H);
  s1ctx.globalCompositeOperation = 'lighter';
  for (const pa of PARTS) {
    const age = t - pa.ts; if (age < 0 || age > pa.life) continue;
    const o = pointAt(headP(pa.ts));
    const k = (1 - Math.exp(-age * 2.2)) / 2.2;
    const x = o.x + pa.vx * k, y = o.y + pa.vy * k + 18 * age * age;
    const a = (1 - age / pa.life) ** 1.5;
    s1ctx.fillStyle = pa.w > .6 ? `rgba(255,255,255,${a})` : `rgba(80,160,255,${a})`;
    s1ctx.beginPath(); s1ctx.arc(x, y, pa.sz * (1 - age / pa.life * .5), 0, Math.PI * 2); s1ctx.fill();
  }
  s1w.forEach((w, i) => {
    const e = tw(t, S1W_T[i], S1W_T[i] + .7, E.outExpo);
    const o = tw(t, 1.98 + i * .035, 2.3 + i * .035, E.inCubic);
    w.style.transform = `translateY(${(1 - e) * 110 - o * 110}%)`;
  });
});

// =============================================================== S5: LOGO RESOLVE
const s5 = mk('div', cam, abs({ inset: 0 }));
const s5in = mk('div', s5, abs({ inset: 0, transformOrigin: '960px 540px' }));
const pale = mk('div', s5in, abs({ inset: '-60px', backgroundColor: C.pale, backgroundImage: 'repeating-linear-gradient(135deg, rgba(18,53,85,.045) 0 1px, transparent 1px 16px)' }));
const paleGlow = mk('div', pale, abs({ inset: 0, background: 'radial-gradient(ellipse 55% 55% at 50% 48%, rgba(255,255,255,.9), rgba(255,255,255,0) 70%)' }));
const s5canvas = mk('canvas', s5in, abs({ inset: 0 })); s5canvas.width = W; s5canvas.height = H;
const s5ctx = s5canvas.getContext('2d');
const fxSvg = sv('svg', s5in, { width: W, height: H, style: 'position:absolute;inset:0;overflow:visible' });
const fxDefs = sv('defs', fxSvg); const fxb = sv('filter', fxDefs, { id: 'fxblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }); sv('feGaussianBlur', fxb, { stdDeviation: 18 });
const core = sv('circle', fxSvg, { cx: 960, cy: 540, r: 10, fill: '#fff' });
const coreGlow = sv('circle', fxSvg, { cx: 960, cy: 540, r: 60, fill: C.blue, filter: 'url(#fxblur)' });
const waves = [0, 1, 2].map(i => sv('circle', fxSvg, { cx: 960, cy: 540, r: 0, fill: 'none', stroke: i === 1 ? '#fff' : C.blue }));
const edgeRing = sv('circle', fxSvg, { cx: 960, cy: 540, r: 0, fill: 'none', stroke: C.blue });
const BURST = []; { const r = rng(42); for (let i = 0; i < 160; i++) { const a = r() * Math.PI * 2; BURST.push({ a, sp: 300 + r() * 1500, life: .6 + r() * 1.0, sz: 1 + r() * 3.5, w: r() }); } }
// lockup
const K = .82, LX = 291, LY = 238;
const lock = sv('svg', s5in, { viewBox: '80 233 1632 507', width: 1632 * K, height: 507 * K, style: `position:absolute;left:${LX}px;top:${LY}px;overflow:visible` });
const ld = sv('defs', lock);
const gf = sv('filter', ld, { id: 'mglow', x: '-30%', y: '-30%', width: '160%', height: '160%' }); sv('feGaussianBlur', gf, { stdDeviation: 7, result: 'b' }); const fm = sv('feMerge', gf); sv('feMergeNode', fm, { in: 'b' }); sv('feMergeNode', fm, { in: 'b' }); sv('feMergeNode', fm, { in: 'SourceGraphic' });
const cq = sv('clipPath', ld, { id: 'cq' }); const cqr = sv('rect', cq, { x: 850, y: 240, width: 0, height: 262 });
const cd = sv('clipPath', ld, { id: 'cd' }); const cdr = sv('rect', cd, { x: 850, y: 498, width: 0, height: 240 });
const shineG = sv('linearGradient', ld, { id: 'shine', x1: 0, y1: 0, x2: 1, y2: 0 });
sv('stop', shineG, { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0 }); sv('stop', shineG, { offset: .5, 'stop-color': '#fff', 'stop-opacity': .75 }); sv('stop', shineG, { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 });
const markClip = sv('clipPath', ld, { id: 'mclip' }); const markClipG = sv('g', markClip, { transform: 'translate(96 120)' });
const markG = sv('g', lock);
const markIn = sv('g', markG, { transform: 'translate(96 120)' });
const DRAW_COL = { 'qd-intro-line': '#9cc8f0', 'qd-intro-q': '#7fb2e0', 'qd-intro-ring': '#3d9bff' };
const markPaths = MARK.map((m, i) => {
  const p = sv('path', markIn, { d: m.d, 'fill-rule': 'evenodd', fill: m.fill, 'fill-opacity': 0, stroke: DRAW_COL[m.cls], 'stroke-width': 3, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, 'stroke-linejoin': 'round' });
  sv('path', markClipG, { d: m.d, 'fill-rule': 'evenodd' });
  return { p, m, i };
});
// draw order: outer ring, inner ring, Q, D lines
const DRAW_T = { 4: [15.08, .75], 3: [15.22, .7], 2: [15.32, .75], 1: [15.45, .8], 0: [15.6, .7] };
const shineRect = sv('rect', lock, { x: -300, y: 233, width: 260, height: 520, fill: 'url(#shine)', 'clip-path': 'url(#mclip)', transform: 'skewX(-18)', opacity: 0 });
const divider = sv('rect', lock, { x: 808, y: 264, width: 17, height: 410, fill: '#00122e', style: 'transform-box:fill-box;transform-origin:50% 50%' });
const wQ = sv('image', lock, { href: 'img/quille.png', x: 860, y: 250, width: 840, height: 250, 'clip-path': 'url(#cq)' });
const wD = sv('image', lock, { href: 'img/designs.png', x: 860, y: 500, width: 840, height: 230, 'clip-path': 'url(#cd)' });
const MC = [434, 465];                       // mark centre in viewBox units
const ALONE = [896, (540 - LY) / K + 233];   // viewBox point at screen centre
const tagLine = top => mk('div', s5in, abs({ left: 0, right: 0, top: `${top}px`, textAlign: 'center', overflow: 'hidden', font: `600 50px/1.25 ${MONT}`, letterSpacing: '-0.03em', color: C.navy2, paddingBottom: '8px' }));
const tag1 = tagLine(688), tag2 = tagLine(754);
const tagC1 = [...chars(tag1, 'Designed by '), ...chars(tag1, 'Quille.', { fontWeight: 800 })];
const tagC2 = [...chars(tag2, 'Remembered by '), ...chars(tag2, 'everyone.', { fontStyle: 'italic', fontWeight: 800, color: C.blue })];
const mail = mk('div', s5in, abs({ left: 0, right: 0, top: '858px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '22px', font: '500 25px Jost', letterSpacing: '.16em', color: C.muted }));
const mlL = mk('div', mail, { width: '90px', height: '2px', background: C.blue, transformOrigin: '100% 50%' });
const mailT = mk('div', mail, null, 'quilledesigns.sv@gmail.com');
const mlR = mk('div', mail, { width: '90px', height: '2px', background: C.blue, transformOrigin: '0 50%' });
updates.push(t => {
  t -= SH;
  const on = t >= 14.8;
  show(s5, on); if (!on) return;
  // core charge + burst
  const charge = P(t, 14.8, 15.0);
  const boom = P(t, 15.0, 15.5);
  core.setAttribute('r', t < 15 ? 3 + 14 * E.inQuad(charge) : 17 * (1 - E.outCubic(boom)));
  coreGlow.setAttribute('r', t < 15 ? 20 + 120 * charge : 140 + 160 * E.outCubic(boom));
  coreGlow.setAttribute('opacity', (t < 15 ? charge : (1 - boom) ** 2).toFixed(3));
  core.setAttribute('opacity', t < 15.5 ? 1 : 0);
  waves.forEach((w, i) => {
    const e = P(t, 15.0 + i * .07, 15.95 + i * .07);
    w.setAttribute('r', 1900 * E.outExpo(e) * (i === 1 ? .8 : 1));
    w.setAttribute('stroke-width', (i === 1 ? 4 : 14) * (1 - e) + .5);
    w.setAttribute('opacity', (e > 0 && e < 1 ? (1 - e) : 0).toFixed(3));
  });
  s5ctx.clearRect(0, 0, W, H);
  s5ctx.globalCompositeOperation = 'lighter';
  for (const b of BURST) {
    const age = t - 15.0; if (age < 0 || age > b.life) continue;
    const k = (1 - Math.exp(-age * 3.5)) / 3.5;
    const x = 960 + Math.cos(b.a) * b.sp * k, y = 540 + Math.sin(b.a) * b.sp * k;
    const a = (1 - age / b.life) ** 1.4;
    const tail = 26 * Math.exp(-age * 4) * (b.sp / 1000);
    s5ctx.strokeStyle = b.w > .55 ? `rgba(255,255,255,${a})` : `rgba(60,150,255,${a})`;
    s5ctx.lineWidth = b.sz; s5ctx.lineCap = 'round';
    s5ctx.beginPath(); s5ctx.moveTo(x, y); s5ctx.lineTo(x - Math.cos(b.a) * tail, y - Math.sin(b.a) * tail); s5ctx.stroke();
  }
  // pale reveal from the mark
  const rev = tw(t, 16.45, 17.25, E.outExpo);
  pale.style.clipPath = rev >= 1 ? 'none' : `circle(${(rev * 2300).toFixed(1)}px at 1020px 600px)`;
  show(pale, t >= 16.45);
  edgeRing.setAttribute('r', rev * 2300); edgeRing.setAttribute('stroke-width', 26 * (1 - rev)); edgeRing.setAttribute('opacity', (rev > 0 && rev < 1 ? 1 - rev * .7 : 0).toFixed(3));
  // mark draw
  const fill = tw(t, 16.45, 16.6, E.outCubic);
  markPaths.forEach(({ p, m, i }) => {
    const [t0, d] = DRAW_T[i];
    const e = E.inOutCubic(P(t, t0, t0 + d));
    p.setAttribute('stroke-dashoffset', (1 - e).toFixed(4));
    p.setAttribute('fill-opacity', fill.toFixed(3));
    p.setAttribute('stroke', fill > .5 ? m.fill : DRAW_COL[m.cls]);
    p.setAttribute('stroke-width', fill > .5 ? 1 : 3 + 2 * Math.exp(-Math.max(0, t - t0 - d) * 4));
    if (fill > .5) p.setAttribute('stroke-dasharray', 'none'); else p.setAttribute('stroke-dasharray', '1 1');
  });
  markG.setAttribute('filter', t < 16.47 ? 'url(#mglow)' : '');
  const mv = tw(t, 16.62, 17.35, E.inOutCubic);
  const drift = 1.32 + .08 * P(t, 15.0, 16.5);
  const hitK = t >= 16.45 ? 1 + .1 * Math.exp(-(t - 16.45) * 10) * Math.sin(Math.min(1, (t - 16.45) * 10) * Math.PI) : 1;
  const sc = lerp(drift, 1, mv) * hitK;
  const cx = lerp(ALONE[0], MC[0], mv), cy = lerp(ALONE[1], MC[1], mv);
  markG.setAttribute('transform', `translate(${cx} ${cy}) scale(${sc}) translate(${-MC[0]} ${-MC[1]})`);
  divider.style.transform = `scaleY(${tw(t, 17.02, 17.45, E.outExpo)})`;
  const q1 = tw(t, 17.12, 17.75, E.outExpo), q2 = tw(t, 17.3, 17.95, E.outExpo);
  cqr.setAttribute('width', 860 * q1); wQ.setAttribute('x', 860 - 70 * (1 - q1));
  cdr.setAttribute('width', 860 * q2); wD.setAttribute('x', 860 - 70 * (1 - q2));
  const sh = P(t, 18.95, 19.75);
  shineRect.setAttribute('x', lerp(-60, 1100, E.inOutCubic(sh))); shineRect.setAttribute('opacity', sh > 0 && sh < 1 ? 1 : 0);
  tagC1.forEach((c, i) => { const e = tw(t, 17.85 + i * .02, 18.5 + i * .02, E.outExpo); c.style.transform = `translateY(${(1 - e) * 110}%)`; });
  tagC2.forEach((c, i) => { const e = tw(t, 18.12 + i * .02, 18.77 + i * .02, E.outExpo); c.style.transform = `translateY(${(1 - e) * 110}%)`; });
  const ml = tw(t, 18.55, 19.2, E.outExpo);
  mlL.style.transform = mlR.style.transform = `scaleX(${ml})`;
  mailT.style.opacity = tw(t, 18.65, 19.1).toFixed(3); mailT.style.letterSpacing = `${lerp(.3, .08, ml)}em`;
  s5in.style.transform = `scale(${1 + .03 * E.inOutSine(P(t, 17.2, 20))})`;
  paleGlow.style.opacity = (0.6 + .4 * Math.sin(t * 1.3)).toFixed(3);
});

// =============================================================== HUD + FINISHING
const hud = mk('div', stage, abs({ inset: 0, pointerEvents: 'none' }));
const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => mk('div', hud, abs({ [x ? 'right' : 'left']: '44px', [y ? 'bottom' : 'top']: '44px', width: '30px', height: '30px', [`border${y ? 'Bottom' : 'Top'}`]: '2px solid currentColor', [`border${x ? 'Right' : 'Left'}`]: '2px solid currentColor' })));
const hudTxt = css => mk('div', hud, abs(Object.assign({ font: '500 15px Jost', letterSpacing: '.3em', whiteSpace: 'nowrap' }, css)));
const hTL = hudTxt({ left: '92px', top: '50px' }); hTL.innerHTML = 'QUILLE DESIGNS <span style="opacity:.5">/ SHOWREEL 2026</span>';
const hTR = hudTxt({ right: '92px', top: '50px', textAlign: 'right' });
const hBL = hudTxt({ left: '92px', bottom: '50px', fontVariantNumeric: 'tabular-nums' });
const hBR = hudTxt({ right: '92px', bottom: '50px' }); hBR.textContent = 'BRANDING · MOTION · CONTENT';
const prog = mk('div', hud, abs({ left: 0, bottom: 0, height: '4px', width: '100%', background: C.blue, transformOrigin: '0 50%' }));
const SCN = [[0, '01 — THE LINE'], [3.0, '02 — MANIFESTO'], [4.0, '03 — SERVICES'], [7.0, '04 — SELECTED WORK'], [11.5, '05 — CLIENTS'], [15.0, '06 — QUILLE DESIGNS']].map(([s, l]) => [s >= 7 ? s + SH : s, l]);
const flash = mk('div', stage, abs({ inset: 0, background: '#fff', opacity: 0, pointerEvents: 'none' }));
const grain = mk('canvas', stage, abs({ inset: 0, width: '1920px', height: '1080px', mixBlendMode: 'overlay', opacity: .13, imageRendering: 'pixelated' })); grain.width = 960; grain.height = 540;
const gctx = grain.getContext('2d'), gimg = gctx.createImageData(960, 540);
const vign = mk('div', stage, abs({ inset: 0, background: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none' }));
const HITS = [[3.0, 16], [7.0 + SH, 7], [15.0 + SH, 26], [16.45 + SH, 9]];
const FLASHES = [[3.0, .4, 14], [6.96 + SH, .4, 16], [15.0 + SH, .65, 22], [16.45 + SH, .3, 16]];
updates.push(t => {
  // camera shake
  let sx = 0, sy = 0, sr = 0;
  for (const [h, a] of HITS) { if (t < h) continue; const d = t - h, k = a * Math.exp(-d * 7); sx += k * Math.sin(d * 63 + h); sy += k * Math.cos(d * 51 + h * 2); sr += k * .02 * Math.sin(d * 40); }
  cam.style.transform = `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px) rotate(${sr.toFixed(3)}deg)`;
  let fl = 0; for (const [h, a, k] of FLASHES) if (t >= h) fl += a * Math.exp(-(t - h) * k);
  flash.style.opacity = Math.min(1, fl).toFixed(3);
  // hud
  const light = tw(t, 16.5 + SH, 16.9 + SH, E.outCubic);
  hud.style.color = light > .5 ? `rgba(18,53,85,${.55})` : `rgba(255,255,255,${.6})`;
  hud.style.opacity = (tw(t, .3, 1.0) * (light > 0 && light < 1 ? Math.abs(light - .5) * 2 : 1)).toFixed(3);
  let lab = SCN[0][1]; for (const [s, l] of SCN) if (t >= s) lab = l; hTR.textContent = lab;
  const f = Math.floor(t * 60 + 1e-6);
  hBL.textContent = `TC 00:00:${String(Math.floor(f / 60)).padStart(2, '0')}:${String(f % 60).padStart(2, '0')}`;
  prog.style.transform = `scaleX(${(t / DUR).toFixed(4)})`;
  vign.style.opacity = (1 - .7 * light).toFixed(3);
  grain.style.opacity = (.13 - .08 * light).toFixed(3);
  // grain (seeded per 1/60 frame so motion-blur subframes share grain)
  const r = rng(f * 7919 + 13), d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { const v = r() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  gctx.putImageData(gimg, 0, 0);
});

window.DUR = DUR;
window.seek = t => { for (const u of updates) u(t); };
window.READY = (async () => {
  await document.fonts.ready;
  await Promise.all(['900 100px Montserrat', '800 100px Montserrat', 'italic 800 100px Montserrat', 'italic 300 100px Montserrat', '700 100px Montserrat', '600 100px Montserrat', '300 100px Montserrat', '500 20px Jost', '400 20px Jost'].map(f => document.fonts.load(f)));
  await Promise.all(['img/quille.png', 'img/designs.png'].map(src => { const i = new Image(); i.src = src; return i.decode(); }));
  await Promise.all(imgs.map(i => i.decode().catch(() => console.warn('img fail', i.src))));
  const t = parseFloat(new URLSearchParams(location.search).get('t') || '0');
  window.seek(t);
  return true;
})();
})();
