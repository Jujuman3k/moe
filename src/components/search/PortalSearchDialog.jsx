import { useEffect, useRef, useState } from 'react';
import { AudioLines, BookOpen, Film, Headphones, Map, ScanLine, Search, X } from 'lucide-react';
import { searchPortal, searchKinds } from '../../utils/portalSearch.js';
import { useModalDialog } from '../../hooks/useModalDialog.js';

const icons = { Verktøy: Headphones, Signalvei: AudioLines, Oppgave: BookOpen, Video: Film, Feilsak: ScanLine, Læringsløp: Map };

export default function PortalSearchDialog({ onClose, onSelect }) {
  const dialog = useRef(null), field = useRef(null), list = useRef(null);
  const [query, setQuery] = useState(''), [kind, setKind] = useState('Alle'), [limit, setLimit] = useState(15);
  useModalDialog(dialog);
  useEffect(() => { field.current.focus(); }, []);
  const results = searchPortal(query, kind), suggestions = !query.trim() && kind === 'Alle';
  function advance(event) {
    // A native search input can consume Escape just to clear its text.
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
    if (event.target !== field.current && !list.current.contains(event.target)) return;
    const items = [...list.current.querySelectorAll('[data-result]')];
    if (!items.length) return;
    const i = items.indexOf(event.target);
    event.preventDefault();
    if (event.key === 'ArrowUp' && i <= 0) field.current.focus();
    else items[Math.min(items.length - 1, i + (event.key === 'ArrowDown' ? 1 : -1))]?.focus();
  }
  return <dialog ref={dialog} className="portal-search-dialog" aria-labelledby="search-heading" onKeyDown={advance}
    onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===dialog.current)onClose();}}>
    <div className="portal-search-surface">
      <header><div><span className="portal-search-overline">LYDTEAM / OPPSLAG</span><h2 id="search-heading">Søk i portalen</h2></div><button type="button" onClick={onClose} aria-label="Lukk søket"><X size={20}/></button></header>
      <form role="search" onSubmit={event=>{event.preventDefault();if(results[0])onSelect(results[0]);}}>
        <Search size={20}/><input ref={field} type="search" aria-label="Søkeord i portalen" placeholder="Prøv «monitor», «kick» eller «EQ»" value={query} onChange={event=>{setQuery(event.target.value);setLimit(15);list.current?.scrollTo(0,0);}}/>
      </form>
      <div className="portal-search-filters" role="group" aria-label="Innholdstype">{['Alle',...searchKinds].map(item=><button key={item} type="button" aria-pressed={kind===item} onClick={()=>{setKind(item);setLimit(15);list.current?.scrollTo(0,0);}}>{item}</button>)}</div>
      <p className="portal-search-count" role="status">{suggestions?'Prøv en snarvei':results.length+' treff'}</p>
      <div ref={list} className="portal-search-list">
        {results.slice(0,limit).map(item=>{const Icon=icons[item.kind];return <button data-result="" type="button" key={item.key} onClick={()=>onSelect(item)}><span className="portal-search-icon"><Icon size={18}/></span><span><small>{item.kind}</small><strong>{item.title}</strong><span>{item.detail}</span></span></button>;})}
        {!results.length && <p>Ingen treff. Prøv et kortere søkeord eller velg en annen innholdstype.</p>}
        {results.length>limit && <button className="portal-search-more" type="button" onClick={()=>setLimit(n=>n+15)}>Vis flere treff</button>}
      </div>
    </div>
  </dialog>;
}
