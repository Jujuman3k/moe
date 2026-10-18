import { useEffect } from 'react';

// Fullscreen mixer, help and original tools can be stacked. Restore the body
// only when the last dialog closes, including simultaneous route unmounts.
let openDialogs = 0;
let originalOverflow = '';

export function useModalDialog(ref) {
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    if (openDialogs === 0) originalOverflow = document.body.style.overflow;
    openDialogs += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      openDialogs -= 1;
      if (openDialogs === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [ref]);
}
