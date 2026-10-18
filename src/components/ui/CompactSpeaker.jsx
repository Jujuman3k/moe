

export const CompactSpeaker = ({ intensity, label, isMuted }) => {
  const effectiveIntensity = isMuted ? 0 : intensity;

  // Skalering (Hvor mye elementet "hopper" mot deg)
  const coneScale = 1 + (effectiveIntensity * 0.25);

  // Farge (Blir hvitere ved høyt trykk)
  const waveColor = effectiveIntensity > 0.8 ? 'border-cyan-200' : 'border-cyan-500';

  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${isMuted ? 'opacity-30 grayscale' : 'opacity-100'}`}>
       <div className="relative w-16 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-visible z-10">

          {/* Pulsering 1 (FAST HASTIGHET for sync) */}
          {effectiveIntensity > 0.05 && (
            <div className={`absolute inset-0 rounded-xl border-[3px] ${waveColor} animate-ping pointer-events-none`}
                style={{
                    animationDuration: '1.4s',
                    opacity: effectiveIntensity * 0.8,
                    transform: `scale(${1 + effectiveIntensity})`
                }}
            ></div>
          )}

          {/* Pulsering 2 (FAST HASTIGHET for sync) */}
          {effectiveIntensity > 0.4 && (
            <div className={`absolute inset-0 rounded-xl border-2 ${waveColor} animate-ping pointer-events-none`}
                style={{
                    animationDuration: '1.4s',
                    animationDelay: '0.3s',
                    opacity: effectiveIntensity * 0.5,
                    zIndex: -1
                }}
            ></div>
          )}

          {/* Selve elementet */}
          <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-slate-600 shadow-inner flex items-center justify-center relative z-20 transition-transform duration-75 ease-out"
              style={{ transform: `scale(${coneScale})` }}>
              <div className="w-5 h-5 bg-slate-800 rounded-full border border-slate-700"></div>
          </div>

          {/* Volum-søyle */}
          <div className="absolute bottom-2 w-10 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 z-20">
              <div className={`h-full transition-all duration-75 shadow-[0_0_8px_rgba(34,211,238,0.8)] ${effectiveIntensity > 0.9 ? 'bg-red-500' : 'bg-cyan-400'}`}
                  style={{ width: `${effectiveIntensity * 100}%` }}></div>
          </div>
       </div>
       <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-sm mt-1">
         {label}
       </span>
    </div>
  );
};
