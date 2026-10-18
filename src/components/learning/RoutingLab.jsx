import { useId, useState } from 'react';
import { Headphones, SlidersHorizontal, Speaker } from 'lucide-react';
import { routingLevels } from '../../utils/routing.js';

function LevelMeter({ label, value, color }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-300">
        <span>{label}</span><output className="font-mono tabular-nums text-white">{value > 0 ? '+' : ''}{value} dB</output>
      </div>
      <div className="flex h-16 items-end gap-1" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className={`flex-1 rounded-sm transition-colors ${index < (value + 36) / 3 ? color : 'bg-slate-800'}`} style={{ height: `${28 + index * 4}%` }} />
        ))}
      </div>
    </div>
  );
}

export function RoutingLab() {
  const [faderDb, setFaderDb] = useState(0);
  const [preFade, setPreFade] = useState(false);
  const id = useId();
  const levels = routingLevels(faderDb, preFade);
  return (
    <section aria-label="Interaktiv pre/post-lab" className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-2xl md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white"><SlidersHorizontal size={17} className="text-teal-400" /> Prøv signalet</div>
        <span className="rounded-full border border-teal-400/20 bg-teal-400/5 px-2 py-1 text-[10px] uppercase tracking-wider text-teal-300">Interaktiv lab</span>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-slate-400">Dra ned faderen. Hva skjer med monitoren når du bytter fra post til pre?</p>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Speaker size={14} /> Sal / Main</div><LevelMeter label="Nivåendring" value={levels.main} color="bg-blue-400" /></div>
        <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Headphones size={14} /> Monitor / Aux</div><LevelMeter label="Nivåendring" value={levels.monitor} color="bg-teal-400" /></div>
      </div>
      <label htmlFor={id} className="mb-2 flex items-center justify-between text-xs font-medium text-slate-300"><span>Kanalfader</span><span className="font-mono">{faderDb} dB</span></label>
      <input id={id} type="range" min="-30" max="6" step="1" value={faderDb} onChange={event => setFaderDb(Number(event.target.value))} className="mb-4 h-7 w-full cursor-pointer accent-blue-400" />
      <div className="flex gap-2" role="group" aria-label="Monitorens send-punkt">
        {[false, true].map(pre => <button key={String(pre)} onClick={() => setPreFade(pre)} aria-pressed={preFade === pre}
          className={`min-h-11 flex-1 rounded-lg border text-xs font-bold transition-colors ${preFade === pre ? 'border-teal-400/50 bg-teal-400/10 text-teal-200' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>{pre ? 'Pre-fade' : 'Post-fade'}</button>)}
      </div>
      <p className="mt-4 min-h-10 text-xs leading-relaxed text-slate-300" aria-live="polite">{preFade ? 'Monitoren beholder nivået når du flytter kanalfaderen.' : 'Monitoren følger kanalfaderen. Senker du i salen, senker du også i monitoren.'}</p>
      <p className="mt-3 border-t border-slate-800 pt-3 text-[10px] leading-relaxed text-slate-500">Forenklet modell uten lyd. Fast inngangs- og sendnivå; mute og DCA er ikke modellert.</p>
    </section>
  );
}
