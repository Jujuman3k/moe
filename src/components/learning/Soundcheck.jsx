import { useEffect, useRef } from 'react';
import { AudioLines, BookOpen, Check, ChevronDown, CircleCheck, Clock3, Headphones, Lightbulb, ListMusic, Mic2, Pause, Play, RotateCcw, SlidersHorizontal, Waves } from 'lucide-react';
import { soundcheckResult, soundcheckSteps as steps } from '../../data/practice/soundcheck.js';

const stageIcons = [Mic2, SlidersHorizontal, Headphones, Waves];
export function SoundcheckLaunch({ round, onStart, onArchive, launchRef }) {
  const finished = round?.step === steps.length;
  return <div className="soundcheck-launch">
    <div className="sc-kicker"><ListMusic size={16} aria-hidden="true" /> Guidet økt <span>·</span> <Clock3 size={14} aria-hidden="true" /> ca. 5 min</div>
    <h2>Lydsjekk før første låt</h2>
    <p>Bandet er på plass. Få vokalen fra scenen til salen i fire korte oppgaver.</p>
    <div className="sc-launch-actions">
      <button className="sc-primary" ref={launchRef} onClick={onStart}>{finished ? <BookOpen /> : <Play />}{finished ? 'Se siste lydsjekk' : round ? 'Fortsett lydsjekken' : 'Start lydsjekken'}</button>
      <button className="sc-quiet" onClick={onArchive}>Bla i oppgavearkivet</button>
    </div>
    {round && !finished && <span className="sc-resume">Steg {round.step + 1} av {steps.length} · {steps[round.step].label}</span>}
  </div>;
}

function StepStrip({ index }) {
  return <ol className="sc-strip" aria-label="Lydsjekkens rekkefølge">{steps.map((s, i) => {
    const Icon = i < index ? Check : stageIcons[i];
    return <li key={s.id} aria-current={i === index ? 'step' : undefined} data-state={i === index ? 'active' : i < index ? 'done' : undefined}>
      <span className="sc-strip-symbol"><Icon size={17} aria-hidden="true" /></span><span>{s.label}</span><span className="sr-only">{i < index ? ', fullført' : ''}</span>
    </li>;
  })}</ol>;
}

export function SoundcheckSession({ session, onPause, onSolve, onExplore }) {
  const { round, update, start } = session;
  const index = round.step;
  const focus = useRef(null);
  const feedback = useRef(null);
  const answered = useRef(false);
  useEffect(() => { focus.current?.focus(); }, [index]);
  const entry = steps[index];
  const answer = round.answers[index];
  useEffect(() => {
    if (answered.current) {
      answered.current = false;
      feedback.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [answer?.last]);
  if (!entry) return <SoundcheckSummary round={round} focus={focus} onArchive={onPause} onRestart={start} onExplore={onExplore} />;
  const { scenario } = entry;
  const choice = scenario.options[answer.last];
  const choose = value => {
    if (choice?.correct) return;
    answered.current = true;
    update({ type: 'answer', index: value });
    if (scenario.options[value].correct) onSolve(scenario.id);
  };
  return <section className="sc-session" aria-labelledby="sc-session-title">
    <header className="sc-session-top"><span className="sc-kicker"><ListMusic size={17} aria-hidden="true" /> Guidet økt</span><button className="sc-quiet" onClick={onPause}><Pause />Ta en pause</button></header>
    <div className="sc-session-heading"><h1 id="sc-session-title">Lydsjekk før første låt</h1><p>Fra vokalmikrofon til ferdig miks.</p></div>
    <StepStrip index={index} />
    <article className="sc-question">
      <p className="sc-kicker">Steg {index + 1} av {steps.length} <span>·</span> {entry.label}</p>
      <h2 ref={focus} tabIndex={-1}>{scenario.title}</h2>
      <p className="sc-cue">{entry.cue}</p>
      <p className="sc-prompt">{scenario.question}</p>
      <div className="sc-options" role="group" aria-label="Velg tiltak">{scenario.options.map((opt, i) => <button key={opt.text}
        aria-pressed={answer.last === i} aria-disabled={choice?.correct || undefined} data-verdict={answer.last === i ? opt.correct ? 'correct' : 'retry' : undefined} onClick={() => choose(i)}>
        <span className="sc-letter" aria-hidden="true">{answer.last === i && opt.correct ? <Check size={16} /> : String.fromCharCode(65 + i)}</span><span>{opt.text}</span>
      </button>)}</div>
      <div role="status" ref={feedback} className="sc-feedback" data-verdict={choice ? choice.correct ? 'correct' : 'retry' : undefined}>
        {choice && <><strong>{choice.correct ? 'Godt vurdert!' : 'Prøv et annet tiltak.'}</strong><p>{choice.feedback.replace(/^Riktig[.!:]\s*/u, '')}</p></>}
      </div>
      {choice?.correct ? <button className="sc-primary sc-next" onClick={() => update({ type: 'next' })}>{index === steps.length - 1 ? 'Se oppsummeringen' : `Neste: ${steps[index + 1].label}`}</button>
        : <><button className="sc-quiet sc-hint" aria-expanded={answer.hint} onClick={() => update({ type: 'hint' })}><Lightbulb />{answer.hint ? 'Skjul hint' : 'Gi meg et hint'}</button>{answer.hint && <p className="sc-hint-text">{scenario.hint}</p>}</>}
    </article>
  </section>;
}

function SoundcheckSummary({ round, focus, onArchive, onRestart, onExplore }) {
  const { firstTry, total, recommended } = soundcheckResult(round);
  const practice = steps[recommended];
  return <section className="sc-summary" aria-labelledby="sc-summary-title">
    <div className="sc-kicker"><CircleCheck size={18} /> Lydsjekk fullført</div>
    <h1 id="sc-summary-title" tabIndex={-1} ref={focus}>Vokalen er klar.</h1>
    <p>Du løste alle fire situasjonene. {total === steps.length ? 'Du traff på første forsøk hele veien.' : `${total} av ${steps.length} satt på første forsøk.`}</p>
    <div className="sc-recap">{steps.map((s, i) => <details key={s.id}>
      <summary><span className="sc-recap-icon"><Check size={17} /></span><span><strong>{s.label}</strong><span>{s.takeaway}</span></span><ChevronDown size={17} /></summary>
      <div><p>{s.scenario.lesson}</p><p className="sc-recap-status">{firstTry[i] ? 'Riktig på første forsøk' : 'Løst etter nytt forsøk'}</p><a href={s.scenario.source} target="_blank" rel="noreferrer">Faggrunnlag: {s.scenario.sourceLabel}</a></div>
    </details>)}</div>
    <div className="sc-transfer"><div className="sc-kicker"><Headphones size={16} /> Fra teori til lyd</div><h2>{practice.action}</h2><p>{practice.task}</p><button className="sc-primary" onClick={() => onExplore(practice.node, { source: 'female', mode: 'easy' })}><AudioLines /> Åpne vokalen i mikseren</button></div>
    <div className="sc-summary-actions"><button className="sc-quiet" onClick={onRestart}><RotateCcw /> Ny lydsjekk</button><button className="sc-quiet" onClick={onArchive}><BookOpen /> Til oppgavearkivet</button></div>
  </section>;
}
