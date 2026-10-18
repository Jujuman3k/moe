// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const monitorScenarios = [
  {
    "id": "monitor-pre-fade",
    "level": 1,
    "title": "Vokalen forsvinner i øret",
    "nodeId": "monitor_branch",
    "question": "Du senker vokalfaderen i salen. Vokalisten mister samtidig nivå i monitoren. Hva undersøker du først?",
    "hint": "Tenk på hvor monitoren henter signalet i forhold til kanalfaderen.",
    "lesson": "Pre-fade kan skille monitorbalansen fra faderbevegelsene i salen.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Øke preamp-gain",
        "feedback": "Det endrer inngangsnivået og kan påvirke flere mikser. Undersøk monitorens send først."
      },
      {
        "text": "Sjekke om monitor-senden er post-fade",
        "feedback": "Riktig. En post-fade send følger kanalfaderen. Pre-fade gjør monitoren uavhengig av denne faderbevegelsen.",
        "correct": true
      },
      {
        "text": "Legge mer kompresjon på vokalen",
        "feedback": "Kompresjon løser ikke koblingen mellom kanalfaderen og monitor-senden."
      }
    ]
  },
  {
    "id": "monitor-tap-point",
    "level": 2,
    "title": "EQ-endringen høres også på scenen",
    "nodeId": "monitor_branch",
    "question": "Monitor-senden er pre-fade, men en EQ-endring i FOH påvirker også monitoren. Er det nødvendigvis en feil?",
    "hint": "Pre-fade beskriver forholdet til faderen, ikke automatisk til EQ.",
    "lesson": "Kontroller både pre/post-fade og Aux Source Point når du skal forstå hva monitoren følger.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Nei, monitorens kildepunkt kan være etter EQ",
        "feedback": "Riktig. Undersøk Aux Source Point. Pre-fade garanterer ikke at signalet hentes før prosesseringen.",
        "correct": true
      },
      {
        "text": "Ja, pre-fade betyr alltid før all prosessering",
        "feedback": "Pre-fade sier først og fremst at send-nivået ikke følger kanalfaderen."
      },
      {
        "text": "Ja, EQ skal bare kunne høres i hovedutgangen",
        "feedback": "Hvor EQ høres, avhenger av hvor signalene hentes i kjeden."
      }
    ]
  },
  {
    "id": "monitor-talkback",
    "level": 1,
    "title": "En beskjed bare til bandet",
    "nodeId": "monitor_branch",
    "question": "Du skal gi en praktisk beskjed til musikerne under lydsjekken, uten at den går til publikum. Hva kontrollerer du?",
    "hint": "En talkback-mikrofon må ha bevisste destinasjoner.",
    "lesson": "Test talkback-rutingen på forhånd, og bruk bare de miksene som trenger beskjeden.",
    "sourceId": "mixrack",
    "options": [
      {
        "text": "At talkback er sendt til hovedmiksen",
        "feedback": "Det er nettopp hovedmiksen du vil unngå i denne situasjonen."
      },
      {
        "text": "At alle Aux- og Matrix-utganger får talkback",
        "feedback": "Da kan beskjeden også nå opptak, lobby eller andre uønskede destinasjoner."
      },
      {
        "text": "At talkback går til aktuelle monitorer og ikke til hovedmiksen",
        "feedback": "Riktig. Kontroller tilordningene og et passende talkback-nivå før bruk.",
        "correct": true
      }
    ]
  },
  {
    "id": "monitor-balance-first",
    "level": 1,
    "title": "«Mer av meg» igjen og igjen",
    "nodeId": "monitor_branch",
    "question": "Vokalisten ber om stadig mer vokal i monitoren, som allerede er sterk. Flere instrumenter dominerer miksen. Hva er et godt neste steg?",
    "hint": "Tydelighet avhenger også av hva som konkurrerer med stemmen.",
    "lesson": "En nyttig monitormiks gir plass til det utøveren trenger, uten at alle kilder stadig økes.",
    "sourceId": "shureWorship",
    "options": [
      {
        "text": "Spørre hva som maskerer vokalen og redusere unødvendige kilder",
        "feedback": "Riktig. Bedre balanse kan gi mer tydelighet uten at totalnivået må opp.",
        "correct": true
      },
      {
        "text": "Øke alle kildene like mye",
        "feedback": "Forholdet mellom vokal og instrumenter blir det samme, mens totalnivået øker."
      },
      {
        "text": "Øke FOH-gain hver gang",
        "feedback": "Det påvirker flere deler av signalveien og er ikke en presis monitorjustering."
      }
    ]
  },
  {
    "id": "monitor-feedback",
    "level": 2,
    "title": "Det begynner å pipe fra gulvmonitoren",
    "nodeId": "monitor_branch",
    "question": "Det oppstår tydelig feedback når en åpen vokalmikrofon nærmer seg monitoren. Hva gjør du først?",
    "hint": "Bryt den uønskede forsterkningssløyfen før du undersøker årsaken.",
    "lesson": "Reduser den berørte signalveien, og vurder deretter plassering, nivå og eventuelt målrettet EQ.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Booste diskanten for å høre problemet bedre",
        "feedback": "Det kan øke tilbakekoblingen og gjøre situasjonen verre."
      },
      {
        "text": "Senke eller mute den aktuelle monitor-senden og korrigere plasseringen",
        "feedback": "Riktig. Stans ringingen først. Kontroller retning og avstand før du forsiktig gjenoppretter nødvendig nivå.",
        "correct": true
      },
      {
        "text": "Be vokalisten dekke mikrofonhodet med hånden",
        "feedback": "Det endrer retningskarakteristikken og kan forverre feedback."
      }
    ]
  },
  {
    "id": "monitor-iem-pair",
    "level": 2,
    "title": "Stereomonitor bare på ett øre",
    "nodeId": "monitor_branch",
    "question": "En stereo-IEM-miks har signal på både L og R i dLive, men mottakeren får bare én side. Hvor undersøker du videre?",
    "hint": "Meter på miksen bekrefter ikke hele kjeden frem til ørene.",
    "lesson": "Spor begge sider av stereo gjennom patch, kabler, sender, mottakermodus og ørepropper.",
    "sourceId": "io",
    "options": [
      {
        "text": "Øke gain på alle mikrofonene",
        "feedback": "Det gir mer nivå, men gjenoppretter ikke en manglende høyre eller venstre forbindelse."
      },
      {
        "text": "Panorere hele bandet hardt til den siden som virker",
        "feedback": "Det skjuler feilen og gir ikke tilbake en fungerende stereokjede."
      },
      {
        "text": "Kontrollere utgangsparet og innstillingene i IEM-kjeden ved lavt nivå",
        "feedback": "Riktig. Finn hvor den ene siden forsvinner før du endrer selve miksen.",
        "correct": true
      }
    ]
  }
];
