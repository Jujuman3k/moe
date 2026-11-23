import { lazy, Suspense, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/portal-search.css';

const Dialog = lazy(() => import('./PortalSearchDialog.jsx'));
export function PortalSearch({ navigate, onOpenVideo }) {
  const [open,setOpen] = useState(false);
  useEffect(()=>{
    const shortcut = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k' && !event.repeat && (!document.querySelector('dialog[open]') || open)) {
        event.preventDefault();setOpen(value=>!value);
      }
    };
    const close = ()=>setOpen(false);
    document.addEventListener('keydown',shortcut);window.addEventListener('hashchange',close);
    return ()=>{document.removeEventListener('keydown',shortcut);window.removeEventListener('hashchange',close);};
  },[open]);
  return <><button type="button" className="portal-search-launch" aria-label="Søk i portalen" aria-haspopup="dialog" onClick={()=>setOpen(true)}><Search size={18}/><span>Søk</span><kbd aria-hidden="true">⌘/Ctrl K</kbd></button>
    {open && <Suspense fallback={<span role="status" className="sr-only">Åpner søket …</span>}><Dialog onClose={()=>setOpen(false)} onSelect={item=>{setOpen(false);if(item.page==='videos')onOpenVideo(item.params.video);else navigate(item.page,item.params);}}/></Suspense>}</>;
}
