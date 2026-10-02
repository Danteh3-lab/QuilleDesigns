(() => {
  'use strict';

  const viewer = document.getElementById('mediaViewer');
  const menu = document.getElementById('mobileMenu');
  const mediaContainer = document.getElementById('viewerMedia');
  const status = document.getElementById('viewerStatus');
  const source = document.getElementById('viewerSource');
  const filters = document.querySelector('.portfolio-filters');
  const sections = [...document.querySelectorAll('[data-category]')];
  const projectGroups = [...document.querySelectorAll('[data-project-group]')];
  const filterButtons = [...filters.querySelectorAll('button')];
  let opener = null;
  let mediaEvents = null;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const previewToggle = document.getElementById('previewToggle');
  const previews = [...document.querySelectorAll('[data-preview]')];
  const visiblePreviews = new Set();
  const pendingPreviews = new Set();
  let previewsPaused = false;

  function shouldPlayPreview(video) {
    return visiblePreviews.has(video) && !previewsPaused && !motionPreference.matches
      && !document.hidden && !viewer.open && !menu.open
      && !video.closest('[data-category]').hidden;
  }

  function syncPreview(video) {
    const shouldPlay = shouldPlayPreview(video);
    // Set the property as well as the HTML attribute before loading a source.
    video.defaultMuted = true;
    video.muted = true;
    video.autoplay = shouldPlay;
    if (!shouldPlay) {
      video.pause();
      if (motionPreference.matches) video.classList.remove('is-playing');
      return;
    }
    if (!video.hasAttribute('src')) {
      video.preload = 'auto';
      video.src = video.closest('[data-media]').href;
    }
    if (!video.paused || pendingPreviews.has(video)) return;
    pendingPreviews.add(video);
    let interrupted = false;
    video.play().then(() => {
      // Visibility or a dialog may have changed while playback was starting.
      if (!shouldPlayPreview(video)) video.pause();
    }).catch(error => {
      // Keep the poster and the Watch film link if autoplay is denied.
      interrupted = error.name === 'AbortError';
    }).finally(() => {
      pendingPreviews.delete(video);
      if (interrupted && shouldPlayPreview(video)) syncPreview(video);
    });
  }

  function syncPreviews() {
    previews.forEach(syncPreview);
    previewToggle.hidden = motionPreference.matches
      || sections.find(section => section.dataset.category === 'video').hidden;
    previewToggle.textContent = previewsPaused ? 'Resume previews' : 'Pause previews';
    previewToggle.setAttribute('aria-pressed', String(previewsPaused));
  }

  previews.forEach(video => {
    video.addEventListener('playing', () => {
      if (shouldPlayPreview(video)) video.classList.add('is-playing');
      else video.pause();
    });
    video.addEventListener('canplay', () => syncPreview(video));
    video.addEventListener('error', () => video.classList.remove('is-playing'));
  });
  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('[data-preview]');
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) visiblePreviews.add(video);
        else visiblePreviews.delete(video);
        syncPreview(video);
      });
    }, { threshold: [0, 0.12] });
    previews.forEach(video => previewObserver.observe(video.closest('[data-media]')));
  } else {
    previews.forEach(video => visiblePreviews.add(video));
  }
  previewToggle.addEventListener('click', () => {
    previewsPaused = !previewsPaused;
    syncPreviews();
  });
  document.addEventListener('visibilitychange', syncPreviews);
  motionPreference.addEventListener('change', syncPreviews);
  syncPreviews();


  // The full collection and direct media links remain usable without JavaScript.
  filters.hidden = false;
  const countFor = category => sections
    .filter(section => category === 'all' || section.dataset.category === category)
    .reduce((count, section) => count + section.querySelectorAll('[data-media]').length, 0);

  document.querySelectorAll('[data-count-category]').forEach(element => {
    element.textContent = String(countFor(element.dataset.countCategory)).padStart(2, '0');
  });

  const ticker = document.querySelector('.collection-ticker');
  const tickerToggle = document.getElementById('tickerToggle');
  const tickerCopy = ticker.querySelector('.ticker-group').cloneNode(true);
  tickerCopy.classList.add('ticker-copy');
  tickerCopy.setAttribute('aria-hidden', 'true');
  ticker.querySelector('.ticker-track').append(tickerCopy);
  ticker.classList.add('ticker-ready');
  tickerToggle.addEventListener('click', () => {
    const paused = ticker.classList.toggle('ticker-paused');
    tickerToggle.setAttribute('aria-pressed', String(paused));
    tickerToggle.setAttribute('aria-label', paused ? 'Resume project ticker' : 'Pause project ticker');
    tickerToggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
  });

  function syncMotion() {
    document.body.classList.toggle('motion-reduced', motionPreference.matches);
    tickerToggle.hidden = motionPreference.matches;
  }
  motionPreference.addEventListener('change', syncMotion);
  syncMotion();

  filterButtons.forEach(button => {
    button.querySelector('span').textContent = String(countFor(button.dataset.filter)).padStart(2, '0');
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      sections.forEach(section => { section.hidden = category !== 'all' && section.dataset.category !== category; });
      projectGroups.forEach(group => { group.hidden = !group.querySelector('[data-category]:not([hidden])'); });
      syncPreviews();
      const count = countFor(category);
      document.querySelector('.collection-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    });
  });

  // Native modal dialogs provide focus containment and an inert background.
  if (typeof viewer.showModal !== 'function') return;
  document.body.classList.add('js-ready');

  // Scroll reveals enhance the content without making it disappear when this
  // feature is unsupported, or when the visitor requests reduced motion.
  const reduceMotion = motionPreference.matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.querySelectorAll('.film-card, .logo-card').forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${(index % 3) * 60}ms`);
    });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
    document.body.classList.add('motion-ready');
    document.querySelectorAll('.portfolio-intro [data-enter]').forEach(element => {
      element.addEventListener('animationend', () => { element.style.animation = 'none'; }, { once: true });
    });
  }
  document.addEventListener('site-menu-change', syncPreviews);

  function releaseMedia() {
    mediaEvents?.abort();
    mediaEvents = null;
    const video = mediaContainer.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    mediaContainer.replaceChildren();
  }

  document.querySelectorAll('[data-media]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      releaseMedia();
      mediaEvents = new AbortController();
      const options = { signal: mediaEvents.signal };
      const isVideo = link.dataset.media === 'video';
      document.getElementById('viewerTitle').textContent = link.dataset.title;
      document.getElementById('viewerCategory').textContent = isVideo ? 'Video' : 'Logo design';
      document.getElementById('viewerHint').textContent = isVideo ? 'Video playback' : 'Complete original artwork';
      source.href = link.href;
      source.textContent = isVideo ? 'Open video ↗' : 'Open original ↗';
      status.textContent = isVideo ? 'Loading video…' : 'Loading artwork…';

      const media = document.createElement(isVideo ? 'video' : 'img');
      const showError = () => {
        status.textContent = isVideo
          ? 'The video could not be loaded. Try “Open video” below.'
          : 'This artwork could not be loaded. Try the “Open original” link below.';
      };
      media?.addEventListener('error', showError, options);
      if (isVideo) {
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.poster = link.dataset.poster;
        media.setAttribute('aria-label', `${link.dataset.title} video`);
        media.addEventListener('loadeddata', () => { status.textContent = ''; }, options);
        media.addEventListener('playing', () => { status.textContent = ''; }, options);
        media.addEventListener('waiting', () => { status.textContent = 'Buffering video…'; }, options);
        media.addEventListener('stalled', () => { status.textContent = 'The video is taking longer to load. You can also use “Open video” below.'; }, options);
        media.src = link.href;
      } else {
        media.alt = link.querySelector('img').alt;
        media.addEventListener('load', () => { status.textContent = ''; }, options);
        media.src = link.href;
      }
      if (media) mediaContainer.append(media);
      viewer.showModal();
      syncPreviews();
      if (isVideo) {
        // Full playback with sound follows the visitor's explicit selection.
        media.play().catch(() => {
          if (media.isConnected && !media.error) status.textContent = 'Press play to start the video.';
        });
      }
    });
  });

  document.getElementById('viewerClose').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    releaseMedia();
    syncPreviews();
    status.textContent = '';
    opener?.focus({ preventScroll: true });
  });

  [viewer].forEach(dialog => {
    // Keep keyboard traversal inside the dialog, including at browser-chrome boundaries.
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const targets = [...dialog.querySelectorAll('a[href], button:not([disabled]), video[controls]')]
        .filter(element => element.getClientRects().length > 0);
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
})();
