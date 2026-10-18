// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const scenesScenarios = [
  {
    "id": "scene-store-recall",
    "level": 1,
    "title": "Lydsjekken skal bevares",
    "nodeId": "fader",
    "question": "Du har justert en god miks og vil lagre den i en ny scene. Hva gjør du?",
    "hint": "Store skriver, Recall henter.",
    "lesson": "Kontroller valgt sceneplass og navn før du lagrer. Recall kan overskrive innstillingene du nettopp laget.",
    "sourceId": "scenes",
    "options": [
      {
        "text": "Trykke Recall på en gammel scene først",
        "feedback": "Da kan du erstatte den nye miksen før du har lagret den."
      },
      {
        "text": "Velge en ledig sceneplass og lagre dagens innstillinger",
        "feedback": "Riktig. Gi scenen et tydelig navn og kontroller at den ble lagret på riktig plass.",
        "correct": true
      },
      {
        "text": "Bare endre scenenavnet",
        "feedback": "Navngiving er ikke det samme som å lagre de nåværende mikserinnstillingene."
      }
    ]
  },
  {
    "id": "scene-safe-talk",
    "level": 2,
    "title": "Talemikrofonen skal være stabil",
    "nodeId": "fader",
    "question": "Under et arrangement skal flere scener hentes inn, men en bestemt talemikrofons innstillinger skal bevares gjennom alle. Hva undersøker du?",
    "hint": "Du trenger en beskyttelse som gjelder på tvers av sceneinnhentinger.",
    "lesson": "Global Scene Safes og per-scene Recall Filters har ulike bruksområder. Kontroller alltid hvilke parametere som er beskyttet.",
    "sourceId": "scenes",
    "options": [
      {
        "text": "Global Scene Safes for de nødvendige kanalparameterne",
        "feedback": "Riktig. Velg riktig omfang og test sceneskiftene på forhånd, inkludert eventuell preamp-beskyttelse.",
        "correct": true
      },
      {
        "text": "Sette Recall Filter bare på én av scenene og anta at resten følger",
        "feedback": "Et per-scene filter gjelder den aktuelle scenen. Alle relevante recalls må være beskyttet."
      },
      {
        "text": "Mute mikrofonen før hver scene uten annen kontroll",
        "feedback": "Mute er ikke en erstatning for å beskytte innstillingene mot recall."
      }
    ]
  },
  {
    "id": "scene-recall-filter",
    "level": 2,
    "title": "Bare effektnivået skal endres",
    "nodeId": "fx_branch",
    "question": "En scene skal endre bestemte effektinnstillinger, mens monitorbalansen skal stå urørt. Hva bruker du for å avgrense akkurat denne scenens recall?",
    "hint": "Det som er lagret, og det som tillates hentet tilbake, er ikke alltid det samme.",
    "lesson": "Bruk Recall Filter til å avgrense parameterne som en bestemt scene får endre.",
    "sourceId": "scenes",
    "options": [
      {
        "text": "Flytte monitorfaderne tilbake etter hvert sceneskift",
        "feedback": "Da kan musikerne få et uønsket nivåsprang før du rekker å rette det."
      },
      {
        "text": "Lagre scenen på en ny plass uten å kontrollere filteret",
        "feedback": "En ny sceneplass begrenser ikke automatisk hvilke parametere som blir hentet tilbake."
      },
      {
        "text": "Sette et Recall Filter og prøve overgangen under lydsjekk",
        "feedback": "Riktig. Tillat de ønskede effektparameterne og blokker det som skal stå urørt. Test også samspillet med Safes.",
        "correct": true
      }
    ]
  },
  {
    "id": "scene-go-pointer",
    "level": 3,
    "title": "Den grønne scenen er en annen",
    "nodeId": "fader",
    "question": "I dLive viser den gule markeringen én scene, mens den grønne Next/Go-markeringen viser en annen. Hvilken scene henter Go?",
    "hint": "Valgt scene og neste scene kan være forskjellige.",
    "lesson": "Se på Next/Go før du trykker Go, ikke bare på hvilken scene som er valgt for redigering.",
    "sourceId": "scenes",
    "options": [
      {
        "text": "Alltid den gule scenen",
        "feedback": "Den gule markeringen er den valgte scenen; Next/Go kan ha blitt flyttet uavhengig."
      },
      {
        "text": "Scenen med den grønne Next/Go-markeringen",
        "feedback": "Riktig. Verifiser den grønne markeringen før du henter inn scenen.",
        "correct": true
      },
      {
        "text": "Scenen med det høyeste nummeret",
        "feedback": "Scenenummer alene bestemmer ikke hva Go henter."
      }
    ]
  },
  {
    "id": "scene-show-backup",
    "level": 1,
    "title": "Sikre hele oppsettet før gjesteteknikeren kommer",
    "nodeId": "fader",
    "question": "Du vil ta vare på busstruktur, scener og biblioteker før et annet oppsett lastes inn. Hva er mest dekkende?",
    "hint": "En scene er ikke hele systemoppsettet.",
    "lesson": "En Show-fil bevarer det samlede dLive-oppsettet; lagre og arkiver den før store endringer.",
    "sourceId": "shows",
    "options": [
      {
        "text": "Lagre et User Show og kopiere det til USB",
        "feedback": "Riktig. Kontroller navn og at kopien finnes. User Profiles ligger ikke i Show-filen og må håndteres separat ved behov.",
        "correct": true
      },
      {
        "text": "Lagre bare en EQ-preset",
        "feedback": "Den inneholder ikke busstruktur og alle scenene."
      },
      {
        "text": "Ta et bilde av faderne",
        "feedback": "Et bilde dokumenterer litt, men kan ikke gjenopprette hele oppsettet."
      }
    ]
  },
  {
    "id": "scene-show-live",
    "level": 2,
    "title": "Bytte hele Show midt i en sang?",
    "nodeId": "fader",
    "question": "Du trenger andre miksinnstillinger til neste sang. En kollega foreslår å laste et helt annet Show mens bandet spiller. Hva er den riktige vurderingen?",
    "hint": "Tenk på forskjellen mellom systemoppsett og en forberedt cue.",
    "lesson": "Vanlig Show-recall kan avbryte lyden og endre systemkonfigurasjon. Forbered testede scener til løpende overganger.",
    "sourceId": "shows",
    "options": [
      {
        "text": "Show-recall er alltid uten lydavbrudd",
        "feedback": "Vanlig Show-recall kan gi et kort avbrudd og bytte store deler av oppsettet."
      },
      {
        "text": "Det er trygt så lenge Show-filene har like navn",
        "feedback": "Navnene sier ingenting om forskjeller i ruting, busstruktur eller andre innstillinger."
      },
      {
        "text": "Bruke en forberedt scene og planlegge Show-bytte utenfor liveinnslaget",
        "feedback": "Riktig. En kontrollert scene med passende filter er laget for slike overganger. Fullt Show-bytte krever en annen plan.",
        "correct": true
      }
    ]
  }
];
