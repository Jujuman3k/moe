import { Speaker } from 'lucide-react';
import { SignalChoices, SignalSlider, SignalToggle } from './SignalFields.jsx';
import { SignalMeter } from './SignalMeter.jsx';
import { formatSignalLevel } from '../../utils/signalSimulation.js';

export function SignalNodeControls({ nodeId, panel, state, signal, onChange, animate, audio, onOpenAudio }) {
  const audible = Boolean(audio?.source);
  const gain = <SignalSlider label="Preamp-gain" shortLabel="Gain" min={0} max={60} value={state.gain} onChange={gain => onChange({ gain })} />;
  const fader = <SignalSlider label="Kanalfader i signalveien" shortLabel="Kanalfader" min={-60} max={0} infinity value={state.fader} onChange={fader => onChange({ fader })} />;
  const matrix = <SignalSlider label="Matrix til PA" min={-60} max={0} infinity value={state.matrixLevel} onChange={matrixLevel => onChange({ matrixLevel })} />;
  const main = <SignalSlider label="Main-fader" min={-60} max={0} infinity value={state.mainLevel} onChange={mainLevel => onChange({ mainLevel })} />;
  const effects = <SignalChoices label="Effekt" value={state.fxType} onChange={fxType => onChange({ fxType })} options={[{ value: 'off', label: 'Av' }, { value: 'reverb', label: 'Klang' }, { value: 'delay', label: 'Delay' }]} />;
  switch (nodeId) {
    case 'input': return panel === 'source' ? <>
      <SignalToggle label="Inngang tilkoblet" value={state.connected} onChange={connected => onChange({ connected })} />
      <SignalSlider label="Kildenivå" min={-72} max={-24} value={state.sourceLevel} unit="dBFS ved 0 gain" onChange={sourceLevel => onChange({ sourceLevel })} />
    </> : audible ? <><p className="node-result">Du mikser nå {audio.source.label.toLowerCase()}. Testtonen gjelder den lydløse bølgeskissen.</p><button type="button" className="secondary-button" onClick={onOpenAudio}>Velg lyd eller bølgeskisse</button></> : <>
      <SignalChoices label="Testsignal" value={state.sourceKind} onChange={sourceKind => onChange({ sourceKind })} options={[{ value: 'pulse', label: 'Tonepuls' }, { value: 'sine', label: 'Sinus' }]} />
      <SignalSlider label="Testtonefrekvens" min={60} max={1000} value={state.frequency} unit="Hz" onChange={frequency => onChange({ frequency })} />
      <p className="panel-tip">Frekvensen styrer HPF-responsen. Bølgen tegnes langsommere.</p>
    </>;
    case 'preamp': return panel === 'gain' ? <>{gain}<div className="node-result">Headroom: <strong>{signal.preamp === null ? 'Ingen kilde' : `${Math.max(0, -signal.preamp).toFixed(0)} dB`}</strong>. La det være plass til sterkere topper.</div></> : <>
      <div className="signal-presets"><button onClick={() => onChange({ gain: 30, sourceLevel: -48 })}>Godt utgangspunkt</button><button onClick={() => onChange({ gain: 54, sourceLevel: -48 })}>Vis klipping</button></div>
      {fader}<p className="panel-tip">En lavere fader reparerer ikke klipping i inngangen.</p>
    </>;
    case 'processing':
      if (panel === 'hpf') return <><SignalToggle label="Høypassfilter" value={state.hpf} onChange={hpf => onChange({ hpf })} /><SignalSlider label="HPF-frekvens" min={20} max={500} value={state.hpfHz} unit="Hz" onChange={hpfHz => onChange({ hpfHz })} /><p className="panel-tip">{audible ? 'Hør hvordan bunnen endres når du flytter filteret.' : `${state.frequency} Hz dempes ${Math.abs(signal.filterDb).toFixed(1)} dB.`}{state.bypass && ' Bypass er på.'}</p></>;
      if (panel === 'eq') return <><SignalSlider label={audible ? 'EQ-gain' : 'EQ ved testtonen'} min={-12} max={12} value={state.eq} onChange={eq => onChange({ eq })} />{audible ? <SignalSlider label="EQ-frekvens" min={40} max={8000} step={10} value={state.eqHz} unit="Hz" onChange={eqHz => onChange({ eqHz })} /> : <p className="panel-tip">Løft eller kutt ved testtonen.{state.bypass && ' Bypass er på.'}</p>}</>;
      if (panel === 'gate') return <><SignalToggle label="Gate" value={state.gate} onChange={gate => onChange({ gate })} /><SignalSlider label="Gate-terskel" min={-60} max={0} value={state.gateThreshold} unit="dBFS" onChange={gateThreshold => onChange({ gateThreshold })} /><p className="panel-tip">{signal.gateClosed ? 'Porten er stengt.' : 'Signalet slipper videre.'}{state.bypass && ' Bypass er på.'}</p></>;
      if (panel === 'comp') return <><SignalToggle label="Kompressor" value={state.compressor} onChange={compressor => onChange({ compressor })} /><SignalSlider label="Kompressor-terskel" min={-48} max={0} value={state.threshold} unit="dBFS" onChange={threshold => onChange({ threshold })} /><p className="panel-tip">Gain reduction: <strong>{signal.reduction.toFixed(1)} dB</strong>{state.bypass && ' · Bypass på'}</p></>;
      if (panel === 'ratio') return <><SignalSlider label="Ratio" min={1} max={10} value={state.ratio} unit=":1" onChange={ratio => onChange({ ratio })} /><p className="node-result">1:1 gir ingen kompresjon. Høyere ratio demper mer over terskelen. Gain reduction: {signal.reduction.toFixed(1)} dB.</p></>;
      return <><SignalToggle label="Bypass all processing" value={state.bypass} onChange={bypass => onChange({ bypass })} /><p className="node-result">Sammenlign med ubehandlet signal. Alle prosessorinnstillingene beholdes.</p></>;
    case 'fader':
      if (panel === 'gain') return <>{gain}<p className="panel-tip">Gain påvirker også pre-fade-monitoren.</p></>;
      if (panel === 'pan') return <><SignalSlider label="Panorama" min={-100} max={100} value={state.pan} unit="" onChange={pan => onChange({ pan })} /><div className="stereo-meters"><SignalMeter live={!audible} label="Venstre" level={signal.left} /><SignalMeter live={!audible} label="Høyre" level={signal.right} tone="blue" /></div><p className="panel-tip">−100 venstre · 0 midten · +100 høyre</p></>;
      return <>{fader}<SignalToggle label="Kanal-mute" value={state.muted} warning onChange={muted => onChange({ muted })} /><p className="panel-tip">Se bølgen og Main LR mens du drar.</p></>;
    case 'monitor_branch': return panel === 'compare' ? <>{gain}{fader}<p className="panel-tip">{state.monitorPre ? 'Pre-fade: faderen endrer ikke monitoren.' : 'Post-fade: monitoren følger faderen.'}</p></> : <>
      <SignalChoices label="Monitorens uttak" value={state.monitorPre} onChange={monitorPre => onChange({ monitorPre })} options={[{ value: true, label: 'Pre-fade' }, { value: false, label: 'Post-fade' }]} />
      <SignalSlider label="Send til monitor" min={-60} max={0} infinity value={state.monitorSend} onChange={monitorSend => onChange({ monitorSend })} />
    </>;
    case 'fx_branch':
      if (panel === 'type') return <>{effects}<p className="node-result">Velg effekt. Under Klang/delay endrer du halen eller gjentakelsene. {audible ? 'Lytt i pausene mellom tonene.' : 'Tonepuls viser dem tydeligst.'}</p></>;
      if (panel === 'send') return <><SignalSlider label="Send til FX" min={-60} max={0} infinity value={state.fxSend} onChange={fxSend => onChange({ fxSend })} />{fader}<p className="panel-tip">FX-senden er post-fade og følger kanalfaderen.</p></>;
      if (panel === 'return') return <><SignalToggle label="FX-retur til Main" value={state.fxReturn} onChange={fxReturn => onChange({ fxReturn })} /><SignalSlider label="FX-retur nivå" min={-60} max={6} infinity value={state.returnLevel} onChange={returnLevel => onChange({ returnLevel })} /><p className="panel-tip">{state.fxType === 'off' ? 'Effekten er av. Velg klang eller delay under Effekt.' : 'Returen fører effekten tilbake til Main LR.'}</p></>;
      if (state.fxType === 'off') return <>{effects}<p className="panel-tip">Velg klang eller delay for å justere tiden.</p></>;
      if (state.fxType === 'reverb') return <><SignalSlider label="Klangtid" min={0.3} max={3} step={0.1} value={state.decay} unit="s" onChange={decay => onChange({ decay })} /><p className="node-result">Lengre tid lar refleksjonene leve lenger. Følg den lilla halen.</p></>;
      return <><SignalSlider label="Delaytid" min={80} max={800} step={10} value={state.delayMs} unit="ms" onChange={delayMs => onChange({ delayMs })} /><SignalSlider label="Feedback" min={0} max={75} value={state.feedback} unit="%" onChange={feedback => onChange({ feedback })} /><p className="panel-tip">Mer feedback gir flere gjentakelser.</p></>;
    case 'mixbus': return panel === 'main' ? <><SignalToggle label="Til Main LR" value={state.mainAssigned} onChange={mainAssigned => onChange({ mainAssigned })} />{main}</> : <>
      <div className="node-result">Tørr kanal: {formatSignalLevel(signal.main)}<br />FX-retur: {formatSignalLevel(signal.fxReturn)}</div>
      <div className="signal-presets"><button onClick={() => onChange({ mainAssigned: true, fxType: 'off' })}>Bare tørr lyd</button><button onClick={() => onChange({ mainAssigned: false, fxType: 'reverb', fxReturn: true, sourceKind: 'pulse' })}>Bare effektretur</button></div>
    </>;
    case 'matrix': return panel === 'compare' ? <>{main}{matrix}<p className="panel-tip">Matrix endrer PA, uten å endre Main LR.</p></> : <>{matrix}<div className="node-result">Inn: {formatSignalLevel(signal.mix)} → ut: {formatSignalLevel(signal.matrix)}<br />En egen volumkontroll for denne sonen.</div></>;
    case 'speakers': return panel === 'level' ? <>{matrix}<p className="node-result">PA: {formatSignalLevel(signal.pa)}. Elektrisk nivå, ikke lydtrykk i rommet.</p></> : <>
      <SignalToggle label="PA-utgang aktiv" value={state.paEnabled} onChange={paEnabled => onChange({ paEnabled })} />
      <div className={`speaker-scene ${signal.pa !== null && animate ? 'speaker-live' : ''}`}><i /><i /><Speaker size={30} /><span>{signal.pa === null ? 'Stille i denne utgangen' : 'Signal framme ved PA'}</span></div>
    </>;
    default: return null;
  }
}
