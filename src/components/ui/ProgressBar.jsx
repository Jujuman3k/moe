export function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-xs text-slate-400"><span>{label}</span><span>{value} / {max}</span></div>
      <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
        className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
