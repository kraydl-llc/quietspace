/* ---------------- filters (Cassie's guest search list, Oct 21) ---------------- */
const HOOD_LIST = [...new Set(LISTINGS.map(l => l.hood))].sort();
const WHEN = [['any', 'Any time'], ['now', 'Right now'], ['today', 'Today'], ['tomorrow', 'Tomorrow'], ['weekend', 'This weekend']];
const DEFAULT_F = { hoods: [], dist: 25, when: 'any', adults: 1, kids: 0, uses: [], quiet: 'any', types: [], setting: 'any', privacy: 'any',
  maxPrice: 40, freeOnly: false, amen: [], rGuest: 0, rHost: 0, instant: false };
const weekendDays = () => [0, 1, 2, 3, 4, 5, 6].filter(i => [0, 6].includes(dayAt(i).getDay()));
const openOn = (l, days) => days.some(d => HOURS.some(h => slotOk(l, d, h, l.minH)));
const applyFilters = (f) => LISTINGS.filter(l =>
  (!f.hoods.length || f.hoods.includes(l.hood)) && l.mi <= f.dist &&
  (f.when === 'any' || (f.when === 'now' ? l.now : openOn(l, f.when === 'today' ? [0] : f.when === 'tomorrow' ? [1] : weekendDays()))) &&
  l.cap >= f.adults + f.kids && (!f.kids || l.kids) &&
  f.uses.every(u => l.uses.includes(u)) &&
  (f.quiet === 'any' || l.db <= (f.quiet === 'very' ? 25 : 30)) &&
  (!f.types.length || f.types.includes(l.type)) &&
  (f.setting === 'any' || (f.setting === 'indoor' ? l.setting !== 'outdoor' : l.setting !== 'indoor')) &&
  (f.privacy === 'any' || (f.privacy === 'entire' ? l.privacy === 'entire' : l.privacy !== 'shared')) &&
  l.price <= f.maxPrice && (!f.freeOnly || l.price === 0) &&
  f.amen.every(a => l.amen.includes(a)) && l.rating >= f.rGuest && l.hostRating >= f.rHost && (!f.instant || l.instant));
const countActive = (f) => f.hoods.length + (f.dist < 25) + (f.when !== 'any') + (f.adults > 1) + (f.kids > 0) + f.uses.length + (f.quiet !== 'any') +
  f.types.length + (f.setting !== 'any') + (f.privacy !== 'any') + (f.maxPrice < 40) + f.freeOnly + f.amen.length + (f.rGuest > 0) + (f.rHost > 0) + f.instant;
const toggleIn = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

function ListingCard({ l, saved, onSave, onOpen }) {
  return html`<article class="card">
    <div class="card-art">
      <button style=${{ display: 'block', width: '100%', height: '100%' }} onClick=${onOpen} aria-label=${'Open ' + l.title}><${Art} a=${l.art} /></button>
      ${l.price === 0 ? html`<span class="badge">Free space</span>` : l.rating >= 4.95 ? html`<span class="badge">Guest favorite</span>` : l.now ? html`<span class="badge"><${Icon} n="zap" cls="sm" />Open now</span>` : null}
      <span class="badge sound"><${Icon} n=${SOUND[l.sound].icon} cls="sm" />${SOUND[l.sound].short}</span>
      <button class=${'heart' + (saved ? ' on' : '')} onClick=${(e) => { e.stopPropagation(); onSave(); }} aria-label=${saved ? 'Remove from saved' : 'Save'}><${Icon} n="heart" /></button>
    </div>
    <button class="card-body" style=${{ width: '100%', textAlign: 'left' }} onClick=${onOpen}>
      <div class="spread" style=${{ alignItems: 'flex-start' }}><h3>${l.title}</h3><span class="stars tnum"><${Icon} n="star" fill=${true} />${l.rating.toFixed(2)}</span></div>
      <p class="meta">${TYPE[l.type].label} · ${l.hood} · ${l.mi} mi</p>
      <p class="meta tnum">${PRIVACY[l.privacy].short} · ${l.db} dB · ${l.kids ? 'Kids welcome' : 'Adults only'}</p>
      <p class="price tnum">${l.price === 0 ? html`<b>Free</b> · donations welcome` : html`<b>$${l.price}</b> / hour`}</p>
    </button>
  </article>`;
}

function SearchPill({ f, onOpen }) {
  const n = countActive(f);
  const where = f.hoods.length === 0 ? 'Lexington' : f.hoods.length === 1 ? f.hoods[0] : `${f.hoods.length} neighborhoods`;
  const people = f.adults + f.kids;
  return html`<button class="search" onClick=${onOpen}>
    <${Icon} n="search" />
    <span class="q"><b>Where do you need quiet?</b><span>${where} · ${WHEN.find(w => w[0] === f.when)[1]} · ${people} ${people > 1 ? 'people' : 'guest'}</span></span>
    <span class="filter-btn"><${Icon} n="sliders" cls="sm" />${n > 0 && html`<span class="count">${n}</span>`}</span>
  </button>`;
}

function Explore({ f, setF, openFilters, openListing, saved, toggleSave, mode, setMode }) {
  const list = useMemo(() => applyFilters(f), [f]);
  const [scrolled, setScrolled] = useState(false);
  const [sel, setSel] = useState(null);
  const chips = html`<div class="scroll-x cat-row">
    <button class=${'chip' + (f.uses.length === 0 ? ' on' : '')} onClick=${() => setF({ ...f, uses: [] })}><${Icon} n="grid" cls="sm" />All</button>
    ${USES.map(u => html`<button key=${u.id} class=${'chip' + (f.uses.includes(u.id) ? ' on' : '')} onClick=${() => setF({ ...f, uses: toggleIn(f.uses, u.id) })}><${Icon} n=${u.icon} cls="sm" />${u.label}</button>`)}
  </div>`;

  if (mode === 'map') {
    const s = sel && list.find(l => l.id === sel);
    return html`<div class="map-wrap fade">
      <svg class="map" viewBox="20 90 360 560" preserveAspectRatio="xMidYMid slice" onClick=${() => setSel(null)}>
        <${MapBase} /><${YouDot} />
        ${list.filter(l => l.id !== sel).map(l => html`<${Pin} key=${l.id} l=${l} on=${false} onClick=${(e) => { e.stopPropagation(); setSel(l.id); }} />`)}
        ${s && html`<${Pin} l=${s} on=${true} onClick=${(e) => e.stopPropagation()} />`}
      </svg>
      <div class="map-top"><${SearchPill} f=${f} onOpen=${openFilters} />
        <div class="scroll-x cat-row" style=${{ margin: '10px -16px 0', padding: '2px 16px 4px' }}>
          ${USES.map(u => html`<button key=${u.id} class=${'chip' + (f.uses.includes(u.id) ? ' on' : '')} style=${{ boxShadow: 'var(--shadow)' }} onClick=${() => setF({ ...f, uses: toggleIn(f.uses, u.id) })}>${u.label}</button>`)}
        </div>
      </div>
      ${s ? html`<button class="map-card" onClick=${() => openListing(s.id)}>
          <div class="thumb"><${Art} a=${s.art} /></div>
          <div class="body"><span class="stars tnum" style=${{ fontSize: '13px' }}><${Icon} n="star" fill=${true} />${s.rating.toFixed(2)} (${s.reviews})</span>
            <h3>${s.title}</h3><p class="muted" style=${{ fontSize: '13.5px' }}>${PRIVACY[s.privacy].short} · up to ${s.cap} · ${s.mi} mi</p>
            <p class="tnum" style=${{ fontSize: '14.5px' }}>${s.price === 0 ? html`<b>Free</b>` : html`<b>$${s.price}</b> / hour`}</p></div>
        </button>`
        : html`<div class="map-card" style=${{ justifyContent: 'center', padding: '14px', fontSize: '14px' }}><span class="muted">${list.length} quiet spaces in Lexington · tap a price to preview</span></div>`}
      <button class="fab" onClick=${() => setMode('list')}><${Icon} n="list" cls="sm" />List</button>
    </div>`;
  }

  return html`<div class="screen fade" onScroll=${(e) => setScrolled(e.currentTarget.scrollTop > 4)}>
    <header class=${'ex-head' + (scrolled ? ' shadowed' : '')}>
      <div class="ex-top"><span class="wordmark"><${Logo} />quiet space</span><span class="proto-pill">PROTOTYPE v2</span></div>
      <${SearchPill} f=${f} onOpen=${openFilters} />
      ${chips}
    </header>
    <div class="list-meta"><span class="tnum">${list.length} ${list.length === 1 ? 'space' : 'spaces'} near you</span>
      <button class="row" style=${{ gap: '8px', fontWeight: 600, color: 'var(--ink)' }} onClick=${() => setF({ ...f, when: f.when === 'now' ? 'any' : 'now' })}>Open right now <span class=${'switch' + (f.when === 'now' ? ' on' : '')} style=${{ transform: 'scale(.8)' }}></span></button>
    </div>
    ${list.length === 0
      ? html`<div class="empty"><${Icon} n="search" cls="lg" /><h3>No spaces match all of that yet</h3><p>Try removing a filter or two. More hosts are joining in Lexington every week.</p><button class="btn sm" onClick=${() => setF(DEFAULT_F)}>Clear filters</button></div>`
      : html`<div class="cards">${list.map(l => html`<${ListingCard} key=${l.id} l=${l} saved=${saved.includes(l.id)} onSave=${() => toggleSave(l.id)} onOpen=${() => openListing(l.id)} />`)}</div>`}
    <button class="fab" onClick=${() => setMode('map')}><${Icon} n="map" cls="sm" />Map</button>
  </div>`;
}

/* ---------------- filters sheet ---------------- */
function Toggle({ on, onClick, label, sub }) {
  return html`<button class="switch-row" style=${{ width: '100%', textAlign: 'left' }} onClick=${onClick} role="switch" aria-checked=${on}>
    <span><b>${label}</b>${sub && html`<span>${sub}</span>`}</span><span class=${'switch' + (on ? ' on' : '')}></span></button>`;
}
function Choice({ opts, val, set }) {
  return html`<div class="wrap">${opts.map(([k, label]) => html`<button key=${k} class=${'chip' + (val === k ? ' on' : '')} onClick=${() => set(k)} aria-pressed=${val === k}>${label}</button>`)}</div>`;
}
function Stepper({ label, sub, val, min, max, set }) {
  return html`<div class="spread" style=${{ padding: '6px 0' }}><div><b style=${{ fontSize: '15px' }}>${label}</b><p class="muted" style=${{ fontSize: '13px', marginTop: '2px' }}>${sub}</p></div>
    <div class="stepper"><button disabled=${val <= min} onClick=${() => set(val - 1)} aria-label=${'Fewer ' + label}><${Icon} n="minus" cls="sm" /></button><b>${val}</b><button disabled=${val >= max} onClick=${() => set(val + 1)} aria-label=${'More ' + label}><${Icon} n="plus" cls="sm" /></button></div></div>`;
}
function FiltersSheet({ f, setF, onClose }) {
  const [d, setD] = useState(f);
  const n = applyFilters(d).length;
  const buckets = [0, 5, 10, 15, 20, 25, 30, 35].map(b => LISTINGS.filter(l => (b === 0 ? l.price < 5 : l.price >= b && l.price < b + 5)).length);
  const maxB = Math.max(...buckets);
  const set = (k, v) => setD({ ...d, [k]: v });
  const RATINGS = [[0, 'Any'], [4.8, '4.8 and up'], [4.9, '4.9 and up']];
  return html`<${Fragment}>
    <div class="scrim" onClick=${onClose}></div>
    <div class="sheet" role="dialog" aria-label="Filters">
      <div class="sheet-head"><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button><h2>Filters</h2><span></span></div>
      <div class="sheet-body">
        <div class="f-sec"><h3>Location</h3><p class="hint">Lexington, KY. Pick neighborhoods or stay close to you.</p>
          <div class="wrap"><button class=${'chip' + (d.hoods.length === 0 ? ' on' : '')} onClick=${() => set('hoods', [])}><${Icon} n="pin" cls="sm" />Anywhere</button>
            ${HOOD_LIST.map(h => html`<button key=${h} class=${'chip' + (d.hoods.includes(h) ? ' on' : '')} onClick=${() => set('hoods', toggleIn(d.hoods, h))}>${h}</button>`)}</div>
          <div class="spread" style=${{ marginTop: '18px' }}><b style=${{ fontSize: '15px' }}>Distance from you</b><b class="tnum">${d.dist >= 25 ? 'Any distance' : 'Within ' + d.dist + ' mi'}</b></div>
          <input id="dist" type="range" min="1" max="25" step="1" value=${d.dist} onChange=${(e) => set('dist', +e.target.value)} aria-label="Maximum distance in miles" /></div>
        <div class="f-sec"><h3>Availability</h3><p class="hint">Each host sets their own open hours.</p>
          <${Choice} opts=${WHEN} val=${d.when} set=${(v) => set('when', v)} /></div>
        <div class="f-sec"><h3>Who's coming</h3><p class="hint" style=${{ marginBottom: '6px' }}>Most spaces are made for 1 to 3 people.</p>
          <${Stepper} label="Adults" sub="Ages 13 and up" val=${d.adults} min=${1} max=${4 - d.kids} set=${(v) => set('adults', v)} />
          <${Stepper} label="Children" sub="Only spaces where the host allows children" val=${d.kids} min=${0} max=${4 - d.adults} set=${(v) => set('kids', v)} /></div>
        <div class="f-sec"><h3>Intended use</h3><p class="hint">Hosts choose what their space can be used for.</p>
          <div class="wrap">${USES.map(u => html`<button key=${u.id} class=${'chip' + (d.uses.includes(u.id) ? ' on' : '')} onClick=${() => set('uses', toggleIn(d.uses, u.id))}><${Icon} n=${u.icon} cls="sm" />${u.label}</button>`)}</div></div>
        <div class="f-sec"><h3>Quietness</h3><p class="hint">Every host measures their space. 30 dB is about a whisper.</p>
          <${Choice} opts=${[['any', 'Any'], ['quiet', 'Quiet · under 30 dB'], ['very', 'Very quiet · under 25 dB']]} val=${d.quiet} set=${(v) => set('quiet', v)} /></div>
        <div class="f-sec"><h3>Privacy</h3><p class="hint">How much of the space is yours.</p>
          <div class="sound-opts">${[['any', 'Any', 'Show every space', 'grid'], ['private', 'Private room or better', 'Your own room. Others may be in the building.', 'lock'], ['entire', 'Entire space only', 'Nobody else there while you are.', 'key']].map(([k, t, s, i]) => html`
            <button key=${k} class=${'sound-opt' + (d.privacy === k ? ' on' : '')} onClick=${() => set('privacy', k)}><${Icon} n=${i} /><span><b>${t}</b><span>${s}</span></span></button>`)}</div></div>
        <div class="f-sec"><h3>Type of space</h3><p class="hint">Where it is and what it looks like.</p>
          <div class="type-grid">${TYPES.map(t => { const ex = LISTINGS.find(l => l.type === t.id);
            return html`<button key=${t.id} class=${'type-tile' + (d.types.includes(t.id) ? ' on' : '')} onClick=${() => set('types', toggleIn(d.types, t.id))}><div class="sw"><${Art} a=${ex.art} /></div>${t.label}</button>`; })}</div></div>
        <div class="f-sec"><h3>Indoor or outdoor</h3><p class="hint">Porches, gardens and decks count as outdoor access.</p>
          <${Choice} opts=${[['any', 'Either'], ['indoor', 'Indoor'], ['outdoor', 'Outdoor access']]} val=${d.setting} set=${(v) => set('setting', v)} /></div>
        <div class="f-sec"><div class="spread"><h3>Price per hour</h3><b class="tnum">${d.freeOnly ? 'Free only' : d.maxPrice >= 40 ? 'Any price' : 'Up to $' + d.maxPrice}</b></div>
          <p class="hint">Most Lexington spaces are $20 to $30 an hour, and some are free.</p>
          <div class="hist">${buckets.map((c, i) => html`<i key=${i} class=${(i * 5 > d.maxPrice || (d.freeOnly && i > 0)) ? 'off' : ''} style=${{ height: (c / maxB) * 100 + '%', minHeight: c ? '6px' : '2px' }}></i>`)}</div>
          <input id="price" type="range" min="0" max="40" step="1" value=${d.maxPrice} onChange=${(e) => set('maxPrice', +e.target.value)} aria-label="Maximum price per hour" />
          <div class="spread muted tnum" style=${{ fontSize: '12.5px' }}><span>Free</span><span>$40+</span></div>
          <${Toggle} on=${d.freeOnly} onClick=${() => set('freeOnly', !d.freeOnly)} label="Free spaces only" sub="Community rooms, chapels and generous hosts" /></div>
        <div class="f-sec"><h3>Amenities</h3>
          <div class="checks">${AMEN_FILTER.map(a => html`<button key=${a} class=${'check' + (d.amen.includes(a) ? ' on' : '')} onClick=${() => set('amen', toggleIn(d.amen, a))}>${AMEN[a][0]}<span class="box">${d.amen.includes(a) && html`<${Icon} n="check" cls="sm" />`}</span></button>`)}</div></div>
        <div class="f-sec"><h3>Guest reviews</h3><p class="hint">How guests rated the space.</p>
          <${Choice} opts=${RATINGS} val=${d.rGuest} set=${(v) => set('rGuest', v)} />
          <h3 style=${{ marginTop: '20px' }}>Host reviews</h3><p class="hint">How guests rated the host.</p>
          <${Choice} opts=${RATINGS} val=${d.rHost} set=${(v) => set('rHost', v)} /></div>
        <div class="f-sec" style=${{ borderBottom: 0 }}><h3>Booking</h3>
          <${Toggle} on=${d.instant} onClick=${() => set('instant', !d.instant)} label="Instant book" sub="Book without waiting for the host to approve" /></div>
      </div>
      <div class="sheet-foot pad-home"><button class="link" onClick=${() => setD(DEFAULT_F)}>Clear all</button>
        <button class="btn" disabled=${n === 0} onClick=${() => { setF(d); onClose(); }}>${n === 0 ? 'No matches' : `Show ${n} ${n === 1 ? 'space' : 'spaces'}`}</button></div>
    </div>
  <//>`;
}
