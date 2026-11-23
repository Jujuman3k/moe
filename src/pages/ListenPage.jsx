import { useEffect, useRef, useState } from 'react';
import { AudioLines, Check, CircleHelp, Ear, Headphones, Lightbulb, ListChecks, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { audioSources } from '../data/audioSources.js';
import { listenCases, listenChanges, listenTracks, makeListenRound } from '../data/listenRounds.js';
import { ListenPlayer } from '../components/listen/ListenPlayer.jsx';
import { ListenEvidence } from '../components/listen/ListenEvidence.jsx';
import '../styles/listen.css';

const getSource = id => audioSources.find(source => source.id === id);
function Explore({ item, onExplore }) {
  if (!onExplore) return null;
  const { node, tool } = listenChanges[item.effect];
  return <button type="button" className="listen-text-action" onClick={() => onExplore({ node, source: item.source, mode: 'pro', tool })}><SlidersHorizontal size={16}/> Prøv selv i mikseren</button>;
}

function Question({ item, number, total, onAnswer, onNext, onExplore, focusHeading }) {
  const [heard, setHeard] = useState([]); const [answer, setAnswer] = useState(null); const [hint, setHint] = useState(false);
  const [preview, setPreview] = useState(null);
  const [playback, setPlayback] = useState({ side: null, busy: false });
  const heading = useRef(null); const feedbackTitle = useRef(null); const transport = useRef(null); const source = getSource(item.source);
  const resolved = !!answer, both = heard.length === 2;
  useEffect(() => { if (focusHeading) heading.current?.focus({ preventScroll:true }); }, [focusHeading]);
  useEffect(() => { if (resolved) feedbackTitle.current?.focus(); }, [resolved]);
  function finish(choice) {
    if (resolved || (choice !== 'reveal' && !both)) return;
    setAnswer(choice); onAnswer(choice === item.effect ? 'correct' : choice === 'reveal' ? 'reveal' : 'wrong');
  }
  function markHeard(side) { setHeard(previous => previous.includes(side) ? previous : [...previous, side]); }
  const change = listenChanges[item.effect];
  return <div className="listen-layout">
    <ListenPlayer source={source} question={item} heard={heard} onHeard={markHeard} onReady={setPreview} transportRef={transport} onPlayback={setPlayback} />
    <section className="listen-question" aria-labelledby="listen-question-title">
      <div className="listen-small-label"><Ear size={16}/> Oppgave {number} av {total}</div>
      <h2 ref={heading} tabIndex={-1} id="listen-question-title">Hva er endret i B?</h2>
      <p className="listen-prompt">{resolved ? 'Du kan fortsatt veksle mellom opptakene.' : 'Spill begge versjonene, og velg det du hører.'}</p>
      <div className="listen-answers" role="group" aria-label="Svaralternativer">{item.choices.map(choice => {
        const correct = resolved && choice === item.effect; const wrong = resolved && choice === answer && !correct;
        return <button key={choice} type="button" disabled={resolved || !both} className={`listen-answer ${correct ? 'is-correct' : wrong ? 'is-wrong' : ''}`} onClick={() => finish(choice)}>
          <span className="listen-choice-icon" aria-hidden="true">{correct ? <Check size={15}/> : wrong ? <X size={15}/> : null}</span>
          {listenChanges[choice].label}{correct ? <span className="sr-only"> · riktig svar</span> : wrong ? <span className="sr-only"> · ditt svar</span> : null}
        </button>;
      })}</div>
      {resolved ? <div className="listen-feedback">
        <div role="status"><p className="listen-small-label">{answer === item.effect ? <Check size={15}/> : <Lightbulb size={15}/>} {answer === item.effect ? 'Riktig hørt' : answer === 'reveal' ? 'Fasit vist' : 'Lytt en gang til'}</p>
        <h3 ref={feedbackTitle} tabIndex={-1}>{change.setting}</h3><p>{item.why}</p></div>
        <ListenEvidence effect={item.effect} preview={preview}/>
        <div className="listen-proof-transport" role="group" aria-label="Lytt på nytt etter fasiten"><span>Sammenlign igjen</span>
          {['A','B'].map(side => <button type="button" key={side} disabled={playback.busy} aria-label={side === 'A' ? 'Hør originalen igjen' : 'Hør endringen igjen'} aria-pressed={playback.side === side} onClick={() => void transport.current?.play(side)}>{side} · {side === 'A' ? 'Før' : 'Etter'}</button>)}
          <button type="button" disabled={!playback.side && !playback.busy} onClick={() => transport.current?.stop()}>Stopp</button>
        </div>
        <div className="listen-feedback-actions"><button type="button" className="listen-primary" onClick={onNext}>{number === total ? 'Se rundens resultat' : 'Neste oppgave'}</button><Explore item={item} onExplore={onExplore}/></div>
      </div> : <div className="listen-help">
        <div className="listen-hint-actions"><button type="button" aria-expanded={hint} aria-controls="listen-tip" className="listen-text-action" onClick={() => setHint(!hint)}><Lightbulb size={16}/> {hint ? 'Skjul lyttetips' : 'Gi meg et lyttetips'}</button>
        <button type="button" className="listen-reveal" onClick={() => finish('reveal')}>Vis fasit uten poeng</button></div>
        {hint && <p id="listen-tip" className="listen-hint">{item.hint}</p>}
      </div>}
    </section>
  </div>;
}

function RoundResult({ round, results, onNew, onExplore }) {
  const title = useRef(null);
  useEffect(() => { title.current?.focus({preventScroll:true}); }, []);
  const score = results.filter(result => result === 'correct').length;
  return <section className="listen-results" aria-labelledby="listen-score">
    <div className="listen-result-top"><div><p className="listen-small-label"><ListChecks size={16}/> Runde fullført</p><h2 id="listen-score" tabIndex={-1} ref={title}>{score} av {round.length} riktige</h2><p>{score === round.length ? 'Du hørte riktig i alle tre oppgavene.' : 'Her er grepene du hørte. Prøv ett av dem selv i mikseren.'}</p></div><button type="button" className="listen-primary" onClick={onNew}><RefreshCw size={17}/> Start ny runde</button></div>
    <ul>{round.map((item, index) => <li key={item.id}><span className={'listen-result-icon ' + (results[index] === 'correct' ? 'is-correct' : '')}>{results[index] === 'correct' ? <Check size={18}/> : <Ear size={18}/>}</span><div><p>{getSource(item.source).label} <span>· {listenChanges[item.effect].name}</span></p><small>{results[index] === 'correct' ? 'Riktig hørt' : results[index] === 'reveal' ? 'Du viste fasiten' : 'Ikke riktig denne gangen'}</small></div><Explore item={item} onExplore={onExplore}/></li>)}</ul>
  </section>;
}

export default function ListenPage({ onExplore, initialTrack, onTrackChange }) {
  const entryTrack = Object.hasOwn(listenTracks, initialTrack) ? initialTrack : 'mixed';
  const [track, setTrack] = useState(entryTrack); const [requested, setRequested] = useState(null);
  const [round, setRound] = useState(() => makeListenRound([], Math.random, entryTrack)); const [number, setNumber] = useState(0);
  const [results, setResults] = useState([]); const [roundNo, setRoundNo] = useState(0);
  const done = number >= round.length;
  function next() { setNumber(value => Math.min(value + 1, round.length)); }
  function startNew(nextTrack = track) {
    setRound(previous => makeListenRound(previous, Math.random, nextTrack)); setTrack(nextTrack);
    setResults([]); setNumber(0); setRoundNo(value => value + 1); setRequested(null);
    if (nextTrack !== track) onTrackChange?.(nextTrack);
  }
  function requestTrack(value) {
    if (value === track) { setRequested(null); return; }
    if (!done && results.length) setRequested(value);
    else startNew(value);
  }
  return <div className="listen-page animate-fade-in">
    <header className="listen-header"><div><p className="listen-eyebrow"><Headphones size={16}/> Øretrening</p><h1>Lyttetest</h1><p>Samme opptak, ett miksegrep. Kan du høre hva som endret seg?</p></div>
      <div className="listen-round-progress" aria-label={`Runde: ${results.length} av ${round.length} oppgaver besvart`}><span>{done ? 'Fullført' : 'Din runde'}</span><div>{round.map((item,index) => <i key={item.id} className={results[index] ? 'is-done' : number === index ? 'is-current' : ''}/>)}</div><strong>{results.length}/{round.length}</strong></div>
    </header>
    <section aria-label="Velg hva du vil øve på" className="listen-track">
      <div><label htmlFor="listen-track">Treningsspor</label><select id="listen-track" value={requested || track} onChange={event => requestTrack(event.target.value)}>{Object.entries(listenTracks).map(([id, option]) => <option key={id} value={id}>{option.label}</option>)}</select></div>
      {requested ? <div className="listen-track-confirm"><p>Bytte til {listenTracks[requested].label.toLowerCase()}? Da avsluttes denne runden.</p><button type="button" className="listen-text-action" onClick={() => startNew(requested)}>Bytt spor</button><button type="button" className="listen-reveal" onClick={() => setRequested(null)}>Behold runden</button></div> : <p>{listenTracks[track].cue}</p>}
      <span className="listen-track-count">{listenCases.filter(item => listenTracks[track].effects.includes(item.effect)).length} oppgaver i sporet</span>
    </section>
    {done ? <RoundResult round={round} results={results} onNew={() => startNew()} onExplore={onExplore}/> : <Question key={`${roundNo}-${number}`} item={round[number]} number={number+1} total={round.length} onAnswer={result => setResults(previous => previous.length === number ? [...previous,result] : previous)} onNext={next} onExplore={onExplore} focusHeading={number>0 || roundNo>0}/>}
    <details className="listen-how"><summary><CircleHelp size={17}/> Slik får du mest ut av lyttetesten</summary><div><AudioLines size={22}/><p>Sett et behagelig lyttevolum. <b>A</b> er originalen, <b>B</b> har én endring. Bytt midt i en tone, eller bruk «Fra start» for å sammenligne anslaget. Hodetelefoner kan gjøre det lettere å høre bunnen. På tastatur kan du bruke venstre og høyre pil når A eller B har fokus.</p></div></details>
  </div>;
}
