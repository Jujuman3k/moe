import { Activity, GraduationCap, Home, Play, Volume2 } from 'lucide-react';
import { NavButton } from '../ui/NavButton.jsx';

const navigation = [
  { id: 'home', text: 'Hjem', icon: Home },
  { id: 'signal', text: 'Signalvei', icon: Activity },
  { id: 'videos', text: 'Videoer', icon: Play },
  { id: 'practice', text: 'Øv selv', icon: GraduationCap },
];

export function AppLayout({ page, navigate, children }) {
  const renderLinks = isMobile => navigation.map(item => (
    <NavButton key={item.id} active={page === item.id} onClick={() => navigate(item.id)}
      icon={item.icon} text={item.text} isMobile={isMobile} />
  ));
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <a href="#main-content" onClick={event => { event.preventDefault(); document.getElementById("main-content")?.focus(); }} className="skip-link">Hopp til innhold</a>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 text-left" aria-label="LydTeam Pro – hjem">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-600/20"><Volume2 size={22} /></span>
            <span><span className="block text-lg font-bold tracking-tight text-white">LydTeam <span className="text-blue-400">Pro</span></span><span className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">Lær. Utforsk. Miks.</span></span>
          </button>
          <nav aria-label="Hovedmeny" className="hidden gap-1 md:flex">{renderLinks(false)}</nav>
          <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-400 md:hidden">dLive C3500</span>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 py-6 pb-28 md:px-6 md:py-8">
        {children}
      </main>
      <nav aria-label="Mobilmeny" className="pb-safe fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-slate-800 bg-slate-950/95 px-2 pt-2 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">{renderLinks(true)}</nav>
    </div>
  );
}
