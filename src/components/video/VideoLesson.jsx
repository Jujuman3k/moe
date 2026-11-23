import { Bookmark, Check, ChevronLeft, ChevronRight, ListMusic, SlidersHorizontal, X } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer.jsx';
import { videoExperiment } from '../../data/videoExperiments.js';
import { seriesFor } from '../../utils/videoLibrary.js';

export function VideoLesson({ video, autoPlay, learning, onSelect, onClose, onExplore, panelRef }) {
  const series = seriesFor(video);
  const index = series.findIndex(item => item.id === video.id);
  const completed = learning.progress.completed.includes(video.videoId);
  const favorite = learning.progress.favorites.includes(video.videoId);
  const experiment = videoExperiment(video.id);
  return <section ref={panelRef} tabIndex={-1} className="vl-lesson" aria-label="Valgt video">
    <header className="vl-lesson-head">
      <div><p className="vl-kicker"><ListMusic size={16}/> {video.categoryName} <span>· {index + 1}/{series.length}</span></p><h2>{video.title}</h2></div>
      <button className="vl-icon" type="button" aria-label="Lukk video" onClick={onClose}><X size={20}/></button>
    </header>
    <div className="vl-classroom">
      <VideoPlayer videoId={video.videoId} title={video.title} autoPlay={autoPlay}/>
      <aside className="vl-lesson-notes" aria-label="Om denne leksjonen">
        <div><p className="vl-tag">I denne leksjonen</p><p>{video.desc}</p></div>
        <div className="vl-lesson-actions">
          <button type="button" className="vl-action" aria-pressed={completed} onClick={() => learning.toggleCompleted(video.videoId)}><Check size={16}/>{completed ? 'Sett – fjern markering' : 'Marker video som sett'}</button>
          <button type="button" className="vl-action" aria-pressed={favorite} onClick={() => learning.toggleFavorite(video.videoId)}><Bookmark size={15} fill={favorite ? 'currentColor' : 'none'}/>{favorite ? 'Lagret i favoritter' : 'Lagre i favoritter'}</button>
        </div>
        {experiment && onExplore && <div className="vl-experiment"><p className="vl-tag"><SlidersHorizontal size={14}/> Fra video til miks</p><p>{experiment.text}</p><button type="button" onClick={() => onExplore(experiment.node, {source: experiment.source, mode: experiment.mode, ...(experiment.tool ? {tool: experiment.tool} : {})})}>{experiment.label}</button></div>}
      </aside>
    </div>
    <nav aria-label="Navigasjon i videoserien" className="vl-series-nav">
      <button type="button" disabled={index === 0} onClick={() => onSelect(series[index - 1])}><ChevronLeft size={16}/>Forrige i serien</button>
      <span>{index + 1} / {series.length}</span>
      <button type="button" disabled={index === series.length - 1} onClick={() => onSelect(series[index + 1])}>Neste i serien<ChevronRight size={16}/></button>
    </nav>
  </section>;
}
