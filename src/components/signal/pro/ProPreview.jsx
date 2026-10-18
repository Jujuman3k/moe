import { useEffect, useMemo, useRef, useState } from 'react';
import { proBands, frequencyPosition, positionFrequency, frequencyLabel } from '../../../data/proAudioSettings.js';
import { proFilterSpecs, responseDb } from '../../../audio/proFilters.js';
import { compressionReduction } from '../../../audio/proDynamics.worklet.js';
import { SignalMeter } from '../SignalMeter.jsx';

const x = frequency => 36 + frequencyPosition(frequency) * 580;
const dynamicsX = level => 36 + (Math.max(-72, Math.min(0, level)) + 72) / 72 * 580;
const frequencies = Array.from({ length: 200 }, (_, i) => positionFrequency(i / 199));
const curvePath = (specs, rate, height) => frequencies.map((frequency, i) => `${i ? 'L' : 'M'}${x(frequency).toFixed(2)},${((height - 16) / 2 - Math.max(-18, Math.min(18, responseDb(specs, frequency, rate))) * (height - 50) / 36).toFixed(2)}`).join(' ');

export function ProPreview({ state, signal, panel, bandIndex, onBandChange, onChange, audio, animate }) {
  const svg = useRef(null); const drag = useRef(null); const spectrum = useRef(null);
  const [rta, setRta] = useState(true); const [sampleRate, setSampleRate] = useState(48000);
  const [plotHeight, setPlotHeight] = useState(220);
  const bottom = plotHeight - 33; const zero = (plotHeight - 16) / 2; const scale = (plotHeight - 50) / 36;
  const y = gain => zero - Math.max(-18, Math.min(18, gain)) * scale;
  const dynamicsY = level => bottom - (Math.max(-72, Math.min(0, level)) + 72) / 72 * (plotHeight - 50);
  useEffect(() => {
    const observer = new ResizeObserver(entries => { const box = entries[0].contentRect; if (box.width && box.height) setPlotHeight(Math.max(100, box.height / box.width * 640)); });
    observer.observe(svg.current); return () => observer.disconnect();
  }, []);
  const pro = state.pro;
  const dynamic = panel === 'gate' || panel === 'comp';
  const specs = useMemo(() => proFilterSpecs(pro, state.bypass), [pro, state.bypass]);
  const curves = useMemo(() => ({ total: curvePath(specs, sampleRate, plotHeight), bands: specs.slice(3).map(spec => curvePath([spec], sampleRate, plotHeight)) }), [specs, sampleRate, plotHeight]);
  const settings = dynamic ? pro[panel] : null;
  const active = dynamic ? settings.enabled && !state.bypass : pro.eq.enabled && !state.bypass;
  const { readSpectrum, playing } = audio;
  useEffect(() => {
    let frame; let previous = -Infinity;
    function draw(now) {
      if (now - previous >= 70) {
        const data = playing ? readSpectrum() : null;
        let path = '';
        if (data) setSampleRate(rate => rate === data.sampleRate ? rate : data.sampleRate);
        if (data && rta && !dynamic) {
          for (let i = 0; i < 100; i++) {
            const frequency = positionFrequency(i / 99);
            const index = Math.min(data.values.length - 1, Math.round(frequency / (data.sampleRate / 2) * data.values.length));
            const level = Math.max(-100, Math.min(0, data.values[index]));
            path += `${i ? 'L' : 'M'}${x(frequency).toFixed(1)},${(bottom - (level + 100) / 100 * (plotHeight - 50)).toFixed(1)} `;
          }
        }
        spectrum.current?.setAttribute('d', path ? `${path} L616,${bottom} L36,${bottom} Z` : ''); previous = now;
      }
      if (playing && animate) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame);
  }, [readSpectrum, playing, rta, dynamic, animate, bottom, plotHeight]);
  function setBand(index, patch) { onChange({ pro: { ...pro, eq: { ...pro.eq, bands: pro.eq.bands.map((band, i) => i === index ? { ...band, ...patch } : band) } } }); }
  function position(event) {
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.current.getScreenCTM().inverse());
  }
  function move(event) {
    const target = drag.current; if (!target) return;
    const point = position(event);
    if (target.kind === 'threshold') {
      const threshold = Math.round(Math.max(panel === 'comp' ? -60 : -72, Math.min(0, (point.x - 36) / 580 * 72 - 72)) * 2) / 2;
      onChange({ pro: { ...pro, [panel]: { ...settings, threshold } } });
    } else if (target.kind === 'filter') {
      const frequency = Math.round(positionFrequency((point.x - 36) / 580));
      onChange({ pro: { ...pro, filters: { ...pro.filters, [target.id === 'hpf' ? 'hpfHz' : 'lpfHz']: Math.max(target.id === 'hpf' ? 20 : 50, Math.min(target.id === 'hpf' ? 2000 : 20000, frequency)) } } });
    } else {
      const band = pro.eq.bands[target.index];
      const cut = ['highpass', 'lowpass'].includes(band.type);
      setBand(target.index, { frequency: Math.round(positionFrequency((point.x - 36) / 580)), ...(!cut ? { gain: Math.max(-15, Math.min(15, Math.round((zero - point.y) / scale * 2) / 2)) } : {}) });
    }
  }
  function begin(event, target) { event.preventDefault(); drag.current = target; event.currentTarget.setPointerCapture(event.pointerId); if (target.kind === 'band') onBandChange(target.index); }
  function end() { drag.current = null; }
  function bandKey(event, index) {
    const band = pro.eq.bands[index]; const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(key)) return;
    event.preventDefault(); onBandChange(index);
    if (key === 'Enter' || key === ' ') return;
    if (key === 'ArrowLeft' || key === 'ArrowRight') setBand(index, { frequency: Math.round(Math.max(20, Math.min(20000, band.frequency * 2 ** ((key === 'ArrowRight' ? 1 : -1) / 12)))) });
    else if (!['highpass', 'lowpass'].includes(band.type)) setBand(index, { gain: Math.max(-15, Math.min(15, band.gain + (key === 'ArrowUp' ? 0.5 : -0.5))) });
  }
  const dynamicPath = dynamic ? Array.from({ length: 145 }, (_, i) => {
    const input = -72 + i / 2;
    const reduction = !active ? 0 : panel === 'gate' ? input < settings.threshold ? settings.depth : 0 : compressionReduction(input, settings.threshold, settings.ratio, settings.knee);
    const output = input - reduction;
    return `${i ? 'L' : 'M'}${dynamicsX(input).toFixed(1)},${dynamicsY(output).toFixed(1)}`;
  }).join(' ') : '';
  const inputLevel = panel === 'gate' ? signal.proFiltered : signal.proEqualized;
  const outputLevel = panel === 'gate' ? signal.proGated : signal.proCompressed;
  const reduction = dynamic ? panel === 'gate' ? signal.gateReduction || 0 : signal.reduction || 0 : 0;
  return <div className="signal-preview signal-pro-preview">
    <figure className="pro-graph">
      <figcaption><span>{dynamic ? `${panel === 'gate' ? 'GATE' : 'KOMPRESSOR'} · INN → UT` : 'PEQ + FILTRE · FREKVENSRESPONS'}</span><div>{(dynamic || panel === 'peq') && <button type="button" aria-label={dynamic ? `${panel === 'gate' ? 'Pro Gate' : 'Pro Kompressor'}` : 'Pro PEQ'} aria-pressed={dynamic ? settings.enabled : pro.eq.enabled} onClick={() => { const section = dynamic ? panel : 'eq'; onChange({ pro: { ...pro, [section]: { ...pro[section], enabled: !pro[section].enabled } } }); }}>{(dynamic ? settings.enabled : pro.eq.enabled) ? 'INN' : 'UT'}</button>}{!dynamic && <button type="button" aria-pressed={rta} onClick={() => setRta(value => !value)}>RTA</button>}</div></figcaption>
      <svg ref={svg} viewBox={`0 0 640 ${plotHeight}`} preserveAspectRatio="none" aria-label={dynamic ? 'Dynamikkurve med justerbar terskel' : 'Interaktiv EQ-kurve'} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
        {dynamic ? <>
          {[-60, -48, -36, -24, -12, 0].map(value => <g key={value}><path d={`M${dynamicsX(value)},17 V${bottom} M36,${dynamicsY(value)} H616`} className="pro-grid" /><text x={dynamicsX(value)} y={plotHeight - 12} textAnchor="middle">{value}</text><text x="30" y={dynamicsY(value) + 4} textAnchor="end">{value}</text></g>)}
          <path d={`M36,${bottom} L616,17`} stroke="#475569" strokeDasharray="5 5" fill="none" />
          <path d={dynamicPath} fill="none" stroke={active ? '#60a5fa' : '#64748b'} strokeWidth="3" data-pro-curve="dynamics" />
          <g role="slider" tabIndex="0" aria-label={`${panel === 'gate' ? 'Gate' : 'Comp'} terskel i kurven`} aria-valuemin={panel === 'gate' ? -72 : -60} aria-valuemax={0} aria-valuenow={settings.threshold} aria-valuetext={`${settings.threshold} dBFS`} onPointerDown={event => begin(event, { kind: 'threshold' })} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); onChange({ pro: { ...pro, [panel]: { ...settings, threshold: Math.max(panel === 'gate' ? -72 : -60, Math.min(0, settings.threshold + (event.key === 'ArrowRight' ? 0.5 : -0.5))) } } }); } }}>
            <path d={`M${dynamicsX(settings.threshold)},17 V${bottom}`} stroke="transparent" strokeWidth="36" /><path d={`M${dynamicsX(settings.threshold)},17 V${bottom}`} stroke="#fbbf24" strokeDasharray="4 4" pointerEvents="none" /><circle cx={dynamicsX(settings.threshold)} cy="18" r="7" fill="#fbbf24" />
          </g>
          {audio.playing && inputLevel != null && outputLevel != null && <circle cx={dynamicsX(inputLevel)} cy={dynamicsY(outputLevel)} r="6" fill="#2dd4bf" stroke="#f0fdfa" strokeWidth="1.5" />}
        </> : <>
          {[20, 100, 1000, 10000, 20000].map(value => <g key={value}><path d={`M${x(value)},17 V${bottom}`} className="pro-grid" /><text x={x(value)} y={plotHeight - 12} textAnchor="middle">{value >= 1000 ? `${value / 1000}k` : value}</text></g>)}
          {(plotHeight < 250 ? [-12, 0, 12] : [-18, -12, -6, 0, 6, 12, 18]).map(value => <g key={value}><path d={`M36,${y(value)} H616`} className={value === 0 ? 'pro-zero' : 'pro-grid'} /><text x="30" y={y(value) + 4} textAnchor="end">{value > 0 ? '+' : ''}{value}</text></g>)}
          <path ref={spectrum} fill="#38bdf8" fillOpacity="0.13" stroke="#38bdf8" strokeOpacity="0.32" strokeWidth="1" />
          {curves.bands.map((path, i) => <path key={i} d={`${path} L616,${zero} L36,${zero} Z`} fill={proBands[i].color} fillOpacity="0.09" stroke={proBands[i].color} strokeOpacity="0.4" strokeWidth="1" />)}
          <path d={curves.total} fill="none" stroke={state.bypass ? '#64748b' : '#fde047'} strokeWidth="3" data-pro-curve="eq" />
          {panel === 'peq' && pro.eq.bands.map((band, index) => <g key={index} role="button" tabIndex="0" aria-label={`${proBands[index].label} EQ-punkt, ${frequencyLabel(band.frequency)}, ${band.gain} dB`} aria-pressed={index === bandIndex} className="pro-eq-handle" onPointerDown={event => begin(event, { kind: 'band', index })} onKeyDown={event => bandKey(event, index)}>
            <circle cx={x(band.frequency)} cy={y(['highpass', 'lowpass'].includes(band.type) ? 0 : band.gain)} r="22" fill="transparent" />
            <circle cx={x(band.frequency)} cy={y(['highpass', 'lowpass'].includes(band.type) ? 0 : band.gain)} r={index === bandIndex ? 10 : 8} fill={band.enabled ? proBands[index].color : '#1e293b'} stroke={index === bandIndex ? '#fff' : proBands[index].color} strokeWidth="2" pointerEvents="none" />
            <text x={x(band.frequency)} y={y(['highpass', 'lowpass'].includes(band.type) ? 0 : band.gain) - 16} textAnchor="middle" fill={proBands[index].color} pointerEvents="none">{proBands[index].label}</text>
          </g>)}
          {panel === 'filter' && ['hpf', 'lpf'].map(key => <g key={key} role="slider" tabIndex="0" aria-label={`${key.toUpperCase()} i kurven`} aria-valuemin={key === 'hpf' ? 20 : 50} aria-valuemax={key === 'hpf' ? 2000 : 20000} aria-valuenow={pro.filters[`${key}Hz`]} onPointerDown={event => begin(event, { kind: 'filter', id: key })} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); onChange({ pro: { ...pro, filters: { ...pro.filters, [`${key}Hz`]: Math.round(Math.max(key === 'hpf' ? 20 : 50, Math.min(key === 'hpf' ? 2000 : 20000, pro.filters[`${key}Hz`] * 2 ** ((event.key === 'ArrowRight' ? 1 : -1) / 12)))) } } }); } }}><circle cx={x(pro.filters[`${key}Hz`])} cy={y(-3)} r="22" fill="transparent" /><circle cx={x(pro.filters[`${key}Hz`])} cy={y(-3)} r="9" fill={key === 'hpf' ? '#2dd4bf' : '#fbbf24'} /><text x={x(pro.filters[`${key}Hz`])} y={y(-3) - 16} textAnchor="middle">{key.toUpperCase()}</text></g>)}
        </>}
      </svg>
      <div className="pro-graph-foot"><span>{state.bypass ? 'BYPASS · prosessorene er ute' : dynamic ? `GR ${reduction.toFixed(1)} dB · ${panel === 'gate' ? signal.gateClosed ? 'lukket' : 'åpen' : 'før make-up / wet'}` : panel === 'peq' ? 'Dra punktene · gul = samlet respons' : 'Dra grensefrekvensene'}</span><span>{audio.playing ? audio.listening.original ? 'Du hører Original' : dynamic ? '● Målt lyd' : 'RTA etter PEQ · −100…0 dBFS' : 'Velg lyd og trykk Spill'}</span></div>
    </figure>
    {panel === 'peq' ? <div className="pro-band-strip" role="group" aria-label="EQ-bånd">{proBands.map((band, index) => <button type="button" key={band.id} style={{ '--band-color': band.color }} aria-pressed={bandIndex === index} onClick={() => onBandChange(index)}><strong>{band.label}</strong><span>{frequencyLabel(pro.eq.bands[index].frequency)}</span></button>)}</div> : <div className="pro-status-line">{dynamic ? <><span>{settings.enabled ? 'Prosessor på' : 'Prosessor av'} · {settings.threshold} dBFS</span><meter aria-label="Gain reduction" min="0" max={panel === 'gate' ? 60 : 30} value={reduction} /></> : <span>HPF {pro.filters.hpf ? frequencyLabel(pro.filters.hpfHz) : 'av'} · LPF {pro.filters.lpf ? frequencyLabel(pro.filters.lpfHz) : 'av'} · PEQ {pro.eq.enabled ? 'på' : 'av'}</span>}</div>}
    <div className="signal-output-strip" aria-label="Resultat av innstillingene"><SignalMeter live={false} label="Main LR" level={signal.mix} clipped={signal.clipped} /><SignalMeter live={false} label="Monitor" level={signal.monitor} tone="blue" /><SignalMeter live={false} label="PA" level={signal.pa} /></div>
  </div>;
}
