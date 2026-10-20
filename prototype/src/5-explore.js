/* ---------------- filters ---------------- */
const DEFAULT_F = { guests: 1, uses: [], sound: 'any', types: [], maxPrice: 40, freeOnly: false, dist: 25, amen: [], instant: false, now: false };
const applyFilters = (f) => LISTINGS.filter(l =>
  l.cap >= f.guests && f.uses.every(u => l.uses.includes(u)) && (f.sound === 'any' || l.sound === f.sound) &&
  (!f.types.length || f.types.includes(l.type)) && l.price <= f.maxPrice && (!f.freeOnly || l.price === 0) &&
  l.mi <= f.dist && f.amen.every(a => l.amen.includes(a)) && (!f.instant || l.instant) && (!f.now || l.now));
const countActive = (f) => (f.guests > 1) + f.uses.length + (f.sound !== 'any') + f.types.length + (f.maxPrice < 40) + f.freeOnly + (f.dist < 25) + f.amen.length + f.instant + f.now;
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
      <p class="meta tnum">Up to ${l.cap} ${l.cap > 1 ? 'people' : 'person'} · ${l.db} dB ambient</p>
      <p class="price tnum">${l.price === 0 ? html`<b>Free</b> · donations welcome` : html`<b>$${l.price}</b> / hour`}</p>
    </button>
  </article>`;
}

function SearchPill({ f, onOpen }) {
  const n = countActive(f);
  return html`<button class="search" onClick=${onOpen}>
    <${Icon} n="search" />
    <span class="q"><b>Where do you need quiet?</b><span>Lexington · Today · ${f.guests} ${f.guests > 1 ? 'people' : 'guest'}${f.dist < 25 ? ` · within ${f.dist} mi` : ''}</span></span>
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
            <h3>${s.title}</h3><p class="muted" style=${{ fontSize: '13.5px' }}>${SOUND[s.sound].short} · up to ${s.cap} · ${s.mi} mi</p>
            <p class="tnum" style=${{ fontSize: '14.5px' }}>${s.price === 0 ? html`<b>Free</b>` : html`<b>$${s.price}</b> / hour`}</p></div>
        </button>`
        : html`<div class="map-card" style=${{ justifyContent: 'center', padding: '14px', fontSize: '14px' }}><span class="muted">${list.length} quiet spaces in Lexington · tap a price to preview</span></div>`}
      <button class="fab" onClick=${() => setMode('list')}><${Icon} n="list" cls="sm" />List</button>
    </div>`;
  }

  return html`<div class="screen fade" onScroll=${(e) => setScrolled(e.currentTarget.scrollTop > 4)}>
    <header class=${'ex-head' + (scrolled ? ' shadowed' : '')}>
      <div class="ex-top"><span class="wordmark"><${Logo} />quiet space</span><span class="proto-pill">PROTOTYPE</span></div>
      <${SearchPill} f=${f} onOpen=${openFilters} />
      ${chips}
    </header>
    <div class="list-meta"><span class="tnum">${list.length} ${list.length === 1 ? 'space' : 'spaces'} near you</span>
      <button class="row" style=${{ gap: '8px', fontWeight: 600, color: 'var(--ink)' }} onClick=${() => setF({ ...f, now: !f.now })}>Open right now <span class=${'switch' + (f.now ? ' on' : '')} style=${{ transform: 'scale(.8)' }}></span></button>
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
function FiltersSheet({ f, setF, onClose }) {
  const [d, setD] = useState(f);
  const n = applyFilters(d).length;
  const buckets = [0, 5, 10, 15, 20, 25, 30, 35].map(b => LISTINGS.filter(l => (b === 0 ? l.price < 5 : l.price >= b && l.price < b + 5)).length);
  const maxB = Math.max(...buckets);
  const set = (k, v) => setD({ ...d, [k]: v });
  return html`<${Fragment}>
    <div class="scrim" onClick=${onClose}></div>
    <div class="sheet" role="dialog" aria-label="Filters">
      <div class="sheet-head"><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button><h2>Filters</h2><span></span></div>
      <div class="sheet-body">
        <div class="f-sec"><div class="spread"><div><h3>Who's coming</h3><p class="hint" style=${{ margin: 0 }}>Most spaces are made for 1 to 3 people</p></div>
          <div class="stepper"><button disabled=${d.guests <= 1} onClick=${() => set('guests', d.guests - 1)} aria-label="Fewer"><${Icon} n="minus" cls="sm" /></button><b>${d.guests}</b><button disabled=${d.guests >= 4} onClick=${() => set('guests', d.guests + 1)} aria-label="More"><${Icon} n="plus" cls="sm" /></button></div></div></div>
        <div class="f-sec"><h3>What's it for?</h3><p class="hint">Hosts choose what their space can be used for.</p>
          <div class="wrap">${USES.map(u => html`<button key=${u.id} class=${'chip' + (d.uses.includes(u.id) ? ' on' : '')} onClick=${() => set('uses', toggleIn(d.uses, u.id))}><${Icon} n=${u.icon} cls="sm" />${u.label}</button>`)}</div></div>
        <div class="f-sec"><h3>How much sound?</h3><p class="hint">Need to be loud, or need it silent? Match with the right host.</p>
          <div class="sound-opts">
            <button class=${'sound-opt' + (d.sound === 'any' ? ' on' : '')} onClick=${() => set('sound', 'any')}><${Icon} n="grid" /><span><b>Any</b><span>Show every space</span></span></button>
            ${Object.entries(SOUND).map(([k, s]) => html`<button key=${k} class=${'sound-opt' + (d.sound === k ? ' on' : '')} onClick=${() => set('sound', k)}><${Icon} n=${s.icon} /><span><b>${s.label}</b><span>${s.note}</span></span></button>`)}
          </div></div>
        <div class="f-sec"><h3>Type of space</h3><p class="hint">Where it is and what it looks like.</p>
          <div class="type-grid">${TYPES.map(t => { const ex = LISTINGS.find(l => l.type === t.id);
            return html`<button key=${t.id} class=${'type-tile' + (d.types.includes(t.id) ? ' on' : '')} onClick=${() => set('types', toggleIn(d.types, t.id))}><div class="sw"><${Art} a=${ex.art} /></div>${t.label}</button>`; })}</div></div>
        <div class="f-sec"><div class="spread"><h3>Price per hour</h3><b class="tnum">${d.freeOnly ? 'Free only' : d.maxPrice >= 40 ? 'Any price' : 'Up to $' + d.maxPrice}</b></div>
          <p class="hint">Most Lexington spaces are $20 to $30 an hour, and some are free.</p>
          <div class="hist">${buckets.map((c, i) => html`<i key=${i} class=${(i * 5 > d.maxPrice || (d.freeOnly && i > 0)) ? 'off' : ''} style=${{ height: (c / maxB) * 100 + '%', minHeight: c ? '6px' : '2px' }}></i>`)}</div>
          <input id="price" type="range" min="0" max="40" step="1" value=${d.maxPrice} onChange=${(e) => set('maxPrice', +e.target.value)} aria-label="Maximum price per hour" />
          <div class="spread muted tnum" style=${{ fontSize: '12.5px' }}><span>Free</span><span>$40+</span></div>
          <${Toggle} on=${d.freeOnly} onClick=${() => set('freeOnly', !d.freeOnly)} label="Free spaces only" sub="Community rooms, chapels and generous hosts" /></div>
        <div class="f-sec"><div class="spread"><h3>Distance</h3><b class="tnum">${d.dist >= 25 ? 'Anywhere' : 'Within ' + d.dist + ' mi'}</b></div>
          <input id="dist" type="range" min="1" max="25" step="1" value=${d.dist} onChange=${(e) => set('dist', +e.target.value)} aria-label="Maximum distance in miles" /></div>
        <div class="f-sec"><h3>Comforts</h3>
          <div class="checks">${AMEN_FILTER.map(a => html`<button key=${a} class=${'check' + (d.amen.includes(a) ? ' on' : '')} onClick=${() => set('amen', toggleIn(d.amen, a))}>${AMEN[a][0]}<span class="box">${d.amen.includes(a) && html`<${Icon} n="check" cls="sm" />`}</span></button>`)}</div></div>
        <div class="f-sec" style=${{ borderBottom: 0 }}><h3>Booking</h3>
          <${Toggle} on=${d.instant} onClick=${() => set('instant', !d.instant)} label="Instant book" sub="Book without waiting for the host to approve" />
          <${Toggle} on=${d.now} onClick=${() => set('now', !d.now)} label="Open right now" sub="Spaces with a free slot in the next hour" /></div>
      </div>
      <div class="sheet-foot pad-home"><button class="link" onClick=${() => setD(DEFAULT_F)}>Clear all</button>
        <button class="btn" disabled=${n === 0} onClick=${() => { setF(d); onClose(); }}>${n === 0 ? 'No matches' : `Show ${n} ${n === 1 ? 'space' : 'spaces'}`}</button></div>
    </div>
  <//>`;
}
