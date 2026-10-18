import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, RotateCcw } from 'lucide-react';
import { practiceScenarios } from '../data/practiceScenarios.js';
import { practiceScenarioCount, practiceTopics } from '../data/practiceCatalog.js';
import { filterScenarios, nextScenario, pickScenario } from '../utils/practiceLibrary.js';
import { ScenarioCard } from '../components/learning/ScenarioCard.jsx';
import { ScenarioBrowser } from '../components/learning/ScenarioBrowser.jsx';
import { PracticeFilters } from '../components/learning/PracticeFilters.jsx';
import { RoutingLab } from '../components/learning/RoutingLab.jsx';
import { ProgressBar } from '../components/ui/ProgressBar.jsx';

const defaultFilters = { topic: 'all', level: 'all', status: 'all', query: '' };

export default function PracticePage({ learning, onExplore }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [activeId, setActiveId] = useState(null);
  const [justSolvedId, setJustSolvedId] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const focusNext = useRef(false);
  const { solved } = learning.progress;
  const matching = filterScenarios(practiceScenarios, { ...filters, solved });
  // Keep a newly solved card visible in the unsolved filter until the learner
  // explicitly continues, so its explanation never vanishes after a correct answer.
  const scenario = matching.find(item => item.id === activeId)
    ?? (justSolvedId === activeId ? practiceScenarios.find(item => item.id === activeId) : null)
    ?? matching[0];
  const currentId = scenario?.id;
  const currentIndex = matching.findIndex(item => item.id === currentId);
  const next = nextScenario(matching, currentId);
  const previous = currentIndex > 0 ? matching[currentIndex - 1] : null;
  const choose = id => {
    focusNext.current = true;
    setActiveId(id);
    setJustSolvedId(null);
    setAttempt(value => value + 1);
  };
  const changeFilters = changes => {
    setFilters(current => ({ ...current, ...changes }));
    setActiveId(null);
    setJustSolvedId(null);
    setAttempt(value => value + 1);
  };
  useEffect(() => {
    if (focusNext.current) {
      document.getElementById('scenario-heading')?.focus();
      focusNext.current = false;
    }
  }, [currentId, attempt]);

  return (
    <div className="animate-fade-in space-y-6">
      <header className="hero-surface grid gap-4 rounded-3xl border border-slate-800 p-5 md:gap-6 md:p-8 lg:grid-cols-[1fr_280px] lg:items-center">
        <div><p className="eyebrow"><GraduationCap size={15} /> Fra teori til praksis</p><h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-4xl">Små valg. Bedre lyd.</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{practiceScenarioCount} scenarioer i {practiceTopics.length} fagområder. Forstå valgene bak en god miks.</p>
          <div className="mt-4 hidden flex-wrap gap-2 text-[10px] font-medium text-slate-400 md:flex"><span className="rounded-full border border-slate-700 px-3 py-1">3 nivåer</span><span className="rounded-full border border-slate-700 px-3 py-1">Hint og svarforklaringer</span><span className="rounded-full border border-slate-700 px-3 py-1">Lær i ditt tempo</span></div>
        </div>
        <div className="border-t border-slate-700/60 pt-4 md:rounded-2xl md:border md:bg-slate-950/50 md:p-5"><p className="mb-4 hidden text-3xl font-bold text-white md:block">{solved.length}<span className="ml-2 text-base font-normal text-slate-500">av {practiceScenarioCount}</span></p><ProgressBar value={solved.length} max={practiceScenarioCount} label="Oppgaver løst" /><p className="mt-3 text-[11px] text-slate-500">Lagres i denne nettleseren. Du kan alltid repetere.</p></div>
      </header>
      <PracticeFilters filters={filters} onChange={changeFilters} onReset={() => changeFilters(defaultFilters)} solved={solved}
        canRandom={matching.some(item => item.id !== currentId)} onRandom={() => { const picked = pickScenario(matching, currentId, solved); if (picked) choose(picked.id); }} />
      <p role="status" className="text-xs text-slate-400">{matching.length} {matching.length === 1 ? 'scenario' : 'scenarioer'} i utvalget{filters.status === 'unsolved' && justSolvedId === currentId ? ' · svaret ditt er lagret, les forklaringen før du går videre' : ''}</p>
      {scenario ? <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ScenarioBrowser scenarios={matching} activeId={currentId} solved={solved} onSelect={choose} />
        <div className="min-w-0 space-y-4">
          <ScenarioCard key={`${currentId}-${attempt}`} scenario={scenario} onSolve={id => { setActiveId(id); setJustSolvedId(id); learning.solveScenario(id); }} onExplore={onExplore} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2"><button disabled={!previous} onClick={() => choose(previous.id)} className="secondary-button"><ArrowLeft size={15} />Forrige</button><button onClick={() => { focusNext.current = true; setAttempt(value => value + 1); }} className="secondary-button"><RotateCcw size={15} />Prøv på nytt</button></div>
            {next && <button onClick={() => choose(next.id)} className="primary-button">Neste oppgave <ArrowRight size={16} /></button>}
          </div>
          {solved.includes(currentId) && <p className="flex items-center gap-2 text-xs text-teal-400"><CheckCircle2 size={15} />Denne oppgaven er løst. Du kan fortsatt utforske de andre svarene.</p>}
          {!matching.length && <div className="rounded-xl border border-teal-800 bg-teal-950/30 p-4 text-sm text-teal-200"><p>Alle oppgavene i dette utvalget er løst!</p><button onClick={() => changeFilters({ status: 'all' })} className="mt-3 min-h-11 font-semibold underline underline-offset-4">Vis oppgavene igjen</button></div>}
        </div>
      </div> : <section className="rounded-2xl border border-dashed border-slate-700 p-8 text-center"><h2 className="text-lg font-semibold text-white">Ingen scenarioer i dette utvalget</h2><p className="mt-2 text-sm text-slate-400">Prøv et annet tema, nivå eller søkeord. Uløste-filteret kan også være tomt fordi du har fullført oppgavene.</p><button onClick={() => changeFilters(defaultFilters)} className="secondary-button mt-5">Vis alle scenarioer</button></section>}
      <details className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Din progresjon i alle {practiceTopics.length} fagområder</summary>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {practiceTopics.map(topic => {
            const count = topic.scenarioIds.filter(id => solved.includes(id)).length;
            return <button key={topic.id} onClick={() => { changeFilters({ ...defaultFilters, topic: topic.id }); focusNext.current = true; }} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left hover:border-blue-500/60">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-200">{topic.label}<span className="text-xs font-normal text-teal-400">{count}/{topic.scenarioIds.length}</span></span><span className="mt-1 block text-xs text-slate-500">{topic.description}</span><span className="mt-3 block h-1 overflow-hidden rounded-full bg-slate-800"><span className="block h-full rounded-full bg-teal-500" style={{ width: `${count / topic.scenarioIds.length * 100}%` }} /></span>
            </button>;
          })}
        </div>
      </details>
      <details className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"><summary className="cursor-pointer text-sm font-semibold text-slate-200">Prøv selv: pre/post-laben</summary><div className="mt-5 max-w-xl"><RoutingLab /></div></details>
      <p className="text-xs leading-relaxed text-slate-500">Egenlagde læringssituasjoner med lenker til faggrunnlag fra Allen &amp; Heath, Shure og Yamaha. Tilpass valgene til kilden, rommet og mikseroppsettet ditt.</p>
    </div>
  );
}
