// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const paScenarios = [
  {
    "id": "pa-front-back",
    "level": 1,
    "title": "Høyt foran, svakt bakerst",
    "nodeId": "speakers",
    "question": "Det er allerede for høyt nær hovedhøyttalerne, mens talen er svak bakerst. Hva undersøker du før du øker masteren?",
    "hint": "Et nivåproblem som varierer med plassering kan være et dekningsproblem.",
    "lesson": "Gå rundt og lytt. Høyttalerretning, avstand og eventuell distribuert lyd påvirker dekningen.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Hvor mye mer masterfaderen kan økes",
        "feedback": "Det øker også nivået for dem som allerede har for mye."
      },
      {
        "text": "Høyttalernes dekning og retning, og behovet for tilpasset sonelyd",
        "feedback": "Riktig. Undersøk hvordan lyden fordeles før du kompenserer med mer totalnivå.",
        "correct": true
      },
      {
        "text": "Om mer vokalklang gjør bakre del tydeligere",
        "feedback": "Mer klang kan redusere taletydeligheten og løser ikke en ujevn dekning."
      }
    ]
  },
  {
    "id": "pa-fill-delay",
    "level": 3,
    "title": "Et enkelt regnestykke for delayhøyttaler",
    "nodeId": "matrix",
    "question": "I en forenklet modell er veien fra hovedhøyttaler til lyttepunktet 10 meter lengre enn fra fill-høyttaleren. Bruk lydhastighet 343 m/s og se bort fra elektronisk forsinkelse. Omtrent hvor mye delay trenger fill-signalet for samtidig ankomst?",
    "hint": "Tid = forskjell i avstand / lydhastighet.",
    "lesson": "10 / 343 s er omtrent 29 ms. Praktisk innretting krever måling og lytting; geometrien alene er bare et utgangspunkt.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Omtrent 29 ms",
        "feedback": "Riktig. Fill-signalet må vente omtrent 0,029 sekunder i denne idealiserte modellen.",
        "correct": true
      },
      {
        "text": "Omtrent 3 ms",
        "feedback": "Det tilsvarer omtrent én meter ekstra lydvei, ikke ti."
      },
      {
        "text": "Omtrent 290 ms",
        "feedback": "Det er omtrent ti ganger mer enn den oppgitte avstandsforskjellen tilsier."
      }
    ]
  },
  {
    "id": "pa-mono-check",
    "level": 2,
    "title": "Keyboardet blir tynt i mono",
    "nodeId": "mixbus",
    "question": "Et bredt stereokeyboard låter fint i hodetelefoner, men mister mye innhold når det summeres til mono. Hva bør du undersøke?",
    "hint": "Venstre og høyre kan delvis motarbeide hverandre i summen.",
    "lesson": "Kontroller monokompatibilitet for stereokilder som også skal høres i mono eller fra skjeve lytteposisjoner.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Øke begge sidene like mye",
        "feedback": "Det endrer ikke den relative fase-/polaritetsrelasjonen mellom sidene."
      },
      {
        "text": "Panorere enda bredere og la være å teste mono",
        "feedback": "Det skjuler problemet i hodetelefoner, men retter det ikke for mono-destinasjonen."
      },
      {
        "text": "Sammenligne L, R og monosum og prøve en mer monokompatibel lyd",
        "feedback": "Riktig. Finn om breddeteknikken i presetet skaper kansellering, og velg en løsning som fungerer i den faktiske avspillingen.",
        "correct": true
      }
    ]
  },
  {
    "id": "pa-room-reverb",
    "level": 1,
    "title": "Talen flyter sammen i rommet",
    "nodeId": "speakers",
    "question": "Stemmen er tydelig nær mikrofonen, men ord flyter sammen i et rom med lang etterklang. Mer nivå hjelper lite. Hva er mest relevant å undersøke?",
    "hint": "Forholdet mellom direkte lyd og reflektert lyd betyr mye for tydeligheten.",
    "lesson": "Bedre dekning og mindre unødvendig romeksitasjon kan være viktigere enn mer gain eller flere EQ-boost.",
    "sourceId": "shureWorship",
    "options": [
      {
        "text": "Mer kunstig romklang på talen",
        "feedback": "Det legger til enda en hale oppå rommets eksisterende etterklang."
      },
      {
        "text": "Høyttalerretning, mikrofonavstand og muligheter for akustiske tiltak",
        "feedback": "Riktig. Arbeid med både opptak og hvordan lyden sendes ut i rommet.",
        "correct": true
      },
      {
        "text": "En kraftig bassboost på alle mikrofoner",
        "feedback": "Det øker ikke nødvendigvis forståeligheten og kan gi mer lavfrekvent oppbygging."
      }
    ]
  },
  {
    "id": "pa-speaker-limit",
    "level": 2,
    "title": "Høyttaleren begrenser, mikseren er ren",
    "nodeId": "speakers",
    "question": "dLive-utgangen har god margin, men den aktive høyttalerens limiter jobber nesten kontinuerlig. Lyden blir presset. Hva er et godt første tiltak?",
    "hint": "Et rent signal på mikseren garanterer ikke kapasitet i resten av anlegget.",
    "lesson": "Kontroller hvert ledd. Ved vedvarende begrensning må nivå og systemkapasitet vurderes.",
    "sourceId": "yamahaPA",
    "options": [
      {
        "text": "Redusere signalet til høyttaleren og undersøke systemoppsett og kapasitet",
        "feedback": "Riktig. Unngå å presse videre. Kontroller inngangsfølsomhet, filtre og om systemet dekker oppgaven.",
        "correct": true
      },
      {
        "text": "Øke masteren for å tvinge mer lyd gjennom limiteren",
        "feedback": "Det gir normalt mer begrensning og ikke den ønskede rene nivåøkningen."
      },
      {
        "text": "Slå av all beskyttelse i høyttaleren",
        "feedback": "Beskyttelsen er ikke et hinder som bør fjernes for å få mer nivå."
      }
    ]
  },
  {
    "id": "pa-sub-crossover",
    "level": 3,
    "title": "Lite bass akkurat i deleområdet",
    "nodeId": "speakers",
    "question": "Sub og topp gir hver for seg energi rundt delefrekvensen, men summen blir svakere i samme lyttepunkt. Hva undersøker du?",
    "hint": "Summering handler også om relativ fase og tid.",
    "lesson": "Sjekk delefilter, polaritet og tidsinnretting samlet. Ikke forsøk å fylle en kansellering med stor boost alene.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "En stor bassboost på masteren",
        "feedback": "Det kan spise kapasitet uten å rette den akustiske kanselleringen."
      },
      {
        "text": "Bare mer kompresjon på sub-signalet",
        "feedback": "Det retter ikke nødvendigvis fase- og tidsforholdet i deleområdet."
      },
      {
        "text": "Relativ polaritet, delay og delefilter med måling og lytting",
        "feedback": "Riktig. Finn hvorfor kildene ikke summerer godt før du endrer klangbalansen.",
        "correct": true
      }
    ]
  }
];
