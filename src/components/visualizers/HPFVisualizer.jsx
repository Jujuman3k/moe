import { useState } from 'react';
import { toPercent } from '../../utils/frequency.js';
import { Info, Music } from 'lucide-react';

export const HPFVisualizer = () => {
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
