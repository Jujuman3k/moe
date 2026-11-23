import { useEffect, useId, useRef, useState } from 'react';
import { AudioLines, ChevronDown, LoaderCircle, Play, Square } from 'lucide-react';
import { audioSources } from '../../data/audioSources.js';
import { sourceWaveforms } from '../../data/sourceWaveforms.js';

const seconds = value => `${Number(value.toFixed(1)).toLocaleString('nb-NO')} s`;

function Waveform({ data, progress }) {
  const id = useId();
  const { peaks, duration } = data;
  const width = peaks.length * 4;
  const playPosition = progress * width;
  return <div className="studio-trace" aria-hidden="true">
    <svg viewBox={`0 0 ${width} 106`} preserveAspectRatio="none">
      <defs><linearGradient id={id}><stop stopColor="#8ec8c2"/><stop offset=".37" stopColor="#b3f6d9"/><stop offset="1" stopColor="#68bda5"/></linearGradient></defs>
      {[12, 32, 53, 74, 94].map(y => <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="#2b4145" strokeDasharray={y === 53 ? undefined : '2 5'}/>)}
      {Array.from({ length:9 }, (_, i) => <line key={i} x1={width*i/8} x2={width*i/8} y1="0" y2="106" stroke="#294044" strokeDasharray="2 5"/>)}
      <g fill={`url(#${id})`}>{peaks.map((peak, i) => {
        const h = Math.max(2, peak * .93);
        return <rect key={i} x={i*4+.5} y={(106-h)/2} width="3" height={h} rx="1"/>;
      })}</g>
      {progress > 0 && <g><rect width={playPosition} height="106" fill="#e0fff512"/><line x1={playPosition} x2={playPosition} y1="0" y2="106" stroke="#ffd09a" strokeWidth="2"/></g>}
    </svg>
    <div className="studio-time-ruler"><span>0 s</span><span>{seconds(duration / 2)}</span><span>{seconds(duration)}</span></div>
  </div>;
}

function ClipPlayer({ source }) {
  const player = useRef(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const alive = useRef(true);
  const data = sourceWaveforms[source.id];

  useEffect(() => {
    alive.current = true;
    // The audio element is mounted per recording; selecting another source or
    // leaving Home stops playback and releases it even if play() is pending.
    const clip = player.current;
    function hide() { if (document.hidden) clip.pause(); }
    document.addEventListener('visibilitychange', hide);
    return () => {
      alive.current = false;
      document.removeEventListener('visibilitychange', hide);
      clip.pause();
    };
  }, []);

  const active = status === 'playing' || status === 'loading';
  async function toggle() {
    const clip = player.current;
    if (active) {
      clip.pause(); clip.currentTime = 0; setStatus('idle'); setProgress(0);
      return;
    }
    clip.volume = 0.5; clip.currentTime = 0;
    setProgress(0); setStatus('loading');
    try { await clip.play(); } catch (error) {
      if (alive.current && error.name !== 'AbortError') setStatus('error');
    }
  }
  function reset() { setStatus('idle'); setProgress(0); }
  return <>
    <div className="studio-clip-tools"><span className="studio-clip-code"><AudioLines size={15} aria-hidden="true"/> Bølgeform</span>
      <span className="studio-duration">{seconds(data.duration)} <span> / </span> MONO</span>
    </div>
    <Waveform data={data} progress={progress} />
    <div className="studio-clip-bottom">
      <button type="button" className="studio-audition" onClick={toggle}>
        {status === 'loading' ? <LoaderCircle size={15} className="studio-spin"/> : active ? <Square size={13} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
        {active ? 'Stopp klippet' : status === 'error' ? 'Prøv igjen' : 'Lytt til klippet'}
      </button>
      <span className="studio-clip-caption" role="status">{status === 'error' ? 'Kunne ikke spille av' : status === 'playing' ? 'Spiller original' : status === 'loading' ? 'Laster lyd …' : 'Originalopptak'}</span>
    </div>
    <audio ref={player} src={source.file} preload="none" onPlaying={() => setStatus('playing')}
      onTimeUpdate={event => { const audio = event.currentTarget; if (!audio.paused && Number.isFinite(audio.duration) && audio.duration > 0) setProgress(audio.currentTime / audio.duration); }}
      onEnded={reset} onPause={reset} onError={() => setStatus('error')} />
  </>;
}

export function SourcePreview({ source, onSelect }) {
  const id = useId();
  return <section className="studio-sampler" aria-label="Opptak til mikseren">
    <div className="studio-sampler-head">
      <span className="studio-channel-index" aria-hidden="true">CH<span>{String(audioSources.findIndex(s => s.id === source.id) + 1).padStart(2,'0')}</span></span>
      <div><label htmlFor={id}>Velg lyd til mikseren</label><div className="studio-source-select">
        <select value={source.id} id={id} onChange={e => onSelect(e.target.value)}>{audioSources.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><ChevronDown size={19} aria-hidden="true"/>
      </div></div>
    </div>
    <div className="studio-clip"><ClipPlayer key={source.id} source={source} /></div>
  </section>;
}
