import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Compass, Pause, Play, RotateCcw, Target } from 'lucide-react';
import { signalJourney, signalMissions } from '../../data/signalJourney.js';
import { checkSignalMission, defaultSignalState, simulateSignal } from '../../utils/signalSimulation.js';
import { SignalMap } from './SignalMap.jsx';
import { SignalControls } from './SignalControls.jsx';
import '../../styles/signal-lab.css';

export function SignalLab({ onOpenNode, initialNodeId }) {
  const [state, setState] = useState({ ...defaultSignalState });
  const [step, setStep] = useState(() => Math.max(0, signalJourney.findIndex(item => item.id === initialNodeId)));
  const [mode, setMode] = useState('explore');
  const [animate, setAnimate] = useState(true);
  const [missionIndex, setMissionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState([]);
  const signal = simulateSignal(state);
  const journey = signalJourney[step];
  const mission = signalMissions[missionIndex];

  function updateState(patch) {
    setState(previous => ({ ...previous, ...patch }));
    setFeedback(null);
  }

  function loadMission(index) {
    setMissionIndex(index);
    setState({ ...defaultSignalState, ...signalMissions[index].start });
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
      <div className="flex gap-1 rounded-xl border border-slate-700/60 bg-slate-950/60 p-1" role="group" aria-label="Læringsmodus">
        <button className="signal-tab" type="button" aria-pressed={mode === 'explore'} onClick={() => changeMode('explore')}><Compass size={16} /> Utforsk</button>
        <button className="signal-tab" type="button" aria-pressed={mode === 'missions'} onClick={() => changeMode('missions')}><Target size={16} /> 6 oppdrag</button>
      </div>
      <div className="flex gap-1">
        <button type="button" className="signal-toolbar-button" aria-label={animate ? 'Pause signalbevegelse' : 'Start signalbevegelse'} aria-pressed={!animate} onClick={() => setAnimate(previous => !previous)}>{animate ? <Pause size={16} /> : <Play size={16} />}<span className="hidden sm:inline">{animate ? 'Pause' : 'Spill'}</span></button>
        <button type="button" className="signal-toolbar-button" onClick={() => mode === 'missions' ? loadMission(missionIndex) : updateState({ ...defaultSignalState })}><RotateCcw size={16} /><span>Nullstill</span></button>
      </div>
    </div>
    {mode === 'explore' ? <div className="signal-journey">
      <div className="signal-step-number" aria-hidden="true">{String(step + 1).padStart(2, '0')}</div>
      <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">Følg stemmen · Steg {step + 1} av {signalJourney.length}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">{journey.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{journey.text}</p>
        <p className="mt-2 text-xs leading-relaxed text-teal-200">Prøv: {journey.try}</p>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <button className="signal-toolbar-button" type="button" aria-label="Forrige steg" disabled={step === 0} onClick={() => setStep(previous => previous - 1)}><ArrowLeft size={18} /></button>
        <button className="secondary-button whitespace-nowrap" type="button" onClick={() => setStep(previous => (previous + 1) % signalJourney.length)}>{step === signalJourney.length - 1 ? 'Fra starten' : 'Neste steg'}<ArrowRight size={16} /></button>
      </div>
    </div> : <div className="signal-mission-brief">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0"><label htmlFor="signal-mission" className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-purple-300">Feilsøk med hendene</label>
          <select id="signal-mission" aria-label="Velg signaloppdrag" value={missionIndex} onChange={event => loadMission(Number(event.target.value))} className="max-w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white">
            {signalMissions.map((item, index) => <option key={item.id} value={index}>{completed.includes(item.id) ? '✓ ' : ''}{item.title}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400">{completed.length}/{signalMissions.length} løst denne økten</p>
      </div>
      <p className="mt-4 text-sm text-slate-300">{mission.intro}</p>
      <p className="mt-2 text-sm font-medium text-purple-200">Mål: {mission.goal}</p>
    </div>}
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 px-4 pb-4 sm:px-6">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">Én kilde · tre signalveier</p>
      <a href="#signal-mixer" onClick={event => { event.preventDefault(); document.getElementById('signal-mixer')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); document.getElementById('lab-gain')?.focus({ preventScroll: true }); }} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-teal-300">Til mikseren <ArrowDown size={14} /></a>
    </div>
    <div className={`signal-workbench ${mode === 'missions' ? 'signal-workbench-missions' : ''}`}>
      <SignalMap state={state} signal={signal} animate={animate} activeId={mode === 'explore' ? journey.id : null} onOpenNode={node => { setStep(signalJourney.findIndex(item => item.id === node.id)); onOpenNode(node); }} />
      <div>
        <SignalControls state={state} signal={signal} onChange={updateState} />
        {mode === 'missions' && <div className="signal-mission-actions">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="primary-button" onClick={checkMission}><CheckCircle2 size={17} /> Sjekk løsningen</button>
            <button type="button" className="secondary-button" aria-expanded={showHint} onClick={() => setShowHint(previous => !previous)}><CircleHelp size={16} />{showHint ? 'Skjul hint' : 'Vis hint'}</button>
            {feedback === 'correct' && <button type="button" className="secondary-button" onClick={() => loadMission((missionIndex + 1) % signalMissions.length)}>Neste oppdrag <ArrowRight size={16} /></button>}
          </div>
          {showHint && <p className="mt-3 text-sm leading-relaxed text-amber-200">{mission.hint}</p>}
          <div role="status" aria-atomic="true">{feedback && <div className={`mt-4 rounded-xl border p-4 ${feedback === 'correct' ? 'border-teal-500/30 bg-teal-950/40' : 'border-amber-500/30 bg-amber-950/30'}`}>
            <p className={`font-semibold ${feedback === 'correct' ? 'text-teal-300' : 'text-amber-300'}`}>{feedback === 'correct' ? 'Løst! Du fant sammenhengen.' : 'Ikke helt ennå. Følg signalet én gang til.'}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{feedback === 'correct' ? mission.lesson : mission.goal}</p>
          </div>}</div>
        </div>}
      </div>
    </div>
    <details className="signal-model-note">
      <summary className="cursor-pointer py-3 text-xs font-medium text-slate-400">Om modellen og dLive</summary>
      <div className="space-y-2 pb-4 text-xs leading-relaxed text-slate-400">
        <p>Dette er en visuell læringsmodell, uten lydavspilling eller tilkobling til mikseren. Kilden er konstant og tilsvarer −48 dBFS ved 0 dB gain i modellen. Målerne viser beregnede digitale nivåer, ikke lydtrykk eller den faktiske dLive-meterskalaen.</p>
        <p>Processing og bus-mastere står på unity. Monitorens uttak er etter processing, med valgfri pre/post-fade. Kanal-mute stopper alle sendinger i eksemplet. FX er post-fade; returen er en egen vei til Main LR. Main-, matrix- og PA-målerne viser bare den tørre stemmen. FX-summering, etterklangshaler og høyttalerbehandling beregnes ikke.</p>
        <p>På dLive kan Mix Source og pre/post-fade konfigureres; også FX kan settes pre-fade. Matrix er én mulig distribusjonsvei. Sjekk showets faktiske routing.</p>
        <p>Kilder: <a className="text-teal-300 underline" href="https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing" target="_blank" rel="noreferrer">Allen & Heath · Routing</a> og <a className="text-teal-300 underline" href="https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen" target="_blank" rel="noreferrer">Processing Screen</a>.</p>
      </div>
    </details>
  </section>;
}
