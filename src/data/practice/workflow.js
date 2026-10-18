// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const workflowScenarios = [
  {
    "id": "active-mix",
    "level": 1,
    "title": "Tilbake til salen",
    "nodeId": "fader",
    "question": "Du er ferdig med å justere en monitormiks med Mix-knappen. Hva kontrollerer du før du fortsetter å mikse salen?",
    "hint": "Samme fader kan styre ulike nivåer avhengig av aktiv miks.",
    "lesson": "Gjør det til en vane å sjekke Active Mix før du flytter faderne.",
    "sourceId": "processing",
    "options": [
      {
        "text": "At alle kanalene har samme gain",
        "feedback": "Kildene trenger ulike gaininnstillinger. Dette avgjør heller ikke hvilken miks faderne styrer."
      },
      {
        "text": "At alle effekter er slått av",
        "feedback": "Effektene trenger ikke slås av. Kontroller hvilken miks som er aktiv."
      },
      {
        "text": "At Mix er avsluttet og hovedmiksen er aktiv",
        "feedback": "Riktig. Gå tilbake til hovedmiksen når du er ferdig med den andre miksen.",
        "correct": true
      }
    ]
  },
  {
    "id": "workflow-sel-channel",
    "level": 1,
    "title": "Du EQ-er feil vokalist",
    "nodeId": "processing",
    "question": "Du flyttet nettopp faderen til Vokal 2, men skjermen viser fortsatt Vokal 1. Hva bør du gjøre før du endrer EQ?",
    "hint": "Faderbevegelse og kanalvalg er ikke det samme.",
    "lesson": "Bekreft valgt kanal i skjermen før du endrer prosessering.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Velge Vokal 2 med Sel og kontrollere kanalnavnet",
        "feedback": "Riktig. Da bekrefter du at EQ-kontrollene gjelder kanalen du faktisk vil endre.",
        "correct": true
      },
      {
        "text": "Anta at sist flyttede fader alltid velges automatisk",
        "feedback": "Det er ikke en trygg antakelse. Se på valgt kanal og gjeldende oppsett."
      },
      {
        "text": "Åpne monitorens Mix-knapp i stedet",
        "feedback": "Mix velger en miks å arbeide med; det erstatter ikke kontroll av riktig kanalvalg for EQ."
      }
    ]
  },
  {
    "id": "workflow-layer",
    "level": 1,
    "title": "Kanalen har «forsvunnet»",
    "nodeId": "fader",
    "question": "Etter et lagbytte ser du ikke gitarkanalen på C3500-faderne. Lyden går fortsatt. Hva sjekker du før du endrer patch?",
    "hint": "Faderflaten er en visning av kanaler, ikke selve lydforbindelsen.",
    "lesson": "Lag og Strip Assign bestemmer hvilke kanaler du ser. Kanalens lydvei kan fortsatt være intakt.",
    "sourceId": "surface",
    "options": [
      {
        "text": "Om gitarens lydkabel må flyttes til en ny inngang",
        "feedback": "Kanalen kan fortsatt fungere normalt selv om den ikke er synlig på aktivt lag."
      },
      {
        "text": "Aktivt lag og kanalens plassering i Strip Assign",
        "feedback": "Riktig. Finn den eksisterende kanalen i layouten før du endrer lydruting.",
        "correct": true
      },
      {
        "text": "Om alle kanaler må nullstilles",
        "feedback": "Det kan ødelegge en fungerende miks uten å løse et rent visningsproblem."
      }
    ]
  },
  {
    "id": "workflow-pafl-sip",
    "level": 2,
    "title": "Lytte alene uten å endre publikumslyden",
    "nodeId": "fader",
    "question": "Du vil høre én vokalkanal i hodetelefonene under en konsert. Hva må du bekrefte før du bruker PAFL?",
    "hint": "dLive har også en Solo In Place-funksjon med en annen virkning.",
    "lesson": "Vanlig PAFL er avlytting; aktivert SIP kan påvirke lyden til systemets utganger.",
    "sourceId": "surface",
    "options": [
      {
        "text": "At SIP er aktivert slik at alle andre kanaler mutes",
        "feedback": "Det endrer publikumslyden og passer ikke formålet her."
      },
      {
        "text": "At hovedfaderen settes til null først",
        "feedback": "Det er unødvendig for vanlig avlytting og kan gi uønsket nivåendring."
      },
      {
        "text": "At vanlig PAFL brukes, SIP er av, og hodetelefonnivået er passende",
        "feedback": "Riktig. Kontroller avlyttingsoppsettet slik at isolert lytting ikke muter andre kanaler i salen.",
        "correct": true
      }
    ]
  },
  {
    "id": "workflow-copy-eq",
    "level": 2,
    "title": "Kopiere bare EQ til en lignende mikrofon",
    "nodeId": "processing",
    "question": "Du vil bruke EQ-en fra Vokal 1 som utgangspunkt på Vokal 2, men beholde Vokal 2 sin gain og ruting. Hva er mest avgrenset?",
    "hint": "Kopier den delen du trenger, ikke hele kanalen.",
    "lesson": "Bruk blokkvis Copy/Paste når bare én prosesseringsdel skal gjenbrukes, og lytt før du beholder innstillingene.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Kopiere og lime inn bare PEQ-blokken",
        "feedback": "Riktig. Kontroller kilde- og målkanalen. To mikrofoner trenger ikke identiske innstillinger selv om utgangspunktet kopieres.",
        "correct": true
      },
      {
        "text": "Hente inn en hel kanal-Library med alle recall-valg aktivert",
        "feedback": "Det kan også endre gain, ruting og andre innstillinger du ønsket å beholde."
      },
      {
        "text": "Hente inn en hel tidligere scene",
        "feedback": "Da kan langt flere kanaler og innstillinger bli påvirket."
      }
    ]
  },
  {
    "id": "workflow-dca-spill",
    "level": 3,
    "title": "Bare trommene vises på faderne",
    "nodeId": "fader",
    "question": "Du trykker Mix på en DCA, og faderflaten viser plutselig bare DCA-medlemmene. Lyden er ellers som før. Hva er den sannsynlige forklaringen?",
    "hint": "En DCA kan brukes til å hente frem medlemmene på flaten.",
    "lesson": "DCA Spill endrer hvilke kanaler som vises, slik at en gruppe blir lettere å arbeide med.",
    "sourceId": "surface",
    "options": [
      {
        "text": "Alle andre kanaler er slettet",
        "feedback": "En midlertidig visning fjerner ikke de øvrige kanalene fra mikseren."
      },
      {
        "text": "DCA Spill er aktivt",
        "feedback": "Riktig. Avslutt spill-visningen for å gå tilbake til det vanlige strip-oppsettet.",
        "correct": true
      },
      {
        "text": "En ny buskonfigurasjon er automatisk lastet",
        "feedback": "DCA Spill er en visningsfunksjon og betyr ikke at hele mikserarkitekturen er byttet."
      }
    ]
  }
];
