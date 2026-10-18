export const audioSources = [
  { id: 'male', label: 'Mannsvokal', detail: 'Kort sunget frase · 3 s', author: 'Apisov', soundId: 496234, color: '#60a5fa', focus: 'Lytt til kropp, tydelighet og variasjonen mellom stavelsene.', eqHz: 2500, hpf: 90 },
  { id: 'female', label: 'Kvinnevokal', detail: 'Sunget melodi · 12 s', author: 'buggly', soundId: 505438, color: '#c084fc', focus: 'Behold fylden og lytt til hvordan toppen og pustelydene endres.', eqHz: 3500, hpf: 120 },
  { id: 'piano', label: 'Piano', detail: 'Pianofrase · 12 s', author: 'josefpres', soundId: 874647, color: '#2dd4bf', focus: 'Lytt til anslaget og klangen som blir igjen mellom tonene.', eqHz: 1800, hpf: 60 },
  { id: 'bass', label: 'Bass', detail: 'Bassgitar-loop · 2,2 s', author: 'josefpres', soundId: 483926, color: '#fbbf24', focus: 'Følg grunntonen og hvor jevnt de forskjellige tonene kommer fram.', eqHz: 120, hpf: 35 },
  { id: 'guitar', label: 'Gitar', detail: 'Akustisk gitar · 12 s', author: 'smallclone', soundId: 693197, color: '#fb923c', focus: 'Skill mellom kroppen i instrumentet og anslaget på strengene.', eqHz: 300, hpf: 80 },
  { id: 'kick', label: 'Kick', detail: 'Akustisk basstromme · gjentas', author: 'dossantosbarbosa', soundId: 221144, color: '#fb7185', focus: 'Lytt etter både den dype kroppen og det korte anslaget.', eqHz: 65, hpf: 30 },
  { id: 'snare', label: 'Skarp', detail: 'Akustisk skarptromme · gjentas', author: 'dossantosbarbosa', soundId: 221143, color: '#e2e8f0', focus: 'Følg anslaget, kroppen og seidingen etter hvert slag.', eqHz: 200, hpf: 80 },
].map(source => ({ ...source, file: `/audio/${source.id}.mp3`, sourceUrl: `https://freesound.org/people/${source.author}/sounds/${source.soundId}/` }));

export function audioLesson(source, node, panel) {
  if (node === 'input') return { text: `${source.focus} Klippet gjentas, slik at du kan gjøre én endring om gangen.`, label: 'Utforsk EQ', node: 'processing', panel: 'eq', patch: { eqHz: source.eqHz } };
  if (node === 'preamp') return { text: 'Løft gain forsiktig og følg toppene. Overstyring skjer før faderen: senker du faderen etterpå, blir den forvrengte lyden bare svakere.' };
  if (node === 'processing') {
    if (panel === 'hpf') return { text: `Start rundt ${source.hpf} Hz og øk sakte. Hør når kroppen i ${source.label.toLowerCase()} blir for tynn. Dette er et lytteforsøk, ikke en fasit.`, label: `Prøv HPF ved ${source.hpf} Hz`, node, panel, patch: { hpf: true, hpfHz: source.hpf, bypass: false } };
    if (panel === 'eq') return { text: `Prøv et lite løft og kutt rundt ${source.eqHz} Hz. Sammenlign med Original. Flytt frekvensen for å finne området som faktisk trenger endring.`, label: `Prøv −4 dB ved ${source.eqHz} Hz`, node, panel, patch: { eq: -4, eqHz: source.eqHz, bypass: false } };
    if (panel === 'gate') return { text: ['kick','snare'].includes(source.id) ? 'Løft terskelen til halen blir kortere. For høy terskel kan også fjerne svake slag. Gaten her har fast hold og release.' : 'Løft terskelen sakte. Legg merke til om svake toner, pust eller slutten av ord forsvinner. Gate er ikke alltid riktig løsning.' };
    return { text: 'Senk terskelen og se gain reduction. Lytt til anslag og nivåforskjeller. En lavere lyd er ikke automatisk en bedre lyd; bruk Original som referanse.', label: 'Prøv moderat kompresjon', node, panel: 'comp', patch: { compressor: true, threshold: -30, ratio: 3, bypass: false } };
  }
  if (node === 'fader') return { text: 'Dra faderen ned mens klippet spiller. Nivået endres, mens EQ- og kompressorinnstillingene beholdes. Panorama høres best med hodetelefoner.' };
  if (node === 'monitor_branch') return { text: 'Velg Monitor som lyttepunkt i Lydvalg. Veksle mellom pre og post, og dra kanalfaderen ned. Pre-fade fortsetter selv om lyden i Main forsvinner.' };
  if (node === 'fx_branch') return { text: 'Lytt mellom frasene eller slagene. Klang fyller pausene med en hale; delay gir tydelige gjentakelser. Begynn med lite send og øk til du hører forskjellen.', label: 'Prøv en kort klang', node, panel: 'send', patch: { fxType: 'reverb', decay: 1.2, fxSend: -8, fxReturn: true, returnLevel: 0 } };
  if (node === 'mixbus') return { text: 'Main summerer tørr kanal og effektretur. Slå av Til Main LR for å høre bare effekten, hvis FX-senden og returen er åpne.' };
  if (node === 'matrix') return { text: 'Velg PA som lyttepunkt. Matrix-faderen demper denne sonen, mens måleren for Main LR fortsetter som før.' };
  return { text: 'Velg PA som lyttepunkt. Slå av PA-utgangen og følg signalet bakover: signal i Main er ikke alltid det samme som lyd framme i denne sonen.' };
}
