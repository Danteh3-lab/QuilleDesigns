/*
 * Quille Designs homepage results charts. The charts are complete in the
 * markup; this only hides them until they scroll into view and then draws
 * them in (results-charts.css). Without JS, IntersectionObserver or with
 * reduced motion they simply stay drawn.
 */
(() => {
  'use strict';
  const charts = document.querySelectorAll('[data-results-chart]');
  if (!charts.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('results-charts-armed');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-drawn');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  charts.forEach((chart) => observer.observe(chart));
})();
