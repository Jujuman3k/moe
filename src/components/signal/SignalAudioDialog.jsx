import { Check, Headphones, Play, Square } from 'lucide-react';
import { audioSources } from '../../data/audioSources.js';
import { SignalSlider } from './SignalFields.jsx';

export function SignalAudioDialog({ audio, onClose, onReset, animate, onToggleAnimate }) {
  return <div className="signal-audio-picker">
    <p className="audio-eyebrow"><Headphones size={16} /> LYTT. SKRU. LÆR.</p>
    <h2>Velg lyden du vil mikse</h2>
    <p>Velg ett opptak. Skru i mikseren og bruk bok-knappen for lyttetips. Lyden gjentas mens du øver.</p>
    <div className="audio-dialog-actions">
      <button type="button" className="primary-button" disabled={!audio.source || audio.status === 'loading'} onClick={async () => { if (audio.playing || await audio.play()) onClose(); }}><Play size={16} />{audio.status === 'loading' ? 'Laster lyd…' : audio.playing ? 'Tilbake til miksen' : 'Spill og miks'}</button>
      {(audio.playing || audio.status === 'loading') && <button type="button" className="secondary-button" onClick={audio.stop}><Square size={15} /> Stopp lyd</button>}
    </div>
    <div className="audio-source-grid" role="group" aria-label="Lydkilder">
      {audioSources.map(source => <button key={source.id} type="button" aria-pressed={audio.sourceId === source.id} onClick={() => audio.select(source.id)} style={{ '--source-color': source.color }}><span>{source.label}{audio.sourceId === source.id && <Check size={15} />}</span><small>{source.detail}</small></button>)}
    </div>
    {audio.source && <p className="audio-source-focus">{audio.source.focus}</p>}
    <label className="audio-listen-label" htmlFor="audio-listen-target">Lytt til</label>
    <select id="audio-listen-target" value={audio.listening.target} onChange={event => audio.setListening({ target: event.target.value, original: false })}><option value="main">Main LR · salen</option><option value="monitor">Monitor · pre/post-fade</option><option value="pa">PA · etter matrix og utgang</option></select>
    <SignalSlider label="Lyttevolum" min={0} max={100} value={audio.listening.volume} unit="%" onChange={volume => audio.setListening({ volume })} />
    <p className="audio-help-text">Start lavt på hodetelefonene. Lyttevolum endrer ikke nivåene i signalkjeden.</p>
    <label className="audio-motion-choice"><input type="checkbox" checked={animate} onChange={onToggleAnimate} /> Levende bølger og signalbevegelse</label>
      <button type="button" className="secondary-button" onClick={onReset}>Nullstill miksen</button>
    {audio.error && <p role="alert" className="audio-error">{audio.error}</p>}
    <details><summary>Om lyden og sammenligningen</summary><p>«Original» spiller opptaket ved fast referansenivå, før kanalens behandling og ruting. «Mikset» følger innstillingene og valgt lyttepunkt. Sammenligningen er ikke automatisk nivåmatchet. Ingen av valgene skriver over originalfilen.</p><p>Lydene er uavhengige øvingsklipp, ikke stems fra samme låt. Nettleseren bruker en egen lydmodell, ikke dLives eksakte algoritmer. Noen opptak har romklang eller behandling fra før.</p><p>CC0-opptak fra Freesound, tilpasset til korte monoklipp:</p><ul>{audioSources.map(source => <li key={source.id}><a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.label} – {source.author}</a></li>)}</ul><a href="/audio/credits.json" target="_blank" rel="noreferrer">Filkilder og bearbeiding</a></details>
    <button type="button" className="signal-detail-link" onClick={() => { audio.useSketch(); onClose(); }}>Tilbake til lydløs bølgeskisse</button>
  </div>;
}
