import * as React from 'react';
const { useState, useEffect, useRef } = React;
import {
  Mic2, Sliders, Play, Info, Home,
  Activity, Volume2, Settings,
  Speaker, Radio, ChevronRight, ArrowLeft, Layers,
  X, Music, Sparkles, BarChart2, Zap, CornerDownRight, Check, Download, AlertTriangle, Clock, List, Star, HelpCircle, Lightbulb, MoveVertical, Copy, Scissors, Disc, GitMerge
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
  "dlive": {
    title: "DLive C3500 Funksjoner",
    description: "Spesifikke guider for mikseren vår.",
    videos: [
      { id: 1, title: "Grunnleggende oversikt C3500", videoId: "YOUTUBE_ID_HER", desc: "Start her for å forstå overflaten." },
      { id: 2, title: "Routing og I/O", videoId: "YOUTUBE_ID_HER", desc: "Hvordan patche innganger og utganger." },
      { id: 3, title: "Bruk av effekter (FX)", videoId: "YOUTUBE_ID_HER", desc: "Klang, delay og insert-effekter." }
    ]
  },
  "basic": {
    title: "Generell Lydforståelse",
    description: "Lydteori, EQ, kompresjon og gain-struktur.",
    videos: [
      { id: 4, title: "Hva er Gain?", videoId: "YOUTUBE_ID_HER", desc: "Forskjellen på gain og volum." },
      { id: 5, title: "EQ Teknikker", videoId: "YOUTUBE_ID_HER", desc: "Hvordan rydde plass i miksen." },
      { id: 6, title: "Kompresjon forklart", videoId: "YOUTUBE_ID_HER", desc: "Kontrollere dynamikk." }
    ]
  },
  "examples": {
    title: "Kirke-eksempler & Oppsett",
    description: "Inspirasjon og 'best practice' fra andre kirker.",
    videos: [
      { id: 7, title: "Fullt band oppsett", videoId: "YOUTUBE_ID_HER", desc: "Gjennomgang av en søndagsmiks." },
      { id: 8, title: "Tale og Vokal", videoId: "YOUTUBE_ID_HER", desc: "Få tydelig tale i store rom." }
    ]
  }
};

const signalPathData = [
  {
    id: "input",
    label: "XLR / Stagebox",
    iconName: "Mic2",
    x: 50, y: 100,
    desc: "Startpunktet: Fysisk inngang.",
    details: "Signalet starter i de analoge stageboksene på scenen. Derfra går det via multikabler (analog slange) bort til FOH, hvor det treffer vår CDM64 MixRack (hjernen i systemet). Pass på at du plugger i riktig nummer!",
    deepDiveTitle: "Hardware Oppsett",
    deepDive: [
      { name: "Stagebokser", tag: "Scene", info: "Analoge bokser på scenen der mikrofonene plugges inn." },
      { name: "Multikabel", tag: "Transport", info: "Frakter signalet analogt fra scenen til mikseren på FOH." },
      { name: "CDM64", tag: "FOH Rack", info: "Selve mikser-hjernen som tar imot alle linjene." }
    ]
  },
  {
    id: "preamp",
    label: "Preamp / Gain",
    iconName: "Activity",
    x: 200, y: 100,
    desc: "Forsterkning av signalet.",
    details: "Gain er det aller viktigste steget. Det bestemmer signalstyrken inn i mikseren. For lite gain gir støy, for mye gir vreng. Riktig gain lar deg mikse med faderen rundt 0dB (Unity) hvor oppløsningen er best.",
    viz: "gain_structure",
    deepDiveTitle: "Preamp Innstillinger",
    deepDive: [
      { name: "48V Phantom", tag: "Strøm", info: "Må være PÅ for kondensatormikrofoner og aktive DI-bokser." },
      { name: "Pad", tag: "Demping", info: "-20dB demping. Brukes hvis signalet er for sterkt selv med gain på minimum (f.eks. Kick, Snare)." },
      { name: "Tube Stage", tag: "Karakter", info: "En alternativ preamp-modell i dLive som legger til harmonisk vreng (varme). Fin på bass og vokal.", usage: "Vokal, Bass" },
      { name: "Unity Gain", tag: "Mål", info: "Juster Gain til meteret treffer rundt -18dBFS (gult) når artisten spiller høyt." }
    ]
  },
  {
    id: "processing",
    label: "Processing Strip",
    iconName: "Settings",
    x: 350, y: 100,
    desc: "HPF, Gate, EQ, Kompressor.",
    details: "Kjernen i lydbehandlingen. Trykk under for detaljer.",
    subChain: [
      { label: "Filters (HPF / LPF)", desc: "Rens opp i toppen og bunnen av lyden.", viz: "hpf" },
      { label: "Gate", desc: "Fjerner bakgrunnsstøy", viz: "gate" },
      { label: "Insert A", desc: "Dyn8, MBC, Hypabass...", viz: "inserts" },
      { label: "PEQ", desc: "4-bånds Equalizer", viz: "peq" },
      { label: "Compressor", desc: "Dynamikk kontroll", viz: "comp", 
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
    details: "Lyden tappes her (vanligvis etter EQ/Comp) for å sendes til monitorer. Fader-bevegelser påvirker IKKE monitorlyden."
  },
  {
    id: "fader",
    label: "Fader & Mute",
    iconName: "Sliders",
    x: 600, y: 100,
    desc: "Volum, Pan, Solo & Patching.",
    details: "Dette er kontrollsenteret for kanalen. Her setter du sluttvolum, plassering i stereo-bildet, og styrer lytting (PAFL).",
    viz: "fader_section",
    deepDiveTitle: "Fader & Kanal Funksjoner",
    deepDive: [
      { name: "Fader", tag: "Volum", info: "Logaritmisk volumkontroll. Best oppløsning rundt 0dB." },
      { name: "Pan", tag: "Stereo", info: "Plasserer lyden mot venstre eller høyre høyttaler." },
      { name: "PAFL", tag: "Lytting", info: "Pre/After Fade Listen. Sender lyden til dine hodetelefoner/monitor." }
    ]
  },
  {
    id: "fx_branch",
    label: "FX Send (Klang)",
    iconName: "Sparkles",
    type: "branch_out",
    source: "fader",
    x: 750, y: 180,
    desc: "Lyd til klangboks (Post-Fader).",
    details: "Sendes ETTER faderen. Drar du ned faderen, forsvinner også klangen.",
    viz: "fx_info",
    deepDiveTitle: "Effekt Typer",
    deepDive: [
      { name: "Vokal Reverb (EMT250 / Hall)", tag: "Plate/Hall", info: "Plate: 1.2s - 1.8s decay. Pre-delay 30ms (skiller klang fra vokal). High-cut på 8kHz for å unngå sss-støy i klangen.", usage: "Hovedvokal." },
      { name: "Tromme Reverb", tag: "Room/NonLin", info: "Kort tid (0.5s - 1.0s). Gjør at trommene høres større ut uten å grøte til miksen. Gated reverb på skarptromme for 80s effekt.", usage: "Skarptromme, Toms." },
      { name: "Delay (Stereo Tap)", tag: "Echo", info: "Bruk Tap Tempo til å matche låta. Feedback rundt 20-30%. Legg gjerne litt klang PÅ delayen igjen.", usage: "Ballader, Solo." }
    ]
  },
  {
    id: "mixbus",
    label: "Mix Bus / Main LR",
    iconName: "Layers",
    x: 900, y: 100,
    desc: "Summen av alle kanaler.",
    details: "Her møtes alle instrumenter, vokal og FX-returer. Dette er 'master-faderen' din."
  },
  {
    id: "matrix",
    label: "Matrix / Zoner", // Endret navn
    iconName: "Radio",
    x: 1050, y: 100,       // Justerte X litt for plass
    viz: "matrix",         // KOBLING TIL VISUALIZER
    desc: "Fordeling til rom.",
    details: "Main LR sendes inn her, og splittes ut til PA, Foajé, Streaming osv. Her kan du gjøre egne justeringer for hvert rom."
  },
  {
    id: "speakers",        // NY BLOKK
    label: "PA / Høyttalere",
    iconName: "Speaker",
    x: 1200, y: 100,
    viz: "pa",             // KOBLING TIL VISUALIZER
    desc: "Siste stopp!",
    details: "Det elektriske signalet gjøres om til fysiske lydbølger som treffer ørene til publikum."
  }
];

// --- HELPER COMPONENTS ---

const IconHelper = ({ name, size = 24, className }) => {
  const icons = {
    Mic2, Sliders, Play, Info, Home, Activity, Volume2, Settings,
    Speaker, Radio, Download, ChevronRight, ArrowLeft, Layers,
    X, Music, Sparkles, BarChart2, Zap, CornerDownRight, Check, AlertTriangle, Clock, List, Star, HelpCircle, Lightbulb, MoveVertical, Copy, Scissors, Disc, GitMerge
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

const FaderSectionVisualizer = () => {
  const [activeTab, setActiveTab] = useState('mixer');
  const [faderPos, setFaderPos] = useState(75); 
  const [panVal, setPanVal] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPafl, setIsPafl] = useState(false);

  const getPanText = (val) => {
    if (val === 50) return "C (Center)";
    if (val < 50) return `L${50 - val}`;
    return `R${val - 50}`;
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
          <div className="flex gap-6 items-end justify-center h-64 animate-fade-in relative z-10">
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
                  <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <line x1="50" y1="50" x2="50" y2="10" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" 
                        transform={`rotate(${(panVal - 50) * 2.7} 50 50)`} />
                  <text x="10" y="90" fill="#64748b" fontSize="20" fontWeight="bold">L</text>
                  <text x="80" y="90" fill="#64748b" fontSize="20" fontWeight="bold">R</text>
                </svg>
                <input 
                  type="range" min="0" max="100" value={panVal} 
                  onChange={(e) => setPanVal(parseInt(e.target.value))}
                  className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] opacity-0 cursor-pointer z-50"
                  style={{ touchAction: 'none' }}
                  title="Pan"
                />
              </div>
              <div className="text-xs font-mono text-blue-300 bg-slate-800 px-2 py-1 rounded">{getPanText(panVal)}</div>
            </div>

            <div className="flex flex-col items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 h-full">
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className={`w-12 h-8 rounded font-bold text-[10px] transition-all shadow-lg z-20 relative
                   ${isMuted ? 'bg-red-600 text-white shadow-red-900/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
               >
                 MUTE
               </button>

               <button 
                 onClick={() => setIsPafl(!isPafl)}
                 className={`w-12 h-8 rounded font-bold text-[10px] transition-all shadow-lg z-20 relative
                   ${isPafl ? 'bg-yellow-500 text-black shadow-yellow-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
               >
                 PAFL
               </button>

               <div className="relative w-12 flex-1 bg-slate-900 rounded border border-slate-800 flex justify-center">
                  <div className="absolute top-[25%] w-full h-0.5 bg-white/30"></div>
                  <div 
                     className="absolute w-8 h-12 bg-gradient-to-b from-slate-600 to-slate-800 rounded shadow border-t border-slate-500 pointer-events-none z-10 flex items-center justify-center"
                     style={{ bottom: `${faderPos}%`, marginBottom: '-24px' }}
                  >
                    <div className="w-6 h-[1px] bg-black/50"></div>
                  </div>
                  
                  <input 
                    type="range" min="0" max="100" value={faderPos} 
                    onChange={(e) => setFaderPos(parseInt(e.target.value))}
                    className="absolute -inset-x-8 -inset-y-4 w-[calc(100%+4rem)] h-[calc(100%+2rem)] opacity-0 cursor-ns-resize z-50"
                    style={{appearance: 'slider-vertical', touchAction: 'none'}} 
                  />
               </div>
               
               <div className="text-[10px] font-mono text-slate-400">{getDb(faderPos)} dB</div>
            </div>
          </div>
        );
      case 'pafl':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300">
            <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded-lg">
               <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><Speaker size={14}/> PAFL (Pre/After Fade Listen)</h4>
               <p className="mb-2">
                 Dette er "lytte-knappen" på dLive. Når du trykker på den, sendes signalet til dine hodetelefoner (og monitor-høyttaleren ved mikseren).
               </p>
               <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-slate-800 p-2 rounded">
                     <div className="font-bold text-white mb-1">PFL (Pre-Fade)</div>
                     <p className="text-slate-400 text-[10px]">
                        Du hører signalet <strong>før</strong> faderen.
                        <br/>• Volumfaderen påvirker ikke det du hører.
                        <br/>• Bra for å sjekke om det er lyd i kabelen (Line Check).
                     </p>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                     <div className="font-bold text-white mb-1">AFL (After-Fade)</div>
                     <p className="text-slate-400 text-[10px]">
                        Du hører signalet <strong>etter</strong> faderen og pan.
                        <br/>• Du hører "miksen" slik den er i rommet.
                        <br/>• Bra for å sjekke balanse i stereo.
                     </p>
                  </div>
               </div>
               <p className="mt-2 text-[10px] italic text-slate-500">
                 Tips: dLive kan stilles inn til å velge PFL eller AFL automatisk.
               </p>
            </div>
          </div>
        );
      case 'copy':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300">
             <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Copy size={14}/> Copy / Paste Workflow</h4>
                <p className="mb-3">På dLive er det superraskt å kopiere innstillinger. Du bruker de fysiske blå knappene under skjermen.</p>
                
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="bg-slate-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-white border border-slate-600">1</div>
                      <div>Hold inne den fysiske <span className="text-blue-400 font-bold">COPY</span> knappen.</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="bg-slate-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-white border border-slate-600">2</div>
                      <div>Trykk på den blå <span className="text-cyan-400 font-bold">SEL</span> (Select) knappen på kanalen du vil kopiere FRA.</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="bg-slate-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-white border border-slate-600">3</div>
                      <div>Hold inne <span className="text-green-400 font-bold">PASTE</span> knappen.</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="bg-slate-800 w-6 h-6 flex items-center justify-center rounded-full font-bold text-white border border-slate-600">4</div>
                      <div>Trykk på <span className="text-cyan-400 font-bold">SEL</span> knappen på kanalen(e) du vil lime inn PÅ.</div>
                   </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-500/20">
                   <h5 className="font-bold text-white mb-1 flex items-center gap-2"><Scissors size={12}/> Kopiere kun EQ?</h5>
                   <p>
                     Gå inn på EQ-visningen på skjermen. Hold inne <strong>COPY</strong> og trykk på EQ-boksen på touch-skjermen. 
                     Gå til ny kanal, hold <strong>PASTE</strong> og trykk på EQ-boksen. Magisk!
                   </p>
                </div>
             </div>
          </div>
        );
      case 'patch':
        return (
          <div className="space-y-4 animate-fade-in text-xs text-slate-300">
            <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
               <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2"><GitMerge size={14}/> Input vs Channel & Patching</h4>
               <p className="mb-4">
                 Det er viktig å skille mellom den fysiske inngangen og den digitale kanalen.
               </p>

               <div className="flex justify-between items-center gap-2 mb-4 text-center">
                  <div className="bg-slate-800 p-2 rounded border border-slate-700 w-1/3">
                     <div className="text-slate-500 text-[9px] uppercase font-bold mb-1">FYSISK</div>
                     <div className="text-white font-bold flex flex-col items-center">
                        <Disc size={20} className="mb-1 text-gray-400"/>
                        Socket
                     </div>
                     <div className="text-[9px] text-slate-400 mt-1">Hullet i stageboksen</div>
                  </div>

                  <ArrowLeft className="text-purple-500 rotate-180" size={24}/>

                  <div className="bg-slate-800 p-2 rounded border border-slate-700 w-1/3">
                     <div className="text-slate-500 text-[9px] uppercase font-bold mb-1">DIGITAL</div>
                     <div className="text-white font-bold flex flex-col items-center">
                        <Sliders size={20} className="mb-1 text-blue-400"/>
                        Channel
                     </div>
                     <div className="text-[9px] text-slate-400 mt-1">Faderen du mikser på</div>
                  </div>
               </div>

               <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <h5 className="font-bold text-purple-300 mb-1">Hva er Patching?</h5>
                  <p className="leading-relaxed">
                    Patching er den "virtuelle kabelen" som kobler en <strong>Socket</strong> til en <strong>Channel</strong>. 
                    <br/><br/>
                    På dLive kan du patche én Socket (f.eks. Kick Mic) til <em>flere</em> kanaler samtidig (f.eks. "Kick Main" og "Kick Monitor"). 
                    Dette kalles "Split".
                  </p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-600/50 animate-fade-in">
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {[
          {id:'mixer', l:'Miks & Pan', i: Sliders}, 
          {id:'pafl', l:'PAFL/Lytte', i: Speaker}, 
          {id:'copy', l:'Copy/Paste', i: Copy}, 
          {id:'patch', l:'Inputs', i: GitMerge}
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
  const [faderPos, setFaderPos] = useState(75); // 0-100, 75 is roughly 0dB
  const [gainLevel, setGainLevel] = useState(30); // 0-100
  const [meterValue, setMeterValue] = useState(0);

  // Simulate signal meter based on gain
  useEffect(() => {
    const interval = setInterval(() => {
      // Base signal + some randomness
      const noise = Math.random() * 10;
      const signal = (gainLevel * 1.2) + noise - 20; 
      // Clamp between 0 and 100
      setMeterValue(Math.max(0, Math.min(100, signal)));
    }, 100);
    return () => clearInterval(interval);
  }, [gainLevel]);

  // Simulate LOGARITHMIC fader taper
  const getDb = (pos) => {
    if (pos >= 75) return ((pos - 75) / 25) * 10; 
    if (pos >= 50) return ((pos - 75) / 25) * 10; 
    if (pos >= 25) return -10 + ((pos - 50) / 25) * 20;
    return -30 + ((pos - 25) / 25) * 60; 
  };

  const db = Math.round(getDb(faderPos));
  
  // Calculate "Resolution" 
  const getResolution = (pos) => {
     const step = 5; 
     const db1 = getDb(Math.min(100, pos + step/2));
     const db2 = getDb(Math.max(0, pos - step/2));
     return Math.abs(db1 - db2).toFixed(1);
  };

  const resolution = parseFloat(getResolution(faderPos));
  const isUnity = Math.abs(db) < 2;

  // FIX: Define isGoodGain based on knob position (stable) not meter (bouncing)
  const isGoodGain = gainLevel >= 40 && gainLevel <= 75; 
  
  const getTip = () => {
    if (gainLevel > 75) return { t: "FARE: CLIPPING!", d: "Rødt lys betyr vreng. Skru ned Gain! Vurder å bruke PAD (-20dB) hvis signalet er for sterkt selv på lav gain.", c: "text-red-400" };
    if (gainLevel < 20) return { t: "For lavt signal", d: "Du har for lite gain. Dette gir støy (hiss) hvis du må skru faderen langt opp senere.", c: "text-slate-400" };
    
    // Gain is in acceptable range (Yellow zone approx)
    // Check fader relation
    if (db < -15) return { t: "God Gain, men lav Fader?", d: "Gain er perfekt, men faderen må være lavt? Ikke rør Gain! Bruk heller 'Digital Trim' i processing-stripen for å dempe signalet digitalt, slik at faderen kan komme opp til 0dB.", c: "text-orange-300" };
    if (db > 5) return { t: "Høy Fader?", d: "Gain er bra, men du presser faderen over 0dB? Sjekk om instrumentet kan skrus opp på kilden.", c: "text-orange-300" };
    if (isUnity) return { t: "PERFEKT STRUKTUR!", d: "Gain treffer gult felt, og faderen ligger på Unity (0dB). Dette gir best lyd og oppløsning.", c: "text-green-400" };
    
    return { t: "Bra Gain", d: "Juster faderen til ønsket volum. Prøv å sikte mot 0dB.", c: "text-yellow-400" };
  };

  const tip = getTip();
  const barHeight = Math.min(100, resolution * 8); 

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/50 animate-fade-in space-y-6">
      <h3 className="text-blue-400 font-bold text-sm flex items-center gap-2"><Sliders size={16}/> Gain Struktur Simulator</h3>
      
      <div className="flex justify-between gap-4 md:gap-8">
        
        {/* SECTION 1: GAIN KNOB & METER */}
        <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-3">1. Input Gain</h4>
            <div className="flex gap-6 items-center h-full">
                {/* Knob */}
                <div className="relative w-20 h-20"> {/* Increased size for touch target */}
                    <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
                        <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                        <line x1="50" y1="50" x2="50" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round" 
                              transform={`rotate(${(gainLevel * 2.7) - 135} 50 50)`} />
                    </svg>
                    {/* LARGE TOUCH TARGET FOR GAIN */}
                    <input 
                        type="range" min="0" max="100" value={gainLevel} 
                        onChange={(e) => setGainLevel(parseInt(e.target.value))}
                        className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] opacity-0 cursor-pointer z-50"
                        style={{ touchAction: 'none' }} // Prevent scrolling while dragging
                        title="Juster Gain"
                    />
                </div>
                
                {/* LED Meter */}
                <div className="w-4 h-32 bg-slate-900 rounded-full border border-slate-800 flex flex-col-reverse overflow-hidden p-0.5 gap-0.5">
                   {[...Array(20)].map((_, i) => {
                      const level = (i / 20) * 100;
                      const active = meterValue > level;
                      // Color logic for individual segments
                      let segColor = 'bg-green-600';
                      if (i > 13) segColor = 'bg-yellow-500'; // Yellow starts at ~70%
                      if (i > 17) segColor = 'bg-red-500';    // Red starts at ~90%
                      
                      return (
                          <div key={i} className={`flex-1 w-full rounded-[1px] transition-all duration-75 ${active ? segColor : 'bg-slate-800 opacity-20'}`}></div>
                      );
                   })}
                </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 text-center">
               Mål: <span className="text-yellow-400 font-bold">GULT</span>
               {gainLevel > 75 && <div className="text-red-500 font-bold animate-pulse">CLIP!</div>}
            </div>
        </div>

        {/* SECTION 2: FADER */}
        <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center relative">
           <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-3">2. Fader (Unity)</h4>
           <div className="relative w-16 h-32 bg-slate-900 rounded border border-slate-700 flex justify-center"> {/* Wider container */}
               <div className="absolute top-[25%] w-full h-0.5 bg-white/30 z-0"></div> {/* Unity Mark */}
               <div className="absolute right-1 top-[25%] text-[8px] text-white/50 translate-x-0">0</div>
               
               {/* Fader Cap */}
               <div 
                   className="absolute w-12 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded shadow border-t border-slate-500 pointer-events-none z-10 flex items-center justify-center"
                   style={{ bottom: `${faderPos}%`, marginBottom: '-16px' }}
               >
                 <div className="w-10 h-[1px] bg-black/50"></div>
               </div>
               
               {/* LARGE TOUCH TARGET FOR FADER */}
               <input 
                 type="range" min="0" max="100" value={faderPos} 
                 onChange={(e) => setFaderPos(parseInt(e.target.value))}
                 className="absolute -inset-x-8 -inset-y-4 w-[calc(100%+4rem)] h-[calc(100%+2rem)] opacity-0 cursor-ns-resize z-50"
                 style={{appearance: 'slider-vertical', touchAction: 'none'}} 
               />
           </div>
           
           <div className="mt-2 text-center">
              <div className={`text-sm font-bold font-mono ${isUnity ? 'text-green-400' : 'text-slate-400'}`}>
                 {db > 0 ? `+${db}` : db} dB
              </div>
           </div>
        </div>
      </div>

      {/* INFO / TIPS BOX */}
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
         
         {/* Resolution Warning Bar */}
         {resolution > 5 && (
            <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center gap-2">
                <AlertTriangle size={12} className="text-red-400"/>
                <span className="text-[10px] text-red-300">
                   <strong>Dårlig fader-oppløsning:</strong> {resolution} dB pr/cm.
                </span>
            </div>
         )}
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

const SignalNodeMobile = ({ node, isFirst, isLast, onClick, isActive }) => {
  const isBranch = node.type === "branch_out";
  return (
    <div className="flex gap-4 relative pb-6"> {/* Use padding instead of margin to allow continuous line */}
      {/* The Rail Column */}
      <div className="relative flex flex-col items-center w-12 flex-shrink-0"> {/* Increased width slightly for spacing */}
        
        {/* The Continuous Line */}
        <div 
           className="absolute w-0.5 bg-slate-800"
           style={{
             top: isFirst ? '1.5rem' : '0', 
             bottom: '0', 
             // For the last item, we only want the line to go to the circle, not past it.
             // However, to fix "split", usually we want it to go all the way if it's NOT last.
             // If it IS last, we cap height.
             height: isLast ? '1rem' : 'auto',
             left: '50%',
             marginLeft: '-1px' // Center the 2px line
           }}
         >
           {/* The Animated Pulse - Only shows if not branch */}
           <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-70 animate-signal-pulse-vertical"></div>
         </div>

        {/* Branch Dotted Line Logic - VISUAL ONLY, main line continues underneath */}
        {isBranch && (
           <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -ml-[1px] bg-slate-700/0 border-l-2 border-dotted border-slate-600 z-10 pointer-events-none"></div>
        )}

        {/* The Node Circle */}
        <div className={`
          relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all my-0
          ${isActive ? 'bg-blue-600 border-blue-400 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
            isBranch ? 'bg-slate-800 border-slate-600 text-slate-500' : 'bg-slate-800 border-slate-600 text-slate-300'}
        `}>
          <IconHelper name={node.iconName} size={isBranch ? 14 : 16} />
        </div>
      </div>

      {/* The Card */}
      <div className="flex-1"> 
        <div 
          onClick={() => onClick(node)}
          className={`p-4 rounded-xl border transition-all active:scale-[0.98] cursor-pointer relative
            ${isActive ? 'bg-blue-900/20 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-800 border-slate-700'}
            ${isBranch ? 'ml-2 border-dashed bg-slate-800/50' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className={`font-bold text-sm ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>{node.label}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.desc}</p>
            </div>
            {isBranch && <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wider">Aux</span>}
            {!isBranch && <ChevronRight size={16} className={`text-slate-600 ${isActive ? 'text-blue-400' : ''}`}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailPanel = ({ node, subItem, setSubItem }) => {
  if (!node) return null;

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
        <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
          <IconHelper name={node.iconName} size={28} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{node.label}</h2>
          <p className="text-xs text-blue-300 uppercase tracking-wide">Info & Verktøy</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">{node.details}</p>
        </div>
        {node.viz === "fx_info" && (
            <FXInfoVisualizer deepDive={node.deepDive} />
        )}
        {node.viz === "gain_structure" && (
            <GainStructureVisualizer />
        )}
        {node.viz === "fader_section" && (
            <FaderSectionVisualizer />
        )}

        {node.subChain && !subItem && (
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Layers size={14}/> Velg for å se graf/info:
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

        {node.viz === "fx_info" && (
            <FXInfoVisualizer deepDive={node.deepDive} />
        )}
        {node.viz === "gain_structure" && (
            <GainStructureVisualizer />
        )}
        {node.viz === "fader_section" && (
            <FaderSectionVisualizer />
        )}
        
        {/* --- LEGG TIL DISSE TO LINJENE: --- */}
        {node.viz === "matrix" && <MatrixVisualizer />}
        {node.viz === "pa" && <PAVisualizer />}

        {subItem && (
          <div className="mt-4 bg-slate-950 border border-blue-500/30 rounded-xl p-4 animate-fade-in-up shadow-2xl">
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
            {!subItem.viz && !subItem.interactive && (
              <p className="text-sm text-slate-300 mb-4">{subItem.desc}</p>
            )}

            {/* Interactive list for things like Insert A that contain Dyn8 */}
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
            {/* Parameter list for non-interactive items */}
            {subItem.deepDive && !subItem.deepDive.some(d => d.interactive) && !subItem.interactive && (
              <div className="space-y-2 mt-4">
                 {subItem.deepDive.map((d, i) => (
                   <div key={i} className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
                     <div>
                       <span className="font-bold text-xs text-slate-200 block">{d.name}</span>
                       <span className="text-[10px] text-slate-500">{d.info}</span>
                     </div>
                     {d.tag && <span className="text-[9px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">{d.tag}</span>}
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {/* Deep Dive Info - Ensure it shows even if viz is present, unless it's fx_info which handles its own */}
        {node.deepDive && !node.subChain && node.viz !== "fx_info" && (
          <div className="grid grid-cols-1 gap-2 mt-6 border-t border-slate-700/50 pt-4">
            <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Info size={16} className="text-blue-400"/>
                {node.deepDiveTitle || "Detaljer"}
            </h4> 
            {node.deepDive.map((item, i) => (
              <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{item.tag}</span>
                </div>
                <p className="text-xs text-slate-400">{item.info}</p>
                {item.usage && <p className="text-xs text-green-400 mt-1 italic">Bruk: {item.usage}</p>}
              </div>
            ))}
          </div>
        )}
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
          <div className="block md:hidden pl-2 relative z-10">
            {signalPathData.map((node, idx) => (
              <SignalNodeMobile
                key={node.id}
                node={node}
                isFirst={idx === 0}
                isLast={idx === signalPathData.length - 1}
                onClick={handleNodeClick}
                isActive={selectedNode?.id === node.id}
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

const VideoSection = () => {
  const [activeCategory, setActiveCategory] = useState("dlive");
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {Object.entries(videoData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors
            ${activeCategory === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
          >
            {data.title}
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">{videoData[activeCategory].title}</h2>
        <p className="text-sm text-slate-400 mb-6">{videoData[activeCategory].description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoData[activeCategory].videos.map((video) => (
            <div key={video.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
              <div className="aspect-video bg-black relative flex items-center justify-center group">
                <Play size={40} className="text-slate-600 group-hover:text-blue-500 transition-colors"/>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-white mb-1 text-sm">{video.title}</h3>
                <p className="text-xs text-slate-400">{video.desc}</p>
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
          0% { background-position: 0% -150%; }
          100% { background-position: 0% 250%; }
        }
        .animate-signal-pulse-vertical {
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