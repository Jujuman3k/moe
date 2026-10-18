// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const recordingScenarios = [
  {
    "id": "stream-separate-mix",
    "level": 1,
    "title": "Bra i salen, lite trommer på stream",
    "nodeId": "matrix",
    "question": "I salen bidrar akustiske trommer direkte. En stream som bare får LR, har nesten ingen trommer. Hva er et godt utgangspunkt?",
    "hint": "Lytteren hjemme hører ikke den akustiske lyden i rommet.",
    "lesson": "En stream trenger balanse vurdert fra streamens egen lyd, ofte med en separat miks.",
    "sourceId": "shureWorship",
    "options": [
      {
        "text": "Øke trommene kraftig i salen selv om de allerede er høye der",
        "feedback": "Det kan ødelegge salbalansen for å rette et annet lytterperspektiv."
      },
      {
        "text": "Lage og avlytte en egen streammiks med passende trommenivå",
        "feedback": "Riktig. En egen Aux-miks gir kontroll over kanalbalansen for hjemmelytteren. En matrix fra bare LR gir ikke tilbake en manglende kanalbalanse.",
        "correct": true
      },
      {
        "text": "Bare senke streamens masternivå",
        "feedback": "Da blir også de få trommene som er med, svakere."
      }
    ]
  },
  {
    "id": "record-direct-out",
    "level": 2,
    "title": "Faderbevegelsene kommer på opptaket",
    "nodeId": "fader",
    "question": "Du tar opp via Input Direct Outs og vil bevare kanalene uavhengig av livefaderne. Opptaket følger likevel faderbevegelsene. Hva sjekker du?",
    "hint": "Navnet Direct Out sier ikke alene hvilke kontroller utgangen følger.",
    "lesson": "Kontroller Direct Out Source og Follow-valgene før opptak; på dLive er kildepunktet globalt for kanal-Direct Outs.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Direct Out-valgene Follow Fader/Follow All og valgt kildepunkt",
        "feedback": "Riktig. Konfigurer dem for ønsket opptaksform og test én kanal før hele opptaket starter.",
        "correct": true
      },
      {
        "text": "La faderen stå på 0 dB og unngå å mikse kanalen live",
        "feedback": "Det begrenser livearbeidet uten å konfigurere den uavhengige opptaksveien du ønsker."
      },
      {
        "text": "Bare utgangsnivået på PA-høyttalerne",
        "feedback": "Det påvirker ikke hvordan Direct Outs mates til opptaket."
      }
    ]
  },
  {
    "id": "record-dante-patch",
    "level": 2,
    "title": "Dante er tilkoblet, men sporet er tomt",
    "nodeId": "input",
    "question": "Datamaskinen ser Dante-enheten. DAW-sporet får likevel ikke signal fra den ønskede dLive-kanalen. Hvilke forbindelser må kontrolleres?",
    "hint": "En nettverksforbindelse er ikke det samme som en komplett lydpatch.",
    "lesson": "Spor hele opptaksveien: dLive-utgangspatch, Dante-abonnement og riktig inngang i DAW.",
    "sourceId": "io",
    "options": [
      {
        "text": "Bare om nettverkskabelens lampe lyser",
        "feedback": "Linklys bekrefter ikke at riktig lydkanal er rutet til riktig mottaker."
      },
      {
        "text": "Bare hvor høyt hovedmiksen spiller",
        "feedback": "En høyere hovedmiks oppretter ikke manglende digital patch."
      },
      {
        "text": "dLive I/O, Dante Controller og DAW-sporets valgte inngang",
        "feedback": "Riktig. Test én kjent kilde gjennom alle ledd før du feilsøker resten av sporene.",
        "correct": true
      }
    ]
  },
  {
    "id": "record-vsc-return",
    "level": 1,
    "title": "Bandet spiller, men gamle spor høres",
    "nodeId": "input",
    "question": "Etter øving med Virtual SoundCheck kommer den gamle innspillingen fortsatt på kanalene i stedet for dagens liveinnganger. Hva sjekker du?",
    "hint": "En midlertidig kildeoverstyring kan fortsatt være aktiv.",
    "lesson": "Avslutt Virtual SoundCheck og kontroller livekildene før arrangementet starter.",
    "sourceId": "io",
    "options": [
      {
        "text": "Om alle preamper må få mer gain",
        "feedback": "Mer gain hjelper ikke dersom kanalene fortsatt henter signal fra opptaksporten."
      },
      {
        "text": "Om Virtual SoundCheck fortsatt er aktivert",
        "feedback": "Riktig. Sett den tilbake til normal kildebruk og bekreft de faktiske liveinngangene med bandet.",
        "correct": true
      },
      {
        "text": "Hente en scene fra før Virtual SoundCheck ble aktivert",
        "feedback": "Virtual SoundCheck-modusen er uavhengig av sceneminnene. Kontroller selve modusen."
      }
    ]
  },
  {
    "id": "record-vsc-pretrim",
    "level": 3,
    "title": "EQ-en blir ikke med i Record Send",
    "nodeId": "input",
    "question": "Du bruker dLive Virtual SoundCheck sin Record Send. Opptaket inneholder ikke kanalens trim og EQ-endringer. Hvorfor?",
    "hint": "Denne opptaksmodusen har et fast tidlig kildepunkt.",
    "lesson": "Virtual SoundCheck Record Send tar signal pre-trim. Bruk riktig konfigurerte Input Direct Outs når prosessert kanal skal tas opp.",
    "sourceId": "io",
    "options": [
      {
        "text": "Record Send tar pre-trim-signal, uavhengig av Direct Out Source",
        "feedback": "Riktig. Denne modusen er ment å gi et tidlig signal til multitrack/Virtual SoundCheck.",
        "correct": true
      },
      {
        "text": "EQ blir alltid automatisk fjernet av DAW-en",
        "feedback": "Det er ikke en generell DAW-funksjon; kildepunktet i mikseren forklarer dette."
      },
      {
        "text": "Alle opptak fra dLive er alltid post-fader",
        "feedback": "Opptakets kildepunkt avhenger av rutingen og valgt opptaksmetode."
      }
    ]
  },
  {
    "id": "stream-return-loop",
    "level": 2,
    "title": "Streamlyden kommer tilbake som ekko",
    "nodeId": "matrix",
    "question": "Du sender en egen miks til en datamaskin. Datamaskinens avspilling er rutet tilbake til den samme sendmiksen, og du hører forsinkede gjentakelser. Hva undersøker du?",
    "hint": "Du kan ha laget en rundtur mellom mikser og programvare.",
    "lesson": "Planlegg en mix-minus der returlyden ikke sendes tilbake til sin egen kilde.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Mer gain på datamaskinreturen",
        "feedback": "Det kan gjøre sløyfen enda tydeligere."
      },
      {
        "text": "Lengre reverb decay på streammiksen",
        "feedback": "Det gir mer etterklang uten å bryte den feilaktige returveien."
      },
      {
        "text": "Fjerne returen fra sin egen sendmiks og kontrollere programvaremonitorering",
        "feedback": "Riktig. Bryt rundgangen, og sørg for at hver mottaker får den tiltenkte miksen uten sin egen retur.",
        "correct": true
      }
    ]
  }
];
