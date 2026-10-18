import { useState } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

export const CompressorVisualizer = () => {
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
