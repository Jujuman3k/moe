// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const fxScenarios = [
  {
    "id": "fx-post-fade",
    "level": 1,
    "title": "Klangen blir igjen når vokalen senkes",
    "nodeId": "fx_branch",
    "question": "Du senker vokalfaderen, men mye vokalklang blir igjen. Reverb brukes som send/return. Hva vil du kontrollere?",
    "hint": "Tørr vokal og signalet til klangen bør ofte følge hverandre.",
    "lesson": "Post-fade er et vanlig utgangspunkt for en klangsend som skal følge kanalnivået.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Øke FX-return for å få mer direkte vokal",
        "feedback": "FX-return gir effektlyd, ikke mer av den direkte vokalen."
      },
      {
        "text": "Om vokalens FX-send er pre-fade i stedet for post-fade",
        "feedback": "Riktig. En pre-fade send kan fortsette på samme nivå mens tørrsignalet senkes.",
        "correct": true
      },
      {
        "text": "Øke mikrofonens preamp-gain",
        "feedback": "Det påvirker flere signalveier og retter ikke forholdet mellom fader og send."
      }
    ]
  },
  {
    "id": "fx-return-muted",
    "level": 1,
    "title": "Signal inn i klangen, ingen klang ut",
    "nodeId": "fx_branch",
    "question": "FX-enheten viser signal inn og ut. Den tørre vokalen høres, men FX-return er mutet. Hva retter problemet?",
    "hint": "Følg effekten helt tilbake til miksen.",
    "lesson": "En effektkjede trenger send, aktiv effekt, return og tilordning til ønsket miks.",
    "sourceId": "fx",
    "options": [
      {
        "text": "Åpne FX-return på et kontrollert nivå og sjekke tilordningen",
        "feedback": "Riktig. Effekten kan være aktiv uten at returkanalen slipper den frem til miksen.",
        "correct": true
      },
      {
        "text": "Skru vokalens gain mye opp",
        "feedback": "Mer inngangsnivå åpner ikke en mutet returkanal."
      },
      {
        "text": "Sette lengre decay",
        "feedback": "En lengre klanghale er fortsatt uhørbar når returveien er mutet."
      }
    ]
  },
  {
    "id": "fx-decay-speech",
    "level": 1,
    "title": "Ordene drukner i klanghalen",
    "nodeId": "fx_branch",
    "question": "En lang vokalklang passer sangen, men gjør raske talebeskjeder utydelige. Hva er et godt tiltak for talepartiet?",
    "hint": "Ordene trenger plass mellom seg.",
    "lesson": "Effektnivå og klangtid bør passe materialet; tale trenger ofte mindre klang enn sang.",
    "sourceId": "yamahaReverb",
    "options": [
      {
        "text": "Øke klangreturen for å fremheve taleren",
        "feedback": "Da blir det enda mer hale som kan dekke neste ord."
      },
      {
        "text": "Øke kompressorens make-up gain uten å endre klangen",
        "feedback": "Det skiller ikke talen fra den uønskede klanghalen."
      },
      {
        "text": "Redusere klangsend og eventuelt bruke kortere decay",
        "feedback": "Riktig. Sammenlign tydeligheten med mindre effekt, og velg et nivå som passer talen og rommet.",
        "correct": true
      }
    ]
  },
  {
    "id": "fx-predelay",
    "level": 2,
    "title": "Klangen ligger oppå anslaget",
    "nodeId": "fx_branch",
    "question": "Vokalklangen har ønsket lengde, men starter så tett på stemmen at konsonantene blir uklare. Hvilken parameter kan gi litt avstand før klangen?",
    "hint": "Skill mellom tidspunktet klangen starter og hvor lenge den varer.",
    "lesson": "Pre-delay er ventetid før klangen. Decay er hvor lenge klangen klinger ut.",
    "sourceId": "fxModels",
    "options": [
      {
        "text": "Mer decay",
        "feedback": "Det forlenger halen, men flytter ikke starten på samme måte."
      },
      {
        "text": "Litt mer pre-delay, vurdert i tempo og sammenheng",
        "feedback": "Riktig. En liten forsinkelse før klangen kan skille direkte lyd og klang. For mye kan bli et tydelig ekko.",
        "correct": true
      },
      {
        "text": "Mer send til alle effektene",
        "feedback": "Mer effekt gir ikke i seg selv bedre tidsmessig separasjon."
      }
    ]
  },
  {
    "id": "fx-delay-tempo",
    "level": 2,
    "title": "Delay på 120 BPM",
    "nodeId": "fx_branch",
    "question": "Du vil sette et enkelt firedels-delay til en sang på 120 BPM. Hvilken tid er det matematiske utgangspunktet?",
    "hint": "Ett minutt er 60 000 millisekunder. Del på slag per minutt.",
    "lesson": "Firedelstid i millisekunder = 60 000 / BPM. Kontroller også noteverdi og eventuell tempo-sync.",
    "sourceId": "fx",
    "options": [
      {
        "text": "500 ms",
        "feedback": "Riktig: 60 000 / 120 = 500 ms per firedel.",
        "correct": true
      },
      {
        "text": "250 ms",
        "feedback": "Det er en åttendel ved 120 BPM, altså dobbelt så raske repetisjoner som ønsket."
      },
      {
        "text": "1 000 ms",
        "feedback": "Det er en halvnote ved 120 BPM, altså to firedelsslag."
      }
    ]
  },
  {
    "id": "fx-feedback-loop",
    "level": 3,
    "title": "Effekten bygger seg opp av seg selv",
    "nodeId": "fx_branch",
    "question": "En FX-return blir ved en feil sendt tilbake til samme FX-send. Lyden fortsetter å vokse etter at kilden har stoppet. Hva gjør du først?",
    "hint": "Her kan det være en elektrisk sløyfe, ikke akustisk feedback fra en mikrofon.",
    "lesson": "Unngå utilsiktet retur til samme effektinngang. Kontroller både eksterne send-veier og effektens egen feedback.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Øke FX-return for å høre hvor lyden kommer fra",
        "feedback": "Det kan øke nivået ytterligere og er ikke et godt første tiltak."
      },
      {
        "text": "Bare senke den opprinnelige vokalens fader",
        "feedback": "Den interne sløyfen kan fortsette selv om den opprinnelige kilden senkes."
      },
      {
        "text": "Mute den berørte effektveien og fjerne returens send til seg selv",
        "feedback": "Riktig. Stans oppbyggingen før du retter routingen og gjenåpner på lavt nivå.",
        "correct": true
      }
    ]
  }
];
