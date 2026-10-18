import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bookmark, Check, Film, Search, X } from 'lucide-react';
import { videoData } from '../data/videoData.js';
import { allVideos, filterVideos } from '../utils/videoLibrary.js';
import { VideoSearch } from '../components/video/VideoSearch.jsx';
import { VideoCard } from '../components/video/VideoCard.jsx';
import { VideoPlayer } from '../components/video/VideoPlayer.jsx';
import { ProgressBar } from '../components/ui/ProgressBar.jsx';

export default function VideoPage({ learning, initialVideoId }) {
  const initialVideo = allVideos.find(video => video.videoId === initialVideoId);
  const [category, setCategory] = useState(initialVideo?.categoryId || 'dlive_course');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(initialVideo || null);
  const playerRef = useRef(null);
  const { progress, toggleCompleted, toggleFavorite, rememberVideo } = learning;
  const results = filterVideos({ query, category, status, ...progress });
  const categoryVideos = category === 'all' ? allVideos : videoData[category].videos;
  const completedCount = categoryVideos.filter(video => progress.completed.includes(video.videoId)).length;
  const selectedIndex = selectedVideo ? allVideos.findIndex(video => video.id === selectedVideo.id) : -1;
  const nextVideo = allVideos[selectedIndex + 1]?.categoryId === selectedVideo?.categoryId ? allVideos[selectedIndex + 1] : null;

  useEffect(() => {
    if (selectedVideo) playerRef.current?.scrollIntoView({ block: 'start' });
  }, [selectedVideo]);

  const play = video => { setSelectedVideo(video); rememberVideo(video.videoId); };
  const search = value => {
    setQuery(value);
    if (value.trim() && !query.trim()) setCategory('all');
  };
  const resetFilters = () => { setQuery(''); setCategory('all'); setStatus('all'); };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow"><Film size={15} /> Lær i ditt tempo</p><h1 className="page-title">Videoarkivet</h1><p className="mt-3 text-sm text-slate-400">{allVideos.length} videoer. Fra første oppsett til detaljene i miksen.</p></div>
        <div className="flex gap-4 text-xs text-slate-400"><span className="flex items-center gap-1.5"><Check size={15} className="text-teal-400" />{progress.completed.length} sett</span><span className="flex items-center gap-1.5"><Bookmark size={15} className="text-amber-300" />{progress.favorites.length} lagret</span></div>
      </div>
      {selectedVideo && <section ref={playerRef} aria-label="Valgt video" className="scroll-mt-24 rounded-2xl border border-blue-500/30 bg-slate-900 p-3 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><div><p className="mb-1 text-[10px] uppercase tracking-wider text-blue-400">Nå lærer du · {selectedVideo.categoryName}</p><h2 className="text-base font-bold text-white">{selectedVideo.title}</h2></div><button onClick={() => setSelectedVideo(null)} aria-label="Lukk video" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X size={19} /></button></div>
        <div className="mx-auto max-w-3xl"><VideoPlayer videoId={selectedVideo.videoId} title={selectedVideo.title} /></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><button onClick={() => toggleCompleted(selectedVideo.videoId)} aria-pressed={progress.completed.includes(selectedVideo.videoId)} className="secondary-button"><Check size={16} />{progress.completed.includes(selectedVideo.videoId) ? 'Sett – fjern markering' : 'Marker video som sett'}</button>{nextVideo && <button onClick={() => play(nextVideo)} className="secondary-button">Neste i serien<ArrowRight size={16} /></button>}</div>
        <p className="mt-3 text-xs text-slate-500">Avspilleren starter uten lyd. Slå på lyden i videoen. «Sett» markerer du selv.</p>
      </section>}
      <section aria-label="Søk og filtrering" className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]"><VideoSearch query={query} onChange={search} /><div><label htmlFor="video-status" className="sr-only">Visningsfilter</label><select id="video-status" value={status} onChange={event => setStatus(event.target.value)} className="h-[52px] w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-slate-300"><option value="all">Alle videoer</option><option value="unseen">Ikke sett</option><option value="completed">Sett</option><option value="favorites">Mine favoritter</option></select></div></div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Videokategorier">
          {[['all', { title: 'Alle temaer' }], ...Object.entries(videoData)].map(([key, data]) => <button key={key} onClick={() => setCategory(key)} aria-pressed={category === key} className={`min-h-11 shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors ${category === key ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}>{data.title}</button>)}
        </div>
      </section>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><h2 className="text-lg font-bold text-white">{category === 'all' ? 'Alle temaer' : videoData[category].title}</h2><p aria-live="polite" role="status" className="mt-1 text-xs text-slate-400">{results.length} {results.length === 1 ? 'video' : 'videoer'}{query.trim() ? ` for «${query.trim()}»` : ''}</p></div>
        <div className="w-full max-w-xs"><ProgressBar value={completedCount} max={categoryVideos.length} label="Markert som sett i dette utvalget av temaer" /></div>
      </div>
      {results.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{results.map(video => <VideoCard key={video.id} video={video} completed={progress.completed.includes(video.videoId)} favorite={progress.favorites.includes(video.videoId)} onPlay={play} onToggleCompleted={toggleCompleted} onToggleFavorite={toggleFavorite} />)}</div>
        : <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center"><Search size={30} className="mx-auto mb-4 text-slate-500" /><h3 className="font-semibold text-white">Ingen videoer i dette utvalget</h3><p className="mt-2 text-sm text-slate-400">Prøv et annet søkeord, et annet tema eller lagre en favoritt.</p><button onClick={resetFilters} className="secondary-button mx-auto mt-5">Nullstill filtre</button></div>}
    </div>
  );
}
