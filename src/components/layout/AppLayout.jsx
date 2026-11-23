import { Activity, BookOpen, Headphones, House, SlidersHorizontal, SlidersVertical, Video } from 'lucide-react';
import { NavButton } from '../ui/NavButton.jsx';
import '../../styles/studio-shell.css';

import { portalPages } from '../../data/portalPages.js';

const pageIcons = {home:House, signal:Activity, bandroom:SlidersVertical, listen:Headphones, practice:BookOpen, videos:Video};

export function AppLayout({ page, navigate, searchButton, children }) {
  const navLinks = () => portalPages.filter(item => item.id !== 'c3500').map(item => (
    <NavButton key={item.id} active={page === item.id} onClick={() => navigate(item.id)}
      icon={pageIcons[item.id]} text={item.label} />
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
          <div className={searchButton ? "studio-top-actions with-search" : "studio-top-actions"}>{searchButton}<button type="button" className="studio-console-launch" aria-label={page === 'signal' ? 'Åpne kanalbanken på C3500' : 'Åpne C3500-pulten'} aria-current={page === 'c3500' ? 'page' : undefined} onClick={()=>navigate('c3500')}><SlidersHorizontal size={15} aria-hidden="true" /> C3500</button></div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={page === 'c3500' ? 'studio-main desk-main' : 'studio-main'}>{children}</main>
      <nav aria-label="Mobilmeny" className="studio-nav-mobile">{navLinks()}</nav>
    </div>
  );
}
