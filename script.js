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
    //    same-origin signed-token proxy), then attach their URLs per room.
    let rooms;
    try {
      rooms = await uploadRoomPhotos(state.roomDetails, (done, total) => {
        step3Submit.textContent = `Foto's uploaden… ${done}/${total}`;
      });
    } catch (err) {
      status.textContent = "Foto's uploaden mislukt. Controleer je verbinding en probeer het opnieuw.";
      status.dataset.state = 'error';
      step3Submit.disabled = false;
      step3Submit.textContent = origLabel;
      return;
    }

    // 2) Submit the lead (incl. photo URLs) to the advies endpoint.
    step3Submit.textContent = 'Versturen…';
    const result = await postLead({
      brand: 'woonklasse',
      naam: contact.naam,
      email: contact.email,
      telefoon: contact.phone,
      projectType: state.type || undefined,
      city: contact.city || undefined,
      budget: contact.budget || undefined,
      tijdpad: contact.timing || undefined,
      bericht: contact.message || undefined,
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
  let uploadFn = null;

  if (total > 0) {
    const mod = await import('https://esm.sh/@vercel/blob@2.3.3/client');
    uploadFn = mod.upload;
    if (onProgress) onProgress(0, total);
  }

  const rooms = [];
  for (const r of roomDetails) {
    const photos = [];
    for (const p of r.photos) {
      if (!p.file || !uploadFn) continue;
      const safe = (p.file.name || 'foto.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
      const res = await uploadFn(`lead/${safe}`, p.file, {
        access: 'public',
        handleUploadUrl: '/api/advies/upload-url',
      });
      photos.push({ url: res.url, filename: p.file.name || safe });
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
  return rooms;
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
