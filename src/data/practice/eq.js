// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const eqScenarios = [
  {
    "id": "eq-hpf-rumble",
    "level": 1,
    "title": "Trinn og rumling i talemikrofonen",
    "nodeId": "processing",
    "question": "Talemikrofonen tar opp dyp rumling fra scenen. Stemmen trenger ikke dette bassområdet. Hva er et målrettet første verktøy?",
    "hint": "Fjern det uønskede området uten å senke hele stemmen.",
    "lesson": "Et høypassfilter demper lave frekvenser. Still det med ørene, slik at stemmen beholder nødvendig fylde.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Senke hele kanalfaderen",
        "feedback": "Da senker du stemmen og rumlingen samtidig."
      },
      {
        "text": "Aktivere HPF og justere frekvensen mens du lytter",
        "feedback": "Riktig. Løft grensen forsiktig til rumlingen reduseres uten at stemmen blir unødvendig tynn.",
        "correct": true
      },
      {
        "text": "Øke bassbåndet",
        "feedback": "Det vil vanligvis forsterke nettopp området du ønsker å redusere."
      }
    ]
  },
  {
    "id": "eq-hpf-too-high",
    "level": 1,
    "title": "Stemmen mistet kroppen",
    "nodeId": "processing",
    "question": "Etter en høy HPF-innstilling høres en dyp talestemme tynn ut. Hva prøver du først?",
    "hint": "Filteret kan ha fjernet nyttig energi sammen med støyen.",
    "lesson": "HPF er ikke en konkurranse om høyest mulig frekvens. Tilpass filteret til kilden.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Senke HPF-grensen og sammenligne klangen",
        "feedback": "Riktig. Finn balansen mellom mindre rumling og bevart stemmekropp.",
        "correct": true
      },
      {
        "text": "Øke diskanten for å gjøre stemmen større",
        "feedback": "Mer diskant erstatter ikke den lave energien som filteret har fjernet."
      },
      {
        "text": "Heve HPF-grensen ytterligere",
        "feedback": "Det fjerner enda mer av det lave registeret."
      }
    ]
  },
  {
    "id": "eq-narrow-resonance",
    "level": 2,
    "title": "Én tone stikker ut",
    "nodeId": "processing",
    "question": "En gitarmikrofon har en tydelig, smal resonans rundt én frekvens. Resten av klangen fungerer. Hva er mest presist?",
    "hint": "Båndbredden bør passe bredden på problemet.",
    "lesson": "Bruk et avgrenset EQ-inngrep for en avgrenset resonans, og kontroller resultatet i miksen.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Senke hele mellomtoneregisteret kraftig",
        "feedback": "Da fjerner du mye nyttig klang som ikke er del av resonansen."
      },
      {
        "text": "Øke gain for å skjule resonansen",
        "feedback": "Hele signalet blir sterkere, inkludert resonansen."
      },
      {
        "text": "Dempe et smalt PEQ-bånd rundt resonansen",
        "feedback": "Riktig. Juster frekvens, bredde og mengde med lytting, uten å skjære mer enn nødvendig.",
        "correct": true
      }
    ]
  },
  {
    "id": "eq-masking",
    "level": 2,
    "title": "Pianoet skjuler ordene",
    "nodeId": "processing",
    "question": "Vokalen er tydelig alene, men ordene forsvinner når pianoet spiller tett i samme register. Ingen kanaler klipper. Hva er et godt neste forsøk?",
    "hint": "To gode sololyder kan konkurrere når de summeres.",
    "lesson": "Vurder klang og nivå i sammenheng. Plass i miksen kan skapes på den konkurrerende kilden.",
    "sourceId": "yamahaMix",
    "options": [
      {
        "text": "Gi alle instrumenter mer presence",
        "feedback": "Det kan øke konkurransen i området der vokalen skal være tydelig."
      },
      {
        "text": "Justere pianonivå eller dempe litt i det konkurrerende området",
        "feedback": "Riktig. Prøv små endringer mens begge spiller, og vurder også arrangementet.",
        "correct": true
      },
      {
        "text": "Legge lang klang på vokalen",
        "feedback": "Det kan gjøre ordene mindre tydelige uten å løse maskeringen."
      }
    ]
  },
  {
    "id": "eq-level-matched",
    "level": 2,
    "title": "EQ-en høres alltid bedre ut",
    "nodeId": "processing",
    "question": "En ny EQ-innstilling låter mer imponerende, men er også mye høyere enn bypass. Hvordan gjør du en mer nyttig sammenligning?",
    "hint": "Høyere lyd oppfattes ofte som mer overbevisende.",
    "lesson": "Sammenlign ved omtrent samme opplevde nivå når du vurderer selve klangendringen.",
    "sourceId": "yamahaMix",
    "options": [
      {
        "text": "Nivåtilpasse sammenligningen og lytte i hele miksen",
        "feedback": "Riktig. Da blir det lettere å vurdere klangen i stedet for bare nivåøkningen.",
        "correct": true
      },
      {
        "text": "Velge innstillingen med høyest toppmeter",
        "feedback": "Toppnivå alene sier ikke hvilken klang som passer best."
      },
      {
        "text": "Beholde alle EQ-boostene fordi det låter sterkere",
        "feedback": "Sterkere kan forveksles med bedre og gir dessuten mindre nivåmargin."
      }
    ]
  },
  {
    "id": "eq-deesser-choice",
    "level": 3,
    "title": "Bare S-lydene er skarpe",
    "nodeId": "processing",
    "question": "Vokalen har fin klang, men enkelte S-lyder blir skarpe. Et fast diskantkutt gjør resten av stemmen matt. Hva vil du prøve?",
    "hint": "Problemet oppstår bare når et bestemt frekvensområde blir for sterkt.",
    "lesson": "Dynamisk frekvensbehandling kan gripe inn ved behov, i stedet for å dempe området hele tiden.",
    "sourceId": "fxModels",
    "options": [
      {
        "text": "Senke alle høye frekvenser enda mer hele tiden",
        "feedback": "Da blir også de gode partiene mørkere."
      },
      {
        "text": "Øke bredbåndskompressorens make-up gain",
        "feedback": "Det løfter hele signalet og er ikke en målrettet behandling av S-lydene."
      },
      {
        "text": "Bruke de-esser eller et dynamisk EQ-bånd i problemområdet",
        "feedback": "Riktig. Juster deteksjon og reduksjon mens du lytter, slik at behandlingen ikke gir lesping eller tap av tydelighet.",
        "correct": true
      }
    ]
  }
];
