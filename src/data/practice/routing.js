// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const routingScenarios = [
  {
    "id": "send-assignment",
    "level": 1,
    "title": "Signal på kanalen, stille i Aux",
    "nodeId": "monitor_branch",
    "question": "Kanalen har signal og Aux-sendnivået er oppe. I Routing vises send-baren bare som et omriss. Hva sjekker du?",
    "hint": "Nivå og tilordning er to separate ting.",
    "lesson": "En send trenger både tilordning og passende nivå.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Om kanalen er tilordnet miksen (On/Off)",
        "feedback": "Riktig. Omrisset viser at kanalen ikke er tilordnet miksen. Kontroller tilordningen før du øker nivået.",
        "correct": true
      },
      {
        "text": "Om kanalen trenger mer diskant",
        "feedback": "EQ påvirker klangen, men aktiverer ikke en send som er slått av."
      },
      {
        "text": "Øke Aux-masteren fordi omrisset betyr lavt nivå",
        "feedback": "Omrisset handler om tilordning, ikke signalnivå. En høyere Aux-master aktiverer ikke kanalens send."
      }
    ]
  },
  {
    "id": "routing-dca-group",
    "level": 2,
    "title": "Hvor setter du kompressor på tromme-DCA?",
    "nodeId": "mixbus",
    "question": "Du vil komprimere summen av alle trommekanalene. De styres allerede av én vanlig DCA. Hva trenger du for felles lydprosessering?",
    "hint": "En nivåkontrollgruppe og en lydbuss er forskjellige ting.",
    "lesson": "DCA styrer kanaler. En audiogruppe summerer lyd og kan behandle summen.",
    "sourceId": "routing",
    "options": [
      {
        "text": "En kompressor direkte på DCA-en",
        "feedback": "En vanlig DCA er ikke en audiobuss som summerer trommelyden."
      },
      {
        "text": "En audiogruppe med trommekanalene rutet til den",
        "feedback": "Riktig. Du kan komprimere gruppens sum og fortsatt bruke DCA til felles nivåstyring.",
        "correct": true
      },
      {
        "text": "En ekstra DCA med samme medlemmer",
        "feedback": "To nivåkontrollgrupper gir fortsatt ingen egen summert lyd å prosessere."
      }
    ]
  },
  {
    "id": "routing-double-main",
    "level": 3,
    "title": "Trommene ble plutselig høyere",
    "nodeId": "mixbus",
    "question": "Du ruter trommene via en audiogruppe til LR. Trommekanalene er fortsatt også tilordnet LR direkte. Hva bør du undersøke?",
    "hint": "Det samme signalet kan nå hovedmiksen på mer enn én vei.",
    "lesson": "Ved vanlig subgruppering: kontroller at signalet ikke utilsiktet går både direkte og via gruppen.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Øke kompresjonen på gruppen for å få samme nivå som før",
        "feedback": "Det kan dempe gruppen, men lar den utilsiktede direkteveien bli stående."
      },
      {
        "text": "Om master-EQ trenger en bassreduksjon",
        "feedback": "Det retter ikke den doble signalveien."
      },
      {
        "text": "Om direkte LR-tilordning skal fjernes fra trommekanalene",
        "feedback": "Riktig. Hvis du ønsker bare gruppeveien, fjern den parallelle direkte veien. Dobbel ruting kan gi nivå- og faseendringer.",
        "correct": true
      }
    ]
  },
  {
    "id": "routing-matrix-lobby",
    "level": 1,
    "title": "Eget nivå til foajeen",
    "nodeId": "matrix",
    "question": "Foajeen skal få hovedmiksen, men trenger et eget utgangsnivå og en annen EQ. Hva er et naturlig utgangspunkt?",
    "hint": "Du vil bearbeide en eksisterende miks videre til en ny destinasjon.",
    "lesson": "En matrix er nyttig for videre distribusjon av mikser til ulike soner.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Mate en matrix fra hovedmiksen og patche den til foajeen",
        "feedback": "Riktig. Da kan sonen få egen nivåkontroll og prosessering. Kontroller hvilke hovedfaderendringer den følger.",
        "correct": true
      },
      {
        "text": "Endre LR-EQ hver gang foajeen trenger en justering",
        "feedback": "Det vil også endre hovedlyden i salen."
      },
      {
        "text": "Bruke en DCA som fysisk lydutgang",
        "feedback": "En DCA er en kontrollgruppe og leverer ikke et eget lydsignal til en utgang."
      }
    ]
  },
  {
    "id": "routing-output-patch",
    "level": 1,
    "title": "Miksen viser signal, kontakten er stille",
    "nodeId": "mixbus",
    "question": "En Aux har signal på utgangsmeteret. Kabelen sitter i MixRack-utgang 5, men denne kontakten er ikke patchet til Aux-en. Hva mangler?",
    "hint": "En intern miks og en fysisk utgang er to ledd.",
    "lesson": "Kontroller både mikseruting og I/O-patch helt frem til den faktiske kontakten.",
    "sourceId": "io",
    "options": [
      {
        "text": "Mer kompresjon på Aux-en",
        "feedback": "Det endrer ikke hvilken kilde som er koblet til den fysiske utgangen."
      },
      {
        "text": "Patche riktig Aux til riktig fysisk utgang i I/O",
        "feedback": "Riktig. Verifiser utgangsnummeret og test forsiktig at signalet når rett mottaker.",
        "correct": true
      },
      {
        "text": "En ny EQ-preset på kanalen",
        "feedback": "Klanginnstillinger oppretter ikke den manglende utgangspatchen."
      }
    ]
  },
  {
    "id": "routing-tie-line",
    "level": 3,
    "title": "Rent signal til en annen mikser",
    "nodeId": "input",
    "question": "En annen mikser skal få mikrofoninngangen etter preampen, uten din kanaltrim og prosessering. Hvilken dLive-funksjon er laget for direkte kilde-til-destinasjon-patching?",
    "hint": "Signalet trenger ikke en ekstra kanal eller miks for å kopieres til en I/O-port.",
    "lesson": "Tie Lines kan dele signal etter preamp; felles preamp-gain må fortsatt koordineres.",
    "sourceId": "io",
    "options": [
      {
        "text": "En post-fade monitor-Aux med kompressor",
        "feedback": "Da følger signalet flere av dine kanal- og miksinnstillinger."
      },
      {
        "text": "En DCA med alle mikrofonene",
        "feedback": "DCA gir felles kontroll, ikke en lydkopi til I/O-porten."
      },
      {
        "text": "En Tie Line fra inngangskilden til ønsket destinasjon",
        "feedback": "Riktig. Denne direkte veien er uavhengig av kanaltrim og Direct Out-kildepunkt. Den er fortsatt påvirket av den fysiske preampen.",
        "correct": true
      }
    ]
  }
];
