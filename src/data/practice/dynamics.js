// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const dynamicsScenarios = [
  {
    "id": "comp-threshold",
    "level": 1,
    "title": "Kompressoren gjør ingenting",
    "nodeId": "processing",
    "question": "Kompressoren er aktiv, men gain reduction viser null. Signalets topper ligger under threshold. Hva undersøker du først?",
    "hint": "Kompressoren må møte signalet ved riktig terskel.",
    "lesson": "Threshold bestemmer når kompresjon begynner; ratio bestemmer hvor kraftig nivået over terskelen påvirkes.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Bare øke make-up gain",
        "feedback": "Make-up øker utgangsnivået, men flytter ikke terskelen ned til signalet."
      },
      {
        "text": "Senke threshold kontrollert og følge gain reduction",
        "feedback": "Riktig. Da kommer signalet over terskelen. Lytt til hvordan kompresjonen påvirker uttrykket.",
        "correct": true
      },
      {
        "text": "Øke threshold enda mer",
        "feedback": "Da blir det enda mindre sannsynlig at signalet når terskelen."
      }
    ]
  },
  {
    "id": "comp-ratio-math",
    "level": 3,
    "title": "Hva betyr 4:1 i praksis?",
    "nodeId": "processing",
    "question": "I en idealisert hard-knee-kompressor ligger et stabilt signal 8 dB over threshold. Ratio er 4:1, uten make-up gain. Hvor langt over threshold blir utgangen?",
    "hint": "Del nivået over terskelen på ratioen. Se bort fra attack og release i denne modellen.",
    "lesson": "4:1 betyr at 4 dB inn over terskelen blir 1 dB ut over terskelen i den idealiserte statiske kurven.",
    "sourceId": "yamahaComp",
    "options": [
      {
        "text": "2 dB over threshold",
        "feedback": "Riktig: 8 / 4 = 2 dB. Gain reduction er dermed 6 dB i denne forenklede situasjonen.",
        "correct": true
      },
      {
        "text": "4 dB over threshold",
        "feedback": "Det ville tilsvare 2:1 for et signal som er 8 dB over terskelen."
      },
      {
        "text": "8 dB over threshold",
        "feedback": "Det ville bety ingen kompresjon av nivået over terskelen."
      }
    ]
  },
  {
    "id": "comp-attack-transient",
    "level": 2,
    "title": "Skarptrommen mistet anslaget",
    "nodeId": "processing",
    "question": "Skarptrommen blir flat når kompressoren er aktiv. Attack er svært kort, og første anslag klemmes tydelig ned. Hva kan du prøve?",
    "hint": "Attack påvirker hvor raskt kompresjonen griper inn.",
    "lesson": "Attack er også en formingskontroll for transienter. Lengre attack kan slippe gjennom mer anslag.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Kortere attack og mer kompresjon",
        "feedback": "Det kan dempe anslaget enda mer."
      },
      {
        "text": "Mer make-up gain uten å endre noe annet",
        "feedback": "Da blir den flate lyden høyere, men forholdet mellom anslag og kropp endres ikke på samme måte."
      },
      {
        "text": "Litt lengre attack og ny vurdering av toppene",
        "feedback": "Riktig. Prøv å bevare anslaget, samtidig som du kontrollerer at toppnivået fortsatt er passende.",
        "correct": true
      }
    ]
  },
  {
    "id": "comp-release-pumping",
    "level": 2,
    "title": "Nivået puster unaturlig",
    "nodeId": "processing",
    "question": "Vokalkompressoren reduserer mye og slipper svært raskt mellom stavelsene. Bakgrunnslyden hopper opp og ned. Hva er et godt forsøk?",
    "hint": "Tenk både på mengden reduksjon og tiden tilbake til normalt nivå.",
    "lesson": "Release må passe kilden; unødvendig hard kompresjon kan gjøre rom og lekkasje mer merkbar.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Øke make-up gain betydelig",
        "feedback": "Da blir også den varierende bakgrunnslyden mer fremtredende."
      },
      {
        "text": "Prøve roligere release og mindre gain reduction",
        "feedback": "Riktig. Lytt til overgangen mellom ordene og finn en innstilling som følger fraseringen bedre.",
        "correct": true
      },
      {
        "text": "Senke threshold mye og korte ned release ytterligere",
        "feedback": "Det kan forsterke nettopp pustingen du prøver å redusere."
      }
    ]
  },
  {
    "id": "gate-tail",
    "level": 1,
    "title": "Tammen mister siste del av tonen",
    "nodeId": "processing",
    "question": "En gate åpner fint på tammeslagene, men klipper av den naturlige utklingen for brått. Hva justerer du?",
    "hint": "Problemet er etter slaget, ikke før det.",
    "lesson": "Hold og release påvirker hvor lenge gaten holder åpent og hvor mykt den lukker.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Prøve lengre hold eller release, og eventuelt mindre depth",
        "feedback": "Riktig. La trommen klinge naturlig mens du fortsatt reduserer uønsket lekkasje.",
        "correct": true
      },
      {
        "text": "Bare øke threshold kraftig",
        "feedback": "Det kan gjøre svake slag vanskeligere å åpne gaten med, uten å gi en naturlig hale."
      },
      {
        "text": "Senke kanalfaderen",
        "feedback": "Det gjør både slag og avkuttet hale svakere, men retter ikke gateforløpet."
      }
    ]
  },
  {
    "id": "gate-key-filter",
    "level": 3,
    "title": "Skarptrommens gate åpner på basstrommen",
    "nodeId": "processing",
    "question": "Skarptrommegaten åpner stadig på lekkasje fra basstrommen. Høyere threshold mister de svake skarpslagene. Hva kan hjelpe?",
    "hint": "Detektoren trenger ikke lytte like mye til alle frekvenser.",
    "lesson": "Sidechain-filter former hva detektoren reagerer på; det er ikke det samme som EQ på hovedlyden.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Boost bass på skarptrommekanalen",
        "feedback": "Det kan fremheve lekkasjen, og løser ikke målrettet hva gaten trigges av."
      },
      {
        "text": "Bruke en ekstremt høy threshold",
        "feedback": "Da risikerer du å miste enda flere av de ønskede svake slagene."
      },
      {
        "text": "Filtrere gate-detektoren mot skarptrommens nyttige område",
        "feedback": "Riktig. Lytt til key-signalet og finjuster filter og terskel. Mikrofonplassering er også viktig.",
        "correct": true
      }
    ]
  }
];
