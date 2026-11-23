import { diagnosticIndex } from './diagnosticIndex.js';

// Each branch first isolates part of the chain, then exposes a specific follow-up.
// Readings are scripted observations for these exercises, not live measurements.
const probe = (id, label, point, reading, note, after = null, proof = false) =>
  ({ id, label, point, reading, note, after, proof });
const option = (id, text, outcome) => ({ id, text, outcome });

const cases = {
  'vocal-grit': {
    report: 'Verset er rent. På det sterkeste ordet i refrenget hører både du og sangeren et kort knas. Bare denne vokalen har problemet.',
    probes: [
      probe('in', 'Sjekk inngangsmåleren', 'Inngang', 'CLIP ved toppene', 'Indikatoren på inngangen blinker akkurat samtidig med ordet som knaser.'),
      probe('out', 'Les Main LR', 'Main LR', 'Topp −13 dBFS', 'Mixbussen har god margin, også når det knaser. Andre kilder låter rent.'),
      probe('pad', 'Sammenlign før og etter preamp', 'Preamp', 'Kilden er ren', 'En separat referanse fra samme mikrofon med lavere preamp-gain er ren. På mikserens inngang flater toppene ut før kanalprosesseringen.', 'in', true),
      probe('tap', 'Følg vokalen tilbake fra Main', 'Kanal', 'Feil før fader', 'Vokalens lyttepunkt rett etter inngangsomformeren knaser allerede. Inngangens klippindikator lyser; en uavhengig referanse med lavere gain er ren.', 'out', true),
    ],
    options: [
      option('fader', 'Senk kanalfaderen i salen.', 'Knaset blir svakere i salen, men formen er allerede ødelagt før faderen. Sangeren hører fortsatt feilen.'),
      option('gain', 'Reduser analog inngangsgain, og be om det sterkeste partiet igjen.'),
      option('comp', 'La kompressoren jobbe hardere.', 'Kompressoren får det forvrengte signalet inn. Den kan endre nivåforskjellen, men kan ikke gjenskape toppene.'),
    ],
    correct: 'gain', cause: 'Inngangen overstyres på de kraftigste stavelsene. Det skjer før kanalprosessering og før signalet deles til sal og monitor.',
    verify: 'La sangeren gjenta samme refreng. Inngangen skal ha margin, og ordet skal være rent i både monitor og sal. Kontroller begge nivåene igjen.',
    mixer: { node: 'preamp', mode: 'pro', label: 'Utforsk vokalens inngangsgain' },
  },
  'snare-tail': {
    report: 'Slaget har et tydelig knepp, men snerreteppet forsvinner brått. Trommeslageren hører en lengre hale akustisk.',
    probes: [
      probe('mic', 'Sjekk signalet før processing', 'Før gate', 'Naturlig utklinging', 'På lyttepunktet før gate og EQ lever halen videre etter anslaget.'),
      probe('gr', 'Les gateindikatoren', 'Gate', 'Åpner på slaget', 'Gaten åpner på hvert slag. Det er etter åpningen at forskjellen oppstår.'),
      probe('bypass', 'Sammenlign gate inn og ut', 'Bypass', 'Halen kommer tilbake', 'Med bare gaten bypasset er anslaget nesten uendret, men halen varer betydelig lenger.', 'mic', true),
      probe('time', 'Undersøk gate etter anslaget', 'Gate', 'Kort hold og release', 'Gaten går fra åpen til full demping mens snerreteppet fortsatt vibrerer. Med litt lengre hold/release blir halen med.', 'gr', true),
    ],
    options: [
      option('hpf', 'Hev høypassfilteret.', 'Bunnen blir tynnere. Filteret forklarer ikke at nivået stuper på ett bestemt tidspunkt etter hvert slag.'),
      option('boost', 'Øk inngangsgain til anslaget blir høyere.', 'Da endrer du nivået inn i hele kjeden. Test heller tidsforløpet i leddet der halen faktisk kuttes.'),
      option('hold', 'Forleng hold eller release på gaten, og sammenlign med bypass.'),
    ],
    correct: 'hold', cause: 'Her åpner gaten riktig, men lukker for raskt. Mer hold lar signalet passere litt lenger; release bestemmer hvor raskt dempingen kommer tilbake.',
    verify: 'Be om både svake og sterke slag. Sammenlign med bypass og sjekk at halen får plass uten at hi-hat-lekkasjen tar over mellom slagene.',
    mixer: { node: 'processing', mode: 'pro', tool: 'gate', label: 'Prøv gate på skarptromme' },
  },
  'monitor-follows': {
    report: 'Du trekker vokalen litt ned i salen for å få plass til pianoet. Sangeren melder at vokalen i øret også ble lavere. Bandet ønsker en uavhengig monitormiks.',
    probes: [
      probe('in', 'Les vokalens inngangsnivå', 'Inngang', 'Topp −16 dBFS', 'Ved samme innspilte frase ligger inngangsnivået fast uansett hvor kanalfaderen står.'),
      probe('aux', 'Sjekk vokalen i monitorbussen', 'Aux 1', 'Følger faderen', 'I denne testen er bare vokalen sendt til Aux 1. Når kanalfaderen senkes 6 dB, synker også Aux 1 med 6 dB.'),
      probe('tap', 'Les kanalens sendpunkt', 'Aux-send', 'POST FADER', 'Vokalsenden til Aux 1 henter signalet etter kanalfaderen. Sendnivået er uendret.', 'in', true),
      probe('auxmode', 'Følg Aux 1 tilbake til kanalen', 'Sendpunkt', 'Etter fader', 'Sendnivået og aux-masteren står fast. Vokalens sendpunkt i Aux 1 er satt til post-fade.', 'aux', true),
    ],
    options: [
      option('pre', 'Flytt vokalsenden til pre-fade, og avtal riktig monitornivå med sangeren.'),
      option('master', 'Øk aux-masteren.', 'Hele monitormiksen blir høyere, mens vokalen fortsatt følger salfaderen.'),
      option('gain', 'Hev inngangsgain når du senker faderen.', 'Dette endrer også nivået inn i prosesseringen og andre sendinger. Faderen er fortsatt koblet til monitorsenden.'),
    ],
    correct: 'pre', cause: 'Sangeren lytter til en post-fade-kopi. For denne uavhengige monitormiksen må akkurat denne senden hentes før kanalfaderen.',
    verify: 'Med samme frase og uendret sendnivå: senk salfaderen litt. Sangeren skal fortsatt høre samme vokalnivå. Endret inngangsgain kan fortsatt påvirke begge miksene.',
    mixer: { node: 'monitor_branch', mode: 'easy', label: 'Prøv pre/post med kvinnevokal' },
  },
  'piano-lr': {
    report: 'Etter et sceneskift hører pianisten begge hender i monitor. Vokal og gitar når salen som normalt, men pianoet mangler.',
    probes: [
      probe('ch', 'Sjekk pianokanalen før fader', 'Piano', 'Rene toner · −15 dBFS', 'Begge registrene er til stede på kanalens lyttepunkt. Faderen står på 0 dB, og kanalen er ikke mutet.'),
      probe('lr', 'Isoler piano i Main LR', 'Main LR', 'Ingen pianobidrag', 'Mens de andre er stille, viser monitorbussen piano. Main LR viser ingen respons på samme toner.'),
      probe('route', 'Les kanalens utgangstildeling', 'Tildeling', 'LR av · ingen gruppe', 'Pianokanalen går til monitorsenden. Verken direkte LR-tildeling eller en gruppevei til LR er aktiv.', 'ch', true),
      probe('path', 'Spor veien fra kanal til Main', 'Ruting', 'Mangler forbindelse', 'Rutekartet viser Aux 1, men ingen forbindelse fra piano til Main LR. Showplanen bruker direkte LR-tildeling her.', 'lr', true),
    ],
    options: [
      option('pan', 'Midtstill panorama.', 'Panorama flytter et eksisterende LR-signal mellom sidene. Det lager ingen forbindelse til bussen.'),
      option('assign', 'Slå på pianokanalens direkte tildeling til Main LR.'),
      option('matrix', 'Hev nivået på PA-matrixen.', 'Hele salen blir høyere. Pianoet er borte allerede før matrixen, så du får ikke pianoet tilbake.'),
    ],
    correct: 'assign', cause: 'Pianoets monitorvei er intakt. Den planlagte forbindelsen fra kanalen til Main LR mangler etter sceneskiftet.',
    verify: 'Spill noen toner alene. Se at Main LR nå reagerer, hør piano i salen, og kontroller at monitoren er uendret. Sjekk hvilket parameter scenen henter tilbake.',
    mixer: { node: 'mixbus', mode: 'easy', label: 'Utforsk pianokanalens Main-tildeling' },
  },
  'guitar-delay': {
    report: 'Gitaristen spiller på pulsen i 100 BPM. Det skal komme ett ekko en åttedel etter hvert anslag, men første ekko lander for sent.',
    probes: [
      probe('pulse', 'Sjekk bandets puls', 'Klikk', '100 BPM · firedel', 'Det er 600 ms mellom to klikk. En rett åttedel i dette tempoet varer halvparten.'),
      probe('wet', 'Undersøk effektreturen alene', 'FX-retur', 'Første ekko: 450 ms', 'Tilbakemeldingen kommer tydelig etter anslaget. Den ligger sent selv når du ser bort fra de senere gjentakelsene.'),
      probe('time', 'Sammenlign tid og noteverdi', 'Delay', '450 ms ≠ 300 ms', 'Delaytiden står på en punktert åttedel. Arrangøren ønsker en rett åttedel, altså 300 ms i dette tempoet.', 'pulse', true),
      probe('tap', 'Les delaytid mot tempo', 'Delay', 'Punktert åttedel', 'Effekten er satt til 450 ms. På 100 BPM er det tre firedeler av ett slag, ikke et halvt slag.', 'wet', true),
    ],
    options: [
      option('feedback', 'Senk feedback til bare ett ekko står igjen.', 'Da blir det færre gjentakelser, men den første kommer fortsatt etter 450 ms.'),
      option('send', 'Senk gitarsenden til delayet.', 'Ekkoet blir svakere. Tidspunktet for første gjentakelse er uendret.'),
      option('time', 'Sett delaytiden til 300 ms for en rett åttedel.'),
    ],
    correct: 'time', cause: 'Det er avstanden fra original til første ekko som er feil. Feedback bestemmer hvor mye som går en ny runde, ikke når første ekko begynner.',
    verify: 'Spill ett kort anslag på et klikk. Første ekko skal ligge midt mellom dette og neste klikk. Juster deretter antall gjentakelser og mengden effekt.',
    mixer: { node: 'fx_branch', mode: 'easy', tool: 'delay', label: 'Prøv delaytiden på gitar' },
  },
  'bass-body': {
    report: 'Elbassen kommer tydelig fram når strengene slås an, men de dype tonene mangler tyngde. Kick har fortsatt bunn i samme høyttalere.',
    probes: [
      probe('di', 'Undersøk DI før kanalfilteret', 'Inngang', 'Bunnen er til stede', 'I referansen før prosessering har lange, dype toner både anslag og kropp.'),
      probe('post', 'Sammenlign før og etter processing', 'Kanal', 'Endring i bunnen', 'På samme opptak er energien rundt 60–100 Hz betydelig svakere etter kanalens prosessering.'),
      probe('hpf', 'Les kanalfilteret', 'Filter', 'HPF 220 Hz · aktiv', 'Et høypassfilter fra et tidligere taleoppsett står igjen. De lave basstonene ligger godt under grensefrekvensen.', 'di', true),
      probe('bypass', 'Sammenlign med HPF bypasset', 'Bypass', 'Kroppen vender tilbake', 'Når bare høypassfilteret kobles ut, får tonen tilbake bunnen. Filteret sto på 220 Hz.', 'post', true),
    ],
    options: [
      option('hpf', 'Senk HPF-grensen, og sammenlign med filteret av.'),
      option('sub', 'Øk subnivået for hele bandet.', 'Det påvirker også kick og alle andre kilder. Her oppstår endringen i basskanalen, før summen.'),
      option('comp', 'Øk kompressorens make-up gain.', 'Da løftes hele signalet etter prosessering, også anslaget. Frekvensbalansen forblir skjev.'),
    ],
    correct: 'hpf', cause: 'Filteret slipper gjennom anslaget, men demper bassens grunnområde. Problemet sitter på denne kanalen, ikke i hele PA-anlegget.',
    verify: 'Veksle mellom bypass og en lavere grense mens bassisten spiller dype og høye toner. Behold nok kropp og sjekk balansen sammen med kick.',
    mixer: { node: 'processing', mode: 'pro', tool: 'hpf', label: 'Prøv høypass på bass' },
  },
};
export const diagnosticCases = diagnosticIndex.map(item => ({ ...item, ...cases[item.id] }));
