import { useState } from 'react';
import { signalPathData } from '../../data/signalPathData.js';
import { useSwipe } from '../../hooks/useSwipe.js';
import { Modal } from '../ui/Modal.jsx';
import { DetailPanel } from './DetailPanel.jsx';
import { SignalLab } from './SignalLab.jsx';

export function SignalFlowDiagram({ initialNodeId, initialSourceId, initialMode, initialTool }) {
  const [selectedNode, setSelectedNode] = useState(() => initialSourceId || initialMode || initialTool ? null : signalPathData.find(node => node.id === initialNodeId) || null);
  const [subItem, setSubItem] = useState(null);
  const swipeCloseNode = useSwipe(() => setSelectedNode(null));
  return <>
    <SignalLab initialTool={initialTool} initialNodeId={initialNodeId} initialSourceId={initialSourceId} initialMode={initialMode} onOpenNode={node => { setSelectedNode(node); setSubItem(null); }} />
    {selectedNode && <Modal label={selectedNode.label} onClose={() => setSelectedNode(null)} swipeHandlers={swipeCloseNode}>
      <DetailPanel key={`${selectedNode.id}-${subItem?.label || 'overview'}`} node={selectedNode} subItem={subItem} setSubItem={setSubItem} />
    </Modal>}
  </>;
}
