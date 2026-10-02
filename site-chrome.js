(() => {
  'use strict';
  const nav = document.getElementById('nav');
  const menu = document.getElementById('mobileMenu');
  const menuButton = document.getElementById('menuBtn');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portfolio = document.body.classList.contains('portfolio-gallery');
  const page = portfolio ? 'portfolio' : 'home';
  document.querySelectorAll('[data-nav-page]').forEach(link => {
    if (link.dataset.navPage === page) link.setAttribute('aria-current', 'page');
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  function closeMenu() { if (menu.open) menu.close(); }
  window.quilleSite = { closeMenu };
  if (typeof menu.showModal === 'function') {
    nav.classList.add('chrome-ready');
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => {
      menu.showModal();
      menuButton.setAttribute('aria-expanded', 'true');
      nav.classList.remove('is-hidden');
      window.lenisInstance?.stop();
      document.dispatchEvent(new Event('site-menu-change'));
    });
    document.getElementById('menuClose').addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    menu.addEventListener('close', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      window.lenisInstance?.start();
      menuButton.focus({ preventScroll: true });
      document.dispatchEvent(new Event('site-menu-change'));
    });
    menu.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const targets = [...menu.querySelectorAll('a[href],button')];
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  let lastY = window.scrollY;
  function onNavScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', !reduceMotion.matches && !menu.open && y > lastY && y > 400);
    lastY = y;
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  reduceMotion.addEventListener('change', onNavScroll);
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  onNavScroll();
})();

