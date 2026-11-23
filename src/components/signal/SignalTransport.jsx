import { AudioLines, ChevronDown, Headphones, Maximize2, Pause, Play, RotateCcw, Square, Target, X } from 'lucide-react';

const outputs = { main: 'Main LR', pa: 'PA', monitor: 'Monitor' };

export function SignalTransport({ audio, animate, onAnimate, onChoose, onMissions, missionMode, onReset, fullscreen, onFullscreen, fullscreenButton }) {
  const active = audio.playing || audio.status === 'loading';
  const target = audio.listening.original ? 'Original' : outputs[audio.listening.target];
  const status = !audio.source ? '7 opptak · ingen avspilling' : audio.status === 'loading' ? 'Laster opptak …' : audio.error ? 'Lydfeil · prøv Spill igjen' : `${target} · ${audio.playing ? 'spiller' : 'klar'}`;
  return <header className="signal-focus-toolbar studio-transport">
    <button type="button" className="signal-source-button" aria-label="Velg lydkilde og lyttepunkt" aria-haspopup="dialog" title="Velg lydkilde og lyttepunkt" onClick={onChoose}>
      <span><Headphones size={16} /><b>{audio.source?.label || 'Velg lyd'}</b><ChevronDown size={12} /></span><small>{status}</small>
    </button>
    {audio.source && <button type="button" className="signal-toolbar-button studio-play" data-playing={active} aria-label={active ? 'Stopp lyd' : 'Spill lyd'} onClick={() => active ? audio.stop() : void audio.play()}>{active ? <Square size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}<span>{active ? 'Stopp' : 'Spill'}</span></button>}
    <span className="sr-only" role="status">{audio.source ? `${audio.source.label}: ${status}` : 'Lydløs signalmodell. Velg lyd for å mikse et opptak.'}</span>
    <span className="studio-transport-gap" />
    {audio.source && <button type="button" className="signal-toolbar-button audio-ab" aria-label="Sammenlign med original" aria-pressed={audio.listening.original} title={audio.listening.original ? 'Du hører originalen. Bytt til miksen.' : 'Du hører miksen. Bytt til originalen.'} onClick={() => audio.setListening({ original: !audio.listening.original })}><span className="studio-ab-mark">A/B</span><span className="studio-wide-label">{audio.listening.original ? 'Original' : 'Mikset'}</span></button>}
    <button type="button" aria-label="6 oppdrag" aria-haspopup="dialog" title="6 signaloppdrag" className="signal-toolbar-button" data-active={missionMode} onClick={onMissions}><Target size={17} /><span className="studio-wide-label">Oppdrag</span></button>
    {!audio.source && <><button type="button" className="signal-toolbar-button" aria-label={animate ? 'Pause signalbevegelse' : 'Start signalbevegelse'} title={animate ? 'Pause signalbevegelsen' : 'Start signalbevegelsen'} aria-pressed={!animate} onClick={onAnimate}>{animate ? <Pause size={17} /> : <AudioLines size={17} />}<span className="studio-wide-label">{animate ? 'Frys visning' : 'Fortsett visning'}</span></button><button type="button" aria-label="Nullstill" title="Nullstill miksen" className="signal-toolbar-button" onClick={onReset}><RotateCcw size={16} /><span className="studio-wide-label">Nullstill</span></button></>}
    <button ref={fullscreenButton} type="button" className="signal-toolbar-button signal-enter" aria-label={fullscreen ? 'Tilbake til portalen' : 'Åpne mikser i fullskjerm'} title={fullscreen ? 'Lukk fullskjerm' : 'Åpne fullskjerm'} onClick={onFullscreen}>{fullscreen ? <X size={18} /> : <Maximize2 size={17} />}<span className="studio-wide-label">{fullscreen ? 'Lukk' : 'Fullskjerm'}</span></button>
  </header>;
}
