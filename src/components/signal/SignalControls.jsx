import { SignalSlider } from './SignalFields.jsx';
import { SignalNodeControls } from './SignalNodeControls.jsx';
import { signalDiagnosis } from '../../utils/signalSimulation.js';

export function SignalControls({ state, signal, onChange, node, animate, onOpenNode }) {
  const diagnosis = signalDiagnosis(state, signal);
  return <section className="signal-console" aria-label="Signalmikser">
    <div className="signal-quickmix">
      <SignalSlider label="Preamp-gain" shortLabel="Gain" min={0} max={60} value={state.gain} onChange={gain => onChange({ gain })} />
      <SignalSlider label="Kanalfader i signalveien" shortLabel="Kanalfader" min={-60} max={0} infinity value={state.fader} onChange={fader => onChange({ fader })} />
    </div>
    <div className="signal-node-controls" role="region" aria-label={`Kontroller: ${node.label}`}>
      <SignalNodeControls nodeId={node.id} state={state} signal={signal} onChange={onChange} animate={animate} />
    </div>
    <details className="signal-diagnosis" data-tone={diagnosis.tone}>
      <summary>{diagnosis.title}</summary><p>{diagnosis.text}</p>
    </details>
    <button type="button" className="signal-detail-link" onClick={() => onOpenNode(node)}>Flere verktøy, teori og video →</button>
  </section>;
}
