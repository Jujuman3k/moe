import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { Modal } from '../ui/Modal.jsx';
import { useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe.js';
import { Activity } from 'lucide-react';
import { signalPathData } from '../../data/signalPathData.js';
import { SignalNodeMobile } from './SignalNodeMobile.jsx';
import { IconHelper } from '../ui/IconHelper.jsx';
import { DetailPanel } from './DetailPanel.jsx';

export const SignalFlowDiagram = ({ initialNodeId }) => {
  const [selectedNode, setSelectedNode] = useState(() => signalPathData.find(node => node.id === initialNodeId) || null);
  const [subItem, setSubItem] = useState(null);
  const isMobile = useMediaQuery('(max-width: 1279px)');

  // 1. Definer sveipe-funksjonen for å lukke modalen på mobil
  const swipeCloseNode = useSwipe(() => setSelectedNode(null));

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSubItem(null);
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 relative">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div tabIndex={0} role="region" aria-label="Signalveikart – bla sideveis på stor skjerm" className="custom-scrollbar bg-slate-900/50 xl:bg-slate-900 rounded-2xl xl:border border-slate-700 p-4 xl:p-8 relative overflow-x-auto">
          <h3 className="text-lg xl:text-xl font-bold text-slate-300 mb-6 flex items-center gap-2 relative z-10">
            <Activity className="text-blue-400"/> Signalvei
          </h3>

          {/* MOBIL VISNING (Vertikal liste) */}
          <div className="block xl:hidden pl-2 relative z-10">
             {signalPathData.map((node, idx) => (
              <SignalNodeMobile
                key={node.id}
                node={node}
                isFirst={idx === 0}
                isLast={idx === signalPathData.length - 1}
                onClick={handleNodeClick}
                isActive={selectedNode?.id === node.id}
                index={idx}
              />
             ))}
          </div>

          <p className="hidden xl:block mb-3 text-xs text-slate-400">Bla sideveis for å følge hele signalveien →</p>

          {/* DESKTOP VISNING (Horisontalt kart) */}
          <div className="hidden xl:block relative h-[500px] min-w-[1260px]">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
               {/* Static Base Line */}
               <path d="M110,140 L240,140 L390,140 L640,140 L940,140 L1140,140" stroke="#334155" strokeWidth="2" fill="none" />

               {/* Animated Pulse - Thick Glow Line */}
               <path
                 d="M110,140 L1140,140"
                 stroke="#06b6d4"
                 strokeWidth="6"
                 strokeOpacity="0.4"
                 fill="none"
                 strokeLinecap="round"
                 className="animate-signal-pulse"
               />
                {/* Animated Pulse - Core Bright Line */}
               <path
                 d="M110,140 L1140,140"
                 stroke="#67e8f9"
                 strokeWidth="2"
                 fill="none"
                 strokeLinecap="round"
                 className="animate-signal-pulse"
               />

               {/* Monitor Branch Line */}
               <path d="M540,140 L540,180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" />

               {/* FX Branch Line */}
               <path d="M640,140 L640,180 L790,180" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" fill="none" />
               <path d="M850,220 L940,220 L940,160" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.5" />
            </svg>

            {signalPathData.map((node) => (
              <button type="button" aria-pressed={selectedNode?.id === node.id}
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={`absolute cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 w-32 z-10 transition-all hover:scale-105 hover:shadow-xl
                  ${node.type === "branch_out" ? "bg-slate-900 border-dashed border-slate-600 mt-8" : "bg-slate-800 border-slate-700"}
                  ${selectedNode?.id === node.id ? 'border-blue-500 shadow-blue-500/20 ring-2 ring-blue-500/20' : ''}
                `}
                style={{ left: node.x, top: node.y }}
              >
                 <div className={`p-2 rounded-full ${selectedNode?.id === node.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                   <IconHelper name={node.iconName} size={20} />
                 </div>
                 <span className="text-xs font-bold text-center text-slate-200">{node.label}</span>
              </button>
            ))}
            <div className="absolute bottom-4 left-4 p-4 bg-slate-800/80 rounded border border-slate-700 text-xs text-slate-400">
               <div className="flex items-center gap-2 mb-1"><div className="w-4 h-0.5 bg-slate-500"></div><span>Hovedsignal (Main LR)</span></div>
               <div className="flex items-center gap-2 mb-1"><div className="w-4 h-0.5 bg-blue-500 border-t border-dashed"></div><span>Pre-Fade (Monitor)</span></div>
               <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-purple-500 border-t border-dashed"></div><span>Post-Fade (FX)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDE PANEL */}
      <div className="hidden xl:block w-[400px] shrink-0 bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl overflow-y-auto max-h-[calc(100vh-140px)]">
        {!isMobile && selectedNode ?
           <DetailPanel key={`${selectedNode.id}-${subItem?.label || "overview"}`} node={selectedNode} subItem={subItem} setSubItem={setSubItem} />
        : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-50">
             <Activity size={64} className="mb-4" />
             <p>Klikk på en boks i signalveien for å se detaljer og verktøy.</p>
          </div>
        )}
      </div>

      {isMobile && selectedNode && (
        <Modal label={selectedNode.label} onClose={() => setSelectedNode(null)} swipeHandlers={swipeCloseNode}>
          <DetailPanel key={`${selectedNode.id}-${subItem?.label || 'overview'}`} node={selectedNode} subItem={subItem} setSubItem={setSubItem} />
        </Modal>
      )}
    </div>
  );
};
