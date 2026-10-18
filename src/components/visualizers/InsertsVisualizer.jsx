import { useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe.js';
import { ArrowLeft, Check, Play, Sliders, Star } from 'lucide-react';
import { Dyn8Visualizer } from './Dyn8Visualizer.jsx';
import { DeEsserVisualizer } from './DeEsserVisualizer.jsx';
import { TransientVisualizer } from './TransientVisualizer.jsx';
import { MultibandVisualizer } from './MultibandVisualizer.jsx';
import { HypabassVisualizer } from './HypabassVisualizer.jsx';

export const InsertsVisualizer = () => {
  const [view, setView] = useState('list'); // list, dyn8, deesser, transient, multiband, hypabass

  // Vi lager en sveipe-funksjon som går tilbake til listen
  const swipeBack = useSwipe(() => setView('list'));

  if (view === 'dyn8') {
    return (
      <div className="space-y-4" {...swipeBack}>
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
      <div className="space-y-4" {...swipeBack}>
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
      <div className="space-y-4" {...swipeBack}>
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
      <div className="space-y-4" {...swipeBack}>
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
      <div className="space-y-4" {...swipeBack}>
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

      {/* 1. LISTE OVER INSERTS (Nå øverst) */}
      <h3 className="text-yellow-400 font-bold text-sm flex items-center gap-2"><Star size={16}/> Topp 5 Viktigste Inserts</h3>
      <div className="space-y-3">
        {/* 1. DYN8 */}
        <button type="button" onClick={() => setView('dyn8')} className="w-full text-left bg-slate-800 p-3 rounded border border-purple-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-2">1. Dyn8 <Play size={10} className="text-purple-400 group-hover:text-white"/></span>
            <span className="text-[9px] bg-purple-900 text-purple-200 px-1.5 py-0.5 rounded">Must-have</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Multibånd-komp + Dynamisk EQ. Det mest potente verktøyet i dLive.</p>
          <div className="text-[10px] text-green-400 italic">Bruk på: Vokal (Alltid), Keys, Gitar.</div>
        </button>

        {/* 2. DE-ESSER */}
        <button type="button" onClick={() => setView('deesser')} className="w-full text-left bg-slate-800 p-3 rounded border border-blue-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">2. De-Esser <Play size={10} className="text-blue-400 group-hover:text-white"/></span>
              <span className="text-[9px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">Vokal</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Fjerner harde S-lyder. Viktig i kirker med mye klang.</p>
        </button>

        {/* 3. TRANSIENT CONTROLLER */}
        <button type="button" onClick={() => setView('transient')} className="w-full text-left bg-slate-800 p-3 rounded border border-orange-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">3. Transient Controller <Play size={10} className="text-orange-400 group-hover:text-white"/></span>
              <span className="text-[9px] bg-orange-900 text-orange-200 px-1.5 py-0.5 rounded">Trommer</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Gir "punch" uten å bruke EQ. Løfter anslaget.</p>
          <div className="text-[10px] text-slate-500 italic">Bruk på: Kick, Snare, Toms (gir definisjon).</div>
        </button>

        {/* 4. MULTIBAND COMP */}
        <button type="button" onClick={() => setView('multiband')} className="w-full text-left bg-slate-800 p-3 rounded border border-cyan-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">4. Multiband Compressor <Play size={10} className="text-cyan-400 group-hover:text-white"/></span>
              <span className="text-[9px] bg-cyan-900 text-cyan-200 px-1.5 py-0.5 rounded">Glue</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Kontrollerer highs/mids/lows separat. "Glue" på master.</p>
        </button>

        {/* 5. HYPABASS */}
        <button type="button" onClick={() => setView('hypabass')} className="w-full text-left bg-slate-800 p-3 rounded border border-pink-500/50 cursor-pointer hover:bg-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">5. Hypabass <Play size={10} className="text-pink-400 group-hover:text-white"/></span>
              <span className="text-[9px] bg-pink-900 text-pink-200 px-1.5 py-0.5 rounded">Sub</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Gir sub-punch uten gjørme. Hillsong/Elevation lyd.</p>
          <div className="text-[10px] text-slate-500 italic">Bruk på: Bassgitar, Kick, Tromme-buss.</div>
        </button>
      </div>

      {/* 2. BONUS */}
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

      {/* 3. PRO TIPS */}
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

      {/* 4. INFO BOKS (FLYTTET TIL BUNNEN) */}
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

    </div>
  );
};
