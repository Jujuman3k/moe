// One change per question: the labels describe audible differences, not console vocabulary.
export const listenChanges = {
  dark: { label: 'Toppen er dempet', name: 'Lavpass', tool: 'lpf', node: 'processing', setting: 'Lavpass ved 1,3 kHz' },
  thin: { label: 'Bunnen er dempet', name: 'Høypass', tool: 'hpf', node: 'processing', setting: 'Høypass ved 350 Hz' },
  echo: { label: 'Det er lagt til ekko', name: 'Delay', tool: 'delay', node: 'fx_branch', setting: 'Ekko etter 200 og 400 ms' },
  room: { label: 'Det er lagt til romklang', name: 'Romklang', tool: 'reverb', node: 'fx_branch', setting: 'Kort, diffus klanghale' },
};

export const listenCases = [
  { id: 'voice-dark', source: 'female', effect: 'dark', hint: 'Sammenlign kanten på konsonantene og hvor mye luft du hører i stemmen.', why: 'Lavpasset demper lyden over grensefrekvensen. På denne stemmen blir konsonanter og pust mykere, mens melodien fortsatt er lett å følge.' },
  { id: 'guitar-dark', source: 'guitar', effect: 'dark', hint: 'Følg først anslaget mot strengen, deretter tonen som ligger igjen.', why: 'Lavpasset tar glansen fra strengene. Anslaget blir rundere i B, selv om musikeren spiller nøyaktig den samme frasen.' },
  { id: 'snare-dark', source: 'snare', effect: 'dark', hint: 'Lytt til raslingen fra seidingen på hvert slag.', why: 'Seidingen inneholder mye energi i toppen. Med lavpass blir den mindre tydelig, mens selve slaget fortsatt høres.' },
  { id: 'bass-thin', source: 'bass', effect: 'thin', hint: 'Hører du både tonen nederst og klangen fra strengene? Sammenlign én tone om gangen.', why: 'Høypasset fjerner mye av grunntonen. Overtonene gjør at du fortsatt kan kjenne igjen basslinjen, selv når kroppen blir svakere.' },
  { id: 'kick-thin', source: 'kick', effect: 'thin', hint: 'Skill mellom dunket nederst og klikket fra kølla.', why: 'Høypasset svekker den dype kroppen i kicket. Klikket fra kølla står igjen. Derfor kan du høre slaget uten å få den samme tyngden.' },
  { id: 'voice-thin', source: 'male', effect: 'thin', hint: 'Hold oppmerksomheten på fylden i én lang vokallyd.', why: 'Høypasset demper det lave området som gir stemmen kropp. Ordene er fortsatt forståelige, men klangen i B blir tynnere.' },
  { id: 'snare-echo', source: 'snare', effect: 'echo', hint: 'Etter et tydelig slag: kan du telle noe som skjer mellom slagene?', why: 'To svakere kopier av slaget kommer etter originalen. Et delay gir adskilte gjentakelser som er lettere å telle enn en sammenhengende klanghale.' },
  { id: 'voice-echo', source: 'male', effect: 'echo', hint: 'Velg en kort stavelse og lytt til det som kommer rett etter den.', why: 'De forsinkede kopiene gjentar de samme stavelsene. Lytt til pausen: du kan høre den opprinnelige artikulasjonen om igjen.' },
  { id: 'piano-room', source: 'piano', effect: 'room', hint: 'Lytt mellom tonene. Faller lyden bort på samme måte i A og B?', why: 'Den korte romklangen sprer mange små refleksjoner tett etter hvert anslag. Det fyller pausen mellom tonene uten to tydelige ekkoslag.' },
  { id: 'kick-room', source: 'kick', effect: 'room', hint: 'Etter slaget: lyder pausen tørr, eller hører du et rom rundt tromma?', why: 'I B får tromma en diffus hale som dør gradvis ut. Sammenlign med A: rommet fylles litt lenger etter hvert slag.' },
];

function shuffled(values, random) {
  const result = [...values];
  for (let end = result.length - 1; end > 0; end--) {
    const index = Math.floor(random() * (end + 1));
    [result[end], result[index]] = [result[index], result[end]];
  }
  return result;
}

export function makeListenRound(previous = [], random = Math.random) {
  const oldIds = new Set(previous.map(item => item.id));
  const candidates = shuffled(listenCases, random);
  const freshFirst = [...candidates.filter(item => !oldIds.has(item.id)), ...candidates.filter(item => oldIds.has(item.id))];
  const round = [];
  for (const item of freshFirst) {
    if (round.some(picked => picked.source === item.source || picked.effect === item.effect)) continue;
    round.push({ ...item, choices: shuffled(Object.keys(listenChanges), random) });
    if (round.length === 3) break;
  }
  return round;
}
