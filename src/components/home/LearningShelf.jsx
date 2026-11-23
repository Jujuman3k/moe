import { createElement } from 'react';
import { BookOpen, CheckCheck, Headphones, ListMusic, PanelsTopLeft, Play, SlidersHorizontal, Video } from 'lucide-react';
import { videoData } from '../../data/videoData.js';
import { allVideos } from '../../utils/videoLibrary.js';
import { practiceScenarioCount, practiceTopics } from '../../data/practiceCatalog.js';
import { ProgressBar } from '../ui/ProgressBar.jsx';

function ShelfCard({ tone, category, Icon, title, description, children, onClick, action, ActionIcon }) {
  return <article className={`studio-shelf-card tone-${tone}`}>
    <div className="studio-card-label"><span className="studio-card-icon">{createElement(Icon, {size:21,strokeWidth:1.7,"aria-hidden":true})}</span><span>{category}</span></div>
    <h3>{title}</h3><p>{description}</p>
    <div className="studio-card-end">{children}
      <button type="button" className="studio-shelf-action" onClick={onClick}>{createElement(ActionIcon, {size:16,"aria-hidden":true})}{action}</button>
    </div>
  </article>;
}

export function LearningShelf({ navigate, progress, onOpenVideo }) {
  const course = videoData.dlive_course.videos;
  const completedCourse = course.filter(video => progress.completed.includes(video.videoId)).length;
  const next = course.find(video => !progress.completed.includes(video.videoId));
  const last = allVideos.find(video => video.videoId === progress.lastVideoId && !progress.completed.includes(video.videoId));
  const video = last || next;
  return <section aria-labelledby="studio-shelf-title" className="studio-shelf">
    <div className="studio-section-heading"><div><p className="studio-section-tag">Øvingsrom</p><h2 id="studio-shelf-title">Hva vil du trene på?</h2></div></div>
    <div className="studio-shelf-grid">
      <ShelfCard tone="green" category="Gehør" Icon={Headphones} title="Hør hva som endret seg"
        description="Bytt mellom A og B på samme opptak. Kan du høre hvilket grep som ble gjort i miksen?"
        onClick={() => navigate('listen')} action="Start lyttetest" ActionIcon={Headphones}>
        <div className="studio-home-ab-mark" aria-hidden="true"><span>A</span><i/><span>B</span></div>
      </ShelfCard>
      <ShelfCard tone="amber" category="Lydsjekk" Icon={SlidersHorizontal} title="Løs et problem på scenen"
        description={`${practiceScenarioCount} situasjoner i ${practiceTopics.length} fagområder. Finn årsaken, prøv et tiltak og få forklart svaret.`}
        onClick={() => navigate('practice')} action="Ta en øvingsrunde" ActionIcon={PanelsTopLeft}>
        <div className="studio-card-stat"><CheckCheck size={16} aria-hidden="true"/>{progress.solved.length} av {practiceScenarioCount} oppgaver løst</div>
      </ShelfCard>
      <ShelfCard tone="blue" category="Videokurs" Icon={Video} title="dLive fra A til Å"
        description={video ? `${last ? 'Sist åpnet' : 'Neste leksjon'}: ${video.title}` : 'Du har markert alle kursvideoene som sett. Besøk arkivet for å repetere.'}
        onClick={() => video ? onOpenVideo(video.videoId) : navigate('videos')}
        action={last ? 'Fortsett å lære' : next ? completedCourse ? 'Fortsett dLive-kurset' : 'Start dLive-kurset' : 'Åpne videoarkivet'} ActionIcon={video ? Play : ListMusic}>
        <ProgressBar value={completedCourse} max={course.length} label="Kursvideoer sett" />
      </ShelfCard>
    </div>
    <p className="studio-local-note"><BookOpen size={14} aria-hidden="true"/> Kurs- og oppgaveprogresjon lagres i denne nettleseren.</p>
  </section>;
}
