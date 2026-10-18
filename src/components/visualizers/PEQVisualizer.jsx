import { useState } from 'react';
import { toFreq } from '../../utils/frequency.js';
import { Check, Settings, X } from 'lucide-react';

export const PEQVisualizer = () => {
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
