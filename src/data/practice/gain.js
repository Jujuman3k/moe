// Originale øvingssituasjoner; faggrunnlag er samlet i sources.js.
export const gainScenarios = [
  {
    "id": "gain-input-clips",
    "level": 1,
    "title": "Rødt allerede på inngangen",
    "nodeId": "preamp",
    "question": "Inngangstrinnet overstyres når sangeren synger sterkt. Kanalfaderen står lavt. Hva retter selve overstyringen?",
    "hint": "En fader kan ikke gjøre et allerede forvrengt signal rent igjen.",
    "lesson": "Juster nivået før det overstyrte trinnet. Sett gain med realistiske topper.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Redusere preamp-gain og kontrollere de sterkeste partiene",
        "feedback": "Riktig. Når overstyringen skjer i inngangstrinnet, må nivået reduseres der eller tidligere.",
        "correct": true
      },
      {
        "text": "Senke kanalfaderen enda mer",
        "feedback": "Det senker lyden etter inngangstrinnet, men reparerer ikke overstyringen som allerede har skjedd."
      },
      {
        "text": "Senke masterfaderen",
        "feedback": "Da blir også resten av miksen svakere. Inngangens forvrengning består."
      }
    ]
  },
  {
    "id": "gain-shared-preamp",
    "level": 2,
    "title": "Samme mikrofon, to kanaler",
    "nodeId": "preamp",
    "question": "FOH og monitor bruker hver sin kanal fra samme fysiske preamp. Inngangen har god margin. Du trenger bare lavere nivå inn i FOH-kanalens prosessering. Hva er mest målrettet?",
    "hint": "Skill mellom den felles analoge forsterkeren og den enkelte kanalen.",
    "lesson": "En delt preamp påvirker alle som bruker den. Digital trim tilhører kanalen.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Senke den delte preamp-gainen uten å avtale det",
        "feedback": "Da endres også signalet til monitor. Avtal endringer i felles gain."
      },
      {
        "text": "Justere digital trim på FOH-kanalen",
        "feedback": "Riktig. I dette oppsettet endres FOH-kanalen uten å endre den felles preampen. Monitor bruker en egen kanal.",
        "correct": true
      },
      {
        "text": "Senke gain og øke monitorens master like mye",
        "feedback": "Det krever unødvendige endringer i flere ledd og kan påvirke dynamikkprosessorene."
      }
    ]
  },
  {
    "id": "gain-headroom",
    "level": 1,
    "title": "Lydsjekken var mye roligere",
    "nodeId": "preamp",
    "question": "Under lydsjekken sang vokalisten svakt. På konserten er toppene betydelig sterkere. Hvordan planlegger du gain bedre neste gang?",
    "hint": "Den sterkeste forventede lyden er viktigere enn et pent gjennomsnitt.",
    "lesson": "Headroom er margin til toppene. Målet er et rent signal, ikke å holde alle metere nær maksimum.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Sette nivået så nær klipping som mulig ved rolig sang",
        "feedback": "Da blir det liten plass til de sterkere partiene."
      },
      {
        "text": "Bruke samme gainverdi som på alle andre vokalmikrofoner",
        "feedback": "Nivået varierer med stemme, avstand og mikrofon. En fast verdi passer ikke alle."
      },
      {
        "text": "Be om realistisk sterk sang og la det være margin",
        "feedback": "Riktig. Kontroller de faktiske toppene og behold rom for variasjoner under arrangementet.",
        "correct": true
      }
    ]
  },
  {
    "id": "gain-downstream-level",
    "level": 2,
    "title": "Godt inngangssignal, svak sal",
    "nodeId": "preamp",
    "question": "Inngangen har et rent, stabilt nivå med god margin. Vokalen er likevel for svak i salen. Hva undersøker du før du endrer gain?",
    "hint": "Følg signalet videre fra inngangen.",
    "lesson": "Bruk gain til inngangsnivået og kontroller miks/ruting når et godt signal ikke når frem.",
    "sourceId": "routing",
    "options": [
      {
        "text": "Kanalfader, DCA, tilordning og nivå videre mot hovedutgangen",
        "feedback": "Riktig. Et nivå- eller rutingproblem senere i kjeden skal lokaliseres der.",
        "correct": true
      },
      {
        "text": "Øke preamp-gain helt til salen er høy nok",
        "feedback": "Det kan forstyrre monitorer og prosessering, selv om inngangsnivået allerede er riktig."
      },
      {
        "text": "Øke kompressorens ratio",
        "feedback": "Mer kompresjon er ikke en målrettet løsning på manglende nivå i signalveien."
      }
    ]
  },
  {
    "id": "gain-wireless-distortion",
    "level": 2,
    "title": "Trådløs vokal vrenger før mikseren",
    "nodeId": "preamp",
    "question": "Mottakerens lydmeter viser overstyring når sangeren roper. dLive-inngangen har god margin, og signalet er fortsatt forvrengt etter at du senker mikserens gain. Hvor leter du videre?",
    "hint": "Feilen kan oppstå før signalet når mikseren.",
    "lesson": "Kontroller hele gainkjeden: sender, mottaker, mikser og videre utgangstrinn.",
    "sourceId": "wireless",
    "options": [
      {
        "text": "Bare i mikserens EQ",
        "feedback": "EQ kan endre klangen, men gjenoppretter ikke topper som er klippet tidligere."
      },
      {
        "text": "Senderens inngangsnivå og mottakerens nivåinnstillinger",
        "feedback": "Riktig. Finn hvor den trådløse kjeden overstyres, og følg modellens fremgangsmåte for gain.",
        "correct": true
      },
      {
        "text": "I monitorens pre/post-valg",
        "feedback": "Dette påvirker monitorens nivåfølging, ikke overstyring i sender eller mottaker."
      }
    ]
  },
  {
    "id": "gain-trim-not-repair",
    "level": 3,
    "title": "Trim skjuler den røde toppen",
    "nodeId": "preamp",
    "question": "Den analoge preampen klipper. Du senker digital trim, og kanalens post-trim-meter ser nå fint ut. Hva er riktig vurdering?",
    "hint": "Et meter viser nivået på sitt målepunkt, ikke nødvendigvis tidligere overstyring.",
    "lesson": "Et lavere nivå etter klipping fjerner ikke forvrengningen. Kjenn meterets målepunkt.",
    "sourceId": "processing",
    "options": [
      {
        "text": "Problemet er løst fordi siste meter ikke er rødt",
        "feedback": "Post-trim-meteret kan se normalt ut selv om signalet ble forvrengt før trim."
      },
      {
        "text": "Mer kompresjon vil rekonstruere de klippede toppene",
        "feedback": "Kompresjon kan begrense videre nivå, men gjenoppretter ikke det tapte signalet."
      },
      {
        "text": "Preamp-nivået må fortsatt reduseres",
        "feedback": "Riktig. Rett overstyringen i inngangstrinnet og vurder deretter kanalens trim på nytt.",
        "correct": true
      }
    ]
  }
];
