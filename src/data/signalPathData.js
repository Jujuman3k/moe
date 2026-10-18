

export const signalPathData = [
  {
    id: "input",
    label: "Kabler & Stageboks",
    iconName: "Mic2",
    x: 50, y: 100,
    desc: "Oversikt over plugger.",
    details: "For å få lyd inn i systemet må vi velge riktig kabel og forstå forskjellen på balanserte og ubalanserte signaler.",
    viz: "input_connectors",

    relatedVideos: [
       { videoId: "l6vrcz2xoqQ", title: "Kildevalg (Source Select)", desc: "Hvordan patche innganger i dLive." }
    ],

    deepDiveTitle: "Kabel-Teori",
    deepDive: [
      {
        name: "XLR (Han & Hun)",
        tag: "Balansert",
        info: "XLR-kabler har en retning: Signalet går alltid UT av Han-pluggen (pinner) og INN i Hun-pluggen (hull). De er balanserte, som betyr at de kansellerer ut støy. Derfor kan vi strekke dem 100 meter uten problemer."
      },
      {
        name: "Jack (Ubalansert)",
        tag: "Støy-felle",
        info: "Hvorfor Jack? Det er standarden på gitarer fordi den er billig og robust. Men signalet er ubalansert. Det betyr at kabelen fungerer som en antenne. Er kabelen lenger enn 5 meter, vil du garantert få during og støy."
      },
      {
        name: "DI-Boks: Problemløseren",
        tag: "Konvertering",
        info: "Siden Jack støyer på lange strekk, bruker vi en DI-boks. Den gjør om det ubalanserte Jack-signalet til et balansert XLR-signal som kan sendes helt til mikseren uten støy."
      },
      {
        name: "Ground Lift (Løft)",
        tag: "Brum-fjerner",
        info: "På DI-boksen finner du ofte en knapp som heter 'Lift'. Hvis du hører en dyp during (50Hz brum) fra en PC eller Synth, trykk på denne! Den kutter jordforbindelsen og bryter 'loopen' som skaper støyen."
      },
      {
        name: "Speakon",
        tag: "Utgang / Monitor",
        info: "Brukes for å koble forsterkere til passive høyttalere. Dette gjelder ofte scenemonitorer (wedges) og hoved-PA. Den låses fast med en vri for sikkerhet. Fører sterk strøm og må aldri blandes med mikrofonkabler."
      }
    ]
  },
  {
    id: "preamp",
    label: "Preamp / Gain",
    iconName: "Activity",
    x: 200, y: 100,
    desc: "Forsterkning av signalet.",

    details: "Juster gain mens kilden spiller eller synger på forventet nivå. Hold god avstand til klipping, slik at det er plass til uventede topper. Kontroller hvilken skala og hvilket målepunkt meteret bruker.",

    viz: "gain_structure",

    relatedVideos: [
      { videoId: "sdrgPJD0Vvg", title: "VIKTIG: Gain Struktur", desc: "Fundamentet for all god lyd. Må sees!" },
      { videoId: "G-_x7xDcn5k", title: "Gain viktig?", desc: "Mer om Gain." },
      { videoId: "w-v75Mgh9dA", title: "Lydteknikerens rolle", desc: "Oversikt over miksing og gain." },
    ],

    deepDiveTitle: "Teori & Innstillinger",
    deepDive: [
      {
        name: "Hvorfor er Gain viktig?",
        tag: "Fundamentet",
        info: "Gain er det aller viktigste trinnet i signalkjeden. Det bestemmer arbeidsnivået inn i mikseren. Målet er å løfte signalet godt over støygulvet, men holde god avstand til taket (Headroom)."
      },
      {
        name: "Hva gjør Preampen?",
        tag: "Signalnivå",
        info: "En mikrofon leverer ekstremt svak spenning (mic level). Preampen forsterker dette opp til 'Line Level' slik at kretsene og prosesseringen i mikseren kan jobbe med et sunt signal uten støy."
      },
      {
        name: "A/D Konvertering",
        tag: "Kritisk",
        info: "Rett etter preampen gjøres de analoge strømbølgene om til digitale tall (0 og 1). Denne konverteren har et absolutt tak på 0dBFS. Hvis det analoge signalet er for kraftig når det treffer konverteren, finnes det ingen digitale verdier som kan representere det."
      },
      {
        name: "Konsekvenser av Klipping",
        tag: "Advarsel",
        info: "Når en lydbølge blir kappet flatt (klipping), endres bølgeformen mot en firkantbølge. Dette introduserer kraftig harmonisk forvrengning og høyfrekvent energi som kan overopphete diskanthøyttalere."
      },
      {
        name: "48V Phantom",
        tag: "Strøm",
        info: "Leverer 48 volt spenning via XLR-kabelen. Påkrevd for kondensatormikrofoner og aktive DI-bokser."
      },
      {
        name: "Pad (-20dB)",
        tag: "Demping",
        info: "En motstand som demper signalet *før* preampen. Brukes hvis kilden er så kraftig at den vrenger selv med Gain på minimum."
      },
      {
        name: "Polaritet (Ø)",
        tag: "Fase",
        info: "Vender signalets fase 180 grader. Kritisk når to mikrofoner plukker opp samme kilde."
      },
      {
        name: "Gain Staging",
        tag: "Best Practice",
        info: "La kilden spille på forventet nivå, sjekk meterets skala og målepunkt, og behold headroom til sterkere topper. Meterfarge alene er ikke et universelt nivåmål."
      },
      {
        name: "Digital Trim",
        tag: "Finjustering",
        info: "På digitale miksere har du ofte en 'Trim' etter A/D-konverteren. Denne påvirker kun volumet digitalt."
      }
    ]
  },
  {
    id: "processing",
    label: "Processing Strip",
    iconName: "Settings",
    x: 350, y: 100,
    desc: "HPF, Gate, EQ, Kompressor.",
    details: "Kjernen i lydbehandlingen. Velg modul under for å se detaljer og videoer.",

    // --- GENERELLE VIDEOER FOR HELE STRIPEN ---
    relatedVideos: [
       { videoId: "8BLsze-hE10", title: "Basis Kompresjon", desc: "Hvordan kontrollere dynamikk (Start her!)." },
       { videoId: "YgCIo-lzlHw", title: "Generelt om EQ", desc: "Slik former du lyden." }
    ],

    subChain: [
      {
        label: "Filters (HPF / LPF)",
        desc: "Rens opp i toppen og bunnen av lyden.",
        viz: "hpf"
      },
{
        label: "Gate",
        desc: "Fjerner bakgrunnsstøy",
        viz: "gate",  // <-- Her manglet det et komma!
        relatedVideos: [
           { videoId: "DCQaRbwf1PA", title: "Gate Overview", desc: "Hvordan sette opp noise gate og sidechain." }
        ]
      },
      {
        label: "Insert A",
        desc: "Dyn8, DEEP, Plugins...",
        viz: "inserts",
        // --- VIDEOER SPESIFIKT FOR INSERTS (Dyn8, DEEP osv) ---
        relatedVideos: [
           { videoId: "huA9ACDOgDA", title: "Dyn8 Multiband", desc: "Kraftig verktøy for dynamisk EQ og kompresjon." },
           { videoId: "l_42QaBb3mk", title: "Hypabass (Sub-synth)", desc: "Lag dypbass fra ingenting." },
           { videoId: "jHzZUuIrvLw", title: "Opto Compressor", desc: "LA-2A stil. Myk og musikalsk på vokal." },
           { videoId: "idNyL9imKDY", title: "16T Compressor", desc: "1176 stil. Rask og aggressiv." },
           { videoId: "4jw-8nNgbQ8", title: "Peak Limiter 76", desc: "Stopper toppene hardt." },
           { videoId: "Djr1ZlVdl34", title: "Dynamic EQ", desc: "EQ som reagerer på volum." },
           { videoId: "RGaAl-hx5-M", title: "Multiband Comp", desc: "Komprimer kun bass eller diskant." }
        ]
      },
      {
        label: "PEQ",
        desc: "4-bånds Equalizer",
        viz: "peq",
        // --- VIDEOER SPESIFIKT FOR EQ ---
        relatedVideos: [
           { videoId: "EPjrFU5d_OA", title: "EQ på Vokal", desc: "Praktiske tips for å skru vokal." },
           { videoId: "YgCIo-lzlHw", title: "Generell EQ Teori", desc: "Frekvenser og filtre forklart." }
        ]
      },
      {
        label: "Compressor",
        desc: "Dynamikk kontroll",
        viz: "comp",
        // --- VIDEOER SPESIFIKT FOR KOMPRESSOR ---
        relatedVideos: [
           { videoId: "XEuP7hscNy8", title: "Kompresjon i dybden", desc: "Threshold, Ratio, Attack og Release." },
           { videoId: "8BLsze-hE10", title: "Unngå Feedback", desc: "Hvordan kompresjon påvirker feedback." }
        ],
        deepDive: [
          { name: "Threshold", tag: "Start", info: "Når den begynner å jobbe." },
          { name: "Ratio", tag: "Mengde", info: "Hvor mye den demper." },
          { name: "Attack", tag: "Respons", info: "Rask = dreper klikket. Treg = mer punch." },
          { name: "Release", tag: "Pust", info: "Hvor fort volumet kommer tilbake." }
        ]
      }
    ]
  },
  {
    id: "monitor_branch",
    label: "Aux Send (Monitor)",
    iconName: "CornerDownRight",
    type: "branch_out",
    source: "processing",
    x: 475, y: 180,
    desc: "Egen miks til scenen, ofte pre-fade.",
    details: "En aux-send lager en egen miks til monitorene. Når senden er pre-fade, følger den ikke kanalfaderen; post-fade følger faderen. På dLive kan Mix Source velges per miks, så kontroller også hvor i prosesseringen signalet hentes.",
    viz: "monitor_map"
  },
  {
    id: "fader",
    label: "Fader & Mute & PAN",
    iconName: "Sliders",
    x: 600, y: 100,
    desc: "Volum, Pan, Solo & Patching.",
    details: "Dette er kontrollsenteret. Her setter du sluttvolum, plassering i stereo-bildet, og styrer lytting (PAFL).",
    viz: "fader_section",

    relatedVideos: [
      { videoId: "w-v75Mgh9dA", title: "Lydteknikerens rolle", desc: "Hva er jobben vår egentlig? (Viktig!)" },
      { videoId: "YEorsfZe4vU", title: "Balanse i miksen", desc: "Volum og panorering forklart." },
    ],

    deepDiveTitle: "Fader & Kanal Funksjoner",
    deepDive: [
      {
        name: "Fader (Volum)",
        tag: "Nivå",
        info: "Dette er volumkontrol for kanalen. Skalaen er logaritmisk, noe som betyr at du har mest finkontroll rundt 0dB-merket. Under -20dB skjer endringene veldig brått."
      },
      {
        name: "Pan (Panorering)",
        tag: "Bredde",
        info: "Plasserer lyden i lydbildet (Venstre/Høyre). Ved å spre instrumentene skaper du plass i midten til det viktigste: Vokalen og Basstromma."
      },
      {
        name: "PAFL (Solo)",
        tag: "Lytting",
        info: "Pre/After Fade Listen. Dette er din 'Solo'-knapp. Den sender lyden til dine hodetelefoner og monitorhøyttaleren ved mikseren, uten å påvirke lyden ut i salen."
      },
      {
        name: "Mute",
        tag: "Av/På",
        info: "Slår av lyden fullstendig. Husk: Mute kutter også lyden til monitorene (Aux), men påvirker ikke PFL-lytting."
      }
    ]
  },
{
    id: "fx_branch",
    label: "FX Send (Klang & Delay)",
    iconName: "Sparkles",
    type: "branch_out",
    source: "fader",
    x: 750, y: 180,
    desc: "Lyd til klangboks (Post-Fader).",

    // --- 1. OVERSIKT: KUN KONSEPTET (Ren og ryddig) ---
    details: "Her gir vi lyden romfølelse! Uten effekter låter det tørt og 'dødt'. \n\n• KLANG (Reverb): Simulerer at instrumentene står i et fysisk rom (som en hall eller stue).\n• DELAY (Ekko): Lager rytmiske repetisjoner av lyden.",

    viz: "fx_info",

    relatedVideos: [
      { videoId: "1gyJEdQD3G4", title: "dLive FX Oversikt", desc: "Grundig gjennomgang av effektene." },
      { videoId: "K9XUNtfflLo", title: "Routing av FX", desc: "Hvordan sende lyd til klangboksen (Send/Return)." },
      { videoId: "oBB_Xei6mXY", title: "Oppsett av FX Rack", desc: "Hvordan velge og plassere effekter i racket." },
      { videoId: "YyekNJMWYas", title: "Standard FX Demo", desc: "Demo av effektene vi har (Standard Pack)." }
    ],

    // --- 2. FORDYPNING: TEKNISK & ROUTING ---
    deepDiveTitle: "Teknisk Routing",
    deepDive: [
      {
        name: "Send & Return",
        tag: "Signalvei",
        info: "Vi bruker 'Send'-metoden. Du sender en KOPI av lyden til klangboksen (via Aux/Bus). Klangen kommer tilbake på en egen fader (FX Return). Slik kan du mikse tørt og vått signal perfekt."
      },
      // --- NYTT PUNKT: EQ FØR OG ETTER ---
      {
        name: "EQ på Klang (Før vs. Etter)",
        tag: "Pro Trick",
        info: "Du kan forme klangen to steder:\n1. FØR (Send Master): 'Shit in = Shit out'. Hvis du fjerner bassen FØR den treffer klangboksen, slipper klangen å jobbe med gjørmete frekvenser. Dette gir renest resultat.\n2. ETTER (FX Return): Her former du selve 'halen' som kommer tilbake. F.eks. gjøre klangen mørkere for at den skal ligge bak i miksen."
      },
      {
        name: "Post-Fader",
        tag: "Viktig",
        info: "FX-sendinger er vanligvis post-fade, men kan også settes pre-fade. Med post-fade følger send-nivået kanalfaderen. Drar du ned vokalen, reduseres signalet inn i effekten. En klanghale kan fortsette etterpå."
      },
      {
        name: "Rack-begrensninger",
        tag: "Hardware",
        info: "dLive har 16 Rack-plasser. Hver klang/delay tar én plass. Tunge inserts (Hypabass) stjeler også herfra. (Dyn8 og DEEP bruker ikke av racket)."
      }
    ],

    // --- 3. TIPS: INNSTILLINGER ---
    proTips: [
      {
        name: "Vokal Reverb: Pre-Delay",
        tag: "30-50ms",
        info: "Dette er hemmeligheten for tydelig vokal! Det forsinker klangen bittelitt, slik at selve ordet (konsonantene) kommer frem FØR klangen starter. Hindrer 'grøtete' lyd."
      },
      {
        name: "Vokal Reverb: EQ",
        tag: "HPF/LPF",
        info: "Klang skal høres, ikke støye. \n• Kutt toppen (LPF) på 6-8kHz for å fjerne sss-lyder.\n• Kutt bunnen (HPF) på 200Hz for å fjerne rumling."
      },
      {
        name: "Delay: Tap Tempo",
        tag: "Må gjøres!",
        info: "Delay MÅ gå i takt med musikken for å låte bra. Bruk en SoftKey tilegnet 'Tap Tempo' og trykk i takt med låta før du skrur opp volumet på delayen."
      },
      {
        name: "Tromme-Klang",
        tag: "Kort & Hard",
        info: "På skarptromme vil vi ha 'smell', ikke 'hale'. Bruk 'Gated' eller 'NonLin' preset med kort tid (under 1 sek). Det gjør tromma feit uten å rote til miksen."
      }
    ]
  },
{
    id: "mixbus",
    label: "Mix Bus / Main LR",
    iconName: "Layers",
    x: 900, y: 100,
    desc: "Summen av alle kanaler.",

    details: "Her samles alle signalene før de går til høyttalerne. Det er smart å organisere miksen i Grupper og DCA-er for å ha kontroll.",

    viz: "mixbus_map",

    relatedVideos: [
      { videoId: "JEvV97HOLm4", title: "Bus Configuration", desc: "Hvordan sette opp og endre antall Busser (Groups, Aux, Matrix)." },
      { videoId: "VyOjG0HuuBQ", title: "Output Processing", desc: "Gjennomgang av prosessering på utganger (GEQ, Comp, Insert)." },
      { videoId: "Lgr2cALG_1w", title: "Oppsett & Default Show", desc: "Hvordan starte med et rent oppsett (FOH/Monitor)." }
    ],

    deepDiveTitle: "Pro Tips: Gruppering",
    deepDive: [
      {
        name: "Audio Groups (Sub-grupper)",
        tag: "Audio",
        info: "En 'Group' er en samlebuss der lyden faktisk passerer gjennom. Dette gir deg to fordeler:\n1. Felles Prosessering: Du kan legge en kompressor på hele trommesettet ('Glue') for å få det til å låte tett, eller en felles EQ på koret.\n2. Routing: Du sender gruppene til Main LR. Dette gir deg full kontroll på balansen mellom instrumentgruppene."
      },
      {
        name: "DCA (Fjernstyring)",
        tag: "Control",
        info: "DCA minner om en gruppe fordi du styrer volumet på mange kanaler med én spak (f.eks. hele bandet). MEN forskjellen er kritisk: Det går **ingen lyd** gjennom en DCA. Den fungerer som en fjernkontroll som sier til de individuelle kanalene at de skal skru seg opp/ned. Derfor kan du IKKE legge EQ eller Kompressor på en DCA.\n\n• Smart bruk: Legg alle FX-returer på en DCA for å fjerne klang når noen prater.\n• DCA Spills: Trykk på DCA-knappen for å hente opp alle medlemmene på overflaten umiddelbart."
      },
      {
        name: "Mute Groups",
        tag: "Praktisk",
        info: "Lag en 'All Band Mute' og en 'All Vocal Mute'. Da kan du raskt rense lydbildet mellom sanger eller under taler med ett trykk."
      }
    ]
  },
  {
    id: "matrix",
    label: "Matrix / Zoner",
    iconName: "Radio",
    x: 1050, y: 100,
    viz: "matrix",
    desc: "Fordeling til rom.",
    details: "Main LR sendes inn her, og splittes ut til PA, Foajé, Streaming osv. Her kan du gjøre egne justeringer for hvert rom."
  },
{
    id: "speakers",
    label: "PA / Høyttalere",
    iconName: "Speaker",
    x: 1200, y: 100,
    viz: "pa",
    desc: "Siste stopp!",

    // --- OVERSIKT ---
    details: "Siste ledd i kjeden! Vi bruker et profesjonelt d&b audiotechnik-system. Det er et 'passivt' system, som betyr at høyttalerne drives av kraftige forsterkere plassert under scenen.",

    deepDiveTitle: "Vårt d&b System",
    deepDive: [
      // --- TEORI: PASSIVT VS AKTIVT ---
      {
        name: "Passivt vs. Aktivt",
        tag: "System",
        info: "Mange små høyttalere er 'Aktive' (har stikkontakt og forsterker inni seg). Vårt d&b-system er PASSIVT. Det betyr at selve kassen bare inneholder elementer og delefilter. All kraften kommer fra eksterne forsterkere via tykke høyttalerkabler (SpeakOn)."
      },

      // --- RIGGEN DERES ---
      {
        name: "Hoved-PA (Mains)",
        tag: "L/R",
        info: "Hovedanlegget dekker salen i Stereo. \n• Topper: 2 stk Venstre + 2 stk Høyre (Tar seg av vokal og instrumenter).\n• Subber: 2 stk Venstre + 2 stk Høyre (Tar seg av dypbassen fra kick og bass)."
      },

      // --- FRONTFILLS ---
      {
        name: "Frontfills",
        tag: "Utfylling",
        info: "Hoved-PA henger høyt og skyter ofte over hodet på de som står helt inntil scenekanten. Derfor har vi 2 mindre høyttalere på scenen. Disse fyller 'hullet' i midten så første rad også får klar lyd."
      },

      // --- FORSTERKERE ---
      {
        name: "Forsterkere (Amps)",
        tag: "Under scenen",
        info: "Under scenen står d&b-forsterkerne. De gjør to ting:\n1. Forsterker signalet opp til tusenvis av watt.\n2. Prosessering (DSP): De vet nøyaktig hvilke høyttalere som er koblet til og beskytter dem mot å sprenge hvis du spiller for høyt."
      }
    ]
  }
];
