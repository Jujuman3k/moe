import { useState } from 'react';
import { CornerDownRight } from 'lucide-react';

const StageMonitor = ({ label, subLabel, aux, x, y, type, showFuture }) => {
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

export const MonitorVisualizer = () => {
  const [showFuture, setShowFuture] = useState(false);

  // --- SUB-KOMPONENT: MONITOR IKON ---


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
      <div className="relative w-full h-[360px] bg-[#0f172a] overflow-hidden group">

        {/* Scenegulv styling */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-80"></div>
        <div className="absolute inset-0 opacity-10"
             style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
        </div>

        {/* --- POSISJONER --- */}
        {/* Justerte koordinater for å unngå kollisjon */}

        {/* BAK: Trommer */}
        <StageMonitor showFuture={showFuture} x="50%" y="20%" aux="AUX 5" label="Trommer" subLabel="Alltid IEM" type="iem" />

        {/* MIDT: Flyttet lenger ut til sidene (15% og 85%) */}
        <StageMonitor showFuture={showFuture} x="15%" y="45%" aux="AUX 4" label="Bass/Gitar" subLabel="Scene Venstre" type="wedge" />
        <StageMonitor showFuture={showFuture} x="85%" y="45%" aux="AUX 3" label="Piano/Keys" subLabel="Scene Høyre" type="wedge" />

        {/* FRONT: Sentrert men med god avstand */}
        <StageMonitor showFuture={showFuture} x="35%" y="70%" aux="AUX 2" label="Vokal (L)" subLabel="Front" type="wedge" />
        <StageMonitor showFuture={showFuture} x="65%" y="70%" aux="AUX 1" label="Vokal (R)" subLabel="Front" type="wedge" />

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
