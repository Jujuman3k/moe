import { Activity, ArrowRight, CheckCircle2, GraduationCap, Play, Radio } from 'lucide-react';
import { videoData } from '../data/videoData.js';
import { allVideos } from '../utils/videoLibrary.js';
import { practiceScenarios } from '../data/practiceScenarios.js';
import { ProgressBar } from '../components/ui/ProgressBar.jsx';
import { RoutingLab } from '../components/learning/RoutingLab.jsx';

export function HomePage({ navigate, learning, onOpenVideo }) {
  const { progress } = learning;
  const course = videoData.dlive_course.videos;
  const completedCourse = course.filter(video => progress.completed.includes(video.videoId)).length;
  const nextVideo = course.find(video => !progress.completed.includes(video.videoId));
  const lastVideo = allVideos.find(video => video.videoId === progress.lastVideoId);
  const featuredVideo = lastVideo && !progress.completed.includes(lastVideo.videoId) ? lastVideo : nextVideo;
  return (
    <div className="animate-fade-in space-y-8 md:space-y-10">
      <section className="hero-surface grid items-center gap-8 overflow-hidden rounded-3xl border border-slate-800 p-6 md:p-10 lg:grid-cols-[1.12fr_1fr]">
        <div>
          <p className="eyebrow"><Radio size={14} /> Din lydtekniske verktøykasse</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">Forstå signalet.<br /><span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">Finn din miks.</span></h1>
          <p className="mb-7 mt-5 max-w-md text-sm leading-7 text-slate-400 md:text-base">Fra første lydsjekk til en trygg søndagsmiks. Lær dLive C3500 med videoer, interaktive verktøy og små oppgaver.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => featuredVideo ? onOpenVideo(featuredVideo.videoId) : navigate('videos')} className="primary-button"><Play size={16} fill="currentColor" />{lastVideo && featuredVideo === lastVideo ? 'Fortsett å lære' : 'Start dLive-kurset'}</button>
            <button onClick={() => navigate('signal')} className="secondary-button">Utforsk signalveien <ArrowRight size={16} /></button>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 border-t border-slate-800 pt-5 text-xs text-slate-500">
            <span><strong className="mr-1 text-slate-200">{allVideos.length}</strong> videoer</span><span><strong className="mr-1 text-slate-200">{Object.keys(videoData).length}</strong> temaer</span><span><strong className="mr-1 text-slate-200">3</strong> øvingscase</span>
          </div>
        </div>
        <RoutingLab />
      </section>
      <section aria-labelledby="learning-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Ditt neste steg</p><h2 id="learning-heading" className="mt-2 text-xl font-bold text-white">Litt mer trygghet, hver gang.</h2></div><p className="text-xs text-slate-500">Progresjon lagres i denne nettleseren</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="learning-card flex flex-col border-blue-500/30">
            <div className="mb-5 flex items-center justify-between"><span className="card-icon text-blue-400"><Play size={20} /></span><span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">01 · Se og lær</span></div>
            <h3 className="font-bold text-white">dLive fra A til Å</h3><p className="mb-6 mt-2 text-sm leading-relaxed text-slate-400">{nextVideo ? `Neste: ${nextVideo.title}` : 'Alle kursvideoene er markert som sett. Klar for en repetisjon?'}</p>
            <div className="mt-auto"><ProgressBar value={completedCourse} max={course.length} label="Kursvideoer sett" /><button onClick={() => nextVideo ? onOpenVideo(nextVideo.videoId) : navigate('videos')} className="mt-5 flex min-h-11 w-full items-center justify-between text-sm font-semibold text-blue-300">{completedCourse ? 'Fortsett læringen' : 'Åpne første video'}<ArrowRight size={17} /></button></div>
          </article>
          <article className="learning-card flex flex-col">
            <div className="mb-5 flex items-center justify-between"><span className="card-icon text-teal-400"><Activity size={20} /></span><span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">02 · Utforsk</span></div>
            <h3 className="font-bold text-white">Følg lyden hele veien</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Fra mikrofon til høyttaler. Skru på gain, EQ og kompressor og se hva som endrer seg.</p>
            <div className="mt-6 flex gap-2 text-[10px] text-slate-400"><span className="rounded border border-slate-700 px-2 py-1">INPUT</span><span className="py-1">→</span><span className="rounded border border-slate-700 px-2 py-1">MIX</span><span className="py-1">→</span><span className="rounded border border-slate-700 px-2 py-1">PA</span></div>
            <button onClick={() => navigate('signal')} className="mt-auto flex min-h-11 items-center justify-between pt-5 text-sm font-semibold text-teal-300">Åpne signalveien<ArrowRight size={17} /></button>
          </article>
          <article className="learning-card flex flex-col">
            <div className="mb-5 flex items-center justify-between"><span className="card-icon text-violet-400"><GraduationCap size={20} /></span><span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">03 · Prøv selv</span></div>
            <h3 className="font-bold text-white">Hva ville du gjort?</h3><p className="mb-6 mt-2 text-sm leading-relaxed text-slate-400">Monitoren blir stille. Feil miks er aktiv. Øv på valgene før du står bak bordet.</p>
            <div className="mt-auto"><div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={16} className="text-violet-400" />{progress.solved.length} av {practiceScenarios.length} oppgaver løst</div><button onClick={() => navigate('practice')} className="mt-5 flex min-h-11 w-full items-center justify-between text-sm font-semibold text-violet-300">Ta en øvingsrunde<ArrowRight size={17} /></button></div>
          </article>
        </div>
      </section>
    </div>
  );
}
