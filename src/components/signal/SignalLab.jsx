import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Grid2X2, Headphones, Maximize2, Pause, Play, RotateCcw, Square, Target, X } from 'lucide-react';
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
import { SignalAudioDialog } from './SignalAudioDialog.jsx';
import { SignalAudioScope } from './SignalAudioScope.jsx';
import { useSignalAudio } from '../../hooks/useSignalAudio.js';
import { audioLesson } from '../../data/audioSources.js';
import { proPages } from '../../data/proAudioSettings.js';
import { ProControls } from './pro/ProControls.jsx';
import { ProPreview } from './pro/ProPreview.jsx';
import { ProLearn } from './pro/ProLearn.jsx';
import '../../styles/signal-lab.css';
import '../../styles/signal-focus.css';
import '../../styles/signal-audio.css';
import '../../styles/signal-pro.css';

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
  const [proPanel, setProPanel] = useState('peq');
  const [proPageSelections, setProPageSelections] = useState({});
  const [bandIndex, setBandIndex] = useState(0);
  const [lastPreset, setLastPreset] = useState(null);
  const fullscreenButton = useRef(null);
  const audio = useSignalAudio(state);
  const modelSignal = simulateSignal(state);
  const signal = audio.source || state.proMode ? { ...modelSignal, ...(audio.meters || simulateSignal({ ...state, connected: false })) } : modelSignal;
  const journey = signalJourney[step];
  const node = signalPathData.find(item => item.id === journey.id);
  const panel = panels[node.id] || signalPanels[node.id][0][0];
  const proControls = state.proMode && ['preamp', 'processing'].includes(node.id);
  const proPage = proPageSelections[proPanel] || proPages[proPanel][0]?.[0];
  const mission = signalMissions[missionIndex];
  const diagnosis = audio.source && state.muted && signal.fxReturn !== null
    ? { title: 'Kanalen er mutet, men effekthalen lever videre.', text: 'Mute stopper nytt signal til sendene. Klang og delay kan fortsatt komme tilbake via FX-returen. Slå av returen for å stoppe den veien.' }
    : signalDiagnosis(state, signal);
  const lesson = audio.source && !(state.proMode && node.id === 'input') ? audioLesson(audio.source, node.id, panel) : null;

  function updateState(patch) {
    setState(previous => ({ ...previous, ...patch }));
    setFeedback(null);
    setLastPreset(null);
  }
  function changeMode(proMode) {
    updateState({ proMode }); setMode('explore'); setOverlay(null);
    if (proMode) setStep(signalJourney.findIndex(item => item.id === 'processing'));
  }
  function applyProPreset(section, settings) {
    const previous = { pro: state.pro, bypass: state.bypass };
    updateState({ pro: { ...state.pro, [section]: settings }, bypass: false });
    setLastPreset(previous);
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
    setLastPreset(null);
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

  const content = <section className={`signal-lab signal-focus ${state.proMode ? 'signal-pro' : ''} ${state.proMode && node.id === 'processing' ? 'signal-pro-editing' : ''}`} aria-label="Signalveiens læringslab">
    <header className="signal-focus-toolbar">
      <button type="button" className="signal-source-button" aria-label="Velg lydkilde og lyttepunkt" onClick={() => setOverlay('audio')}><span><Headphones size={16} /><b>{audio.source?.label || 'Velg lyd'}</b><ChevronDown size={12} /></span><small>{audio.source ? audio.status === 'loading' ? 'Laster lyd…' : audio.error ? 'Lydfeil · åpne for å prøve igjen' : `${audio.listening.original ? 'Original' : audio.listening.target === 'main' ? 'Main LR' : audio.listening.target === 'pa' ? 'PA' : 'Monitor'} · ${audio.playing ? 'spiller' : 'stoppet'}` : 'Opptak du kan mikse'}</small></button>
      <button type="button" aria-label="6 oppdrag" className="signal-toolbar-button" data-active={mode === 'missions'} onClick={openMissions}><Target size={18} /></button>
      {audio.source ? <><button type="button" className="signal-toolbar-button audio-play" aria-label={audio.playing || audio.status === 'loading' ? 'Stopp lyd' : 'Spill lyd'} onClick={() => audio.playing || audio.status === 'loading' ? audio.stop() : void audio.play()}>{audio.playing || audio.status === 'loading' ? <Square size={18} /> : <Play size={18} />}</button><button type="button" className="signal-toolbar-button audio-ab" aria-label="Sammenlign med original" aria-pressed={audio.listening.original} onClick={() => audio.setListening({ original: !audio.listening.original })}>{audio.listening.original ? 'Orig.' : 'A/B'}</button></> : <><button type="button" className="signal-toolbar-button" aria-label={animate ? 'Pause signalbevegelse' : 'Start signalbevegelse'} aria-pressed={!animate} onClick={() => setAnimate(previous => !previous)}>{animate ? <Pause size={18} /> : <Play size={18} />}</button><button type="button" aria-label="Nullstill" className="signal-toolbar-button" onClick={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState, proMode: state.proMode })}><RotateCcw size={18} /></button></>}
      <button ref={fullscreenButton} type="button" className="signal-toolbar-button signal-enter" aria-label={fullscreen ? 'Tilbake til portalen' : 'Åpne mikser i fullskjerm'} onClick={() => fullscreen ? closeFullscreen() : setFullscreen(true)}>{fullscreen ? <X size={20} /> : <Maximize2 size={18} />}</button>
    </header>
    <div className="signal-workbench">
      {state.proMode && node.id === 'processing' ? <ProPreview state={state} signal={signal} panel={proPanel} bandIndex={bandIndex} onBandChange={setBandIndex} onChange={updateState} audio={audio} animate={animate} /> : <div className="signal-preview">
        <div className="signal-preview-caption"><span>{audio.source ? 'LYD · MÅLTE SIGNALNIVÅER' : 'VELG ET LEDD I KARTET'}</span><span><i /> {audio.source ? audio.playing ? 'Spiller' : 'Stoppet' : 'Live respons'}</span></div>
        <SignalMap state={state} signal={signal} animate={animate} activeId={node.id} onSelectNode={selectNode} />
        {audio.source || state.proMode ? <SignalAudioScope audio={audio} node={node} animate={animate} /> : <SignalScope state={state} signal={signal} node={node} animate={animate} />}
        <div className="signal-output-strip" aria-label="Resultat av innstillingene">
          <SignalMeter live={!audio.source} label="Main LR" level={signal.mix} clipped={signal.clipped} />
          <SignalMeter live={!audio.source} label="Monitor" level={signal.monitor} tone="blue" clipped={signal.clipped} />
          <SignalMeter live={!audio.source} label="PA" level={signal.pa} clipped={signal.clipped} />
        </div>
      </div>}
      <div className="signal-inspector">
        <div className="signal-inspector-heading"><div><p>LEDD {step + 1} / {signalJourney.length}{state.proMode && ' · PRO'}</p><h2>{node.label}</h2></div><div className="signal-mode-switch" role="group" aria-label="Visningsmodus"><button type="button" aria-label="Enkel modus" aria-pressed={!state.proMode} onClick={() => changeMode(false)}>Enkel</button><button type="button" aria-label="Pro-modus" aria-pressed={state.proMode} onClick={() => changeMode(true)}>Pro</button></div><button type="button" aria-label="Lær om valgt ledd" onClick={() => setOverlay('learn')}><BookOpen size={19} /></button></div>
        {proControls ? <ProControls nodeId={node.id} state={state} onChange={updateState} panel={proPanel} onPanelChange={setProPanel} page={proPage} onPageChange={value => setProPageSelections(previous => ({ ...previous, [proPanel]: value }))} bandIndex={bandIndex} audio={audio} onHelp={() => setOverlay('learn')} onUndo={() => updateState(lastPreset)} canUndo={Boolean(lastPreset)} /> : <SignalControls state={state} signal={signal} onChange={updateState} node={node} animate={animate} panel={panel} onPanelChange={value => setPanels(previous => ({ ...previous, [node.id]: value }))} audio={audio} onOpenAudio={() => setOverlay('audio')} />}
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
    {overlay && <Modal label={overlay === 'audio' ? 'Lydvalg' : overlay === 'overview' ? 'Signaloversikt' : overlay === 'missions' ? 'Signaloppdrag' : `Lær: ${node.label}`} onClose={() => setOverlay(null)}>
      {overlay === 'audio' && <SignalAudioDialog audio={audio} onClose={() => setOverlay(null)} onReset={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState, proMode: state.proMode })} animate={animate} onToggleAnimate={() => setAnimate(previous => !previous)} />}
      {overlay === 'overview' && <div className="signal-overview"><h2>Hvor vil du utforske?</h2><p>Velg et ledd. Innstillingene og fanene dine beholdes.</p><div>{signalJourney.map((item, index) => { const entry = signalPathData.find(value => value.id === item.id); return <button key={item.id} type="button" aria-pressed={item.id === node.id} onClick={() => selectNode(item.id)}><span>{index + 1}. {entry.label}</span><small>{formatSignalLevel(signal.nodes[item.id])}</small></button>; })}</div></div>}
      {overlay === 'learn' && (proControls ? <ProLearn panel={node.id === 'preamp' ? 'preamp' : proPanel} source={audio.source} onApply={applyProPreset} onClose={() => setOverlay(null)} onOpenAudio={() => setOverlay('audio')} /> : <div className="signal-learn"><h2>{journey.title}</h2><p>{journey.text}</p><p className="text-teal-300">Prøv: {journey.try}</p>{lesson && <div className="audio-lesson"><h3>Lytt etter · {audio.source.label}</h3><p>{lesson.text}</p>{lesson.patch && <button type="button" className="primary-button" onClick={() => { updateState(lesson.patch); setPanels(previous => ({ ...previous, [lesson.node]: lesson.panel })); selectNode(lesson.node); }}>{lesson.label}</button>}</div>}<div className="node-result"><strong>{diagnosis.title}</strong><p>{diagnosis.text}</p></div><button type="button" className="signal-detail-link" onClick={() => { audio.stop(); setOverlay(null); requestAnimationFrame(() => onOpenNode(node)); }}>Flere verktøy, teori og video →</button><SignalModelNote audio={Boolean(audio.source)} pro={state.proMode} /></div>)}
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
