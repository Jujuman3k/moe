import { useRef, useState } from 'react';
import { AudioWaveform, Cable, Disc3, Ear, Headphones, ListMusic, SlidersHorizontal } from 'lucide-react';
import { audioSources } from '../data/audioSources.js';
import { bandScenes } from '../data/bandScenes.js';
import { SourcePreview } from '../components/home/SourcePreview.jsx';
import { SessionDeck } from '../components/home/SessionDeck.jsx';
import { LearningShelf } from '../components/home/LearningShelf.jsx';
import { RoutingLab } from '../components/learning/RoutingLab.jsx';
import '../styles/studio-home.css';

export function HomePage({ navigate, learning, onOpenVideo }) {
  const [sourceId, setSourceId] = useState('male');
  const [sceneId, setSceneId] = useState('grunnmur');
  const selector = useRef(null);
  const source = audioSources.find(item => item.id === sourceId);
  const scene = bandScenes.find(item => item.id === sceneId) || bandScenes[0];
  const openBand = () => navigate('bandroom', { scene:scene.id });
  function openSolo(id) {
    if (id) setSourceId(id);
    selector.current?.focus({ preventScroll:true });
    selector.current?.closest('section.studio-solo')?.scrollIntoView({ block:'start' });
  }
  return <div className="studio-home animate-fade-in">
    <section className="studio-hero" aria-labelledby="studio-hero-heading">
      <div className="studio-hero-copy">
        <p className="studio-home-kicker"><AudioWaveform size={16} aria-hidden="true"/> Lydteknikk i praksis</p>
        <h1 id="studio-hero-heading">Forstå signalet.<br/><em>Hør helheten.</em></h1>
        <p className="studio-lede">Miks kick, bass og skarptromme i en fast rytme. Bytt til vokaløvelsene for å trene på nivå og panorering med uavhengige opptak.</p>
        <div className="studio-hero-actions">
          <button type="button" className="studio-primary home-session-launch" onClick={openBand}><SlidersHorizontal size={18} aria-hidden="true"/>Åpne Bandrommet</button>
          <button type="button" className="studio-secondary" onClick={() => navigate('listen')}><Headphones size={18} aria-hidden="true"/>Ta en lyttetest</button>
        </div>
        <button type="button" className="studio-easy-link" onClick={() => openSolo()}>Vil du starte med én lyd? <span>Velg enkeltkanal</span></button>
      </div>
      <SessionDeck scenes={bandScenes} scene={scene} onScene={setSceneId} onSolo={openSolo} onLaunch={openBand} />
    </section>

    <section className="studio-solo" aria-labelledby="studio-solo-title">
      <div className="home-solo-copy">
        <p className="studio-section-tag"><Disc3 size={16} aria-hidden="true"/> Enkeltkanal</p>
        <h2 id="studio-solo-title">Kom tett på én lyd.</h2>
        <p>Hør originalopptaket, åpne det i mikseren og prøv ett grep om gangen.</p>
      </div>
      <SourcePreview source={source} onSelect={setSourceId} selectRef={selector} />
      <div className="home-solo-tools">
        <div className="home-solo-listen" aria-live="polite" aria-atomic="true">
          <Ear size={18} aria-hidden="true"/><p><strong>Lytt etter · {source.label}</strong>{source.focus}</p>
        </div>
        <div className="studio-hero-actions">
          <button type="button" className="studio-primary" onClick={() => navigate('signal', { node:'processing', source:source.id, mode:'pro' })}><SlidersHorizontal size={18} aria-hidden="true"/>Åpne Pro-mikseren</button>
          <button type="button" className="studio-secondary" onClick={() => navigate('signal', { node:'input', source:source.id, mode:'easy' })}><ListMusic size={18} aria-hidden="true"/>Start i Enkel-modus</button>
        </div>
      </div>
    </section>
    <LearningShelf navigate={navigate} progress={learning.progress} onOpenVideo={onOpenVideo} />
    <section className="studio-routing" aria-labelledby="studio-routing-heading">
      <div className="studio-routing-intro"><p className="studio-section-tag"><Cable size={15} aria-hidden="true"/> Signaløvelse</p><h2 id="studio-routing-heading">Én fader. <br/>To lyttepunkter.</h2>
        <p>Du senker vokalen i salen. Skal sangeren også få mindre vokal i monitoren? Flytt faderen, bytt send-punkt og sammenlign nivåene.</p>
      </div>
      <RoutingLab />
    </section>
  </div>;
}
