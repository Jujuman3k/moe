import { AudioLines, AudioWaveform, Drum, Guitar, MicVocal, Piano, SlidersHorizontal } from 'lucide-react';
import { createElement } from 'react';
import { audioSources } from '../../data/audioSources.js';
import { sourceWaveforms } from '../../data/sourceWaveforms.js';

const instruments = { male:MicVocal, female:MicVocal, kick:Drum, snare:Drum, bass:Guitar, guitar:Guitar, piano:Piano };
const sessionNotes = {
  vokalplass: 'Tre separate klipp. Hvor lite piano og gitar trenger du rundt vokalen for at ordene skal bli tydelige?',
  grunnmur: 'Hører du anslaget fra kicket og tonen fra bassen hver for seg?',
  duett: 'Plasser to ulike vokalopptak i stereobildet, med pianoet som holdepunkt i midten.',
};
const sceneOrder = ['grunnmur', 'vokalplass', 'duett'];
const sessionNames = { vokalplass:'Vokal', grunnmur:'Rytme', duett:'Duett' };

// Each drawing is a peak envelope of its own entire source clip (not a live
// level meter, a common time axis, or the output of the mix).
function StemTrace({ sourceId }) {
  const { peaks } = sourceWaveforms[sourceId];
  const envelope = peaks.map((peak, index) => [index * 2, Math.max(.45, peak * .135)]);
  const upper = envelope.map(([x, h]) => `${x},${15-h}`).join(' ');
  const lower = [...envelope].reverse().map(([x,h]) => `${x},${15+h}`).join(' ');
  return <svg viewBox={`0 0 ${(peaks.length-1)*2} 30`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d={`M ${upper} L ${lower} Z`} fill="currentColor"/>
  </svg>;
}

export function SessionDeck({ scenes, scene, onScene, onSolo, onLaunch }) {
  return <section className="home-session-deck" aria-labelledby="home-session-title">
    <div className="home-deck-top"><span><AudioLines size={17} aria-hidden="true"/> Sesjonsvalg</span><span>{scene.tracks.length} kanaler / Stereo</span></div>
    <div className="home-desk-surface">
      <div className="home-scene-picker" role="group" aria-label="Velg økt i Bandrommet">
        {[...scenes].sort((a,b) => sceneOrder.indexOf(a.id)-sceneOrder.indexOf(b.id)).map(item => <button key={item.id} type="button" aria-pressed={item.id === scene.id} onClick={() => onScene(item.id)}>{sessionNames[item.id] || item.title}</button>)}
      </div>
      <div className="home-scene-info" aria-live="polite" aria-atomic="true">
        <h2 id="home-session-title">{scene.title}</h2>
        <p>{sessionNotes[scene.id]}</p>
      </div>
      <div className="home-trackbank" role="group" aria-label="Utforsk enkeltspor">
        {scene.tracks.map((track, index) => {
          const source = audioSources.find(item => item.id === track.id);
          return <button type="button" key={source.id} className="home-track"
            style={{ '--source-ink':source.color }} onClick={() => onSolo(source.id)}
            aria-label={`Utforsk ${source.label.toLowerCase()} alene`}>
            <span className="home-track-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
            <span className="home-track-name">{createElement(instruments[source.id] || AudioWaveform, {size:15,'aria-hidden':true})}{source.label}</span>
            <span className="home-track-trace"><StemTrace sourceId={source.id} /></span>
            <SlidersHorizontal size={14} className="home-track-open" aria-hidden="true"/>
          </button>;
        })}
      </div>
      <div className="home-deck-bottom">
        <p className="home-desk-hint">Velg et spor for å utforske det alene.</p>
        <button type="button" className="home-desk-open" onClick={onLaunch} aria-label={`Miks økten: ${scene.title}`}>Miks økten</button>
      </div>
    </div>
  </section>;
}
