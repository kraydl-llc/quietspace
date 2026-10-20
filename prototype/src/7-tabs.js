/* ---------------- seed state ---------------- */
const INIT_BOOKINGS = [
  { id: 'u1', lid: 7, day: 2, h: 10, dur: 1, guests: 1, status: 'Confirmed' },
  { id: 'p1', lid: 3, day: -6, h: 13, dur: 1, guests: 1, past: true, reviewed: false },
  { id: 'p2', lid: 4, day: -13, h: 9, dur: 1, guests: 1, past: true, reviewed: true, hostReview: 'Arrived on time, kept the loft peaceful and left it exactly as they found it. Welcome back any morning.' },
];
const INIT_THREADS = [
  { id: 't7', lid: 7, name: 'Ruth', color: '#7A4E3F', sub: 'Reading nook in a 1910 bungalow', unread: true, msgs: [
    { me: false, text: "Hi! Looking forward to your visit. The chair by the window gets the best light around 10. Tea's on the side table, help yourself." }] },
  { id: 'team', name: 'Quiet Space', team: true, sub: 'Support', unread: false, msgs: [
    { me: false, text: 'Welcome to Quiet Space. Every host is ID-verified and every space has a measured quiet level. If anything ever feels off during a visit, tap Help and a real person answers.' }] },
];
const HOST_REPLIES = ["That works perfectly. See you then!", "Of course. I'll leave a few extra blankets out for you.", "No problem at all. Take all the time you need.", "Thanks for letting me know! The side entrance will be unlocked."];

/* ---------------- bookings ---------------- */
function Trips({ bookings, openListing, openReview, openChat, toast }) {
  const [seg, setSeg] = useState('up');
  const up = bookings.filter(b => !b.past);
  const past = bookings.filter(b => b.past);
  return html`<div class="screen fade">
    <div class="page-h"><h1>Bookings</h1></div>
    <div class="seg"><button class=${seg === 'up' ? 'on' : ''} onClick=${() => setSeg('up')}>Upcoming (${up.length})</button><button class=${seg === 'past' ? 'on' : ''} onClick=${() => setSeg('past')}>Past</button></div>
    <div class="pad stack" style=${{ gap: '14px', paddingBottom: '30px' }}>
      ${seg === 'up' && up.length === 0 && html`<div class="empty"><${Icon} n="cal" cls="lg" /><h3>No visits booked yet</h3><p>When you book a quiet space it shows up here with your door code.</p></div>`}
      ${seg === 'up' && up.map(b => { const l = BY_ID[b.lid];
        return html`<div class="trip" key=${b.id}>
          <button class="ta" style=${{ display: 'block', width: '100%' }} onClick=${() => openListing(l.id)}><${Art} a=${l.art} /></button>
          <div class="tb"><span class=${'status'} style=${b.status !== 'Confirmed' ? { color: 'var(--warn)' } : null}>${b.status}</span>
            <h3>${l.title}</h3><p class="muted tnum" style=${{ fontSize: '14px' }}>${fmtDay(dayAt(b.day), true)} · ${fmtHour(b.h)} – ${fmtHour(b.h + b.dur)}</p>
            <div class="row" style=${{ marginTop: '10px' }}><button class="btn sm" onClick=${() => openChat(l.id)}><${Icon} n="chat" cls="sm" />Message ${l.host.name}</button>
              <button class="btn sm ghost" onClick=${() => toast('Directions open in Apple or Google Maps')}><${Icon} n="nav" cls="sm" />Directions</button></div></div></div>`; })}
      ${seg === 'past' && past.map(b => { const l = BY_ID[b.lid];
        return html`<div class="trip" key=${b.id}><div class="tb">
          <div class="summary"><div class="thumb" style=${{ width: '72px', height: '64px' }}><${Art} a=${l.art} /></div>
            <div><h3>${l.title}</h3><p class="muted tnum" style=${{ fontSize: '13.5px', marginTop: '3px' }}>${fmtDay(dayAt(b.day))} · ${fmtHour(b.h)}</p></div></div>
          ${b.reviewed
            ? html`<div class="twoway" style=${{ marginTop: '12px' }}><${Icon} n="star" fill=${true} /><span><b style=${{ color: 'var(--ink)' }}>${l.host.name} rated you 5 stars</b><br />"${b.hostReview || 'Lovely guest. Welcome back anytime.'}"</span></div>`
            : html`<button class="btn sm line" style=${{ marginTop: '12px' }} onClick=${() => openReview(b.id)}><${Icon} n="star" cls="sm" />Leave a review</button>`}
        </div></div>`; })}
    </div></div>`;
}

const REVIEW_TAGS = ['Truly quiet', 'Felt safe', 'Spotless', 'As pictured', 'Easy check-in', 'Kind host', 'Good value'];
function Review({ b, onBack, onSubmit }) {
  const l = BY_ID[b.lid];
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  return html`<div class="screen with-footer enter">
    <div class="chat-head"><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onBack} aria-label="Back"><${Icon} n="back" /></button><b style=${{ fontSize: '17px' }}>Review your visit</b></div>
    <div style=${{ paddingBottom: '110px' }}>
      <div class="section" style=${{ borderTop: 0, textAlign: 'center' }}>
        <div class="summary" style=${{ justifyContent: 'center', textAlign: 'left' }}><div class="thumb"><${Art} a=${l.art} /></div><div><h3>${l.title}</h3><p class="muted" style=${{ fontSize: '13.5px' }}>Hosted by ${l.host.name}</p></div></div>
        <h2 style=${{ marginTop: '22px', marginBottom: '4px' }}>How was your time there?</h2>
        <div class="star-pick">${[1, 2, 3, 4, 5].map(n => html`<button key=${n} class=${n <= stars ? 'on' : ''} onClick=${() => setStars(n)} aria-label=${n + ' stars'}><${Icon} n="star" fill=${true} /></button>`)}</div></div>
      <div class="section"><h2>What stood out?</h2><div class="wrap">${REVIEW_TAGS.map(t => html`<button key=${t} class=${'chip' + (tags.includes(t) ? ' on' : '')} onClick=${() => setTags(toggleIn(tags, t))}>${t}</button>`)}</div></div>
      <div class="section"><h2>Tell future guests</h2><textarea id="reviewtext" class="input" placeholder="What made it a good place to rest, pray, cry or just be?" value=${text} onChange=${(e) => setText(e.target.value)}></textarea>
        <div class="twoway"><${Icon} n="shield" /><span>${l.host.name} is reviewing you too. Both reviews go live together once you've both submitted, or after 14 days.</span></div></div>
    </div>
    <div class="footer-bar pad-home"><button class="btn block" disabled=${!stars} onClick=${onSubmit}>Submit review</button></div>
  </div>`;
}

/* ---------------- inbox + chat ---------------- */
function Inbox({ threads, openThread }) {
  return html`<div class="screen fade"><div class="page-h"><h1>Inbox</h1></div>
    <div style=${{ paddingTop: '6px' }}>${threads.map(t => { const last = t.msgs[t.msgs.length - 1];
      return html`<button class="thread" key=${t.id} onClick=${() => openThread(t.id)}>
        ${t.team ? html`<span class="avatar" style=${{ background: 'var(--surface-2)' }}><${Logo} size=${30} /></span>` : html`<span class="avatar" style=${{ background: t.color }}>${initials(t.name)}</span>`}
        <span class="tx"><b>${t.name}</b><span class="muted" style=${{ fontSize: '12.5px', marginTop: 0 }}>${t.sub}</span><span class=${t.unread ? 'unread' : ''}>${last.me ? 'You: ' : ''}${last.text}</span></span>
        <time>${t.when || 'Now'}</time></button>`; })}</div></div>`;
}
function Chat({ t, onBack, onSend }) {
  const [txt, setTxt] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current && end.current.scrollIntoView({ block: 'end' }); }, [t.msgs.length, typing]);
  const send = (e) => {
    e.preventDefault(); if (!txt.trim()) return;
    onSend(t.id, { me: true, text: txt.trim() }); setTxt('');
    if (!t.team) { setTyping(true); setTimeout(() => { setTyping(false); onSend(t.id, { me: false, text: HOST_REPLIES[t.msgs.length % HOST_REPLIES.length] }); }, 1500); }
  };
  return html`<div class="screen enter" style=${{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <div class="chat-head"><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onBack} aria-label="Back"><${Icon} n="back" /></button>
      ${t.team ? html`<${Logo} size=${36} />` : html`<span class="avatar" style=${{ background: t.color }}>${initials(t.name)}</span>`}
      <span><b>${t.name}</b><span>${t.team ? 'Usually replies in minutes' : t.sub}</span></span></div>
    <div style=${{ flex: 1, overflowY: 'auto', minHeight: 0 }}><div class="msgs">
      <span class="msg-day">Today</span>
      ${t.msgs.map((m, i) => html`<div key=${i} class=${'msg ' + (m.me ? 'me' : 'them')}>${m.text}</div>`)}
      ${typing && html`<div class="typing"><i></i><i></i><i></i></div>`}
      <div ref=${end}></div></div></div>
    <form class="composer pad-home" onSubmit=${send}><input id="chatinput" placeholder="Write a message" value=${txt} onChange=${(e) => setTxt(e.target.value)} aria-label="Message" />
      <button type="submit" disabled=${!txt.trim()} aria-label="Send"><${Icon} n="send" cls="sm" /></button></form>
  </div>`;
}

/* ---------------- saved ---------------- */
function Saved({ saved, toggleSave, openListing, goExplore }) {
  const list = LISTINGS.filter(l => saved.includes(l.id));
  return html`<div class="screen fade"><div class="page-h"><h1>Saved</h1></div>
    ${list.length === 0
      ? html`<div class="empty"><${Icon} n="heart" cls="lg" /><h3>Nothing saved yet</h3><p>Tap the heart on any space to keep it here for later.</p><button class="btn sm" onClick=${goExplore}>Find a space</button></div>`
      : html`<div class="cards" style=${{ paddingTop: '12px', paddingBottom: '30px' }}>${list.map(l => html`<${ListingCard} key=${l.id} l=${l} saved=${true} onSave=${() => toggleSave(l.id)} onOpen=${() => openListing(l.id)} />`)}</div>`}
  </div>`;
}
