(() => {
  'use strict';
  const page = document.querySelector('.services-page-shell');
  if (!page || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  // Content stays visible in the document. Only animate when it enters view;
  // separate translate from transform so the card's hover effect still works.
  const targets = [...page.querySelectorAll('[data-reveal]')];
  const cards = [...page.querySelectorAll('.services-page-card')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealed = new WeakSet();
  const active = new Map();
  let observer;

  function reveal(element, animate = true) {
    observer?.unobserve(element);
    if (revealed.has(element)) {
      if (!animate) active.get(element)?.cancel();
      return;
    }
    revealed.add(element);
    element.classList.add('is-visible');
    if (!animate || motion.matches) return;
    const index = cards.indexOf(element);
    const animation = element.animate([
      { opacity: 0, translate: '0 24px' },
      { opacity: 1, translate: '0 0' }
    ], {
      duration: 800,
      delay: index < 0 ? 0 : (index % 3) * 60,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'backwards'
    });
    active.set(element, animation);
    animation.onfinish = animation.oncancel = () => active.delete(element);
  }

  function syncMotion() {
    observer?.disconnect();
    if (motion.matches) {
      active.forEach(animation => animation.cancel());
      active.clear();
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    targets.filter(element => !revealed.has(element)).forEach(element => observer.observe(element));
  }

  page.addEventListener('focusin', event => {
    const element = event.target.closest('[data-reveal]');
    if (element) reveal(element, false);
  });
  motion.addEventListener('change', syncMotion);
  syncMotion();
})();
