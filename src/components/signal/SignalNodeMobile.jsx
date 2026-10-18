import { IconHelper } from '../ui/IconHelper.jsx';
import { ChevronRight } from 'lucide-react';

export const SignalNodeMobile = ({ node, isFirst, isLast, onClick, isActive, index }) => {
  const isBranch = node.type === "branch_out";

  // Farger for horisontal "skyting"
  const isMonitor = node.id.includes('monitor');
  const isFX = node.id.includes('fx');
  let branchColorClass = "text-slate-500";
  if (isMonitor) branchColorClass = "text-blue-500";
  if (isFX) branchColorClass = "text-purple-500";

  // Delay for domino-effekt
  const delayStyle = { animationDelay: `${index * 0.25}s` };

  return (
    <div className="flex gap-4 relative w-full">

      {/* SKINNE (Venstre) */}
      <div className="w-12 flex-shrink-0 flex flex-col items-center relative">

        {/* HOVEDLINJEN (Vertikal) */}
        <div
          className="absolute width-0.5 bg-slate-800 w-0.5"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: isFirst ? '1rem' : '0',
            height: isLast ? '1rem' : '100%'
          }}
        >
          {/* ENDRING HER: Jeg fjernet {!isBranch && ...} sjekken.
              Nå rendres lyset ALLTID, slik at det går gjennom stiplede linjer også. */}
           <div
             className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-70 animate-signal-pulse-vertical"
             style={delayStyle}
           ></div>
        </div>

        {/* Stiplet overlay (ligger oppå lyset, så lyset skinner "gjennom" prikkene) */}
        {isBranch && (
           <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -ml-[1px] border-l-2 border-dotted border-slate-600 z-10"></div>
        )}

        {/* HORISONTAL "LASER" (Kun for branches) */}
        {isBranch && (
          <div className="absolute left-1/2 top-8 w-8 h-0.5 -mt-4 z-0 overflow-hidden pointer-events-none">
             <div
               className={`animate-shoot-right ${branchColorClass}`}
               style={delayStyle}
             ></div>
          </div>
        )}

        {/* SIRKEL / IKON */}
        <div className={`
          relative z-20 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all bg-slate-900 mt-0
          ${isActive ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
            isBranch ? `border-slate-600 ${isMonitor ? 'text-blue-400' : isFX ? 'text-purple-400' : 'text-slate-500'}` : 'border-slate-600 text-slate-300'}
        `}>
          <IconHelper name={node.iconName} size={isBranch ? 14 : 16} />
        </div>
      </div>

      {/* KORTET (Høyre) */}
      <div className="flex-1 pb-8 min-w-0">
        <button type="button" aria-pressed={isActive}
          onClick={() => onClick(node)}
          className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden
            ${isActive ? 'bg-blue-900/20 border-blue-500 shadow-lg' : 'bg-slate-800 border-slate-700'}
            ${isBranch ? 'ml-2 border-dashed bg-slate-800/50' : ''}
          `}
        >
          {/* Lys-blink inni boksen (kun branches) */}
          {isBranch && (
            <div
              className={`absolute inset-0 opacity-10 animate-pulse ${isMonitor ? 'bg-blue-500' : 'bg-purple-500'}`}
              style={{ animationDuration: '3s' }}
            ></div>
          )}

          <div className="flex justify-between items-start relative z-10">
            <div className="min-w-0">
              <h4 className={`font-bold text-sm truncate ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>{node.label}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.desc}</p>
            </div>
            {isBranch && <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2 border ${isMonitor ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' : 'bg-purple-900/30 text-purple-300 border-purple-500/30'}`}>Aux</span>}
            {!isBranch && <ChevronRight size={16} className={`text-slate-600 shrink-0 ml-2 ${isActive ? 'text-blue-400' : ''}`}/>}
          </div>
        </button>
      </div>
    </div>
  );
};
