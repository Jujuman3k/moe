import { useId } from 'react';
import { signalPathData } from '../../data/signalPathData.js';
import { IconHelper } from '../ui/IconHelper.jsx';
import { SignalMeter } from './SignalMeter.jsx';

const shortLabels = { input: 'Mikrofon', preamp: 'Gain', processing: 'Processing', fader: 'Fader', mixbus: 'Main LR', matrix: 'Matrix', speakers: 'PA', monitor_branch: 'Monitor', fx_branch: 'FX' };
const positions = { input: 1, preamp: 2, processing: 3, fader: 4, mixbus: 5, matrix: 6, speakers: 7 };

function FlowLine({ path, active, color, marker }) {
  return <g>
    <path d={path} stroke="#334155" strokeWidth="2" fill="none" markerEnd={`url(#${marker})`} />
    {active && <path d={path} stroke={color} strokeWidth="3" fill="none" className="signal-travelling-line" />}
  </g>;
}

function Connections({ mobile, state, signal }) {
  const marker = useId();
  const color = signal.clipped ? '#fb7185' : '#2dd4bf';
  const links = [
    ['input', 'preamp'], ['preamp', 'processing'], ['processing', 'fader'], ['fader', 'mixbus'], ['mixbus', 'matrix'], ['matrix', 'speakers'],
  ];
  return (
    <svg aria-hidden="true" className={`signal-connections ${mobile ? 'signal-connections-mobile' : 'signal-connections-desktop'}`} viewBox={mobile ? '0 0 300 616' : '0 0 700 248'} preserveAspectRatio="none">
      <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="#64748b" strokeWidth="2" /></marker></defs>
      {links.map(([from, to]) => {
        const a = positions[from]; const b = positions[to];
        return <FlowLine key={to} marker={marker} color={color} active={signal.nodes[to] !== null}
          path={mobile ? `M150,${(a - 1) * 88 + 80} V${(b - 1) * 88 + 8}` : `M${(a - 1) * 100 + 92},62 H${(b - 1) * 100 + 8}`} />;
      })}
      <FlowLine marker={marker} color={signal.clipped ? color : '#60a5fa'} active={signal.monitor !== null}
        path={mobile ? (state.monitorPre ? 'M150,220 H50 V272' : 'M150,308 H92') : (state.monitorPre ? 'M250,62 V126 H150 V150' : 'M350,62 V126 H150 V150')} />
      <FlowLine marker={marker} color={signal.clipped ? color : '#c084fc'} active={signal.fx !== null}
        path={mobile ? 'M150,308 H250 V360' : 'M350,62 V186 H408'} />
      <FlowLine marker={marker} color={signal.clipped ? color : '#c084fc'} active={signal.fxReturn !== null}
        path={mobile ? 'M250,396 H192' : 'M450,186 H500 V62 H492'} />
    </svg>
  );
}

export function SignalMap({ state, signal, activeId, onOpenNode, animate }) {
  return (
    <div className={`signal-map-surface ${animate ? '' : 'signal-motion-paused'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
        <p className="text-xs text-slate-400">Trykk på et ledd for verktøy og fordypning</p>
        <div className="flex gap-3 text-[10px] font-medium sm:text-xs"><span className="text-teal-300">● Sal</span><span className="text-blue-300">● Monitor</span><span className="text-purple-300">● FX → retur</span></div>
      </div>
      <div className="signal-map" role="group" aria-label="Interaktivt signalveikart">
        <Connections mobile state={state} signal={signal} />
        <Connections state={state} signal={signal} />
        {signalPathData.map(node => {
          const level = signal.nodes[node.id];
          const branch = node.id === 'monitor_branch' ? 'monitor' : node.id === 'fx_branch' ? 'fx' : null;
          return <button type="button" key={node.id} aria-label={`${node.label} – åpne verktøy`} onClick={() => onOpenNode(node)}
            className="signal-map-node" data-node={node.id} data-active={node.id === activeId} data-silent={level === null} data-clipped={signal.clipped && level !== null && node.id !== 'input'}
            style={{ '--signal-step': positions[node.id] || 1 }}>
            <span className="flex items-center justify-between gap-1"><IconHelper name={node.iconName} size={16} /><span className="signal-node-tag">{branch === 'monitor' ? state.monitorPre ? 'PRE' : 'POST' : branch === 'fx' ? 'POST' : `${positions[node.id]}`}</span></span>
            <span className="block truncate text-[11px] font-semibold text-white sm:text-xs">{shortLabels[node.id]}</span>
            {node.id === 'input' ? <span className="block text-[10px] text-slate-400">{state.connected ? 'Kilde tilkoblet' : 'Frakoblet'}</span> : <SignalMeter compact label={`${shortLabels[node.id]} signalnivå`} level={level} clipped={signal.clipped} tone={branch === 'monitor' ? 'blue' : branch === 'fx' ? 'purple' : 'teal'} />}
          </button>;
        })}
        <span className="signal-map-note signal-monitor-note">{state.monitorPre ? 'Før faderen' : 'Etter faderen'}</span>
        <span className="signal-map-note signal-fx-note">{state.fxReturn ? 'Retur til Main LR ↗' : 'Retur slått av'}</span>
      </div>
      <p className="px-4 pb-4 text-[10px] leading-relaxed text-slate-500 sm:px-6">Main → Matrix → PA viser den tørre stemmen. FX-returen er en egen vei inn i miksen.</p>
    </div>
  );
}
