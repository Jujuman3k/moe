import * as React from 'react';
import { useState } from 'react';
import { Activity, Check, X } from 'lucide-react';

export const GateVisualizer = () => {
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
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
              {[0, -20, -40, -60, -80].map(db => (
                  <React.Fragment key={db}>
                      <line x1="0" y1={mapDbToY(db)} x2="300" y2={mapDbToY(db)} stroke="#1e293b" strokeWidth="1" />
                      <line x1={mapDbToX(db)} y1="0" x2={mapDbToX(db)} y2="150" stroke="#1e293b" strokeWidth="1" />
                  </React.Fragment>
              ))}
              <line x1="0" y1="150" x2="300" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>

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
