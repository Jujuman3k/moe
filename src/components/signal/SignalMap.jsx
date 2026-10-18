import { useId } from 'react';
import { signalPathData } from '../../data/signalPathData.js';
import { signalPercent, formatSignalLevel } from '../../utils/signalSimulation.js';

const labels = { input: 'Kilde', preamp: 'Gain', processing: 'Prosess', fader: 'Fader', monitor_branch: 'Monitor', fx_branch: 'FX', mixbus: 'Main LR', matrix: 'Matrix', speakers: 'PA' };
const positions = { input: [1, 1], preamp: [2, 1], processing: [3, 1], fader: [4, 1], monitor_branch: [2, 2], fx_branch: [4, 2], mixbus: [3, 3], matrix: [2, 3], speakers: [1, 3] };

export function SignalMap({ state, signal, activeId, onSelectNode, animate }) {
  const marker = useId();
  const lines = [
    ['M50,27 H150', signal.preamp, 'main'], ['M150,27 H250', signal.processed, 'main'],
    ['M250,27 H350', signal.post, 'main'], ['M350,27 H398 V135 H250', signal.main, 'main'],
    ['M250,135 H150', signal.matrix, 'main'], ['M150,135 H50', signal.pa, 'main'],
    [state.monitorPre ? 'M250,27 V58 H150 V81' : 'M350,27 V55 H150 V81', signal.monitor, 'monitor'],
    ['M350,27 V81', signal.fx, 'fx'], ['M350,81 H250 V135', signal.fxReturn, 'fx'],
  ];
  return <div className={`signal-map ${animate ? '' : 'signal-motion-paused'}`} role="group" aria-label="Interaktivt signalveikart">
    <svg viewBox="0 0 400 162" preserveAspectRatio="none" aria-hidden="true" className="signal-connections">
      <defs><marker id={marker} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M1,1 L9,5 L1,9" fill="none" stroke="#64748b" strokeWidth="2" /></marker></defs>
      {lines.map(([path, level, type], index) => <g key={index} className={`signal-route route-${type}`}>
        <path d={path} fill="none" stroke="#334155" strokeWidth="1.5" />
        {level !== null && <path d={path} fill="none" stroke={signal.clipped ? '#fb7185' : type === 'fx' ? '#c084fc' : type === 'monitor' ? '#60a5fa' : '#2dd4bf'} strokeWidth="2.5" className="signal-travelling-line" />}
      </g>)}
      <path d="M98,27 h4 M198,27 h4 M298,27 h4 M202,135 h-4 M102,135 h-4 M350,54 v4 M250,108 v4" markerEnd={`url(#${marker})`} stroke="#64748b" fill="none" />
    </svg>
    {signalPathData.map(node => <button type="button" key={node.id} aria-label={`${node.label} – velg ledd`} aria-pressed={activeId === node.id} onClick={() => onSelectNode(node.id)}
      className="signal-map-node" data-node={node.id} data-active={activeId === node.id} data-silent={signal.nodes[node.id] === null} data-clipped={signal.clipped && signal.nodes[node.id] !== null && node.id !== 'input'}
      style={{ gridColumn: positions[node.id][0], gridRow: positions[node.id][1] }}>
      <span>{node.id === 'fx_branch' && state.fxType !== 'off' ? state.fxType === 'delay' ? 'Delay' : 'Klang' : labels[node.id]}{node.id === 'monitor_branch' && <small>{state.monitorPre ? 'PRE' : 'POST'}</small>}</span>
      <span className="signal-node-value">{node.id === 'input' ? state.connected ? 'Tilkoblet' : 'Frakoblet' : formatSignalLevel(signal.nodes[node.id])}</span>
      <span className="signal-node-meter" aria-hidden="true"><i style={{ width: `${signalPercent(signal.nodes[node.id])}%` }} /></span>
    </button>)}
  </div>;
}
