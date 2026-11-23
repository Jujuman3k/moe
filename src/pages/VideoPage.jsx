import { useEffect, useRef, useState } from 'react';
import { Bookmark, Check, ChevronDown, Clapperboard, Film, ListVideo, Play, Search } from 'lucide-react';
import { videoData } from '../data/videoData.js';
import { allVideos, filterVideos, videoRecommendation } from '../utils/videoLibrary.js';
import { VideoSearch } from '../components/video/VideoSearch.jsx';
import { VideoCard } from '../components/video/VideoCard.jsx';
import { VideoLesson } from '../components/video/VideoLesson.jsx';
import '../styles/video-library.css';

export default function VideoPage({ learning, initialVideoId, onExplore }) {
  const initial = allVideos.find(video => video.videoId === initialVideoId);
  const { progress, toggleCompleted, toggleFavorite, rememberVideo } = learning;
  const [category, setCategory] = useState(initial?.categoryId || 'dlive_course');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selection, setSelection] = useState(initial ? {video: initial, autoPlay: false} : null);
  const lessonRef = useRef(null);
  const opener = useRef(null);
  const searchRef = useRef(null);
  const results = filterVideos({query, category, status, ...progress});
  const categoryVideos = category === 'all' ? allVideos : videoData[category].videos;
  const watched = categoryVideos.filter(video => progress.completed.includes(video.videoId)).length;
  const recommendation = videoRecommendation(progress);
  const openedFromLink = useRef(null);
  useEffect(() => {
    if (!initial || openedFromLink.current === initial.videoId) return;
    openedFromLink.current = initial.videoId;
    if (progress.lastVideoId !== initial.videoId) rememberVideo(initial.videoId);
  }, [initial, progress.lastVideoId, rememberVideo]);

  useEffect(() => {
    if (selection) {
      lessonRef.current?.focus({preventScroll: true});
      lessonRef.current?.scrollIntoView({block: 'start'});
    }
  }, [selection]);

  const play = (video, trigger) => {
    if (trigger) opener.current = trigger;
    setSelection({video, autoPlay: true});
    rememberVideo(video.videoId);
  };
  const close = () => {
    setSelection(null);
    requestAnimationFrame(() => {
      if (opener.current?.isConnected) opener.current.focus();
      else searchRef.current?.focus();
    });
  };
  const search = text => {
    if (!query.trim() && text.trim()) setCategory('all');
    setQuery(text);
  };
  const reset = () => { setQuery(''); setCategory('all'); setStatus('all'); };
  const saved = () => {
    reset(); setStatus('favorites');
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  return <div className="vl-page animate-fade-in">
    <header className="vl-header">
      <div><p className="vl-kicker"><Clapperboard size={17}/> Kursrommet</p><h1>Videoarkivet</h1><p className="vl-intro">Lær dLive fra grunnen, eller finn akkurat den teknikken du trenger på neste lydsjekk.</p>
        <div className="vl-meta"><span><Film size={16}/>{allVideos.length} videoer</span><span><ListVideo size={16}/>{Object.keys(videoData).length} temaer</span><span><Check size={16}/>{progress.completed.length} sett</span></div>
      </div>
      {!selection && <button type="button" className="vl-resume" onClick={event => play(recommendation.video, event.currentTarget)}>
        <span className="vl-resume-play"><Play size={22} fill="currentColor"/></span>
        <span><span className="vl-kicker">{recommendation.label}</span><strong>{recommendation.video.title}</strong><small>{recommendation.video.categoryName}</small></span>
      </button>}
    </header>
    {selection && <VideoLesson panelRef={lessonRef} video={selection.video} autoPlay={selection.autoPlay} learning={learning} onSelect={play} onClose={close} onExplore={onExplore}/>}
    <section aria-label="Søk og filtrering" className="vl-filter">
      <div className="vl-filter-title"><h2>Finn en leksjon</h2><button type="button" onClick={saved} aria-pressed={status === 'favorites' && category === 'all' && !query.trim()}><Bookmark size={15}/> Mine favoritter <span>{progress.favorites.length}</span></button></div>
      <div className="vl-inputs">
        <VideoSearch query={query} onChange={search} inputRef={searchRef}/>
        <label><span>Tema</span><span className="vl-select"><select aria-label="Videotema" value={category} onChange={event => setCategory(event.target.value)}><option value="all">Alle temaer</option>{Object.entries(videoData).map(([key, data]) => <option key={key} value={key}>{data.title}</option>)}</select><ChevronDown size={15}/></span></label>
        <label><span>Visning</span><span className="vl-select"><select aria-label="Visningsfilter" value={status} onChange={event => setStatus(event.target.value)}><option value="all">Alle videoer</option><option value="unseen">Ikke sett</option><option value="completed">Sett</option><option value="favorites">Mine favoritter</option></select><ChevronDown size={15}/></span></label>
      </div>
    </section>
    <section className="vl-results" aria-labelledby="vl-result-heading">
      <div className="vl-results-head">
        <div><p className="vl-kicker">{status === 'favorites' ? 'Din samling' : 'Leksjoner'}</p><h2 id="vl-result-heading">{category === 'all' ? 'Alle temaer' : videoData[category].title}</h2><p role="status">{results.length} {results.length === 1 ? 'video' : 'videoer'}{query.trim() ? ` for «${query.trim()}»` : ''}</p></div>
        <div className="vl-progress"><span>{watched} av {categoryVideos.length} sett</span><progress aria-label="Markert som sett i dette utvalget av temaer" value={watched} max={categoryVideos.length}/></div>
      </div>
      {results.length ? <div className="vl-grid">{results.map(video => <VideoCard key={video.id} video={video} completed={progress.completed.includes(video.videoId)} favorite={progress.favorites.includes(video.videoId)} onPlay={play} onToggleCompleted={toggleCompleted} onToggleFavorite={toggleFavorite}/>)}</div>
        : <div className="vl-empty"><Search size={25}/><h3>Ingen videoer i dette utvalget</h3><p>{status === 'favorites' && !progress.favorites.length ? 'Trykk på bokmerket på en video du vil finne igjen. De lagrede leksjonene samles her.' : 'Prøv et annet søkeord, et annet tema eller vis alle videoer.'}</p><button type="button" onClick={reset}>Nullstill filtre</button></div>}
    </section>
  </div>;
}
