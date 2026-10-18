import { createProSettings } from './proAudioSettings.js';

// Deliberately modest listening experiments for our seven clips. These are not
// manufacturer presets or rules inferred from a singer's gender.
const recipes = {
  male: { hpf: 80, eq: [[120, 0], [250, -2], [2800, 2], [10000, 1]], comp: [-26, 3, 15, 160], note: 'Lytt til om kuttet rundt 250 Hz rydder opp uten å ta bort fylden. Et lite løft i mellomtonen kan gjøre ordene tydeligere.', gate: 'La gaten være av først. Denne korte frasen har svake avslutninger som lett blir kuttet bort.' },
  female: { hpf: 100, eq: [[150, 0], [350, -2], [3500, 1.5], [10000, 1]], comp: [-26, 2.5, 20, 180], note: 'Prøv forsiktig rydding i lav mellomtone. Vurder om løftet ved 3,5 kHz gir tydelighet eller blir skarpt. Pust og s-lyder skal ikke dominere.', gate: 'Begynn uten gate. Hør spesielt på pust, lave toner og slutten av frasene før du eventuelt øker terskelen.' },
  piano: { hpf: 40, eq: [[100, 0], [300, -1.5], [2500, 1], [10000, 0.5]], comp: [-22, 2, 30, 250], note: 'La de lave tonene beholde kroppen. Sammenlign et lite kutt ved 300 Hz og lytt til anslaget ved 2,5 kHz.', gate: 'Behold etterklangen mellom tonene. Gate er avslått i forslaget fordi pianohalen er en del av instrumentet.' },
  bass: { hpf: 30, eq: [[80, 2], [250, -2], [1000, 1], [5000, -1]], comp: [-26, 4, 25, 180], note: 'Sammenlign bunnen ved 80 Hz med tydeligheten ved 1 kHz. Følg nivåforskjellen mellom tonene, ikke bare den sterkeste tonen.', gate: 'Gate er av. En bassnote kan være ønsket selv når den har blitt svak. Prøv heller kontrollert kompresjon først.' },
  guitar: { hpf: 80, eq: [[120, 0], [250, -2], [3000, 1], [9000, 1]], comp: [-24, 2.5, 20, 200], note: 'Lytt etter resonans fra gitarkassen rundt 250 Hz. Behold det naturlige anslaget når du legger til tydelighet høyere opp.', gate: 'Gate er av for å beholde strenger og rom mellom anslagene. Prøv liten depth hvis du vil utforske demping av pausene.' },
  kick: { hpf: 30, eq: [[65, 3], [300, -3], [3500, 2], [10000, 0]], comp: [-24, 4, 25, 120], note: '65 Hz gir et forsøk på mer kropp, 300 Hz på mindre bokslyd og 3,5 kHz på tydeligere anslag. Sammenlign ett bånd om gangen.', gate: 'Prøv å rydde opp etter slaget uten å klippe bort kroppen. Sidechain-filteret fokuserer utløseren på bunnen.', gateSettings: { enabled: true, threshold: -35, depth: 25, attack: 0.1, hold: 50, release: 120, keyEnabled: true, keyHPF: 40, keyLPF: 200 } },
  snare: { hpf: 80, eq: [[200, 2], [650, -2], [3500, 2], [9000, 1]], comp: [-24, 4, 15, 120], note: 'Lytt til kropp ved 200 Hz, eventuell ringing i mellomtonen og seiding høyere opp. Behold hele slaget før du vurderer mer kutt.', gate: 'La seidingen få leve etter anslaget. Hvis halen blir unaturlig, øk hold/release eller senk depth.', gateSettings: { enabled: true, threshold: -32, depth: 20, attack: 0.1, hold: 70, release: 160, keyEnabled: true, keyHPF: 150, keyLPF: 6000 } },
};

export function proSourceLesson(sourceId) {
  const recipe = recipes[sourceId];
  if (!recipe) return null;
  const settings = createProSettings();
  settings.filters = { ...settings.filters, hpf: true, hpfHz: recipe.hpf };
  settings.eq.bands = settings.eq.bands.map((band, index) => ({ ...band, frequency: recipe.eq[index][0], gain: recipe.eq[index][1], type: index === 3 ? 'highshelf' : 'peaking' }));
  settings.gate = { ...settings.gate, ...recipe.gateSettings };
  const [threshold, ratio, attack, release] = recipe.comp;
  settings.comp = { ...settings.comp, enabled: true, threshold, ratio, attack, release };
  return { settings, eq: recipe.note, gate: recipe.gate,
    filter: `Prøv høypass ved ${recipe.hpf} Hz. Flytt det opp til du hører at nyttig kropp forsvinner, og trekk det så tilbake. Lavpass starter avslått.`,
    comp: `Start med ${ratio}:1, ${attack} ms attack og ${release} ms release. Juster terskelen etter de faktiske toppene. Prøv omtrent 2–4 dB gain reduction på sterke partier, og vurder om anslaget fortsatt lever.`,
  };
}

export const proHelp = {
  preamp: { title: 'Gain og trim har ulike jobber', intro: 'Still inngangen før du behandler klangen. Klipping før trim kan ikke repareres lenger ute i kjeden. Opptakene bruker ingen fysisk mikrofoninngang; 48 V, socket-patching og gain tracking er derfor ikke kontroller her.', fields: [
    ['Gain', 'Løft inngangen mens du følger toppene. La det være margin til neste, sterkere slag eller stavelse.'],
    ['Trim', 'Juster kanalnivået etter den modellerte inngangen. Sammenlign +6 dB trim med +6 dB gain når inngangen allerede klipper.'],
    ['Polarity', 'Snur bølgens fortegn. En kilde alene kan låte likt; forskjellen blir viktig når den summeres med en annen mikrofon. Her ser du vendingen i bølgen.'],
  ] },
  filter: { title: 'Behold det nyttige frekvensområdet', intro: 'Filterkurven viser hvilke deler av lyden som dempes. Grensefrekvensen er ikke en brå vegg.', fields: [
    ['HPF', 'Prøv å fjerne rumling uten å gjøre stemmen eller instrumentet tynt. Høyere frekvens fjerner mer bunn.'],
    ['Bratthet', '24 dB/okt kutter raskere enn 12 dB/okt. Sammenlign hvor mye som er igjen én oktav under grensen.'],
    ['LPF', 'Kan dempe hiss og unødvendig topp. For lav grense kan gjøre anslag og konsonanter matte.'],
  ] },
  peq: { title: 'Fire bånd. Ett bevisst grep om gangen.', intro: 'Dette er en parametrisk EQ med grafisk styring. Dra et farget punkt vannrett for frekvens og loddrett for gain, eller bruk kontrollene. Den gule linjen viser filtre og PEQ samlet. RTA viser energien i opptaket etter PEQ; skalaen er separat.', fields: [
    ['Frekvens', 'Velg området du vil lytte nærmere til. LF, LM, HM og HF er navn på bånd; alle kan flyttes over hele området.'],
    ['Gain', 'Positiv verdi løfter, negativ verdi kutter. Prøv små endringer og sammenlign før du legger til flere bånd.'],
    ['Width', 'Bredde i oktaver: liten verdi gir et smalt inngrep, stor verdi påvirker et større område. Width gjelder klokkeformen i denne modellen.'],
    ['Type', 'Klokke former et område. Hylle løfter eller kutter hele bunnen/toppen. LF kan også være høypass, HF lavpass; gain og width brukes da ikke.'],
    ['Inn / ut', 'Sammenlign ett bånd eller hele EQ-en uten å slette innstillingene. Filterne har egne brytere.'],
  ] },
  gate: { title: 'La riktig lyd åpne porten', intro: 'Gate er et verktøy for pausene. Start med moderat demping og lytt etter svake slag, pust og haler som du vil beholde.', fields: [
    ['Threshold', 'Finn et skille mellom uønsket bakgrunn og de svakeste ønskede lydene. Nivået her er dBFS, ikke dLives analoge dBu-skala.'],
    ['Depth', 'Prøv 10 dB og deretter 40 dB. Kraftig demping kan gjøre pausene unaturlig tomme. 0 dB gir ingen demping.'],
    ['Attack', 'For treg åpning kan spise trommeanslaget. For rask åpning kan høres brå ut. Sammenlign på samme slag.'],
    ['Hold', 'La porten stå åpen en liten stund etter at lyden faller. Øk hvis den hakker mellom små nivåvariasjoner.'],
    ['Release', 'Form slutten av tonen. En lengre lukking lar kroppen og etterklangen dø mer naturlig ut.'],
    ['Sidechain', 'Filtrerer bare signalet som avgjør når porten åpner. Selve lyden beholder frekvensene sine. Her brukes kanalens egen lyd, ikke en ekstern kilde.'],
  ] },
  comp: { title: 'Kontroller toppene uten å miste livet', intro: 'Den blå kurven viser forholdet mellom inn- og utnivå ved stabilt signal. Punktet og GR viser faktisk avspilling. Tider, detektor og parallell miks gjør at øyeblikksmålingen kan avvike fra kurven.', fields: [
    ['Threshold og ratio', 'Senk terskelen til ønskede topper blir kontrollert. Høy ratio er kraftigere; 1:1 beholder nivåforskjellen.'],
    ['Attack', 'Prøv rask og langsom respons på et trommeslag. Langsommere attack kan slippe mer av anslaget gjennom.'],
    ['Release', 'Lytt etter pumping og om nivået rekker å hente seg inn før neste slag. Tilpass tiden til rytmen.'],
    ['Knee', 'Et bredere kne gjør overgangen rundt terskelen mykere. Kurven lar deg se hvor kompresjonen gradvis begynner.'],
    ['Peak / RMS', 'Peak følger korte topper. RMS bruker et gjennomsnitt av energien og reagerer annerledes på svært korte slag. Sammenlign GR med samme terskel.'],
    ['Make-up', 'Løft bare nok til en rimelig sammenligning. Modellen legger ikke til automatisk nivåkompensasjon.'],
    ['Wet', '100 % er bare komprimert lyd. Lavere verdi blander inn ubehandlet lyd med samme timing – parallell kompresjon.'],
    ['Sidechain', 'Et høypass i detektoren kan hindre at dyp bass styrer all kompresjonen. Det fjerner ikke bassen fra det hørbare signalet.'],
  ] },
  bypass: { title: 'Sammenlign og behold innstillingene', intro: 'Bypass kobler ut filtre, gate, PEQ og kompressor. Gain, trim, fader, effekter og ruting er fortsatt aktive. Original-knappen øverst er en egen referanse før hele miksen.', fields: [
    ['Enkel / Pro', 'Begge beholder egne prosessorinnstillinger mens du bytter. Gain, fader, effekter og ruting deles. Et modusbytte kan derfor endre lyden.'],
    ['Nettlesermodell', 'Kontrollene er inspirert av dLive. Dette er vår egen lydbehandling; DEEP, Dyn8, eksterne inserts og hele mikserens kanalbank er ikke simulert.'],
  ] },
};
