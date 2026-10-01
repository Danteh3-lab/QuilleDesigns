(() => {
  'use strict';

  const viewer = document.getElementById('mediaViewer');
  const menu = document.getElementById('mobileMenu');
  const menuButton = document.getElementById('menuBtn');
  const mediaContainer = document.getElementById('viewerMedia');
  const status = document.getElementById('viewerStatus');
  const source = document.getElementById('viewerSource');
  const filters = document.querySelector('.portfolio-filters');
  const sections = [...document.querySelectorAll('[data-category]')];
  const filterButtons = [...filters.querySelectorAll('button')];
  let opener = null;
  let mediaEvents = null;

  document.getElementById('year').textContent = new Date().getFullYear();

  // The full collection and direct media links remain usable without JavaScript.
  filters.hidden = false;
  const countFor = category => sections
    .filter(section => category === 'all' || section.dataset.category === category)
    .reduce((count, section) => count + section.querySelectorAll('[data-media]').length, 0);

  filterButtons.forEach(button => {
    button.querySelector('span').textContent = String(countFor(button.dataset.filter)).padStart(2, '0');
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      sections.forEach(section => { section.hidden = category !== 'all' && section.dataset.category !== category; });
      const count = countFor(category);
      document.querySelector('.collection-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    });
  });

  // Native modal dialogs provide focus containment and an inert background.
  if (typeof viewer.showModal !== 'function') return;
  document.body.classList.add('js-ready');

  // Scroll reveals enhance the content without making it disappear when this
  // feature is unsupported, or when the visitor requests reduced motion.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    menu.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
  });
  document.getElementById('menuClose').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  menu.addEventListener('close', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus({ preventScroll: true });
  });

  function releaseMedia() {
    mediaEvents?.abort();
    mediaEvents = null;
    const iframe = mediaContainer.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
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
      const youtubeId = link.dataset.youtubeId;
      const filePreview = window.location.protocol === 'file:';
      const canEmbedYouTube = Boolean(youtubeId) && !filePreview;
      document.getElementById('viewerTitle').textContent = link.dataset.title;
      document.getElementById('viewerCategory').textContent = isVideo ? 'Video' : 'Logo design';
      document.getElementById('viewerHint').textContent = isVideo ? 'Video playback' : 'Complete original artwork';
      source.href = link.href;
      source.textContent = isVideo ? (youtubeId ? 'Open on YouTube ↗' : 'Open video ↗') : 'Open original ↗';
      status.textContent = isVideo
        ? (youtubeId
          ? (canEmbedYouTube ? 'Loading YouTube player…' : 'This local file preview cannot identify the embed to YouTube. Open the hosted site, or use “Open on YouTube”.')
          : 'Loading video…')
        : 'Loading artwork…';

      const media = canEmbedYouTube
        ? document.createElement('iframe')
        : (isVideo && !youtubeId ? document.createElement('video') : (isVideo ? null : document.createElement('img')));
      const showError = () => {
        status.textContent = isVideo
          ? 'The video player could not be loaded. Try “Open on YouTube” below.'
          : 'This artwork could not be loaded. Try the “Open original” link below.';
      };
      media?.addEventListener('error', showError, options);
      if (isVideo) {
        if (canEmbedYouTube) {
          media.title = link.dataset.title + ' video player';
          media.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
          media.allowFullscreen = true;
          media.loading = 'eager';
          media.referrerPolicy = 'strict-origin-when-cross-origin';
          media.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          media.addEventListener('load', () => {
            status.textContent = 'If playback is unavailable, open this video on YouTube.';
          }, options);
          media.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(youtubeId) + '?autoplay=1&playsinline=1&rel=0';
        } else if (!youtubeId) {
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
        }
      } else {
        media.alt = link.querySelector('img').alt;
        media.addEventListener('load', () => { status.textContent = ''; }, options);
        media.src = link.href;
      }
      if (media) mediaContainer.append(media);
      viewer.showModal();
      if (isVideo && !youtubeId) {
        // This play request follows an explicit click; no media is fetched at page load.
        media.play().catch(() => {
          if (media.isConnected && !media.error) status.textContent = 'Press play to start the video.';
        });
      }
    });
  });

  document.getElementById('viewerClose').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    releaseMedia();
    status.textContent = '';
    opener?.focus({ preventScroll: true });
  });

  [viewer, menu].forEach(dialog => {
    // Keep keyboard traversal inside the dialog, including at browser-chrome boundaries.
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const targets = [...dialog.querySelectorAll('a[href], button:not([disabled]), video[controls], iframe')]
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

