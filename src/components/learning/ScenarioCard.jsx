import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lightbulb, RotateCcw } from 'lucide-react';
import { practiceLevels } from '../../data/practiceCatalog.js';

export function ScenarioCard({ scenario, onSolve, onExplore }) {
  const [answer, setAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const chosen = answer === null ? null : scenario.options[answer];
  const select = index => {
    setAnswer(index);
    if (scenario.options[index].correct) onSolve(scenario.id);
  };
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 md:p-7" aria-labelledby="scenario-heading">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">Case · {scenario.tag}</span><span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-400">{practiceLevels.find(level => level.id === scenario.level).label} · ca. 2 min</span></div>
      <h2 id="scenario-heading" tabIndex={-1} className="mb-3 mt-4 scroll-mt-24 text-xl font-bold text-white md:text-2xl">{scenario.title}</h2>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-300">{scenario.question}</p>
      <div className="space-y-3" role="group" aria-label="Velg et svar">
        {scenario.options.map((option, index) => (
          <button key={option.text} onClick={() => select(index)} aria-pressed={answer === index}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${answer === index ? option.correct ? 'border-teal-500 bg-teal-500/10 text-teal-100' : 'border-amber-500 bg-amber-500/10 text-amber-100' : 'border-slate-700 text-slate-300 hover:border-blue-400 hover:bg-slate-800'}`}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-slate-400">{String.fromCharCode(65 + index)}</span>{option.text}
          </button>
        ))}
      </div>
      <div className="mt-4" aria-live="polite">
        {chosen && <div className={`rounded-xl p-4 text-sm leading-relaxed ${chosen.correct ? 'bg-teal-500/10 text-teal-200' : 'bg-amber-500/10 text-amber-200'}`}>
          <p className="mb-1 flex items-center gap-2 font-semibold">{chosen.correct ? <CheckCircle2 size={16} /> : <RotateCcw size={16} />}{chosen.correct ? 'Godt vurdert!' : 'Prøv en annen tilnærming'}</p>{chosen.feedback}
        </div>}
        {chosen?.correct && <div className="mt-4 border-l-2 border-teal-500 pl-4 text-sm leading-relaxed text-slate-300"><p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-400">Ta med deg</p><p>{scenario.lesson}</p></div>}
        {showHint && !chosen?.correct && <p className="mt-3 text-sm text-slate-400">Hint: {scenario.hint}</p>}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={() => setShowHint(!showHint)} aria-expanded={showHint} className="flex min-h-11 items-center gap-2 text-xs font-medium text-slate-400 hover:text-white"><Lightbulb size={15} />{showHint ? 'Skjul hint' : 'Vis et hint'}</button>
        <button onClick={() => onExplore(scenario.nodeId)} className="flex min-h-11 items-center gap-2 text-xs font-medium text-blue-300 hover:text-blue-200">Utforsk i signalveien <ArrowRight size={15} /></button>
        <a href={scenario.source} target="_blank" rel="noreferrer" className="min-h-11 content-center text-xs text-slate-400 underline decoration-slate-700 underline-offset-4 hover:text-slate-200">Faggrunnlag: {scenario.sourceLabel}</a>
      </div>
    </section>
  );
}
