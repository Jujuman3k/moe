import { useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe.js';
import { Modal } from '../ui/Modal.jsx';
import { DetailPanel } from './DetailPanel.jsx';

export function SignalNodeDetail({ node, onClose, onTry, onConsole, onVideoTab }) {
  const [subItem, setSubItem] = useState(null);
  const swipeCloseNode = useSwipe(onClose);
  return <Modal label={node.label} onClose={onClose} swipeHandlers={swipeCloseNode}>
    <DetailPanel key={subItem?.label || 'overview'} node={node} subItem={subItem} setSubItem={setSubItem} onClose={onClose} onTry={onTry} onConsole={onConsole} onVideoTab={onVideoTab} />
  </Modal>;
}
