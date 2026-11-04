/* =====================================================================
   🧸 stickers.js — original cartoon illustrations drawn with SVG
   ---------------------------------------------------------------------
   Every sticker in index.html looks like this:

       <div class="sticker" data-sticker="hug"
            data-img="assets/images/friends-hug.png"></div>

   • data-sticker  → which built-in SVG drawing to use
                     (hug | highfive | selfie | cake | heart)
   • data-img      → OPTIONAL. If you put your own picture at that path
                     (PNG / JPG / SVG / GIF), it automatically replaces
                     the built-in drawing. If the file doesn't exist, the
                     built-in drawing stays. No code changes needed!
   ===================================================================== */
(function () {
  'use strict';

  const C = {
    skinG: '#ffdcc8', skinB: '#ffd0b5',
    hairG: '#6a3446', hairB: '#2b2447',
    dress: '#ff6fae', dress2: '#ff9ccb',
    shirt: '#8b5cf6', shirt2: '#b794f6',
    pants: '#5b4b9a', blush: '#ff7aa8', ink: '#3a2335'
  };

  const svg = (vb, inner, label) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;

  const stroke = (d, w, col) =>
    `<path d="${d}" fill="none" stroke="${col || C.ink}" stroke-width="${w || 2.6}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // little floating heart (wrapped in <g> so the CSS animation never fights the transform)
  const heart = (x, y, s, color, delay) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path class="sk-heart" style="animation-delay:${delay || 0}s" fill="${color}" d="M0 7 C-12 -3 -15 -15 -7 -15 C-3 -15 0 -11 0 -9 C0 -11 3 -15 7 -15 C15 -15 12 -3 0 7Z"/></g>`;

  const sparkle = (x, y, s, delay) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path class="sk-spark" style="animation-delay:${delay || 0}s" fill="#fff" d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z"/></g>`;

  /* ---------- face parts ---------- */
  function eyes(cx, cy, r, happy) {
    const dx = r * 0.4, y = cy - r * 0.02, w = r * 0.15;
    if (happy) {
      return stroke(`M${cx - dx - w} ${y} q${w} ${-w * 1.6} ${w * 2} 0`) +
             stroke(`M${cx + dx - w} ${y} q${w} ${-w * 1.6} ${w * 2} 0`);
    }
    const rr = w * 0.95;
    const dot = (x) =>
      `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.ink}"/>` +
      `<circle cx="${x + rr * 0.35}" cy="${y - rr * 0.35}" r="${rr * 0.36}" fill="#fff"/>`;
    return dot(cx - dx) + dot(cx + dx);
  }

  function cheeks(cx, cy, r, op) {
    const dx = r * 0.62, y = cy + r * 0.3;
    const e = (x) => `<ellipse class="blush" cx="${x}" cy="${y}" rx="${r * 0.17}" ry="${r * 0.1}" fill="${C.blush}" opacity="${op || 0.55}"/>`;
    return e(cx - dx) + e(cx + dx);
  }

  function mouth(cx, cy, r, kind) {
    const y = cy + r * 0.38;
    if (kind === 'none') return '';
    if (kind === 'open') {
      return `<path d="M${cx - r * 0.13} ${y} q${r * 0.13} ${r * 0.24} ${r * 0.26} 0 z" fill="#ff6b8e" stroke="#c2456b" stroke-width="2" stroke-linejoin="round"/>`;
    }
    return stroke(`M${cx - r * 0.11} ${y} q${r * 0.11} ${r * 0.16} ${r * 0.22} 0`, 2.2, '#c2456b');
  }

  /* ---------- heads ---------- */
  function girlHead(cx, cy, r, o) {
    o = o || {};
    return `<g>
      <ellipse cx="${cx}" cy="${cy + r * 0.18}" rx="${r * 1.13}" ry="${r * 1.18}" fill="${C.hairG}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.skinG}"/>
      <path d="M${cx - r * 1.02} ${cy + r * 0.05} Q${cx - r} ${cy - r * 1.12} ${cx} ${cy - r * 1.04} Q${cx + r} ${cy - r * 1.12} ${cx + r * 1.02} ${cy + r * 0.05} Q${cx + r * 0.6} ${cy - r * 0.55} ${cx + r * 0.05} ${cy - r * 0.5} Q${cx - r * 0.55} ${cy - r * 0.42} ${cx - r * 1.02} ${cy + r * 0.05}Z" fill="${C.hairG}"/>
      ${eyes(cx, cy, r, o.happy)}${cheeks(cx, cy, r, o.blush)}${mouth(cx, cy, r, o.mouth)}
      <g transform="translate(${cx + r * 0.66} ${cy - r * 0.92})"><path d="M0 0 L-13 -9 V9Z M0 0 L13 -9 V9Z" fill="#ff4f93"/><circle r="3.8" fill="#ff9cc6"/></g>
    </g>`;
  }

  function boyHead(cx, cy, r, o) {
    o = o || {};
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.skinB}"/>
      <path d="M${cx - r * 1.03} ${cy - r * 0.05} Q${cx - r * 1.12} ${cy - r * 1.25} ${cx} ${cy - r * 1.14} Q${cx + r * 1.12} ${cy - r * 1.25} ${cx + r * 1.03} ${cy - r * 0.05} Q${cx + r * 0.75} ${cy - r * 0.6} ${cx + r * 0.15} ${cy - r * 0.66} Q${cx - r * 0.45} ${cy - r * 0.5} ${cx - r * 1.03} ${cy - r * 0.05}Z" fill="${C.hairB}"/>
      ${eyes(cx, cy, r, o.happy)}${cheeks(cx, cy, r, o.blush)}${mouth(cx, cy, r, o.mouth)}
    </g>`;
  }

  /* ---------- scenes ---------- */
  function hug() {
    return svg('0 0 240 230', `
      ${heart(120, 24, 1.25, '#ff4f93')}${heart(84, 38, 0.8, '#ff9cc6', 0.4)}${heart(158, 40, 0.8, '#c9a7ff', 0.8)}
      ${sparkle(30, 60, 0.9, 0.2)}${sparkle(214, 70, 0.8, 0.9)}
      <path d="M50 146 Q92 124 134 146 L150 220 L36 220Z" fill="${C.dress}"/>
      <path d="M106 154 Q154 132 202 154 L208 220 L100 220Z" fill="${C.shirt}"/>
      <g transform="rotate(7 92 94)">${girlHead(92, 94, 40, { happy: true, mouth: 'open' })}</g>
      <g transform="rotate(-7 156 100)">${boyHead(156, 100, 38, { happy: true, mouth: 'open' })}</g>
      <path d="M112 176 Q148 192 190 178" fill="none" stroke="${C.dress2}" stroke-width="17" stroke-linecap="round"/>
      <circle cx="190" cy="178" r="8.5" fill="${C.skinG}"/>
      <path d="M118 206 Q96 198 66 202" fill="none" stroke="${C.shirt2}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="64" cy="202" r="8" fill="${C.skinB}"/>
    `, 'Two best friends hugging');
  }

  function highfive() {
    return svg('0 0 240 230', `
      ${heart(120, 30, 1.2, '#ff4f93')}${heart(86, 44, 0.75, '#ff9cc6', 0.5)}${heart(156, 46, 0.75, '#c9a7ff', 0.9)}
      ${sparkle(26, 90, 0.8, 0.3)}${sparkle(216, 98, 0.9, 0.7)}
      <!-- girl -->
      <rect x="70" y="168" width="11" height="32" rx="5" fill="${C.skinG}"/><rect x="92" y="168" width="11" height="32" rx="5" fill="${C.skinG}"/>
      <ellipse cx="75" cy="203" rx="10.5" ry="5.5" fill="#ff4f93"/><ellipse cx="98" cy="203" rx="10.5" ry="5.5" fill="#ff4f93"/>
      <path d="M58 112 Q82 100 106 112 L122 176 L42 176Z" fill="${C.dress}"/>
      <path d="M60 122 Q46 140 48 158" fill="none" stroke="${C.skinG}" stroke-width="9" stroke-linecap="round"/>
      <path d="M104 120 Q118 104 121 88" fill="none" stroke="${C.skinG}" stroke-width="9" stroke-linecap="round"/>
      <!-- boy -->
      <rect x="146" y="166" width="12" height="34" rx="5" fill="${C.pants}"/><rect x="168" y="166" width="12" height="34" rx="5" fill="${C.pants}"/>
      <ellipse cx="152" cy="203" rx="11" ry="5.5" fill="#3a2f5c"/><ellipse cx="174" cy="203" rx="11" ry="5.5" fill="#3a2f5c"/>
      <rect x="136" y="110" width="48" height="62" rx="16" fill="${C.shirt}"/>
      <path d="M182 122 Q196 140 194 158" fill="none" stroke="${C.skinB}" stroke-width="9" stroke-linecap="round"/>
      <path d="M138 120 Q126 104 123 88" fill="none" stroke="${C.skinB}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="122" cy="84" r="9.5" fill="${C.skinG}"/>
      ${girlHead(82, 76, 34, { happy: true, mouth: 'open' })}
      ${boyHead(160, 78, 32, { mouth: 'smile' })}
      ${sparkle(122, 62, 1.5, 0.1)}${sparkle(98, 70, 0.8, 0.5)}${sparkle(148, 70, 0.8, 0.9)}
    `, 'Two best friends doing a high five');
  }

  function selfie() {
    return svg('0 0 240 230', `
      ${sparkle(124, 24, 1.3, 0)}${sparkle(88, 30, 0.8, 0.6)}${sparkle(162, 28, 0.8, 0.3)}
      ${sparkle(28, 70, 0.9, 0.2)}${sparkle(212, 62, 0.8, 0.8)}
      <path d="M46 152 Q90 128 134 152 L146 222 L34 222Z" fill="${C.dress}"/>
      <path d="M112 158 Q160 136 208 158 L214 222 L106 222Z" fill="${C.shirt}"/>
      <g transform="rotate(3 92 100)">${girlHead(92, 100, 42, { happy: true, mouth: 'open', blush: 0.6 })}</g>
      <g transform="rotate(-14 164 96)">${boyHead(164, 96, 38, { happy: true, mouth: 'open', blush: 0.6 })}</g>
      <text x="128" y="62" font-size="30" text-anchor="middle">📸</text>
      <path d="M114 186 Q98 176 78 178" fill="none" stroke="${C.shirt2}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="76" cy="178" r="8" fill="${C.skinB}"/>
    `, 'Two best friends taking a selfie');
  }

  function cake() {
    const candle = (x, d) =>
      `<rect x="${x - 4}" y="70" width="8" height="32" rx="2.5" fill="#fff"/>` +
      `<path d="M${x - 4} 78 l8 -4 M${x - 4} 87 l8 -4 M${x - 4} 96 l8 -4" stroke="#ff6fae" stroke-width="3"/>` +
      `<g class="flame" style="--d:${d}s">` +
        `<circle class="flame-glow" cx="${x}" cy="56" r="15" fill="#ffd36b" opacity=".35"/>` +
        `<path d="M${x} 68 C${x - 10} 60 ${x - 6} 50 ${x} 40 C${x + 6} 50 ${x + 10} 60 ${x} 68Z" fill="#ffb347"/>` +
        `<path d="M${x} 67 C${x - 5} 62 ${x - 3} 56 ${x} 51 C${x + 3} 56 ${x + 5} 62 ${x} 67Z" fill="#fff3a8"/>` +
      `</g>`;
    return svg('0 0 200 230', `
      <ellipse cx="100" cy="212" rx="92" ry="13" fill="#ffe3f0" stroke="#ffb3d6" stroke-width="2"/>
      <rect x="20" y="146" width="160" height="62" rx="16" fill="#ff8fbd"/>
      <path d="M20 160 q13.4 -16 26.7 0 t26.7 0 t26.7 0 t26.7 0 t26.7 0 t26.7 0 V146 H20Z" fill="#fff0f7"/>
      <rect x="46" y="100" width="108" height="50" rx="14" fill="#c9a7ff"/>
      <path d="M46 114 q9 -12 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 V100 H46Z" fill="#fff0f7"/>
      <circle cx="62" cy="134" r="3" fill="#ffd36b"/><circle cx="88" cy="140" r="3" fill="#fff"/><circle cx="112" cy="132" r="3" fill="#ff8fbd"/><circle cx="138" cy="140" r="3" fill="#ffd36b"/>
      <circle cx="40" cy="190" r="3" fill="#fff"/><circle cx="160" cy="188" r="3" fill="#fff"/><circle cx="70" cy="196" r="3" fill="#ffd36b"/><circle cx="132" cy="196" r="3" fill="#c9a7ff"/>
      ${heart(100, 182, 1.3, '#fff')}
      ${candle(76, 0)}${candle(100, 0.12)}${candle(124, 0.25)}
    `, 'Animated birthday cake with candles');
  }

  function bigHeart() {
    return svg('0 0 200 190', `
      <path d="M100 178 C20 120 2 72 30 42 C54 16 92 28 100 58 C108 28 146 16 170 42 C198 72 180 120 100 178Z" fill="#ff4f93"/>
      <path d="M100 178 C20 120 2 72 30 42 C54 16 92 28 100 58 C108 28 146 16 170 42 C198 72 180 120 100 178Z" fill="none" stroke="#ffb3d6" stroke-width="4" stroke-opacity=".6"/>
      <path d="M46 56 C52 42 70 38 82 46" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="9" stroke-linecap="round"/>
      ${sparkle(170, 24, 1.1, 0.2)}${sparkle(24, 120, 0.9, 0.7)}${sparkle(182, 130, 0.8, 1.1)}
    `, 'Big glowing heart');
  }

  const MAP = { hug: hug, highfive: highfive, selfie: selfie, cake: cake, heart: bigHeart };

  function render(root) {
    (root || document).querySelectorAll('[data-sticker]').forEach(function (el) {
      if (el.dataset.ready) return;
      const draw = MAP[el.dataset.sticker];
      if (!draw) return;
      el.innerHTML = draw();
      el.dataset.ready = '1';

      // Optional: swap in the user's own picture if that file exists
      const src = el.dataset.img;
      if (src) {
        const img = new Image();
        img.onload = function () {
          el.innerHTML = '';
          img.alt = '';
          img.className = 'sticker-img';
          el.appendChild(img);
        };
        img.src = src; // if the file is missing nothing happens — the SVG stays
      }
    });
  }

  window.Stickers = { render: render };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { render(); });
  else render();
})();
