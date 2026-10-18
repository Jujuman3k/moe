import { useRef, useState } from 'react';
import { CompactSpeaker } from '../ui/CompactSpeaker.jsx';
import { AlertTriangle, Copy, Disc, GitMerge, Headphones, Layers, Lightbulb, Scissors, Sliders, Speaker, Star } from 'lucide-react';
import { RotaryKnob } from '../ui/RotaryKnob.jsx';

export const FaderSectionVisualizer = () => {
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
                         <span className="bg-cyan-600 px-1.5 py-0.5 rounded text-white border border-cyan-500">Trykk SEL</span>→
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
