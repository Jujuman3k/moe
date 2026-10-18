import { useId } from 'react';
import { signalPanels } from '../../data/signalPanels.js';
import { SignalNodeControls } from './SignalNodeControls.jsx';

export function SignalControls({ state, signal, onChange, node, animate, panel, onPanelChange, audio, onOpenAudio }) {
  const id = useId();
  const panels = signalPanels[node.id];
  function navigateTabs(event) {
    const index = panels.findIndex(([value]) => value === panel);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : event.key === 'ArrowRight' ? (index + 1) % panels.length : event.key === 'ArrowLeft' ? (index + panels.length - 1) % panels.length : null;
    if (next === null) return;
    event.preventDefault();
    onPanelChange(panels[next][0]);
    event.currentTarget.querySelectorAll('[role="tab"]')[next].focus();
  }
  return <section className="signal-console" aria-label="Signalmikser">
    <div className="signal-tabs" role="tablist" aria-label={`Kontrollfaner: ${node.label}`} onKeyDown={navigateTabs}>
      {panels.map(([value, label]) => <button type="button" key={value} role="tab" id={`${id}-${value}`} aria-selected={panel === value} aria-controls={`${id}-panel`} tabIndex={panel === value ? 0 : -1} onClick={() => onPanelChange(value)}>{label}</button>)}
    </div>
    <div key={`${node.id}-${panel}`} className="signal-panel-body" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${panel}`} tabIndex={0}>
      <div className="signal-node-controls"><SignalNodeControls nodeId={node.id} panel={panel} state={state} signal={signal} onChange={onChange} animate={animate} audio={audio} onOpenAudio={onOpenAudio} /></div>
    </div>
  </section>;
}
