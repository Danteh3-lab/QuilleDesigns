/*
 * Quille Designs scroll motion (homepage). Runs after the page's own GSAP
 * setup and adds one consistent motion language:
 *  1. Section headings rise line by line out of a mask.
 *  2. Work and expertise images open like a curtain (clip-path) while the
 *     picture settles from 115% to 100%, then drift gently with the scroll.
 *  3. Light sections slide over the dark section before them with rounded
 *     top corners; the section underneath sinks back and dims.
 *  4. The disciplines marquee leans into fast scrolling (skew).
 * Only transform, opacity and clip-path are animated. Nothing runs with
 * reduced motion or without GSAP + ScrollTrigger.
 */
(() => {
  'use strict';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  root.classList.add('qd-motion');

  // Undo the generic fade-up the page set on an element, so ours replaces it.
  const takeOver = (el) => {
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'opacity,visibility,transform' });
  };

  /* 1. Headings: line-by-line mask reveal.
     Text nodes are moved, never rewritten, so language.js can still translate them. */
  const headings = gsap.utils.toArray('main section:not(#hero) h2').filter((h) => !h.closest('.site-footer'));
  headings.forEach((heading) => {
    takeOver(heading);
    const parts = [...heading.childNodes].filter((node) => !(node.nodeName === 'BR' || (node.nodeType === 3 && !node.textContent.trim())));
    const inners = parts.map((node) => {
      const line = document.createElement('span');
      line.className = 'qd-line';
      const inner = document.createElement('span');
      inner.className = 'qd-line-inner';
      // An inline-block drops a text node's edge spaces, so keep them outside the mask.
      const text = node.nodeType === 3 ? node.textContent : '';
      node.replaceWith(line);
      inner.append(node);
      line.append(inner);
      if (/^\s/.test(text)) line.before(' ');
      if (/\s$/.test(text)) line.after(' ');
      if (node.nodeType === 1 && /\s$/.test(node.textContent) && line.nextSibling?.nodeType !== 3) line.after(' ');
      return inner;
    });
    if (!inners.length) return;
    gsap.set(inners, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(inners, { yPercent: 0, duration: 1.15, stagger: 0.12, ease: 'expo.out' })
    });
  });

  /* 2. Images: curtain reveal, then a soft parallax inside the frame. */
  const frames = gsap.utils.toArray('.showcase-visual, .expertise-art');
  frames.forEach((frame, index) => {
    const picture = frame.querySelector('img, video') || frame;
    gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (picture !== frame) gsap.set(picture, { scale: 1.15 });
    const stagger = frame.classList.contains('expertise-art') ? (index % 4) * 0.08 : 0;
    ScrollTrigger.create({
      trigger: frame,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, delay: stagger, ease: 'expo.inOut', onComplete: () => gsap.set(frame, { clearProps: 'clipPath' }) });
        if (picture !== frame) gsap.to(picture, { scale: 1.04, duration: 1.8, delay: stagger, ease: 'expo.out' });
      }
    });
    if (picture !== frame && frame.classList.contains('showcase-visual')) {
      gsap.fromTo(picture, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });

  /* 3. Light sections slide over the dark one before them. */
  const sheets = [
    { sheet: '#statement', under: '#hero' },
    { sheet: '#results', under: '#process' }
  ];
  sheets.forEach(({ sheet, under }) => {
    const top = document.querySelector(sheet);
    const below = document.querySelector(under);
    if (!top || !below) return;
    top.classList.add('qd-sheet');
    const shade = document.createElement('div');
    shade.className = 'qd-sheet-shade';
    shade.setAttribute('aria-hidden', 'true');
    below.append(shade);
    gsap.fromTo(top, { '--qd-sheet-radius': '56px', y: 90 }, {
      '--qd-sheet-radius': '0px', y: 0, ease: 'none',
      scrollTrigger: { trigger: top, start: 'top bottom', end: 'top 25%', scrub: true }
    });
    gsap.fromTo(shade, { opacity: 0 }, {
      opacity: 0.55, ease: 'none',
      scrollTrigger: { trigger: top, start: 'top bottom', end: 'top top', scrub: true }
    });
  });

  /* 4. Marquee leans into fast scrolling. */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const lean = gsap.quickTo(marquee, 'skewX', { duration: 0.5, ease: 'power3.out' });
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-12, 12, self.getVelocity() / -260);
        lean(v);
      }
    });
    let settle;
    addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(() => lean(0), 140); }, { passive: true });
  }

  // Images and fonts change heights; keep trigger positions right.
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
