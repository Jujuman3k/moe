import { useId, useState } from 'react';
import { AudioLines, Cable, Ear, Layers3, ScanLine, SlidersHorizontal } from 'lucide-react';
import { signalDepth } from '../../../data/signalDepth.js';
import { formatSignalLevel, signalPercent, simulateSignal } from '../../../utils/signalSimulation.js';
import { StageChallenge } from './StageChallenge.jsx';
import '../../../styles/signal-depth.css';

const routes = {
  line: ['M15 50H50','M50 50H85'],
  fork: ['M25 50H48V25H75','M48 50V75H75'],
  sum: ['M25 25H52V50H75','M25 75H52V50'],
  postTap: ['M25 50H48V25H75','M75 25V75'],
};

function reading(key, signal) {
  if (key === 'performer') return {text:'Synger', auxiliary:true};
  if (key === 'room') return {text:'Ikke målt', auxiliary:true};
  if (key === 'detector') return {text:signal.gateClosed ? 'Lukket' : 'Åpen', silent:signal.gateClosed, auxiliary:true};
  const level = signal[key];
  return {text:formatSignalLevel(level), pct:signalPercent(level), silent:level===null, clip:key==='preamp' && signal.clipped};
}

function Schematic({lesson,signal,postTap,selected,onSelect,id}) {
  return <div className={'sd-schematic sd-'+lesson.topology} role="group" aria-label="Målepunkter i eksemplet">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {routes[postTap ? 'postTap' : lesson.topology].map((d,i)=>{
        const destination=lesson.topology==='sum' ? i : i+1;
        return <path key={d} d={d} className={reading(lesson.points[destination].key,signal).silent?'sd-wire-quiet':''}/>;
      })}
    </svg>
    {lesson.points.map((item,i)=>{
      const r = reading(item.key,signal);
      return <button type="button" key={item.key} className={'sd-point sd-point-'+i} aria-pressed={i===selected} aria-controls={id}
        data-quiet={r.silent || undefined} data-clip={r.clip || undefined} onClick={()=>onSelect(i)}>
        <span className="sd-point-id"><b>{'ABC'[i]}</b><span>{item.role}</span></span>
        <strong>{item.title}</strong>
        <span className="sd-readout">{r.text}{r.clip && ' · CLIP'}</span>
        <span className="sd-meter" aria-hidden="true" data-aux={r.auxiliary || undefined}><i style={{width:(r.pct ?? 0)+'%'}} /></span>
      </button>;
    })}
  </div>;
}

export function SignalDepth({nodeId,onTry,onConsole}) {
  const lesson=signalDepth[nodeId], detailId=useId();
  const [variant,setVariant]=useState(0),[selected,setSelected]=useState(lesson?.pick ?? 0);
  if (!lesson) return null;
  const s=simulateSignal(variant ? {...lesson.baseline,...lesson.alternate} : lesson.baseline);
  const point=lesson.points[selected];
  return <section className="sd-lab" aria-label="Spor signalet inni leddet">
    <div className="sd-caption"><span><ScanLine size={16} aria-hidden="true"/> Inni leddet</span><span>Lydløs modell</span></div>
    <h3>{lesson.question}</h3>
    <p className="sd-instruction">Bytt innstilling og se hvor signalet endrer seg. Trykk på et punkt for å undersøke det.</p>
    <div className="sd-variants" role="group" aria-label="Innstilling i eksemplet">
      {lesson.switchLabels.map((label,i)=><button type="button" key={label} aria-pressed={i===variant} onClick={()=>setVariant(i)}>{label}</button>)}
    </div>
    <Schematic lesson={lesson} signal={s} postTap={nodeId==='monitor_branch' && variant===1} selected={selected} onSelect={setSelected} id={detailId}/>
    <p className="sd-outcome" role="status"><AudioLines size={17} aria-hidden="true"/><span>{lesson.observations[variant]}</span></p>
    <div className="sd-inside" id={detailId}>
      <div className="sd-point-heading"><span aria-hidden="true">{'ABC'[selected]}</span><h4>{point.title}</h4><small>{point.role}</small></div>
      <p>{point.meaning}</p>
      <div className="sd-ear"><Ear size={18} aria-hidden="true"/><p><strong>På lydsjekken</strong> {point.check}</p></div>
      {onTry && <button type="button" className="sd-action" onClick={()=>onTry(point.panel)}><SlidersHorizontal size={15} aria-hidden="true"/>Prøv i egen miks</button>}
    </div>
    <StageChallenge nodeId={nodeId}/>
    <details className="sd-desk"><summary><Cable size={16} aria-hidden="true"/> Hvor finner jeg dette på mikseren?</summary><p>{lesson.desk}</p>
      {onConsole && lesson.consolePanel && <button type="button" className="sd-action" onClick={()=>onConsole(lesson.consolePanel)}><Layers3 size={16} aria-hidden="true"/>Åpne C3500-visningen</button>}
    </details>
  </section>;
}
