import { useId } from 'react';

export function SignalSlider({ label, shortLabel, value, min, max, step = 1, unit = 'dB', infinity = false, onChange, help }) {
  const id = useId();
  const display = infinity && value <= -60 ? '−∞ dB' : `${value}${unit ? ` ${unit}` : ''}`;
  return <div className="signal-field">
    <div><label htmlFor={id}>{shortLabel || label}</label><output htmlFor={id}>{display}</output></div>
    <input id={id} aria-label={label} type="range" min={min} max={max} step={step} value={value} aria-valuetext={display} aria-describedby={help ? `${id}-help` : undefined} onChange={event => onChange(Number(event.target.value))} />
    {help && <p id={`${id}-help`}>{help}</p>}
  </div>;
}

export function SignalToggle({ label, value, onChange, warning = false }) {
  return <button type="button" className="signal-toggle" aria-pressed={value} data-warning={warning} onClick={() => onChange(!value)}><span>{label}</span><span>{value ? 'PÅ' : 'AV'}</span></button>;
}

export function SignalChoices({ label, value, options, onChange }) {
  return <fieldset className="signal-choices"><legend>{label}</legend><div>{options.map(option => <button type="button" key={String(option.value)} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div></fieldset>;
}
