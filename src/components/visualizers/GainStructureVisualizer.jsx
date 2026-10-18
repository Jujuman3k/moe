import { useEffect, useRef, useState } from 'react';
import { Check, Lightbulb, Sliders } from 'lucide-react';
import { RotaryKnob } from '../ui/RotaryKnob.jsx';

export const GainStructureVisualizer = () => {
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
                   label="Input Gain"
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
