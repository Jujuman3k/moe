import { AlertTriangle, AudioLines, Cable, Check, VolumeX } from 'lucide-react';
import { signalDiagnosis } from '../../utils/signalSimulation.js';
import { SignalMeter } from './SignalMeter.jsx';

function LevelSlider({ label, value, min, max, onChange, help, id }) {
  const valueText = value <= -60 ? '−∞ dB' : `${value > 0 ? '+' : ''}${value} dB`;
  return <div>
    <div className="flex items-baseline justify-between gap-3"><label className="text-sm font-semibold text-slate-200" htmlFor={id}>{label}</label><output htmlFor={id} className="font-mono text-sm text-teal-300">{valueText}</output></div>
    <input id={id} aria-valuetext={valueText} aria-describedby={`${id}-help`} type="range" min={min} max={max} step="1" value={value} onChange={event => onChange(Number(event.target.value))} className="signal-range w-full" />
    <p id={`${id}-help`} className="text-xs leading-relaxed text-slate-400">{help}</p>
  </div>;
}

function Toggle({ label, enabled, onClick, icon, warning = false }) {
  const Icon = icon;
  return <button type="button" aria-pressed={enabled} onClick={onClick} className="signal-toggle" data-enabled={enabled} data-warning={warning}>
    <Icon size={15} aria-hidden="true" className="shrink-0" /><span className="flex-1 text-left">{label}</span><span className="font-mono text-[10px]">{enabled ? 'PÅ' : 'AV'}</span>
  </button>;
}

function SignalWave({ signal }) {
  // A normalized illustrative sine; clipping is applied BEFORE downstream attenuation.
  const amplitude = signal.requested === null ? 0 : 10 ** (signal.requested / 20);
  const points = Array.from({ length: 161 }, (_, index) => {
    const value = Math.max(-1, Math.min(1, amplitude * Math.sin(index / 160 * Math.PI * 8)));
    return `${index * 2},${32 - value * 25}`;
  }).join(' ');
  return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
    <div className="flex items-center justify-between gap-2 text-[10px]"><span className="text-slate-400">Bølge etter gain · illustrasjon</span><span className={signal.clipped ? 'text-rose-300' : 'text-teal-300'}>{signal.clipped ? 'KLIPPING' : signal.input === null ? 'INGEN KILDE' : 'UTEN KLIPPING'}</span></div>
    <svg viewBox="0 0 320 64" className="h-16 w-full" role="img" aria-label={signal.input === null ? 'Flat linje uten inngangssignal' : signal.clipped ? 'Bølgen klippes flatt ved den digitale grensen' : 'Signalbølge innenfor den digitale grensen'} preserveAspectRatio="none">
      <path d="M0,7 H320 M0,57 H320" stroke="#9f1239" strokeDasharray="3 5" strokeWidth="1" /><path d="M0,32 H320" stroke="#1e293b" />
      <polyline points={points} fill="none" stroke={signal.clipped ? '#fb7185' : '#2dd4bf'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  </div>;
}

export function SignalControls({ state, signal, onChange }) {
  const diagnosis = signalDiagnosis(state, signal);
  return <section id="signal-mixer" className="signal-console scroll-mt-24" aria-label="Signalmikser">
    <div className="signal-controls-grid">
      <div className="space-y-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><AudioLines size={17} className="text-teal-300" /> Prøv selv</h3>
        <LevelSlider id="lab-gain" label="Preamp-gain" value={state.gain} min={0} max={60} onChange={gain => onChange({ gain })} help="Påvirker alle veiene etter inngangen." />
        <LevelSlider id="lab-fader" label="Kanalfader i signalveien" value={state.fader} min={-60} max={0} onChange={fader => onChange({ fader })} help="Påvirker Main LR og post-fade-sendinger." />
        <SignalWave signal={signal} />
      </div>
      <div className="space-y-5">
        <fieldset><legend className="mb-3 text-sm font-semibold text-white">Monitorens uttak</legend>
          <div className="grid grid-cols-2 gap-2">{[[true, 'Pre-fade'], [false, 'Post-fade']].map(([value, label]) => <button type="button" className="signal-mode-button" key={label} aria-pressed={state.monitorPre === value} onClick={() => onChange({ monitorPre: value })}>{label}<span className="block text-[10px] font-normal opacity-70">{value ? 'Før faderen' : 'Etter faderen'}</span></button>)}</div>
        </fieldset>
        <LevelSlider id="lab-monitor" label="Send til monitor" value={state.monitorSend} min={-60} max={0} onChange={monitorSend => onChange({ monitorSend })} help="Eget nivå til sangeren på scenen." />
        <LevelSlider id="lab-fx" label="Send til FX" value={state.fxSend} min={-60} max={0} onChange={fxSend => onChange({ fxSend })} help="Post-fade i dette eksemplet. Returen har eget av/på-valg." />
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Koblinger og mute</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          <Toggle label="Inngang tilkoblet" icon={Cable} enabled={state.connected} onClick={() => onChange({ connected: !state.connected })} />
          <Toggle label="Kanal-mute" icon={VolumeX} enabled={state.muted} warning onClick={() => onChange({ muted: !state.muted })} />
          <Toggle label="Til Main LR" icon={Check} enabled={state.mainAssigned} onClick={() => onChange({ mainAssigned: !state.mainAssigned })} />
          <Toggle label="FX-retur til Main" icon={Check} enabled={state.fxReturn} onClick={() => onChange({ fxReturn: !state.fxReturn })} />
        </div>
        <div className="signal-diagnosis" data-tone={diagnosis.tone} role="status">
          <p className="flex items-start gap-2 text-sm font-semibold">{diagnosis.tone !== 'teal' && <AlertTriangle size={17} className="mt-0.5 shrink-0" />}{diagnosis.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{diagnosis.text}</p>
        </div>
      </div>
    </div>
    <div className="signal-output-strip" aria-label="Resultat av innstillingene">
      <SignalMeter label="Main LR · tørr stemme" level={signal.main} clipped={signal.clipped} />
      <SignalMeter label="Til monitor" level={signal.monitor} tone="blue" clipped={signal.clipped} />
      <SignalMeter label="Til FX" level={signal.fx} tone="purple" clipped={signal.clipped} />
    </div>
  </section>;
}
