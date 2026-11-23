// These patch pairs are applied only to the existing *silent* signal model.
// A point's meter references a real key in simulateSignal(), never an invented live reading.
const point = (key, title, role, meaning, check, panel) => ({ key, title, role, meaning, check, panel });
export const signalDepth = {
  input: {
    question:'Hvordan finner mikrofonen riktig kanal?', topology:'line', pick:1,
    baseline:{}, alternate:{connected:false}, switchLabels:['Riktig patch','Brutt forbindelse'],
    observations:['Kilden når inngangen og preampen kan løfte den.','Utøveren synger fortsatt. Uten forbindelse kommer ingenting fram til preampen.'],
    desk:'Sjekk socket og kanalens kildevalg før du rører gain.', consolePanel:'preamp',
    points:[
      point('performer','Kilde','Fysisk lyd','Stemmen finnes i rommet selv om ingenting er koblet til. «Synger» er en forutsetning i denne skissen, ikke et mikrofonmål.','Be sangeren gjenta samme korte frase. Da sammenligner du samme hendelse.','source'),
      point('input','Inngang','Etter forbindelsen','Kabel, socket og patch må henge sammen. Her ser du det første signalet som faktisk kommer inn i modellen.','Er alle senere ledd stille, sjekk valgt kilde og patch før du skrur opp en fader.','source'),
      point('preamp','Preamp','Etter gain','Gain arbeider bare med det som kommer inn. En brutt forbindelse gir stillhet uansett gainverdi.','Er det signal her, har du avgrenset feilen: følg kanalen videre.','source'),
    ],
  },
  preamp: {
    question:'Hvorfor hjelper ikke faderen mot klipping?', topology:'line', pick:1,
    baseline:{gain:30,fader:-12}, alternate:{gain:54}, switchLabels:['Gain +30 dB','Gain +54 dB'],
    observations:['Faderen står på −12 dB i begge forsøk. Det er plass til sterkere inngangstopper.','Den modellerte inngangen treffer 0 dBFS. Faderen gjør resultatet svakere; den gjenskaper ikke bølgetoppen.'],
    desk:'Preamp-siden skiller socketens gain fra kanalens digitale trim. Se på riktig målepunkt.', consolePanel:'preamp',
    points:[
      point('input','Kildereferanse','Før gain','Vi bruker samme inngangsverdi i begge forsøk. Den er en referanse i modellen, ikke en måling av analog mikrofonspenning.','Be om den sterkeste delen av frasen før du setter arbeidsnivået.','gain'),
      point('preamp','A/D','Etter gain','Her blir nivået begrenset til digital fullskala i modellen. Når toppen allerede er kuttet, er formen tapt.','Sammenlign nivået her med nivået etter fader. Svak lyd i salen kan fortsatt låte vrengt.','gain'),
      point('post','Kanalutgang','Etter fader','Faderen demper den ferdig digitaliserte lyden. Et moderat nivå her utelukker derfor ikke klipping tidligere.','Lytt før fader; er vrengen allerede der, gå oppstrøms.','examples'),
    ],
  },
  processing: {
    question:'Hvor i kanalen forsvinner en svak tone?', topology:'line', pick:1,
    baseline:{gate:true,gateThreshold:-35}, alternate:{gateThreshold:-12}, switchLabels:['Terskel −35 dBFS','Terskel −12 dBFS'],
    observations:['Inngangen ligger over terskelen. Nivåvakten slipper signalet videre.','Inngangen er uendret, men ligger under den nye terskelen. I denne enkle modellen stenger gaten helt.'],
    desk:'I kanalens Overview kan du åpne prosessoren som endrer signalet. På Gate-siden ser du terskel og demping.', consolePanel:'gate',
    points:[
      point('preamp','Inn','Før behandling','Dette er referansen før filter, dynamikk og EQ. Sammenlign før og etter ved samme musikalske frase.','Når det fortsatt er signal inn, trenger du ikke begynne med kabelen.','hpf'),
      point('detector','Nivåvakt','Gate-detektor','Detektoren sammenligner signalet med terskelen. Gate velger etter nivå, ikke etter om lyden er ønsket eller uønsket.','På en skarptromme kan svake slag falle under terskelen selv om de sterke passerer.','gate'),
      point('processed','Ut','Etter behandling','Når gaten er lukket, kommer lyden svakere eller ikke videre. I Pro bestemmer Depth hvor mye en lukket gate demper.','Bypass én prosessor av gangen. Hvis halen kommer tilbake, vet du hvilket ledd du bør undersøke.','gate'),
    ],
  },
  fader: {
    question:'Hvem følger kanalfaderen?', topology:'fork', pick:1,
    baseline:{fader:0,monitorPre:true,monitorSend:-6}, alternate:{fader:-18}, switchLabels:['Fader 0 dB','Fader −18 dB'],
    observations:['0 dB betyr at faderen verken løfter eller demper. Monitoren tapper signalet før faderen.','Salsveien faller 18 dB. Monitoren beholder sitt nivå fordi den er satt pre-fade.'],
    desk:'Velg kanalen med Sel. En fader styrer et nivå; Sel alene skal ikke endre det.', consolePanel:'bank',
    points:[
      point('processed','Kanal','Før fader','Prosesseringen er ferdig, men nivået til salen er ikke bestemt ennå. Her forgrener modellen seg.','Hold gain fast mens du sammenligner faderposisjonene.','level'),
      point('post','Til salen','Post-fade','Denne veien følger kanalens fader når kanalen er tilordnet Main. Det er her du plasserer kilden i miksen.','Trekk ned instrumentet som dekker vokalen. Kommer konsonantene fram uten mer vokalgain?','level'),
      point('monitor','Til monitor','Pre-fade','Denne monitorsenden har sin egen nivåkontroll og blir ikke med på faderbevegelsen.','Hvis musikeren mister seg selv idet salen justeres, sjekk tappestedet.','level'),
    ],
  },
  monitor_branch: {
    question:'Hvorfor kan sangerens miks endre seg med salen?', topology:'fork', pick:2,
    baseline:{fader:-18,monitorSend:-6,monitorPre:true}, alternate:{monitorPre:false}, switchLabels:['Pre-fade','Post-fade'],
    observations:['Monitoren henter signal før kanalfaderen. Salen er allerede dempet 18 dB.','Samme monitorsend ligger nå etter faderen. Monitoren faller 18 dB selv om send-nivået er uendret.'],
    desk:'På en fysisk dLive: velg riktig Aux-miks og sjekk sendens pre/post-status. Kanalfaderne kan vise send-nivåer når du mikser til en aux.',
    points:[
      point('processed','Kanal','Etter behandling','Begge lyttepunktene stammer fra samme kanal. De trenger ikke hente signal på samme sted.','Lytt til kilden først: er problemet i begge miksene eller bare hos musikeren?','send'),
      point('post','Sal','Kanalfader −18 dB','Salsveien går fortsatt via kanalfaderen. Å endre monitorens tappested endrer ikke salen.','Hold salsmiksen fast mens du feilsøker monitorsendingen.','compare'),
      point('monitor','Monitor','Egen aux-send','Pre-fade henter før kanalfaderen; post-fade henter etter. Send-nivået i dette forsøket er alltid −6 dB.','Sjekk pre/post hvis monitorvolumet følger bevegelser som bare var ment for salen.','send'),
    ],
  },
  fx_branch: {
    question:'Hvorfor er det signal på senden, men ingen klang?', topology:'line', pick:2,
    baseline:{fxType:'reverb',fxSend:-12,fxReturn:true}, alternate:{fxReturn:false}, switchLabels:['Retur til Main','Retur frakoblet'],
    observations:['Effekten får en kopi, og returen sender den behandlede lyden til miksen.','Det er fortsatt signal inn i effekten. Bare returens bidrag til Main er borte; tørr kanal fortsetter.'],
    desk:'Tenk på FX-senden og FX-returen som to forskjellige steder å sjekke.',
    points:[
      point('post','Tørr kanal','Etter fader','Originalen kan gå til Main samtidig som en kopi sendes til effekten. I denne øvelsen er FX-senden post-fade.','Lytt etter konsonanten eller slaget før du lytter til halen.','type'),
      point('fx','FX-send','Inn i effekten','Send-nivå bestemmer hvor mye denne kanalen mater effekten med. En aktiv send betyr ikke at salen hører returen.','Er det signal her, trenger du ikke øke senden for å reparere en deaktivert retur.','send'),
      point('fxReturn','FX-retur','Effekt til Main','Returen fører bare effektbidraget tilbake. Skissen viser et nivåbidrag; den simulerer ikke en klanghales tidsforløp.','På et opptak: lytt i oppholdet etter en stavelse. Forsvinner halen når du slår av returen?','return'),
    ],
  },
  mixbus: {
    question:'Hvordan kan du høre bare klangen av en stemme?', topology:'sum', pick:2,
    baseline:{fxType:'reverb',fxSend:-6,fxReturn:true,mainAssigned:true}, alternate:{mainAssigned:false}, switchLabels:['Tørr + retur','Bare retur'],
    observations:['Tørr kanal og effektretur er begge tilordnet Main. Modellen beregner et samlet illustrasjonsnivå.','Kanalens direkte LR-tildeling er av. FX-returen er en separat vei, så Main er ikke stille.'],
    desk:'Kontroller kanalens Main-tildeling og returen som to egne ruter. En åpen fader er ikke det samme som en aktiv tildeling.',
    points:[
      point('main','Tørr kanal','Direkte til Main','Tildelingen bestemmer om kanalen går denne veien. Den endrer ikke nivået som allerede mates til FX-senden.','Er monitoren normal, men tørr vokal borte i salen? Sjekk kanalens LR-tildeling.','main'),
      point('fxReturn','Effektretur','Våt vei','Klang eller ekko kommer tilbake via sin egen retur. Den kan høres selv om den tørre kanalen ikke er tilordnet Main.','Lytt etter tydelige stavelser kontra bare en fjern hale.','balance'),
      point('mix','Main LR','Summen','Main samler rutene som er aktive. Nivåer i dB kan ikke bare legges sammen; resultatet avhenger også av signalene.','Undersøk hvilken av de to rutene som mangler før du løfter hele Main.','balance'),
    ],
  },
  matrix: {
    question:'Hvordan demper du én sone uten å endre Main?', topology:'line', pick:1,
    baseline:{matrixLevel:0}, alternate:{matrixLevel:-12}, switchLabels:['Matrix 0 dB','Matrix −12 dB'],
    observations:['Matrixen videresender Main på samme nivå i denne enkle sonen.','Bare sonen etter matrixen blir 12 dB svakere. Main beholder samme miks og nivå.'],
    desk:'På en fysisk dLive er Matrix en egen miks. I dette eksemplet mates den bare fra Main LR.',
    points:[
      point('mix','Main LR','Matebuss','Main er kilden til denne sonen. En sonejustering nedstrøms endrer ikke blandingen som allerede er laget.','Hvis hele salen og alle soner har samme problem, sjekk Main først.','compare'),
      point('matrix','Matrix','Eget sonenivå','En egen utgangsfader gir deg en lokal nivåendring. Forholdet mellom vokal og piano holder seg likt i sonen.','Senk frontfill uten å trekke ned hovedmiksen. Hva viser meteret på hver side?','level'),
      point('pa','Til PA','Sonens utgang','I denne ruten leverer matrixen signal til PA-utgangen. Andre soner på et fysisk anlegg kan være rutet annerledes.','Er én sone stille, finn den siste bussen med signal før den aktuelle utgangen.','compare'),
    ],
  },
  speakers: {
    question:'Betyr signal på meteret at det er lyd i rommet?', topology:'line', pick:1,
    baseline:{paEnabled:true}, alternate:{paEnabled:false}, switchLabels:['Utgang aktiv','Utgang av'],
    observations:['Matrix og utgang har digitalt signal. Lydtrykket ute i rommet kan ikke leses av disse målerne.','Matrix har fortsatt signal, men utgangen i skissen er deaktivert. Rommet er aldri målt av appen.'],
    desk:'Følg ruten fra matrix til riktig utgang. Digitalnivå på konsollen og akustisk nivå i salen er forskjellige størrelser.',
    points:[
      point('matrix','Matrix','Før utgang','Dette målepunktet ligger før siste utgang i modellen. Her kan det fortsatt være signal selv om neste ledd er stille.','Finn det siste stedet som har signal, i stedet for å skru opp flere nivåer samtidig.','level'),
      point('pa','Utgang','Digitalt signal','En aktiv og riktig rutet utgang må føre signalet videre. En verdi i dBFS forteller bare om digitalt nivå.','Hvis det er signal på matrixen, sjekk utgangens status og ruting.','output'),
      point('room','Rom','Akustisk lyd','Høyttaler, forsterkning, rom og lytteposisjon avgjør hva lytteren faktisk hører. Her finnes ingen SPL-måler.','Bruk ørene på lytteplassen for å vurdere om problemet gjelder én sone eller hele salen.','output'),
    ],
  },
};
