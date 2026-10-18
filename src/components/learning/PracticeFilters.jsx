import { useState } from 'react';
import { Search, Shuffle, SlidersHorizontal } from 'lucide-react';
import { practiceLevels, practiceTopics } from '../../data/practiceCatalog.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';

const inputStyle = 'mt-2 min-h-11 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200';

export function PracticeFilters({ filters, onChange, onReset, onRandom, canRandom, solved }) {
  const desktop = useMediaQuery('(min-width: 768px)');
  const [expanded, setExpanded] = useState(false);
  const showAdvanced = desktop || expanded;
  const filtered = filters.topic !== 'all' || filters.level !== 'all' || filters.status !== 'all' || filters.query !== '';
  return (
    <section aria-label="Filtrer scenarioer" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <label className="min-w-0 text-xs font-medium text-slate-400">Fagområde
          <select className={inputStyle} value={filters.topic} onChange={event => onChange({ topic: event.target.value })}>
            <option value="all">Alle fagområder</option>
            {practiceTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.label} · {topic.scenarioIds.filter(id => solved.includes(id)).length}/{topic.scenarioIds.length} løst</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium text-slate-400">Vanskelighetsgrad
          <select className={inputStyle} value={filters.level} onChange={event => onChange({ level: event.target.value })}>
            <option value="all">Alle nivåer</option>
            {practiceLevels.map(level => <option key={level.id} value={level.id}>{level.label}</option>)}
          </select>
        </label>
        <label id="practice-status-filter" hidden={!showAdvanced} className="min-w-0 text-xs font-medium text-slate-400">Oppgavestatus
          <select className={inputStyle} value={filters.status} onChange={event => onChange({ status: event.target.value })}>
            <option value="all">Alle oppgaver</option><option value="unsolved">Uløste oppgaver</option><option value="solved">Løste · repeter</option>
          </select>
        </label>
        <label id="practice-search-filter" hidden={!showAdvanced} className="min-w-0 text-xs font-medium text-slate-400">Søk i scenarioer
          <span className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-500" aria-hidden="true" />
            <input type="search" value={filters.query} onChange={event => onChange({ query: event.target.value })} placeholder="Prøv «Dante» eller «vokal»" className={`${inputStyle} pl-9`} />
          </span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {desktop ? <p className="text-xs leading-relaxed text-slate-500">Velg ett tema, eller øv på tvers. Feil svar er en del av læringen.</p> :
          <button onClick={() => setExpanded(!expanded)} aria-expanded={showAdvanced} aria-controls="practice-status-filter practice-search-filter" className="flex min-h-11 items-center gap-2 text-xs text-slate-400"><SlidersHorizontal size={14} />{showAdvanced ? 'Færre filtre' : 'Flere filtre'}</button>}
        <div className="flex flex-wrap items-center gap-3">
          {filtered && <button onClick={onReset} className="min-h-11 text-xs text-slate-400 underline underline-offset-4 hover:text-white">Nullstill filtre</button>}
          <button onClick={onRandom} disabled={!canRandom} className="secondary-button"><Shuffle size={15} />Tilfeldig oppgave</button>
        </div>
      </div>
    </section>
  );
}
