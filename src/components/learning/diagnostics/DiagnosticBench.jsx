import { useEffect, useRef, useState } from 'react';
import { Activity, AudioLines, Check, ChevronDown, CircleCheck, ClipboardList, CornerDownRight, ListTree, LockKeyhole, Radar, RotateCcw, ScanLine, SlidersHorizontal } from 'lucide-react';
import { diagnosticIndex } from '../../../data/practice/diagnosticIndex.js';
import { hasEvidence, restoreDiagnostic, updateDiagnostic } from '../../../data/practice/diagnosticSession.js';
import '../../../styles/diagnostic-bench.css';

export function DiagnosticLaunch({ onStart }) {
  return <section className="dx-launch" aria-labelledby="dx-launch-title">
    <span className="dx-launch-symbol"><Radar aria-hidden="true" /></span>
    <div><h2 id="dx-launch-title">Feilsøkingsbenken</h2><p>Seks feil fra en livejobb. Finn siste friske ledd før du endrer miksen.</p></div>
    <button type="button" className="dx-launch-button" onClick={onStart}><ScanLine size={17} aria-hidden="true" /> Åpne feilsøkingsbenken</button>
  </section>;
}

function ProbeButton({ probe, round, code, prerequisite, onInspect }) {
  const open = !probe.after || round.seen.includes(probe.after);
  const visited = round.seen.includes(probe.id);
  const Icon = !open ? LockKeyhole : visited ? Check : probe.after ? CornerDownRight : ScanLine;
  return <button className="dx-probe" type="button" aria-pressed={round.selected === probe.id} disabled={!open}
    onClick={() => onInspect(probe.id)}>
    <small><span>{code} · {probe.point}</span><Icon size={15} aria-hidden="true" /></small>
    <strong>{probe.label}</strong>
    <span className="dx-probe-note">{!open ? 'Åpnes etter ' + prerequisite : visited ? 'Undersøkt' : probe.after ? 'Følg opp funnet' : 'Les observasjon'}</span>
  </button>;
}

function Observation({ reading, count }) {
  return <div className="dx-instrument" data-filled={Boolean(reading)} aria-live="polite" aria-atomic="true">
    <div className="dx-instrument-bar"><span><Activity size={16} aria-hidden="true" /> Observasjon</span><b>{count}/4 undersøkt</b></div>
    {reading ? <><h3>{reading.reading}</h3><p>{reading.note}</p></> : <><h3>Hva vil du sjekke først?</h3><p>Velg en av de to startkontrollene. Hvert funn åpner en ny måte å følge signalet på.</p></>}
  </div>;
}

export function DiagnosticBench({ item, onFault, onExplore }) {
  const key = 'lydteam.diagnose.v1.' + item.id;
  const [round, setRound] = useState(() => {
    try { return restoreDiagnostic(item, sessionStorage.getItem(key)); } catch { return restoreDiagnostic(item, null); }
  });
  const heading = useRef(null), solution = useRef(null), focusSolution = useRef(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => heading.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [item.id]);
  useEffect(() => {
    try { sessionStorage.setItem(key, JSON.stringify(round)); } catch { /* Still usable without storage. */ }
    if (round.solved && focusSolution.current) { focusSolution.current = false; solution.current?.focus(); }
  }, [key, round]);
  const send = event => setRound(old => updateDiagnostic(item, old, event));
  const reading = item.probes.find(p => p.id === round.selected);
  const attempted = item.options.find(o => o.id === round.attempt);
  const currentIndex = diagnosticIndex.findIndex(x => x.id === item.id);
  const { node, mode, tool, label } = item.mixer;
  const onApply = id => {
    focusSolution.current = id === item.correct && hasEvidence(item, round.seen);
    send({ type: 'apply', id });
  };
  const reset = () => { send({ type: 'reset' }); heading.current?.focus(); };
  return <section className="dx-bench" aria-labelledby="dx-title">
    <header className="dx-bar"><span className="dx-mark"><Radar size={18} aria-hidden="true" /> Feilsøkingsbenken</span>
      <button type="button" onClick={() => onFault(null)} className="dx-back"><ClipboardList size={15} /> Til Øv selv</button></header>
    <div className="dx-page-head">
      <div><p className="dx-overline">Sak {String(currentIndex + 1).padStart(2, '0')} / {String(diagnosticIndex.length).padStart(2, '0')} <span>·</span> {item.context}</p>
        <h1 ref={heading} tabIndex={-1} id="dx-title">{item.title}</h1><p className="dx-report">{item.report}</p></div>
      <label className="dx-picker"><span>Bytt sak</span><span><select value={item.id} onChange={e => onFault(e.target.value)}>
        {diagnosticIndex.map(x => <option value={x.id} key={x.id}>{x.title}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
    </div>
    <div className="dx-panels">
      <section className="dx-investigate" aria-labelledby="dx-probes-title">
        <div className="dx-section-line"><span className="dx-index">01</span><h2 id="dx-probes-title">Spor signalet</h2></div>
        <p className="dx-intro">Simulerte målinger og lytteobservasjoner. Denne delen spiller ikke av lyd.</p>
        <div className="dx-branches" role="group" aria-label="Velg et kontrollpunkt">{item.probes.filter(p=>!p.after).map((start, i) => {
          const end = item.probes.find(p => p.after === start.id), letter = i ? 'B' : 'A';
          return <div key={start.id} className="dx-branch"><ProbeButton probe={start} round={round} code={letter + '1'} onInspect={id => send({ type:'inspect', id })} />
            <span className="dx-wire" aria-hidden="true" /><ProbeButton probe={end} round={round} code={letter + '2'} prerequisite={letter + '1'} onInspect={id => send({ type:'inspect', id })} /></div>;
        })}</div>
        <Observation reading={reading} count={round.seen.length} />
      </section>
      <section className="dx-actions" aria-labelledby="dx-actions-title">
        <div className="dx-section-line"><span className="dx-index">02</span><h2 id="dx-actions-title">Velg tiltak</h2></div>
        <p className="dx-intro">{round.solved ? 'Tiltaket er bekreftet. Ta kontrollprøven under.' : round.seen.length ? 'Hvilken endring passer med funnene dine?' : 'Undersøk ett kontrollpunkt for å åpne tiltakene.'}</p>
        <div className="dx-options" role="group" aria-label="Mulige tiltak">{item.options.map((o,i) => <button type="button" key={o.id} disabled={!round.seen.length || round.solved}
          aria-pressed={round.attempt === o.id} data-solved={round.solved && o.id===item.correct} onClick={() => onApply(o.id)}>
          <span>{round.solved && o.id === item.correct ? <Check size={16} /> : String.fromCharCode(65 + i)}</span>{o.text}</button>)}</div>
        <div role="status" className="dx-response">{attempted && !round.solved && (attempted.id === item.correct ? <><strong>Hva bekrefter mistanken?</strong><p>Følg opp med en av kontrollene på andre rad før du velger tiltaket igjen.</p></> : <><strong>Dette løser ikke feilen her.</strong><p>{attempted.outcome}</p></>)}</div>
        {!round.solved && <p className="dx-session-note"><ListTree size={15} aria-hidden="true" /> Funnene beholdes i denne fanen.</p>}
      </section>
    </div>
    {round.solved && <section className="dx-solution" aria-labelledby="dx-solved">
      <div className="dx-section-line"><CircleCheck size={21} aria-hidden="true" /><h2 id="dx-solved" tabIndex={-1} ref={solution}>Feilen er lokalisert</h2></div>
      <dl><div><dt>Årsak</dt><dd>{item.cause}</dd></div><div><dt>Kontrollprøve</dt><dd>{item.verify}</dd></div></dl>
      <div className="dx-solution-actions"><button type="button" className="dx-launch-button" onClick={() => onExplore(node, { source: item.source, mode, ...(tool ? {tool} : {}) })}>
        <SlidersHorizontal size={17} aria-hidden="true" />{label}</button>
        <button type="button" className="dx-back" onClick={() => onFault(diagnosticIndex[(currentIndex + 1) % diagnosticIndex.length].id)}><AudioLines size={16} />Neste sak</button>
        <button type="button" className="dx-back" onClick={reset}><RotateCcw size={15} />Nullstill saken</button></div>
      <p className="dx-session-note">Mikseren åpnes med originalopptaket. Prøv grepet selv; saksinnstillingene lastes ikke inn.</p>
    </section>}
  </section>;
}
