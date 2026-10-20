/* ---------------- illustrated "photos" of each space ---------------- */
function Art({ a }) {
  const g = 'a' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const wx = a.win === 'right' ? 226 : 56;
  const winShape = a.arch
    ? html`<path d="M150 160V82a50 50 0 0 1 100 0v78z" />`
    : html`<rect x=${wx} y="34" width="118" height="124" rx="3" />`;
  const base = a.arch ? 40 : (a.win === 'left' ? 222 : 52);
  const slot = (i) => base + i * (a.win === 'left' ? 118 : 128);
  const beam = a.arch ? '150,160 250,160 305,260 135,260' : `${wx},158 ${wx + 118},158 ${wx + 176},260 ${wx + 16},260`;
  const props = (a.props || []).map((p, i) => {
    const x = slot(i);
    if (p === 'plant') return html`<g key=${p}>
      ${[-40, -16, 8, 30, -62].map((r, j) => html`<ellipse key=${j} cx=${x} cy="128" rx="9" ry="27" fill=${a.leaf || '#4E7A55'} opacity=${0.75 + j * 0.05} transform=${`rotate(${r} ${x} 160)`} />`)}
      <path d=${`M${x - 16} 158h32l-5 38h-22z`} fill=${a.pot || '#C8A27C'} /></g>`;
    if (p === 'chair') return html`<g key=${p}>
      <rect x=${x} y="124" width="92" height="56" rx="20" fill=${a.prop} />
      <rect x=${x - 8} y="164" width="108" height="32" rx="12" fill=${a.prop} /><rect x=${x - 8} y="164" width="108" height="32" rx="12" fill="#000" opacity=".08" />
      <rect x=${x - 14} y="146" width="20" height="50" rx="9" fill=${a.prop} /><rect x=${x + 86} y="146" width="20" height="50" rx="9" fill=${a.prop} />
      <rect x=${x + 46} y="140" width="30" height="40" rx="6" fill=${a.prop2} opacity=".9" />
      <path d=${`M${x - 4} 196v12M${x + 96} 196v12`} stroke="#3A2E24" stroke-width="4" stroke-linecap="round" /></g>`;
    if (p === 'mat') return html`<g key=${p}>
      <polygon points=${`${x - 14},216 ${x + 112},216 ${x + 136},244 ${x - 34},244`} fill=${a.prop} />
      <polygon points=${`${x - 14},216 ${x + 112},216 ${x + 114},219 ${x - 16},219`} fill="#fff" opacity=".18" />
      <ellipse cx=${x + 6} cy="212" rx="24" ry="9" fill=${a.prop2} /></g>`;
    if (p === 'bed') return html`<g key=${p}>
      <rect x=${x - 12} y="170" width="152" height="26" rx="6" fill=${a.prop2} />
      <rect x=${x - 8} y="156" width="144" height="20" rx="9" fill=${a.prop} />
      <ellipse cx=${x + 16} cy="152" rx="21" ry="10" fill=${a.prop} /><ellipse cx=${x + 16} cy="152" rx="21" ry="10" fill="#fff" opacity=".35" />
      <rect x=${x + 58} y="156" width="78" height="22" rx="7" fill=${a.prop2} opacity=".85" /></g>`;
    if (p === 'lamp') return html`<g key=${p}>
      <circle cx=${x + 20} cy="112" r="72" fill=${`url(#${g}l)`} />
      <path d=${`M${x + 20} 122v74`} stroke="#2B2622" stroke-width="3" />
      <ellipse cx=${x + 20} cy="196" rx="13" ry="3" fill="#2B2622" />
      <path d=${`M${x + 2} 124l7-24h22l7 24z`} fill="#F3E3C0" /></g>`;
    if (p === 'shelf') return html`<g key=${p}>
      <rect x=${x - 6} y="78" width="104" height="118" rx="3" fill=${a.prop} />
      ${[0, 1, 2].map(r => html`<g key=${r}>${[0, 1, 2, 3, 4, 5, 6].map(b => html`<rect key=${b} x=${x + 2 + b * 13} y=${86 + r * 38 + (b % 3) * 3} width="10" height=${30 - (b % 3) * 3} rx="1.5" fill=${['#C9A46B', '#5E7F72', '#B5654A', '#E9DCC6', '#3F4E66', '#8E6A9E', '#D8B26E'][(b + r * 2) % 7]} />`)}</g>`)}
      </g>`;
    if (p === 'pews') return html`<g key=${p}>${[0, 1, 2].map(r => html`<g key=${r}>
      <rect x="22" y=${172 + r * 26} width="140" height="9" rx="2" fill=${a.prop} /><rect x="238" y=${172 + r * 26} width="140" height="9" rx="2" fill=${a.prop} />
      <rect x="22" y=${160 + r * 26} width="140" height="5" rx="2" fill=${a.prop} opacity=".7" /><rect x="238" y=${160 + r * 26} width="140" height="5" rx="2" fill=${a.prop} opacity=".7" /></g>`)}</g>`;
    if (p === 'panels') return html`<g key=${p}>${[0, 1, 2, 3, 4, 5].map(k => html`<rect key=${k} x=${x - 12 + (k % 3) * 42} y=${54 + Math.floor(k / 3) * 46} width="36" height="40" rx="4" fill=${a.prop} opacity=${0.55 + (k % 2) * 0.25} />`)}</g>`;
    if (p === 'circle') return html`<g key=${p}>
      <ellipse cx="120" cy="226" rx="34" ry="10" fill="#000" opacity=".1" />
      ${[[70, 214], [170, 214], [90, 240], [150, 240], [120, 206]].map(([cx, cy], k) => html`<ellipse key=${k} cx=${cx} cy=${cy} rx="22" ry="8" fill=${k % 2 ? a.prop2 : a.prop} />`)}
      <circle cx="320" cy="150" r="26" fill=${a.prop2} opacity=".35" /></g>`;
    return null;
  });
  return html`<svg class="art" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id=${g + 'w'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color=${a.wall} /><stop offset="1" stop-color=${a.wall2} /></linearGradient>
      <linearGradient id=${g + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color=${a.sky} /><stop offset="1" stop-color=${a.sky2} /></linearGradient>
      <radialGradient id=${g + 'l'}><stop offset="0" stop-color=${a.glow} stop-opacity=".8" /><stop offset="1" stop-color=${a.glow} stop-opacity="0" /></radialGradient>
      <clipPath id=${g + 'c'}>${winShape}</clipPath>
    </defs>
    <rect width="400" height="260" fill=${`url(#${g}w)`} />
    <g clip-path=${`url(#${g}c)`}>
      <rect x="0" y="0" width="400" height="200" fill=${`url(#${g}s)`} />
      ${a.hills && html`<path d=${`M${wx - 10} 128q34-22 66-6t70-8v60h-136z`} fill="#8DAE78" /><path d=${`M${wx - 10} 142q50-14 140-2v40h-140z`} fill="#6F955F" />
        <path d=${`M${wx} 140h120M${wx + 20} 132v14M${wx + 50} 132v14M${wx + 80} 132v14M${wx + 110} 132v14`} stroke="#F4EFE6" stroke-width="2" />`}
      ${a.trees && html`<g fill="#5E8F55" opacity=".85">${[0, 1, 2, 3].map(k => html`<circle key=${k} cx=${(a.arch ? 150 : wx) + 10 + k * 34} cy=${70 + (k % 2) * 40} r="30" />`)}</g>
        <g fill="#3F6E44" opacity=".7">${[0, 1, 2].map(k => html`<circle key=${k} cx=${wx + 28 + k * 36} cy=${130 - (k % 2) * 34} r="22" />`)}</g>`}
    </g>
    <g fill="none" stroke=${a.frame} stroke-width="7">${winShape}</g>
    ${a.arch
      ? html`<path d="M200 34v126M150 112h100" stroke=${a.frame} stroke-width="4" />`
      : html`<path d=${`M${wx + 59} 34v124M${wx} 96h118`} stroke=${a.frame} stroke-width="4" /><rect x=${wx - 8} y="157" width="134" height="7" rx="2" fill=${a.frame} />`}
    <rect x="0" y="190" width="400" height="6" fill="#000" opacity=".07" />
    <rect x="0" y="196" width="400" height="64" fill=${a.floor} />
    <polygon points=${beam} fill=${a.glow} opacity=".22" />
    ${props}
  </svg>`;
}

/* ---------------- stylised Lexington map ---------------- */
const MAP_C = [200, 300];
const ROADS = [
  ['Georgetown Rd', 150, -20], ['Paris Pike', 392, 30], ['Winchester Rd', 430, 268], ['Richmond Rd', 430, 530],
  ['Tates Creek Rd', 300, 730], ['Nicholasville Rd', 214, 730], ['Harrodsburg Rd', 60, 730], ['Versailles Rd', -30, 400], ['Leestown Rd', -30, 130],
];
const HOODS = [['DOWNTOWN', 172, 324], ['UK CAMPUS', 186, 352], ['CHEVY CHASE', 262, 362], ['HAMBURG', 352, 296], ['NOLI', 236, 238],
  ['DISTILLERY DIST.', 112, 330], ['KENWICK', 300, 344], ['SOUTHLAND', 196, 466], ['BELL COURT', 268, 286]];
function MapBase() {
  const grid = [];
  for (let i = -12; i <= 24; i++) { grid.push(`M${i * 32} -200V900`); grid.push(`M-300 ${i * 32}H700`); }
  return html`<g>
    <rect x="-300" y="-300" width="1000" height="1300" class="m-land" />
    <path d=${grid.join('')} class="m-grid" transform="rotate(-24 200 300)" />
    <ellipse cx="62" cy="150" rx="44" ry="26" class="m-park" />
    <ellipse cx="22" cy="410" rx="34" ry="17" class="m-park m-track" />
    <path d="M300 520q40-22 74 8q12 42-30 58q-48 6-44-66z" class="m-park" /><ellipse cx="338" cy="548" rx="17" ry="9" class="m-water" />
    <path d="M212 402q24-9 36 6q5 22-17 28q-24 1-19-34z" class="m-park" />
    <ellipse cx="118" cy="505" rx="26" ry="17" class="m-park" />
    ${ROADS.map(([n, x, y]) => html`<path key=${n + 'c'} d=${`M200 300Q${(200 + x) / 2 + (y - 300) * 0.06} ${(300 + y) / 2 - (x - 200) * 0.06} ${x} ${y}`} class="m-case" stroke-width="9" />`)}
    <ellipse cx="205" cy="318" rx="152" ry="162" class="m-case" stroke-width="10" />
    <path d="M36 480Q120 610 222 618Q334 610 380 470" class="m-case" stroke-width="9" />
    ${ROADS.map(([n, x, y]) => html`<path key=${n} d=${`M200 300Q${(200 + x) / 2 + (y - 300) * 0.06} ${(300 + y) / 2 - (x - 200) * 0.06} ${x} ${y}`} class="m-major" stroke-width="5" />`)}
    <ellipse cx="205" cy="318" rx="152" ry="162" class="m-major" stroke-width="6" />
    <path d="M36 480Q120 610 222 618Q334 610 380 470" class="m-major" stroke-width="5" />
    <g class="m-label">
      ${ROADS.map(([n, x, y]) => { const tx = 200 + (x - 200) * 0.78, ty = 300 + (y - 300) * 0.78; let ang = Math.atan2(y - 300, x - 200) * 180 / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
        return html`<text key=${n} x=${tx} y=${ty - 6} text-anchor="middle" transform=${`rotate(${ang} ${tx} ${ty})`}>${n}</text>`; })}
      <text x="352" y="172" transform="rotate(52 352 172)">New Circle Rd</text>
      <text x="252" y="640" text-anchor="middle">Man o' War Blvd</text>
      <text x="22" y="440" text-anchor="middle">Keeneland</text>
      <text x="340" y="600" text-anchor="middle">Jacobson Park</text>
      <text x="62" y="186" text-anchor="middle">Masterson Station</text>
    </g>
    <g class="m-hood">
      ${HOODS.map(([n, x, y]) => html`<text key=${n} x=${x} y=${y} text-anchor="middle">${n}</text>`)}
    </g>
  </g>`;
}
function YouDot({ x = 214, y = 328 }) {
  return html`<g><circle cx=${x} cy=${y} r="9" class="pulse m-you" /><circle cx=${x} cy=${y} r="7" class="m-you" stroke="#fff" stroke-width="3" /></g>`;
}
function Pin({ l, on, onClick }) {
  const label = fmtPrice(l.price);
  const w = label.length * 7.6 + 20;
  return html`<g class=${'pin' + (on ? ' on' : '') + (l.price === 0 ? ' free' : '')} transform=${`translate(${l.x} ${l.y}) scale(${on ? 1.12 : 1})`} onClick=${onClick} role="button" aria-label=${l.title}>
    <rect x=${-w / 2} y="-13" width=${w} height="26" rx="13" style=${{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.18))' }} />
    <text text-anchor="middle" y="4.5">${label}</text>
  </g>`;
}
