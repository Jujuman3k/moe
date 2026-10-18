import { signalWaves, wavePath } from '../../utils/signalWaves.js';

export function SignalScope({ state, signal, node, animate }) {
  const waves = signalWaves(state, signal, node.id);
  const fxVisible = ['fx_branch', 'mixbus', 'matrix', 'speakers'].includes(node.id);
  return <figure className={`signal-scope ${animate ? '' : 'signal-motion-paused'}`} aria-label={`Bølgevisning: ${node.label}`}>
    <figcaption><span>{node.id === 'fx_branch' ? 'Send → effektretur' : `Før / etter ${node.id === 'preamp' ? 'gain' : node.label.split(' / ')[0]}`}</span><span className="scope-legend"><i className="scope-before" /> Før <i className="scope-after" /> Etter {fxVisible && <><i className="scope-wet" /> FX</>}</span></figcaption>
    <svg viewBox="0 0 640 100" preserveAspectRatio="none" role="img" aria-label="Sammenligning av signal før og etter valgt ledd">
      <path d="M0,50 H640 M160,0 V100 M320,0 V100 M480,0 V100" stroke="#243047" strokeWidth="1" />
      <path data-wave="before" d={wavePath(waves.before, waves.zoom)} stroke="#64748b" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
      <path data-wave="after" d={wavePath(waves.after, waves.zoom)} stroke={signal.clipped ? '#fb7185' : '#2dd4bf'} strokeWidth="2" fill="none" />
      {fxVisible && <path data-wave="wet" d={wavePath(waves.wet, waves.zoom)} stroke="#c084fc" strokeWidth="2" fill="none" />}
      <path d="M0,0 V100" className="scope-playhead" stroke="#e2e8f033" strokeWidth="2" />
    </svg>
    <div className="scope-caption"><span>{fxVisible && state.fxType !== 'off' ? state.fxType === 'delay' ? `Delay · ${state.delayMs} ms · ${state.feedback}% feedback` : `Klang · ${state.decay.toFixed(1)} s` : signal.clipped ? 'Klipping oppstår før faderen' : 'Bølgeskisse · felles zoom for før/etter'}</span><span>{waves.duration === 400 ? '0–0,4 s' : '0–2,4 s'}</span></div>
  </figure>;
}
