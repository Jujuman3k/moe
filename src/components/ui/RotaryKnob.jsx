import { useEffect, useRef, useState } from 'react';

export const RotaryKnob = ({ value, setValue, label = "Nivå", color = "#38bdf8", size = 50 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(0);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaY = startY.current - e.clientY;
      let newVal = startVal.current + (deltaY * 1.5);
      if (newVal < 0) newVal = 0;
      if (newVal > 100) newVal = 100;
      setValue(newVal);
    };

    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, setValue]);

  const rotation = -135 + (value / 100) * 270;

  return (
    <div
      className="flex flex-col items-center gap-1 select-none touch-none cursor-ns-resize z-30"
      onPointerDown={handlePointerDown}
      role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}
      onKeyDown={event => {
        const delta = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[event.key];
        if (delta !== undefined || event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          setValue(event.key === 'Home' ? 0 : event.key === 'End' ? 100 : Math.max(0, Math.min(100, value + delta)));
        }
      }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" strokeDasharray="200" strokeDashoffset="50" transform="rotate(135 50 50)" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${(value / 100) * 188} 300`}
            transform="rotate(135 50 50)"
            className="transition-all duration-75"
          />
        </svg>
        <div
          className="absolute rounded-full bg-slate-800 border-2 border-slate-600 shadow-xl flex items-center justify-center"
          style={{ width: size * 0.7, height: size * 0.7, transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1.5 h-4 bg-white mb-auto mt-1 rounded-full"></div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
};
