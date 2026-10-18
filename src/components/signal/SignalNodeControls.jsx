import { useState } from 'react';
import { Speaker } from 'lucide-react';
import { SignalChoices, SignalSlider, SignalToggle } from './SignalFields.jsx';
import { SignalMeter } from './SignalMeter.jsx';
import { formatSignalLevel } from '../../utils/signalSimulation.js';

function ProcessingControls({ state, signal, onChange }) {
  const [view, setView] = useState('hpf');
  return <>
    <SignalChoices label="Velg prosessor" value={view} onChange={setView} options={[{ value: 'hpf', label: 'HPF' }, { value: 'eq', label: 'EQ' }, { value: 'gate', label: 'Gate' }, { value: 'comp', label: 'Comp' }]} />
    {view === 'hpf' && <><SignalToggle label="Høypassfilter" value={state.hpf} onChange={hpf => onChange({ hpf })} /><SignalSlider label="HPF-frekvens" min={20} max={500} value={state.hpfHz} unit="Hz" onChange={hpfHz => onChange({ hpfHz })} help={`Testtonen er ${state.frequency} Hz. Filteret demper den ${Math.abs(signal.filterDb).toFixed(1)} dB.`} /></>}
    {view === 'eq' && <SignalSlider label="EQ ved testtonen" min={-12} max={12} value={state.eq} onChange={eq => onChange({ eq })} help="Et forenklet løft eller kutt ved testfrekvensen. Følg nivået videre i kjeden." />}
    {view === 'gate' && <><SignalToggle label="Gate" value={state.gate} onChange={gate => onChange({ gate })} /><SignalSlider label="Gate-terskel" min={-60} max={0} value={state.gateThreshold} unit="dBFS" onChange={gateThreshold => onChange({ gateThreshold })} /><p className="node-result">{signal.gateClosed ? 'Porten er stengt. Signal inn, men stille videre.' : 'Porten er åpen. Signalet slipper videre.'}</p></>}
    {view === 'comp' && <><SignalToggle label="Kompressor" value={state.compressor} onChange={compressor => onChange({ compressor })} /><SignalSlider label="Kompressor-terskel" min={-48} max={0} value={state.threshold} unit="dBFS" onChange={threshold => onChange({ threshold })} /><SignalSlider label="Ratio" min={1} max={10} value={state.ratio} unit=":1" onChange={ratio => onChange({ ratio })} /><p className="node-result">Gain reduction: <strong>{signal.reduction.toFixed(1)} dB</strong>. Sammenlign stiplet kurve med den grønne.</p></>}
    <SignalToggle label="Bypass all processing" value={state.bypass} onChange={bypass => onChange({ bypass })} />
  </>;
}

export function SignalNodeControls({ nodeId, state, signal, onChange, animate }) {
  switch (nodeId) {
    case 'input': return <>
      <SignalToggle label="Inngang tilkoblet" value={state.connected} onChange={connected => onChange({ connected })} />
      <SignalChoices label="Testsignal" value={state.sourceKind} onChange={sourceKind => onChange({ sourceKind })} options={[{ value: 'pulse', label: 'Tonepuls' }, { value: 'sine', label: 'Sinus' }]} />
      <SignalSlider label="Kildenivå" min={-72} max={-24} value={state.sourceLevel} unit="dBFS ved 0 gain" onChange={sourceLevel => onChange({ sourceLevel })} />
      <SignalSlider label="Testtonefrekvens" min={60} max={1000} value={state.frequency} unit="Hz" onChange={frequency => onChange({ frequency })} help="Frekvensen brukes i HPF-beregningen. Bølgen tegnes langsommere så formen er lett å se." />
    </>;
    case 'preamp': return <>
      <div className="node-metric"><span>Plass til sterkere topper</span><strong>{signal.preamp === null ? 'Ingen kilde' : `${Math.max(0, -signal.preamp).toFixed(0)} dB`}</strong></div>
      <div className="signal-presets"><button onClick={() => onChange({ gain: 30, sourceLevel: -48 })}>Godt utgangspunkt</button><button onClick={() => onChange({ gain: 54, sourceLevel: -48 })}>Vis klipping</button></div>
      <p className="node-result">Endre gain i hurtigmiksen. For høy gain flater ut bølgetoppene. Senker du faderen etterpå, følger forvrengningen fortsatt med.</p>
    </>;
    case 'processing': return <ProcessingControls state={state} signal={signal} onChange={onChange} />;
    case 'fader': return <>
      <SignalToggle label="Kanal-mute" value={state.muted} warning onChange={muted => onChange({ muted })} />
      <SignalSlider label="Panorama" min={-100} max={100} value={state.pan} unit="" onChange={pan => onChange({ pan })} help="−100 = venstre · 0 = midten · +100 = høyre. Lik effekt i L/R ved senter gir −3 dB per side." />
      <div className="stereo-meters"><SignalMeter label="Venstre" level={signal.left} /><SignalMeter label="Høyre" level={signal.right} tone="blue" /></div>
    </>;
    case 'monitor_branch': return <>
      <SignalChoices label="Monitorens uttak" value={state.monitorPre} onChange={monitorPre => onChange({ monitorPre })} options={[{ value: true, label: 'Pre-fade' }, { value: false, label: 'Post-fade' }]} />
      <SignalSlider label="Send til monitor" min={-60} max={0} infinity value={state.monitorSend} onChange={monitorSend => onChange({ monitorSend })} />
      <p className="node-result">{state.monitorPre ? 'Monitoren er uavhengig av kanalfaderen. Gain og processing påvirker den fortsatt.' : 'Monitoren følger kanalfaderen. Dra i hurtigmiksen og se den blå måleren.'}</p>
    </>;
    case 'fx_branch': return <>
      <SignalChoices label="Effekt" value={state.fxType} onChange={fxType => onChange({ fxType })} options={[{ value: 'off', label: 'Av' }, { value: 'reverb', label: 'Klang' }, { value: 'delay', label: 'Delay' }]} />
      <SignalSlider label="Send til FX" min={-60} max={0} infinity value={state.fxSend} onChange={fxSend => onChange({ fxSend })} />
      {state.fxType === 'reverb' && <SignalSlider label="Klangtid" min={0.3} max={3} step={0.1} value={state.decay} unit="s" onChange={decay => onChange({ decay })} help="Lengre tid lar refleksjonene leve lenger. Se den lilla halen." />}
      {state.fxType === 'delay' && <><SignalSlider label="Delaytid" min={80} max={800} step={10} value={state.delayMs} unit="ms" onChange={delayMs => onChange({ delayMs })} /><SignalSlider label="Feedback" min={0} max={75} value={state.feedback} unit="%" onChange={feedback => onChange({ feedback })} help="Mer feedback gir flere gjentakelser. Tonepuls viser dem tydeligst." /></>}
      <SignalToggle label="FX-retur til Main" value={state.fxReturn} onChange={fxReturn => onChange({ fxReturn })} />
      <SignalSlider label="FX-retur nivå" min={-60} max={6} infinity value={state.returnLevel} onChange={returnLevel => onChange({ returnLevel })} />
    </>;
    case 'mixbus': return <>
      <SignalToggle label="Til Main LR" value={state.mainAssigned} onChange={mainAssigned => onChange({ mainAssigned })} />
      <SignalSlider label="Main-fader" min={-60} max={0} infinity value={state.mainLevel} onChange={mainLevel => onChange({ mainLevel })} />
      <div className="node-result">Tørr kanal: {formatSignalLevel(signal.main)}<br />FX-retur: {formatSignalLevel(signal.fxReturn)}<br />Main LR summerer begge veiene.</div>
      <div className="signal-presets"><button onClick={() => onChange({ mainAssigned: true, fxType: 'off' })}>Bare tørr lyd</button><button onClick={() => onChange({ mainAssigned: false, fxType: 'reverb', fxReturn: true, sourceKind: 'pulse' })}>Bare effektretur</button></div>
    </>;
    case 'matrix': return <>
      <SignalSlider label="Matrix til PA" min={-60} max={0} infinity value={state.matrixLevel} onChange={matrixLevel => onChange({ matrixLevel })} help="Endrer denne utgangen. Main LR og monitoren endres ikke." />
      <div className="node-metric"><span>Inn → ut</span><strong>{formatSignalLevel(signal.mix)} → {formatSignalLevel(signal.matrix)}</strong></div>
      <p className="node-result">Tenk på matrix som en egen volumkontroll for en sone. Her er PA valgt. På en ekte mikser kan andre matriser mate foajé, frontfill eller stream.</p>
    </>;
    case 'speakers': return <>
      <SignalToggle label="PA-utgang aktiv" value={state.paEnabled} onChange={paEnabled => onChange({ paEnabled })} />
      <div className={`speaker-scene ${signal.pa !== null && animate ? 'speaker-live' : ''}`}><i /><i /><Speaker size={42} /><span>{signal.pa === null ? 'Stille i denne utgangen' : 'Signal framme ved PA'}</span></div>
      <p className="node-result">Elektrisk nivå: {formatSignalLevel(signal.pa)}. Dette er ikke lydtrykk i rommet. Bruk matrixen for å endre nivået til denne sonen.</p>
    </>;
    default: return null;
  }
}
