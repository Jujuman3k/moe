import { Activity, BookOpen, Headphones, House, SlidersHorizontal, Video } from 'lucide-react';
import { NavButton } from '../ui/NavButton.jsx';
import '../../styles/studio-shell.css';

const navigation = [
  { id: 'home', text: 'Hjem', icon: House },
  { id: 'signal', text: 'Signalvei', icon: Activity },
  { id: 'listen', text: 'Lyttetest', icon: Headphones },
  { id: 'practice', text: 'Øv selv', icon: BookOpen },
  { id: 'videos', text: 'Videoer', icon: Video },
];

export function AppLayout({ page, navigate, searchButton, children }) {
  const navLinks = () => navigation.map(item => (
    <NavButton key={item.id} active={page === item.id} onClick={() => navigate(item.id)}
      icon={item.icon} text={item.text} />
  ));
  return (
    <div className="studio-shell min-h-screen text-slate-200">
      <a href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }} className="skip-link">Hopp til innhold</a>
      <header className="studio-topbar">
        <div className="studio-topbar-inner">
          <button type="button" onClick={() => navigate('home')} className="studio-brand" aria-label="LydTeam Pro – hjem">
            <img src="/favicon.svg" width="36" height="36" alt="" />
            <span>LydTeam</span><b>PRO</b>
          </button>
          <nav aria-label="Hovedmeny" className="studio-nav-desktop">{navLinks()}</nav>
          <div className={searchButton ? "studio-top-actions with-search" : "studio-top-actions"}>{searchButton}<span className="studio-console-badge"><SlidersHorizontal size={14} aria-hidden="true" /> dLive C3500</span></div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="studio-main">{children}</main>
      <nav aria-label="Mobilmeny" className="studio-nav-mobile">{navLinks()}</nav>
    </div>
  );
}
