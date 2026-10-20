/* ---------------- dates + slots ---------------- */
const DAY_MS = 86400000;
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const dayAt = (i) => new Date(startOfToday().getTime() + i * DAY_MS);
const fmtHour = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`;
const fmtDay = (d, long) => d.toLocaleDateString('en-US', long ? { weekday: 'long', month: 'long', day: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' });
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const isBooked = (l, day, h) => (l.id * 7 + day * 3 + h * 5) % 6 === 0;
const slotOk = (l, day, h, dur) => {
  if (day === 0 && h <= new Date().getHours()) return false;
  if (h + dur > 21) return false;
  for (let k = h; k < h + dur; k++) if (isBooked(l, day, k)) return false;
  return true;
};
const priceFor = (l, dur) => { const base = l.price * dur; const fee = Math.round(base * 8) / 100; return { base, fee, total: base + fee }; };

function Listing({ l, saved, onSave, onBack, onBook, toast }) {
  const rv = reviewsFor(l);
  const cats = [['Quietness', 0.03], ['Cleanliness', -0.01], ['Accuracy', 0.02], ['Check-in', 0.0], ['Felt safe', 0.03], ['Value', -0.04]]
    .map(([n, o]) => [n, Math.min(5, l.rating + o)]);
  return html`<div class="screen with-footer enter">
    <div class="hero"><${Art} a=${l.art} />
      <div class="hero-btns"><button class="iconbtn" onClick=${onBack} aria-label="Back"><${Icon} n="back" /></button>
        <div class="row"><button class="iconbtn" onClick=${() => toast('Share opens your phone\'s share sheet in the app')} aria-label="Share"><${Icon} n="share" cls="sm" /></button>
          <button class="iconbtn" onClick=${onSave} aria-label="Save" style=${saved ? { color: '#E5484D' } : null}><${Icon} n="heart" cls="sm" fill=${saved} /></button></div></div>
      <span class="count">1 / 8</span>
    </div>
    <div class="detail">
      <div class="detail-head">
        <h1>${l.title}</h1>
        <p class="sub">${TYPE[l.type].label} in ${l.hood}, Lexington · ${l.mi} mi away</p>
        <p class="sub tnum" style=${{ marginTop: '4px' }}>Up to ${l.cap} ${l.cap > 1 ? 'people' : 'person'} · ${SOUND[l.sound].label} · ${l.instant ? 'Instant book' : 'Host approves requests'}</p>
        <div class="fav-row"><span class="lbl">${l.rating >= 4.95 ? 'Guest favorite' : 'Loved by guests'}<br /><span class="muted" style=${{ fontWeight: 500, fontSize: '12px' }}>One of the calmest spaces on Quiet Space</span></span>
          <span class="num"><b class="tnum">${l.rating.toFixed(2)}</b><span>rating</span></span><span class="num"><b class="tnum">${l.reviews}</b><span>reviews</span></span></div>
      </div>
      <div class="section"><div class="host-row"><span class="avatar" style=${{ background: l.host.color }}>${initials(l.host.name)}</span>
        <span><b>Hosted by ${l.host.name}</b><span>Host since ${l.host.since} · Replies ${l.host.reply}</span></span></div></div>

      <div class="section"><h2>How quiet is it?</h2>
        <div class="qbig"><b class="tnum">${l.db}</b><span class="muted">dB ambient, measured by the host</span></div>
        <div class="qmeter"><div class="bar"></div><span class="mark" style=${{ left: ((l.db - 10) / 50) * 100 + '%' }}></span>
          <div class="scale"><span>10 · breathing</span><span>30 · whisper</span><span>60 · talking</span></div></div>
        <div class="policy" style=${{ marginTop: '18px' }}><${Icon} n=${SOUND[l.sound].icon} /><div><b>${SOUND[l.sound].label}</b><p>${SOUND[l.sound].note}</p></div></div>
      </div>

      <div class="section"><h2>Good for</h2>
        <div class="goodfor">${l.uses.map(u => html`<span key=${u}><${Icon} n=${USE[u].icon} cls="sm" />${USE[u].label}</span>`)}</div></div>
      <div class="section"><h2>About this space</h2><p class="prose">${l.blurb}</p></div>
      <div class="section"><h2>What this space offers</h2>
        <div class="amen">${l.amen.map(a => html`<div key=${a}><${Icon} n=${AMEN[a][1]} />${AMEN[a][0]}</div>`)}</div></div>
      <div class="section"><h2>House guidelines</h2>
        <div class="rules">${l.rules.map((r, i) => html`<div key=${i}><${Icon} n="check" cls="sm" />${r}</div>`)}</div></div>
      <div class="section"><h2>Where you'll be</h2>
        <div class="minimap"><svg viewBox=${`${l.x - 80} ${l.y - 45} 160 90`} preserveAspectRatio="xMidYMid slice" style=${{ width: '100%', height: '100%' }}>
          <${MapBase} /><circle cx=${l.x} cy=${l.y} r="16" class="m-area" /></svg></div>
        <p class="muted" style=${{ fontSize: '14px', marginTop: '10px' }}>${l.hood}, Lexington, KY. The exact address and door code are shared once you book.</p></div>

      <div class="section"><div class="rv-sum"><${Icon} n="star" fill=${true} /><b class="tnum">${l.rating.toFixed(2)}</b><span class="muted">· ${l.reviews} reviews</span></div>
        <div class="rv-cats">${cats.map(([n, v]) => html`<div class="rv-cat" key=${n}><div class="t"><span>${n}</span><b class="tnum">${v.toFixed(1)}</b></div><div class="b"><i style=${{ width: (v / 5) * 100 + '%' }}></i></div></div>`)}</div>
        <div class="rv-cards">${rv.map((r, i) => html`<div class="rv-card" key=${i}>
          <div class="rv-who"><span class="avatar" style=${{ background: r.color }}>${r.who[0]}</span><span><b>${r.who}</b><span>${r.when}</span></span></div>
          <p>${r.text}</p></div>`)}</div>
        <div class="twoway"><${Icon} n="shield" /><span><b style=${{ color: 'var(--ink)' }}>Reviews go both ways.</b> After every visit, guests review the space and hosts review the guest. Both are published at the same time so nobody can retaliate.</span></div>
      </div>
      <div class="section"><h2>Cancellation</h2><p class="prose muted">Free cancellation up to 2 hours before your visit. After that, the host keeps 50%.</p></div>
    </div>
    <div class="footer-bar pad-home"><div class="p tnum">${l.price === 0 ? html`<b>Free</b><span>Donations welcome</span>` : html`<b>$${l.price}</b> / hour<span>${l.now ? 'Free slot within the hour' : 'Next opening tomorrow'}</span>`}</div>
      <button class="btn" onClick=${onBook}>Choose a time</button></div>
  </div>`;
}

/* ---------------- booking sheet ---------------- */
function BookingSheet({ l, onClose, onContinue }) {
  const firstDay = HOURS.some(h => slotOk(l, 0, h, 1)) ? 0 : 1;
  const [day, setDay] = useState(firstDay);
  const [dur, setDur] = useState(1);
  const [h, setH] = useState(null);
  const [guests, setGuests] = useState(1);
  const p = priceFor(l, dur);
  useEffect(() => { if (h != null && !slotOk(l, day, h, dur)) setH(null); }, [day, dur]);
  return html`<${Fragment}>
    <div class="scrim" onClick=${onClose}></div>
    <div class="sheet" role="dialog" aria-label="Choose a time">
      <div class="sheet-head"><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button><h2>Choose a time</h2><span></span></div>
      <div class="sheet-body">
        <div class="f-sec"><h3 style=${{ marginBottom: '12px' }}>Day</h3>
          <div class="days">${[0, 1, 2, 3, 4, 5, 6].map(i => { const d = dayAt(i);
            return html`<button key=${i} class=${'day' + (day === i ? ' on' : '')} onClick=${() => setDay(i)}><span>${i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}</span><b>${d.getDate()}</b></button>`; })}</div></div>
        <div class="f-sec"><h3 style=${{ marginBottom: '12px' }}>How long?</h3>
          <div class="wrap">${[1, 2, 3].map(n => html`<button key=${n} class=${'chip' + (dur === n ? ' on' : '')} onClick=${() => setDur(n)}>${n} hour${n > 1 ? 's' : ''}</button>`)}</div></div>
        <div class="f-sec"><div class="spread" style=${{ marginBottom: '12px' }}><h3 style=${{ margin: 0 }}>Start time</h3><span class="muted" style=${{ fontSize: '13px' }}>${fmtDay(dayAt(day))}</span></div>
          <div class="slots">${HOURS.map(x => html`<button key=${x} class=${'slot' + (h === x ? ' on' : '')} disabled=${!slotOk(l, day, x, dur)} onClick=${() => setH(x)}>${fmtHour(x)}</button>`)}</div></div>
        <div class="f-sec"><div class="spread"><div><h3>People</h3><p class="hint" style=${{ margin: 0 }}>This space fits up to ${l.cap}</p></div>
          <div class="stepper"><button disabled=${guests <= 1} onClick=${() => setGuests(guests - 1)} aria-label="Fewer"><${Icon} n="minus" cls="sm" /></button><b>${guests}</b><button disabled=${guests >= l.cap} onClick=${() => setGuests(guests + 1)} aria-label="More"><${Icon} n="plus" cls="sm" /></button></div></div></div>
        <div class="f-sec" style=${{ borderBottom: 0 }}><div class="lines">
          <div class="spread"><span>${l.price === 0 ? 'Free space' : `$${l.price} × ${dur} hour${dur > 1 ? 's' : ''}`}</span><span>${money(p.base)}</span></div>
          <div class="spread"><span>Quiet Space service fee</span><span>${money(p.fee)}</span></div>
          <div class="spread total"><span>Total</span><span>${money(p.total)}</span></div></div></div>
      </div>
      <div class="sheet-foot pad-home"><div class="tnum" style=${{ fontSize: '14px' }}>${h == null ? html`<span class="muted">Pick a start time</span>` : html`<b>${fmtHour(h)} – ${fmtHour(h + dur)}</b><br /><span class="muted">${fmtDay(dayAt(day))}</span>`}</div>
        <button class="btn" disabled=${h == null} onClick=${() => onContinue({ day, h, dur, guests })}>${l.instant ? 'Reserve' : 'Request'}</button></div>
    </div>
  <//>`;
}

/* ---------------- checkout ---------------- */
const INTENTIONS = ['Rest', 'Cry it out', 'Meditate', 'Pray', 'Breathe', 'Just be'];
function Checkout({ l, b, onBack, onPaid }) {
  const p = priceFor(l, b.dur);
  const [pay, setPay] = useState('apple');
  const [intent, setIntent] = useState([]);
  const [share, setShare] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const go = () => { setBusy(true); setTimeout(() => onPaid({ intent, share, msg, total: p.total }), 1100); };
  return html`<div class="screen with-footer enter">
    <div class="chat-head" style=${{ position: 'sticky', top: 0, zIndex: 3 }}><button class="iconbtn" style=${{ boxShadow: 'none' }} onClick=${onBack} aria-label="Back"><${Icon} n="back" /></button><b style=${{ fontSize: '17px' }}>${l.instant ? 'Confirm and pay' : 'Request to book'}</b></div>
    <div style=${{ paddingBottom: '110px' }}>
      <div class="section" style=${{ borderTop: 0 }}><div class="summary"><div class="thumb"><${Art} a=${l.art} /></div>
        <div><h3>${l.title}</h3><p class="muted" style=${{ fontSize: '13.5px', marginTop: '3px' }}>${TYPE[l.type].label} · ${l.hood}</p><span class="stars tnum" style=${{ fontSize: '13px', marginTop: '4px' }}><${Icon} n="star" fill=${true} />${l.rating.toFixed(2)} (${l.reviews})</span></div></div></div>
      <div class="section"><h2>Your visit</h2><div class="stack" style=${{ gap: '16px' }}>
        <div class="kv"><span style=${{ margin: 0 }}><b>Date</b><span>${fmtDay(dayAt(b.day), true)}</span></span><button class="link" onClick=${onBack}>Edit</button></div>
        <div class="kv"><span style=${{ margin: 0 }}><b>Time</b><span class="tnum">${fmtHour(b.h)} – ${fmtHour(b.h + b.dur)}</span></span></div>
        <div class="kv"><span style=${{ margin: 0 }}><b>People</b><span>${b.guests}</span></span></div></div></div>
      <div class="section"><h2>Your intention <span class="muted" style=${{ fontWeight: 500, fontSize: '14px' }}>optional</span></h2>
        <div class="wrap">${INTENTIONS.map(t => html`<button key=${t} class=${'chip' + (intent.includes(t) ? ' on' : '')} onClick=${() => setIntent(toggleIn(intent, t))}>${t}</button>`)}</div>
        <div class="private"><${Icon} n="lock" cls="sm" />Private to you unless you choose to share it.</div>
        <${Toggle} on=${share} onClick=${() => setShare(!share)} label="Share with ${l.host.name}" sub="Helps your host set the room up for you" /></div>
      <div class="section"><h2>Message ${l.host.name} <span class="muted" style=${{ fontWeight: 500, fontSize: '14px' }}>optional</span></h2>
        <textarea id="hostmsg" class="input" placeholder="Anything your host should know? Arriving early, need a step-free entry, first time doing this..." value=${msg} onChange=${(e) => setMsg(e.target.value)}></textarea></div>
      <div class="section"><h2>Price details</h2><div class="lines">
        <div class="spread"><span>${l.price === 0 ? 'Free space' : `$${l.price} × ${b.dur} hour${b.dur > 1 ? 's' : ''}`}</span><span>${money(p.base)}</span></div>
        <div class="spread"><span>Quiet Space service fee</span><span>${money(p.fee)}</span></div>
        <div class="spread total"><span>Total (USD)</span><span>${money(p.total)}</span></div></div></div>
      <div class="section"><h2>Pay with</h2><div class="stack">
        ${[['apple', 'Pay', 'Apple Pay'], ['google', 'G Pay', 'Google Pay'], ['card', 'VISA', 'Visa ending in 4242']].map(([k, logo, name]) => html`<button key=${k} class=${'pay' + (pay === k ? ' on' : '')} onClick=${() => setPay(k)}><span class="logo">${logo}</span>${name}<span class="radio"></span></button>`)}</div>
        <div class="private" style=${{ marginTop: '14px' }}><${Icon} n="shield" cls="sm" />Your payment is held securely and released to the host after your visit.</div></div>
    </div>
    <div class="footer-bar pad-home"><button class="btn block" disabled=${busy} onClick=${go}>${busy ? html`<span class="spinner"></span>Processing` : l.price === 0 && p.total === 0 ? 'Confirm booking' : `Confirm and pay ${money(p.total)}`}</button></div>
  </div>`;
}

function Confirmed({ l, b, onMessage, onTrips, onExplore }) {
  return html`<div class="screen enter"><div class="done">
      <div class="ring"><${Icon} n="check" /></div>
      <h1>${l.instant ? "You're booked" : 'Request sent'}</h1>
      <p class="muted" style=${{ maxWidth: '300px', lineHeight: 1.5 }}>${l.instant ? `${l.host.name} has your booking. We'll remind you 30 minutes before.` : `${l.host.name} usually replies ${l.host.reply}. You won't be charged unless they accept.`}</p>
    </div>
    <div class="pad stack" style=${{ gap: '12px', paddingBottom: '30px' }}>
      <div class="summary" style=${{ padding: '14px', borderRadius: '18px', background: 'var(--surface)', border: '1px solid var(--line)' }}><div class="thumb"><${Art} a=${l.art} /></div>
        <div><h3>${l.title}</h3><p class="muted tnum" style=${{ fontSize: '13.5px', marginTop: '4px' }}>${fmtDay(dayAt(b.day))}<br />${fmtHour(b.h)} – ${fmtHour(b.h + b.dur)}</p></div></div>
      <div class="code"><${Icon} n="key" /><span style=${{ fontSize: '14px' }}><b>Door code</b><br /><span class="muted">Unlocks 15 min before</span></span>
        <span class="digits"><i>•</i><i>•</i><i>•</i><i>•</i></span></div>
      <button class="btn block" onClick=${onMessage}><${Icon} n="chat" cls="sm" />Message ${l.host.name}</button>
      <button class="btn block ghost" onClick=${onTrips}>View my bookings</button>
      <button class="link" style=${{ justifySelf: 'center', marginTop: '6px' }} onClick=${onExplore}>Back to explore</button>
    </div></div>`;
}
