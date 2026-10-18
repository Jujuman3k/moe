import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Compass, Pause, Play, RotateCcw, Target } from 'lucide-react';
import { signalJourney, signalMissions } from '../../data/signalJourney.js';
import { signalPathData } from '../../data/signalPathData.js';
import { checkSignalMission, defaultSignalState, simulateSignal } from '../../utils/signalSimulation.js';
import { SignalMap } from './SignalMap.jsx';
import { SignalScope } from './SignalScope.jsx';
import { SignalMeter } from './SignalMeter.jsx';
import { SignalControls } from './SignalControls.jsx';
import '../../styles/signal-lab.css';

const missionNodes = ['input', 'preamp', 'monitor_branch', 'fader', 'mixbus', 'fx_branch'];

export function SignalLab({ onOpenNode, initialNodeId }) {
  const [state, setState] = useState({ ...defaultSignalState });
  const [step, setStep] = useState(() => Math.max(0, signalJourney.findIndex(item => item.id === (initialNodeId || 'fader'))));
  const [mode, setMode] = useState('explore');
  const [animate, setAnimate] = useState(true);
  const [missionIndex, setMissionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState([]);
  const previewRef = useRef(null);
  const controlsRef = useRef(null);
  const signal = simulateSignal(state);
  const journey = signalJourney[step];
  const node = signalPathData.find(item => item.id === journey.id);
  const mission = signalMissions[missionIndex];

  function updateState(patch) {
    setState(previous => ({ ...previous, ...patch }));
    setFeedback(null);
  }
  function selectNode(id) {
    setStep(signalJourney.findIndex(item => item.id === id));
    if (window.matchMedia('(max-width: 899px)').matches) requestAnimationFrame(() => {
      if (!controlsRef.current || !previewRef.current) return;
      const offset = controlsRef.current.getBoundingClientRect().top - 80 - previewRef.current.getBoundingClientRect().height;
      window.scrollBy({ top: offset, behavior: 'instant' });
    });
  }
  function loadMission(index) {
    setMissionIndex(index);
    setState({ ...defaultSignalState, ...signalMissions[index].start });
    setStep(signalJourney.findIndex(item => item.id === missionNodes[index]));
    setFeedback(null);
    setShowHint(false);
  }
  function changeMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    if (nextMode === 'missions') loadMission(missionIndex);
    else { setState({ ...defaultSignalState }); setFeedback(null); }
  }
  function checkMission() {
    const correct = checkSignalMission(mission.id, state);
    setFeedback(correct ? 'correct' : 'retry');
    if (correct) setCompleted(previous => previous.includes(mission.id) ? previous : [...previous, mission.id]);
  }

  return <section className="signal-lab" aria-label="Signalveiens læringslab">
    <div className="signal-lab-toolbar">
      <div className="signal-mode-switch" role="group" aria-label="Læringsmodus">
        <button type="button" aria-pressed={mode === 'explore'} onClick={() => changeMode('explore')}><Compass size={15} /> Utforsk</button>
        <button type="button" aria-pressed={mode === 'missions'} onClick={() => changeMode('missions')}><Target size={15} /> 6 oppdrag</button>
      </div>
      <div className="flex gap-1">
        <button type="button" className="signal-toolbar-button" aria-label={animate ? 'Pause signalbevegelse' : 'Start signalbevegelse'} aria-pressed={!animate} onClick={() => setAnimate(previous => !previous)}>{animate ? <Pause size={16} /> : <Play size={16} />}</button>
        <button type="button" className="signal-toolbar-button" onClick={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState })}><RotateCcw size={15} /><span>Nullstill</span></button>
      </div>
    </div>
    {mode === 'missions' && <div className="signal-mission-brief">
      <label htmlFor="signal-mission">Feilsøk med hendene · {completed.length}/6 løst denne økten</label>
      <select id="signal-mission" aria-label="Velg signaloppdrag" value={missionIndex} onChange={event => loadMission(Number(event.target.value))}>{signalMissions.map((item, index) => <option key={item.id} value={index}>{completed.includes(item.id) ? '✓ ' : ''}{item.title}</option>)}</select>
      <p>{mission.intro}</p><strong>Mål: {mission.goal}</strong>
    </div>}
    <div className="signal-workbench">
      <div className="signal-preview" ref={previewRef}>
        <div className="signal-preview-caption"><span>TRYKK PÅ ET LEDD</span><select className="signal-compact-picker" aria-label="Velg signalledd" value={node.id} onChange={event => selectNode(event.target.value)}>{signalPathData.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select><span><i /> Live respons · visuelt</span></div>
        <SignalMap state={state} signal={signal} animate={animate} activeId={node.id} onSelectNode={selectNode} />
        <SignalScope state={state} signal={signal} node={node} animate={animate} />
        <div className="signal-output-strip" aria-label="Resultat av innstillingene">
          <SignalMeter label="Main LR" level={signal.mix} clipped={signal.clipped} />
          <SignalMeter label="Monitor" level={signal.monitor} tone="blue" clipped={signal.clipped} />
          <SignalMeter label="PA" level={signal.pa} clipped={signal.clipped} />
        </div>
      </div>
      <div className="signal-inspector" ref={controlsRef}>
        <div className="signal-inspector-heading">
          <div><p>LEDD {step + 1} / {signalJourney.length}</p><h2>{node.label}</h2></div>
          <div><button type="button" aria-label="Forrige steg" disabled={step === 0} onClick={() => selectNode(signalJourney[step - 1].id)}><ArrowLeft size={18} /></button><button type="button" aria-label={step === signalJourney.length - 1 ? 'Fra starten' : 'Neste steg'} onClick={() => selectNode(signalJourney[(step + 1) % signalJourney.length].id)}><ArrowRight size={18} /></button></div>
        </div>
        <SignalControls state={state} signal={signal} onChange={updateState} node={node} animate={animate} onOpenNode={onOpenNode} />
        <details className="signal-lesson"><summary>{journey.title}</summary><p>{journey.text}</p><p className="text-teal-300">Prøv: {journey.try}</p></details>
        {mode === 'missions' && <div className="signal-mission-actions">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="primary-button" onClick={checkMission}><CheckCircle2 size={17} /> Sjekk løsningen</button>
            <button type="button" className="secondary-button" aria-expanded={showHint} onClick={() => setShowHint(previous => !previous)}><CircleHelp size={16} />{showHint ? 'Skjul hint' : 'Vis hint'}</button>
            {feedback === 'correct' && <button type="button" className="secondary-button" onClick={() => loadMission((missionIndex + 1) % signalMissions.length)}>Neste oppdrag <ArrowRight size={16} /></button>}
          </div>
          {showHint && <p className="mt-3 text-sm text-amber-200">{mission.hint}</p>}
          <div role="status" aria-atomic="true">{feedback && <div className={`signal-feedback ${feedback}`}><strong>{feedback === 'correct' ? 'Løst! Du fant sammenhengen.' : 'Ikke helt ennå. Følg signalet én gang til.'}</strong><p>{feedback === 'correct' ? mission.lesson : mission.goal}</p></div>}</div>
        </div>}
      </div>
    </div>
    <details className="signal-model-note"><summary>Om modellen og dLive</summary>
      <p>En visuell læringsmodell uten lydavspilling eller miksertilkobling. Bølgeformen er tegnet langsommere og med felles zoom for før/etter. Tonepulsen gjør refleksjoner og ekko synlige. Tidsforskyvningene er i millisekunder; bærebølgen er en skisse.</p>
      <p>Nivåene beregnes for testfrekvensen. HPF er et ideelt 12 dB/oktav-filter, EQ er et løft/kutt ved testtonen, gate og kompressor er statiske modeller uten attack/release. Bypass lar deg sammenligne. Klang er en forenklet serie refleksjoner, ikke en kopi av en dLive-effekt.</p>
      <p>Main LR summerer tørr kanal og FX-retur som tilnærmet effekt for ukorrelerte signaler. Meteret er ikke et nøyaktig peak-meter. Pan flytter den tørre kanalen; FX-returen fordeles likt til L/R. Matrix er én mulig distribusjonsvei, og PA viser elektrisk nivå, ikke lydtrykk. Ingen høyttaler- eller rommodell. Parameterendringer beregner en ny skisse; allerede eksisterende klanghaler beholdes ikke når en rute slås av.</p>
      <p>Monitoruttaket er etter processing, med valgfri pre/post-fade. Mute stopper alle sends her; FX er post-fade. Kontroller faktisk Mix Source, routing og mute-oppsett i showet.</p>
      <p>Kilder: <a href="https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing" target="_blank" rel="noreferrer">Allen & Heath · Routing</a>, <a href="https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen" target="_blank" rel="noreferrer">Processing</a> og <a href="https://support.allen-heath.com/hc/en-gb/articles/39793907886609-FX" target="_blank" rel="noreferrer">FX</a>.</p>
    </details>
  </section>;
}
