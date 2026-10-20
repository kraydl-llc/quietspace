/* ---------------- profile + host ---------------- */
const PALETTES = [
  { id: 'sage', name: 'A · Sage', sw: ['#3D6B58', '#93C4AC', '#F4F6F2'] },
  { id: 'dusk', name: 'B · Dusk', sw: ['#46598F', '#AAB7EA', '#F2F3F8'] },
  { id: 'plum', name: 'C · Plum', sw: ['#7A4870', '#DDAED3', '#F7F2F5'] },
];
function PalettePicker({ palette, setPalette }) {
  return html`<div class="palettes">${PALETTES.map(p => html`<button key=${p.id} class=${'pal' + (palette === p.id ? ' on' : '')} onClick=${() => setPalette(p.id)} aria-pressed=${palette === p.id}>
    <span class="sw">${p.sw.map(c => html`<i key=${c} style=${{ background: c }}></i>`)}</span>${p.name}</button>`)}</div>`;
}
function Profile({ palette, setPalette, openHost, toast, showWelcome }) {
  return html`<div class="screen fade"><div class="page-h"><h1>Profile</h1></div>
    <div class="prof"><span class="avatar" style=${{ background: 'var(--accent)', color: 'var(--on-accent)' }}>C</span><div><h2>Cassie</h2><p class="muted">Guest · Lexington, KY</p></div></div>
    <div class="panel"><div class="spread"><h3>Your guest rating</h3><span class="stars tnum"><${Icon} n="star" fill=${true} />4.9</span></div>
      <p class="muted" style=${{ fontSize: '14px', marginTop: '6px', lineHeight: 1.45 }}>From 7 host reviews. Hosts see this before they accept a request.</p>
      <div class="wrap" style=${{ marginTop: '12px' }}>${['Respectful', 'Left it tidy', 'On time'].map(t => html`<span key=${t} class="chip on" style=${{ height: '32px', fontSize: '13px' }}><${Icon} n="check" cls="sm" />${t}</span>`)}</div></div>
    <button class="host-cta" onClick=${openHost}>
      <svg class="waves" width="170" height="170" viewBox="0 0 32 32" aria-hidden="true"><path d="M15.5 11.5a6.4 6.4 0 0 1 0 9M19.5 8.5a10.6 10.6 0 0 1 0 15M23.5 5.5a14.8 14.8 0 0 1 0 21" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" /></svg>
      <h3>Have a quiet room?</h3><p>See what hosting on Quiet Space looks like and what you could earn.</p></button>
    <div class="panel"><h3>Brand direction</h3><p class="muted" style=${{ fontSize: '14px', marginTop: '6px', lineHeight: 1.45 }}>Three color options for the brand. Tap one and the whole app changes.</p>
      <${PalettePicker} palette=${palette} setPalette=${setPalette} /></div>
    <div class="menu">${[['card', 'Payments & payouts'], ['bell', 'Notifications'], ['shield', 'Privacy & safety'], ['info', 'Help center']].map(([i, t]) => html`<button key=${t} onClick=${() => toast(t + ' is part of the full build')}><${Icon} n=${i} />${t}<${Icon} n="next" cls="sm" /></button>`)}
      <button onClick=${showWelcome}><${Icon} n="sun" />About this prototype<${Icon} n="next" cls="sm" /></button></div>
    <p class="muted" style=${{ textAlign: 'center', fontSize: '12.5px', padding: '4px 20px 30px' }}>Prototype by Kraydl · sample data only</p>
  </div>`;
}
function Host({ onBack, toast }) {
  const [hrs, setHrs] = useState(10);
  const [rate, setRate] = useState(24);
  const monthly = Math.round(hrs * rate * 4.33 * 0.97);
  return html`<div class="screen enter">
    <div class="chat-head" style=${{ position: 'sticky', top: 0, zIndex: 3 }}><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onBack} aria-label="Back"><${Icon} n="back" /></button><b style=${{ fontSize: '17px' }}>Host on Quiet Space</b></div>
    <div class="pad" style=${{ paddingTop: '22px', paddingBottom: '8px' }}>
      <p class="eyebrow">For hosts in Lexington</p>
      <h1 class="display" style=${{ fontSize: '30px', lineHeight: 1.15, marginTop: '8px' }}>Your quiet room could be someone's whole afternoon.</h1>
      <p class="muted" style=${{ marginTop: '10px', lineHeight: 1.55, fontSize: '15px' }}>Guest houses, yoga studios, spare rooms, chapels. If it's calm, people need it, and you set when and how it's used.</p></div>
    <div class="panel" style=${{ marginTop: '18px' }}><p class="eyebrow">Earnings estimate</p>
      <div class="big-num" style=${{ marginTop: '10px' }}>$${monthly.toLocaleString()}<span class="muted" style=${{ fontFamily: 'var(--font-body)', fontSize: '15px' }}> / month</span></div>
      <div style=${{ marginTop: '16px' }}><div class="spread" style=${{ fontSize: '14px' }}><span>Hours booked per week</span><b class="tnum">${hrs}</b></div>
        <input id="hrs" type="range" min="2" max="40" value=${hrs} onChange=${(e) => setHrs(+e.target.value)} aria-label="Hours per week" /></div>
      <div><div class="spread" style=${{ fontSize: '14px' }}><span>Your hourly rate</span><b class="tnum">${rate === 0 ? 'Free' : '$' + rate}</b></div>
        <input id="rate" type="range" min="0" max="40" value=${rate} onChange=${(e) => setRate(+e.target.value)} aria-label="Hourly rate" /></div>
      <p class="muted" style=${{ fontSize: '12.5px' }}>After a 3% host fee. Offering your space for free? It still shows up, with a donations option.</p></div>
    <div class="section" style=${{ borderTop: 0 }}><h2>How hosting works</h2><div class="steps">
      ${[['Measure your quiet', 'Our in-app sound check records your room\'s ambient level in decibels, so guests know exactly what to expect.'],
        ['Say what it\'s for', 'Choose the uses you\'re happy with (rest, prayer, emotional release, small circles) and how much sound is OK.'],
        ['Get booked and paid', 'Guests book by the hour. Payment is held securely and paid out to you after each visit.']].map(([t, d], i) => html`<div class="step" key=${i}><span class="n">${i + 1}</span><div><b>${t}</b><p>${d}</p></div></div>`)}</div></div>
    <div class="section"><h2>Your host dashboard</h2><p class="muted" style=${{ fontSize: '13px', marginTop: '-6px', marginBottom: '14px' }}>Preview with sample numbers</p>
      <div class="kpis"><div class="kpi"><b>3</b><span>Visits today</span></div><div class="kpi"><b>$412</b><span>This month</span></div><div class="kpi"><b>4.96</b><span>Rating</span></div></div>
      <div class="stack" style=${{ marginTop: '14px' }}>${[['Ava', '#8E7AA8', '10:00 AM', 'Rest · 1 hr', '4.9'], ['Marcus', '#5E8C7C', '1:00 PM', 'Meditate · 2 hrs', '5.0'], ['Leah', '#A86A7E', '6:00 PM', 'Shared: “Cry it out”', '4.8']].map(([n, c, t, w, r]) => html`
        <div key=${n} class="host-row" style=${{ padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--surface)' }}><span class="avatar" style=${{ background: c, width: '38px', height: '38px', fontSize: '14px' }}>${n[0]}</span>
          <span style=${{ flex: 1 }}><b>${n} · ${t}</b><span>${w}</span></span><span class="stars tnum" style=${{ fontSize: '13px' }}><${Icon} n="star" fill=${true} />${r}</span></div>`)}</div>
      <p class="muted" style=${{ fontSize: '13px', marginTop: '12px', lineHeight: 1.45 }}>You see every guest's rating from other hosts before you accept.</p></div>
    <div class="pad" style=${{ paddingBottom: '34px' }}><button class="btn block" onClick=${() => toast('Host sign-up is the next flow we\'ll design together')}>Start your listing</button></div>
  </div>`;
}

/* ---------------- welcome + desktop notes ---------------- */
const TRY = [
  ['sliders', 'Open Filters and try “Emotional release” with “Loud is welcome”.'],
  ['map', 'Tap Map to see spaces around Lexington.'],
  ['cal', 'Open a space, pick a time and book it. The checkout works end to end.'],
  ['chat', 'Message your host from the confirmation screen.'],
  ['star', 'Leave a review under Bookings → Past.'],
  ['home', 'Peek at the host side under Profile → Have a quiet room?'],
];
function Welcome({ onClose, palette, setPalette }) {
  return html`<${Fragment}><div class="scrim" onClick=${onClose}></div>
    <div class="sheet welcome" role="dialog" aria-label="Welcome">
      <div class="sheet-body">
        <div class="row" style=${{ marginTop: '18px' }}><${Logo} size=${34} /><span class="eyebrow">Prototype for Cassie</span></div>
        <h2>Hi Cassie, here's Quiet Space.</h2>
        <p>We built this clickable prototype from our call on October 16. It's the guest side of the app, laid out like Airbnb but made for quiet. Every space, host and review here is sample content set in Lexington.</p>
        <ul class="try">${TRY.map(([i, t]) => html`<li key=${i}><${Icon} n=${i} cls="sm" /><span>${t}</span></li>`)}</ul>
        <p style=${{ marginTop: '16px' }}><b style=${{ color: 'var(--ink)' }}>Pick a color direction</b> (you can change it later in Profile):</p>
        <${PalettePicker} palette=${palette} setPalette=${setPalette} />
      </div>
      <div class="sheet-foot pad-home" style=${{ borderTop: 0 }}><button class="btn block" onClick=${onClose}>Start exploring</button></div>
    </div><//>`;
}
function Notes({ palette, setPalette }) {
  return html`<aside class="notes">
    <div class="brandline"><span class="wordmark"><${Logo} size=${30} />quiet space</span></div>
    <p class="eyebrow">Prototype v1 · Oct 20, 2026</p>
    <h2 style=${{ marginTop: '10px' }}>Find a quiet place to rest, pray, cry or just be.</h2>
    <p>The guest side of Quiet Space for Lexington, built from our October 16 call: Airbnb-style search with quiet-specific filters, a map, hourly booking with in-app payment, messaging, and reviews on both sides.</p>
    <p class="eyebrow np">Things to try</p>
    <ol>${TRY.map(([, t], i) => html`<li key=${i}>${t}</li>`)}</ol>
    <p class="eyebrow np">Brand direction</p>
    <${PalettePicker} palette=${palette} setPalette=${setPalette} />
    <p class="by">Prepared by Kraydl for Cassie Cunningham. Open this link on your phone for the full app feel.</p>
  </aside>`;
}

/* ---------------- app shell ---------------- */
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };
function StatusBar() {
  return html`<div class="statusbar"><span>9:41</span><span class="sb-icons">
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" fill="currentColor"><path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.4A10.6 10.6 0 0 0 8 .2 10.6 10.6 0 0 0 .5 3.3l1.3 1.4A8.7 8.7 0 0 1 8 2.2zm0 3.9c1.4 0 2.6.5 3.6 1.4l1.3-1.4A7 7 0 0 0 8 4.1a7 7 0 0 0-4.9 2l1.3 1.4c1-.9 2.2-1.4 3.6-1.4zM8 12l2.3-2.4a3.2 3.2 0 0 0-4.6 0z" /></svg>
    <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" /><rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".45" /></svg>
  </span></div>`;
}
function App() {
  const [tab, setTab] = useState('explore');
  const [mode, setMode] = useState('list');
  const [stack, setStack] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [f, setF] = useState(DEFAULT_F);
  const [saved, setSaved] = useState([1, 5]);
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [threads, setThreads] = useState(INIT_THREADS);
  const [palette, setPaletteRaw] = useState(() => store.get('qs-palette') || 'sage');
  const [welcome, setWelcome] = useState(() => !store.get('qs-welcomed'));
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToastMsg(null), 2600); return () => clearTimeout(t); }, [toastMsg]);
  const setPalette = (p) => { setPaletteRaw(p); store.set('qs-palette', p); };
  const closeWelcome = () => { setWelcome(false); store.set('qs-welcomed', '1'); };
  const toast = (m) => setToastMsg(m);
  const push = (s) => setStack(st => [...st, s]);
  const pop = () => setStack(st => st.slice(0, -1));
  const toggleSave = (id) => { const was = saved.includes(id); setSaved(toggleIn(saved, id)); toast(was ? 'Removed from Saved' : 'Saved. Find it under the Saved tab'); };
  const goTab = (t) => { setStack([]); setSheet(null); setTab(t); setThreads(ts => t === 'inbox' ? ts : ts); };
  const threadFor = (lid) => {
    const l = BY_ID[lid]; const id = 't' + lid;
    if (!threads.find(t => t.id === id)) setThreads(ts => [{ id, lid, name: l.host.name, color: l.host.color, sub: l.title, unread: false, msgs: [{ me: false, text: `Hi, I'm ${l.host.name}. Let me know if you have any questions about the space before your visit.` }] }, ...ts]);
    return id;
  };
  const openThread = (id) => { setThreads(ts => ts.map(t => t.id === id ? { ...t, unread: false } : t)); push({ kind: 'chat', id }); };
  const sendMsg = (id, m) => setThreads(ts => ts.map(t => t.id === id ? { ...t, msgs: [...t.msgs, m], when: 'Now' } : t));
  const unread = threads.some(t => t.unread);

  const top = stack[stack.length - 1];
  let body;
  if (top && top.kind === 'listing') {
    const l = BY_ID[top.id];
    body = html`<${Listing} key=${'l' + l.id} l=${l} saved=${saved.includes(l.id)} onSave=${() => toggleSave(l.id)} onBack=${pop} onBook=${() => setSheet({ kind: 'book', id: l.id })} toast=${toast} />`;
  } else if (top && top.kind === 'checkout') {
    const l = BY_ID[top.id];
    body = html`<${Checkout} l=${l} b=${top.b} onBack=${pop} onPaid=${(extra) => {
      const nb = { id: 'b' + Date.now(), lid: l.id, ...top.b, status: l.instant ? 'Confirmed' : 'Awaiting host' };
      setBookings(bs => [nb, ...bs]);
      const tid = threadFor(l.id);
      if (extra.msg.trim()) setTimeout(() => sendMsg(tid, { me: true, text: extra.msg.trim() }), 0);
      setStack(st => [...st.slice(0, -1), { kind: 'done', id: l.id, b: top.b }]);
    }} />`;
  } else if (top && top.kind === 'done') {
    const l = BY_ID[top.id];
    body = html`<${Confirmed} l=${l} b=${top.b} onMessage=${() => { const id = threadFor(l.id); setStack([]); setTab('inbox'); setTimeout(() => push({ kind: 'chat', id }), 0); }}
      onTrips=${() => goTab('trips')} onExplore=${() => goTab('explore')} />`;
  } else if (top && top.kind === 'chat') {
    const t = threads.find(x => x.id === top.id);
    body = t ? html`<${Chat} t=${t} onBack=${pop} onSend=${sendMsg} />` : null;
  } else if (top && top.kind === 'review') {
    const b = bookings.find(x => x.id === top.id);
    body = html`<${Review} b=${b} onBack=${pop} onSubmit=${() => { setBookings(bs => bs.map(x => x.id === b.id ? { ...x, reviewed: true } : x)); pop(); toast('Thanks! Your review goes live once your host reviews you too.'); }} />`;
  } else if (top && top.kind === 'host') {
    body = html`<${Host} onBack=${pop} toast=${toast} />`;
  } else if (tab === 'explore') {
    body = html`<${Explore} f=${f} setF=${setF} openFilters=${() => setSheet({ kind: 'filters' })} openListing=${(id) => push({ kind: 'listing', id })} saved=${saved} toggleSave=${toggleSave} mode=${mode} setMode=${setMode} />`;
  } else if (tab === 'saved') {
    body = html`<${Saved} saved=${saved} toggleSave=${toggleSave} openListing=${(id) => push({ kind: 'listing', id })} goExplore=${() => goTab('explore')} />`;
  } else if (tab === 'trips') {
    body = html`<${Trips} bookings=${bookings} openListing=${(id) => push({ kind: 'listing', id })} openReview=${(id) => push({ kind: 'review', id })} openChat=${(lid) => openThread(threadFor(lid))} toast=${toast} />`;
  } else if (tab === 'inbox') {
    body = html`<${Inbox} threads=${threads} openThread=${openThread} />`;
  } else {
    body = html`<${Profile} palette=${palette} setPalette=${setPalette} openHost=${() => push({ kind: 'host' })} toast=${toast} showWelcome=${() => setWelcome(true)} />`;
  }
  const showTabs = !top || top.kind === 'host';
  const TABS = [['explore', 'search', 'Explore'], ['saved', 'heart', 'Saved'], ['trips', 'cal', 'Bookings'], ['inbox', 'chat', 'Inbox'], ['profile', 'user', 'Profile']];

  return html`<div class="stage" data-palette=${palette}>
    <div class="app device">
      <div class="viewport">
        <${StatusBar} />
        <div class="main">
          ${body}
          ${sheet && sheet.kind === 'filters' && html`<${FiltersSheet} f=${f} setF=${setF} onClose=${() => setSheet(null)} />`}
          ${sheet && sheet.kind === 'book' && html`<${BookingSheet} l=${BY_ID[sheet.id]} onClose=${() => setSheet(null)} onContinue=${(b) => { setSheet(null); push({ kind: 'checkout', id: sheet.id, b }); }} />`}
          ${welcome && html`<${Welcome} onClose=${closeWelcome} palette=${palette} setPalette=${setPalette} />`}
          ${toastMsg && html`<div class="toast" role="status"><${Icon} n="check" cls="sm" />${toastMsg}</div>`}
        </div>
        ${showTabs && html`<nav class="tabbar">${TABS.map(([id, ic, label]) => html`<button key=${id} class=${'tab' + (tab === id && !top ? ' on' : '')} onClick=${() => goTab(id)}>
          <${Icon} n=${ic} />${label}${id === 'inbox' && unread && html`<span class="dot"></span>`}</button>`)}</nav>`}
      </div>
      <div class="homebar"></div>
    </div>
    <${Notes} palette=${palette} setPalette=${setPalette} />
  </div>`;
}
ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
