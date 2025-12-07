import * as React from 'react';
const { useState, useEffect, useRef } = React;
import {
  Mic2, Sliders, Play, Info, Home,
  Activity, Volume2, Settings,
  Speaker, Radio, ChevronRight, ArrowLeft, Layers,
  X, Music, Sparkles, BarChart2, Zap, CornerDownRight, Check, 
  Download, AlertTriangle, Clock, List, Star, HelpCircle, 
  Lightbulb, MoveVertical, Copy, Scissors, Disc, GitMerge,
  Move, Headphones, Layout, BookOpen, Youtube, GraduationCap, Search, Film
} from 'lucide-react';

// --- HELPER FUNCTIONS FOR LOG SCALES ---
const toFreq = (percent) => {
  const min = Math.log10(20);
  const max = Math.log10(20000);
  const val = min + (percent / 100) * (max - min);
  return Math.round(Math.pow(10, val));
};

const toPercent = (freq) => {
  const min = Math.log10(20);
  const max = Math.log10(20000);
  return ((Math.log10(freq) - min) / (max - min)) * 100;
};

// --- DATA ---

const videoData = {
  "dlive_course": {
    title: "dLive C3500 Grunnkurs",
    description: "Komplett gjennomgang av mikseren fra A til Å.",
    videos: [
      { id: 1, title: "Del 1: Introduksjon", videoId: "q7BQkq6A5qc", desc: "Start her: Oversikt over overflaten." },
      { id: 2, title: "Del 2: Oppsett", videoId: "Lgr2cALG_1w", desc: "Grunnleggende konfigurasjon." },
      { id: 3, title: "Del 3: Prosessering", videoId: "JEvV97HOLm4", desc: "Kanalbehandling." },
      { id: 4, title: "Del 4: Routing", videoId: "_iQpEfMi9x0", desc: "Hvor går lyden?" },
      { id: 5, title: "Del 5: Miksing", videoId: "Rzu3udGD4rU", desc: "Selve miksejobben." },
      { id: 6, title: "Del 6: Scener", videoId: "o6NFlr42Omg", desc: "Lagre og hente opp innstillinger." },
      { id: 7, title: "Del 7: FX", videoId: "QF74XS_ANGA", desc: "Effekter og rack." },
      { id: 8, title: "Del 8: SoftKeys", videoId: "Uo_8myEos4M", desc: "Programmerbare knapper." },
      { id: 9, title: "Del 9: Ganging", videoId: "fYPuy6Vvs2I", desc: "Linke kanaler sammen." },
      { id: 10, title: "Del 10: DCA & Mute", videoId: "1Ejh3jwbdnw", desc: "Gruppering og muting." },
      { id: 11, title: "Del 11: Talkback", videoId: "DCQaRbwf1PA", desc: "Kommunikasjon." },
      { id: 12, title: "Del 12: Signal Generator", videoId: "-gzTjYvbQ68", desc: "Testtoner og støy." },
      { id: 13, title: "Del 13: RTA", videoId: "USf6nL7fhXI", desc: "Real Time Analyzer." },
      { id: 14, title: "Del 14: Surface Prefs", videoId: "VyOjG0HuuBQ", desc: "Tilpass overflaten." },
      { id: 15, title: "Del 15: Show & Scene", videoId: "UASRqs5DKHw", desc: "Filbehandling." },
      { id: 16, title: "Del 16: Filters", videoId: "jUYv6W1ldDE", desc: "Tilpasning av visning." },
      { id: 17, title: "Del 17: Copy/Paste", videoId: "HBzvRMSE_B8", desc: "Kopiere innstillinger." },
      { id: 18, title: "Del 18: Libraries", videoId: "-HTVVfF8jdQ", desc: "Bibliotek for presets." },
      { id: 19, title: "Del 19: Kildevalg", videoId: "fXQ9OVTXL_I", desc: "Source Select." },
      { id: 20, title: "Del 20: ABCD Input", videoId: "8kewPAoAERc", desc: "Input alt." },
      { id: 21, title: "Del 21: Virtual Soundcheck", videoId: "Vu2wnX5_kg8", desc: "Opptak og avspilling." },
      { id: 22, title: "Del 22: AMM", videoId: "jVlBeC_VUE0", desc: "Automatisk Mikser." },
      { id: 23, title: "Del 23: MIDI", videoId: "_cid9jVEa8g", desc: "Styring." },
      { id: 24, title: "Del 24: Director", videoId: "LI0jmTmlOfI", desc: "PC/Mac programvare." },
    ]
  },
  "mixing": {
    title: "Miksing & Teori",
    description: "Gain, EQ, Kompresjon og Lydforståelse.",
    videos: [
      { id: 101, title: "VIKTIG: Gain Struktur", videoId: "sdrgPJD0Vvg", desc: "Fundamentet for all god lyd. Må sees!" },
      { id: 102, title: "Lydteori: Forstå lydbølger", videoId: "YEorsfZe4vU", desc: "Hva er frekvenser?" },
      { id: 103, title: "EQ: Hvordan bruke det", videoId: "ehB5s5SHG4M", desc: "Rydde opp i miksen." },
      { id: 104, title: "Kompresjon 101", videoId: "jveKIYyafaQ", desc: "Kontrollere dynamikk." },
      { id: 105, title: "Gate & Expander", videoId: "lxdq-2eCgLg", desc: "Fjerne støy." },
      { id: 106, title: "Mikse Trommer", videoId: "iX5H5oh6azU", desc: "Praktisk eksempel." },
      { id: 107, title: "Mikse Vokal", videoId: "Qag5wmZ1xvc", desc: "Få vokalen frem i miksen." },
      { id: 108, title: "Balanse i miksen", videoId: "QlmQQjGTm6o", desc: "Volum og panorering." },
      { id: 109, title: "Lydteknikerens rolle", videoId: "w-v75Mgh9dA", desc: "Hva er jobben vår?" },
      { id: 110, title: "Feedback", videoId: "8BLsze-hE10", desc: "Hvordan unngå hyling." }
    ]
  },
  "inserts": {
    title: "Inserts & FX",
    description: "Dyn8, DEEP Plugins og Effekter.",
    videos: [
      { id: 201, title: "Oversikt over Inserts", videoId: "idNyL9imKDY", desc: "Hva kan vi sette inn?" },
      { id: 202, title: "Dyn8 Forklart", videoId: "4jw-8nNgbQ8", desc: "Multiband Comp + DynEQ." },
      { id: 203, title: "DEEP Compressors", videoId: "huA9ACDOgDA", desc: "Vintage kompressorer i dLive." },
      { id: 204, title: "Opto Compressor", videoId: "l_42QaBb3mk", desc: "LA-2A stil på vokal." },
      { id: 205, title: "16T Compressor", videoId: "jHzZUuIrvLw", desc: "1176 stil på trommer." }
    ]
  },
  "tips": {
    title: "Tips & Kirkeoppsett",
    description: "Hvordan andre kirker gjør det + smarte triks.",
    videos: [
      { id: 301, title: "Kirke-oppsett Ex 1", videoId: "drBZv6NBRIU", desc: "Gjennomgang av en søndagsmiks." },
      { id: 302, title: "Kirke-oppsett Ex 2", videoId: "WewLdCgHWJI", desc: "Worship miksing." },
      { id: 303, title: "Effektiv arbeidsflyt", videoId: "Ns8jgVgMvoU", desc: "Jobbe raskere." },
      { id: 304, title: "Nyttige funksjoner", videoId: "XEuP7hscNy8", desc: "Ting du kanskje ikke visste." },
      { id: 305, title: "Digital Patching", videoId: "G-_x7xDcn5k", desc: "Avansert routing." },
      { id: 306, title: "Fjernstyring (iPad)", videoId: "EPjrFU5d_OA", desc: "MixPad appen." },
      { id: 307, title: "Opptak", videoId: "YgCIo-lzlHw", desc: "Multitrack recording." },
      { id: 308, title: "Monitor-miksing", videoId: "4KbiXB7-R7w", desc: "Lyd til musikerne." },
      { id: 309, title: "Feilsøking", videoId: "Djr1ZlVdl34", desc: "Når ting ikke virker." }
    ]
  },
  "director_control": {
    title: "Director & Styring",
    description: "dLive Director (PC/Mac) og ekstern kontroll.",
    videos: [
      { id: 401, title: "Director Del 1: Oversikt", videoId: "c6Hng92Jf7I", desc: "Intro til programvaren." },
      { id: 402, title: "Director Del 2: Offline", videoId: "we2BWRlMGhg", desc: "Jobbe uten mikser tilkoblet." },
      { id: 403, title: "Director Del 3: Touch", videoId: "9X_UDQPmq0c", desc: "Bruk med touch-skjerm." },
      { id: 404, title: "Director Routing", videoId: "pOZmwrI4mZg", desc: "Patching i software." },
      { id: 405, title: "Director Scenes", videoId: "g-5QPa0M-TM", desc: "Scenebehandling på PC." },
      { id: 406, title: "IP Kontrollere", videoId: "q53pzh8LNpw", desc: "IP6 og IP8 oppsett." },
      { id: 407, title: "GPIO Integrasjon", videoId: "UaUoaxxUotM", desc: "Styring av eksternt utstyr." },
      { id: 408, title: "ME Personal Mixing", videoId: "t2lT2tVcjhc", desc: "Oppsett av ME-1 / ME-500." },
      { id: 409, title: "Brukertilganger", videoId: "GmBTc6YxYRk", desc: "User Permissions & Passord." }
    ]
  },
  "advanced_system": {
    title: "System & Utvidelse",
    description: "Dante, Waves, DX-bokser og avansert oppsett.",
    videos: [
      { id: 501, title: "DX Expanders", videoId: "rl-4xUptlyg", desc: "Koble til flere stagebokser." },
      { id: 502, title: "DX Link & Redundancy", videoId: "wsrSnanS3b0", desc: "Sikkert oppsett av kabler." },
      { id: 503, title: "Dante Kort", videoId: "18qI5uBypSQ", desc: "Lyd over nettverk." },
      { id: 504, title: "Waves Kort", videoId: "XCpAk3Dz-vo", desc: "SoundGrid server oppsett." },
      { id: 505, title: "SuperMADI", videoId: "0YAjNXiWyAs", desc: "MADI tilkobling (Broadcast)." },
      { id: 506, title: "FibreACE", videoId: "RqHvxKnyg5M", desc: "Lange strekk med fiber." },
      { id: 507, title: "GigaACE", videoId: "sW0CgSHqEc4", desc: "Standard tilkobling." },
      { id: 508, title: "Oppdatering (Firmware)", videoId: "N6NrHo-3-Ls", desc: "Hvordan oppdatere mikseren." },
      { id: 509, title: "Nettverksoppsett", videoId: "Lkrs6NBKix8", desc: "IP-adresser og tilkobling." },
      { id: 510, title: "Safes & Recall Filters", videoId: "cXNe_61eLiY", desc: "Hva skal IKKE endres ved sceneskift?" }
    ]
  }
};

const signalPathData = [
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
    
    details: "Juster gain slik at signalet ligger stabilt rundt det gule feltet (-18dB). Unngå rødt lys (klipping)!",
    
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
        info: "Sikt på at meteret ligger rundt -18dBFS (ofte gult på dLive) i gjennomsnitt." 
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
    desc: "Lyd til scene (Post-EQ / Pre-Fade).",
    details: "Lyden tappes her (vanligvis etter EQ/Comp) for å sendes til monitorer. Fader-bevegelser påvirker IKKE monitorlyden.",
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
        info: "FX-sendinger er alltid 'Post-Fader'. Det betyr at sender-nivået følger hovedfaderen. Drar du ned vokalen, forsvinner også klangen automatisk." 
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

// --- HELPER COMPONENTS ---

const IconHelper = ({ name, size = 24, className }) => {
  const icons = {
    Mic2, Sliders, Play, Info, Home, Activity, Volume2, Settings,
    Speaker, Radio, Download, ChevronRight, ArrowLeft, Layers,
    X, Music, Sparkles, BarChart2, Zap, CornerDownRight, Check, 
    AlertTriangle, Clock, List, Star, HelpCircle, Lightbulb, 
    MoveVertical, Copy, Scissors, Disc, GitMerge, Move, Headphones,
    Layout, BookOpen, Youtube, GraduationCap
  };
  const IconComponent = icons[name] || Activity;
  return <IconComponent size={size} className={className} />;
};

const NavButton = ({ active, onClick, Icon, text, isMobile }) => (
  <button
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200
    ${active ? 'text-blue-400 md:bg-blue-600 md:text-white md:shadow-lg md:shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
  >
    <Icon size={isMobile ? 24 : 18} />
    <span className={`${isMobile ? 'text-[10px]' : 'text-sm'}`}>{text}</span>
  </button>
);

// --- VISUALIZERS ---

// ... (HPF, Gate, PEQ, Compressor, FXInfo, GainStructure, FaderSection must be defined before being used)
// --- NY HJELPEKOMPONENT FOR PROFF KNOTT-FØLELSE ---
// --- NY KOMPONENT: VIDEO I SIGNALVEIEN ---

const VideoHighlight = ({ videoId, title }) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!videoId) return null;

  return (
    <div className="mt-6 border-t border-slate-700 pt-4 animate-fade-in">
      {!showVideo ? (
        <button 
          onClick={() => setShowVideo(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 transition-all rounded-xl p-3 flex items-center gap-4 group text-left group"
        >
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/30">
            <Play size={18} className="text-white fill-current ml-1" />
          </div>
          <div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-0.5">Se Video</span>
            <span className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">{title || "Lær mer om dette"}</span>
          </div>
          <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-white" />
        </button>
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black animate-fade-in relative">
          <div className="relative pb-[56.25%] h-0">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&origin=${window.location.origin}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <button 
            onClick={() => setShowVideo(false)}
            className="w-full py-2 bg-slate-900 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800"
          >
            Lukk Video
          </button>
        </div>
      )}
    </div>
  );
};

const RotaryKnob = ({ value, setValue, label, color = "#38bdf8", size = 50 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(0);

  const handlePointerDown = (e) => {
    e.preventDefault(); 
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaY = startY.current - e.clientY;
      let newVal = startVal.current + (deltaY * 1.5);
      if (newVal < 0) newVal = 0;
      if (newVal > 100) newVal = 100;
      setValue(newVal);
    };
    
    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, setValue]);

  const rotation = -135 + (value / 100) * 270;

  return (
    <div 
      className="flex flex-col items-center gap-1 select-none touch-none cursor-ns-resize z-30" 
      onPointerDown={handlePointerDown}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" strokeDasharray="200" strokeDashoffset="50" transform="rotate(135 50 50)" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" 
            strokeDasharray={`${(value / 100) * 188} 300`} 
            transform="rotate(135 50 50)" 
            className="transition-all duration-75"
          />
        </svg>
        <div 
          className="absolute rounded-full bg-slate-800 border-2 border-slate-600 shadow-xl flex items-center justify-center"
          style={{ width: size * 0.7, height: size * 0.7, transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1.5 h-4 bg-white mb-auto mt-1 rounded-full"></div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
};

const InputConnectorsVisualizer = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      
      {/* 1. XLR (Mer detaljert hunn-kontakt) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="relative">
          {/* Selve kontakten (Sølv ring) */}
          <div className="w-14 h-14 rounded-full bg-slate-800 border-4 border-slate-400 flex items-center justify-center relative shadow-inner">
            {/* Låse-knapp (Push) */}
            <div className="absolute -top-1 w-4 h-2 bg-slate-500 rounded-b"></div>
            {/* 3 Hull (Hunn-kontakt) */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
               <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
               <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
               <div className="w-2.5 h-2.5 bg-black rounded-full col-span-2 mx-auto shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">XLR</span>
          <span className="text-[9px] text-slate-400">Mikrofoner (Inn)</span>
        </div>
      </div>

      {/* 2. JACK (Med kabel-hale) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="flex items-center justify-center h-14 w-full relative">
           {/* Kabel hale (SVG for krøll) */}
           <svg width="40" height="20" viewBox="0 0 40 20" className="absolute right-[60%] top-1/2 -translate-y-1/2 text-slate-600 stroke-current fill-none" style={{zIndex: 0}}>
              <path d="M40,10 C30,10 30,18 20,18 C10,18 10,2 0,2" strokeWidth="3" strokeLinecap="round"/>
           </svg>
           
           {/* Selve Jack Pluggen */}
           <div className="flex items-center relative z-10 rotate-[-15deg]">
              {/* Kropp/Håndtak */}
              <div className="w-8 h-4 bg-slate-700 rounded-l border border-slate-600"></div>
              {/* Isolator */}
              <div className="w-1 h-3 bg-black"></div>
              {/* Sleeve */}
              <div className="w-4 h-2.5 bg-slate-300"></div>
              {/* Ring (Isolator) */}
              <div className="w-0.5 h-2.5 bg-black"></div>
              {/* Tupp */}
              <div className="w-3 h-2.5 bg-slate-300 rounded-r-full"></div>
           </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Jack (6.3mm)</span>
          <span className="text-[9px] text-slate-400">Instrumenter (Inn)</span>
        </div>
      </div>

      {/* 3. DI BOKS (Viser flyten) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="flex items-center gap-1 mt-2">
            {/* Jack ikon liten */}
            <div className="flex flex-col items-center">
               <div className="w-1 h-3 bg-slate-500 rounded-full mb-0.5"></div>
               <span className="text-[8px] text-slate-500">Jack</span>
            </div>
            {/* BOKSEN */}
            <div className="w-16 h-10 bg-yellow-600/20 border-2 border-yellow-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.2)]">
               <span className="text-xs font-bold text-yellow-500">DI</span>
            </div>
            {/* Pil */}
            <ChevronRight size={12} className="text-slate-500"/>
            {/* XLR ikon liten */}
            <div className="flex flex-col items-center">
               <div className="w-3 h-3 rounded-full border border-slate-500 bg-black"></div>
               <span className="text-[8px] text-slate-500">XLR</span>
            </div>
        </div>
        <span className="text-[9px] text-slate-400 mt-2">Konverterer Jack til XLR</span>
      </div>

      {/* 4. SPEAKON (Blå/Svart) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="relative w-14 h-14 flex items-center justify-center">
           {/* Ytre ring (Blå) */}
           <div className="w-12 h-12 rounded-full bg-blue-900/50 border-4 border-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.3)]">
              {/* Indre lås (Svart) */}
              <div className="w-6 h-6 bg-black rounded-full relative">
                 {/* Keyway slot */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-slate-700"></div>
              </div>
           </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Speakon</span>
          <span className="text-[9px] text-slate-400">Høyttaler (Ut)</span>
        </div>
      </div>

    </div>
  );
};

// --- VIKTIG: Denne må ligge UTENFOR hovedfunksjonen for å unngå glitching ---
// --- NY OG KRAFTIGERE HØYTTALER-KOMPONENT ---
// --- 2. HJELPEKOMPONENT: HØYTTALER (Nå med låst takt) ---
const CompactSpeaker = ({ intensity, label, isMuted }) => {
  const effectiveIntensity = isMuted ? 0 : intensity;
  
  // Skalering (Hvor mye elementet "hopper" mot deg)
  const coneScale = 1 + (effectiveIntensity * 0.25); 
  
  // Farge (Blir hvitere ved høyt trykk)
  const waveColor = effectiveIntensity > 0.8 ? 'border-cyan-200' : 'border-cyan-500';

  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${isMuted ? 'opacity-30 grayscale' : 'opacity-100'}`}>
       <div className="relative w-16 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-visible z-10">
          
          {/* Pulsering 1 (FAST HASTIGHET for sync) */}
          {effectiveIntensity > 0.05 && (
            <div className={`absolute inset-0 rounded-xl border-[3px] ${waveColor} animate-ping pointer-events-none`} 
                style={{ 
                    animationDuration: '1.4s', 
                    opacity: effectiveIntensity * 0.8, 
                    transform: `scale(${1 + effectiveIntensity})`
                }}
            ></div>
          )}
          
          {/* Pulsering 2 (FAST HASTIGHET for sync) */}
          {effectiveIntensity > 0.4 && (
            <div className={`absolute inset-0 rounded-xl border-2 ${waveColor} animate-ping pointer-events-none`} 
                style={{ 
                    animationDuration: '1.4s', 
                    animationDelay: '0.3s', 
                    opacity: effectiveIntensity * 0.5, 
                    zIndex: -1 
                }}
            ></div>
          )}

          {/* Selve elementet */}
          <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-slate-600 shadow-inner flex items-center justify-center relative z-20 transition-transform duration-75 ease-out"
              style={{ transform: `scale(${coneScale})` }}>
              <div className="w-5 h-5 bg-slate-800 rounded-full border border-slate-700"></div>
          </div>

          {/* Volum-søyle */}
          <div className="absolute bottom-2 w-10 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 z-20">
              <div className={`h-full transition-all duration-75 shadow-[0_0_8px_rgba(34,211,238,0.8)] ${effectiveIntensity > 0.9 ? 'bg-red-500' : 'bg-cyan-400'}`}
                  style={{ width: `${effectiveIntensity * 100}%` }}></div>
          </div>
       </div>
       <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-sm mt-1">
         {label}
       </span>
    </div>
  );
};

const FaderSectionVisualizer = () => {
  const [activeTab, setActiveTab] = useState('mixer');
  const [faderPos, setFaderPos] = useState(75); 
  const [panVal, setPanVal] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPafl, setIsPafl] = useState(false);

  // Lyd-logikk
  let leftVol = panVal <= 50 ? 1 : (100 - panVal) / 50;
  let rightVol = panVal >= 50 ? 1 : panVal / 50;
  const masterVol = faderPos / 100;
  
  const finalL = isMuted ? 0 : leftVol * masterVol;
  const finalR = isMuted ? 0 : rightVol * masterVol;

  // Fader-logikk
  const faderRef = useRef(null);
  const handleFaderDrag = (e) => {
    e.preventDefault(); 
    const rect = faderRef.current.getBoundingClientRect();
    const bottomY = rect.bottom;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const height = rect.height;
    let newPct = ((bottomY - clientY) / height) * 100;
    if (newPct < 0) newPct = 0; if (newPct > 100) newPct = 100;
    setFaderPos(Math.round(newPct));
  };

  const getDb = (pos) => {
    if (pos >= 75) return Math.round(((pos - 75) / 25) * 10);
    if (pos >= 50) return Math.round(((pos - 75) / 25) * 10);
    if (pos >= 25) return Math.round(-10 + ((pos - 50) / 25) * 20);
    return "-∞";
  };
   
  const renderContent = () => {
    switch(activeTab) {
      case 'mixer':
        return (
          <div className="animate-fade-in relative z-10 select-none pb-4 mt-6">
            <div className="flex flex-col items-center bg-slate-950 p-4 pt-8 rounded-xl border border-slate-800 shadow-inner">
                
                {/* 1. TOPP-SEKSJON: HØYTTALERE + PAN */}
                <div className="flex items-end justify-between w-full mb-8 px-2 relative h-28">
                    <CompactSpeaker intensity={finalL} label="LEFT" isMuted={isMuted} />
                    
                    <div className="relative z-20 mx-2 flex flex-col items-center justify-end h-full pb-1">
                       {/* PAFL INDIKATOR */}
                       <div className={`absolute -top-10 transition-all duration-300 pointer-events-none ${isPafl ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-2'}`}>
                           <div className="bg-yellow-500 text-black px-2 py-0.5 rounded text-[9px] font-bold shadow-lg flex items-center gap-1 border border-yellow-400">
                             <Headphones size={10}/> SOLO
                           </div>
                           <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-yellow-500 mx-auto"></div>
                       </div>
                       
                       {/* HER ER ENDRINGEN: size={70} */}
                       <RotaryKnob value={panVal} setValue={setPanVal} label="PAN" color={isPafl ? "#eab308" : "#38bdf8"} size={70} />
                    </div>
                    
                    <CompactSpeaker intensity={finalR} label="RIGHT" isMuted={isMuted} />
                </div>

                {/* 2. KNAPPER */}
                <div className="flex gap-4 mb-6 w-full justify-center">
                    <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-10 rounded-lg font-bold text-[10px] transition-all shadow-lg flex flex-col items-center justify-center gap-0.5 border ${isMuted ? 'bg-red-600 text-white border-red-500 shadow-red-900/50 scale-95' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
                      <span className="leading-none tracking-wider">MUTE</span>
                      <div className={`w-3 h-1 rounded-full mt-1 ${isMuted ? 'bg-white' : 'bg-slate-900'}`}></div>
                    </button>
                    <button onClick={() => setIsPafl(!isPafl)} className={`w-16 h-10 rounded-lg font-bold text-[10px] transition-all shadow-lg flex flex-col items-center justify-center gap-0.5 border ${isPafl ? 'bg-yellow-500 text-black border-yellow-400 shadow-yellow-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
                      <span className="leading-none tracking-wider">PAFL</span>
                      <div className={`w-3 h-1 rounded-full mt-1 ${isPafl ? 'bg-black animate-pulse' : 'bg-slate-900'}`}></div>
                    </button>
                </div>

                {/* 3. FADER TRACK */}
                <div className="flex flex-col items-center w-full">
                    <div 
                        className="relative w-20 h-56 bg-slate-900 rounded-lg border-2 border-slate-800 flex justify-center cursor-ns-resize touch-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                        ref={faderRef} 
                        onPointerMove={(e) => e.buttons === 1 && handleFaderDrag(e)} 
                        onPointerDown={handleFaderDrag}
                    >
                      <div className="absolute top-[10%] w-full h-[1px] bg-white/10"></div>
                      <div className="absolute top-[25%] w-full h-[2px] bg-white/30"></div> 
                      <div className="absolute top-[50%] w-full h-[1px] bg-white/10"></div>
                      <div className="absolute top-[75%] w-full h-[1px] bg-white/10"></div>
                      <div className="absolute -right-7 top-[24%] text-[9px] text-white/60 font-mono font-bold">+10</div>
                      <div className="absolute -right-7 top-[23%] text-[9px] text-yellow-500 font-mono font-bold">0</div>
                      <div className="absolute -right-7 top-[48%] text-[9px] text-white/30 font-mono">-10</div>
                      <div className="absolute -right-7 top-[73%] text-[9px] text-white/30 font-mono">-30</div>
                      <div className="w-1.5 h-full bg-black/60 rounded-full shadow-inner mx-auto"></div>
                      
                      <div 
                        className={`absolute w-32 h-14 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-t border-slate-500 z-10 flex items-center justify-center active:scale-105 transition-transform cursor-grab active:cursor-grabbing ${isMuted ? 'grayscale opacity-70' : ''}`} 
                        style={{ bottom: `${faderPos}%`, marginBottom: '-28px' }}
                      >
                          <div className="w-24 h-[2px] bg-black/80 mb-1"></div>
                          <div className="w-24 h-[2px] bg-black/80 mb-1"></div>
                          <div className="w-24 h-[2px] bg-black/80"></div>
                          <div className="absolute w-full h-0.5 bg-white/50 top-1/2 -translate-y-1/2 shadow-[0_0_5px_white]"></div>
                      </div>
                    </div>
                    <div className="mt-8 text-[14px] font-mono font-bold text-cyan-400 min-w-[60px] text-center bg-slate-900/80 px-2 py-1 rounded border border-slate-700 shadow-lg">{getDb(faderPos)} dB</div>
                </div>
            </div>
          </div>
        );
      case 'pafl':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300 mt-4">
            <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded-lg">
               <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><Speaker size={14}/> PAFL (Pre/After Fade Listen)</h4>
               <p className="mb-2 leading-relaxed">PAFL er dLive sin "Solo"-knapp. Den sender lyden til hodetelefonene dine og Monitor-høyttaleren ved mikseren, uten å påvirke PA-anlegget.</p>
               <div className="space-y-2 mt-4">
                  <div className="bg-slate-800/50 p-2 rounded border-l-2 border-yellow-500">
                     <span className="font-bold text-white block mb-1">Lyttepunkter</span>
                     <p className="text-slate-400">På skjermen kan du velge *hvor* i rekken du vil lytte (Før/Etter EQ/Comp).</p>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'copy':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300 mt-4">
             <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Copy size={14}/> Copy / Paste Workflow</h4>
                <div className="space-y-4">
                   <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <h5 className="font-bold text-white mb-1 flex items-center gap-2"><Layers size={12}/> Kopiere HELE kanalen</h5>
                      <div className="flex flex-wrap gap-2 items-center text-[10px] bg-slate-900 p-2 rounded">
                         <span className="bg-slate-700 px-1.5 py-0.5 rounded text-white border border-slate-600">Hold COPY</span>+
                         <span className="bg-cyan-600 px-1.5 py-0.5 rounded text-white border border-cyan-500">Trykk SEL</span>->
                         <span className="bg-slate-700 px-1.5 py-0.5 rounded text-white border border-slate-600">Hold PASTE</span>+
                         <span className="bg-cyan-600 px-1.5 py-0.5 rounded text-white border border-cyan-500">Trykk SEL</span>
                      </div>
                   </div>
                   <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <h5 className="font-bold text-white mb-1 flex items-center gap-2"><Scissors size={12}/> Kopiere KUN deler</h5>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                         <li>Hold <strong>COPY</strong> og trykk på selve EQ-boksen på <strong>skjermen</strong>.</li>
                         <li>Gå til ny kanal. Hold <strong>PASTE</strong> og trykk på EQ-boksen på skjermen.</li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'patch':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300 mt-4">
            <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
               <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2"><GitMerge size={14}/> Input Patching (dLive)</h4>
               <div className="bg-slate-800 p-3 rounded border border-slate-700 mb-3">
                  <h5 className="font-bold text-white mb-1">Socket vs. Channel</h5>
                  <ul className="space-y-2">
                     <li className="flex gap-2"><Disc size={16} className="text-slate-500 shrink-0"/><span><strong>Socket:</strong> Fysisk hull i stageboksen.</span></li>
                     <li className="flex gap-2"><Sliders size={16} className="text-blue-400 shrink-0"/><span><strong>Channel:</strong> Stripen du mikser på.</span></li>
                  </ul>
               </div>
               <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <h5 className="font-bold text-purple-300 mb-1">Digital Split</h5>
                  <ul className="list-disc pl-4 mt-2 text-slate-300 space-y-1">
                     <li><strong>Kanal 1 (FOH):</strong> Mikset for salen.</li>
                     <li><strong>Kanal 33 (Monitor):</strong> Mikset for scenen.</li>
                  </ul>
               </div>
            </div>
          </div>
        );
      case 'protips': 
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300 mt-4">
             <div className="bg-slate-800 p-3 rounded border border-slate-700">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2"><Lightbulb size={14}/> Panorering</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                   <li><strong className="text-yellow-400">Center:</strong> Kick, Bass, Vokal.</li>
                   <li><strong className="text-blue-400">Stereo:</strong> Piano, Synth.</li>
                   <li><strong className="text-purple-400">Side:</strong> Gitarer, Koring.</li>
                </ul>
             </div>
             <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
                <h4 className="font-bold text-red-400 mb-1 flex items-center gap-2"><AlertTriangle size={14}/> 48V Phantom Power</h4>
                <p className="text-slate-300">Aldri slå på 48V mens kanalen er åpen!</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-600/50 animate-fade-in">
      <div className="flex gap-1 mb-0 overflow-x-auto pb-1 scrollbar-hide">
        {[
          {id:'mixer', l:'Miks', i: Sliders}, 
          {id:'pafl', l:'PAFL', i: Speaker}, 
          {id:'protips', l:'Pro Tips', i: Star}, 
          {id:'copy', l:'Copy', i: Copy}, 
          {id:'patch', l:'Input', i: GitMerge}
        ].map(tab => {
           const TabIcon = tab.i;
           return (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all 
                 ${activeTab === tab.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
             >
               <TabIcon size={12}/>
               {tab.l}
             </button>
           );
        })}
      </div>
      {renderContent()}
    </div>
  );
};
const GainStructureVisualizer = () => {
  const [faderPos, setFaderPos] = useState(75); 
  const [gainLevel, setGainLevel] = useState(30); 
  const [meterValue, setMeterValue] = useState(0);

  // Meter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const noise = Math.random() * 10;
      const signal = (gainLevel * 1.2) + noise - 20; 
      setMeterValue(Math.max(0, Math.min(100, signal)));
    }, 100);
    return () => clearInterval(interval);
  }, [gainLevel]);

  // Fader Logic (Copy from Section above)
  const faderRef = useRef(null);
  const handleFaderDrag = (e) => {
    const rect = faderRef.current.getBoundingClientRect();
    const bottomY = rect.bottom;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const height = rect.height;
    let newPct = ((bottomY - clientY) / height) * 100;
    if (newPct < 0) newPct = 0; if (newPct > 100) newPct = 100;
    setFaderPos(Math.round(newPct));
  };

  const getDb = (pos) => {
    if (pos >= 75) return ((pos - 75) / 25) * 10; 
    if (pos >= 50) return ((pos - 75) / 25) * 10; 
    if (pos >= 25) return -10 + ((pos - 50) / 25) * 20;
    return -30 + ((pos - 25) / 25) * 60; 
  };

  const db = Math.round(getDb(faderPos));
  const isUnity = Math.abs(db) < 2;
  const isGoodGain = gainLevel >= 55 && gainLevel <= 78; 
   
  const getTip = () => {
    if (gainLevel > 78) return { t: "FARE: CLIPPING!", d: "Rødt lys! Skru ned Gain. Bruk PAD om nødvendig.", c: "text-red-400" };
    if (gainLevel < 55) return { t: "For lavt signal", d: "For lite gain gir støy (hiss) senere i kjeden.", c: "text-slate-400" };
    
    if (db < -15) return { t: "God Gain, men lav Fader?", d: "Gain er bra, men faderen er lav? Bruk 'Digital Trim'.", c: "text-orange-300" };
    if (db > 5) return { t: "Høy Fader?", d: "Du presser faderen over 0dB? Sjekk kilden.", c: "text-orange-300" };
    
    if (isUnity) return { t: "PERFEKT STRUKTUR!", d: "Gult felt på gain, Unity på fader. Optimal lyd!", c: "text-green-400" };
    
    return { t: "Bra Gain", d: "Nå kan du mikse med faderen.", c: "text-yellow-400" };
  };

  const tip = getTip();

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/50 animate-fade-in space-y-6">
      <h3 className="text-blue-400 font-bold text-sm flex items-center gap-2"><Sliders size={16}/> Gain Struktur Simulator</h3>
      
      <div className="flex justify-between gap-4 md:gap-8">
        
        {/* 1. GAIN KNOB - NY PROFF VERSJON */}
        <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-3">1. Input Gain</h4>
            <div className="flex gap-4 items-center h-full">
                
                {/* Her bruker vi RotaryKnob! */}
                <RotaryKnob 
                   value={gainLevel} 
                   setValue={setGainLevel} 
                   color={gainLevel > 78 ? "#ef4444" : gainLevel > 55 ? "#eab308" : "#22c55e"} 
                   size={72}
                />
                
                {/* Meter */}
                <div className="w-3 h-24 bg-slate-900 rounded-full border border-slate-800 flex flex-col-reverse overflow-hidden p-0.5 gap-0.5">
                   {[...Array(20)].map((_, i) => {
                      const level = (i / 20) * 100;
                      const active = meterValue > level;
                      let segColor = 'bg-green-600';
                      if (i > 13) segColor = 'bg-yellow-500';
                      if (i > 17) segColor = 'bg-red-500';
                      return <div key={i} className={`flex-1 w-full rounded-[1px] transition-all duration-75 ${active ? segColor : 'bg-slate-800 opacity-20'}`}></div>;
                   })}
                </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 text-center">
               Mål: <span className="text-yellow-400 font-bold">GULT</span>
               {gainLevel > 78 && <div className="text-red-500 font-bold animate-pulse">CLIP!</div>}
            </div>
        </div>

        {/* 2. FADER - NY PROFF VERSJON */}
        <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center relative">
           <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-3">2. Fader (Unity)</h4>
           
           <div 
              className="relative w-12 h-32 bg-slate-900 rounded border border-slate-700 flex justify-center cursor-ns-resize touch-none"
              ref={faderRef}
              onPointerMove={(e) => e.buttons === 1 && handleFaderDrag(e)}
              onPointerDown={handleFaderDrag}
           > 
               <div className="absolute top-[25%] w-full h-0.5 bg-white/30 z-0"></div>
               <div className="absolute right-1 top-[25%] text-[8px] text-white/50 translate-x-0">0</div>
               
               <div className="w-1 h-full bg-black/40 rounded-full"></div>

               <div 
                   className="absolute w-14 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded shadow-xl border-t border-slate-500 z-10 flex items-center justify-center active:bg-slate-500 active:scale-105 transition-transform"
                   style={{ bottom: `${faderPos}%`, marginBottom: '-16px' }}
               >
                 <div className="w-10 h-[1px] bg-black/50"></div>
               </div>
           </div>
           
           <div className="mt-2 text-center">
              <div className={`text-sm font-bold font-mono ${isUnity ? 'text-green-400' : 'text-slate-400'}`}>
                  {db > 0 ? `+${db}` : db} dB
              </div>
           </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div className={`p-3 rounded border transition-colors duration-300 ${isGoodGain && isUnity ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
         <div className="flex items-start gap-3">
             <div className={`p-2 rounded-full mt-1 ${isGoodGain && isUnity ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-blue-400'}`}>
                 {isGoodGain && isUnity ? <Check size={16}/> : <Lightbulb size={16}/>}
             </div>
             <div>
                 <h4 className={`text-xs font-bold uppercase mb-1 ${tip.c}`}>{tip.t}</h4>
                 <p className="text-xs text-slate-300 leading-relaxed">{tip.d}</p>
             </div>
         </div>
      </div>
    </div>
  );
};

// 1. LEAF VISUALIZERS (Independent)
const HPFVisualizer = () => {
  const [hpfFreq, setHpfFreq] = useState(100);
  const [lpfFreq, setLpfFreq] = useState(12000); // Default LPF at 12k

  const getHpfInfo = (f) => {
    if (f < 60) return "HPF: Fjerner kun dyp rumling. Trygt for det meste.";
    if (f < 120) return "HPF: Standard for vokal og gitar. Fjerner 'pop' lyder.";
    if (f < 200) return "HPF: Tynner ut lyden. Bra for koring eller shaker.";
    return "HPF: Veldig tynn lyd. Kun for spesialeffekter.";
  };

  const getLpfInfo = (f) => {
    if (f > 15000) return "LPF: Åpen luft. Fjerner kun ultralyd/støy.";
    if (f > 10000) return "LPF: Fjerner 'susing', beholder luft.";
    if (f > 5000) return "LPF: Varmere lyd, fjerner skarphet. El-gitar?";
    return "LPF: Innestengt/Mørk lyd. Bakgrunnselementer.";
  };

  const hpfX = toPercent(hpfFreq) * 3; 
  const lpfX = toPercent(lpfFreq) * 3;

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/50 animate-fade-in">
      <h3 className="text-yellow-400 font-bold text-sm mb-4 flex items-center gap-2"><Music size={16}/> Filters (HPF & LPF)</h3>
      
      <div className="relative w-full h-40 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-4">
        <svg className="w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
          {/* Grid lines */}
          {[100, 1000, 10000].map(f => (
             <line key={f} x1={toPercent(f)*3} y1="0" x2={toPercent(f)*3} y2="128" stroke="#1e293b" strokeWidth="1" />
          ))}
          <text x={toPercent(100)*3 + 2} y="120" fill="#475569" fontSize="9">100</text>
          <text x={toPercent(1000)*3 + 2} y="120" fill="#475569" fontSize="9">1k</text>
          <text x={toPercent(10000)*3 + 2} y="120" fill="#475569" fontSize="9">10k</text>

          {/* HPF Response Curve (Yellow) */}
          <path d={`M0,128 L${hpfX},128 Q${hpfX+30},128 ${hpfX+50},20 L300,20`} fill="none" stroke="#eab308" strokeWidth="2" />
          <path d={`M0,128 L${hpfX},128 Q${hpfX+30},128 ${hpfX+50},20 L0,20`} fill="#eab308" opacity="0.1" />
          <circle cx={hpfX+25} cy="70" r="4" fill="#eab308" />

          {/* LPF Response Curve (Orange) */}
          <path d={`M0,20 L${lpfX-50},20 Q${lpfX-30},20 ${lpfX},128 L300,128`} fill="none" stroke="#f97316" strokeWidth="2" />
          <path d={`M0,20 L${lpfX-50},20 Q${lpfX-30},20 ${lpfX},128 L300,128 L300,20 Z`} fill="#f97316" opacity="0.1" />
          <circle cx={lpfX-25} cy="70" r="4" fill="#f97316" />
        </svg>
      </div>

      <div className="space-y-4">
        {/* HPF Control */}
        <div>
           <div className="flex justify-between text-xs mb-1">
             <span className="text-yellow-500 font-bold">HPF: {hpfFreq} Hz</span>
           </div>
           <input 
             type="range" min="20" max="500" value={hpfFreq} 
             onChange={(e) => setHpfFreq(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
           />
           <p className="text-[10px] text-slate-400 mt-1">{getHpfInfo(hpfFreq)}</p>
        </div>

        {/* LPF Control */}
        <div>
           <div className="flex justify-between text-xs mb-1">
             <span className="text-orange-500 font-bold">LPF: {lpfFreq < 1000 ? lpfFreq : (lpfFreq/1000).toFixed(1) + ' k'} Hz</span>
           </div>
           <input 
             type="range" min="2000" max="20000" step="100" value={lpfFreq} 
             onChange={(e) => setLpfFreq(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
           />
           <p className="text-[10px] text-slate-400 mt-1">{getLpfInfo(lpfFreq)}</p>
        </div>
        
        {/* Info Box */}
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex items-start gap-2">
           <Info size={14} className="text-blue-400 shrink-0 mt-0.5"/>
           <div>
             <div className="text-[11px] font-bold text-slate-300 mb-1">Visste du?</div>
             <p className="text-xs text-slate-400">
               Filtre er teknisk sett en del av <strong>EQ-blokken</strong> (PEQ). Mens HPF rydder i bunn, rydder LPF i toppen (f.eks. for å fjerne gitarskrik eller hiss).
               Bruk dem sammen for å lage en "lomme" til hvert instrument i miksen.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const GateVisualizer = ({ definitions }) => {
  const [activeTab, setActiveTab] = useState('viz'); // viz, tips, sidechain, setup
  const [threshold, setThreshold] = useState(-30);
  const [ratio, setRatio] = useState(2);
  const [attack, setAttack] = useState(20);
  const [hold, setHold] = useState(100);
  const [release, setRelease] = useState(300);

  const mapDbToX = (db) => ((db + 80) / 80) * 300;
  const mapDbToY = (db) => 150 - (((db + 80) / 80) * 150);

  const generatePath = () => {
    let path = `M0,150 `;
    for(let i = -80; i <= 0; i++) {
        let input = i;
        let output = input;
        if (input < threshold) {
            output = threshold - (threshold - input) * ratio;
        }
        if (output < -80) output = -80;
        path += `L${mapDbToX(input)},${mapDbToY(output)} `;
    }
    return path;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'viz':
        return (
          <>
            <div className="relative w-full h-44 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-5">
              {[0, -20, -40, -60, -80].map(db => (
                  <React.Fragment key={db}>
                      <line x1="0" y1={mapDbToY(db)} x2="300" y2={mapDbToY(db)} stroke="#1e293b" strokeWidth="1" />
                      <line x1={mapDbToX(db)} y1="0" x2={mapDbToX(db)} y2="150" stroke="#1e293b" strokeWidth="1" />
                  </React.Fragment>
              ))}
              <line x1="0" y1="150" x2="300" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                  <path d={generatePath()} fill="none" stroke="#22c55e" strokeWidth="3" />
                  <circle cx={mapDbToX(threshold)} cy={mapDbToY(threshold)} r="4" fill="#fff" stroke="#22c55e" strokeWidth="2"/>
              </svg>
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">INPUT vs OUTPUT</div>
            </div>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1 font-bold"><span>Threshold</span><span className="text-green-400">{threshold} dB</span></div>
                      <input type="range" min="-60" max="-10" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1 font-bold"><span>Ratio</span><span className="text-green-400">{ratio}:1</span></div>
                      <input type="range" min="1" max="10" step="0.5" value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                   </div>
               </div>
               <div className="bg-slate-800 p-3 rounded border border-slate-700 grid grid-cols-3 gap-2 text-center">
                   <div><div className="text-[10px] text-slate-400 font-bold mb-1">Attack</div><input type="range" min="0" max="50" step="1" value={attack} onChange={(e) => setAttack(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded appearance-none accent-slate-300"/></div>
                   <div><div className="text-[10px] text-slate-400 font-bold mb-1">Hold</div><input type="range" min="10" max="500" step="10" value={hold} onChange={(e) => setHold(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded appearance-none accent-slate-300"/></div>
                   <div><div className="text-[10px] text-slate-400 font-bold mb-1">Release</div><input type="range" min="50" max="2000" step="50" value={release} onChange={(e) => setRelease(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded appearance-none accent-slate-300"/></div>
               </div>
            </div>
          </>
        );
      case 'tips':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
                <h4 className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2"><Check size={14}/> NÅR BRUKER VI GATE?</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li><strong>Trommer:</strong> Kick, Skarp og Toms for å fjerne lekkasje fra cymbaler.</li>
                  <li><strong>Støyende el-gitarer:</strong> Fjerne susing fra forsterkeren når gitaristen ikke spiller.</li>
                  <li><strong>Perkusjon:</strong> Renske opp korte lyder.</li>
                </ul>
             </div>
             <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
                <h4 className="text-sm font-bold text-red-300 mb-2 flex items-center gap-2"><X size={14}/> NÅR BRUKER VI IKKE GATE?</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li><strong>Vokal:</strong> Veldig risikabelt! Det kutter ofte pusting, lave ord og starter på setninger. Bruk heller automasjon.</li>
                  <li><strong>Akustisk Gitar/Piano:</strong> Dreper klanghalen (sustain) og de myke anslagene.</li>
                  <li><strong>Pads/Strings:</strong> Disse skal flyte, en gate vil hakke opp lyden.</li>
                </ul>
             </div>
          </div>
        );
      case 'sidechain':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-slate-800 p-3 rounded border border-purple-500/50">
               <h4 className="text-sm font-bold text-purple-300 mb-2">Hva er Sidechain / Key Input?</h4>
               <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                 Normalt åpner gaten seg når *selve kanalen* blir høy nok. Med Sidechain lar du en <strong>ANNEN kanal</strong> bestemme når gaten skal åpne.
               </p>
               <div className="bg-slate-950 p-2 rounded mb-3">
                 <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Klassisk Triks: Sub-Kick</div>
                 <p className="text-xs text-slate-300">
                   1. Finn en sinustone-generator (oscillator) som lager en dyp 50Hz tone.<br/>
                   2. Sett Gate på sinus-kanalen.<br/>
                   3. Sett <strong>Key Input</strong> til Kick-mikrofonen.<br/>
                   <strong>Resultat:</strong> Hver gang kicken slår, åpner gaten for sinus-tonen. Du får en enorm "boom" i bunn.
                 </p>
               </div>
               <div className="bg-slate-950 p-2 rounded">
                 <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Ducking (Kompressor Sidechain)</div>
                 <p className="text-xs text-slate-300">
                   Brukes mer på kompressor enn gate, men prinsippet er likt: Bass-gitaren dempes automatisk hver gang Kicken slår for å lage plass.
                 </p>
               </div>
             </div>
          </div>
        );
      case 'setup':
        return (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Startinnstillinger (Cheat Sheet)</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-slate-800 p-2 rounded border-l-2 border-orange-500">
                <div className="font-bold text-xs text-slate-200">Trommer (Kick/Snare/Tom)</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  <strong>Attack:</strong> Raskest mulig (0-1 ms) for å ikke miste "smellet".<br/>
                  <strong>Hold:</strong> 50-100ms (så hele slaget kommer med).<br/>
                  <strong>Release:</strong> 200-300ms (naturlig uttoning).<br/>
                  <strong>Depth/Range:</strong> Start på 12-15 dB. Du trenger ikke full stillhet.
                </div>
              </div>
              <div className="bg-slate-800 p-2 rounded border-l-2 border-blue-500">
                <div className="font-bold text-xs text-slate-200">El-Gitar / Bass</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  <strong>Attack:</strong> Litt tregere (3-5 ms).<br/>
                  <strong>Release:</strong> Treg! (500ms+). Hvis den er rask, kutter du tonen mens den ringer ut.<br/>
                  <strong>Threshold:</strong> Sett den akkurat over støynivået (susingen).
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-green-500/50 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-green-400 font-bold text-sm flex items-center gap-2"><Activity size={16}/> Noise Gate / Expander</h3>
      </div>
      
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {[{id:'viz', l:'Graf'}, {id:'tips', l:'Når bruke?'}, {id:'sidechain', l:'Sidechain'}, {id:'setup', l:'Start-tips'}].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${activeTab === tab.id ? 'bg-green-600 text-white border-green-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
           >
             {tab.l}
           </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

const PEQVisualizer = () => {
  const [freq, setFreq] = useState(630);
  const [percent, setPercent] = useState(50); // 0-100 for slider

  // Sync slider to log frequency
  const handleSlider = (e) => {
    const p = parseInt(e.target.value);
    setPercent(p);
    setFreq(toFreq(p));
  };

  const getFreqInfo = (f) => {
    // Defines ranges and returns info object
    if (f < 60) return {
      range: "Sub / Rumling",
      desc: "Kjennes mer enn det høres. Gir kraft, men spiser headroom.",
      tips: [
        { i: "Kick", t: "Kraftsentrum rundt 50-60Hz.", good: true },
        { i: "Vokal", t: "HPF! Fjern alt under 80-100Hz.", good: false },
        { i: "Bass", t: "Fundamentet. Pass på krasj med Kick.", good: true }
      ]
    };
    if (f < 250) return {
      range: "Bunn / Kropp",
      desc: "Her ligger varmen, men også 'grøten'. For mye her gjør miksen utydelig.",
      tips: [
        { i: "Vokal", t: "Kropp rundt 150-200Hz. Kutt hvis 'ullen'.", good: true },
        { i: "Snare", t: "Tyngde rundt 200Hz.", good: true },
        { i: "Gitar", t: "Ofte kutt her for å gi plass til bass.", good: false }
      ]
    };
    if (f < 500) return {
      range: "Mud / Boks",
      desc: "Det vanskeligste området. ' papp-lyd'. Ofte lurt å kutte litt her.",
      tips: [
        { i: "Kick", t: "Kutt brutalt på 300-400Hz for å fjerne 'badeball'.", good: false },
        { i: "Piano", t: "Kan bli veldig dominerende her. Kutt for klarhet.", good: false },
        { i: "Toms", t: "Kutt for å få renere tone.", good: false }
      ]
    };
    if (f < 2000) return {
      range: "Mellomtone / Nese",
      desc: "Her ligger informasjonen. Telefon-lyd.",
      tips: [
        { i: "Bass", t: "800Hz-1kHz gir definisjon og strengelyd.", good: true },
        { i: "Gitar", t: "Biter gjennom miksen her.", good: true },
        { i: "Vokal", t: "For mye 1kHz låter som en megafon (nasalt).", good: false }
      ]
    };
    if (f < 6000) return {
      range: "Presence / Angrep",
      desc: "Her avgjøres om lyden er 'i trynet ditt' eller langt bak.",
      tips: [
        { i: "Kick", t: "Klikket (beater) ligger på 3-5kHz.", good: true },
        { i: "Vokal", t: "Tydelighet på 3kHz. Pass på hardhet.", good: true },
        { i: "Gitar", t: "Skjærer igjennom.", good: true }
      ]
    };
    return {
      range: "Luft / Sibilanter",
      desc: "Toppen av kransekaka. Gir dyrt preg, men pass på s-lyder.",
      tips: [
        { i: "Vokal", t: "S-lyder (sibilanter) bor på 6-8kHz. De-Esser!", good: false },
        { i: "Cymbaler", t: "Luft og glans over 10kHz.", good: true },
        { i: "Akustisk", t: "Fremhever plekter-lyd og strenger.", good: true }
      ]
    };
  };

  const info = getFreqInfo(freq);

  // SVG Calculation for curve visual
  const xPos = percent * 3; // Scale to 300
  // Simple bell curve simulation using bezier
  const curvePath = `M0,64 L${Math.max(0, xPos-30)},64 Q${xPos},10 ${Math.min(300, xPos+30)},64 L300,64`;
  // Calculate peak y for the dot (approximate bezier top)
  // Control point at y=10, start/end at y=64. Peak at t=0.5 -> y=37
  const peakY = 37;

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/50 animate-fade-in">
      <h3 className="text-blue-400 font-bold text-sm mb-4 flex items-center gap-2"><Settings size={16}/> Parametric EQ - Frekvensguide</h3>
      
      {/* Dynamic Graph */}
      <div className="relative w-full h-32 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-2">
         <svg className="w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(p => (
                <line key={p} x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2"/>
            ))}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#334155" strokeWidth="1"/>
            
            {/* The Curve */}
            <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d={curvePath + " L300,128 L0,128 Z"} fill="#3b82f6" opacity="0.1" />
            
            {/* Dot at frequency peak */}
            <circle cx={xPos} cy={peakY} r="5" fill="white" stroke="#60a5fa" strokeWidth="2" />
         </svg>
         
         <div className="absolute top-2 right-2 text-xs font-mono text-blue-400">{freq < 1000 ? `${freq} Hz` : `${(freq/1000).toFixed(1)} kHz`}</div>
      </div>

      {/* Slider Area */}
      <div className="mb-6 relative">
         <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
            <span>20Hz</span>
            <span>100</span>
            <span>500</span>
            <span>1k</span>
            <span>5k</span>
            <span>20k</span>
         </div>
         <input 
            type="range" min="0" max="100" value={percent} 
            onChange={handleSlider}
            className="w-full h-8 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 relative z-10 opacity-80"
         />
      </div>

      {/* Info Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
         <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-slate-200">{info.range}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Karakter</span>
         </div>
         <div className="p-4">
            <p className="text-sm text-slate-300 italic mb-4">"{info.desc}"</p>
            
            <div className="space-y-2">
               {info.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded bg-slate-900/50">
                     <div className={`mt-0.5 p-1 rounded-full ${tip.good ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                        {tip.good ? <Check size={10}/> : <X size={10}/>}
                     </div>
                     <div>
                        <span className="text-xs font-bold text-slate-300 block">{tip.i}</span>
                        <span className="text-[11px] text-slate-400">{tip.t}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const CompressorVisualizer = ({ definitions }) => {
  const [activeTab, setActiveTab] = useState('viz'); // viz, theory, tips
  const [inputLevel, setInputLevel] = useState(-20);
  const [threshold, setThreshold] = useState(-18);
  const [ratio, setRatio] = useState(4); // 4:1
  const [attack, setAttack] = useState(10);
  const [release, setRelease] = useState(100);

  // Calculate gain reduction logic for simulator
  const over = inputLevel - threshold;
  const reduction = over > 0 ? over - (over / ratio) : 0;
  const output = inputLevel - reduction;

  const renderContent = () => {
    switch (activeTab) {
      case 'viz':
        return (
          <div className="animate-fade-in">
             {/* Simulator Section */}
             <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-5 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] text-slate-600 font-mono tracking-widest uppercase">Simulator</div>
                <div className="flex gap-4 mb-4 justify-center">
                    {/* Input Meter */}
                    <div className="flex flex-col items-center w-8">
                       <div className="w-4 bg-slate-900 rounded-full h-32 relative overflow-hidden border border-slate-700">
                          <div className="absolute bottom-0 w-full bg-green-500 transition-all duration-100" style={{ height: `${Math.min(100, (inputLevel + 60) * 1.5)}%` }}></div>
                          {/* Threshold Marker on Input */}
                          <div className="absolute w-full h-0.5 bg-white opacity-70 z-10" style={{ bottom: `${(threshold + 60) * 1.5}%` }}></div>
                       </div>
                       <span className="text-[9px] text-slate-500 mt-1 font-bold">IN</span>
                    </div>
        
                    {/* GR Meter (Reverse) */}
                    <div className="flex flex-col items-center w-8">
                       <div className="w-4 bg-slate-900 rounded-full h-32 relative overflow-hidden border border-slate-700">
                          <div className="absolute top-0 w-full bg-red-500 transition-all duration-100" style={{ height: `${Math.min(100, reduction * 4)}%` }}></div>
                       </div>
                       <span className="text-[9px] text-red-500 mt-1 font-bold">GR</span>
                    </div>
        
                    {/* Output Meter */}
                    <div className="flex flex-col items-center w-8">
                       <div className="w-4 bg-slate-900 rounded-full h-32 relative overflow-hidden border border-slate-700">
                          <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-100" style={{ height: `${Math.min(100, (output + 60) * 1.5)}%` }}></div>
                       </div>
                       <span className="text-[9px] text-slate-500 mt-1 font-bold">OUT</span>
                    </div>
                 </div>

                 {/* Test Slider */}
                 <div>
                   <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block flex justify-between">
                      <span>Test Signalstyrke</span>
                      <span className="text-white">{inputLevel} dB</span>
                   </label>
                   <input 
                      type="range" min="-60" max="0" value={inputLevel}
                      onChange={(e) => setInputLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                 </div>
             </div>

             {/* Controls */}
             <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-slate-300">Threshold</span><span className="text-red-400">{threshold} dB</span></div>
                    <input type="range" min="-40" max="0" value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} className="w-full h-2 bg-slate-600 rounded appearance-none cursor-pointer accent-red-500 mb-3"/>
                    
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-slate-300">Ratio</span><span className="text-red-400">{ratio}:1</span></div>
                    <input type="range" min="1" max="10" step="0.5" value={ratio} onChange={(e) => setRatio(parseFloat(e.target.value))} className="w-full h-2 bg-slate-600 rounded appearance-none cursor-pointer accent-red-500"/>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-slate-300">Attack</span><span className="text-slate-400">{attack} ms</span></div>
                    <input type="range" min="0" max="100" value={attack} onChange={(e) => setAttack(parseInt(e.target.value))} className="w-full h-2 bg-slate-600 rounded appearance-none cursor-pointer accent-slate-400 mb-3"/>
                    
                    <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-slate-300">Release</span><span className="text-slate-400">{release} ms</span></div>
                    <input type="range" min="50" max="1000" value={release} onChange={(e) => setRelease(parseInt(e.target.value))} className="w-full h-2 bg-slate-600 rounded appearance-none cursor-pointer accent-slate-400"/>
                 </div>
             </div>
          </div>
        );
      case 'theory':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-slate-800 p-3 rounded border border-slate-700">
               <h4 className="text-sm font-bold text-red-300 mb-2">Hvorfor bruke Kompressor?</h4>
               <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                 <li><strong>Jevnere Nivå:</strong> Gjør at svake ord i en sang høres like godt som de sterke.</li>
                 <li><strong>Punch:</strong> På trommer kan en kompressor med treg attack fremheve "smellet" i starten.</li>
                 <li><strong>"Glue" (Lim):</strong> På master-bussen får det instrumentene til å høres ut som de spiller i samme rom.</li>
               </ul>
             </div>
             
             <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
               <h4 className="text-sm font-bold text-red-300 mb-2 flex items-center gap-2"><AlertTriangle size={14}/> Når bør man være forsiktig?</h4>
               <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                 <li><strong>Feedback:</strong> Kompresjon løfter opp de svake lydene. I et live-rom kan dette fort gi feedback hvis du komprimerer vokalen for hardt.</li>
                 <li><strong>Klassisk Musikk:</strong> Her ønsker man ofte full dynamikk (fra ppp til fff). Kompresjon kan ødelegge uttrykket.</li>
                 <li><strong>Pumping:</strong> Hvis Release er feil innstilt på hele miksen, kan lyden "dukke" hver gang kicken slår.</li>
               </ul>
             </div>
          </div>
        );
      case 'tips':
        return (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Start-innstillinger</h4>
            
            <div className="bg-slate-800 p-3 rounded border-l-2 border-blue-400">
               <div className="font-bold text-xs text-white flex justify-between">
                  <span>VOKAL (Jevnhet)</span>
                  <span className="text-blue-400">Ratio 3:1</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">
                  <strong>Attack:</strong> Rask (5-10ms) for å fange topper.<br/>
                  <strong>Release:</strong> Medium (100-200ms).<br/>
                  <strong>Mål:</strong> 3-6 dB Gain Reduction på de sterkeste partiene.
               </p>
            </div>

            <div className="bg-slate-800 p-3 rounded border-l-2 border-orange-400">
               <div className="font-bold text-xs text-white flex justify-between">
                  <span>TROMMER (Punch)</span>
                  <span className="text-orange-400">Ratio 4:1</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">
                  <strong>Attack:</strong> Treg (15-30ms). Dette slipper "klikket" igjennom før kompressoren klemmer til.<br/>
                  <strong>Release:</strong> Rask (50-100ms) så den er klar til neste slag.
               </p>
            </div>

            <div className="bg-slate-800 p-3 rounded border-l-2 border-purple-400">
               <div className="font-bold text-xs text-white flex justify-between">
                  <span>BASS (Stabil bunn)</span>
                  <span className="text-purple-400">Ratio 4:1 til 6:1</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">
                  <strong>Attack:</strong> Medium (10-20ms).<br/>
                  <strong>Release:</strong> Medium/Treg. Bass trenger stabilitet.
               </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-red-500/50 animate-fade-in">
      <h3 className="text-red-400 font-bold text-sm mb-4 flex items-center gap-2"><Activity size={16}/> Kompressor</h3>
      
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {[{id:'viz', l:'Visning & Kontroll'}, {id:'theory', l:'Teori & Advarsler'}, {id:'tips', l:'Innstillinger'}].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${activeTab === tab.id ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
           >
             {tab.l}
           </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

const FXInfoVisualizer = ({ deepDive }) => {
    return (
        <div className="space-y-3 animate-fade-in">
            <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2"><Sparkles size={16}/> FX Detaljer</h4>
            {deepDive && deepDive.map((item, i) => (
                <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                        <span className="text-[10px] bg-purple-900/30 text-purple-200 px-2 py-0.5 rounded border border-purple-500/20">{item.tag}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.info}</p>
                    {item.usage && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[10px] text-green-400 italic">
                            <Check size={10}/> Anbefalt bruk: {item.usage}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const Dyn8Visualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [bands, setBands] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBands([Math.random()*20, Math.random()*30, Math.random()*15, Math.random()*10]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-bold text-purple-300 mb-2">Hva er Dyn8?</h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Dyn8 er dLives "hemmelige våpen". Den består av to deler du kan bruke samtidig:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2 rounded">
                  <div className="font-bold text-purple-400 text-xs mb-1">1. Dynamic EQ</div>
                  <p className="text-[10px] text-slate-400">EQ som KUN aktiveres når et frekvensområde blir for sterkt (eller svakt).</p>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="font-bold text-purple-400 text-xs mb-1">2. Multiband Komp</div>
                  <p className="text-[10px] text-slate-400">Kompressor som jobber på 4 separate frekvensbånd uavhengig av hverandre.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/10 border border-yellow-700/30 p-3 rounded-lg mt-3">
              <h5 className="text-xs font-bold text-yellow-400 mb-1 flex items-center gap-2">
                <Lightbulb size={12}/> Snarvei: Bruk Presets!
              </h5>
              <p className="text-[10px] text-slate-300 mb-2">
                dLive kommer med et ferdig bibliotek som er fantastiske startpunkter.
              </p>
              <ul className="text-[10px] text-slate-400 list-disc pl-4 space-y-1">
                <li>Gå til <strong>Library</strong> inne på Dyn8-skjermen.</li>
                <li>Velg f.eks. <em>"Vocal De-Ess"</em> eller <em>"Ac Gtr Fix"</em>.</li>
                <li>Juster kun <strong>Threshold</strong> til det passer ditt signal.</li>
              </ul>
            </div>
          </div>
        );
      case 'params':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <Activity size={12} className="text-purple-400"/> 1. Dynamic EQ Parametere
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-700 pb-1">
                  <span className="text-[10px] font-bold text-slate-300">Freq</span>
                  <span className="text-[10px] text-slate-400">Hvilken frekvens skal fikses? (Eks: 8kHz for S-lyder)</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-1">
                  <span className="text-[10px] font-bold text-slate-300">Width (Q)</span>
                  <span className="text-[10px] text-slate-400">Bredde på kuttet. Smal Q = Kirurgisk. Bred Q = Musikalsk.</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-1">
                  <span className="text-[10px] font-bold text-slate-300">Gain</span>
                  <span className="text-[10px] text-slate-400">Hvor mye kutt/boost når den trigges? (Eks: -4dB)</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <BarChart2 size={12} className="text-cyan-400"/> 2. Multiband Parametere
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-700 pb-1">
                  <span className="text-[10px] font-bold text-slate-300">Ratio</span>
                  <span className="text-[10px] text-slate-400">Hvor hardt komprimeres båndet? (Eks: 3:1 for bass)</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-1">
                  <span className="text-[10px] font-bold text-slate-300">Attack</span>
                  <span className="text-[10px] text-slate-400">Rask (Trommer/S) vs Treg (Bass/Kropp).</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'vokal':
        return (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-purple-300 uppercase mb-2 flex items-center gap-2"><Mic2 size={12}/> Vokal Oppsett</h4>
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-slate-800 p-2 rounded border-l-2 border-purple-500">
                  <div className="text-[10px] text-slate-500 font-bold">Multiband Comp</div>
                  <ul className="text-[10px] text-slate-300 list-disc pl-3 mt-1">
                    <li><strong>Lo-Mid (250Hz):</strong> Strammer opp "kroppen" i stemmen.</li>
                    <li><strong>High (8kHz):</strong> Lett kompresjon for å samle luft/pust.</li>
                  </ul>
               </div>
               <div className="bg-slate-800 p-2 rounded border-l-2 border-pink-500">
                  <div className="text-[10px] text-slate-500 font-bold">Dynamic EQ</div>
                  <ul className="text-[10px] text-slate-300 list-disc pl-3 mt-1">
                    <li><strong>Band 1 (De-Esser):</strong> 7-9 kHz. Kutt når "S" blir sterk.</li>
                    <li><strong>Band 2 (Proximity):</strong> 150-200 Hz. Demper "grøt" når sangeren går tett på mikrofonen.</li>
                  </ul>
               </div>
            </div>
          </div>
        );
      case 'gitar':
        return (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-yellow-300 uppercase mb-2 flex items-center gap-2"><Music size={12}/> Gitar Oppsett</h4>
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-slate-800 p-2 rounded border-l-2 border-yellow-500">
                  <div className="text-[10px] text-slate-500 font-bold">Multiband Comp (Akustisk)</div>
                  <ul className="text-[10px] text-slate-300 list-disc pl-3 mt-1">
                    <li><strong>Low (100-200Hz):</strong> Kontroller "booming" uten å fjerne bunnen helt.</li>
                  </ul>
               </div>
               <div className="bg-slate-800 p-2 rounded border-l-2 border-orange-500">
                  <div className="text-[10px] text-slate-500 font-bold">Dynamic EQ (El-Gitar)</div>
                  <ul className="text-[10px] text-slate-300 list-disc pl-3 mt-1">
                    <li><strong>2-3 kHz:</strong> Demper skjærende "is-hakke" lyd når gitaristen spiller hardt.</li>
                  </ul>
               </div>
            </div>
          </div>
        );
      case 'keys':
        return (
          <div className="space-y-3 animate-fade-in">
             <div className="bg-slate-800 p-2 rounded border-l-2 border-blue-500">
                <h4 className="text-xs font-bold text-blue-300 mb-1">Piano & Synths</h4>
                <p className="text-[10px] text-slate-300">
                   <strong>Problem:</strong> Store piano-akkorder i venstrehånda krasjer med bass og kick.<br/>
                   <strong>Løsning:</strong> Bruk DynEQ til å dempe <strong>200-400 Hz</strong> kun når det blir for mye energi der.
                </p>
             </div>
          </div>
        );
      case 'trommer':
        return (
          <div className="space-y-3 animate-fade-in">
             <div className="bg-slate-800 p-2 rounded border-l-2 border-red-500">
                <h4 className="text-xs font-bold text-red-300 mb-1">Tromme-buss</h4>
                <ul className="text-[10px] text-slate-300 list-disc pl-3">
                   <li><strong>MBC Low:</strong> Hold kicken stabil.</li>
                   <li><strong>MBC High:</strong> Temmer cymbalslag uten å drepe snaren.</li>
                   <li><strong>DynEQ 500Hz:</strong> Fjerner "boks-lyd" fra toms når de spilles hardt.</li>
                </ul>
             </div>
          </div>
        );
      case 'bass':
        return (
          <div className="space-y-3 animate-fade-in">
             <div className="bg-slate-800 p-2 rounded border-l-2 border-indigo-500">
                <h4 className="text-xs font-bold text-indigo-300 mb-1">Bassgitar</h4>
                <ul className="text-[10px] text-slate-300 list-disc pl-3">
                   <li><strong>MBC Low (50-100Hz):</strong> Låser bunnen så hver note har lik tyngde.</li>
                   <li><strong>DynEQ 1-2kHz:</strong> Demper klirring fra båndene (fret noise) hvis det blir for intenst.</li>
                </ul>
             </div>
          </div>
        );
      default:
        return <div className="text-xs text-slate-400">Velg en annen fane for detaljer.</div>;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-purple-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(168,85,247,0.1)]">
      <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2 text-sm"><BarChart2 size={16}/> Dyn8 Explorer</h3>
      <div className="relative w-full h-40 bg-slate-950 border border-slate-800 rounded mb-4 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex opacity-30">
          <div className="flex-1 bg-red-900/40 border-r border-slate-800 flex items-end justify-center"><div style={{height: `${bands[0]}%`, width: '100%'}} className="bg-red-500/50 transition-all duration-200"></div></div>
          <div className="flex-1 bg-yellow-900/40 border-r border-slate-800 flex items-end justify-center"><div style={{height: `${bands[1]}%`, width: '100%'}} className="bg-yellow-500/50 transition-all duration-200"></div></div>
          <div className="flex-1 bg-green-900/40 border-r border-slate-800 flex items-end justify-center"><div style={{height: `${bands[2]}%`, width: '100%'}} className="bg-green-500/50 transition-all duration-200"></div></div>
          <div className="flex-1 bg-blue-900/40 flex items-end justify-center"><div style={{height: `${bands[3]}%`, width: '100%'}} className="bg-blue-500/50 transition-all duration-200"></div></div>
        </div>
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 300 128" preserveAspectRatio="none">
           <path d="M0,64 L300,64" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" fill="none"/>
           <path d={`M0,64 Q40,${64 + bands[0]*1.5}, 80,64`} fill="none" stroke="#f87171" strokeWidth="2" className="transition-all duration-200"/>
           <path d={`M80,64 Q120,${64 + bands[1]*1.5}, 160,64`} fill="none" stroke="#facc15" strokeWidth="2" className="transition-all duration-200"/>
           <path d={`M160,64 Q200,${64 + bands[2]*1.5}, 240,64`} fill="none" stroke="#4ade80" strokeWidth="2" className="transition-all duration-200"/>
           <path d={`M240,64 Q280,${64 + bands[3]*1.5}, 300,64`} fill="none" stroke="#60a5fa" strokeWidth="2" className="transition-all duration-200"/>
        </svg>
        <div className="absolute top-2 right-2 text-[9px] text-slate-500 font-mono bg-slate-900/80 px-1 rounded">DUAL VIEW: MBC + DYNEQ</div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro', 'Parametere', 'Vokal', 'Gitar', 'Keys', 'Trommer', 'Bass'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-2 py-1 text-[10px] rounded font-bold border transition-all
            ${activeTab === tab.toLowerCase() ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in min-h-[150px]">
        {renderContent()}
      </div>
    </div>
  );
};

const DeEsserVisualizer = () => {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/50 animate-fade-in">
      <h3 className="text-blue-400 font-bold text-sm mb-4 flex items-center gap-2"><Zap size={16}/> De-Esser</h3>
      <div className="relative w-full h-32 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-4">
        <svg className="w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
          <path d="M0,80 Q50,70 100,80 T200,60 T300,80" fill="none" stroke="#334155" strokeWidth="2" opacity="0.5"/>
          <rect x="200" y="20" width="60" height="100" fill="rgba(59, 130, 246, 0.1)" />
          <line x1="230" y1="20" x2="230" y2="120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2"/>
          <text x="215" y="15" fill="#3b82f6" fontSize="10" fontWeight="bold">5k - 8kHz</text>
        </svg>
      </div>
      <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
        <h4 className="font-bold text-xs text-slate-300 mb-1">Innstillinger</h4>
        <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
          <li><strong>Mann:</strong> Start søket rundt 5-6 kHz.</li>
          <li><strong>Dame:</strong> Start søket rundt 7-9 kHz.</li>
          <li><strong>Tips:</strong> Ikke overdriv. Vi vil fjerne "skjæring", ikke gjøre sangeren lespende.</li>
        </ul>
      </div>
    </div>
  );
};

const TransientVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-slate-200 mb-2">Hva gjør Transient Controller?</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Den lar deg justere to ting uavhengig av hverandre:
              </p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-slate-900 p-2 rounded text-center border-b-2 border-orange-500">
                  <div className="font-bold text-orange-400 text-xs">ATTACK</div>
                  <div className="text-[10px] text-slate-500">"Klikk" / "Snap"</div>
                </div>
                <div className="bg-slate-900 p-2 rounded text-center border-b-2 border-blue-500">
                  <div className="font-bold text-blue-400 text-xs">SUSTAIN</div>
                  <div className="text-[10px] text-slate-500">"Boom" / "Body"</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'parametere':
        return (
          <div className="space-y-3">
            <div className="bg-slate-800 p-2 rounded">
              <div className="flex justify-between mb-1"><span className="text-xs font-bold text-orange-400">Attack Gain</span></div>
              <p className="text-[10px] text-slate-400"><strong>+</strong> Mer punch/klikk. <strong>-</strong> Mykere anslag (dytt ting bak i miksen).</p>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="flex justify-between mb-1"><span className="text-xs font-bold text-blue-400">Sustain Gain</span></div>
              <p className="text-[10px] text-slate-400"><strong>+</strong> Mer kropp/hale. <strong>-</strong> Tørrere lyd (mindre romklang/lekkasje).</p>
            </div>
          </div>
        );
      case 'kick':
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2"><Music size={12}/> Kick Drum</h4>
            <p className="text-[10px] text-slate-400 mb-2">Mål: Mer punch i miksen uten "mud".</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-orange-400">Attack Gain</span><span className="text-slate-300 font-bold">+2 til +6 dB</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-blue-400">Sustain Gain</span><span className="text-slate-300 font-bold">-2 til -6 dB</span>
              </div>
            </div>
            <p className="text-[10px] text-green-400 italic mt-2">Resultat: Gir tydelig "thump" og renere bunn.</p>
          </div>
        );
      case 'snare':
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2"><Music size={12}/> Snare</h4>
            <p className="text-[10px] text-slate-400 mb-2">Mål: Mer "crack" og mindre rom/hale.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-orange-400">Attack Gain</span><span className="text-slate-300 font-bold">+2 til +5 dB</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-blue-400">Sustain Gain</span><span className="text-slate-300 font-bold">-2 til -6 dB</span>
              </div>
            </div>
            <p className="text-[10px] text-green-400 italic mt-2">Resultat: Tydelig snap i lovsangsmiks.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-orange-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(249,115,22,0.1)]">
      <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2 text-sm"><Activity size={16}/> Transient Controller</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro', 'Parametere', 'Kick', 'Snare'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};

const MultibandVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [bands, setBands] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBands([Math.random() * 30, Math.random() * 50, Math.random() * 40, Math.random() * 20]);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-bold text-cyan-300 mb-2">Hva gjør en MBC?</h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">En MBC er en kompressor delt opp i 3–4 frekvensområder. Du kan komprimere kun området som er problemet uten å påvirke resten.</p>
              <div className="bg-slate-900/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Når bruker du den?</h5>
                <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-4">
                  <li>Boomy vokal (nær mikk)</li>
                  <li>Resonanser som dukker opp av og til</li>
                  <li>Keys/Pads som bygger seg opp</li>
                  <li>Master Bus for å "lime" miksen</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default: return <div className="text-xs text-slate-400">Velg en fane for detaljer.</div>;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-cyan-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(34,211,238,0.1)]">
      <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm"><BarChart2 size={16}/> Multiband Compressor</h3>
      {/* Viz Animation */}
      <div className="flex gap-1 h-24 items-end justify-center px-2 mb-4 bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
        <div className="absolute top-2 left-2 text-[9px] text-slate-600 font-mono">GAIN REDUCTION</div>
        {['Low', 'Lo-Mid', 'Hi-Mid', 'High'].map((label, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative group">
            <div className="absolute top-8 w-full border-t border-slate-800 border-dashed"></div>
            <div className="w-full bg-cyan-500/30 border-b-2 border-cyan-400 transition-all duration-200 absolute top-0" style={{ height: `${bands[i]}%` }}></div>
            <span className="text-[9px] text-slate-500 mt-1 z-10 font-mono">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};

const HypabassVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-pink-500/30">
              <h4 className="text-sm font-bold text-pink-300 mb-2">Hva er Hypabass?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">En <strong>subharmonic generator</strong> som lager ny bass-informasjon én oktav under originalen.</p>
              <div className="bg-slate-900 p-2 rounded text-center italic text-[10px] text-slate-400 border-l-2 border-pink-500">"Tenk: Mer sub, uten å måtte booste EQ."</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-green-400 uppercase mb-1 flex items-center gap-1"><Check size={10}/> Bruk på</h5>
                <ul className="text-[10px] text-slate-400 list-disc pl-3"><li>Kick</li><li>Bass-gitar</li></ul>
              </div>
              <div className="bg-slate-800/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center gap-1"><X size={10}/> Unngå på</h5>
                <ul className="text-[10px] text-slate-400 list-disc pl-3"><li>Vokal (!)</li><li>Toms / Snare</li></ul>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-pink-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(236,72,153,0.1)]">
      <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2 text-sm"><Activity size={16}/> Hypabass</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-pink-600 text-white border-pink-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};

const InsertsVisualizer = () => {
  const [view, setView] = useState('list'); // list, dyn8, deesser, transient, multiband, hypabass

  if (view === 'dyn8') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('list')} className="text-xs text-blue-400 font-bold hover:text-white flex items-center gap-1"><ArrowLeft size={12}/> Tilbake</button>
          <span className="text-xs text-slate-500">/ Dyn8</span>
        </div>
        <Dyn8Visualizer />
      </div>
    );
  }

  if (view === 'deesser') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('list')} className="text-xs text-blue-400 font-bold hover:text-white flex items-center gap-1"><ArrowLeft size={12}/> Tilbake</button>
          <span className="text-xs text-slate-500">/ De-Esser</span>
        </div>
        <DeEsserVisualizer />
      </div>
    );
  }

  if (view === 'transient') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <button onClick={() => setView('list')} className="text-xs text-blue-400 font-bold hover:text-white flex items-center gap-1"><ArrowLeft size={12}/> Tilbake</button>
           <span className="text-xs text-slate-500">/ Transient Controller</span>
        </div>
        <TransientVisualizer />
      </div>
    );
  }

  if (view === 'multiband') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <button onClick={() => setView('list')} className="text-xs text-blue-400 font-bold hover:text-white flex items-center gap-1"><ArrowLeft size={12}/> Tilbake</button>
           <span className="text-xs text-slate-500">/ Multiband Comp</span>
        </div>
        <MultibandVisualizer />
      </div>
    );
  }
  if (view === 'hypabass') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <button onClick={() => setView('list')} className="text-xs text-blue-400 font-bold hover:text-white flex items-center gap-1"><ArrowLeft size={12}/> Tilbake</button>
           <span className="text-xs text-slate-500">/ Hypabass</span>
        </div>
        <HypabassVisualizer />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
        <h4 className="text-xs font-bold text-blue-300 uppercase mb-2 flex items-center gap-2">
          <Sliders size={12}/> Hvor skal inserten ligge?
        </h4>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          På dLive kan du flytte Insert A til å ligge <strong>før</strong> eller <strong>etter</strong> EQ/Kompressor i stripen.
        </p>
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-slate-900/50 p-2 rounded border-l-2 border-yellow-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-white">Pre-EQ (Før EQ)</span>
              <span className="text-[9px] bg-yellow-900/30 text-yellow-400 px-1.5 rounded">Vanligst</span>
            </div>
            <p className="text-[10px] text-slate-400">
              <strong>Hvorfor:</strong> Du vil fikse problemer (f.eks. s-lyder eller transienter) <em>før</em> du begynner å skru lyd med EQ.
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              <strong>Bruk:</strong> De-Esser, Transient Controller, Dyn8 (for opprydding).
            </p>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border-l-2 border-blue-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-white">Post-EQ (Etter EQ)</span>
              <span className="text-[9px] bg-blue-900/30 text-blue-400 px-1.5 rounded">Polering</span>
            </div>
            <p className="text-[10px] text-slate-400">
              <strong>Hvorfor:</strong> Du former lyden med EQ først, og lar inserten "lime" eller kontrollere det ferdige resultatet.
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              <strong>Bruk:</strong> Multiband Comp (Master/Bus), Limiter, Hypabass.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-yellow-400 font-bold text-sm flex items-center gap-2"><Star size={16}/> Topp 5 Viktigste Inserts</h3>
      <div className="space-y-3">
        {/* 1. DYN8 */}
        <div onClick={() => setView('dyn8')} className="bg-slate-800 p-3 rounded border border-purple-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">1. Dyn8 <Play size={10} className="text-purple-400 group-hover:text-white"/></span>
            <span className="text-[9px] bg-purple-900 text-purple-200 px-1.5 py-0.5 rounded">Must-have</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Multibånd-komp + Dynamisk EQ. Det mest potente verktøyet i dLive.</p>
          <div className="text-[10px] text-green-400 italic">Bruk på: Vokal (Alltid), Keys, Gitar.</div>
        </div>

        {/* 2. DE-ESSER */}
        <div onClick={() => setView('deesser')} className="bg-slate-800 p-3 rounded border border-blue-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
             <span className="font-bold text-slate-200 text-sm flex items-center gap-2">2. De-Esser <Play size={10} className="text-blue-400 group-hover:text-white"/></span>
             <span className="text-[9px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">Vokal</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Fjerner harde S-lyder. Viktig i kirker med mye klang.</p>
        </div>

        {/* 3. TRANSIENT CONTROLLER */}
        <div onClick={() => setView('transient')} className="bg-slate-800 p-3 rounded border border-orange-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
             <span className="font-bold text-slate-200 text-sm flex items-center gap-2">3. Transient Controller <Play size={10} className="text-orange-400 group-hover:text-white"/></span>
             <span className="text-[9px] bg-orange-900 text-orange-200 px-1.5 py-0.5 rounded">Trommer</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Gir "punch" uten å bruke EQ. Løfter anslaget.</p>
          <div className="text-[10px] text-slate-500 italic">Bruk på: Kick, Snare, Toms (gir definisjon).</div>
        </div>

        {/* 4. MULTIBAND COMP */}
        <div onClick={() => setView('multiband')} className="bg-slate-800 p-3 rounded border border-cyan-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
             <span className="font-bold text-slate-200 text-sm flex items-center gap-2">4. Multiband Compressor <Play size={10} className="text-cyan-400 group-hover:text-white"/></span>
             <span className="text-[9px] bg-cyan-900 text-cyan-200 px-1.5 py-0.5 rounded">Glue</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Kontrollerer highs/mids/lows separat. "Glue" på master.</p>
        </div>

        {/* 5. HYPABASS */}
        <div onClick={() => setView('hypabass')} className="bg-slate-800 p-3 rounded border border-pink-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
             <span className="font-bold text-slate-200 text-sm flex items-center gap-2">5. Hypabass <Play size={10} className="text-pink-400 group-hover:text-white"/></span>
             <span className="text-[9px] bg-pink-900 text-pink-200 px-1.5 py-0.5 rounded">Sub</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Gir sub-punch uten gjørme. Hillsong/Elevation lyd.</p>
          <div className="text-[10px] text-slate-500 italic">Bruk på: Bassgitar, Kick, Tromme-buss.</div>
        </div>
      </div>

      {/* BONUS */}
      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bonus Inserter</h4>
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-slate-800/50 p-2 rounded text-center">
             <div className="text-[10px] font-bold text-blue-400">Opto (LA-2A)</div>
             <div className="text-[9px] text-slate-500">Smooth vokal</div>
           </div>
           <div className="bg-slate-800/50 p-2 rounded text-center">
             <div className="text-[10px] font-bold text-orange-400">16T (1176)</div>
             <div className="text-[9px] text-slate-500">Rask/Punchy</div>
           </div>
           <div className="bg-slate-800/50 p-2 rounded text-center">
             <div className="text-[10px] font-bold text-purple-400">Limiter 76</div>
             <div className="text-[9px] text-slate-500">El-Gitar/Hard</div>
           </div>
        </div>
      </div>

      {/* PRO TIPS */}
      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-xs font-bold text-green-400 uppercase mb-2 flex items-center gap-2"><Check size={12}/> Proffenes Kombinasjoner</h4>
        <div className="space-y-2">
          {[
            { src: "Vokal", combo: "Dyn8 + Opto Comp" },
            { src: "Kick", combo: "Transient Ctrl + Peak Limiter" },
            { src: "Snare", combo: "Transient Ctrl + 16T" },
            { src: "Bass", combo: "Hypabass + Opto" },
            { src: "Master", combo: "Multiband + Limiter" }
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-slate-800 pb-1">
              <span className="font-bold text-slate-300">{item.src}</span>
              <span className="text-slate-400">{item.combo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MatrixVisualizer = () => {
  return (
    <div className="space-y-4 animate-fade-in">
       <div className="relative h-40 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-4 flex items-center justify-between">
          {/* SOURCE */}
          <div className="flex flex-col items-center z-10">
             <div className="w-16 h-10 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white shadow-lg">Main LR</div>
             <div className="h-full w-0.5 bg-blue-600/30 absolute top-14 bottom-4 left-12"></div>
          </div>

          {/* SPLIT LINES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <path d="M80,60 C150,60 150,30 220,30" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4,4"/>
             <path d="M80,60 C150,60 150,60 220,60" fill="none" stroke="#3b82f6" strokeWidth="3"/>
             <path d="M80,60 C150,60 150,90 220,90" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4,4"/>
          </svg>

          {/* DESTINATIONS */}
          <div className="flex flex-col gap-4 z-10 w-32">
             <div className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center">
                <span className="text-[10px] text-slate-300">Foajé</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-green-500"></div></div>
             </div>
             <div className="bg-slate-800 p-2 rounded border border-blue-500/50 shadow-lg flex justify-between items-center scale-110">
                <span className="text-[10px] text-white font-bold">Main PA</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-blue-500"></div></div>
             </div>
             <div className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center">
                <span className="text-[10px] text-slate-300">Ammerom</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[40%] h-full bg-green-500"></div></div>
             </div>
          </div>
       </div>
       
       <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
          <h4 className="text-xs font-bold text-blue-300 mb-1">Hvorfor Matrix?</h4>
          <p className="text-xs text-slate-300">
             Matrix lar deg sende <strong>samme miks</strong> (Main LR) til flere rom, men med <strong>forskjellig volum</strong> og EQ.
             <br/><br/>
             Eks: Hvis noen klager på at det er for høyt i foajeen, skrur du bare ned "Foyer Matrix", uten å ødelegge lyden i hovedsalen!
          </p>
       </div>
    </div>
  );
};

const PAVisualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
       <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulsing Circles */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="absolute inset-4 bg-blue-500/40 rounded-full animate-pulse"></div>
          
          {/* Speaker Icon */}
          <div className="relative z-10 bg-slate-900 p-4 rounded-full border-4 border-slate-800 shadow-2xl">
             <Speaker size={48} className="text-blue-400"/>
          </div>
       </div>
       <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-white">Lyd i rommet!</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
             Signalet har nå reist hele veien fra mikrofonen, gjennom mikseren, via matrix, og ut av høyttalerne.
          </p>
       </div>
    </div>
  );
};

// --- CORE UI COMPONENTS ---

const MonitorVisualizer = () => {
  const [showFuture, setShowFuture] = useState(false);

  // --- SUB-KOMPONENT: MONITOR IKON ---
  const StageMonitor = ({ label, subLabel, aux, x, y, type }) => {
    // Sjekk om vi skal vise IEM (In-Ear) grafikk
    const isIEM = type === 'iem' || showFuture;

    return (
      <div 
        className="absolute flex flex-col items-center group"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: 20 }}
      >
        
        {/* --- GRAFIKK --- */}
        <div className="relative w-24 h-20 flex items-center justify-center mb-1">
          
          {/* A: WEDGE MONITOR (Gulvhøyttaler) */}
          <div 
            className={`
              absolute transition-all duration-500 ease-in-out
              ${isIEM ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
            `}
          >
             {/* Gulvboks (Kobling) */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60">
                <div className="w-0.5 h-6 bg-slate-600"></div>
                <div className="w-4 h-3 bg-slate-800 border border-slate-600 rounded-sm"></div>
             </div>

             {/* Selve Høyttaleren (3D Trapes effekt) */}
             <div 
               className="w-16 h-12 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden"
               style={{ transform: 'perspective(200px) rotateX(20deg)' }} // Dette gir "liggende" look
             >
                {/* Høyttaler Grill (Netting) */}
                <div className="absolute inset-1 bg-black/60 rounded border border-slate-700"
                     style={{
                        backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', 
                        backgroundSize: '3px 3px'
                     }}>
                </div>
                {/* Selve elementet (Woofer) - Gjør det tydelig at det er en høyttaler */}
                <div className="absolute w-8 h-8 rounded-full border-2 border-slate-700 bg-slate-900/80 shadow-inner flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                </div>
             </div>
          </div>

          {/* B: IEM BODYPACK (Fremtid) */}
          <div 
            className={`
              absolute transition-all duration-500 ease-in-out
              ${isIEM ? 'opacity-100 scale-100' : 'opacity-0 scale-50 translate-y-4'}
            `}
          >
             <div className="w-10 h-14 bg-gradient-to-b from-blue-900 to-slate-900 rounded border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex flex-col items-center pt-2 relative">
                <div className="absolute -top-3 right-1 w-0.5 h-4 bg-black"></div> {/* Antenne */}
                <span className="text-[8px] text-blue-300 font-bold mb-1">SHURE</span>
                <div className="w-6 h-4 bg-blue-950 border border-blue-800 rounded flex items-center justify-center">
                   <span className="text-[8px] text-green-400 font-mono">{aux.replace("AUX ", "")}</span>
                </div>
                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 animate-pulse shadow-[0_0_5px_#22c55e]"></div>
             </div>
          </div>

        </div>

        {/* --- LABEL (Tekstboks) --- */}
        {/* Lagt til fast bredde og bedre bakgrunn for å hindre overlap-lesbarhet */}
        <div className="flex flex-col items-center gap-0.5 z-30 min-w-[80px]">
          <div className="flex items-center gap-1.5 bg-slate-900/95 border border-slate-600 rounded px-2 py-1 shadow-lg">
             <div className={`
               w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold shrink-0
               ${isIEM ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}
             `}>
               {aux.replace("AUX ", "")}
             </div>
             <span className="text-[10px] font-bold text-white whitespace-nowrap leading-none">{label}</span>
          </div>
          <span className="text-[9px] text-slate-300 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap border border-slate-700/30">
            {subLabel}
          </span>
        </div>

      </div>
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-blue-500/30 overflow-hidden shadow-2xl mt-4">
      
      {/* HEADER */}
      <div className="bg-slate-950 p-3 flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <CornerDownRight size={16} className="text-blue-500"/> Monitor Oppsett
          </h3>
          <p className="text-[10px] text-slate-400">Sett fra FOH (Tekniker-posisjon)</p>
        </div>
        <button 
          onClick={() => setShowFuture(!showFuture)}
          className={`
            px-3 py-1.5 rounded text-[10px] font-bold border transition-all flex items-center gap-2
            ${showFuture ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-600 text-slate-400'}
          `}
        >
          {showFuture ? "Viser: In-Ears" : "Viser: Wedges"}
        </button>
      </div>

      {/* SCENE GRAFIKK */}
      <div className="relative w-full aspect-[16/9] bg-[#0f172a] overflow-hidden group">
        
        {/* Scenegulv styling */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-80"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
        </div>

        {/* --- POSISJONER --- */}
        {/* Justerte koordinater for å unngå kollisjon */}
        
        {/* BAK: Trommer */}
        <StageMonitor x="50%" y="20%" aux="AUX 5" label="Trommer" subLabel="Alltid IEM" type="iem" />

        {/* MIDT: Flyttet lenger ut til sidene (15% og 85%) */}
        <StageMonitor x="15%" y="45%" aux="AUX 4" label="Bass/Gitar" subLabel="Scene Venstre" type="wedge" />
        <StageMonitor x="85%" y="45%" aux="AUX 3" label="Piano/Keys" subLabel="Scene Høyre" type="wedge" />

        {/* FRONT: Sentrert men med god avstand */}
        <StageMonitor x="35%" y="70%" aux="AUX 2" label="Vokal (L)" subLabel="Front" type="wedge" />
        <StageMonitor x="65%" y="70%" aux="AUX 1" label="Vokal (R)" subLabel="Front" type="wedge" />

        {/* Scenekant kurve nederst */}
        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-black rounded-[50%] blur-md z-10"></div>
        
        {/* FOH Indikator */}
        <div className="absolute bottom-2 w-full text-center z-20">
            <span className="text-[8px] text-slate-600 uppercase tracking-[0.2em] font-bold">Publikum / FOH</span>
        </div>

      </div>
    </div>
  );
};

const SignalNodeMobile = ({ node, isFirst, isLast, onClick, isActive, index }) => {
  const isBranch = node.type === "branch_out";

  // Farger for horisontal "skyting"
  const isMonitor = node.id.includes('monitor');
  const isFX = node.id.includes('fx');
  let branchColorClass = "text-slate-500";
  if (isMonitor) branchColorClass = "text-blue-500";
  if (isFX) branchColorClass = "text-purple-500";

  // Delay for domino-effekt
  const delayStyle = { animationDelay: `${index * 0.25}s` };

  return (
    <div className="flex gap-4 relative w-full"> 
      
      {/* SKINNE (Venstre) */}
      <div className="w-12 flex-shrink-0 flex flex-col items-center relative">
        
        {/* HOVEDLINJEN (Vertikal) */}
        <div 
          className="absolute width-0.5 bg-slate-800 w-0.5"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: isFirst ? '1rem' : '0', 
            height: isLast ? '1rem' : '100%'
          }}
        >
          {/* ENDRING HER: Jeg fjernet {!isBranch && ...} sjekken.
              Nå rendres lyset ALLTID, slik at det går gjennom stiplede linjer også. */}
           <div 
             className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-70 animate-signal-pulse-vertical"
             style={delayStyle}
           ></div>
        </div>

        {/* Stiplet overlay (ligger oppå lyset, så lyset skinner "gjennom" prikkene) */}
        {isBranch && (
           <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -ml-[1px] border-l-2 border-dotted border-slate-600 z-10"></div>
        )}

        {/* HORISONTAL "LASER" (Kun for branches) */}
        {isBranch && (
          <div className="absolute left-1/2 top-8 w-8 h-0.5 -mt-4 z-0 overflow-hidden pointer-events-none">
             <div 
               className={`animate-shoot-right ${branchColorClass}`} 
               style={delayStyle}
             ></div>
          </div>
        )}

        {/* SIRKEL / IKON */}
        <div className={`
          relative z-20 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all bg-slate-900 mt-0
          ${isActive ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
            isBranch ? `border-slate-600 ${isMonitor ? 'text-blue-400' : isFX ? 'text-purple-400' : 'text-slate-500'}` : 'border-slate-600 text-slate-300'}
        `}>
          <IconHelper name={node.iconName} size={isBranch ? 14 : 16} />
        </div>
      </div>

      {/* KORTET (Høyre) */}
      <div className="flex-1 pb-8 min-w-0"> 
        <div 
          onClick={() => onClick(node)}
          className={`p-4 rounded-xl border transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden
            ${isActive ? 'bg-blue-900/20 border-blue-500 shadow-lg' : 'bg-slate-800 border-slate-700'}
            ${isBranch ? 'ml-2 border-dashed bg-slate-800/50' : ''}
          `}
        >
          {/* Lys-blink inni boksen (kun branches) */}
          {isBranch && (
            <div 
              className={`absolute inset-0 opacity-10 animate-pulse ${isMonitor ? 'bg-blue-500' : 'bg-purple-500'}`}
              style={{ animationDuration: '3s' }} 
            ></div>
          )}

          <div className="flex justify-between items-start relative z-10">
            <div className="min-w-0">
              <h4 className={`font-bold text-sm truncate ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>{node.label}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.desc}</p>
            </div>
            {isBranch && <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2 border ${isMonitor ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' : 'bg-purple-900/30 text-purple-300 border-purple-500/30'}`}>Aux</span>}
            {!isBranch && <ChevronRight size={16} className={`text-slate-600 shrink-0 ml-2 ${isActive ? 'text-blue-400' : ''}`}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailPanel = ({ node, subItem, setSubItem }) => {
  // Nå med 4 faner: 'overview', 'theory', 'tips', 'video'
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Hent videoer
  const getVideos = () => {
    const target = subItem || node;
    if (!target) return [];
    if (target.relatedVideos && target.relatedVideos.length > 0) return target.relatedVideos;
    if (target.videoId) return [{ videoId: target.videoId, title: target.videoTitle, desc: "Instruksjonsvideo" }];
    return [];
  };

  const videos = getVideos();
  const hasVideos = videos.length > 0;
  
  // Sjekk innhold
  const target = subItem || node;
  const hasDeepDive = target.deepDive && target.deepDive.length > 0;
  const hasTips = target.proTips && target.proTips.length > 0; // <--- NY SJEKK FOR TIPS

  // Reset ved bytte av node
  useEffect(() => {
    setActiveTab("overview");
    setSelectedVideo(null);
  }, [node]);

  // Sett første video default
  useEffect(() => {
    if (activeTab === "video" && !selectedVideo && hasVideos) {
      setSelectedVideo(videos[0]);
    }
  }, [activeTab, hasVideos, videos, selectedVideo]);

  if (!node) return null;

  return (
    <div className="animate-fade-in pb-20 md:pb-0 h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4 shrink-0">
        <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
          <IconHelper name={node.iconName} size={28} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{node.label}</h2>
          <p className="text-xs text-blue-300 uppercase tracking-wide">Info & Verktøy</p>
        </div>
      </div>

      {/* --- FANE-MENY (4 FANER) --- */}
      <div className="flex gap-4 mb-6 border-b border-slate-800 shrink-0 overflow-x-auto pb-1 scrollbar-hide">
        
        {/* 1. Oversikt */}
        <button 
          onClick={() => setActiveTab("overview")}
          className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === "overview" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Layout size={16}/> Oversikt
        </button>

        {/* 2. Fordypning (Teori) */}
        {hasDeepDive && (
          <button 
            onClick={() => setActiveTab("theory")}
            className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "theory" ? "border-green-500 text-white" : "border-transparent text-slate-500 hover:text-green-400"
            }`}
          >
            <GraduationCap size={18}/> Fordypning
          </button>
        )}

        {/* 3. Pro Tips (NY!) */}
        {hasTips && (
          <button 
            onClick={() => setActiveTab("tips")}
            className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "tips" ? "border-yellow-500 text-white" : "border-transparent text-slate-500 hover:text-yellow-400"
            }`}
          >
            <Lightbulb size={18}/> Tips & Triks
          </button>
        )}
        
        {/* 4. Video */}
        {hasVideos && (
          <button 
            onClick={() => setActiveTab("video")}
            className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === "video" ? "border-red-500 text-white" : "border-transparent text-slate-500 hover:text-red-400"
            }`}
          >
            <Youtube size={18}/> Video {videos.length > 1 && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] ml-1">{videos.length}</span>}
          </button>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">

        {/* --- FANE 1: OVERSIKT --- */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                 {subItem ? subItem.desc : node.details}
              </p>
            </div>

            {/* Visualizers */}
            {!subItem && (
                <>
                    {node.viz === "fx_info" && <FXInfoVisualizer deepDive={node.deepDive} />}
                    {node.viz === "gain_structure" && <GainStructureVisualizer />}
                    {node.viz === "fader_section" && <FaderSectionVisualizer />}
                    {node.viz === "matrix" && <MatrixVisualizer />}
                    {node.viz === "pa" && <PAVisualizer />}
                    {node.viz === "mixbus_map" && <MixBusVisualizer />}
                    {node.viz === "monitor_map" && <MonitorVisualizer />}
                    {node.viz === "input_connectors" && <InputConnectorsVisualizer />}
                </>
            )}

            {/* Sub-Chain */}
            {node.subChain && !subItem && (
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <Layers size={14}/> Velg modul:
                </h5>
                <div className="space-y-2">
                  {node.subChain.map((step, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSubItem(step)}
                      className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-blue-500 border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-slate-200 text-sm block group-hover:text-blue-400">{step.label}</span>
                        <span className="text-xs text-slate-500">{step.desc}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-600"/>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sub-Item View */}
            {subItem && (
              <div className="mt-2 bg-slate-950 border border-blue-500/30 rounded-xl p-4 animate-fade-in-up shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                  <button onClick={() => setSubItem(null)} className="flex items-center gap-1 text-xs text-blue-400 font-bold hover:text-white">
                    <ArrowLeft size={12}/> Tilbake
                  </button>
                  <span className="text-xs text-slate-500 uppercase">{subItem.label}</span>
                </div>
                
                {subItem.viz === "hpf" && <HPFVisualizer />}
                {subItem.viz === "dyn8" && <Dyn8Visualizer />}
                {subItem.viz === "comp" && <CompressorVisualizer definitions={subItem.deepDive} />}
                {subItem.viz === "gate" && <GateVisualizer definitions={subItem.deepDive} />}
                {subItem.viz === "peq" && <PEQVisualizer />}
                {subItem.viz === "deesser" && <DeEsserVisualizer />}
                {subItem.viz === "inserts" && <InsertsVisualizer />}
                
                {subItem.deepDive && subItem.deepDive.some(d => d.interactive) && !subItem.interactive && !subItem.viz && (
                  <div className="space-y-2 mt-4">
                      <h5 className="text-[10px] uppercase font-bold text-slate-500">Tilgjengelige Moduler:</h5>
                      {subItem.deepDive.map((d, i) => (
                        <div 
                           key={i} 
                           onClick={() => d.interactive ? setSubItem(d) : null}
                           className={`bg-slate-900 p-3 rounded border border-slate-700 flex justify-between items-center transition-colors ${d.interactive ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-800' : ''}`}
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-200 block">{d.name}</span>
                            <span className="text-[10px] text-slate-500">{d.info}</span>
                          </div>
                          {d.interactive ? <ChevronRight size={14} className="text-blue-500"/> : (d.tag && <span className="text-[9px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">{d.tag}</span>)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- FANE 2: FORDYPNING (Teori) --- */}
        {activeTab === "theory" && hasDeepDive && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <h3 className="text-green-400 font-bold flex items-center gap-2">
                    <GraduationCap size={20}/>
                    {target.deepDiveTitle || "Teori & Hardware"}
                </h3>
                <p className="text-xs text-green-200/70 mt-1">
                    Teknisk dybdeinformasjon og routing.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {target.deepDive.map((item, i) => {
                  if (item.interactive) return null; 
                  return (
                    <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-green-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                        <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-400 uppercase tracking-wider">{item.tag || "Info"}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.info}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- FANE 3: TIPS & TRIKS (NY!) --- */}
        {activeTab === "tips" && hasTips && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-bold flex items-center gap-2">
                    <Lightbulb size={20}/>
                    Praktiske Innstillinger
                </h3>
                <p className="text-xs text-yellow-200/70 mt-1">
                    Konkrete tall og triks for å få det til å låte bra.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {target.proTips.map((item, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                           <span className="text-[10px] bg-yellow-900/40 text-yellow-200 border border-yellow-700/50 px-2 py-0.5 rounded uppercase tracking-wider">{item.tag || "Tips"}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.info}</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* --- FANE 4: VIDEO --- */}
        {activeTab === "video" && selectedVideo && (
          <div className="animate-fade-in space-y-4 pt-2">
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black relative">
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&origin=${window.location.origin}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white text-lg mb-1">{selectedVideo.title || "Instruksjonsvideo"}</h3>
              <p className="text-slate-400 text-sm">{selectedVideo.desc}</p>
            </div>
            {videos.length > 1 && (
               <div className="mt-6">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 px-1">Flere videoer i denne modulen:</h4>
                 <div className="space-y-2">
                   {videos.map((vid, idx) => (
                     <div 
                        key={idx}
                        onClick={() => setSelectedVideo(vid)}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                          selectedVideo.videoId === vid.videoId 
                            ? "bg-slate-800 border-red-500/50" 
                            : "bg-slate-900 border-transparent hover:bg-slate-800 hover:border-slate-700"
                        }`}
                     >
                       <div className="relative w-24 aspect-video bg-black rounded overflow-hidden shrink-0 border border-slate-700">
                          <img 
                            src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`} 
                            alt="thumbnail" 
                            className="w-full h-full object-cover opacity-80"
                          />
                          {selectedVideo.videoId === vid.videoId && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                               <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                 <Play size={10} className="fill-white text-white ml-0.5"/>
                               </div>
                            </div>
                          )}
                       </div>
                       <div>
                         <p className={`text-xs font-bold leading-tight mb-1 ${selectedVideo.videoId === vid.videoId ? 'text-white' : 'text-slate-300'}`}>
                           {vid.title}
                         </p>
                         <p className="text-[10px] text-slate-500 line-clamp-2">{vid.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const MixBusVisualizer = () => {
  const [view, setView] = useState('overview'); // overview, dca, group, mute

  // Farger
  const colorVox = "#e879f9"; // Pink
  const colorBand = "#38bdf8"; // Blue
  const colorFX = "#a855f7";   // Purple
  const colorDCA = "#facc15";  // Yellow
  const colorGrp = "#4ade80";  // Green

  // Hjelper for animert høyttaler (Mini-versjon av den store)
  const MiniSpeaker = ({ label, side }) => (
    <div className="relative flex flex-col items-center z-10">
       <div className={`w-16 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center gap-2 ${view === 'overview' || view === 'group' ? 'border-red-500/50 shadow-red-500/20' : ''}`}>
          <div className="w-4 h-4 bg-slate-900 rounded-full border border-slate-600"></div>
          <div className="relative w-12 h-12 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-center overflow-visible">
             <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-lg relative z-10"></div>
             {/* Puls effekt når lyden er på */}
             {(view === 'overview' || view === 'group') && (
                <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping"></div>
             )}
          </div>
       </div>
       <div className="w-16 h-1 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-800">
          <div className={`h-full bg-red-500 transition-all duration-300 ${view === 'overview' || view === 'group' ? 'w-3/4' : 'w-0'}`}></div>
       </div>
       <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{label}</span>
    </div>
  );

  const ConnectionLine = ({ active, type, startX, endX, startY, endY, color }) => {
    if (!active && view !== 'overview') return null;
    const isDCA = type === 'control';
    const opacity = active ? 1 : 0.1;
    const strokeWidth = active ? 3 : 1;
    const dash = isDCA ? "5,5" : "none";
    // Bezier kurve
    const path = `M ${startX} ${startY} C ${startX} ${startY + 60}, ${endX} ${endY - 60}, ${endX} ${endY}`;

    return (
      <path d={path} stroke={color} strokeWidth={strokeWidth} strokeDasharray={dash} fill="none" opacity={opacity} className={active ? (isDCA ? "animate-pulse" : "animate-signal-pulse") : ""} />
    );
  };

  const ChannelIcon = ({ label, icon: Icon, color, dimmed }) => (
    <div className={`flex flex-col items-center z-10 transition-all duration-300 ${dimmed ? 'opacity-20 grayscale' : 'opacity-100'}`}>
      <div className="w-10 h-10 rounded-lg border-2 bg-slate-900 flex items-center justify-center shadow-lg" style={{ borderColor: color }}>
        <Icon size={20} style={{ color: color }} />
      </div>
      <span className="text-[9px] font-bold mt-1 text-slate-300">{label}</span>
    </div>
  );

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-red-500/50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-red-400 font-bold text-sm flex items-center gap-2"><GitMerge size={16}/> Mix Bus & Routing</h3>
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
           <button onClick={() => setView('overview')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'overview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>Oversikt</button>
           <button onClick={() => setView('group')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'group' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-green-400'}`}>Audio Group</button>
           <button onClick={() => setView('dca')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'dca' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:text-yellow-400'}`}>DCA</button>
           <button onClick={() => setView('mute')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'mute' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-red-400'}`}>Mute</button>
        </div>
      </div>

      <div className="relative w-full h-96 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mb-4">
        {/* SVG LAYER */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
           {/* 1. INPUTS TO GROUPS (Audio) */}
           <ConnectionLine active={view === 'group' || view === 'overview'} type="audio" startX="15%" startY="60" endX="20%" endY="160" color={colorVox} />
           <ConnectionLine active={view === 'group' || view === 'overview'} type="audio" startX="30%" startY="60" endX="20%" endY="160" color={colorVox} />
           
           {/* Band -> Main (Direkte linjer til L og R) */}
           <ConnectionLine active={view === 'overview'} type="audio" startX="45%" startY="60" endX="40%" endY="280" color={colorBand} /> {/* Gtr -> L */}
           <ConnectionLine active={view === 'overview'} type="audio" startX="60%" startY="60" endX="60%" endY="280" color={colorBand} /> {/* Bass -> R/L */}
           <ConnectionLine active={view === 'overview'} type="audio" startX="75%" startY="60" endX="40%" endY="280" color={colorBand} /> {/* Drum -> L */}
           
           {/* FX -> Main */}
           <ConnectionLine active={view === 'overview'} type="audio" startX="90%" startY="60" endX="60%" endY="280" color={colorFX} />

           {/* 2. VOX GROUP TO MAIN */}
           <ConnectionLine active={view === 'group' || view === 'overview'} type="audio" startX="20%" startY="220" endX="40%" endY="280" color={colorGrp} />
           <ConnectionLine active={view === 'group' || view === 'overview'} type="audio" startX="20%" startY="220" endX="60%" endY="280" color={colorGrp} />

           {/* 3. DCA CONTROL */}
           <ConnectionLine active={view === 'dca'} type="control" startX="75%" startY="160" endX="45%" endY="60" color={colorDCA} />
           <ConnectionLine active={view === 'dca'} type="control" startX="75%" startY="160" endX="60%" endY="60" color={colorDCA} />
           <ConnectionLine active={view === 'dca'} type="control" startX="75%" startY="160" endX="75%" endY="60" color={colorDCA} />

           {/* 4. MUTE GROUP */}
           <ConnectionLine active={view === 'mute'} type="control" startX="50%" startY="160" endX="15%" endY="60" color="red" />
           <ConnectionLine active={view === 'mute'} type="control" startX="50%" startY="160" endX="30%" endY="60" color="red" />
           <ConnectionLine active={view === 'mute'} type="control" startX="50%" startY="160" endX="45%" endY="60" color="red" />
           <ConnectionLine active={view === 'mute'} type="control" startX="50%" startY="160" endX="60%" endY="60" color="red" />
           <ConnectionLine active={view === 'mute'} type="control" startX="50%" startY="160" endX="75%" endY="60" color="red" />
        </svg>

        {/* LEVEL 1: INPUTS */}
        <div className="absolute top-4 w-full flex justify-around px-4">
           <ChannelIcon label="Vox 1" icon={Mic2} color={colorVox} dimmed={view === 'dca'} />
           <ChannelIcon label="Vox 2" icon={Mic2} color={colorVox} dimmed={view === 'dca'} />
           <ChannelIcon label="Gitar" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="Bass" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="Trommer" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="FX Retur" icon={Sparkles} color={colorFX} dimmed={view === 'group' || view === 'dca'} />
        </div>

        {/* LEVEL 2: BUSSES / DCA / MUTE */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-around px-8">
           
           {/* VOX GROUP */}
           <div className={`relative flex flex-col items-center p-2 rounded-xl border-2 bg-slate-900 z-10 transition-all ${view === 'group' ? 'scale-110 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'border-slate-700 opacity-50'}`}>
              <Layers size={20} className="text-green-500 mb-1" />
              <span className="text-[9px] font-bold text-white">VOX GRP</span>
              {view === 'group' && <div className="absolute -right-12 top-0 bg-slate-800 text-[8px] p-1 rounded border border-slate-600 w-10 text-center">Glue Comp</div>}
           </div>

           {/* MUTE GROUP */}
           <div className={`flex flex-col items-center p-2 rounded-xl border-2 border-dashed bg-slate-900 z-10 transition-all ${view === 'mute' ? 'scale-110 border-red-500 bg-red-900/20' : 'border-slate-700 opacity-30'}`}>
              <Scissors size={20} className="text-red-500 mb-1" />
              <span className="text-[9px] font-bold text-white">MUTE BAND</span>
           </div>

           {/* BAND DCA */}
           <div className={`relative flex flex-col items-center p-2 rounded-xl border-2 border-dashed bg-slate-900 z-10 transition-all ${view === 'dca' ? 'scale-110 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-slate-700 opacity-50'}`}>
              <Sliders size={20} className="text-yellow-500 mb-1" />
              <span className="text-[9px] font-bold text-white">BAND DCA</span>
              {view === 'dca' && <div className="absolute -top-8 w-20 bg-yellow-900/80 text-yellow-200 text-[8px] p-1 rounded text-center">Fjernkontroll</div>}
           </div>
        </div>

        {/* LEVEL 3: MAIN LR SPEAKERS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-16 px-12">
           <MiniSpeaker label="MAIN L" side="left"/>
           <MiniSpeaker label="MAIN R" side="right"/>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-slate-800/50 p-3 rounded border border-slate-700 min-h-[80px] flex items-center gap-3">
         <div className="bg-slate-900 p-2 rounded-full">
            {view === 'group' && <Layers className="text-green-400" size={20}/>}
            {view === 'dca' && <Sliders className="text-yellow-400" size={20}/>}
            {view === 'mute' && <Scissors className="text-red-400" size={20}/>}
            {view === 'overview' && <GitMerge className="text-blue-400" size={20}/>}
         </div>
         <div className="text-xs text-slate-300 leading-relaxed">
            {view === 'overview' && "Oversikt: Instrumenter og Vokaler rutes enten via Grupper eller direkte til Main LR. DCA styrer nivåer uten å røre lyden."}
            {view === 'group' && "Audio Group: Samler lyd. Brukes ofte til å 'lime' sammen Trommer (Drum Bus) eller Vokal. Her kan du bruke kompressor på hele pakka!"}
            {view === 'dca' && "DCA: En fjernkontroll. Ingen lyd går gjennom her! Når du drar i DCA-en, justeres bare gainen på kanalene den styrer. Faderne beveger seg ikke fysisk."}
            {view === 'mute' && "Mute Group: Panikk-knapp. Kutter lyden på mange kanaler samtidig (f.eks. hele bandet når pastoren snakker)."}
         </div>
      </div>
    </div>
  );
};

const SignalFlowDiagram = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [subItem, setSubItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSubItem(null);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      <div className="flex-1 overflow-y-auto">
        <div className="bg-slate-900/50 md:bg-slate-900 rounded-2xl md:border border-slate-700 p-4 md:p-8 relative">
          <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-6 flex items-center gap-2 relative z-10">
            <Activity className="text-blue-400"/> Signalvei
          </h3>
          {/* Inne i SignalFlowDiagram */}
<           div className="block md:hidden pl-2 relative z-10">
              {signalPathData.map((node, idx) => (
              <SignalNodeMobile
              key={node.id}
              node={node}
              isFirst={idx === 0}
              isLast={idx === signalPathData.length - 1}
              onClick={handleNodeClick}
              isActive={selectedNode?.id === node.id}
              index={idx} // <--- LEGG TIL DENNE!
              />
             ))}
          </div>
          <div className="hidden md:block relative h-[500px] w-full">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
               {/* Static Base Line */}
               <path d="M110,140 L240,140 L390,140 L640,140 L940,140 L1140,140" stroke="#334155" strokeWidth="2" fill="none" />
               
               {/* Animated Pulse - Thick Glow Line */}
               <path 
                 d="M110,140 L1140,140" 
                 stroke="#06b6d4" 
                 strokeWidth="6" 
                 strokeOpacity="0.4"
                 fill="none" 
                 strokeLinecap="round"
                 className="animate-signal-pulse"
               />
                {/* Animated Pulse - Core Bright Line */}
               <path 
                 d="M110,140 L1140,140" 
                 stroke="#67e8f9" 
                 strokeWidth="2" 
                 fill="none" 
                 strokeLinecap="round"
                 className="animate-signal-pulse"
               />
               
               {/* Updated Tap line for Monitor Branch (Between Processing and Fader) */}
               <path d="M540,140 L540,180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" />
               
               <path d="M640,140 L640,180 L790,180" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" fill="none" />
               <path d="M850,220 L940,220 L940,160" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.5" />
            </svg>
            
            {signalPathData.map((node) => (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={`absolute cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 w-32 z-10 transition-all hover:scale-105 hover:shadow-xl
                  ${node.type === "branch_out" ? "bg-slate-900 border-dashed border-slate-600 mt-8" : "bg-slate-800 border-slate-700"}
                  ${selectedNode?.id === node.id ? 'border-blue-500 shadow-blue-500/20 ring-2 ring-blue-500/20' : ''}
                `}
                style={{ left: node.x, top: node.y }}
              >
                 <div className={`p-2 rounded-full ${selectedNode?.id === node.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                   <IconHelper name={node.iconName} size={20} />
                 </div>
                 <span className="text-xs font-bold text-center text-slate-200">{node.label}</span>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 p-4 bg-slate-800/80 rounded border border-slate-700 text-xs text-slate- 400">
               <div className="flex items-center gap-2 mb-1"><div className="w-4 h-0.5 bg-slate-500"></div><span>Hovedsignal (Main LR)</span></div>
               <div className="flex items-center gap-2 mb-1"><div className="w-4 h-0.5 bg-blue-500 border-t border-dashed"></div><span>Pre-Fade (Monitor)</span></div>
               <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-purple-500 border-t border-dashed"></div><span>Post-Fade (FX)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-[400px] bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl overflow-y-auto max-h-[calc(100vh-140px)]">
        {selectedNode ? 
           <DetailPanel node={selectedNode} subItem={subItem} setSubItem={setSubItem} />
        : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-50">
             <Activity size={64} className="mb-4" />
             <p>Klikk på en boks i signalveien for å se detaljer og verktøy.</p>
          </div>
        )}
      </div>

      {isMobile && selectedNode && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNode(null)}>
           <div className="bg-slate-900 w-full max-h-[85vh] h-[85vh] rounded-t-2xl p-6 overflow-y-auto border-t border-slate-700 shadow-2xl relative animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6 sticky top-0"></div>
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-500 p-2 bg-slate-800 rounded-full"><X size={20}/></button>
              <DetailPanel node={selectedNode} subItem={subItem} setSubItem={setSubItem} />
           </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGES ---

// --- NY SØKEKOMPONENT (FIX: Ingen zooming på mobil) ---
const VideoSearch = ({ videoData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const results = searchTerm === "" ? [] : Object.keys(videoData).flatMap(key => 
    videoData[key].videos
      .filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(v => ({ ...v, categoryName: videoData[key].title }))
  );

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-8 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-red-900/20 rounded-lg text-red-500 border border-red-500/20">
           <Film size={24}/>
        </div>
        <div className="flex-1">
           <h3 className="text-white font-bold text-lg">Videoarkiv</h3>
           <p className="text-slate-400 text-xs">Søk i {Object.values(videoData).reduce((acc, cat) => acc + cat.videos.length, 0)} opplæringsvideoer</p>
        </div>
      </div>

      {/* Søkefelt */}
      <div className="relative group mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-500 group-focus-within:text-blue-400 transition-colors"/>
        </div>
        <input
          type="text"
          placeholder="Hva leter du etter? (f.eks 'EQ', 'Gain', 'Dante')..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setSelectedVideo(null); }}
          // --- ENDRINGEN ER HER: text-base (16px) på mobil hindrer zoom, md:text-sm gjør den liten igjen på PC ---
          className="w-full bg-slate-950 border border-slate-700 text-white text-base md:text-sm rounded-xl block pl-10 p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
        />
        {searchTerm && (
          <button onClick={() => {setSearchTerm(""); setSelectedVideo(null);}} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Resultatvisning */}
      {searchTerm !== "" && (
        <div className="animate-fade-in bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
          {results.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {results.map((video) => (
                <div 
                  key={video.id} 
                  onClick={() => setSelectedVideo(video)}
                  className={`p-3 flex gap-4 hover:bg-slate-800 transition-colors cursor-pointer ${selectedVideo?.id === video.id ? 'bg-slate-800 border-l-4 border-red-500' : ''}`}
                >
                  <div className="relative w-32 aspect-video bg-black rounded overflow-hidden shrink-0 border border-slate-700">
                    <img src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-80" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                       <Play size={12} className="text-white fill-current"/>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-0.5 block">{video.categoryName}</span>
                    <h4 className="text-sm font-bold text-slate-200 truncate">{video.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{video.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">Ingen treff på "{searchTerm}"</div>
          )}
        </div>
      )}

      {/* Videospiller (Dukker opp når du velger et søkeresultat) */}
      {selectedVideo && (
        <div className="mt-4 animate-fade-in-up">
           <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black relative aspect-video">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&mute=0&rel=0`} 
                title="YouTube" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
              ></iframe>
           </div>
           <div className="bg-slate-800 p-3 rounded-b-xl border-x border-b border-slate-700 flex justify-between items-center">
              <span className="text-sm font-bold text-white pl-1">{selectedVideo.title}</span>
              <button onClick={() => setSelectedVideo(null)} className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors">Lukk</button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- VIDEO SECTION COMPONENT (Med Instant Play Fix) ---
const VideoSection = () => {
  const [activeCategory, setActiveCategory] = useState("dlive_course");
  const [playingVideo, setPlayingVideo] = useState(null);

  const categoryKeys = Object.keys(videoData);
  const safeCategory = categoryKeys.includes(activeCategory) ? activeCategory : categoryKeys[0];
  const categoryData = videoData[safeCategory];

  if (!categoryData) return <div className="p-8 text-center text-slate-500">Ingen videodata funnet.</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
      
      {/* HER LIGGER SØKEVERKTØYET ØVERST */}
      <VideoSearch videoData={videoData} />

      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {Object.entries(videoData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => {
                setActiveCategory(key);
                setPlayingVideo(null); 
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border
            ${safeCategory === key ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
          >
            {data.title}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-1">{categoryData.title}</h2>
        <p className="text-sm text-slate-400 mb-6">{categoryData.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryData.videos.map((video) => (
            <div key={video.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col hover:border-slate-500 transition-colors shadow-lg">
              
              {/* VIDEO PLAYER */}
              {playingVideo === video.id ? (
                <div className="aspect-video bg-black relative">
                   <iframe 
                      className="absolute inset-0 w-full h-full"
                      // ENDRING HER: Lagt til &mute=1 for å tvinge start på mobil
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&origin=${window.location.origin}`} 
                      title={video.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                   ></iframe>
                </div>
              ) : (
                <div 
                  onClick={() => setPlayingVideo(video.id)}
                  className="aspect-video bg-black relative flex items-center justify-center group cursor-pointer"
                >
                  <img 
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} 
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  />
                  <div className="w-12 h-12 bg-blue-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform z-10">
                     <Play size={20} className="text-white ml-1 fill-current"/>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1">
                <h3 className="font-bold text-white mb-1 text-sm">{video.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{video.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ changePage }) => (
  <div className="max-w-4xl mx-auto text-center pt-6 md:pt-10 pb-20">
    <div className="inline-block p-4 rounded-full bg-blue-900/30 text-blue-400 mb-6 border border-blue-500/20">
       <Volume2 size={40} />
    </div>
    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
      Lydteknikk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Portal</span>
    </h1>
    <p className="text-sm md:text-lg text-slate-400 mb-8 max-w-xl mx-auto px-4">
      DLive C3500 guide rett i lomma. Lær signalveien, se videoer og sjekk innstillinger før du går på scenen.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left px-2">
      <div onClick={() => changePage('signal')} className="p-5 bg-slate-800 rounded-xl border border-slate-700 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer hover:border-blue-500">
         <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400"><Activity size={24}/></div>
         <div>
           <h3 className="font-bold text-white">Signalvei</h3>
           <p className="text-xs text-slate-400">Interaktiv flyt med grafer</p>
         </div>
         <ChevronRight className="ml-auto text-slate-600"/>
      </div>
      <div onClick={() => changePage('videos')} className="p-5 bg-slate-800 rounded-xl border border-slate-700 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer hover:border-teal-500">
         <div className="p-3 bg-teal-900/20 rounded-lg text-teal-400"><Play size={24}/></div>
         <div>
           <h3 className="font-bold text-white">Videoer</h3>
           <p className="text-xs text-slate-400">Opplæring & Guider</p>
         </div>
         <ChevronRight className="ml-auto text-slate-600"/>
      </div>
    </div>
  </div>
);

// --- APP SHELL ---

const App = () => {
  const [page, setPage] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200 selection:bg-blue-500/30">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-up { animation: slideUp 0.2s ease-out; }
        
        /* Signal Pulse Animation */
        @keyframes signalFlow {
          0% { stroke-dasharray: 200, 2000; stroke-dashoffset: 1200; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dasharray: 200, 2000; stroke-dashoffset: -200; opacity: 0; }
        }
        .animate-signal-pulse {
          animation: signalFlow 2s linear infinite;
        }

        /* Mobile Vertical Pulse - Comet Effect - CORRECT DIRECTION (DOWN) */
          @keyframes signalPulseVertical {
          /* Før: Startet på -150% (oppe). Nå: Starter på 250% (nede) */
          0% { background-position: 0% 250%; }
          
          /* Før: Sluttet på 250% (nede). Nå: Slutter på -150% (oppe) */
          100% { background-position: 0% -150%; }
        }
        .animate-signal-pulse-vertical {
        @keyframes shootRight {
          0% { left: -100%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        
        .animate-shoot-right {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* Bruker en gradient som fader ut i begge ender */
          background: linear-gradient(to right, transparent, currentColor, transparent); 
          animation: shootRight 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
          background: linear-gradient(to bottom, transparent 0%, rgba(6,182,212,0) 20%, #22d3ee 50%, rgba(6,182,212,0) 80%, transparent 100%);
          background-size: 100% 300%;
          animation: signalPulseVertical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>

      {/* TOP BAR */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 h-16 flex items-center justify-between px-4 md:px-8">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded flex items-center justify-center">
               <Volume2 className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">LydTeam Pro</span>
         </div>
         {!isMobile && (
           <div className="flex gap-2">
             <NavButton active={page === 'home'} onClick={() => setPage('home')} Icon={Home} text="Hjem" isMobile={false}/>
             <NavButton active={page === 'signal'} onClick={() => setPage('signal')} Icon={Activity} text="Signalvei" isMobile={false}/>
             <NavButton active={page === 'videos'} onClick={() => setPage('videos')} Icon={Play} text="Videoer" isMobile={false}/>
           </div>
         )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-6">
        {page === 'home' && <HomePage changePage={setPage} />}
        {page === 'signal' && <SignalFlowDiagram />}
        {page === 'videos' && <VideoSection />}
      </main>

      {/* BOTTOM NAV (Mobile Only) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex justify-around p-2 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
           <NavButton active={page === 'home'} onClick={() => setPage('home')} Icon={Home} text="Hjem" isMobile={true}/>
           <NavButton active={page === 'signal'} onClick={() => setPage('signal')} Icon={Activity} text="Signal" isMobile={true}/>
           <NavButton active={page === 'videos'} onClick={() => setPage('videos')} Icon={Play} text="Videoer" isMobile={true}/>
        </div>
      )}
    </div>
  );
};

export default App;