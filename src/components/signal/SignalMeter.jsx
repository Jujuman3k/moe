import { formatSignalLevel, signalPercent } from '../../utils/signalSimulation.js';

export function SignalMeter({ label, level, tone = 'teal', clipped = false, compact = false }) {
  const value = formatSignalLevel(level);
  return (
    <div className={`signal-meter ${compact ? 'signal-meter-compact' : ''}`} data-tone={clipped && level !== null ? 'rose' : tone}>
      <div className="flex items-baseline justify-between gap-1">
        {!compact && <span className="text-xs text-slate-300">{label}</span>}
        <output aria-label={label} className="font-mono text-[10px] tabular-nums text-slate-300 sm:text-xs">{value}</output>
      </div>
      <div className="signal-meter-track" aria-hidden="true"><span style={{ width: `${signalPercent(level)}%` }} /></div>
      {!compact && clipped && level !== null && <p className="mt-1 text-[10px] text-rose-300">Forvrengt i inngangen</p>}
    </div>
  );
}
