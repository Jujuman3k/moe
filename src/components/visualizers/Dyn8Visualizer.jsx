import { useEffect, useState } from 'react';
import { Activity, BarChart2, Lightbulb, Mic2, Music } from 'lucide-react';

export const Dyn8Visualizer = () => {
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
