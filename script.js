/* =====================================================================
   💖 script.js — the brain of the birthday surprise
   ---------------------------------------------------------------------
   Everything is ONE single page: screens fade in and out, the page never
   reloads, and the same <audio> element keeps playing the whole time.

   Sections
     1. Helpers & state
     2. Background magic (stars, hearts, balloons, parallax, confetti)
     3. Music player
     4. Screen manager & navigation
     5. Countdown, welcome & login
     6. Page logic (gallery, letter, reasons, timeline, couple, cake, finale)
     7. Logout / start again
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. HELPERS & STATE
     ------------------------------------------------------------------ */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CONTENT = window.CONTENT || {};

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));        // real delay
  const sleep = (ms) => wait(REDUCED ? 0 : ms);                      // animation delay (skipped if reduced motion)
  const reflow = (el) => void el.offsetWidth;

  const state = { me: '', him: '', current: 'intro' };

  // Replace {him} / {me} placeholders in any text
  const fill = (str) => String(str || '')
    .replace(/\{him\}/g, state.him || 'My Demon')
    .replace(/\{me\}/g, state.me || 'Me');

  // Split text into "characters" without breaking emojis in half
  const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = (s) => segmenter ? Array.from(segmenter.segment(s), (x) => x.segment) : Array.from(s);

  function applyNames() {
    $$('.him').forEach((el) => { el.textContent = state.him || 'My Demon'; });
    $$('.me').forEach((el) => { el.textContent = state.me || 'Me'; });
  }

  // Turn a heading into animated letters (replay with replaySplit)
  function splitText(el, text) {
    const t = text != null ? text : (el.dataset.text || el.textContent);
    el.dataset.text = t;
    el.setAttribute('aria-label', t);
    el.textContent = '';
    let i = 0;
    const words = t.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'word';
      w.setAttribute('aria-hidden', 'true');
      graphemes(word).forEach((g) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = g;
        s.style.setProperty('--i', i++);
        w.appendChild(s);
      });
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  function replaySplit(el) {
    el.classList.remove('reveal');
    reflow(el);
    el.classList.add('reveal');
  }

  // Tiny emoji pops (taps, reactions)
  function popEmojis(x, y, n, list) {
    if (REDUCED) return;
    const set = list || ['💜', '😈', '✨', '🎉', '💛'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'pop';
      s.textContent = pick(set);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', rand(-70, 70).toFixed(0) + 'px');
      s.style.setProperty('--dy', rand(-130, -50).toFixed(0) + 'px');
      s.style.setProperty('--r', rand(-40, 40).toFixed(0) + 'deg');
      s.style.fontSize = rand(16, 28).toFixed(0) + 'px';
      s.addEventListener('animationend', () => s.remove());
      document.body.appendChild(s);
    }
  }
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, textarea, .lightbox')) return;
    popEmojis(e.clientX, e.clientY, 4);
  }, { passive: true });

  // Broken / missing images get a pretty placeholder instead of a broken icon
  function placeholderSVG(label) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3d6"/><stop offset="1" stop-color="#c9a7ff"/></linearGradient></defs>' +
      '<rect width="800" height="1000" fill="url(#g)"/>' +
      '<text x="400" y="470" font-size="150" text-anchor="middle">💗</text>' +
      '<text x="400" y="590" font-size="44" font-family="sans-serif" fill="#fff" text-anchor="middle">' + label + '</text>' +
      '<text x="400" y="650" font-size="30" font-family="sans-serif" fill="#fff" text-anchor="middle">add your photo here 📸</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.fallback) {
      img.dataset.fallback = '1';
      img.src = placeholderSVG(img.alt || 'Photo');
    }
  }, true);

  /* ------------------------------------------------------------------
     2. BACKGROUND MAGIC
     ------------------------------------------------------------------ */

  // ✨ twinkling stars
  (function makeStars() {
    const box = $('#stars');
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 46; i++) {
      const s = document.createElement('i');
      s.style.left = rand(0, 100).toFixed(1) + '%';
      s.style.top = rand(0, 100).toFixed(1) + '%';
      s.style.setProperty('--s', rand(2, 5).toFixed(1) + 'px');
      s.style.setProperty('--d', rand(2, 5).toFixed(1) + 's');
      s.style.animationDelay = (-rand(0, 5)).toFixed(1) + 's';
      frag.appendChild(s);
    }
    box.appendChild(frag);
  })();

  // 💗 floating hearts
  const heartLayer = $('#hearts');
  const HEARTS = ['💜', '💛', '😈', '💖', '🎉', '✨', '🩷'];
  function spawnHeart(initial) {
    if (REDUCED || document.hidden) return;
    if (heartLayer.childElementCount > 26) return;
    const h = document.createElement('span');
    h.className = 'fheart';
    h.textContent = pick(HEARTS);
    const dur = rand(9, 18);
    h.style.left = rand(0, 100).toFixed(1) + '%';
    h.style.fontSize = rand(14, 40).toFixed(0) + 'px';
    h.style.setProperty('--dur', dur.toFixed(1) + 's');
    h.style.setProperty('--sway', rand(-60, 60).toFixed(0) + 'px');
    h.style.setProperty('--op', rand(0.35, 0.85).toFixed(2));
    if (initial) h.style.animationDelay = (-rand(0, dur)).toFixed(1) + 's';
    h.addEventListener('animationend', () => h.remove());
    heartLayer.appendChild(h);
  }
  for (let i = 0; i < 12; i++) spawnHeart(true);
  setInterval(spawnHeart, 750);

  // 🎈 balloons (shown on the welcome screen and the cake page)
  const BALLOON_COLORS = ['#ff5fa2', '#ff8fb8', '#c9a7ff', '#8f5cff', '#ffd1e6', '#ff7aa8', '#b28cff', '#ffb3d6'];
  function makeBalloons() {
    const box = $('#balloons');
    box.innerHTML = '';
    if (REDUCED) return;
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('span');
      b.className = 'balloon';
      b.style.setProperty('--x', (4 + i * 9.6 + rand(-3, 3)).toFixed(1) + '%');
      b.style.setProperty('--c', BALLOON_COLORS[i % BALLOON_COLORS.length]);
      b.style.setProperty('--dur', rand(12, 19).toFixed(1) + 's');
      b.style.setProperty('--delay', (-rand(0, 16)).toFixed(1) + 's');
      box.appendChild(b);
    }
  }
  makeBalloons();

  // 🌈 gentle parallax (follows pointer)
  if (!REDUCED) {
    let ticking = false, px = 0, py = 0;
    window.addEventListener('pointermove', (e) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--px', px.toFixed(3));
          document.documentElement.style.setProperty('--py', py.toFixed(3));
          ticking = false;
        });
      }
    }, { passive: true });
  }

  // 🎉 confetti (canvas)
  const Confetti = (function () {
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    const COLORS = ['#ff5fa2', '#ff8fb8', '#c9a7ff', '#7b3fe4', '#ffffff', '#ffd36b', '#ff7aa8'];
    let parts = [], raf = 0, w = 0, h = 0, rainUntil = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function add(x, y, vx, vy) {
      parts.push({
        x: x, y: y, vx: vx, vy: vy,
        w: rand(6, 12), h: rand(8, 16),
        r: rand(0, 6), vr: rand(-0.3, 0.3),
        c: pick(COLORS), heart: Math.random() < 0.25
      });
    }
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      if (t < rainUntil) {
        for (let i = 0; i < 3; i++) add(rand(0, w), -20, rand(-1.5, 1.5), rand(1.5, 4));
      }
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.vy += 0.1; p.vx *= 0.995;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        if (p.heart) { ctx.font = '16px serif'; ctx.fillText('♥', -6, 6); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      parts = parts.filter((p) => p.y < h + 40);
      if (parts.length || t < rainUntil) raf = requestAnimationFrame(tick);
      else { raf = 0; ctx.clearRect(0, 0, w, h); }
    }
    function start() { if (!raf) raf = requestAnimationFrame(tick); }

    return {
      burst: function (n, x, y) {
        if (REDUCED) return;
        n = n || 120; x = x != null ? x : w / 2; y = y != null ? y : h * 0.4;
        for (let i = 0; i < n; i++) {
          const a = rand(0, Math.PI * 2), s = rand(3, 11);
          add(x, y, Math.cos(a) * s, Math.sin(a) * s - 4);
        }
        start();
      },
      rain: function (ms) {
        if (REDUCED) return;
        rainUntil = performance.now() + (ms || 5000);
        start();
      },
      clear: function () { parts = []; rainUntil = 0; }
    };
  })();

  /* ------------------------------------------------------------------
     3. MUSIC PLAYER
     One <audio> element, created once in index.html, never reloaded.
     ------------------------------------------------------------------ */
  const audio = $('#bgm');
  const musicEl = $('#music');
  const mPlay = $('#mPlay');
  const mMute = $('#mMute');
  const mNote = $('#mNote');
  audio.loop = true;
  audio.volume = 0.85;

  const music = {
    missing: false,
    noteTimer: 0,

    note: function (msg, sticky) {
      clearTimeout(this.noteTimer);
      if (!msg) { mNote.hidden = true; return; }
      mNote.textContent = msg;
      mNote.hidden = false;
      if (!sticky) this.noteTimer = setTimeout(() => { mNote.hidden = true; }, 7000);
    },

    sync: function () {
      const playing = !audio.paused && !this.missing;
      mPlay.textContent = playing ? '⏸' : '▶';
      mPlay.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
      mMute.textContent = audio.muted ? '🔇' : '🔊';
      mMute.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
      musicEl.classList.toggle('playing', playing && !audio.muted);
    },

    // Must be called directly from a click/tap (browser autoplay rules)
    play: function () {
      const self = this;
      let p;
      try { p = audio.play(); } catch (err) { p = Promise.reject(err); }
      if (p && p.then) {
        p.then(function () { self.missing = false; self.note(''); self.sync(); })
         .catch(function (err) { self.fail(err); });
      }
      this.sync();
    },

    fail: function (err) {
      // The note fades away after a few seconds; the ▶ button always stays visible
      if (err && err.name === 'NotAllowedError') {
        this.note('Tap ▶ to start the music 🎵');
      } else {
        this.missing = true;
        this.note('Song not found 🎵 Add assets/audio/birthday-song.mp3');
      }
      this.sync();
    },

    toggle: function () {
      if (audio.paused) this.play();
      else { audio.pause(); this.sync(); }
    },

    stop: function () {
      audio.pause();
      try { audio.currentTime = 0; } catch (e) { /* not loaded yet */ }
      audio.muted = false;
      this.missing = false;
      this.note('');
      this.sync();
    }
  };

  mPlay.addEventListener('click', () => music.toggle());
  mMute.addEventListener('click', () => { audio.muted = !audio.muted; music.sync(); });
  audio.addEventListener('play', () => music.sync());
  audio.addEventListener('pause', () => music.sync());
  audio.addEventListener('volumechange', () => music.sync());
  audio.addEventListener('error', () => {
    if (document.body.classList.contains('music-ready')) music.fail({ name: 'NotSupportedError' });
  });

  /* ------------------------------------------------------------------
     4. SCREEN MANAGER & NAVIGATION
     ------------------------------------------------------------------ */
  const PAGES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
  const screens = $$('.screen');
  const bgLayers = $$('.bg-layer');
  const hooks = {};

  function show(id) {
    const next = document.getElementById(id);
    if (!next) return;
    screens.forEach((s) => {
      const on = s === next;
      s.classList.toggle('active', on);
      s.inert = !on;
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    next.scrollTop = 0;
    const theme = next.dataset.theme || id;
    document.body.dataset.theme = theme;
    bgLayers.forEach((l) => l.classList.toggle('on', l.dataset.t === theme));
    state.current = id;
    const idx = PAGES.indexOf(id);
    document.body.classList.toggle('in-app', idx > -1);
    updateNav(idx);
    if (hooks[id]) hooks[id]();
  }

  const navPrev = $('#navPrev'), navNext = $('#navNext'), navHome = $('#navHome'), dotsBox = $('#dots');
  PAGES.forEach((p, i) => {
    const d = document.createElement('i');
    d.dataset.i = i;
    dotsBox.appendChild(d);
  });
  function updateNav(idx) {
    navPrev.disabled = idx <= 0;
    navNext.disabled = idx === PAGES.length - 1;
    $$('i', dotsBox).forEach((d, i) => d.classList.toggle('on', i === idx));
  }
  function go(n) { show(PAGES[Math.max(0, Math.min(PAGES.length - 1, n - 1))]); }
  function step(d) {
    const i = PAGES.indexOf(state.current);
    const j = i + d;
    if (i < 0 || j < 0 || j >= PAGES.length) return;
    show(PAGES[j]);
  }
  navPrev.addEventListener('click', () => step(-1));
  navNext.addEventListener('click', () => step(1));
  navHome.addEventListener('click', () => go(1));
  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.goto))));

  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('in-app')) return;
    if (!$('#lightbox').hidden) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* ------------------------------------------------------------------
     5. COUNTDOWN, WELCOME & LOGIN
     ------------------------------------------------------------------ */
  const cd = { token: 0 };

  async function runCountdown() {
    const token = ++cd.token;
    const alive = () => token === cd.token && state.current === 'intro';
    const num = $('#countNum');
    const box = $('#countdown');
    const greet = $('#introGreeting');
    const title = $('#greetTitle');

    greet.classList.add('hidden');
    box.classList.remove('done');
    num.textContent = '';
    num.classList.remove('pop');
    title.classList.remove('reveal');

    await wait(700);
    for (const n of [3, 2, 1]) {
      if (!alive()) return;
      num.textContent = n;
      num.classList.remove('pop');
      reflow(num);
      num.classList.add('pop');
      popEmojis(window.innerWidth / 2, window.innerHeight * 0.45, 5, ['😈', '✨', '🎉']);
      await wait(1150);
    }
    if (!alive()) return;
    num.classList.remove('pop');
    num.textContent = '';
    box.classList.add('done');

    // soft cinematic flash, then the greeting
    const flash = $('#flash');
    flash.classList.remove('go'); reflow(flash); flash.classList.add('go');
    Confetti.burst(90, window.innerWidth / 2, window.innerHeight * 0.45);
    await wait(REDUCED ? 0 : 350);
    if (!alive()) return;
    greet.classList.remove('hidden');
    replaySplit(title);
  }
  hooks.intro = runCountdown;

  $('#openSurprise').addEventListener('click', () => show('welcome'));

  hooks.welcome = function () {
    replaySplit($('#welcomeTitle'));
    Confetti.burst(110);
    setTimeout(() => Confetti.burst(70, window.innerWidth * 0.2, window.innerHeight * 0.5), 450);
    setTimeout(() => Confetti.burst(70, window.innerWidth * 0.8, window.innerHeight * 0.5), 700);
  };
  $('#btnContinue').addEventListener('click', () => show('login'));

  hooks.login = function () {
    setTimeout(() => { if (state.current === 'login') $('#meName').focus({ preventScroll: true }); }, 700);
  };

  // --- login form ---
  const form = $('#loginForm');
  const meInput = $('#meName'), himInput = $('#himName');
  const meErr = $('#meErr'), himErr = $('#himErr');
  let unlocking = false;

  function validName(v) { return v.length >= 2 && /[\p{L}]/u.test(v); }
  [meInput, himInput].forEach((inp) => inp.addEventListener('input', () => {
    inp.classList.remove('bad');
    (inp === meInput ? meErr : himErr).textContent = '';
  }));

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (unlocking) return;
    const me = meInput.value.trim().replace(/\s+/g, ' ');
    const him = himInput.value.trim().replace(/\s+/g, ' ');
    let ok = true;
    meErr.textContent = ''; himErr.textContent = '';
    meInput.classList.remove('bad'); himInput.classList.remove('bad');

    if (!validName(me)) { meErr.textContent = 'Please type your name 💛'; meInput.classList.add('bad'); ok = false; }
    if (!validName(him)) { himErr.textContent = "Please type your friend's name 😈"; himInput.classList.add('bad'); ok = false; }
    if (!ok) {
      form.classList.remove('shake'); reflow(form); form.classList.add('shake');
      (meInput.classList.contains('bad') ? meInput : himInput).focus();
      return;
    }

    unlocking = true;
    state.me = me;
    state.him = him;
    applyNames();
    refreshReasonText();

    // 🎵 Start the song right now — we are inside the user's tap/click
    document.body.classList.add('music-ready');
    music.play();

    runUnlock().then(() => { unlocking = false; });
  });

  async function runUnlock() {
    const ov = $('#welcomeOverlay');
    $('#woTitle').textContent = 'Welcome, ' + state.me + ' 🎉';
    $('#woSub').textContent = "Let's celebrate " + state.him + "'s special day 😈🎉";
    ov.hidden = false;
    reflow(ov);
    ov.classList.add('show');
    Confetti.burst(140);
    await wait(2800);
    ov.classList.remove('show');
    await wait(REDUCED ? 0 : 600);
    ov.hidden = true;
    show('p1');
  }

  /* ------------------------------------------------------------------
     6. PAGE LOGIC
     ------------------------------------------------------------------ */

  // ---------- Page 1 ----------
  hooks.p1 = function () { Confetti.burst(40, window.innerWidth / 2, window.innerHeight * 0.3); };

  // ---------- Page 2 : gallery, 3D tilt, lightbox ----------
  const cards = $$('.photo-card');
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let lbIndex = 0, lbReturn = null;

  cards.forEach((card, i) => {
    const frame = $('.photo-frame', card);
    card.addEventListener('pointermove', (e) => {
      if (REDUCED || e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg');
      frame.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      frame.style.setProperty('--rx', '0deg');
      frame.style.setProperty('--ry', '0deg');
    });
    card.addEventListener('click', () => openLightbox(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  function setLightbox(i) {
    lbIndex = (i + cards.length) % cards.length;
    const card = cards[lbIndex];
    const img = $('img', card);
    delete lbImg.dataset.fallback;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $('figcaption', card).textContent;
  }
  function openLightbox(i) {
    lbReturn = document.activeElement;
    setLightbox(i);
    lb.hidden = false;
    reflow(lb);
    lb.classList.add('open');
    $('#lbBack').focus();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove('open');
    lb.hidden = true;
    if (lbReturn && lbReturn.focus) lbReturn.focus({ preventScroll: true });
  }
  $('#lbBack').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => setLightbox(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => setLightbox(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') setLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') setLightbox(lbIndex + 1);
  });
  (function swipe() {
    let sx = null;
    lb.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    lb.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 60) setLightbox(lbIndex + (dx < 0 ? 1 : -1));
    });
  })();

  // ---------- Page 3 : the letter ----------
  const letterWrap = $('#letterWrap'), envelope = $('#envelope');
  const letterCard = $('#letterCard'), letterBody = $('#letterBody');
  let typeToken = 0, skipTyping = false;

  async function typeInto(el, text, token) {
    const caret = document.createElement('span');
    caret.className = 'caret';
    const node = document.createTextNode('');
    el.appendChild(node);
    el.appendChild(caret);
    const chars = graphemes(text);
    for (let k = 0; k < chars.length; k++) {
      if (token !== typeToken) return false;
      if (skipTyping || REDUCED) { node.data = text; break; }
      node.data += chars[k];
      letterCard.scrollTop = letterCard.scrollHeight;
      await wait(/[.,!?…]/.test(chars[k]) ? 170 : 30);
    }
    caret.remove();
    return true;
  }

  async function typeLetter() {
    const token = ++typeToken;
    skipTyping = false;
    letterBody.innerHTML = '';
    $('#btnSkip').hidden = false;
    const paras = (CONTENT.letter || []).map(fill);
    for (let i = 0; i < paras.length; i++) {
      const p = document.createElement('p');
      letterBody.appendChild(p);
      if (!(await typeInto(p, paras[i], token))) return;
      await wait(skipTyping ? 0 : 260);
      if (token !== typeToken) return;
    }
    if (CONTENT.letterSign) {
      const s = document.createElement('p');
      s.className = 'sign';
      letterBody.appendChild(s);
      if (!(await typeInto(s, fill(CONTENT.letterSign), token))) return;
      s.style.whiteSpace = 'pre-line';
    }
    $('#btnSkip').hidden = true;
    letterCard.scrollTop = letterCard.scrollHeight;
  }

  async function openLetter() {
    if (letterWrap.classList.contains('opened') || letterWrap.classList.contains('opening')) return;
    letterWrap.classList.add('opening');
    $('#letterHint').textContent = 'Read it slowly… it was written with love 💗';
    Confetti.burst(40, window.innerWidth / 2, window.innerHeight * 0.4);
    await sleep(1100);
    letterWrap.classList.add('opened');
    envelope.tabIndex = -1;
    typeLetter();
  }
  function resetLetter() {
    typeToken++;
    letterWrap.classList.remove('opening', 'opened');
    letterBody.innerHTML = '';
    envelope.tabIndex = 0;
    $('#letterHint').textContent = 'Tap the envelope to open it 💗';
  }
  envelope.addEventListener('click', openLetter);
  $('#btnSkip').addEventListener('click', () => { skipTyping = true; });
  $('#btnReread').addEventListener('click', typeLetter);
  $('#btnCloseLetter').addEventListener('click', resetLetter);

  // ---------- Page 4 : reasons (flip cards) ----------
  function buildReasons() {
    const grid = $('#reasonGrid');
    grid.innerHTML = '';
    (CONTENT.reasons || []).forEach((r, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'flip-card rise';
      b.style.setProperty('--i', i + 2);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', r.title + ' — tap to reveal');
      b.innerHTML =
        '<span class="flip-inner">' +
          '<span class="flip-face front"><span class="r-heart">💗</span><span class="r-icon"></span><span class="r-title"></span><small>Tap to open</small></span>' +
          '<span class="flip-face back"><span class="r-text"></span></span>' +
        '</span>';
      $('.r-icon', b).textContent = r.icon;
      $('.r-title', b).textContent = r.title;
      $('.r-text', b).textContent = fill(r.text);
      b.addEventListener('click', () => {
        const on = b.classList.toggle('flipped');
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) {
          const rc = b.getBoundingClientRect();
          popEmojis(rc.left + rc.width / 2, rc.top + rc.height / 2, 6, ['😈', '💜', '✨']);
        }
      });
      grid.appendChild(b);
    });
  }
  buildReasons();
  function refreshReasonText() {
    $$('.flip-card').forEach((b, i) => {
      const r = (CONTENT.reasons || [])[i];
      if (r) $('.r-text', b).textContent = fill(r.text);
    });
  }

  // ---------- Page 5 : timeline reveal on scroll ----------
  (function timeline() {
    const items = $$('.tl-item');
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.18 });
    items.forEach((i) => io.observe(i));
  })();

  // ---------- Page 6 : couple corner ----------
  $$('.couple-card').forEach((card) => {
    const bubble = $('.bubble', card);
    card.addEventListener('click', (e) => {
      card.classList.remove('react'); reflow(card); card.classList.add('react');
      bubble.textContent = pick(CONTENT.coupleReactions || ['Aww 🥰']);
      bubble.classList.remove('on'); reflow(bubble); bubble.classList.add('on');
      popEmojis(e.clientX || card.getBoundingClientRect().left + 100, e.clientY || card.getBoundingClientRect().top + 100, 8,
        ['😈', '💜', '🥰', '😂', '🎉', '✨', '💛']);
      clearTimeout(card._t);
      card._t = setTimeout(() => { card.classList.remove('react'); bubble.classList.remove('on'); }, 2600);
    });
  });

  const heartBtn = $('#heartSurprise'), coupleMsg = $('#coupleMsg');
  heartBtn.addEventListener('click', () => {
    const open = heartBtn.getAttribute('aria-expanded') === 'true';
    if (open) {
      heartBtn.setAttribute('aria-expanded', 'false');
      coupleMsg.classList.remove('show');
      $('.hb-text', heartBtn).textContent = 'Tap for a surprise';
      return;
    }
    heartBtn.setAttribute('aria-expanded', 'true');
    coupleMsg.textContent = fill(CONTENT.coupleSurprise);
    coupleMsg.classList.add('show');
    $('.hb-text', heartBtn).textContent = 'Tap to hide';
    const rc = heartBtn.getBoundingClientRect();
    popEmojis(rc.left + rc.width / 2, rc.top + 20, 14, ['😈', '💜', '🎉', '✨', '💛']);
    Confetti.burst(50, rc.left + rc.width / 2, rc.top);
  });

  // ---------- Page 7 : cake, wish, replay ----------
  const cake7 = $('#cake7'), wishBox = $('#wishBox');

  function buildWishes() {
    $('#wishIntro').textContent = fill(CONTENT.wishIntro);
    const ul = $('#wishList');
    ul.innerHTML = '';
    (CONTENT.wishes || []).forEach((w, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--i', i);
      const ic = document.createElement('span'); ic.className = 'w-icon'; ic.textContent = w.icon;
      const box = document.createElement('div');
      const t = document.createElement('strong'); t.textContent = w.title;
      const p = document.createElement('p'); p.textContent = fill(w.text);
      box.append(t, p);
      li.append(ic, box);
      ul.appendChild(li);
    });
  }

  hooks.p7 = function () {
    cake7.classList.remove('blown');
    wishBox.classList.remove('show');
    makeBalloons();
    Confetti.rain(5500);
  };
  $('#btnWish').addEventListener('click', () => {
    buildWishes();
    cake7.classList.add('blown');
    wishBox.classList.add('show');
    Confetti.burst(160);
    setTimeout(() => Confetti.burst(80, window.innerWidth * 0.2, window.innerHeight * 0.4), 300);
    setTimeout(() => Confetti.burst(80, window.innerWidth * 0.8, window.innerHeight * 0.4), 500);
    setTimeout(() => wishBox.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }), 250);
  });
  $('#btnReplay').addEventListener('click', () => {
    cake7.classList.remove('blown');
    wishBox.classList.remove('show');
    makeBalloons();
    Confetti.rain(5000);
    Confetti.burst(110);
    $('#p7').scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  });

  // ---------- Page 8 : final surprise ----------
  const btnFinal = $('#btnFinal'), finalReveal = $('#finalReveal');
  $('#finalLine').textContent = CONTENT.finalLine || '';

  hooks.p8 = function () { Confetti.burst(50, window.innerWidth / 2, window.innerHeight * 0.25); };
  btnFinal.addEventListener('click', () => {
    $('#finalSurprise').textContent = fill(CONTENT.finalSurprise);
    finalReveal.classList.add('show');
    btnFinal.setAttribute('aria-expanded', 'true');
    btnFinal.textContent = 'With all my love 💖';
    Confetti.burst(140);
    const rc = btnFinal.getBoundingClientRect();
    popEmojis(rc.left + rc.width / 2, rc.top, 14, ['😈', '💜', '🎉', '✨', '💛']);
    setTimeout(() => finalReveal.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }), 250);
  });
  function resetFinal() {
    finalReveal.classList.remove('show');
    btnFinal.setAttribute('aria-expanded', 'false');
    btnFinal.textContent = 'One More Surprise 💌';
  }

  /* ------------------------------------------------------------------
     7. LOGOUT / START AGAIN  — resets everything, stops the music
     ------------------------------------------------------------------ */
  function resetSession() {
    state.me = ''; state.him = '';
    form.reset();
    meErr.textContent = ''; himErr.textContent = '';
    meInput.classList.remove('bad'); himInput.classList.remove('bad');
    unlocking = false;

    music.stop();
    document.body.classList.remove('music-ready');

    closeLightbox();
    resetLetter();
    resetFinal();
    $$('.flip-card').forEach((b) => { b.classList.remove('flipped'); b.setAttribute('aria-pressed', 'false'); });
    heartBtn.setAttribute('aria-expanded', 'false');
    coupleMsg.classList.remove('show');
    $('.hb-text', heartBtn).textContent = 'Tap for a surprise';
    cake7.classList.remove('blown');
    wishBox.classList.remove('show');
    $('#welcomeOverlay').hidden = true;
    $('#welcomeOverlay').classList.remove('show');
    Confetti.clear();

    applyNames();
    refreshReasonText();
    show('intro');
  }
  $('#logoutBtn').addEventListener('click', resetSession);
  $('#btnStartAgain').addEventListener('click', resetSession);

  /* ------------------------------------------------------------------
     START
     ------------------------------------------------------------------ */
  if (window.Stickers) window.Stickers.render();
  splitText($('#greetTitle'));
  splitText($('#welcomeTitle'));
  applyNames();
  updateNav(-1);
  show('intro');     // starts the countdown automatically

})();
