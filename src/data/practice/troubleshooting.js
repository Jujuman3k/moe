// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const troubleshootingScenarios = [
  {
    "id": "fault-no-input",
    "level": 1,
    "title": "Ingen bevegelse på inngangsmeteret",
    "nodeId": "input",
    "question": "En mikrofon er helt stille, og kanalens inngangsmeter beveger seg ikke. De andre mikrofonene fungerer. Hvor begynner du?",
    "hint": "Begynn før punktet der signalet mangler.",
    "lesson": "Systematisk feilsøking følger signalet fra kilde mot mottaker.",
    "sourceId": "io",
    "options": [
      {
        "text": "Kontrollere mikrofon, strømbehov, kabel, socket og input-patch",
        "feedback": "Riktig. Finn først ut om kilden faktisk når den riktige kanalens inngang.",
        "correct": true
      },
      {
        "text": "Bytte hovedmiksens kompressor",
        "feedback": "Da jobber du senere i signalveien før du har bekreftet et inngangssignal."
      },
      {
        "text": "Øke alle monitorutgangene",
        "feedback": "Det retter ikke en kilde som mangler allerede på inngangen."
      }
    ]
  },
  {
    "id": "fault-muted-dca",
    "level": 2,
    "title": "Kanalens mute er av, likevel stille",
    "nodeId": "fader",
    "question": "En kanal har signal og korrekt tilordning til LR. Kanalfaderen er oppe og kanalens egen mute er av, men DCA-gruppen er mutet. Hva forklarer stillheten?",
    "hint": "En kanal kan styres fra flere nivåer.",
    "lesson": "Sjekk kanal, DCA og mutegrupper når en tilsynelatende åpen kanal er stille.",
    "sourceId": "routing",
    "options": [
      {
        "text": "At kanalen har for lite diskant",
        "feedback": "Klangbalanse forklarer ikke en aktiv gruppemute."
      },
      {
        "text": "DCA-muten påvirker medlemskanalen",
        "feedback": "Riktig. Kontroller hvorfor gruppen er mutet før du åpner den, slik at ikke andre medlemskanaler kommer uventet på.",
        "correct": true
      },
      {
        "text": "At alle innganger må ha lik gain",
        "feedback": "Ulike kilder trenger ulike gainverdier. Det opphever ikke en mute."
      }
    ]
  },
  {
    "id": "fault-insert-return",
    "level": 2,
    "title": "Lyden forsvant etter ekstern insert",
    "nodeId": "processing",
    "question": "Kanalen blir stille straks en ekstern insert aktiveres. Insert-send viser signal, men retur mangler. Hva er et målrettet første forsøk?",
    "hint": "En insert bryter den vanlige signalveien og forventer lyd tilbake.",
    "lesson": "Bekreft send og retur i en ekstern insert. Bypass kan avgrense feilen, men nivåforskjeller må håndteres.",
    "sourceId": "fx",
    "options": [
      {
        "text": "Øke preamp-gain kraftig",
        "feedback": "Det oppretter ikke en returforbindelse og kan gi et farlig nivåsprang når signalet kommer tilbake."
      },
      {
        "text": "Endre kanalens Direct Out Source",
        "feedback": "Direct Out styrer en separat utgangsvei. Det reparerer ikke en manglende retur i kanalens insert."
      },
      {
        "text": "Dempe ved behov, prøve bypass og kontrollere returpatchen",
        "feedback": "Riktig. Hvis signalet kommer tilbake i bypass, er insertkjeden et naturlig sted å feilsøke videre.",
        "correct": true
      }
    ]
  },
  {
    "id": "fault-one-change",
    "level": 1,
    "title": "Tre tiltak samtidig, ingen vet hva som hjalp",
    "nodeId": "input",
    "question": "Et ustabilt signal dukker opp under lydsjekk. En kollega vil bytte kabel, patch og mikrofon samtidig. Hva gir best sporbar feilsøking når situasjonen tillater det?",
    "hint": "Du vil vite hvilken endring som faktisk påvirker feilen.",
    "lesson": "Endre ett avgrenset ledd om gangen og kontroller resultatet. Bruk kjent fungerende utstyr som sammenligning.",
    "sourceId": "shureWorship",
    "options": [
      {
        "text": "Teste én endring av gangen og notere hva som skjer",
        "feedback": "Riktig. Da blir det lettere å skille årsak fra tilfeldighet og unngå nye feil.",
        "correct": true
      },
      {
        "text": "Endre så mange parametere som mulig før neste test",
        "feedback": "Da blir det vanskelig å forstå hva som hjalp eller forverret problemet."
      },
      {
        "text": "Lagre den ustabile tilstanden over alle scenene",
        "feedback": "Det kan spre feilen og fjerne tidligere fungerende oppsett."
      }
    ]
  },
  {
    "id": "fault-left-right",
    "level": 2,
    "title": "Bare venstre PA-side er stille",
    "nodeId": "speakers",
    "question": "LR-meterne viser signal på begge sider, men venstre PA er stille. Høyre fungerer. Hvor er det mest logisk å fortsette?",
    "hint": "Du har allerede bekreftet signal frem til LR-målepunktet.",
    "lesson": "Avgrens feilen rundt siste punkt med bekreftet signal. Et miks-meter bekrefter ikke kabel og høyttaler.",
    "sourceId": "io",
    "options": [
      {
        "text": "På alle mikrofonenes gain samtidig",
        "feedback": "Begge LR-metere har signal. Feilen er mer sannsynlig i den berørte utgangsveien."
      },
      {
        "text": "I venstre utgangspatch, kabel, eventuell DSP/forsterker og høyttaler",
        "feedback": "Riktig. Test systematisk ved et kontrollert nivå og sammenlign med den fungerende siden.",
        "correct": true
      },
      {
        "text": "Ved å senke alle høye frekvenser",
        "feedback": "EQ skaper ikke en fysisk forbindelse til den manglende PA-siden."
      }
    ]
  },
  {
    "id": "fault-feedback-vs-distortion",
    "level": 3,
    "title": "Piping eller skurring?",
    "nodeId": "speakers",
    "question": "Du hører en vedvarende tone som vokser når en bestemt åpen mikrofon sendes til monitoren, og stopper straks denne senden mutes. Hva peker observasjonen sterkest mot?",
    "hint": "Se etter en lukket lydsløyfe, ikke bare et høyt meter.",
    "lesson": "Feedback er tilbakekobling. Forvrengning fra overstyring har en annen årsak og må feilsøkes annerledes.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Digital klipping alene, fordi lyden er høy",
        "feedback": "Klipping kan gi forvrengning, men den voksende tonen som avhenger av mikrofon–monitor-sløyfen peker sterkest mot feedback."
      },
      {
        "text": "At en kompressor alltid må ha høyere ratio",
        "feedback": "Mer kompresjon er ikke en generell løsning på akustisk tilbakekobling."
      },
      {
        "text": "Akustisk feedback i mikrofon–monitor-sløyfen",
        "feedback": "Riktig. Stans sløyfen og vurder nivå, plassering og retningskarakteristikk før du gjenåpner forsiktig.",
        "correct": true
      }
    ]
  }
];
