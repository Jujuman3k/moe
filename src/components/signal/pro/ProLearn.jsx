import { proHelp, proSourceLesson } from '../../../data/proAudioLessons.js';
import { frequencyLabel, proBands } from '../../../data/proAudioSettings.js';

export function ProLearn({ panel, source, onApply, onClose, onOpenAudio }) {
  const help = proHelp[panel] || proHelp.bypass;
  const lesson = proSourceLesson(source?.id);
  const section = panel === 'peq' ? 'eq' : panel === 'filter' ? 'filters' : panel;
  const suggested = lesson?.settings[section];
  return <div className="signal-learn pro-learn">
    <p className="pro-eyebrow">PRO · LYTT OG FORSTÅ</p><h2>{help.title}</h2><p>{help.intro}</p>
    {suggested && <div className="audio-lesson"><h3>Startforslag · {source.label}</h3><p>{lesson[panel === 'peq' ? 'eq' : panel]}</p>
      {panel === 'peq' ? <table><thead><tr><th>Bånd</th><th>Frekvens</th><th>Gain</th></tr></thead><tbody>{suggested.bands.map((band, index) => <tr key={index}><td>{proBands[index].label}</td><td>{frequencyLabel(band.frequency)}</td><td>{band.gain > 0 ? '+' : ''}{band.gain} dB</td></tr>)}</tbody></table>
        : <p className="pro-preset-values">{panel === 'filter' ? `HPF ${suggested.hpfHz} Hz · 12 dB/okt · LPF av` : panel === 'gate' ? `${suggested.enabled ? 'Gate på' : 'Gate av'} · terskel ${suggested.threshold} dBFS · depth ${suggested.depth} dB · ${suggested.attack} / ${suggested.hold} / ${suggested.release} ms` : `Comp på · ${suggested.threshold} dBFS · ${suggested.ratio}:1 · ${suggested.attack} / ${suggested.release} ms · knee 6 dB · make-up 0 dB · wet 100 %`}</p>}
      <button type="button" className="primary-button" onClick={() => { onApply(section, suggested); onClose(); }}>Prøv forslag for {panel === 'peq' ? 'PEQ' : panel === 'filter' ? 'filtre' : panel === 'gate' ? 'gate' : 'kompressor'}</button>
      <p className="pro-recipe-note">Endrer bare denne prosessoren og slår av global bypass. Kan angres. Startpunkt for dette opptaket – tilpass med ørene, ikke etter kjønn eller instrumentnavn alene.</p>
    </div>}
    {!source && <button type="button" className="primary-button" onClick={onOpenAudio}>Velg opptak for lytting og startforslag</button>}
    <dl>{help.fields.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
    <p className="pro-model-note">dLive-inspirert øving med egen nettleser-DSP. Terskler måles her i dBFS. Modellene og forslagene er ikke Allen & Heath-presets.</p>
    <a className="signal-detail-link" href="https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen" target="_blank" rel="noreferrer">Se dLives originale prosessorveiledning →</a>
  </div>;
}
