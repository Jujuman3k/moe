import { Search, X } from 'lucide-react';

export function VideoSearch({ query, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="video-search" className="sr-only">Søk i videoarkivet</label>
      <Search size={19} className="pointer-events-none absolute left-4 top-4 text-slate-500" />
      <input id="video-search" type="search" value={query} onChange={event => onChange(event.target.value)}
        placeholder="Søk etter EQ, gain, Dante …"
        className="min-h-[52px] w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-12 text-base text-white placeholder:text-slate-500" />
      {query && <button onClick={() => onChange('')} aria-label="Tøm søket" className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:text-white"><X size={18} /></button>}
    </div>
  );
}
