import { ChevronDown, Cable, AudioLines, SlidersHorizontal, SlidersVertical, Headphones, Waves, Combine, Network, Speaker, Route } from 'lucide-react';
import { signalPathData } from '../../data/signalPathData.js';
import { signalMapStops, signalEdges, routeNames, traceCaption, traceStops } from '../../data/signalRoutes.js';
import { signalPercent, formatSignalLevel } from '../../utils/signalSimulation.js';
import '../../styles/signal-routes.css';

const icons = { input: Cable, preamp: AudioLines, processing: SlidersHorizontal, fader: SlidersVertical, monitor_branch: Headphones, fx_branch: Waves, mixbus: Combine, matrix: Network, speakers: Speaker };

export function SignalMap({ state, signal, activeId, onSelectNode, onOpenDepth, animate, route, onRouteChange }) {
  const stops = traceStops(route, state.monitorPre);
  return <div className={`signal-map flow-map ${animate ? '' : 'signal-motion-paused'}`} role="group" aria-label="Interaktivt signalveikart" data-route={route}>
    <svg viewBox="0 0 400 162" preserveAspectRatio="none" aria-hidden="true" className="signal-connections">
      {signalEdges(signal, state).map(([id, path, [x,y,angle], level, tone, routes]) => {
        const traced = route === 'all' || routes === 'all' || routes.split(' ').includes(route);
        return <g key={id} data-edge={id} data-traced={traced} data-live={level != null} className={`flow-wire flow-wire-${tone}`}>
          <path className="flow-wire-base" d={path} />
          {level != null && traced && <path d={path} className="signal-travelling-line" />}
          <g transform={`translate(${x} ${y}) rotate(${angle})`}><path className="flow-wire-arrow" d="M-2 -2.6L1 0l-3 2.6" /></g>
        </g>;
      })}
    </svg>
    <div className="flow-map-annotations" aria-hidden="true">
      <span className="flow-band-input">01 / Kanal →</span><span className="flow-band-branches">02 / Avgreninger</span><span className="flow-band-house">03 / Ut til salen ←</span>
      <span className="flow-tag-send">Send</span><span className="flow-tag-return" data-live={signal.fxReturn !== null}>FX-retur</span>
    </div>
    <label className="flow-route-picker"><span className="flow-route-eyebrow"><Route size={12} aria-hidden="true" /> Spor ruten</span>
      <b className="flow-route-visible" aria-hidden="true">{routeNames[route]}<ChevronDown size={12} /></b>
      <select aria-label="Fremhev signalvei" value={route} onChange={event => onRouteChange(event.target.value)}>
        {Object.entries(routeNames).map(([id, label]) => <option value={id} key={id}>{label}</option>)}
      </select>
      <small aria-hidden="true">{traceCaption(route, state, signal)}</small>
    </label>
    {signalPathData.map(node => {
      const { cell, label } = signalMapStops[node.id]; const Icon = icons[node.id]; const active = activeId === node.id;
      const level = signal.nodes[node.id]; const clipped = node.id === 'preamp' && signal.clipped;
      const name = node.id === 'fx_branch' && state.fxType !== 'off' ? state.fxType === 'delay' ? 'Delay' : 'Klang' : node.id === 'fx_branch' ? 'FX-send' : label;
      return <button type="button" key={node.id} aria-label={`${node.label} – ${active ? 'se inni leddet' : 'velg ledd'}`} aria-pressed={active}
        title={active ? `Se inni ${node.label}` : node.label} onClick={() => active ? onOpenDepth(node) : onSelectNode(node.id)}
        className="signal-map-node flow-stop" data-node={node.id} data-active={active} data-traced={stops.includes(node.id)} data-silent={level === null} data-clipped={clipped}
        style={{ gridColumn: cell[0], gridRow: cell[1] }}>
        <span className="flow-node-plate"><span className="flow-node-name"><Icon aria-hidden="true" />{name}</span>
          <span className="signal-node-value">{clipped ? 'KLIPP' : node.id === 'monitor_branch' ? <><em>{state.monitorPre ? 'PRE' : 'POST'}</em> {level === null ? 'Stille' : `${Math.round(level)} dBFS`}</> : formatSignalLevel(level)}</span>
          <span className="signal-node-meter" aria-hidden="true"><i style={{ width: `${signalPercent(level)}%` }} /></span>
        </span>
      </button>;
    })}
  </div>;
}
