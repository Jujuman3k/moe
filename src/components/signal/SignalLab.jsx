import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Grid2X2, Maximize2, Pause, Play, RotateCcw, Target, X } from 'lucide-react';
import { signalJourney, signalMissions } from '../../data/signalJourney.js';
import { signalPathData } from '../../data/signalPathData.js';
import { missionPanels, signalPanels } from '../../data/signalPanels.js';
import { checkSignalMission, defaultSignalState, formatSignalLevel, signalDiagnosis, simulateSignal } from '../../utils/signalSimulation.js';
import { Modal } from '../ui/Modal.jsx';
import { SignalMap } from './SignalMap.jsx';
import { SignalScope } from './SignalScope.jsx';
import { SignalMeter } from './SignalMeter.jsx';
import { SignalControls } from './SignalControls.jsx';
import { SignalFullscreen } from './SignalFullscreen.jsx';
import { SignalModelNote } from './SignalModelNote.jsx';
import '../../styles/signal-lab.css';
import '../../styles/signal-focus.css';

const missionNodes = ['input', 'preamp', 'monitor_branch', 'fader', 'mixbus', 'fx_branch'];

export function SignalLab({ onOpenNode, initialNodeId }) {
  const [state, setState] = useState({ ...defaultSignalState });
  const [step, setStep] = useState(() => Math.max(0, signalJourney.findIndex(item => item.id === (initialNodeId || 'fader'))));
  const [panels, setPanels] = useState({});
  const [fullscreen, setFullscreen] = useState(() => window.matchMedia('(max-width: 899px)').matches);
  const [overlay, setOverlay] = useState(null);
  const [mode, setMode] = useState('explore');
  const [animate, setAnimate] = useState(true);
  const [missionIndex, setMissionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState([]);
  const fullscreenButton = useRef(null);
  const signal = simulateSignal(state);
  const journey = signalJourney[step];
  const node = signalPathData.find(item => item.id === journey.id);
  const panel = panels[node.id] || signalPanels[node.id][0][0];
  const mission = signalMissions[missionIndex];
  const diagnosis = signalDiagnosis(state, signal);

  function updateState(patch) {
    setState(previous => ({ ...previous, ...patch }));
    setFeedback(null);
  }
  function selectNode(id) {
    setStep(signalJourney.findIndex(item => item.id === id));
    setOverlay(null);
  }
  function loadMission(index) {
    setMode('missions');
    setMissionIndex(index);
    setState({ ...defaultSignalState, ...signalMissions[index].start });
    setStep(signalJourney.findIndex(item => item.id === missionNodes[index]));
    setPanels(previous => ({ ...previous, [missionNodes[index]]: missionPanels[index] }));
    setFeedback(null);
    setShowHint(false);
  }
  function openMissions() {
    if (mode !== 'missions') loadMission(missionIndex);
    setOverlay('missions');
  }
  function checkMission() {
    const correct = checkSignalMission(mission.id, state);
    setFeedback(correct ? 'correct' : 'retry');
    if (correct) setCompleted(previous => previous.includes(mission.id) ? previous : [...previous, mission.id]);
  }
  function closeFullscreen() {
    setFullscreen(false);
    requestAnimationFrame(() => fullscreenButton.current?.focus({ preventScroll: true }));
  }

  const content = <section className="signal-lab signal-focus" aria-label="Signalveiens læringslab">
    <header className="signal-focus-toolbar">
      <span className="signal-focus-brand">Signalverksted<span>{mode === 'missions' ? `Oppdrag ${missionIndex + 1}/6` : 'Utforsk · visuell modell'}</span></span>
      <button type="button" aria-label="6 oppdrag" className="signal-toolbar-button" data-active={mode === 'missions'} onClick={openMissions}><Target size={18} /></button>
      <button type="button" className="signal-toolbar-button" aria-label={animate ? 'Pause signalbevegelse' : 'Start signalbevegelse'} aria-pressed={!animate} onClick={() => setAnimate(previous => !previous)}>{animate ? <Pause size={18} /> : <Play size={18} />}</button>
      <button type="button" aria-label="Nullstill" className="signal-toolbar-button" onClick={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState })}><RotateCcw size={18} /></button>
      <button ref={fullscreenButton} type="button" className="signal-toolbar-button signal-enter" aria-label={fullscreen ? 'Tilbake til portalen' : 'Åpne mikser i fullskjerm'} onClick={() => fullscreen ? closeFullscreen() : setFullscreen(true)}>{fullscreen ? <X size={20} /> : <Maximize2 size={18} />}</button>
    </header>
    <div className="signal-workbench">
      <div className="signal-preview">
        <div className="signal-preview-caption"><span>VELG ET LEDD I KARTET</span><span><i /> Live respons</span></div>
        <SignalMap state={state} signal={signal} animate={animate} activeId={node.id} onSelectNode={selectNode} />
        <SignalScope state={state} signal={signal} node={node} animate={animate} />
        <div className="signal-output-strip" aria-label="Resultat av innstillingene">
          <SignalMeter label="Main LR" level={signal.mix} clipped={signal.clipped} />
          <SignalMeter label="Monitor" level={signal.monitor} tone="blue" clipped={signal.clipped} />
          <SignalMeter label="PA" level={signal.pa} clipped={signal.clipped} />
        </div>
      </div>
      <div className="signal-inspector">
        <div className="signal-inspector-heading"><div><p>LEDD {step + 1} / {signalJourney.length}</p><h2>{node.label}</h2></div><button type="button" aria-label="Lær om valgt ledd" onClick={() => setOverlay('learn')}><BookOpen size={19} /></button></div>
        <SignalControls state={state} signal={signal} onChange={updateState} node={node} animate={animate} panel={panel} onPanelChange={value => setPanels(previous => ({ ...previous, [node.id]: value }))} />
      </div>
    </div>
    <nav className="signal-focus-navigation" aria-label="Navigasjon i signalveien">
      <button type="button" disabled={step === 0} aria-label="Forrige steg" onClick={() => selectNode(signalJourney[step - 1].id)}><ArrowLeft size={18} /><span>Forrige</span></button>
      <button type="button" onClick={() => setOverlay('overview')}><Grid2X2 size={17} /> Oversikt</button>
      <button type="button" aria-label={step === signalJourney.length - 1 ? 'Fra starten' : 'Neste steg'} onClick={() => selectNode(signalJourney[(step + 1) % signalJourney.length].id)}><span>{step === signalJourney.length - 1 ? 'Start' : 'Neste'}</span><ArrowRight size={18} /></button>
    </nav>
  </section>;

  return <>
    {fullscreen ? <SignalFullscreen onClose={closeFullscreen}>{content}</SignalFullscreen> : content}
    {overlay && <Modal label={overlay === 'overview' ? 'Signaloversikt' : overlay === 'missions' ? 'Signaloppdrag' : `Lær: ${node.label}`} onClose={() => setOverlay(null)}>
      {overlay === 'overview' && <div className="signal-overview"><h2>Hvor vil du utforske?</h2><p>Velg et ledd. Innstillingene og fanene dine beholdes.</p><div>{signalJourney.map((item, index) => { const entry = signalPathData.find(value => value.id === item.id); return <button key={item.id} type="button" aria-pressed={item.id === node.id} onClick={() => selectNode(item.id)}><span>{index + 1}. {entry.label}</span><small>{formatSignalLevel(signal.nodes[item.id])}</small></button>; })}</div></div>}
      {overlay === 'learn' && <div className="signal-learn"><h2>{journey.title}</h2><p>{journey.text}</p><p className="text-teal-300">Prøv: {journey.try}</p><div className="node-result"><strong>{diagnosis.title}</strong><p>{diagnosis.text}</p></div><button type="button" className="signal-detail-link" onClick={() => { setOverlay(null); requestAnimationFrame(() => onOpenNode(node)); }}>Flere verktøy, teori og video →</button><SignalModelNote /></div>}
      {overlay === 'missions' && <div className="signal-mission-brief">
        <h2>Feilsøk med hendene</h2><p>{completed.length}/6 løst denne økten</p>
        <label htmlFor="signal-mission">Velg signaloppdrag</label>
        <select id="signal-mission" value={missionIndex} onChange={event => loadMission(Number(event.target.value))}>{signalMissions.map((item, index) => <option key={item.id} value={index}>{completed.includes(item.id) ? '✓ ' : ''}{item.title}</option>)}</select>
        <p>{mission.intro}</p><strong>Mål: {mission.goal}</strong>
        <div className="signal-mission-actions"><button type="button" className="primary-button" onClick={() => setOverlay(null)}>Til kontrollene</button><button type="button" className="secondary-button" onClick={checkMission}>Sjekk løsningen</button><button type="button" className="secondary-button" aria-expanded={showHint} onClick={() => setShowHint(previous => !previous)}>{showHint ? 'Skjul hint' : 'Vis hint'}</button></div>
        {showHint && <p className="text-amber-200">{mission.hint}</p>}
        <div role="status" aria-atomic="true">{feedback && <div className={`signal-feedback ${feedback}`}><strong>{feedback === 'correct' ? 'Løst! Du fant sammenhengen.' : 'Ikke helt ennå. Følg signalet én gang til.'}</strong><p>{feedback === 'correct' ? mission.lesson : mission.goal}</p></div>}</div>
        {feedback === 'correct' && <button type="button" className="primary-button mt-3" onClick={() => loadMission((missionIndex + 1) % signalMissions.length)}>Neste oppdrag</button>}
        <button type="button" className="signal-detail-link" onClick={() => { setMode('explore'); setOverlay(null); }}>Fortsett fri utforsking</button>
      </div>}
    </Modal>}
  </>;
}
