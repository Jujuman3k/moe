import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AudioLines, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { sourceWaveforms } from '../../data/sourceWaveforms.js';
import { ListenEngine } from '../../audio/listenEngine.js';

const lengthLabel = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

function SampleDisplay({ preview, playing, engineRef }) {
  const playhead = useRef(null);
  useEffect(() => {
    if (!playing || !preview) return;
    const frame = () => { if (playhead.current) playhead.current.style.left = `${100 * (engineRef.current?.position() || 0)}%`; };
    frame(); const timer = setInterval(frame, 65);
    return () => clearInterval(timer);
  }, [preview, playing, engineRef]);
  return <div className="listen-display" aria-hidden="true">
    <div className="listen-wave">
      {preview ? <svg viewBox="0 0 400 64" preserveAspectRatio="none"><path d={Array.from(preview.peaks, (value, index) => {
        const px = ((index + 0.5) * 400 / preview.peaks.length).toFixed(2); const dy = Math.max(1, value * 29);
        return `M${px} ${(32-dy).toFixed(2)}V${(32+dy).toFixed(2)}`;
      }).join(' ')} /></svg> : <span className="listen-wave-idle"><AudioLines size={16} /> Spill A eller B for å se opptaket</span>}
      {playing && <span ref={playhead} className="listen-playhead" />}
    </div>
    <div className="listen-ruler"><span>0:00</span><span>{preview ? lengthLabel(preview.duration) : '–:––'}</span></div>
  </div>;
}

export function ListenPlayer({ source, question, heard, onHeard, onReady, transportRef, onPlayback }) {
  const engineRef = useRef(null); const ticket = useRef(0); const buttons = useRef({});
  const [status, setStatus] = useState('idle'); const [active, setActive] = useState(null);
  const [preview, setPreview] = useState(() => { const wave = sourceWaveforms[source.id]; return wave && { duration:wave.duration, peaks:wave.peaks.map(value => value / 100) }; }); const [error, setError] = useState('');
  const loading = status === 'loading'; const playing = status === 'playing';
  useEffect(() => { onPlayback({ side: playing ? active : null, busy: loading }); }, [active, loading, playing, onPlayback]);
  useEffect(() => {
    const invalidate = () => { ticket.current += 1; };
    const halt = () => { invalidate(); engineRef.current?.stop(); setStatus('idle'); setActive(null); };
    const visibility = () => { if (document.hidden) halt(); };
    window.addEventListener('pagehide', halt); document.addEventListener('visibilitychange', visibility);
    return () => { invalidate(); window.removeEventListener('pagehide', halt); document.removeEventListener('visibilitychange', visibility); const engine = engineRef.current; engineRef.current = null; if (engine) void engine.close().catch(() => {}); };
  }, []);
  function stop() { ++ticket.current; engineRef.current?.stop(); setStatus('idle'); setActive(null); setError(''); }
  async function play(side, restart = false) {
    if (loading) return;
    if (playing && !restart) {
      engineRef.current.select(side); setActive(side); onHeard(side); return;
    }
    const current = ++ticket.current;
    setActive(side); setStatus('loading'); setError('');
    try {
      const engine = engineRef.current || (engineRef.current = new ListenEngine());
      if (restart) engine.stop();
      const started = await engine.play({ url: source.file, effect: question.effect }, side);
      if (current !== ticket.current) return;
      if (!started) { setActive(null); setStatus('idle'); return; }
      setPreview(engine.preview); onReady(engine.preview); setStatus('playing'); onHeard(side);
    } catch (err) {
      if (current !== ticket.current) return;
      engineRef.current?.stop(); setActive(null); setStatus('idle');
      setError(err?.message || 'Opptaket kunne ikke spilles. Prøv A eller B igjen.');
    }
  }
  function switchByKey(event) {
    if (!['ArrowLeft','ArrowRight'].includes(event.key) || loading) return;
    event.preventDefault(); const side = event.key === 'ArrowLeft' ? 'A' : 'B';
    buttons.current[side]?.focus(); void play(side);
  }
  useImperativeHandle(transportRef, () => ({ play, stop }));
  return <section aria-label="Lytt til A og B" className="listen-player">
    <div className="listen-player-top"><span className="listen-small-label"><Volume2 size={15} /> Lydkilde</span><span className="listen-loop-label">Opptak i sløyfe</span></div>
    <h2>{source.label}</h2>
    <SampleDisplay preview={preview} playing={playing} engineRef={engineRef} />
    <div className="listen-sides" role="group" aria-label="Velg versjon" onKeyDown={switchByKey}>
      {[['A', 'Original'], ['B', 'Bearbeidet']].map(([side, label]) => <button type="button" key={side} ref={el => { buttons.current[side] = el; }} aria-label={`Spill ${side} · ${label}`} aria-pressed={playing && active === side} aria-disabled={loading || undefined} onClick={() => void play(side)} className={'listen-side side-' + side.toLowerCase()}>
        <span className="listen-side-letter">{side}</span><span>{label}</span>{playing && active === side ? <AudioLines size={19}/> : <Play size={16} />}
      </button>)}
    </div>
    <div className="listen-transport"><span className="listen-transport-state" role="status">{loading ? 'Klargjør lyd …' : playing ? `Spiller ${active}` : heard.length ? 'Stoppet' : 'Klar til lytting'}</span><div>
      <button type="button" disabled={!playing} onClick={() => void play(active, true)} aria-label="Spill fra start"><RotateCcw size={17}/><span>Fra start</span></button>
      <button type="button" disabled={!playing && !loading} onClick={stop} aria-label="Stopp lyd"><Pause size={17}/><span>Stopp</span></button>
    </div></div>
    {error && <p role="alert" className="listen-error">{error}</p>}
    <p className="listen-player-note">Bytt mellom A og B på samme sted i opptaket. Nivåene er tilpasset, så du kan lytte etter selve miksegrepet.</p>
    <p className="listen-credit">Opptak: <a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.author} · Freesound</a></p>
  </section>;
}
