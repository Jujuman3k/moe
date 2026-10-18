import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ label, onClose, swipeHandlers, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      // React removes the dialog before passive cleanup; native focus restoration
      // alone is not reliable once the dialog has been disconnected.
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={ref} aria-label={label} onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === ref.current) onClose(); }}
      className="m-0 mt-auto max-h-[90dvh] w-full max-w-none rounded-t-2xl border border-slate-700 bg-slate-900 p-0 text-slate-200 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:mx-auto sm:max-w-2xl">
      <div className="relative h-[85dvh] overflow-y-auto overscroll-contain p-5 pt-14 animate-slide-up" {...swipeHandlers}>
        <div aria-hidden="true" className="absolute left-1/2 top-4 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-700" />
        <button onClick={onClose} aria-label="Lukk detaljer" className="absolute right-3 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"><X size={20} /></button>
        {children}
      </div>
    </dialog>
  );
}
