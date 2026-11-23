import { Bookmark, Check, Play } from 'lucide-react';

export function VideoCard({ video, completed, favorite, onPlay, onToggleCompleted, onToggleFavorite }) {
  return <article className="vl-card">
    <button type="button" className="vl-card-main" aria-label={`Spill av ${video.title}`} onClick={event => onPlay(video, event.currentTarget)}>
      <span className="vl-thumb" aria-hidden="true"><img src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} loading="lazy" alt="" onError={event => { event.currentTarget.hidden = true; }} /><span><Play size={16} fill="currentColor"/></span></span>
      <span className="vl-card-copy"><span className="vl-tag">{video.categoryName}</span><strong>{video.title}</strong><span>{video.desc}</span></span>
    </button>
    <div className="vl-card-tools">
      <button type="button" aria-pressed={completed} aria-label={`${completed ? 'Fjern sett-markering for' : 'Marker som sett:'} ${video.title}`} onClick={() => onToggleCompleted(video.videoId)}><Check size={15}/>{completed ? 'Sett' : 'Marker som sett'}</button>
      <button type="button" className="vl-save" aria-pressed={favorite} aria-label={`${favorite ? 'Fjern favoritt:' : 'Lagre favoritt:'} ${video.title}`} title={favorite ? 'Fjern fra favoritter' : 'Lagre i favoritter'} onClick={() => onToggleFavorite(video.videoId)}><Bookmark size={16} fill={favorite ? 'currentColor' : 'none'}/></button>
    </div>
  </article>;
}
