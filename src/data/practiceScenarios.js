// Short learning cases, checked against the linked Allen & Heath reference sections.
const routingSource = 'https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing';
const processingSource = 'https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen';

export const practiceScenarios = [
  {
    id: 'monitor-pre-fade', tag: 'Monitor', title: 'Vokalen forsvinner i øret', nodeId: 'monitor_branch',
    question: 'Du senker vokalfaderen i salen. Vokalisten mister samtidig nivå i monitoren. Hva undersøker du først?',
    hint: 'Tenk på hvor monitoren henter signalet i forhold til kanalfaderen.',
    options: [
      { text: 'Øke preamp-gain', feedback: 'Det endrer inngangsnivået og kan påvirke flere mikser. Undersøk monitorens send først.' },
      { text: 'Sjekke om monitor-senden er post-fade', correct: true, feedback: 'Riktig. En post-fade send følger kanalfaderen. Pre-fade gjør monitoren uavhengig av denne faderbevegelsen.' },
      { text: 'Legge mer kompresjon på vokalen', feedback: 'Kompresjon løser ikke koblingen mellom kanalfaderen og monitor-senden.' },
    ],
    source: routingSource,
  },
  {
    id: 'send-assignment', tag: 'Routing', title: 'Signal på kanalen, stille i Aux', nodeId: 'monitor_branch',
    question: 'Kanalen har signal og Aux-sendnivået er oppe. I Routing vises send-baren bare som et omriss. Hva sjekker du?',
    hint: 'Nivå og tilordning er to separate ting.',
    options: [
      { text: 'Om kanalen er tilordnet miksen (On/Off)', correct: true, feedback: 'Riktig. Omrisset viser at kanalen ikke er tilordnet miksen. Kontroller tilordningen før du øker nivået.' },
      { text: 'Om kanalen trenger mer diskant', feedback: 'EQ påvirker klangen, men aktiverer ikke en send som er slått av.' },
      { text: 'Om scenen har riktig navn', feedback: 'Navnet endrer ikke signalroutingen. Se etter kanalens tilordning til miksen.' },
    ],
    source: routingSource,
  },
  {
    id: 'active-mix', tag: 'Arbeidsflyt', title: 'Tilbake til salen', nodeId: 'fader',
    question: 'Du er ferdig med å justere en monitormiks med Mix-knappen. Hva kontrollerer du før du fortsetter å mikse salen?',
    hint: 'Samme fader kan styre ulike nivåer avhengig av aktiv miks.',
    options: [
      { text: 'At alle kanalene har samme gain', feedback: 'Kildene trenger ulike gaininnstillinger. Dette avgjør heller ikke hvilken miks faderne styrer.' },
      { text: 'At alle effekter er slått av', feedback: 'Effektene trenger ikke slås av. Kontroller hvilken miks som er aktiv.' },
      { text: 'At Mix er avsluttet og hovedmiksen er aktiv', correct: true, feedback: 'Riktig. Allen & Heath anbefaler å gå tilbake til hovedmiksen etter at en annen miks er justert.' },
    ],
    source: processingSource,
  },
];
