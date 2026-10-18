import { useId } from 'react';
import { BookOpen, Undo2 } from 'lucide-react';
import { SignalSlider, SignalToggle } from '../SignalFields.jsx';
import { frequencyLabel, frequencyPosition, positionFrequency, proBands, proPages, proPanels } from '../../../data/proAudioSettings.js';

function Frequency({ label, value, min = 20, max = 20000, onChange }) {
  const id = useId();
  return <div className="signal-field"><div><label htmlFor={id}>{label}</label><output htmlFor={id}>{frequencyLabel(value)}</output></div><input id={id} aria-label={label} type="range" min={frequencyPosition(min)} max={frequencyPosition(max)} step="0.001" value={frequencyPosition(value)} aria-valuetext={frequencyLabel(value)} onChange={event => onChange(Math.round(positionFrequency(Number(event.target.value))))} /></div>;
}

function Options({ label, value, options, onChange }) {
  const id = useId();
  return <label className="pro-select" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={event => onChange(event.target.value)}>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}

export function ProControls({ nodeId, state, onChange, panel, onPanelChange, page, onPageChange, bandIndex, audio, onHelp, onUndo, canUndo }) {
  const id = useId(); const pro = state.pro;
  const change = (section, patch) => onChange({ pro: { ...pro, [section]: { ...pro[section], ...patch } } });
  const slider = (section, key, label, min, max, unit = 'ms', step = 1) => <SignalSlider label={label} value={pro[section][key]} min={min} max={max} step={step} unit={unit} onChange={value => change(section, { [key]: value })} />;
  const keyControls = section => <><SignalToggle label="Sidechain-filter" value={pro[section].keyEnabled} onChange={keyEnabled => change(section, { keyEnabled })} /><div className="pro-key-fields"><Frequency label="Key HPF" value={pro[section].keyHPF} max={5000} onChange={keyHPF => change(section, { keyHPF })} /><Frequency label="Key LPF" value={pro[section].keyLPF} min={120} onChange={keyLPF => change(section, { keyLPF })} /></div></>;
  let controls;
  if (nodeId === 'preamp') controls = <><SignalSlider label="Preamp-gain" shortLabel="Gain" min={0} max={60} value={state.gain} onChange={gain => onChange({ gain })} /><SignalSlider label="Digital trim" min={-24} max={24} step={0.5} value={pro.trim} onChange={trim => onChange({ pro: { ...pro, trim } })} /><SignalToggle label="Polarity · vend polaritet" value={pro.polarity} onChange={polarity => onChange({ pro: { ...pro, polarity } })} /></>;
  else if (panel === 'filter') controls = page === 'lpf' ? <><SignalToggle label="Pro LPF · 12 dB/okt" value={pro.filters.lpf} onChange={lpf => change('filters', { lpf })} /><Frequency label="Pro LPF-frekvens" value={pro.filters.lpfHz} min={50} onChange={lpfHz => change('filters', { lpfHz })} /></> : <><Frequency label="Pro HPF-frekvens" value={pro.filters.hpfHz} max={2000} onChange={hpfHz => change('filters', { hpfHz })} /><div className="pro-paired"><SignalToggle label="Pro HPF" value={pro.filters.hpf} onChange={hpf => change('filters', { hpf })} /><Options label="Bratthet" value={pro.filters.slope} options={[[12, '12 dB/okt'], [24, '24 dB/okt']]} onChange={slope => change('filters', { slope: Number(slope) })} /></div></>;
  else if (panel === 'peq') {
    const band = pro.eq.bands[bandIndex]; const meta = proBands[bandIndex];
    const setBand = patch => change('eq', { bands: pro.eq.bands.map((value, index) => index === bandIndex ? { ...value, ...patch } : value) });
    const cut = ['highpass', 'lowpass'].includes(band.type);
    controls = page === 'shape' ? <>
      {band.type === 'peaking' ? <SignalSlider label={`${meta.label} Width`} min={0.11} max={1.5} step={0.01} value={band.width} unit="okt" onChange={width => setBand({ width })} /> : <p className="pro-inline-note">{cut ? 'Filteret kutter med 12 dB/okt.' : 'Hyllen former hele bunnen eller toppen.'} Width gjelder klokkeformen.</p>}
      <div className="pro-paired"><Options label={`${meta.label} Type`} value={band.type} options={[["peaking", "Klokke"], ...(bandIndex === 0 ? [['lowshelf', 'Lav hylle'], ['highpass', 'Høypass']] : bandIndex === 3 ? [['highshelf', 'Høy hylle'], ['lowpass', 'Lavpass']] : [])]} onChange={type => setBand({ type })} /><SignalToggle label={`${meta.label} bånd aktivt`} value={band.enabled} onChange={enabled => setBand({ enabled })} /></div>
    </> : <><Frequency label={`${meta.label} Frekvens`} value={band.frequency} onChange={frequency => setBand({ frequency })} />{cut ? <p className="pro-inline-note">Gain brukes bare for klokke og hylle.</p> : <SignalSlider label={`${meta.label} Gain`} value={band.gain} min={-15} max={15} step={0.5} onChange={gain => setBand({ gain })} />}</>;
  } else if (panel === 'gate') {
    controls = page === 'attack' ? <>{slider('gate', 'attack', 'Gate Attack', 0.05, 300, 'ms', 0.05)}{slider('gate', 'hold', 'Gate Hold', 10, 5000, 'ms', 10)}</>
      : page === 'release' ? <>{slider('gate', 'release', 'Gate Release', 10, 1000, 'ms', 10)}<p className="pro-inline-note">Lang lukking bevarer mer av halen. Kort lukking rydder raskere.</p></>
      : page === 'key' ? keyControls('gate')
      : <>{slider('gate', 'threshold', 'Gate Threshold', -72, 0, 'dBFS', 0.5)}{slider('gate', 'depth', 'Gate Depth', 0, 60, 'dB')}</>;
  } else if (panel === 'comp') {
    controls = page === 'time' ? <>{slider('comp', 'attack', 'Comp Attack', 0.1, 300, 'ms', 0.1)}{slider('comp', 'release', 'Comp Release', 10, 2000, 'ms', 10)}</>
      : page === 'knee' ? <>{slider('comp', 'knee', 'Comp Knee', 0, 24, 'dB')}<Options label="Detektor" value={pro.comp.rms ? 'rms' : 'peak'} options={[["peak", "Peak · topper"], ["rms", "RMS · energi"]]} onChange={value => change('comp', { rms: value === 'rms' })} /></>
      : page === 'output' ? <>{slider('comp', 'makeup', 'Comp Make-up', -12, 24, 'dB', 0.5)}{slider('comp', 'mix', 'Comp Wet', 0, 100, '%')}</>
      : page === 'key' ? keyControls('comp')
      : <>{slider('comp', 'threshold', 'Comp Threshold', -60, 0, 'dBFS', 0.5)}{slider('comp', 'ratio', 'Comp Ratio', 1, 20, ':1', 0.1)}</>;
  } else controls = <><SignalToggle label="Bypass all processing" value={state.bypass} onChange={bypass => onChange({ bypass })} /><p className="pro-inline-note">Pro-innstillingene beholdes. Gain, trim, fader og effekter er fortsatt aktive.</p></>;
  const pages = nodeId === 'preamp' ? [] : proPages[panel];
  function navigateTabs(event) {
    const index = proPanels.findIndex(([value]) => value === panel);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? proPanels.length - 1 : event.key === 'ArrowRight' ? (index + 1) % proPanels.length : event.key === 'ArrowLeft' ? (index + proPanels.length - 1) % proPanels.length : null;
    if (next === null) return;
    event.preventDefault(); onPanelChange(proPanels[next][0]); event.currentTarget.querySelectorAll('[role="tab"]')[next].focus();
  }
  return <section className={`signal-console pro-console ${nodeId === 'preamp' ? 'pro-preamp' : ''}`} aria-label="Pro-signalmikser">
    {nodeId !== 'preamp' && <div className="signal-tabs" role="tablist" aria-label="Pro-prosessorer" onKeyDown={navigateTabs}>{proPanels.map(([value, label]) => <button type="button" key={value} role="tab" id={`${id}-${value}`} aria-selected={panel === value} aria-controls={`${id}-panel`} tabIndex={panel === value ? 0 : -1} onClick={() => onPanelChange(value)}>{label}</button>)}</div>}
    <div className="signal-panel-body pro-panel-body" role={nodeId === 'preamp' ? 'group' : 'tabpanel'} id={`${id}-panel`} aria-labelledby={nodeId === 'preamp' ? undefined : `${id}-${panel}`}>
      {pages.length > 0 && <div className="pro-subpages" role="group" aria-label="Parametergruppe">{pages.map(([value, label]) => <button key={value} type="button" aria-pressed={page === value} onClick={() => onPageChange(value)}>{label}</button>)}</div>}
      <div className="pro-fields">{controls}</div>
      <div className="pro-help-actions"><button type="button" onClick={onHelp}><BookOpen size={14} /> Forklaring{audio.source ? ` · ${audio.source.label}` : ' og startforslag'}</button>{canUndo && <button type="button" aria-label="Angre startforslag" onClick={onUndo}><Undo2 size={14} /> Angre</button>}</div>
    </div>
  </section>;
}
