import { createElement } from 'react';

export function NavButton({ active, onClick, icon, text, isMobile = false }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined}
      className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors md:flex-row md:gap-2 md:px-4 ${active ? 'bg-blue-500/10 text-blue-300 md:bg-blue-600 md:text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {createElement(icon, { size: isMobile ? 22 : 17, 'aria-hidden': true })}
      <span className={isMobile ? 'text-[11px]' : ''}>{text}</span>
    </button>
  );
}
