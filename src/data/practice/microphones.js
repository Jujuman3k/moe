// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const microphonesScenarios = [
  {
    "id": "mic-distance",
    "level": 1,
    "title": "Taleren går bort fra mikrofonen",
    "nodeId": "input",
    "question": "Taleren lener seg bakover. Stemmen blir svakere, mens romklang og scenestøy blir tydeligere. Hva vil vanligvis hjelpe mest først?",
    "hint": "Forholdet mellom direkte lyd og romlyd starter før mikseren.",
    "lesson": "God og jevn mikrofonavstand gir et bedre utgangspunkt enn å kompensere alt med gain.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Øke kanalens gain hver gang taleren flytter seg",
        "feedback": "Da øker også romlyd og lekkasje. Det kan gi mindre margin før feedback."
      },
      {
        "text": "Avtale jevn avstand og justere mikrofonplasseringen",
        "feedback": "Riktig. En passende, stabil avstand gjør nivå og klang mer forutsigbare.",
        "correct": true
      },
      {
        "text": "Legge mer klang på stemmen",
        "feedback": "Mer klang gjør ikke den direkte stemmen tydeligere i denne situasjonen."
      }
    ]
  },
  {
    "id": "mic-cardioid-wedge",
    "level": 2,
    "title": "Monitoren møter feil side",
    "nodeId": "input",
    "question": "En vokalist bruker en vanlig kardioidemikrofon. En gulvmonitor peker inn mot mikrofonens mest følsomme side. Hva bør du undersøke?",
    "hint": "Se på mikrofonens retningsdiagram før du tenker EQ.",
    "lesson": "Monitorplassering må passe mikrofonens retningskarakteristikk; superkardioide har andre nullretninger enn kardioide.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Flytte monitoren mot mikrofonens minst følsomme retning",
        "feedback": "Riktig. For en vanlig kardioide er dette omtrent bak mikrofonen. Kontroller modellens diagram og praktisk plassering.",
        "correct": true
      },
      {
        "text": "Plassere monitoren nærmere mikrofonens front",
        "feedback": "Da kan mikrofonen plukke opp mer monitorlyd og begynne å tilbakekoble tidligere."
      },
      {
        "text": "Bytte til rundstrålende mikrofon uten å flytte noe",
        "feedback": "Rundstrålende mikrofoner har ingen tilsvarende bakre nullretning. Det løser ikke plasseringen."
      }
    ]
  },
  {
    "id": "mic-phantom",
    "level": 1,
    "title": "Kondensatormikrofonen er stille",
    "nodeId": "input",
    "question": "Kabel og patch er kontrollert. En kondensatormikrofon som ifølge manualen trenger 48 V, gir ikke signal. Hva gjør du?",
    "hint": "Strømbehovet bestemmes av utstyret, ikke av hvor svak lyden er.",
    "lesson": "Kontroller modell og tilkobling før phantom aktiveres, og demp signalveien under omkoblingen.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Skru gain helt opp for å teste",
        "feedback": "Manglende strøm løses ikke med gain. Maksimal gain kan gi et kraftig nivåsprang når feilen rettes."
      },
      {
        "text": "Aktivere 48 V på alle innganger",
        "feedback": "Det er unødvendig. Strømbehov og kompatibilitet må vurderes for hver tilkoblet kilde."
      },
      {
        "text": "Dempe kanalen og aktivere 48 V på riktig inngang",
        "feedback": "Riktig. Følg mikrofonens krav og la strømforsyningen stabilisere seg før du forsiktig åpner signalveien.",
        "correct": true
      }
    ]
  },
  {
    "id": "mic-cupping",
    "level": 2,
    "title": "Vokalisten dekker mikrofonhodet",
    "nodeId": "input",
    "question": "Lyden blir hul og monitoren begynner å ringe når vokalisten holder rundt gitteret. Hva er det beste første tiltaket?",
    "hint": "Grepet kan endre hvordan mikrofonen tar opp lyd fra ulike retninger.",
    "lesson": "Mikrofonteknikk påvirker både klang og marginen før feedback.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Be vokalisten holde på skaftet og la gitteret være fritt",
        "feedback": "Riktig. Et fritt gitter gjør at mikrofonen kan arbeide mer som tiltenkt.",
        "correct": true
      },
      {
        "text": "Lagre en kraftig EQ-kurve som passer dette grepet",
        "feedback": "Når grepet endres igjen, passer kanskje ikke EQ-en. Rett årsaken før du kompenserer."
      },
      {
        "text": "Øke monitoren for å overdøve ringingen",
        "feedback": "Dette kan øke tilbakekoblingen og forverre problemet."
      }
    ]
  },
  {
    "id": "mic-two-sources",
    "level": 3,
    "title": "To mikrofoner, mindre fylde",
    "nodeId": "input",
    "question": "To mikrofoner på samme gitarforsterker låter fyldig hver for seg, men tynt sammen. Ingen kanaler klipper. Hva undersøker du først?",
    "hint": "Den samme lyden kan ankomme mikrofonene på litt ulike tidspunkt.",
    "lesson": "Kontroller plassering og tids-/polaritetsforhold før du forsøker å EQ-e bort kansellering.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Booste bass på begge kanalene",
        "feedback": "En boost retter ikke nødvendigvis kanselleringen mellom de to signalene."
      },
      {
        "text": "Lytte til én og én, så sammen, og prøve små plasseringstilpasninger",
        "feedback": "Riktig. Sammenlign summen kontrollert. Polaritetsvending kan være en nyttig test, men korrigerer ikke enhver tidsforskjell.",
        "correct": true
      },
      {
        "text": "Gi begge mikrofonene mer gain",
        "feedback": "Lik nivåøkning endrer ikke den relative ankomsttiden."
      }
    ]
  },
  {
    "id": "mic-acoustic-guitar",
    "level": 1,
    "title": "Kassegitaren buldrer",
    "nodeId": "input",
    "question": "En mikrofon peker tett inn i lydhullet på en akustisk gitar. Lyden er bassrik og utydelig. Hva er et godt første forsøk under lydsjekk?",
    "hint": "Prøv å forbedre lyden ved kilden før du gjør store inngrep.",
    "lesson": "Mikrofonplassering er en klangkontroll. Lytt mens du gjør små endringer.",
    "sourceId": "shureLive",
    "options": [
      {
        "text": "Senke diskanten kraftig",
        "feedback": "Da kan gitaren bli enda mørkere uten at buldringen forsvinner."
      },
      {
        "text": "Legge en limiter på hovedmiksen",
        "feedback": "En hovedlimiter endrer ikke balansen mellom gitarens frekvenser på en målrettet måte."
      },
      {
        "text": "Flytte mikrofonen mot området ved hals/kropp og lytte",
        "feedback": "Riktig. Dette er et utgangspunkt for å redusere dominansen fra lydhullet; finn plasseringen som passer gitaren og rommet.",
        "correct": true
      }
    ]
  }
];
