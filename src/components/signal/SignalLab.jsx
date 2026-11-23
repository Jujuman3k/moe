import { useRef, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { signalJourney, signalMissions } from '../../data/signalJourney.js';
import { signalPathData } from '../../data/signalPathData.js';
import { missionPanels, signalPanels } from '../../data/signalPanels.js';
import { checkSignalMission, defaultSignalState, signalDiagnosis, simulateSignal } from '../../utils/signalSimulation.js';
import { Modal } from '../ui/Modal.jsx';
import { SignalTransport } from './SignalTransport.jsx';
import { SignalJourneyNav, SignalOverview } from './SignalJourneyNav.jsx';
import { defaultChannelForSource } from '../../data/c3500Model.js';
import { signalMapStops } from '../../data/signalRoutes.js';
import { SignalNodeDetail } from './SignalNodeDetail.jsx';
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
import { captureProMix } from '../../utils/proSnapshots.js';
import { ProControls } from './pro/ProControls.jsx';
import { ProPreview } from './pro/ProPreview.jsx';
import { ProLearn } from './pro/ProLearn.jsx';
import { NotebookEntry, ProNotebook } from './pro/ProNotebook.jsx';
import '../../styles/signal-lab.css';
import '../../styles/signal-focus.css';
import '../../styles/signal-audio.css';
import '../../styles/signal-pro.css';

const missionNodes = ['input', 'preamp', 'monitor_branch', 'fader', 'mixbus', 'fx_branch'];

export function SignalLab({ onConsole, initialNodeId, initialSourceId, initialMode, initialTool }) {
  const [state, setState] = useState(() => ({ ...defaultSignalState, proMode: initialMode === 'pro', fxType: initialTool?.fxType || defaultSignalState.fxType }));
  const [step, setStep] = useState(() => Math.max(0, signalJourney.findIndex(item => item.id === (initialNodeId || (initialMode === 'pro' ? 'processing' : 'fader')))));
  const [panels, setPanels] = useState(() => initialTool?.panel ? { [initialTool.node]: initialTool.panel } : {});
  const [fullscreen, setFullscreen] = useState(() => window.matchMedia('(max-width: 899px)').matches);
  const [overlay, setOverlay] = useState(() => initialNodeId && !initialSourceId && !initialMode && !initialTool ? 'depth' : null);
  const [route, setRoute] = useState('all');
  const inspector = useRef(null);
  const [mode, setMode] = useState('explore');
  const [animate, setAnimate] = useState(true);
  const [missionIndex, setMissionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [proPanel, setProPanel] = useState(initialTool?.proPanel || 'peq');
  const [proPageSelections, setProPageSelections] = useState(() => initialTool?.group ? { [initialTool.proPanel]: initialTool.group } : {});
  const [bandIndex, setBandIndex] = useState(0);
  const [lastPreset, setLastPreset] = useState(null);
  const [memoryOrigin, setMemoryOrigin] = useState(null);
  const fullscreenButton = useRef(null);
  const freeMix = useRef(null);
  const audio = useSignalAudio(state, initialSourceId);
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
    setMemoryOrigin(null);
    setState(previous => ({ ...previous, ...patch }));
    setFeedback(null);
    setLastPreset(null);
  }
  function recallMemory(mix) {
    setMemoryOrigin(saved => saved?.source === audio.sourceId ? saved : { source: audio.sourceId, mix: captureProMix(state), original: audio.listening.original });
    setLastPreset(null); setFeedback(null);
    setState(previous => ({ ...previous, ...mix }));
    audio.setListening({ original: false });
  }
  function restoreMemory() {
    if (memoryOrigin?.source !== audio.sourceId) return;
    updateState(memoryOrigin.mix);
    audio.setListening({ original: memoryOrigin.original });
  }
  function leaveMissions() {
    const saved = freeMix.current;
    if (saved) {
      setState(saved.state); setStep(saved.step); setPanels(saved.panels);
      setLastPreset(saved.lastPreset); audio.cue(saved.sourceId); audio.setListening(saved.listening);
      freeMix.current = null;
    }
    setFeedback(null); setMode('explore'); setOverlay(null);
  }
  function changeMode(proMode) {
    if (mode === 'missions') leaveMissions();
    updateState({ proMode }); setMode('explore'); setOverlay(null);
    if (proMode) setStep(signalJourney.findIndex(item => item.id === 'processing'));
  }
  function applyProPreset(section, settings) {
    const previous = { pro: state.pro, bypass: state.bypass };
    updateState({ pro: { ...state.pro, [section]: settings }, bypass: false });
    setLastPreset(previous);
  }
  function openGuideStep(panelId, band) {
    setProPanel(panelId === 'preamp' ? 'peq' : panelId);
    if (band !== undefined) setBandIndex(band);
    if (panelId !== 'preamp') setProPageSelections(previous => ({ ...previous, [panelId]: proPages[panelId][0]?.[0] }));
    audio.setListening({ original: false });
    selectNode(panelId === 'preamp' ? 'preamp' : 'processing');
  }
  function selectNode(id) {
    setStep(signalJourney.findIndex(item => item.id === id));
    setOverlay(null);
  }
  function tryPanel(panelId) {
    const target = signalPanels[node.id].some(([id]) => id === panelId) ? panelId : signalPanels[node.id][0][0];
    setPanels(previous => ({ ...previous, [node.id]: target }));
    if (state.proMode && node.id === 'processing') {
      const id = { hpf: 'filter', eq: 'peq', gate: 'gate', comp: 'comp', ratio: 'comp', bypass: 'bypass' }[target];
      setProPanel(id);
      setProPageSelections(previous => ({ ...previous, [id]: proPages[id][0]?.[0] }));
    }
    setOverlay(null);
    requestAnimationFrame(() => {
      const el = inspector.current?.querySelector('.pro-fields input, .pro-fields button, .signal-node-controls input, .signal-node-controls button') || inspector.current?.querySelector('[role="tab"][aria-selected="true"]');
      el?.focus({ preventScroll: true });
    });
  }
  function consolePanel() {
    if (node.id === 'preamp' || node.id === 'input') return 'preamp';
    if (node.id === 'processing') return (state.proMode ? proPanel : { hpf: 'filter', eq: 'peq', gate: 'gate', comp: 'comp', ratio: 'comp' }[panel]) || 'overview';
    return 'bank';
  }
  function openConsole(panelId = consolePanel()) {
    onConsole?.(defaultChannelForSource(audio.sourceId), panelId === 'bypass' ? 'overview' : panelId, audio.sourceId);
  }
  function loadMission(index) {
    setMemoryOrigin(null);
    audio.useSketch();
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
    if (mode !== 'missions') {
      freeMix.current = { state, step, panels, lastPreset, sourceId: audio.sourceId, listening: audio.listening };
      loadMission(missionIndex);
    }
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

  // A covered graph does not need to redraw. Audio and mixer state continue.
  const showMotion = animate && overlay !== 'depth';
  const content = <section className={`signal-lab signal-focus ${state.proMode ? 'signal-pro' : ''} ${state.proMode && node.id === 'processing' ? 'signal-pro-editing' : ''}`} aria-label="Signalveiens læringslab">
    <SignalTransport audio={audio} animate={animate} onAnimate={() => setAnimate(value => !value)} onChoose={() => setOverlay('audio')} onMissions={openMissions} missionMode={mode === 'missions'} onReset={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState, proMode: state.proMode })} fullscreen={fullscreen} onFullscreen={() => fullscreen ? closeFullscreen() : setFullscreen(true)} fullscreenButton={fullscreenButton} />
    <div className="signal-workbench">
      {state.proMode && node.id === 'processing' ? <ProPreview state={state} signal={signal} panel={proPanel} bandIndex={bandIndex} onBandChange={setBandIndex} onChange={updateState} audio={audio} animate={showMotion} /> : <div className="signal-preview">
        <div className="signal-preview-caption"><span>{audio.source ? 'LYD · MÅLTE SIGNALNIVÅER' : 'SIGNALKART · TRYKK FOR Å UTFORSKE'}</span><span>{audio.playing && <i />} {audio.source ? audio.playing ? 'Spiller' : 'Stoppet' : state.proMode ? 'Ingen lydkilde' : 'Lydløs skisse'}</span></div>
        <SignalMap state={state} signal={signal} animate={showMotion} activeId={node.id} onSelectNode={selectNode} onOpenDepth={() => setOverlay('depth')} route={route} onRouteChange={setRoute} />
        {audio.source || state.proMode ? <SignalAudioScope audio={audio} node={node} animate={showMotion} /> : <SignalScope state={state} signal={signal} node={node} animate={showMotion} />}
        <div className="signal-output-strip" aria-label="Resultat av innstillingene">
          <SignalMeter live={!audio.source} label="Main LR" level={signal.mix} clipped={signal.clipped} />
          <SignalMeter live={!audio.source} label="Monitor" level={signal.monitor} tone="blue" clipped={signal.clipped} />
          <SignalMeter live={!audio.source} label="PA" level={signal.pa} clipped={signal.clipped} />
        </div>
      </div>}
      <div className="signal-inspector" ref={inspector}>
        <div className="signal-inspector-heading"><div className="flow-inspector-locator"><h2 aria-label={node.label}><button className="flow-depth-button" type="button" aria-label={`Se inni ${node.label}`} aria-haspopup="dialog" onClick={() => setOverlay('depth')}><span className="flow-depth-copy"><span className="flow-depth-meta">{signalMapStops[node.id].zone} · {step + 1}/{signalJourney.length} · Se inni</span><span className="flow-depth-name">{node.label}</span></span><ChevronRight size={14} /></button></h2></div><div className="signal-mode-switch" role="group" aria-label="Visningsmodus"><button type="button" aria-label="Enkel modus" aria-pressed={!state.proMode} onClick={() => changeMode(false)}>Enkel</button><button type="button" aria-label="Pro-modus" aria-pressed={state.proMode} onClick={() => changeMode(true)}>Pro</button></div><button type="button" className="studio-guide-button" aria-label="Lær om valgt ledd" aria-haspopup="dialog" title={audio.source ? 'Lyttetips og forklaring' : 'Forklaring og tips'} onClick={() => setOverlay('learn')}><BookOpen size={17} /><span>Tips</span></button></div>
        {proControls ? <ProControls nodeId={node.id} state={state} onChange={updateState} panel={proPanel} onPanelChange={setProPanel} page={proPage} onPageChange={value => setProPageSelections(previous => ({ ...previous, [proPanel]: value }))} bandIndex={bandIndex} audio={audio} onHelp={() => setOverlay('learn')} onUndo={() => updateState(lastPreset)} canUndo={Boolean(lastPreset)} /> : <SignalControls state={state} signal={signal} onChange={updateState} node={node} animate={animate} panel={panel} onPanelChange={value => setPanels(previous => ({ ...previous, [node.id]: value }))} audio={audio} onOpenAudio={() => setOverlay('audio')} />}
      </div>
    </div>
    <SignalJourneyNav step={step} selectNode={selectNode} onOverview={() => setOverlay('overview')} onConsole={onConsole ? () => openConsole() : undefined} />
  </section>;

  return <>
    {fullscreen ? <SignalFullscreen onClose={closeFullscreen}>{content}</SignalFullscreen> : content}
    {overlay === 'depth' && <SignalNodeDetail onVideoTab={audio.stop} node={node} onClose={() => setOverlay(null)} onTry={tryPanel} onConsole={onConsole ? openConsole : undefined} />}
    {overlay && overlay !== 'depth' && <Modal key={overlay} label={overlay === 'notebook' ? 'Miksminne og kildekort' : overlay === 'audio' ? 'Lydvalg' : overlay === 'overview' ? 'Signaloversikt' : overlay === 'missions' ? 'Signaloppdrag' : `Lær: ${node.label}`} onClose={() => setOverlay(null)}>
      {overlay === 'notebook' && audio.source && <ProNotebook source={audio.source} audio={audio} state={state} onRecall={recallMemory} canRestore={memoryOrigin?.source === audio.sourceId} onRestore={restoreMemory} onJump={openGuideStep} onClose={() => setOverlay(null)} />}
      {overlay === 'learn' && proControls && <button type="button" className="flow-inside-link" aria-haspopup="dialog" onClick={() => setOverlay('depth')}><BookOpen size={17} /> Se inni {node.label}<ChevronRight size={16} /></button>}
      {overlay === 'learn' && state.proMode && audio.source && <NotebookEntry onOpen={() => setOverlay('notebook')} />}
      {overlay === 'audio' && <SignalAudioDialog notebook={state.proMode && audio.source ? <NotebookEntry onOpen={() => setOverlay('notebook')} /> : null} audio={audio} onClose={() => setOverlay(null)} onReset={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState, proMode: state.proMode })} animate={animate} onToggleAnimate={() => setAnimate(previous => !previous)} />}
      {overlay === 'overview' && <SignalOverview current={node.id} signal={signal} selectNode={selectNode} />}
      {overlay === 'learn' && (proControls ? <ProLearn panel={node.id === 'preamp' ? 'preamp' : proPanel} source={audio.source} onApply={applyProPreset} onClose={() => setOverlay(null)} onOpenAudio={() => setOverlay('audio')} /> : <div className="signal-learn"><h2>{journey.title}</h2><p>{journey.text}</p><p className="text-teal-300">Prøv: {journey.try}</p>{lesson && <div className="audio-lesson"><h3>Lytt etter · {audio.source.label}</h3><p>{lesson.text}</p>{lesson.patch && <button type="button" className="primary-button" onClick={() => { updateState(lesson.patch); setPanels(previous => ({ ...previous, [lesson.node]: lesson.panel })); selectNode(lesson.node); }}>{lesson.label}</button>}</div>}<div className="node-result"><strong>{diagnosis.title}</strong><p>{diagnosis.text}</p></div><button type="button" className="signal-detail-link" onClick={() => { setOverlay('depth'); }}>Flere verktøy, teori og video →</button><SignalModelNote audio={Boolean(audio.source)} pro={state.proMode} /></div>)}
      {overlay === 'missions' && <div className="signal-mission-brief">
        <h2>Feilsøk med hendene</h2><p>{completed.length}/6 løst denne økten</p>
        <label htmlFor="signal-mission">Velg signaloppdrag</label>
        <select id="signal-mission" value={missionIndex} onChange={event => loadMission(Number(event.target.value))}>{signalMissions.map((item, index) => <option key={item.id} value={index}>{completed.includes(item.id) ? '✓ ' : ''}{item.title}</option>)}</select>
        <p>Oppdraget starter med en lydløs signalmodell. Velg «Fortsett fri utforsking» for å gå tilbake til din egen miks.</p><p>{mission.intro}</p><strong>Mål: {mission.goal}</strong>
        <div className="signal-mission-actions"><button type="button" className="primary-button" onClick={() => setOverlay(null)}>Til kontrollene</button><button type="button" className="secondary-button" onClick={checkMission}>Sjekk løsningen</button><button type="button" className="secondary-button" aria-expanded={showHint} onClick={() => setShowHint(previous => !previous)}>{showHint ? 'Skjul hint' : 'Vis hint'}</button></div>
        {showHint && <p className="text-amber-200">{mission.hint}</p>}
        <div role="status" aria-atomic="true">{feedback && <div className={`signal-feedback ${feedback}`}><strong>{feedback === 'correct' ? 'Løst! Du fant sammenhengen.' : 'Ikke helt ennå. Følg signalet én gang til.'}</strong><p>{feedback === 'correct' ? mission.lesson : mission.goal}</p></div>}</div>
        {feedback === 'correct' && <button type="button" className="primary-button mt-3" onClick={() => loadMission((missionIndex + 1) % signalMissions.length)}>Neste oppdrag</button>}
        <button type="button" className="signal-detail-link" onClick={leaveMissions}>Fortsett fri utforsking</button>
      </div>}
    </Modal>}
  </>;
}
