// One change per question: the labels describe audible differences, not console vocabulary.
export const listenChanges = {
  dark: { label: 'Toppen er dempet', name: 'Lavpass', tool: 'lpf', node: 'processing', setting: 'Lavpass ved 1,3 kHz' },
  thin: { label: 'Bunnen er dempet', name: 'Høypass', tool: 'hpf', node: 'processing', setting: 'Høypass ved 350 Hz' },
  echo: { label: 'Det er lagt til ekko', name: 'Delay', tool: 'delay', node: 'fx_branch', setting: 'Ekko etter 200 og 400 ms' },
  presence: { label: 'Mellomtonen er løftet', name: 'Parametrisk EQ', tool: 'peq', node: 'processing', setting: 'Klokkeløft ved 1,6 kHz' },
  pressed: { label: 'De sterke partiene er jevnet ut', name: 'Kompressor', tool: 'comp', node: 'processing', setting: 'Kompressor med forhold 6:1' },
  gated: { label: 'Svake partier kuttes av', name: 'Gate', tool: 'gate', node: 'processing', setting: 'Gate med 15 ms lukketid' },
  room: { label: 'Det er lagt til romklang', name: 'Romklang', tool: 'reverb', node: 'fx_branch', setting: 'Kort, diffus klanghale' },
};

export const listenTracks = {
  mixed: { label: 'Blandet', cue: 'Tre ulike miksegrep på tre forskjellige kilder.', effects: Object.keys(listenChanges) },
  tone: { label: 'EQ og filter', cue: 'Lytt til klangfarge: kropp, mellomtone og glans.', effects: ['dark', 'thin', 'presence'] },
  dynamics: { label: 'Dynamikk', cue: 'Skill mellom topper som dempes og svake toner som forsvinner.', effects: ['pressed', 'gated'] },
  space: { label: 'Rom og ekko', cue: 'Lytt i pausene: kan du telle gjentakelser, eller glir de sammen?', effects: ['echo', 'room'] },
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
  { id: 'male-presence', source: 'male', effect: 'presence', hint: 'Lytt til hvordan én vokal former en stavelse. Har B fått mer kant akkurat der?', why: 'Klokkefilteret løfter et bånd midt i stemmen. Stavelsene får mer fokus. Dyp bass og øverste diskant løftes ikke på samme måte.' },
  { id: 'guitar-presence', source: 'guitar', effect: 'presence', hint: 'Lytt til plukket av hver streng. Kommer plukket nærmere, eller blir hele strengen lysere?', why: 'Et løft rundt 1,6 kHz trekker frem plukket uten å åpne hele diskanten. Sammenlign med originalen og legg merke til den litt nasale fargen.' },
  { id: 'piano-presence', source: 'piano', effect: 'presence', hint: 'Velg ett anslag. Følg klangen like etter at tangenten treffer.', why: 'Mellomtonen i pianoet trer tydeligere frem i B. Et klokkefilter fremhever et avgrenset område, i motsetning til et filter som gradvis tar bort hele bunnen eller toppen.' },
  { id: 'voice-comp', source: 'female', effect: 'pressed', hint: 'Sammenlign den kraftigste delen av frasen med en svakere stavelse etterpå.', why: 'Kompressoren demper sterke stavelser mer enn svake. Når A og B får samme gjennomsnittsnivå, høres det som mindre nivåforskjell innad i frasen.' },
  { id: 'piano-comp', source: 'piano', effect: 'pressed', hint: 'Hør på styrkeforskjellen mellom anslaget og tonen som henger igjen.', why: 'Den raske kompressoren holder igjen den sterke starten av tonen. Etter nivåtilpasning får klangen mellom anslagene relativt mer plass.' },
  { id: 'snare-comp', source: 'snare', effect: 'pressed', hint: 'Hvor langt foran seidingen stikker det første slaget ut?', why: 'De kraftige delene av skarpslaget blir dempet forholdsvis mer enn halen. Forskjellen ligger i forholdet mellom anslag og etterklang, ikke i flere trommeslag.' },
  { id: 'bass-comp', source: 'bass', effect: 'pressed', hint: 'Følg flere bassnoter. Hvor stort sprang er det fra strengelyden til tonen?', why: 'Kompressoren reduserer toppen av de sterkeste tonene. Legg merke til forholdet mellom anslag og sustain når du bytter versjon midt i basslinjen.' },
  { id: 'snare-gate', source: 'snare', effect: 'gated', hint: 'Lytt til slutten av seidingen, ikke bare til første slag.', why: 'Gaten åpner for slaget, men demper den svake halen når nivået faller. Pausen virker tørrere selv om det ikke er fjernet noen romklang fra opptaket.' },
  { id: 'piano-gate', source: 'piano', effect: 'gated', hint: 'Følg en pianotone helt til den dør ut. Forsvinner den naturlig?', why: 'En høy terskel og kort lukketid demper den rolige delen av pianotonen. Dette er en tydelig øvelse i hvordan en gate kan fjerne musikalsk sustain.' },
  { id: 'voice-gate', source: 'male', effect: 'gated', hint: 'Følg de svakeste delene av frasen. Får alle stavelsene klinge ferdig?', why: 'Gaten lar de kraftige vokallydene passere, men demper de svakere overgangene. En så tydelig innstilling er lett å høre, men ofte for hard på vokal.' },
  { id: 'guitar-gate', source: 'guitar', effect: 'gated', hint: 'Følg en streng etter plukket. Hvor lenge får den klinge?', why: 'Anslagene går gjennom, mens svake toner og strengklang dempes når gaten lukker. På en akustisk gitar kan det høres ut som om noen stopper strengen tidlig.' },
  { id: 'guitar-echo', source: 'guitar', effect: 'echo', hint: 'Lytt etter om plukket kommer én eller flere ganger fra samme anslag.', why: 'Delayet spiller strengelyden tilbake to ganger, først etter 200 ms. Mønsteret av gjentakelser følger plukket i stedet for å danne en jevn klangflate.' },
  { id: 'voice-room', source: 'female', effect: 'room', hint: 'Hør om vokalen etterlater noe i rommet i de små pustepausene.', why: 'Tette refleksjoner gjør avslutningen av stavelsene mer romlig. Pausen fylles uten at ordene gjentas som tydelige kopier.' },
];

function shuffled(values, random) {
  const result = [...values];
  for (let end = result.length - 1; end > 0; end--) {
    const index = Math.floor(random() * (end + 1));
    [result[end], result[index]] = [result[index], result[end]];
  }
  return result;
}

export function makeListenRound(previous = [], random = Math.random, trackId = 'mixed') {
  const track = Object.hasOwn(listenTracks, trackId) ? listenTracks[trackId] : listenTracks.mixed;
  const oldIds = new Set(previous.map(item => item.id));
  const pool = shuffled(listenCases.filter(item => track.effects.includes(item.effect)), random);
  const ordered = [...pool.filter(item => !oldIds.has(item.id)), ...pool.filter(item => oldIds.has(item.id))];
  // Search rather than greedily picking: the last unused effect and the last
  // unused source must be compatible. Focused two-effect drills reuse an effect.
  const distinct = Math.min(3, track.effects.length);
  function pick(picked) {
    if (picked.length === 3) return new Set(picked.map(item => item.effect)).size === distinct ? picked : null;
    for (const next of ordered) {
      if (picked.some(item => item.source === next.source) || (distinct === 3 && picked.some(item => item.effect === next.effect))) continue;
      const round = pick([...picked, next]); if (round) return round;
    }
    return null;
  }
  return pick([]).map(item => {
    const distractors = shuffled(track.effects.filter(effect => effect !== item.effect), random).slice(0, 3);
    return { ...item, choices: shuffled([item.effect, ...distractors], random) };
  });
}
