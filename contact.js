(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const copy = {
    en: {
      services: { logo: 'Logo design', poster: 'Poster design', 'business-card': 'Business card design' },
      loadingDays: 'Loading available days…',
      loadFailed: 'Could not load the available times. Check your connection and try again.',
      retry: 'Try again',
      noDays: 'There are no free times in the coming weeks. Send us an email and we will plan a time with you.',
      chooseDayFirst: 'Choose a day first.',
      noTimes: 'This day is fully booked. Choose another day.',
      free: n => (n === 1 ? '1 time' : `${n} times`),
      full: 'Full',
      closed: 'Closed',
      morning: 'Morning',
      afternoon: 'Afternoon',
      timeRange: (a, b) => `${a} – ${b}`,
      minutes: '30 min',
      note: 'Times are in Suriname time.',
      required: {
        service: 'Choose what you need.',
        date: 'Choose a day.',
        time: 'Choose a time.',
        name: 'Enter your name.',
        email: 'Enter a valid email address.',
        phone: 'Enter a phone number we can reach you on.',
        phoneOptional: 'Check your phone number.',
        services: 'Choose at least one option.',
        message: 'Tell us briefly about your project.'
      },
      fixErrors: 'Check the highlighted fields.',
      sending: 'Sending…',
      confirm: 'Confirm appointment',
      send: 'Send enquiry',
      slotTaken: 'Someone just booked this time. Choose another time.',
      tooMany: 'You already have upcoming appointments. Email us to change them.',
      tooManyEnquiries: 'We already received your enquiry. Email us if you want to add something.',
      network: 'Something went wrong. Check your connection and try again, or email us.',
      bookedTitle: 'Your appointment is booked',
      bookedText: (service, day, time) => `${service} on ${day} at ${time} (Suriname time). We will contact you at that time in the way you chose.`,
      calendar: 'Add to calendar',
      another: 'Book another appointment',
      enquiryTitle: 'Thank you, we received your enquiry',
      enquiryText: name => `Thanks ${name}. We will read your message and get in touch by email or phone.`,
      enquiryAnother: 'Send another enquiry',
      calendarTitle: service => `Quille Designs – ${service}`
    },
    nl: {
      services: { logo: 'Logo-ontwerp', poster: 'Posterontwerp', 'business-card': 'Visitekaartjesontwerp' },
      loadingDays: 'Beschikbare dagen laden…',
      loadFailed: 'De beschikbare tijden konden niet worden geladen. Controleer je verbinding en probeer het opnieuw.',
      retry: 'Opnieuw proberen',
      noDays: 'Er zijn de komende weken geen vrije tijden. Stuur ons een e-mail, dan plannen we samen een moment.',
      chooseDayFirst: 'Kies eerst een dag.',
      noTimes: 'Deze dag is volgeboekt. Kies een andere dag.',
      free: n => (n === 1 ? '1 tijd' : `${n} tijden`),
      full: 'Vol',
      closed: 'Gesloten',
      morning: 'Ochtend',
      afternoon: 'Middag',
      timeRange: (a, b) => `${a} – ${b}`,
      minutes: '30 min',
      note: 'Tijden zijn in Surinaamse tijd.',
      required: {
        service: 'Kies wat je nodig hebt.',
        date: 'Kies een dag.',
        time: 'Kies een tijd.',
        name: 'Vul je naam in.',
        email: 'Vul een geldig e-mailadres in.',
        phone: 'Vul een telefoonnummer in waarop we je kunnen bereiken.',
        phoneOptional: 'Controleer je telefoonnummer.',
        services: 'Kies minstens één optie.',
        message: 'Vertel kort iets over je project.'
      },
      fixErrors: 'Controleer de gemarkeerde velden.',
      sending: 'Versturen…',
      confirm: 'Afspraak bevestigen',
      send: 'Aanvraag versturen',
      slotTaken: 'Iemand heeft deze tijd net geboekt. Kies een andere tijd.',
      tooMany: 'Je hebt al afspraken staan. Mail ons om ze te wijzigen.',
      tooManyEnquiries: 'We hebben je aanvraag al ontvangen. Mail ons als je iets wilt toevoegen.',
      network: 'Er ging iets mis. Controleer je verbinding en probeer het opnieuw, of mail ons.',
      bookedTitle: 'Je afspraak staat vast',
      bookedText: (service, day, time) => `${service} op ${day} om ${time} (Surinaamse tijd). We nemen op dat moment contact met je op, op de manier die je hebt gekozen.`,
      calendar: 'Zet in je agenda',
      another: 'Nog een afspraak maken',
      enquiryTitle: 'Bedankt, we hebben je aanvraag ontvangen',
      enquiryText: name => `Bedankt ${name}. We lezen je bericht en nemen per e-mail of telefoon contact met je op.`,
      enquiryAnother: 'Nog een aanvraag sturen',
      calendarTitle: service => `Quille Designs – ${service}`
    }
  };
  const lang = () => (window.quilleLanguage?.get?.() === 'en' ? 'en' : 'nl');
  const t = () => copy[lang()];
  const locale = () => (lang() === 'en' ? 'en-GB' : 'nl-NL');
  const dayDate = day => new Date(`${day}T12:00:00Z`);
  const format = (day, options) => new Intl.DateTimeFormat(locale(), { timeZone: 'UTC', ...options }).format(dayDate(day));
  const longDay = day => format(day, { weekday: 'long', day: 'numeric', month: 'long' });
  const endTime = time => {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + 30;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };

  /* ---------- Tabs: booking (small jobs) and enquiry (bigger projects) ---------- */
  const workspace = document.querySelector('.contact-workspace');
  const tabs = document.querySelector('.contact-tabs');
  const tabButtons = [...tabs.querySelectorAll('[role="tab"]')];
  const panels = { booking: $('booking'), enquiry: $('enquiry') };
  const pathCards = [...document.querySelectorAll('.contact-path')];
  workspace.classList.add('js-tabs');
  tabs.hidden = false;
  function select(name, { focus = false, scroll = false } = {}) {
    tabButtons.forEach(button => {
      const active = button.getAttribute('aria-controls') === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    Object.entries(panels).forEach(([key, panel]) => (panel.hidden = key !== name));
    pathCards.forEach(card => card.classList.toggle('is-active', !!card.querySelector(`[data-open-panel="${name}"]`)));
    if (scroll) workspace.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      select(button.getAttribute('aria-controls'));
      history.replaceState(null, '', `#${button.getAttribute('aria-controls')}`);
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) % tabButtons.length;
      select(tabButtons[next].getAttribute('aria-controls'), { focus: true });
    });
  });
  document.querySelectorAll('[data-open-panel]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const name = link.dataset.openPanel;
    select(name, { scroll: true });
    history.replaceState(null, '', `#${name}`);
  }));
  const fromHash = () => (location.hash === '#enquiry' ? 'enquiry' : 'booking');
  select(fromHash(), { scroll: ['#booking', '#enquiry', '#plan'].includes(location.hash) });
  window.addEventListener('hashchange', () => select(fromHash(), { scroll: true }));

  /* ---------- Shared form helpers ---------- */
  function setError(form, name, message) {
    const slot = form.querySelector(`[data-error="${name}"]`);
    if (slot) slot.textContent = message || '';
    form.querySelectorAll(`[name="${name}"]`).forEach(input => {
      if (input.type !== 'radio' && input.type !== 'checkbox') input.setAttribute('aria-invalid', message ? 'true' : 'false');
    });
  }
  function clearErrors(form) {
    form.querySelectorAll('[data-error]').forEach(slot => (slot.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach(input => input.setAttribute('aria-invalid', 'false'));
  }
  const validEmail = value => /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(value);
  const validPhone = value => /^\+?[0-9][0-9 ()./-]{5,30}$/.test(value);
  function setStatus(element, message, error = false) {
    element.textContent = message || '';
    element.classList.toggle('is-error', !!error);
  }
  async function post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    let value = {};
    try { value = await response.json(); } catch (_) { /* Non-JSON error page. */ }
    if (!response.ok) throw Object.assign(new Error(value.message || 'Request failed'), { code: value.error, status: response.status });
    return value;
  }
  function focusFirstError(form) {
    const slot = [...form.querySelectorAll('[data-error]')].find(el => el.textContent);
    if (!slot) return;
    const field = slot.closest('fieldset.booking-step, label')?.querySelector('input:not([type=hidden]), textarea');
    field?.focus({ preventScroll: false });
  }

  /* ---------- Booking ---------- */
  const bookingForm = $('bookingForm');
  const strip = $('dateStrip');
  const timeGrid = $('timeGrid');
  const bookingStatus = $('bookingStatus');
  let schedule = null;
  let loadError = false;
  const chosen = () => ({
    service: bookingForm.querySelector('[name="service"]:checked')?.value || '',
    date: bookingForm.querySelector('[name="date"]:checked')?.value || '',
    time: bookingForm.querySelector('[name="time"]:checked')?.value || ''
  });

  function renderDays() {
    const keep = chosen().date;
    strip.textContent = '';
    strip.setAttribute('aria-busy', schedule ? 'false' : 'true');
    if (loadError) {
      const p = document.createElement('p');
      p.className = 'contact-muted';
      p.textContent = t().loadFailed + ' ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'contact-button contact-button--ghost';
      retry.textContent = t().retry;
      retry.addEventListener('click', loadSchedule);
      p.append(retry);
      strip.append(p);
      return;
    }
    if (!schedule) {
      const p = document.createElement('p');
      p.className = 'contact-muted';
      p.textContent = t().loadingDays;
      strip.append(p);
      return;
    }
    if (!schedule.days.some(day => day.slots.length)) {
      const p = document.createElement('p');
      p.className = 'contact-muted';
      p.textContent = t().noDays;
      strip.append(p);
      return;
    }
    schedule.days.forEach(day => {
      const label = document.createElement('label');
      const full = !day.slots.length;
      label.className = 'date-chip' + (full ? ' is-full' : '');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'date';
      input.value = day.date;
      input.disabled = full;
      input.checked = day.date === keep && !full;
      input.setAttribute('aria-label', `${longDay(day.date)}, ${day.closed ? t().closed : full ? t().full : t().free(day.slots.length)}`);
      const weekday = document.createElement('span');
      weekday.className = 'date-chip-weekday';
      weekday.textContent = format(day.date, { weekday: 'short' }).replace('.', '');
      const number = document.createElement('span');
      number.className = 'date-chip-day';
      number.textContent = format(day.date, { day: 'numeric' });
      const month = document.createElement('span');
      month.className = 'date-chip-month';
      month.textContent = format(day.date, { month: 'short' }).replace('.', '');
      const count = document.createElement('span');
      count.className = 'date-chip-count';
      count.textContent = day.closed ? t().closed : full ? t().full : t().free(day.slots.length);
      [weekday, number, month, count].forEach(el => el.setAttribute('aria-hidden', 'true'));
      label.append(input, weekday, number, month, count);
      strip.append(label);
    });
    if (!chosen().date) {
      const first = strip.querySelector('input:not(:disabled)');
      if (first) first.checked = true;
    }
  }

  function renderTimes() {
    const keep = chosen().time;
    const { date } = chosen();
    timeGrid.textContent = '';
    const day = schedule?.days.find(d => d.date === date);
    if (!day) {
      const p = document.createElement('p');
      p.className = 'contact-muted';
      p.textContent = t().chooseDayFirst;
      timeGrid.append(p);
      return;
    }
    if (!day.slots.length) {
      const p = document.createElement('p');
      p.className = 'contact-muted';
      p.textContent = t().noTimes;
      timeGrid.append(p);
      return;
    }
    const groups = [[t().morning, day.slots.filter(s => s < '12:00')], [t().afternoon, day.slots.filter(s => s >= '12:00')]];
    groups.forEach(([title, slots]) => {
      if (!slots.length) return;
      const heading = document.createElement('p');
      heading.className = 'time-group-label';
      heading.textContent = title;
      timeGrid.append(heading);
      slots.forEach(slot => {
        const label = document.createElement('label');
        label.className = 'time-chip';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'time';
        input.value = slot;
        input.checked = slot === keep;
        input.setAttribute('aria-label', t().timeRange(slot, endTime(slot)));
        const text = document.createElement('span');
        text.textContent = slot;
        text.setAttribute('aria-hidden', 'true');
        label.append(input, text);
        timeGrid.append(label);
      });
    });
  }

  function renderSummary() {
    const { service, date, time } = chosen();
    $('summaryService').textContent = service ? t().services[service] : '—';
    $('summaryDay').textContent = date ? longDay(date) : '—';
    $('summaryTime').textContent = time ? t().timeRange(time, endTime(time)) : '—';
    $('summaryDuration').textContent = t().minutes;
    $('summaryNote').textContent = t().note;
    if (!bookingStatus.classList.contains('is-error')) setStatus(bookingStatus, '');
    $('bookingSubmitLabel').textContent = t().confirm;
  }

  async function loadSchedule() {
    loadError = false;
    schedule = null;
    renderDays();
    try {
      const response = await fetch('/api/booking/slots', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('slots');
      schedule = await response.json();
    } catch (_) {
      loadError = true;
    }
    renderDays();
    renderTimes();
    renderSummary();
  }

  bookingForm.addEventListener('change', event => {
    const name = event.target.name;
    if (name === 'date') {
      setError(bookingForm, 'date', '');
      renderTimes();
    }
    if (name === 'service' || name === 'time') setError(bookingForm, name, '');
    renderSummary();
  });
  bookingForm.addEventListener('input', event => {
    if (event.target.getAttribute('aria-invalid') === 'true') setError(bookingForm, event.target.name, '');
  });
  document.querySelectorAll('[data-strip]').forEach(button => button.addEventListener('click', () => {
    strip.scrollBy({ left: Number(button.dataset.strip) * strip.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));

  let lastBooking = null;
  function calendarFile(booking) {
    const start = new Date(booking.start);
    const end = new Date(start.getTime() + booking.minutes * 60000);
    const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const service = t().services[booking.service];
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Quille Designs//Booking//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT', `UID:${booking.id}@quilledesigns`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${t().calendarTitle(service)}`, 'DESCRIPTION:hello@quilledesigns.com', 'END:VEVENT', 'END:VCALENDAR'
    ];
    return URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar' }));
  }
  function renderBookingSuccess() {
    if (!lastBooking) return;
    $('bookingSuccessTitle').textContent = t().bookedTitle;
    $('bookingSuccessText').textContent = t().bookedText(t().services[lastBooking.service], longDay(lastBooking.date), lastBooking.time);
    const link = $('calendarLink');
    if (link.dataset.url) URL.revokeObjectURL(link.dataset.url);
    link.dataset.url = calendarFile(lastBooking);
    link.href = link.dataset.url;
    link.textContent = t().calendar;
    $('bookAnother').textContent = t().another;
  }

  bookingForm.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(bookingForm);
    setStatus(bookingStatus, '');
    const data = Object.fromEntries(new FormData(bookingForm));
    const pick = chosen();
    const errors = {};
    if (!pick.service) errors.service = t().required.service;
    if (!pick.date) errors.date = t().required.date;
    if (!pick.time) errors.time = t().required.time;
    if (!String(data.name || '').trim()) errors.name = t().required.name;
    if (!validEmail(String(data.email || '').trim())) errors.email = t().required.email;
    if (!validPhone(String(data.phone || '').trim())) errors.phone = t().required.phone;
    Object.entries(errors).forEach(([name, message]) => setError(bookingForm, name, message));
    if (Object.keys(errors).length) {
      setStatus(bookingStatus, t().fixErrors, true);
      focusFirstError(bookingForm);
      return;
    }
    const button = $('bookingSubmit');
    button.disabled = true;
    $('bookingSubmitLabel').textContent = t().sending;
    try {
      lastBooking = await post('/api/booking', {
        service: pick.service,
        date: pick.date,
        time: pick.time,
        name: String(data.name).trim(),
        email: String(data.email).trim(),
        phone: String(data.phone).trim(),
        method: data.method || 'phone',
        notes: String(data.notes || ''),
        language: lang(),
        website: String(data.website || '')
      });
      bookingForm.closest('.contact-panel-grid').hidden = true;
      $('bookingSuccess').hidden = false;
      renderBookingSuccess();
      $('bookingSuccess').focus();
    } catch (error) {
      if (error.code === 'slot_unavailable') {
        setStatus(bookingStatus, t().slotTaken, true);
        setError(bookingForm, 'time', t().slotTaken);
        await loadSchedule();
      } else if (error.code === 'too_many_bookings') {
        setStatus(bookingStatus, t().tooMany, true);
      } else {
        setStatus(bookingStatus, t().network, true);
      }
    } finally {
      button.disabled = false;
      $('bookingSubmitLabel').textContent = t().confirm;
    }
  });
  $('bookAnother').addEventListener('click', async () => {
    lastBooking = null;
    bookingForm.reset();
    clearErrors(bookingForm);
    $('bookingSuccess').hidden = true;
    bookingForm.closest('.contact-panel-grid').hidden = false;
    await loadSchedule();
    bookingForm.querySelector('[name="service"]').focus();
  });

  /* ---------- Enquiry ---------- */
  const enquiryForm = $('enquiryForm');
  const enquiryStatus = $('enquiryStatus');
  let lastEnquiryName = '';
  function renderEnquiry() {
    $('enquirySubmitLabel').textContent = t().send;
    if (lastEnquiryName) {
      $('enquirySuccessTitle').textContent = t().enquiryTitle;
      $('enquirySuccessText').textContent = t().enquiryText(lastEnquiryName);
      $('enquiryAnother').textContent = t().enquiryAnother;
    }
  }
  enquiryForm.addEventListener('input', event => {
    if (event.target.name === 'services') setError(enquiryForm, 'services', '');
    else if (event.target.getAttribute('aria-invalid') === 'true') setError(enquiryForm, event.target.name, '');
  });
  enquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(enquiryForm);
    setStatus(enquiryStatus, '');
    const form = new FormData(enquiryForm);
    const services = form.getAll('services');
    const value = name => String(form.get(name) || '').trim();
    const errors = {};
    if (!services.length) errors.services = t().required.services;
    if (!value('message')) errors.message = t().required.message;
    if (!value('name')) errors.name = t().required.name;
    if (!validEmail(value('email'))) errors.email = t().required.email;
    if (value('phone') && !validPhone(value('phone'))) errors.phone = t().required.phoneOptional;
    Object.entries(errors).forEach(([name, message]) => setError(enquiryForm, name, message));
    if (Object.keys(errors).length) {
      setStatus(enquiryStatus, t().fixErrors, true);
      focusFirstError(enquiryForm);
      return;
    }
    const button = $('enquirySubmit');
    button.disabled = true;
    $('enquirySubmitLabel').textContent = t().sending;
    try {
      await post('/api/inquiry', {
        services,
        message: value('message'),
        name: value('name'),
        email: value('email'),
        phone: value('phone'),
        company: value('company'),
        language: lang(),
        website: String(form.get('website') || '')
      });
      lastEnquiryName = value('name').split(/\s+/)[0];
      enquiryForm.closest('.contact-panel-grid').hidden = true;
      $('enquirySuccess').hidden = false;
      renderEnquiry();
      $('enquirySuccess').focus();
    } catch (error) {
      setStatus(enquiryStatus, error.code === 'too_many_requests' ? t().tooManyEnquiries : t().network, true);
    } finally {
      button.disabled = false;
      $('enquirySubmitLabel').textContent = t().send;
    }
  });
  $('enquiryAnother').addEventListener('click', () => {
    lastEnquiryName = '';
    enquiryForm.reset();
    clearErrors(enquiryForm);
    $('enquirySuccess').hidden = true;
    enquiryForm.closest('.contact-panel-grid').hidden = false;
    enquiryForm.querySelector('[name="services"]').focus();
  });

  /* ---------- Language switch re-renders the dynamic parts ---------- */
  document.addEventListener('quille-language-change', () => {
    renderDays();
    renderTimes();
    renderSummary();
    renderBookingSuccess();
    renderEnquiry();
    [bookingForm, enquiryForm].forEach(form => form.querySelectorAll('[data-error]').forEach(slot => (slot.textContent = '')));
    setStatus(bookingStatus, '');
    setStatus(enquiryStatus, '');
  });

  renderSummary();
  renderEnquiry();
  loadSchedule();
})();
