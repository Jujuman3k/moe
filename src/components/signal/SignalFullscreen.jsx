import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalDialog } from '../../hooks/useModalDialog.js';

export function SignalFullscreen({ children, onClose }) {
  const ref = useRef(null);
  useModalDialog(ref);
  return createPortal(<dialog ref={ref} className="signal-fullscreen" aria-label="Signalverksted i fullskjerm" onCancel={event => { event.preventDefault(); onClose(); }}>{children}</dialog>, document.body);
}
