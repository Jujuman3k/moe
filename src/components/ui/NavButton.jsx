import { createElement } from 'react';

export function NavButton({ active, onClick, icon, text }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined} className="studio-nav-link">
      {createElement(icon, { size: 18, strokeWidth: 1.7, 'aria-hidden': true })}
      <span>{text}</span>
    </button>
  );
}
