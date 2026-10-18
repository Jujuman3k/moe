import { Bookmark, Check, Play } from 'lucide-react';

export function VideoCard({ video, completed, favorite, onPlay, onToggleCompleted, onToggleFavorite }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-600">
      <button onClick={() => onPlay(video)} aria-label={`Spill av ${video.title}`} className="relative aspect-video w-full overflow-hidden bg-slate-800 text-left">
        <img src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} loading="lazy" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-300 group-hover:scale-105 group-hover:opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition group-hover:bg-blue-600"><Play size={19} fill="currentColor" className="ml-0.5 text-white" /></span></span>
        {completed && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-teal-950/90 px-2 py-1 text-[10px] font-semibold text-teal-200"><Check size={12} />Sett</span>}
      </button>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-blue-400">{video.categoryName}</span>
        <h3 className="text-sm font-bold leading-6 text-white">{video.title}</h3><p className="mb-4 mt-1 text-xs leading-5 text-slate-400">{video.desc}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-800 pt-2">
          <button onClick={() => onToggleCompleted(video.videoId)} aria-pressed={completed} aria-label={`${completed ? 'Fjern sett-markering for' : 'Marker som sett:'} ${video.title}`} className={`flex min-h-11 items-center gap-2 text-xs ${completed ? 'text-teal-300' : 'text-slate-400 hover:text-white'}`}><Check size={15} />{completed ? 'Sett' : 'Marker som sett'}</button>
          <button onClick={() => onToggleFavorite(video.videoId)} aria-pressed={favorite} aria-label={`${favorite ? 'Fjern favoritt:' : 'Lagre favoritt:'} ${video.title}`} className={`flex h-11 w-11 items-center justify-center rounded-lg ${favorite ? 'text-amber-300' : 'text-slate-500 hover:text-white'}`}><Bookmark size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </article>
  );
}
