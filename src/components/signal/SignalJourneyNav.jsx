import { ArrowLeft, ArrowRight, Grid2X2, Check } from 'lucide-react';
import { signalJourney } from '../../data/signalJourney.js';
import { signalPathData } from '../../data/signalPathData.js';
import { formatSignalLevel } from '../../utils/signalSimulation.js';

const stops = {
  input: ['Inngang', 'Følg forbindelsen fra kilden.'],
  preamp: ['Gain', 'Gi opptaket et godt inngangsnivå.'],
  processing: ['Prosessering', 'Form klang og dynamikk.'],
  fader: ['Fader', 'Plasser kanalen i miksen.'],
  monitor_branch: ['Monitor', 'Bestem hva musikeren hører.'],
  fx_branch: ['Effekter', 'Send en kopi til klang eller delay.'],
  mixbus: ['Main LR', 'Samle kanal og effektretur.'],
  matrix: ['Matrix', 'Fordel miksen til en egen sone.'],
  speakers: ['PA', 'Følg nivået helt til utgangen.'],
};
const groups = [
  ['Kanal', ['input', 'preamp', 'processing', 'fader']],
  ['Avgreninger', ['monitor_branch', 'fx_branch']],
  ['Ut til salen', ['mixbus', 'matrix', 'speakers']],
];

export function SignalJourneyNav({ step, selectNode, onOverview }) {
  const previous = signalJourney[step - 1];
  const next = signalJourney[(step + 1) % signalJourney.length];
  return <nav className="signal-focus-navigation studio-journey-nav" aria-label="Navigasjon i signalveien">
    <button type="button" disabled={!previous} aria-label="Forrige steg" onClick={() => selectNode(previous.id)}><ArrowLeft size={17} /><span><small>Forrige</small><b>{previous ? stops[previous.id][0] : 'Start'}</b></span></button>
    <button type="button" aria-label="Oversikt" aria-haspopup="dialog" onClick={onOverview}><Grid2X2 size={16} /><span><small>Ledd {step + 1} av {signalJourney.length}</small><b>Oversikt</b></span></button>
    <button type="button" aria-label={next.id === 'input' ? 'Fra starten' : 'Neste steg'} onClick={() => selectNode(next.id)}><span><small>{next.id === 'input' ? 'Fra starten' : 'Neste'}</small><b>{stops[next.id][0]}</b></span><ArrowRight size={17} /></button>
  </nav>;
}

export function SignalOverview({ current, signal, selectNode }) {
  return <div className="signal-overview studio-overview"><p className="studio-kicker">Signalverkstedet</p><h2>Hvor vil du utforske?</h2><p>Velg et ledd. Monitor og effekter er avgreninger fra kanalen. Innstillingene følger med når du flytter deg.</p>
    {groups.map(([label, ids]) => <section key={label}><h3>{label}</h3>{ids.map(id => {
      const number = signalJourney.findIndex(item => item.id === id) + 1;
      const name = signalPathData.find(item => item.id === id).label;
      return <button key={id} type="button" aria-pressed={id === current} aria-label={`${number}. ${name} · ${stops[id][1]}`} onClick={() => selectNode(id)}>
        <span className="studio-stop-index" aria-hidden="true">{id === current ? <Check size={17} /> : String(number).padStart(2, '0')}</span>
        <span><b>{stops[id][0]}</b><small>{stops[id][1]}</small></span>
        <span className="studio-stop-level">{id === current ? 'Du er her' : formatSignalLevel(signal.nodes[id])}</span>
      </button>;
    })}</section>)}
  </div>;
}
