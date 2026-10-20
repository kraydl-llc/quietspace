const { useState, useEffect, useMemo, useRef, useId, Fragment } = React;
const html = htm.bind(React.createElement);

/* ---------------- taxonomy (from the Oct 16 call) ---------------- */
const USES = [
  { id: 'rest', label: 'Rest & nap', icon: 'moon' },
  { id: 'meditate', label: 'Meditation', icon: 'leaf' },
  { id: 'release', label: 'Emotional release', icon: 'wave' },
  { id: 'prayer', label: 'Prayer', icon: 'sun' },
  { id: 'journal', label: 'Read & journal', icon: 'pen' },
  { id: 'breath', label: 'Breathwork', icon: 'wind' },
  { id: 'circle', label: 'Small circle', icon: 'users' },
];
const USE = Object.fromEntries(USES.map(u => [u.id, u]));
const SOUND = {
  silent: { label: 'Silent only', short: 'Silent', icon: 'volx', note: 'Whispers at most. Phones on silent. Ideal for sleep, prayer and deep focus.' },
  soft: { label: 'Soft sounds OK', short: 'Soft sound', icon: 'vol1', note: 'Quiet talking, soft music and gentle tears are all fine here.' },
  loud: { label: 'Loud is welcome', short: 'Loud OK', icon: 'vol', note: 'Cry, sing, shout, let it out. The room is insulated so nobody outside will hear you.' },
};
const TYPES = [
  { id: 'guesthouse', label: 'Guest house' },
  { id: 'yoga', label: 'Yoga studio' },
  { id: 'room', label: 'Spare room' },
  { id: 'garden', label: 'Garden studio' },
  { id: 'sanctuary', label: 'Chapel & sanctuary' },
  { id: 'studio', label: 'Music & art studio' },
  { id: 'cabin', label: 'Cabin & porch' },
  { id: 'office', label: 'Office rest room' },
];
const TYPE = Object.fromEntries(TYPES.map(t => [t.id, t]));
const AMEN = {
  blankets: ['Blankets & pillows', 'moon'], mat: ['Floor mats & cushions', 'grid'], dim: ['Dimmable lights', 'sun'],
  restroom: ['Private restroom', 'home'], parking: ['Free parking', 'pin'], stepfree: ['Step-free entry', 'check'],
  entrance: ['Private entrance', 'key'], scentfree: ['Scent-free', 'leaf'], tea: ['Tea & water', 'cup'],
  noise: ['White-noise machine', 'vol1'], tissues: ['Tissues within reach', 'heart'], daybed: ['Daybed', 'moon'],
};
const AMEN_FILTER = ['blankets', 'restroom', 'parking', 'stepfree', 'entrance', 'scentfree'];

/* ---------------- sample listings: Lexington, KY ---------------- */
const L = (o) => o;
const LISTINGS = [
  L({ id: 1, title: 'Sunroom above the garden', type: 'guesthouse', hood: 'Chevy Chase', mi: 1.2, price: 24, rating: 4.97, reviews: 38, cap: 2, sound: 'soft', db: 27, instant: true, now: true,
    uses: ['rest', 'meditate', 'journal', 'prayer'], amen: ['blankets', 'dim', 'restroom', 'entrance', 'tea', 'parking'],
    host: { name: 'Marguerite', since: 2025, color: '#7C8F6A', reply: 'within 10 min' }, x: 245, y: 345,
    blurb: 'A glass-walled sunroom on the second floor of our guest house, looking down onto a cottage garden. Morning light is soft and the street is a dead end, so the loudest thing you will hear is the wind chime.',
    rules: ['Shoes off at the door', 'No phone calls inside', 'Please leave the blankets folded on the chair'],
    art: { wall: '#DCE4D8', wall2: '#C3D0C0', floor: '#B49A7A', sky: '#FFF6DE', sky2: '#F6E2B5', glow: '#FFE7A8', frame: '#FFFFFF', win: 'left', props: ['chair', 'plant'], prop: '#8FA48A', prop2: '#E9D8B8', leaf: '#4E7A55', pot: '#C8A27C' } }),
  L({ id: 2, title: 'Studio B after hours', type: 'yoga', hood: 'North Limestone', mi: 0.8, price: 20, rating: 4.92, reviews: 51, cap: 3, sound: 'loud', db: 31, instant: true, now: false,
    uses: ['breath', 'release', 'circle', 'meditate'], amen: ['mat', 'dim', 'restroom', 'tissues', 'noise', 'stepfree'],
    host: { name: 'Jonah', since: 2024, color: '#5B7F8C', reply: 'within an hour' }, x: 212, y: 252,
    blurb: 'Our smaller practice room, open to one booking at a time once evening classes end. Sprung wood floor, bolsters and blocks, and acoustic panels on every wall, so breathwork and big feelings stay in the room.',
    rules: ['Wipe down any mats you use', 'Lights off and door locked when you leave', 'No candles (smoke detectors)'],
    art: { wall: '#E8E1D7', wall2: '#D6CBBD', floor: '#A97F55', sky: '#E3EEF5', sky2: '#C9DDEA', glow: '#FFF1CF', frame: '#2E2A26', win: 'right', props: ['mat', 'plant'], prop: '#5B7F8C', prop2: '#D9B48A', leaf: '#3E6B4F', pot: '#E7DFD3' } }),
  L({ id: 3, title: 'The quiet room on Bell Court', type: 'room', hood: 'Bell Court', mi: 1.5, price: 18, rating: 4.89, reviews: 22, cap: 1, sound: 'silent', db: 24, instant: false, now: true,
    uses: ['rest', 'journal'], amen: ['blankets', 'daybed', 'dim', 'scentfree', 'entrance'],
    host: { name: 'Theo', since: 2025, color: '#7C8DA6', reply: 'within 30 min' }, x: 246, y: 300,
    blurb: 'A back bedroom in a 1920s foursquare, set up for one person to lie down and switch off. Blackout shades, a weighted blanket, and a separate side entrance so you never pass through the house.',
    rules: ['Silent space: no music or calls', 'Scent-free, please skip perfume', 'Side gate code arrives 15 min before'],
    art: { wall: '#D3DCE6', wall2: '#B9C6D4', floor: '#8C7A68', sky: '#F1F4F8', sky2: '#DCE5EE', glow: '#FFF4DA', frame: '#F7F7F5', win: 'left', props: ['bed', 'lamp'], prop: '#E8E2D6', prop2: '#7C8DA6' } }),
  L({ id: 4, title: 'Chapel loft, weekday mornings', type: 'sanctuary', hood: 'Downtown', mi: 0.4, price: 0, rating: 4.95, reviews: 64, cap: 4, sound: 'silent', db: 22, instant: true, now: true,
    uses: ['prayer', 'meditate', 'journal'], amen: ['stepfree', 'restroom', 'blankets'],
    host: { name: 'Rev. Alma', since: 2026, color: '#8E7656', reply: 'within a day' }, x: 196, y: 292,
    blurb: 'The choir loft of a downtown chapel, open free of charge Monday to Friday, 8 to 11 AM. Stone walls, old wood, and the kind of quiet that only a 120-year-old building has. Donations are welcome and never expected.',
    rules: ['Open to people of any faith or none', 'Please keep to the loft during services', 'Donations optional'],
    art: { wall: '#EEEAE3', wall2: '#DCD5C9', floor: '#7A6450', sky: '#CFE0F0', sky2: '#F4E7C8', glow: '#FFF0C2', frame: '#B8A88E', arch: true, props: ['pews'], prop: '#6E5641' } }),
  L({ id: 5, title: 'Cedar garden studio', type: 'garden', hood: 'Ashland Park', mi: 2.1, price: 28, rating: 4.98, reviews: 17, cap: 2, sound: 'loud', db: 26, instant: false, now: false,
    uses: ['release', 'breath', 'rest', 'meditate'], amen: ['mat', 'blankets', 'tissues', 'tea', 'parking', 'entrance'],
    host: { name: 'Priya', since: 2025, color: '#3E5F55', reply: 'within 15 min' }, x: 282, y: 375,
    blurb: 'A detached cedar studio at the bottom of the garden, a good 60 feet from the house. It was built for music practice, so it is fully insulated. Cry, yell, or sit in silence. Nobody will hear either.',
    rules: ['Garden path is lit after dark', 'Kettle and tea are yours to use', 'Please close the windows when you leave'],
    art: { wall: '#C9B79E', wall2: '#AE9A7E', floor: '#6F5A45', sky: '#DDEFD9', sky2: '#B8D8B0', glow: '#F7F1C6', frame: '#5A4634', win: 'right', trees: true, props: ['mat', 'lamp'], prop: '#3E5F55', prop2: '#E6D3B3' } }),
  L({ id: 6, title: 'Nap suite by the Distillery District', type: 'room', hood: 'Distillery District', mi: 1.9, price: 15, rating: 4.86, reviews: 29, cap: 1, sound: 'soft', db: 29, instant: true, now: true,
    uses: ['rest'], amen: ['daybed', 'blankets', 'noise', 'dim', 'restroom'],
    host: { name: 'Andre', since: 2026, color: '#6B8BA8', reply: 'within 5 min' }, x: 138, y: 300,
    blurb: 'A small, dark, cool room made for one thing: a proper nap. Daybed, blackout curtains, a white-noise machine, and a gentle wake-up light you can set to any time.',
    rules: ['Bookings in 1-hour blocks', 'Fresh linens every visit', 'Wake-up light is on the side table'],
    art: { wall: '#2F3B44', wall2: '#232D35', floor: '#4A3F37', sky: '#3C5A78', sky2: '#7C93A8', glow: '#F7C77D', frame: '#1A2228', win: 'left', props: ['bed', 'lamp'], prop: '#C9B79C', prop2: '#6B8BA8' } }),
  L({ id: 7, title: 'Reading nook in a 1910 bungalow', type: 'room', hood: 'Kenwick', mi: 1.7, price: 12, rating: 4.91, reviews: 33, cap: 1, sound: 'silent', db: 25, instant: true, now: true,
    uses: ['journal', 'rest', 'prayer'], amen: ['blankets', 'tea', 'scentfree', 'parking'],
    host: { name: 'Ruth', since: 2025, color: '#7A4E3F', reply: 'within an hour' }, x: 285, y: 322,
    blurb: 'A wingback chair, a wall of books and a window onto a quiet Kenwick street. Bring a journal or borrow anything off the shelves.',
    rules: ['Borrow any book, just leave it on the chair', 'Silent space', 'Street parking out front'],
    art: { wall: '#E4D3C2', wall2: '#CDB8A2', floor: '#8F6E52', sky: '#EAF2F3', sky2: '#D2E3E6', glow: '#FFF0CC', frame: '#FFFFFF', win: 'right', props: ['shelf', 'chair'], prop: '#7A4E3F', prop2: '#E9DCC6' } }),
  L({ id: 8, title: 'Sound-treated music room', type: 'studio', hood: 'Southland', mi: 3.4, price: 30, rating: 4.94, reviews: 12, cap: 3, sound: 'loud', db: 20, instant: false, now: false,
    uses: ['release', 'breath', 'circle'], amen: ['mat', 'tissues', 'dim', 'restroom', 'parking', 'stepfree'],
    host: { name: 'Celeste', since: 2026, color: '#8C6A9E', reply: 'within 20 min' }, x: 205, y: 440,
    blurb: 'A recording room with floating floors and double doors. It is the quietest room in Lexington when you are silent and the most private when you are not.',
    rules: ['No food in the room', 'Max 3 people', 'Free lot behind the building'],
    art: { wall: '#3A3542', wall2: '#2C2833', floor: '#5B4A3E', sky: '#5E6E8C', sky2: '#9AA6C2', glow: '#E9B872', frame: '#201D25', win: 'right', props: ['panels', 'mat'], prop: '#8C6A9E', prop2: '#C9A46B' } }),
  L({ id: 9, title: 'Horse-country cabin porch', type: 'cabin', hood: 'Paris Pike', mi: 9.8, price: 35, rating: 5.0, reviews: 9, cap: 4, sound: 'loud', db: 19, instant: false, now: false,
    uses: ['rest', 'meditate', 'circle', 'release'], amen: ['blankets', 'tea', 'restroom', 'parking', 'entrance'],
    host: { name: 'Will', since: 2026, color: '#9A4E3A', reply: 'within 2 hours' }, x: 318, y: 150,
    blurb: 'A screened porch on a one-room cabin, looking out over a horse pasture off Paris Pike. Rocking chairs, a porch swing and the nearest neighbor half a mile away.',
    rules: ['Gravel drive: go slow', 'Please do not feed the horses', 'Porch blankets in the cedar chest'],
    art: { wall: '#9C7652', wall2: '#7E5D40', floor: '#5E4630', sky: '#CFE6F2', sky2: '#EAF3E2', glow: '#FFF2C4', frame: '#4A3523', win: 'left', hills: true, props: ['chair'], prop: '#D5C3A1', prop2: '#9A4E3A' } }),
  L({ id: 10, title: 'Lunch-hour rest room in Hamburg', type: 'office', hood: 'Hamburg', mi: 5.2, price: 10, rating: 4.83, reviews: 41, cap: 1, sound: 'silent', db: 28, instant: true, now: true,
    uses: ['rest', 'meditate'], amen: ['daybed', 'noise', 'restroom', 'parking', 'stepfree'],
    host: { name: 'Dana', since: 2025, color: '#55707E', reply: 'within 10 min' }, x: 345, y: 268,
    blurb: 'A former phone room in a quiet office suite, turned into a 30 to 60 minute reset spot for people working nearby. Easy parking, in and out in your lunch break.',
    rules: ['Weekdays 11 AM to 3 PM', 'Check in at the front desk tablet', 'One person at a time'],
    art: { wall: '#E7EAEC', wall2: '#D2D7DB', floor: '#9BA1A6', sky: '#DCE8F2', sky2: '#BCD0E2', glow: '#F3F7FF', frame: '#6E7780', win: 'right', props: ['bed', 'plant'], prop: '#55707E', prop2: '#E3E6E8', leaf: '#4C7A5A', pot: '#FFFFFF' } }),
  L({ id: 11, title: 'Treehouse in Hollywood', type: 'cabin', hood: 'Hollywood', mi: 1.6, price: 26, rating: 4.96, reviews: 25, cap: 2, sound: 'soft', db: 30, instant: true, now: false,
    uses: ['rest', 'journal', 'meditate'], amen: ['blankets', 'daybed', 'tea', 'entrance'],
    host: { name: 'Sam', since: 2025, color: '#6F8B5E', reply: 'within 30 min' }, x: 222, y: 385,
    blurb: 'Up a ladder and into the oaks. A little cabin in the canopy with a daybed under the window, made for napping, reading and listening to the leaves.',
    rules: ['Not suitable if ladders are hard for you', 'No shoes upstairs', 'Lantern by the door'],
    art: { wall: '#B98E63', wall2: '#9A7350', floor: '#6B4E35', sky: '#A9CF9A', sky2: '#7FB27A', glow: '#F1F7C9', frame: '#5B3F28', win: 'left', trees: true, props: ['bed'], prop: '#E7DAC0', prop2: '#6F8B5E' } }),
  L({ id: 12, title: 'Community care room', type: 'sanctuary', hood: 'Jefferson Street', mi: 1.1, price: 0, rating: 4.9, reviews: 46, cap: 3, sound: 'soft', db: 32, instant: true, now: true,
    uses: ['circle', 'journal', 'meditate', 'release'], amen: ['mat', 'tissues', 'tea', 'stepfree', 'restroom'],
    host: { name: 'Keisha', since: 2026, color: '#C27C5B', reply: 'within an hour' }, x: 160, y: 258,
    blurb: 'A free room at a neighborhood community center, kept open for anyone who needs a calm place for an hour. Floor cushions, tea and a box of tissues on every side table.',
    rules: ['Free, first come or booked', 'Max 2 hours per visit', 'Please wash your mug'],
    art: { wall: '#D9E1DC', wall2: '#C2CEC6', floor: '#A38B6F', sky: '#F2F0E6', sky2: '#E0DCC8', glow: '#FFF2D0', frame: '#FFFFFF', win: 'right', props: ['circle'], prop: '#C27C5B', prop2: '#6F8F80' } }),
];
const BY_ID = Object.fromEntries(LISTINGS.map(l => [l.id, l]));

const REVIEW_POOL = [
  { who: 'Ava', when: 'October 2026', color: '#8E7AA8', text: 'I booked an hour to cry after a hard week and it was exactly what I needed. Nobody around, a box of tissues, and a pot of tea waiting.' },
  { who: 'Marcus', when: 'October 2026', color: '#5E8C7C', text: 'Fell asleep within ten minutes. Genuinely quieter than my own house. The listed decibel number was spot on.' },
  { who: 'Priscilla', when: 'September 2026', color: '#B07A5A', text: 'Used it for my morning prayer before work. Easy check-in with the door code and the host left a lovely note.' },
  { who: 'Tom', when: 'September 2026', color: '#6A7FA8', text: 'Booked during a lunch break to do breathwork. Clean, calm and five minutes from my office.' },
  { who: 'Leah', when: 'August 2026', color: '#A86A7E', text: 'As a nursing student with roommates, this is the only place I get real quiet to study and decompress.' },
];
const reviewsFor = (l) => [0, 1, 2].map(i => REVIEW_POOL[(l.id + i) % REVIEW_POOL.length]);

/* ---------------- icons ---------------- */
const P = {
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  back: 'M15 18l-6-6 6-6', next: 'M9 18l6-6-6-6', x: 'M18 6L6 18M6 6l12 12', check: 'M20 6L9 17l-5-5',
  map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16', list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  cal: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  vol: 'M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14',
  vol1: 'M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07', volx: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  leaf: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13', send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  card: 'M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM1 10h22',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  nav: 'M3 11l19-9-9 19-2-8-8-2z', grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01', pen: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6', bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  wave: 'M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0', wind: 'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2',
  cup: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3', dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
};
function Icon({ n, cls = '', fill = false }) {
  return html`<svg class=${'ic ' + cls + (fill ? ' fill' : '')} viewBox="0 0 24 24" aria-hidden="true"><path d=${P[n]} /></svg>`;
}
function Logo({ size = 26 }) {
  return html`<svg width=${size} height=${size} viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="15" class="lg-bg" />
    <circle cx="11" cy="16" r="2.6" class="lg-fg" />
    <path d="M15.5 11.5a6.4 6.4 0 0 1 0 9" class="lg-st" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8" />
    <path d="M19.5 8.5a10.6 10.6 0 0 1 0 15" class="lg-st" stroke-width="2" fill="none" stroke-linecap="round" opacity=".4" />
  </svg>`;
}
const fmtPrice = (p) => p === 0 ? 'Free' : '$' + p;
const money = (n) => '$' + n.toFixed(2);
const initials = (n) => n.replace('Rev. ', '').slice(0, 1);
