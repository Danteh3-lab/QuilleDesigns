(() => {
  'use strict';

  const viewer = document.getElementById('mediaViewer');
  const brandViewer = document.getElementById('brandViewer');
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
  // Film previews stay on their posters. Set to true to play them muted when visible.
  const AUTOPLAY_PREVIEWS = false;

  function shouldPlayPreview(video) {
    return AUTOPLAY_PREVIEWS && visiblePreviews.has(video) && !previewsPaused && !motionPreference.matches
      && !document.hidden && !viewer.open && !brandViewer.open && !menu.open
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
    previewToggle.hidden = !AUTOPLAY_PREVIEWS || motionPreference.matches
      || !sections.some(section => section.dataset.category === 'video' && !section.hidden);
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
    document.querySelectorAll('.brand-card, .logo-card').forEach((card, index) => {
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

  // Brand cards open a popup with every film made for that company.
  const brandStage = document.getElementById('brandStage');
  const brandStatus = document.getElementById('brandStatus');
  const brandReel = document.getElementById('brandReel');
  const brandSource = document.getElementById('brandSource');
  const brandLogo = document.getElementById('brandViewerLogo');
  const brandNow = document.querySelector('.brand-now');
  let brandOpener = null;
  let brandEvents = null;
  let brandLinks = [];

  // Logos sit on a light plate; mostly white logos get a dark plate so they stay readable.
  // Original logos on a solid background are trimmed to the artwork and the plate takes that background colour.
  function toneLogo(image) {
    const apply = () => {
      if (image.dataset.toned) return;
      image.dataset.toned = 'true';
      try {
        const canvas = document.createElement('canvas');
        const width = canvas.width = 160;
        const height = canvas.height = Math.max(1, Math.round(160 * image.naturalHeight / image.naturalWidth));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, width, height);
        const pixels = context.getImageData(0, 0, width, height).data;
        const at = (x, y) => (y * width + x) * 4;
        const corner = pixels.slice(0, 4);
        const opaque = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)].every(i => pixels[i + 3] > 250);
        if (opaque) {
          let left = width, top = height, right = -1, bottom = -1;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const i = at(x, y);
              if (Math.abs(pixels[i] - corner[0]) + Math.abs(pixels[i + 1] - corner[1]) + Math.abs(pixels[i + 2] - corner[2]) < 48) continue;
              left = Math.min(left, x); right = Math.max(right, x);
              top = Math.min(top, y); bottom = Math.max(bottom, y);
            }
          }
          const plate = image.parentElement;
          plate.classList.add('is-opaque-logo');
          plate.style.backgroundColor = `rgb(${corner[0]} ${corner[1]} ${corner[2]})`;
          // Artwork already made in the card's shape fills it edge to edge, untrimmed, losing at most a thin edge.
          if (Math.abs(image.naturalWidth / image.naturalHeight / (plate.clientWidth / plate.clientHeight) - 1) < 0.08) {
            plate.classList.add('is-full-logo');
            return;
          }
          if (right < 0) return;
          const scale = image.naturalWidth / width;
          const pad = Math.round(Math.max(right - left, bottom - top) * 0.04);
          const sx = Math.max(0, left - pad) * scale, sy = Math.max(0, top - pad) * scale;
          const sw = Math.min(width, right + pad + 1) * scale - sx, sh = Math.min(height, bottom + pad + 1) * scale - sy;
          const crop = document.createElement('canvas');
          const fit = Math.min(1, 1200 / sw);
          crop.width = Math.round(sw * fit);
          crop.height = Math.round(sh * fit);
          crop.getContext('2d').drawImage(image, sx, sy, sw, sh, 0, 0, crop.width, crop.height);
          image.src = crop.toDataURL('image/png');
          return;
        }
        let light = 0;
        let weight = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const alpha = pixels[i + 3] / 255;
          if (alpha < 0.2) continue;
          light += alpha * (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
          weight += alpha;
        }
        image.parentElement.classList.toggle('is-light-logo', weight > 0 && light / weight > 0.62);
      } catch {
        // A logo from another origin cannot be read and keeps the light plate.
      }
    };
    if (image.complete && image.naturalWidth) apply();
    else image.addEventListener('load', apply, { once: true });
  }
  document.querySelectorAll('.brand-card .brand-logo img').forEach(toneLogo);

  function releaseBrandMedia() {
    brandEvents?.abort();
    brandEvents = null;
    const video = brandStage.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    brandStage.replaceChildren();
  }

  function playBrandFilm(index, autoplay) {
    const link = brandLinks[index];
    releaseBrandMedia();
    brandEvents = new AbortController();
    const options = { signal: brandEvents.signal };
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = link.dataset.poster;
    video.setAttribute('aria-label', `${link.dataset.title} video`);
    video.addEventListener('error', () => { brandStatus.textContent = 'The video could not be loaded. Try “Open video” below.'; }, options);
    video.addEventListener('loadeddata', () => { brandStatus.textContent = ''; }, options);
    video.addEventListener('playing', () => { brandStatus.textContent = ''; }, options);
    video.addEventListener('waiting', () => { brandStatus.textContent = 'Buffering video…'; }, options);
    video.addEventListener('stalled', () => { brandStatus.textContent = 'The video is taking longer to load. You can also use “Open video” below.'; }, options);
    brandStatus.textContent = 'Loading video…';
    video.src = link.href;
    brandStage.append(video);
    brandStage.hidden = brandNow.hidden = false;
    document.getElementById('brandNowTitle').textContent = link.dataset.title;
    brandSource.href = link.href;
    brandReel.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    if (autoplay) {
      // Full playback with sound follows the visitor's explicit selection.
      video.play().catch(() => {
        if (video.isConnected && !video.error) brandStatus.textContent = 'Press play to start the video.';
      });
    }
  }

  function openBrand(card, selected = null, autoplay = true) {
    brandLinks = [...card.querySelectorAll('.brand-films [data-media]')];
    if (!brandLinks.length) return;
    brandOpener = card.querySelector('summary');
    const count = brandLinks.length;
    document.getElementById('brandViewerTitle').textContent = card.dataset.brandName;
    document.getElementById('brandViewerCount').textContent = String(count).padStart(2, '0');
    document.getElementById('brandViewerUnit').textContent = count === 1 ? 'film' : 'films';
    const cardLogo = card.querySelector('.brand-logo');
    brandLogo.hidden = !cardLogo;
    if (cardLogo) {
      brandLogo.querySelector('img').src = cardLogo.querySelector('img').src;
      brandLogo.classList.toggle('is-light-logo', cardLogo.classList.contains('is-light-logo'));
      brandLogo.classList.toggle('is-opaque-logo', cardLogo.classList.contains('is-opaque-logo'));
      brandLogo.style.backgroundColor = cardLogo.style.backgroundColor;
    }
    brandReel.replaceChildren(...brandLinks.map((link, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      const thumb = document.createElement('span');
      thumb.className = 'reel-thumb';
      const image = document.createElement('img');
      image.src = link.dataset.poster;
      image.alt = '';
      image.loading = 'lazy';
      const play = document.createElement('span');
      play.className = 'reel-play';
      play.setAttribute('aria-hidden', 'true');
      play.textContent = '▶';
      thumb.append(image, play);
      const title = document.createElement('span');
      title.textContent = link.dataset.title;
      title.dataset.clientContent = '';
      const caption = document.createElement('small');
      caption.textContent = link.closest('.project-card').querySelector('.project-caption p')?.textContent || '';
      button.append(thumb, title, caption);
      button.addEventListener('click', () => {
        playBrandFilm(index, true);
        brandViewer.scrollTo({ top: 0, behavior: motionPreference.matches ? 'auto' : 'smooth' });
      });
      item.append(button);
      return item;
    }));
    // The popup opens on a selection of the brand's films; a film plays once it is chosen.
    releaseBrandMedia();
    brandStatus.textContent = '';
    brandStage.hidden = brandNow.hidden = true;
    if (!brandViewer.open) brandViewer.showModal();
    brandViewer.scrollTo(0, 0);
    syncPreviews();
    const chosen = brandLinks.findIndex(link => link.closest('.project-card') === selected);
    if (chosen >= 0) playBrandFilm(chosen, autoplay);
  }

  document.querySelectorAll('details.brand-card').forEach(card => {
    card.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      openBrand(card);
    });
  });

  // Homepage links point at a film (#project-…) or a brand (#brand-…); open the brand that holds it.
  function openFromHash() {
    let target = null;
    try {
      target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    } catch {
      return;
    }
    const card = target?.closest('.brand-card');
    if (!card) return;
    card.scrollIntoView({ block: 'center' });
    openBrand(card, target.closest('.project-card'), false);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  document.getElementById('brandViewerClose').addEventListener('click', () => brandViewer.close());
  brandViewer.addEventListener('close', () => {
    releaseBrandMedia();
    brandStatus.textContent = '';
    syncPreviews();
    brandOpener?.focus({ preventScroll: true });
  });

  document.getElementById('viewerClose').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    releaseMedia();
    syncPreviews();
    status.textContent = '';
    opener?.focus({ preventScroll: true });
  });

  [viewer, brandViewer].forEach(dialog => {
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
