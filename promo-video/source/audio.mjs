// Procedural soundtrack for the Quille Designs promo, 120 BPM, synced to promo.js timings.
import { writeFileSync } from 'node:fs';
const SR = 48000, DUR = 22, N = SR * DUR;
const SH = 2.0, SVC = [4.0, 5.0, 6.0, 7.0]; // one extra bar for the slower WHAT WE DO section (matches promo.js)
const L = new Float32Array(N), R = new Float32Array(N);
const RL = new Float32Array(N), RR = new Float32Array(N); // reverb send
const TAU = Math.PI * 2;
let seed = 1234567;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

class Biquad {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; }
  set(type, f, q = .707) {
    f = clamp(f, 10, SR * .45);
    const w = TAU * f / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2; const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0; return this;
  }
  p(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}
// write helper: fn(t) -> [l, r] or number, with send amount
function voice(t0, dur, fn, { gain = 1, pan = 0, send = 0 } = {}) {
  const i0 = Math.max(0, Math.floor(t0 * SR)), i1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4) * Math.SQRT2, gr = gain * Math.sin((pan + 1) * Math.PI / 4) * Math.SQRT2;
  for (let i = i0; i < i1; i++) {
    const t = Math.max(0, i / SR - t0); let v = fn(t, i);
    let l, r; if (typeof v === 'number') { l = v * gl; r = v * gr; } else { l = v[0] * gain; r = v[1] * gain; }
    L[i] += l; R[i] += r; if (send) { RL[i] += l * send; RR[i] += r * send; }
  }
}

// ---------------- instruments
function kick(t0, g = 1) {
  let ph = 0;
  voice(t0, .5, t => { const f = 42 + 120 * Math.exp(-t * 30); ph += TAU * f / SR; const env = Math.exp(-t * 6.5) * Math.min(1, t * 2000); return Math.tanh(1.8 * Math.sin(ph) * env) * .9 + noise() * Math.exp(-t * 400) * .25; }, { gain: .85 * g });
}
function clap(t0, g = 1) {
  const bp = new Biquad().set('bp', 1300, .9), hp = new Biquad().set('hp', 600);
  voice(t0, .4, t => { const b = [0, .011, .022].reduce((s, o) => s + (t >= o ? Math.exp(-(t - o) * 90) : 0), 0) + Math.exp(-Math.max(0, t - .022) * 16) * .55; return hp.p(bp.p(noise())) * b * 1.4; }, { gain: .32 * g, send: .35, pan: .05 });
}
function hat(t0, g = 1, open = false) {
  const hp = new Biquad().set('hp', 8000, .8), hp2 = new Biquad().set('hp', 6000);
  voice(t0, open ? .25 : .07, t => hp2.p(hp.p(noise())) * Math.exp(-t * (open ? 14 : 70)), { gain: .16 * g, pan: open ? -.3 : .3, send: .05 });
}
function snare(t0, g = 1) {
  const bp = new Biquad().set('bp', 2200, .6); let ph = 0;
  voice(t0, .25, t => { ph += TAU * (190 + 60 * Math.exp(-t * 40)) / SR; return (bp.p(noise()) * 1.2 + Math.sin(ph) * .5) * Math.exp(-t * 22); }, { gain: .3 * g, send: .2 });
}
function bassNote(t0, dur, f, g = 1) {
  const lp = new Biquad(); let ph = 0;
  voice(t0, dur + .05, t => {
    ph += f / SR; const saw = 2 * (ph % 1) - 1;
    lp.set('lp', 180 + 420 * Math.exp(-t * 6), 1.1);
    const env = Math.min(1, t * 200) * Math.min(1, Math.max(0, (dur + .05 - t) * 30));
    return Math.tanh((lp.p(saw) * .9 + Math.sin(TAU * ph) * .7) * 1.4) * env;
  }, { gain: .34 * g });
}
function pad(t0, dur, freqs, { g = 1, cut0 = 400, cut1 = 2200, att = .6, rel = .8, send = .5 } = {}) {
  const lpL = new Biquad(), lpR = new Biquad(); const phs = freqs.flatMap(f => [-7, 0, 7].map(c => ({ f: f * 2 ** (c / 1200), p: rnd(), side: c / 7 })));
  voice(t0, dur + rel, (t) => {
    let l = 0, r = 0;
    for (const o of phs) { o.p += o.f / SR; const s = 2 * (o.p % 1) - 1; l += s * (1 - o.side * .5); r += s * (1 + o.side * .5); }
    const x = clamp(t / dur, 0, 1), cut = cut0 * (cut1 / cut0) ** x;
    lpL.set('lp', cut, .8); lpR.set('lp', cut, .8);
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    return [lpL.p(l) * env / phs.length, lpR.p(r) * env / phs.length];
  }, { gain: .9 * g, send });
}
function pluck(t0, f, g = 1, pan = 0) {
  const lp = new Biquad(); let ph = rnd();
  voice(t0, .35, t => { ph += f / SR; const s = 2 * (ph % 1) - 1 + (2 * ((ph * 1.005) % 1) - 1); lp.set('lp', 500 + 5000 * Math.exp(-t * 18), 1.5); return lp.p(s) * Math.exp(-t * 9) * Math.min(1, t * 800); }, { gain: .09 * g, pan, send: .3 });
}
function whoosh(t0, dur, f0, f1, g = 1, p0 = -.6, p1 = .6, q = 1.4) {
  const bp = new Biquad(), bp2 = new Biquad();
  voice(t0, dur, t => {
    const x = t / dur, f = f0 * (f1 / f0) ** x; bp.set('bp', f, q); bp2.set('bp', f * 1.5, q);
    const env = Math.sin(Math.PI * x ** .7) ** 2; const n = noise(); const v = (bp.p(n) + bp2.p(n) * .6) * env * 2.2;
    const pan = p0 + (p1 - p0) * x; return [v * (1 - pan) * .7, v * (1 + pan) * .7];
  }, { gain: .5 * g, send: .25 });
}
function riser(t0, dur, g = 1) {
  const bp = new Biquad(); let ph = 0;
  voice(t0, dur, t => {
    const x = t / dur; bp.set('bp', 300 * 30 ** x, 1.8); ph += (220 * 4 ** x) / SR;
    const env = x ** 2.2; return (bp.p(noise()) * 1.6 + Math.sin(TAU * ph) * .12 + Math.sin(TAU * ph * 1.5) * .06) * env;
  }, { gain: .45 * g, send: .35 });
}
function impact(t0, g = 1) {
  let ph = 0; const lp = new Biquad().set('lp', 3500), lp2 = new Biquad();
  voice(t0, 2.6, t => {
    ph += TAU * (32 + 50 * Math.exp(-t * 9)) / SR;
    lp2.set('lp', 200 + 6000 * Math.exp(-t * 7));
    const sub = Math.sin(ph) * Math.exp(-t * 1.6) * Math.min(1, t * 1500);
    const crack = lp.p(noise()) * Math.exp(-t * 18);
    const tail = lp2.p(noise()) * Math.exp(-t * 2.4) * .35;
    return Math.tanh((sub * 1.3 + crack * .8 + tail) * 1.3);
  }, { gain: .5 * g, send: .22 });
}
function blip(t0, f, g = 1, pan = 0) {
  let ph = 0;
  voice(t0, .3, t => { ph += TAU * f * (1 + .5 * Math.exp(-t * 60)) / SR; return (Math.sin(ph) + .25 * Math.sin(2 * ph)) * Math.exp(-t * 16) * Math.min(1, t * 3000); }, { gain: .2 * g, pan, send: .3 });
}
function tick(t0, g = 1, f = 2600, pan = 0) {
  const hp = new Biquad().set('hp', 3000); let ph = 0;
  voice(t0, .06, t => { ph += TAU * f / SR; return (Math.sin(ph) * .6 + hp.p(noise()) * .5) * Math.exp(-t * 160); }, { gain: .22 * g, pan, send: .12 });
}
function bell(t0, f, g = 1, pan = 0, dec = 2.2) {
  const parts = [[1, 1, 1], [2.76, .45, 1.8], [5.4, .25, 3], [8.93, .12, 4.5], [2, .3, 1.3]];
  voice(t0, 4, t => parts.reduce((s, [m, a, d]) => s + Math.sin(TAU * f * m * t) * a * Math.exp(-t * dec * d), 0) * Math.min(1, t * 2000), { gain: .1 * g, pan, send: .55 });
}
function reverseSwell(t1, dur, g = 1) {
  const hp = new Biquad().set('hp', 3500), lp = new Biquad().set('lp', 12000);
  voice(t1 - dur, dur, t => lp.p(hp.p(noise())) * (t / dur) ** 3.5, { gain: .4 * g, send: .3 });
}
function penScratch(t0, t1) {
  const bp = new Biquad(), hp = new Biquad().set('hp', 1500);
  const speed = x => { const d = 1e-3; const f = u => u < .5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2; return (f(clamp(x + d, 0, 1)) - f(clamp(x - d, 0, 1))) / (2 * d); };
  voice(t0, t1 - t0 + .2, t => { const x = t / (t1 - t0); const sp = speed(x) / 1.5; bp.set('bp', 1800 + 2600 * sp, 2.2); const grain = (rnd() < .5 ? 1 : .55); return hp.p(bp.p(noise()) * grain) * sp * 1.1 * Math.min(1, (t1 - t0 + .2 - t) * 5); }, { gain: .32, send: .25 });
  let ph = 0; voice(t0, t1 - t0, t => { const x = t / (t1 - t0); ph += TAU * (420 + 900 * x) / SR; return Math.sin(ph) * .05 * Math.sin(Math.PI * x); }, { gain: 1, send: .6 });
}

// ---------------- arrangement (beat = 0.5 s)
const NOTE = { D2: 73.42, Bb1: 58.27, F2: 87.31, C2: 65.41, D3: 146.83, F3: 174.61, A3: 220, C4: 261.63, E4: 329.63, Bb2: 116.54, G4: 392, C3: 130.81, E3: 164.81, G3: 196, D4: 293.66, A4: 440, C5: 523.25, F4: 349.23, D5: 587.33, E5: 659.25, F5: 698.46, A5: 880 };
const N_ = k => NOTE[k];
const CH = {
  Dm: { bass: N_('D2'), pad: ['D3', 'F3', 'A3', 'C4', 'E4'].map(N_), arp: ['D4', 'F4', 'A4', 'C5', 'E5'].map(N_) },
  Bb: { bass: N_('Bb1'), pad: ['Bb2', 'D3', 'F3', 'A3', 'C4'].map(N_), arp: ['D4', 'F4', 'A4', 'C5', 'D5'].map(N_) },
  F: { bass: N_('F2'), pad: ['F3', 'A3', 'C4', 'E4', 'G4'].map(N_), arp: ['C5', 'F4', 'A4', 'E5', 'G4'].map(N_) },
  C: { bass: N_('C2'), pad: ['C3', 'E3', 'G3', 'D4', 'E4'].map(N_), arp: ['C5', 'E4', 'G4', 'D5', 'E5'].map(N_) },
};

// Intro 0–3: pad, pen line, word ticks, riser
pad(0, 3.0, CH.Dm.pad, { g: .3, cut0: 250, cut1: 1600, att: 1.2, rel: .3 });
voice(0, 3, t => Math.sin(TAU * 36.71 * t) * Math.min(1, t / 1.5) * .14, { gain: 1 }); // low D drone
penScratch(.22, 2.32);
[.35, .5, .65, 1.0, 1.12, 1.24, 1.4].forEach((t, i) => tick(t, .7, 2200 + i * 120, (i % 2 ? .3 : -.3)));
bell(2.32, N_('A4'), .8, 0, 1.2); // circle closes
riser(1.6, 1.4, 1.1); reverseSwell(3.0, 1.0, 1);
whoosh(2.45, .58, 300, 4000, 1.2, 0, 0, 1.0); // zoom through the portal

// Hit + groove 3.0–16.5
impact(3.0, 1.0);
const bars = [['Dm', 3], ['Bb', 5], ['C', 7], ['F', 9], ['C', 11], ['Dm', 13], ['Bb', 15]];
for (const [c, t0] of bars) {
  const len = Math.min(2, 16.5 - t0);
  pad(t0, len, CH[c].pad, { g: .32, cut0: 900, cut1: 2400, att: .05, rel: .25, send: .4 });
  for (let e = 0; e < len * 4 - .01; e++) { const tt = t0 + e * .25; if (tt >= 16.5) break; bassNote(tt, .22, CH[c].bass * (e === 7 ? 2 : 1), e % 2 ? .75 : 1); }
}
for (let t = 3.0; t < 16.49; t += .5) {
  const n = Math.round((t - 3) / .5);
  kick(t, n === 0 ? 1.15 : 1);
  if (n % 2 === 1) clap(t);
  hat(t + .25, 1, n % 4 === 3);
  if (t > 4) hat(t + .125, .45), hat(t + .375, .45);
}
// clients section arp (13.5–16.5)
for (let t = 11.5 + SH, k = 0; t < 14.0 + SH; t += .125, k++) { const c = t < 13 + SH ? CH.Dm : CH.Bb; pluck(t, c.arp[k % 5], .9 + .3 * (k % 4 === 0), k % 2 ? .4 : -.4); }
// fill + build to the logo
for (let i = 0; i < 12; i++) snare(14.0 + SH + i * (.5 / 12) * (1 - i * .03), .4 + i * .05);
riser(13.9 + SH, 1.1, 1.2); reverseSwell(15.0 + SH, .8, 1.2);
whoosh(14.25 + SH, .75, 200, 3000, 1.0, -.8, .8, 1.2); // orbit spiral in

// transitions / UI sounds
whoosh(3.8, .4, 500, 2500, .8, -.8, .2);                // text flies off
SVC.forEach((t, i) => { whoosh(t - .08, .35, 900, 5000, .55, .6, -.2, 2); blip(t, [587.33, 659.25, 698.46, 880][i], .7, .2); });
whoosh(6.2 + SH, .8, 150, 2500, 1.0, 0, 0, 1);              // phone expands to fullscreen
impact(6.96 + SH, .45);
whoosh(9.0 + SH, .55, 400, 2000, .7, .5, -.2);              // editor rises
whoosh(9.42 + SH, .5, 2500, 600, .6, .9, .3);               // phone slides in
[9.75 + SH, 10.0 + SH].forEach(t => blip(t, 1174.66, .5, .4));    // chips
blip(10.55 + SH, 1318.5, .9, .5); bell(10.55 + SH, 1318.5, .35, .5, 3);        // heart
diamondTicks();
whoosh(11.15 + SH, .55, 300, 6000, 1.5, .9, -.9, 1.1);      // whip pan
for (let i = 0; i < 7; i++) blip(11.75 + SH + i * .1, [587.33, 698.46, 880, 1046.5, 880, 1174.66, 1396.9][i], .8, -.6 + i * .2); // logo pops

// Logo resolve 17–22
impact(15.0 + SH, 1.25);
bell(15.0 + SH, N_('F4'), .9, -.2, .7); bell(15.0 + SH, N_('C5'), .7, .2, .7);
pad(15.0 + SH, 1.45, CH.F.pad, { g: .28, cut0: 300, cut1: 1400, att: .5, rel: .3, send: .7 });
penScratch(15.08 + SH, 16.3 + SH);
[[15.08 + SH, 'F4'], [15.22 + SH, 'A4'], [15.32 + SH, 'C5'], [15.45 + SH, 'E5'], [15.6 + SH, 'G4']].forEach(([t, n], i) => bell(t, N_(n), .45, -.5 + i * .25, 1.5));
kick(16.45 + SH, 1.2); impact(16.45 + SH, .55);
pad(16.45 + SH, 3.0, [N_('F2'), N_('C3'), N_('A3'), N_('E4'), N_('G4'), N_('C5')], { g: .38, cut0: 1800, cut1: 700, att: .02, rel: .55, send: .7 });
bell(16.45 + SH, N_('A5'), .8, .3, .9); bell(16.45 + SH, N_('F5'), .6, -.3, .9);
tick(17.02 + SH, .8, 1800); tick(17.12 + SH, .6, 2400, -.3); tick(17.3 + SH, .6, 2800, .3);
whoosh(17.05 + SH, .5, 800, 3500, .45, -.6, .2, 2);
whoosh(17.85 + SH, .6, 1200, 4000, .35, .4, -.2, 2);
whoosh(18.1 + SH, .6, 1200, 4000, .3, -.4, .2, 2);
blip(18.6 + SH, 880, .5); blip(18.7 + SH, 1318.5, .4, .2);
for (let i = 0; i < 8; i++) bell(19.0 + SH + i * .07, [N_('C5'), N_('E5'), N_('G4') * 2, N_('A5'), N_('C5') * 2, N_('E5') * 2, N_('G4') * 4, N_('A5') * 2][i], .22, -.6 + i * .17, 2.5); // shine glitter
voice(16.45 + SH, 3.55, t => Math.sin(TAU * 43.65 * t) * Math.exp(-t * .8) * .2, {}); // low F tail

function diamondTicks() {
  // keyframe diamonds on the editor timeline: playhead 9.3→11.5 across 0..1
  for (const k of [.06, .2, .44, .42, .6, .88]) tick(9.3 + SH + k * 2.2, .55, 3200, .2);
}

// ---------------- reverb (Schroeder/Freeverb-ish) on send bus
function reverb(inp, delays, ap) {
  const out = new Float32Array(N);
  const combs = delays.map(d => ({ buf: new Float32Array(d), i: 0, f: 0 }));
  const aps = ap.map(d => ({ buf: new Float32Array(d), i: 0 }));
  const fb = .86, damp = .3;
  for (let n = 0; n < N; n++) {
    const x = inp[n] * .25; let s = 0;
    for (const c of combs) { const y = c.buf[c.i]; c.f = y * (1 - damp) + c.f * damp; c.buf[c.i] = x + c.f * fb; c.i = (c.i + 1) % c.buf.length; s += y; }
    for (const a of aps) { const b = a.buf[a.i]; const y = -s + b; a.buf[a.i] = s + b * .5; a.i = (a.i + 1) % a.buf.length; s = y; }
    out[n] = s;
  }
  return out;
}
const sc = SR / 44100;
const wl = reverb(RL, [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(d => Math.round(d * sc)), [556, 441, 341, 225].map(d => Math.round(d * sc)));
const wr = reverb(RR, [1139, 1211, 1300, 1379, 1445, 1514, 1580, 1640].map(d => Math.round(d * sc)), [579, 464, 364, 248].map(d => Math.round(d * sc)));
for (let i = 0; i < N; i++) { L[i] += wl[i] * .9; R[i] += wr[i] * .9; }

// ---------------- master: DC/HP, glue limiter, fades
const hpL = new Biquad().set('hp', 25), hpR = new Biquad().set('hp', 25);
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = hpL.p(L[i]); R[i] = hpR.p(R[i]); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
let ss = 0; for (let i = 4 * SR; i < (14 + SH) * SR; i++) ss += L[i] * L[i] + R[i] * R[i];
const rms = Math.sqrt(ss / (DUR * SR)); const pre = .17 / rms;
let env = 0; const thr = .82;
for (let i = 0; i < N; i++) {
  let l = L[i] * pre, r = R[i] * pre;
  const a = Math.max(Math.abs(l), Math.abs(r));
  env = a > env ? a : env * .9997 + a * .0003;
  const gr = env > thr ? thr / env : 1;
  l *= gr; r *= gr;
  const t = i / SR, fade = Math.min(1, t / .02) * Math.min(1, (DUR - t) / .6);
  L[i] = Math.tanh(l * 1.15) * .93 * fade; R[i] = Math.tanh(r * 1.15) * .93 * fade;
}
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(clamp(L[i], -1, 1) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(clamp(R[i], -1, 1) * 32767), 46 + i * 4); }
writeFileSync(new URL('./soundtrack.wav', import.meta.url), buf);
console.log('wrote soundtrack.wav, raw peak', peak.toFixed(2));
