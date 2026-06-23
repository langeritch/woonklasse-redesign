// =========================================================================
// Woonklasse — site-wide interactions
// loader fade · header scroll state · service accordion · testimonial
// carousel · scroll-triggered reveals (staggered)
// =========================================================================

// Loader splash: fade out after the page is fully loaded
window.addEventListener('load', () => {
  // small delay so the splash is noticeable on fast loads
  setTimeout(() => document.body.classList.add('loaded'), 280);
});
// Fallback in case `load` doesn't fire (e.g. cached assets)
setTimeout(() => document.body.classList.add('loaded'), 1800);

// Sticky header — adds .scrolled state past 40px
const header = document.getElementById('siteHeader');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Service accordion — toggle .open on click
document.querySelectorAll('.service-row').forEach(row => {
  row.addEventListener('click', () => row.classList.toggle('open'));
});

// Testimonial carousel
const track = document.getElementById('testiTrack');
if (track) {
  const slides = track.children.length;
  let i = 0;
  const render = () => { track.style.transform = `translateX(-${i * 100}%)`; };
  document.querySelectorAll('.t-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir === 'next' ? 1 : -1;
      i = (i + dir + slides) % slides;
      render();
    });
  });
  let auto = setInterval(() => { i = (i + 1) % slides; render(); }, 7000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
}

// =========================================================================
// Homepage 3-stappen lead quiz
// =========================================================================
const quiz = document.getElementById('leadQuiz');
if (quiz) {
  const ROOM_TYPES = ['Woonkamer', 'Keuken', 'Badkamer', 'Slaapkamer', 'Hal / entree', 'Hele woning', 'Anders'];
  const MAX_ROOMS = 5;
  const makeRoom = () => ({ kind: '', m2: '', desc: '', photos: [] });
  const state = {
    step: 1,
    rooms: null,
    type: null,
    roomDetails: [],
  };

  const stepEls = quiz.querySelectorAll('.lead-quiz__step');
  const progressEls = quiz.querySelectorAll('.lead-quiz__progress span');
  const step1Next = quiz.querySelector('.lead-quiz__step[data-step="1"] .lead-quiz__next');
  const step3Submit = quiz.querySelector('.lead-quiz__submit');
  const roomsListEl = quiz.querySelector('#roomsList');
  const roomsCountEl = quiz.querySelector('#roomsCount');
  const addRoomBtn = quiz.querySelector('#addRoomBtn');
  const restartBtn = quiz.querySelector('.lead-quiz__restart');

  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());
  const isPhone = (s) => /^[+\d][\d\s\-()]{6,}$/.test(String(s || '').trim());

  const showStep = (n) => {
    state.step = n;
    stepEls.forEach(s => s.classList.toggle('hidden', +s.dataset.step !== n));
    progressEls.forEach((el, i) => el.classList.toggle('active', i < n && n <= 3));
    if (n === 2) renderRooms();
    if (n === 3) checkStep3Ready();
    quiz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // ---------- Step 1 ------------------------------------------------------
  const setSelected = (group, value, attr) => {
    quiz.querySelectorAll(`[data-group="${group}"] button`).forEach(b => {
      b.classList.toggle('selected', b.getAttribute(attr) === value);
    });
  };
  quiz.querySelectorAll('[data-group="rooms"] button').forEach(b => {
    b.addEventListener('click', () => {
      // toggle off if clicking the already-selected chip
      if (state.rooms === b.dataset.rooms) {
        state.rooms = null;
        setSelected('rooms', null, 'data-rooms');
      } else {
        state.rooms = b.dataset.rooms;
        setSelected('rooms', state.rooms, 'data-rooms');
      }
      checkStep1Ready();
    });
  });
  quiz.querySelectorAll('[data-group="type"] button').forEach(b => {
    b.addEventListener('click', () => {
      if (state.type === b.dataset.type) {
        state.type = null;
        setSelected('type', null, 'data-type');
      } else {
        state.type = b.dataset.type;
        setSelected('type', state.type, 'data-type');
      }
      checkStep1Ready();
    });
  });

  const checkStep1Ready = () => {
    step1Next.disabled = !(state.rooms && state.type);
  };

  // ---------- Step 2: dynamic rooms ---------------------------------------
  const renderRooms = () => {
    const targetN = state.rooms === '5+' ? 5 : parseInt(state.rooms, 10) || 1;
    while (state.roomDetails.length < targetN) state.roomDetails.push(makeRoom());
    if (state.roomDetails.length > targetN) state.roomDetails.length = targetN;

    roomsListEl.innerHTML = state.roomDetails.map((r, i) => `
      <div class="kamer-card" data-i="${i}">
        <div class="kamer-card__head">
          <span>Kamer ${i + 1}</span>
          <button type="button" class="remove-room">verwijder</button>
        </div>
        <div class="chips">
          ${ROOM_TYPES.map(t => `<button type="button" data-kind="${t}" class="${r.kind === t ? 'selected' : ''}">${t}</button>`).join('')}
        </div>
        <div class="kamer-card__inputs">
          <input type="text" inputmode="numeric" placeholder="m² (optioneel)" value="${r.m2}" data-field="m2"/>
          <input type="text" placeholder="Korte beschrijving (optioneel)" value="${r.desc}" data-field="desc"/>
        </div>
        <div class="photo-upload">
          <p class="photo-upload__label">Foto's huidige situatie (optioneel) · ${r.photos.length}</p>
          <input type="file" accept="image/*" multiple class="photo-upload__input"/>
          <div class="photo-upload__drop" tabindex="0"><span>+ Foto</span></div>
          <div class="photo-upload__previews">
            ${r.photos.map((p, pi) => `<div class="photo-thumb" data-pi="${pi}"><img src="${p.url}" alt=""/><button type="button" class="photo-thumb__remove" aria-label="Foto verwijderen">×</button></div>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    updateCounter();
    updateAddRoomBtn();

    // Bind per-room events
    roomsListEl.querySelectorAll('.kamer-card').forEach(card => {
      const i = +card.dataset.i;

      // Type chips (with Hele woning special case)
      card.querySelectorAll('[data-kind]').forEach(b => {
        b.addEventListener('click', () => {
          const kind = b.dataset.kind;
          const alreadySelected = state.roomDetails[i].kind === kind;
          // toggle deselect
          if (alreadySelected) {
            state.roomDetails[i].kind = '';
            b.classList.remove('selected');
            return;
          }
          // "Hele woning" → collapse to a single room
          if (kind === 'Hele woning' && state.roomDetails.length > 1) {
            if (confirm('Bij "Hele woning" beschrijven we het geheel als één entry. Andere kamers worden verwijderd. Doorgaan?')) {
              state.roomDetails = [{ ...makeRoom(), kind: 'Hele woning', m2: state.roomDetails[i].m2, desc: state.roomDetails[i].desc, photos: state.roomDetails[i].photos }];
              state.rooms = '1';
              setSelected('rooms', '1', 'data-rooms');
              renderRooms();
              return;
            } else {
              return;
            }
          }
          card.querySelectorAll('[data-kind]').forEach(x => x.classList.remove('selected'));
          b.classList.add('selected');
          state.roomDetails[i].kind = kind;
        });
      });

      // Text inputs
      card.querySelectorAll('[data-field]').forEach(inp => {
        inp.addEventListener('input', () => {
          state.roomDetails[i][inp.dataset.field] = inp.value;
        });
      });

      // Remove room
      card.querySelector('.remove-room').addEventListener('click', () => {
        // revoke object URLs
        state.roomDetails[i].photos.forEach(p => URL.revokeObjectURL(p.url));
        state.roomDetails.splice(i, 1);
        if (state.roomDetails.length === 0) {
          state.rooms = null;
          setSelected('rooms', null, 'data-rooms');
          showStep(1);
          checkStep1Ready();
          return;
        }
        state.rooms = state.roomDetails.length >= 5 ? '5+' : String(state.roomDetails.length);
        setSelected('rooms', state.rooms, 'data-rooms');
        renderRooms();
      });

      // Photo upload — real file picker
      const fileInput = card.querySelector('.photo-upload__input');
      const drop = card.querySelector('.photo-upload__drop');
      drop.addEventListener('click', () => fileInput.click());
      drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(f => {
          state.roomDetails[i].photos.push({ file: f, url: URL.createObjectURL(f) });
        });
        renderRooms(); // re-render to show thumbs
      });

      // Photo remove
      card.querySelectorAll('.photo-thumb__remove').forEach((rm, pi) => {
        rm.addEventListener('click', (e) => {
          e.stopPropagation();
          URL.revokeObjectURL(state.roomDetails[i].photos[pi].url);
          state.roomDetails[i].photos.splice(pi, 1);
          renderRooms();
        });
      });
    });
  };

  const updateCounter = () => {
    const total = state.roomDetails.reduce((s, r) => s + r.photos.length, 0);
    roomsCountEl.textContent = `${state.roomDetails.length} kamer${state.roomDetails.length === 1 ? '' : 's'} · ${total} foto${total === 1 ? '' : "'s"}`;
  };

  const updateAddRoomBtn = () => {
    if (!addRoomBtn) return;
    const atMax = state.roomDetails.length >= MAX_ROOMS;
    addRoomBtn.disabled = atMax;
    addRoomBtn.textContent = atMax ? `Maximum ${MAX_ROOMS} kamers bereikt` : '+ Kamer toevoegen';
  };

  if (addRoomBtn) {
    addRoomBtn.addEventListener('click', () => {
      if (state.roomDetails.length >= MAX_ROOMS) return;
      state.roomDetails.push(makeRoom());
      state.rooms = state.roomDetails.length >= 5 ? '5+' : String(state.roomDetails.length);
      setSelected('rooms', state.rooms, 'data-rooms');
      renderRooms();
    });
  }

  // ---------- Step 3 validation -------------------------------------------
  const checkStep3Ready = () => {
    const name = quiz.querySelector('[name="name"]').value.trim();
    const email = quiz.querySelector('[name="email"]').value.trim();
    const phone = quiz.querySelector('[name="phone"]').value.trim();
    step3Submit.disabled = !(name && isEmail(email) && isPhone(phone));
  };
  ['name', 'email', 'phone', 'city'].forEach(n => {
    const el = quiz.querySelector(`[name="${n}"]`);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        checkStep3Ready();
      });
      el.addEventListener('blur', () => {
        if (n === 'email' && el.value && !isEmail(el.value)) el.classList.add('invalid');
        else if (n === 'phone' && el.value && !isPhone(el.value)) el.classList.add('invalid');
        else if (el.required && !el.value.trim()) el.classList.add('invalid');
      });
    }
  });

  // ---------- Navigation --------------------------------------------------
  quiz.querySelectorAll('.lead-quiz__next').forEach(b => {
    b.addEventListener('click', () => { if (state.step < 3) showStep(state.step + 1); });
  });
  quiz.querySelectorAll('.lead-quiz__back').forEach(b => {
    b.addEventListener('click', () => { if (state.step > 1) showStep(state.step - 1); });
  });

  // ---------- Submit ------------------------------------------------------
  quiz.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (step3Submit.disabled) return;
    const contact = {
      naam: quiz.querySelector('[name="name"]').value.trim(),
      email: quiz.querySelector('[name="email"]').value.trim(),
      phone: quiz.querySelector('[name="phone"]').value.trim(),
      city: ((quiz.querySelector('[name="city"]') || {}).value || '').trim(),
      budget: ((quiz.querySelector('[name="budget"]') || {}).value || '').trim(),
      timing: ((quiz.querySelector('[name="timing"]') || {}).value || '').trim(),
      message: ((quiz.querySelector('[name="message"]') || {}).value || '').trim(),
    };

    let status = quiz.querySelector('.lead-quiz__status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'lead-quiz__status';
      step3Submit.insertAdjacentElement('afterend', status);
    }
    status.textContent = '';
    status.removeAttribute('data-state');

    const origLabel = step3Submit.textContent;
    step3Submit.disabled = true;
    step3Submit.textContent = 'Versturen…';

    // 1) Upload photos straight to Vercel Blob (browser → Blob, via a
    //    same-origin signed-token proxy). Photo-upload failures never block the
    //    lead — we submit without the failed photos and note it instead.
    const { rooms, total, failed } = await uploadRoomPhotos(
      state.roomDetails,
      (done, n) => { step3Submit.textContent = `Foto's uploaden… ${done}/${n}`; },
    );

    // 2) Submit the lead (incl. uploaded photo URLs) to the advies endpoint.
    step3Submit.textContent = 'Versturen…';
    let bericht = contact.message;
    if (failed > 0) {
      const note = `Let op: ${failed} van ${total} foto('s) kon niet worden geüpload en ontbreekt bij deze aanvraag.`;
      bericht = bericht ? `${bericht}\n\n${note}` : note;
    }
    const result = await postLead({
      brand: 'woonklasse',
      naam: contact.naam,
      email: contact.email,
      telefoon: contact.phone,
      projectType: state.type || undefined,
      city: contact.city || undefined,
      budget: contact.budget || undefined,
      tijdpad: contact.timing || undefined,
      bericht: bericht || undefined,
      rooms,
    }, '/api/advies');

    if (result.ok) {
      // Show confirmation step (4)
      state.step = 4;
      stepEls.forEach(s => s.classList.toggle('hidden', +s.dataset.step !== 4));
      progressEls.forEach(el => el.classList.add('active'));
    } else {
      status.textContent = result.message
        || 'Versturen mislukt. Probeer het opnieuw of mail naar info@woonklasse.nl.';
      status.dataset.state = 'error';
      step3Submit.disabled = false;
      step3Submit.textContent = origLabel;
    }
  });

  // ---------- Restart -----------------------------------------------------
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      quiz.reset();
      quiz.querySelectorAll('.chips .selected').forEach(b => b.classList.remove('selected'));
      quiz.querySelectorAll('.invalid').forEach(b => b.classList.remove('invalid'));
      state.roomDetails.forEach(r => r.photos.forEach(p => URL.revokeObjectURL(p.url)));
      state.rooms = null;
      state.type = null;
      state.roomDetails = [];
      step3Submit.disabled = true;
      checkStep1Ready();
      showStep(1);
    });
  }

  checkStep1Ready();
}

// Scroll-triggered reveals — IntersectionObserver, staggered per group
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  // Selectors and per-group stagger config
  const groups = [
    { sel: '.hero__inner > *',           step: 120 },
    { sel: '.story__grid > *',           step: 140 },
    { sel: '.service-row',               step: 70  },
    { sel: '.proj-card',                 step: 90  },
    { sel: '.tier',                      step: 90  },
    { sel: '.testi',                     step: 0   },
    { sel: '.cta__inner > *',            step: 140 },
    { sel: '.section__inner > *',        step: 80  },
    { sel: '.city-chip',                 step: 30  },
    { sel: '.about-stat',                step: 80  },
    { sel: '.faq details',               step: 50  },
  ];

  groups.forEach(({ sel, step }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (step > 0) el.style.transitionDelay = `${Math.min(i * step, 600)}ms`;
      io.observe(el);
    });
  });
}

// Hero parallax — the photo drifts slower than the scroll for depth.
// Transform-only + rAF-throttled (no layout thrash), and skipped entirely for
// reduced-motion users. Pairs with the .js-parallax CSS that oversizes the
// image so the translate never exposes a top/bottom edge.
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');
  const img = hero && hero.querySelector('.hero__media img');
  if (!hero || !img || reduceMotion) return;

  document.documentElement.classList.add('js-parallax');

  const FACTOR = 0.16; // fraction of scroll distance the photo lags behind
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    // Skip work once the hero is well out of view.
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
    const scrolledPast = Math.max(0, -rect.top);
    img.style.transform = `translate3d(0, ${(scrolledPast * FACTOR).toFixed(1)}px, 0)`;
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

// =========================================================================
// Lead submission — shared helper + contact-page form
// (the homepage quiz handler above also calls postLead / uploadRoomPhotos)
// =========================================================================

// POST a normalised lead payload to the same-origin /api/contact proxy, which
// forwards it to the Woonklasse backend (email + inbox + push notification).
async function postLead(payload, endpoint = '/api/contact') {
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    let data = {};
    try { data = await r.json(); } catch (_) { /* non-JSON response */ }
    if (r.ok && data && data.success) return { ok: true, data };
    const msg = data && (Array.isArray(data.errors) ? data.errors[0] : data.message);
    return { ok: false, message: msg || null };
  } catch (_) {
    return { ok: false, message: null };
  }
}

// Upload each room's photos straight to Vercel Blob (browser → Blob, bypassing
// the 4.5 MB function body limit) and return the rooms shaped for /api/advies:
// [{ type, meters?, notes?, photos: [{ url, filename }] }]. The @vercel/blob
// client SDK is loaded on demand from a CDN (the static site has no bundler),
// and only when there is at least one photo to upload.
async function uploadRoomPhotos(roomDetails, onProgress) {
  const total = roomDetails.reduce((n, r) => n + r.photos.length, 0);
  let done = 0;
  let failed = 0;
  let uploadFn = null;

  // Load the Blob client SDK on demand. If the CDN is unreachable we degrade
  // to a photo-less submission rather than blocking the lead.
  if (total > 0) {
    try {
      const mod = await import('https://esm.sh/@vercel/blob@2.3.3/client');
      uploadFn = mod.upload;
    } catch (_) {
      uploadFn = null;
    }
    if (onProgress) onProgress(0, total);
  }

  const rooms = [];
  for (const r of roomDetails) {
    const photos = [];
    for (const p of r.photos) {
      if (!p.file) continue;
      if (uploadFn) {
        try {
          const safe = (p.file.name || 'foto.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
          const res = await uploadFn(`lead/${safe}`, p.file, {
            access: 'public',
            handleUploadUrl: '/api/advies/upload-url',
          });
          photos.push({ url: res.url, filename: p.file.name || safe });
        } catch (_) {
          // Upload service down/suspended — skip this photo, keep the lead.
          failed += 1;
        }
      } else {
        failed += 1;
      }
      done += 1;
      if (onProgress) onProgress(done, total);
    }
    rooms.push({
      type: (r.kind && r.kind.trim()) || 'Niet gespecificeerd',
      meters: (r.m2 && String(r.m2).trim()) || undefined,
      notes: (r.desc && r.desc.trim()) || undefined,
      photos,
    });
  }
  return { rooms, total, failed };
}

// Contact-page form (.lead-form). Replaces the old inline alert() stub.
(function () {
  const form = document.querySelector('.lead-form');
  if (!form) return;

  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());
  const isPhone = (s) => /^[+\d][\d\s\-()]{6,}$/.test(String(s || '').trim());
  const val = (n) => {
    const el = form.querySelector(`[name="${n}"]`);
    return el ? String(el.value || '').trim() : '';
  };

  const btn = form.querySelector('.form-submit') || form.querySelector('[type="submit"]');
  let status = form.querySelector('.form-status');
  const ensureStatus = () => {
    if (!status) {
      status = document.createElement('p');
      status.className = 'form-status';
      if (btn) btn.insertAdjacentElement('beforebegin', status);
      else form.appendChild(status);
    }
    return status;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = ensureStatus();
    s.textContent = '';
    s.removeAttribute('data-state');

    const naam = val('name');
    const email = val('email');
    const telefoon = val('phone');
    if (!naam || !isEmail(email) || !isPhone(telefoon)) {
      s.textContent = 'Vul je naam, een geldig e-mailadres en een telefoonnummer in.';
      s.dataset.state = 'error';
      return;
    }

    const city = val('city');
    const bericht = [val('message'), city ? `Plaats: ${city}` : '']
      .filter(Boolean).join('\n\n');

    const origLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Versturen…'; }

    const result = await postLead({
      naam,
      email,
      telefoon,
      bedrijf: val('company') || undefined,
      type: val('type') || undefined,
      formulier: 'contact',
      brand: 'woonklasse',
      bericht: bericht || undefined,
      website: val('website'), // honeypot — filled only by bots
    });

    if (result.ok) {
      form.querySelectorAll('label, input, select, textarea, .form-submit')
        .forEach((el) => { el.style.display = 'none'; });
      s.textContent = 'Bedankt! We hebben je aanvraag ontvangen en nemen binnen 48 uur contact op.';
      s.dataset.state = 'success';
    } else {
      s.textContent = result.message
        || 'Versturen mislukt. Probeer het later opnieuw of mail naar info@woonklasse.nl.';
      s.dataset.state = 'error';
      if (btn) { btn.disabled = false; btn.textContent = origLabel; }
    }
  });
})();

/* Zwevende WhatsApp-knop (rechtsonder, op elke pagina) */
(function () {
  function initWhatsApp() {
    if (document.querySelector('.wa-float')) return;
    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = 'https://wa.me/31650424683?text=' +
      encodeURIComponent('Hallo Woonklasse, ik heb een vraag over mijn verbouwing.');
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Stuur ons een WhatsApp-bericht');
    a.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M16.04 4C9.95 4 5 8.95 5 15.04c0 2.05.56 4.05 1.62 5.8L5 28l7.34-1.92a11 11 0 0 0 3.7.64h.01c6.08 0 11.03-4.95 11.03-11.04C27.08 8.95 22.13 4 16.04 4zm0 20.2h-.01c-1.13 0-2.24-.3-3.21-.88l-.23-.14-3.84 1.01 1.02-3.75-.15-.24a9.1 9.1 0 0 1-1.39-4.84c0-5.04 4.1-9.14 9.15-9.14 2.44 0 4.74.95 6.46 2.68a9.08 9.08 0 0 1 2.68 6.47c0 5.04-4.1 9.14-9.14 9.14zm5.02-6.84c-.27-.14-1.63-.8-1.88-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.21-1.36-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.52-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.52-.32z"/></svg>';
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsApp);
  } else {
    initWhatsApp();
  }
})();

/* Mobiel menu: fullscreen overlay (Badkamerstijl-structuur in Woonklasse-stijl).
   Bouwt de links uit de bestaande header-nav en leest de contactgegevens uit de
   (CMS-gedreven) footer, zodat alles automatisch in sync blijft. */
(function () {
  function clean(v) { return v && v.indexOf('{{') === -1 ? v : ''; }
  function fText(key) { var el = document.querySelector('[data-cms-key="' + key + '"]'); return el ? clean(el.textContent.trim()) : ''; }
  function fAttr(key, attr) { var el = document.querySelector('[data-cms-key="' + key + '"]'); return el ? clean(el.getAttribute(attr) || '') : ''; }

  function initMenu() {
    var header = document.getElementById('siteHeader');
    if (!header || document.querySelector('.menu-toggle')) return;

    var btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu openen');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span>';
    header.appendChild(btn);

    var nav = header.querySelector('.nav');
    var anchors = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];
    var linksHtml = anchors.map(function (a) {
      return '<a href="' + a.getAttribute('href') + '">' + a.textContent.trim() + '</a>';
    }).join('');

    var phone = fText('footer.phoneDisplay');
    var phoneHref = fAttr('footer.phoneDisplay', 'href');
    var waHref = fAttr('footer.whatsappUrl', 'href');
    var addrEl = document.querySelector('[data-cms-key="footer.address"]');
    var addrHtml = addrEl ? clean(addrEl.innerHTML) : '';

    var PHONE_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z"/></svg>';
    var WA_SVG = '<svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.04 4C9.95 4 5 8.95 5 15.04c0 2.05.56 4.05 1.62 5.8L5 28l7.34-1.92a11 11 0 0 0 3.7.64h.01c6.08 0 11.03-4.95 11.03-11.04C27.08 8.95 22.13 4 16.04 4zm0 20.2h-.01c-1.13 0-2.24-.3-3.21-.88l-.23-.14-3.84 1.01 1.02-3.75-.15-.24a9.1 9.1 0 0 1-1.39-4.84c0-5.04 4.1-9.14 9.15-9.14 2.44 0 4.74.95 6.46 2.68a9.08 9.08 0 0 1 2.68 6.47c0 5.04-4.1 9.14-9.14 9.14zm5.02-6.84c-.27-.14-1.63-.8-1.88-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.21-1.36-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.52-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.52-.32z"/></svg>';

    var iconBtns = '';
    if (phone) iconBtns += '<a class="menu-overlay__icon" href="' + (phoneHref || 'tel:' + phone.replace(/\s/g, '')) + '" aria-label="Bel ons">' + PHONE_SVG + '</a>';
    if (waHref) iconBtns += '<a class="menu-overlay__icon menu-overlay__icon--wa" href="' + waHref + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + WA_SVG + '</a>';

    var contactBlock = '';
    if (iconBtns || addrHtml) {
      contactBlock = '<div class="menu-overlay__contact">' +
        (iconBtns ? '<div class="menu-overlay__icons">' + iconBtns + '</div>' : '') +
        (addrHtml ? '<span class="menu-overlay__address">' + addrHtml + '</span>' : '') +
      '</div>';
    }

    var overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="menu-overlay__top">' +
        '<span class="menu-overlay__brand">Woonklasse</span>' +
        '<button class="menu-overlay__close" type="button" aria-label="Menu sluiten"><span>Sluiten</span><i aria-hidden="true"></i></button>' +
      '</div>' +
      '<nav class="menu-overlay__nav" aria-label="Mobiel menu">' + linksHtml + '</nav>' +
      '<div class="menu-overlay__foot">' +
        '<a class="menu-overlay__cta" href="contact.html">Bespreek je project</a>' +
        contactBlock +
      '</div>';
    document.body.appendChild(overlay);

    function open() {
      overlay.classList.add('is-open');
      document.documentElement.classList.add('menu-open');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      overlay.classList.remove('is-open');
      document.documentElement.classList.remove('menu-open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', open);
    overlay.querySelector('.menu-overlay__close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();

/* 'Uit ons werk' carrousel: auto-scroll plus sleepbaar (drag to scroll) */
(function () {
  function initWork() {
    var track = document.getElementById('workTrack');
    if (!track || track.dataset.enhanced) return;
    var viewport = track.parentElement;
    var originals = Array.prototype.slice.call(track.children);

    function setWidth() {
      var w = 0;
      originals.forEach(function (s) {
        var st = getComputedStyle(s);
        w += s.offsetWidth + parseFloat(st.marginRight || 0) + parseFloat(st.marginLeft || 0);
      });
      return w;
    }
    /* dupliceer de slides tot de baan ruim breder is dan de viewport,
       zodat de loop in beide richtingen naadloos blijft */
    var guard = 0;
    while (track.scrollWidth < viewport.offsetWidth * 2 + setWidth() && guard < 12) {
      originals.forEach(function (s) {
        var c = s.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('tabindex', '-1');
        track.appendChild(c);
      });
      guard++;
    }
    track.dataset.enhanced = '1';

    var one = setWidth();
    var pos = 0, dragging = false, pending = false, hovering = false, paused = false;
    var sx = 0, sy = 0, spos = 0, moved = 0, pid = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED = 0.6;

    function wrap() { if (one > 0) { while (pos <= -one) pos += one; while (pos > 0) pos -= one; } }
    function apply() { track.style.transform = 'translate3d(' + pos + 'px,0,0)'; }
    function frame() {
      if (!dragging && !paused && !reduce) pos -= SPEED;
      wrap(); apply();
      requestAnimationFrame(frame);
    }

    viewport.addEventListener('mouseenter', function () { hovering = true; paused = true; });
    viewport.addEventListener('mouseleave', function () { hovering = false; if (!dragging) paused = false; });

    track.addEventListener('pointerdown', function (e) {
      pending = true; pid = e.pointerId;
      sx = e.clientX; sy = e.clientY; spos = pos; moved = 0;
    });
    track.addEventListener('pointermove', function (e) {
      if (pending && !dragging) {
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy)) {
          dragging = true; paused = true;
          try { track.setPointerCapture(pid); } catch (err) {}
          track.classList.add('is-grabbing');
        } else if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) {
          pending = false;
        }
      }
      if (dragging) {
        var d = e.clientX - sx;
        pos = spos + d;
        moved = Math.max(moved, Math.abs(d));
        wrap(); apply();
      }
    });
    function endDrag() {
      pending = false;
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-grabbing');
      try { track.releasePointerCapture(pid); } catch (err) {}
      paused = hovering;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', endDrag);

    /* na een sleep de klik onderdrukken, anders opent de tegel-link */
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    Array.prototype.forEach.call(track.querySelectorAll('img'), function (img) { img.draggable = false; });
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { one = setWidth(); wrap(); apply(); }, 200);
    });

    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWork);
  } else {
    initWork();
  }
})();
