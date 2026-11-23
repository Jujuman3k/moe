import { Search, X } from 'lucide-react';

export function VideoSearch({ query, onChange, inputRef }) {
  return <div className="vl-search">
    <label htmlFor="video-search">Søk <span className="sr-only">i videoarkivet</span></label>
    <div><Search size={18} aria-hidden="true"/><input ref={inputRef} id="video-search" type="search" value={query} onChange={event => onChange(event.target.value)} placeholder="EQ, monitorsend, Dante …" />
      {query && <button type="button" onClick={() => { onChange(''); inputRef.current?.focus(); }} aria-label="Tøm søket"><X size={17}/></button>}</div>
  </div>;
}
