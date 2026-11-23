import { useState } from 'react';
import { AudioWaveform, Cable, Headphones, SlidersHorizontal } from 'lucide-react';
import { audioSources } from '../data/audioSources.js';
import { SourcePreview } from '../components/home/SourcePreview.jsx';
import { LearningShelf } from '../components/home/LearningShelf.jsx';
import { RoutingLab } from '../components/learning/RoutingLab.jsx';
import '../styles/studio-home.css';

export function HomePage({ navigate, learning, onOpenVideo }) {
  const [sourceId, setSourceId] = useState('male');
  const source = audioSources.find(item => item.id === sourceId);
  const openMixer = () => navigate('signal', { node:'processing', source:source.id, mode:'pro' });
  return <div className="studio-home animate-fade-in">
    <section className="studio-hero" aria-labelledby="studio-hero-heading">
      <div className="studio-hero-copy">
        <p className="studio-kicker"><AudioWaveform size={16} aria-hidden="true"/> Lydteknikk i praksis</p>
        <h1 id="studio-hero-heading">Forstå signalet.<br/><em>Hør forskjellen.</em></h1>
        <p className="studio-lede">Velg et opptak, form lyden med EQ og hør hva som skjer. Øv på dLive C3500 i ditt eget tempo.</p>
      </div>
      <SourcePreview source={source} onSelect={setSourceId} />
      <div className="studio-hero-controls">
        <div className="studio-hero-actions"><button type="button" className="studio-primary" onClick={openMixer}><SlidersHorizontal size={18} aria-hidden="true"/>Åpne Pro-mikseren</button>
          <button type="button" className="studio-secondary" onClick={() => navigate('listen')}><Headphones size={18} aria-hidden="true"/>Ta en lyttetest</button></div>
        <button className="studio-easy-link" type="button" onClick={() => navigate('signal')}>Ny ved mikseren? <span>Start i Enkel-modus</span></button>
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
