import { CheckCircle2, ChevronDown, List } from 'lucide-react';
import { practiceLevels } from '../../data/practiceCatalog.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useState } from 'react';

export function ScenarioBrowser({ scenarios, activeId, solved, onSelect }) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const [expanded, setExpanded] = useState(false);
  return (
    <aside aria-label="Scenarioarkiv" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50">
      {desktop ? <h2 className="flex items-center gap-2 border-b border-slate-800 px-4 py-4 text-sm font-semibold text-slate-200"><List size={16} />Scenarioarkivet</h2> :
        <button aria-expanded={expanded} aria-controls="scenario-list" onClick={() => setExpanded(!expanded)} className="flex min-h-12 w-full items-center justify-between gap-2 px-4 py-3 text-sm text-slate-300"><span className="flex items-center gap-2"><List size={16} />Bla i {scenarios.length} scenarioer</span><ChevronDown size={16} className={expanded ? 'rotate-180' : ''} /></button>}
      <div id="scenario-list" hidden={!desktop && !expanded}>
        <div className="custom-scrollbar max-h-72 overflow-y-auto p-2 lg:max-h-[600px]">
          <ul className="space-y-1">
            {scenarios.map(scenario => <li key={scenario.id}>
              <button aria-current={scenario.id === activeId ? 'true' : undefined} onClick={() => { onSelect(scenario.id); setExpanded(false); }}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${scenario.id === activeId ? 'border-blue-500/60 bg-blue-500/10' : 'border-transparent hover:bg-slate-800'}`}>
                <span className="mb-1 flex items-center justify-between gap-2 text-[10px] text-slate-500"><span>{scenario.tag} · {practiceLevels.find(level => level.id === scenario.level).label}</span>{solved.includes(scenario.id) && <CheckCircle2 size={14} className="shrink-0 text-teal-400" aria-label="Løst" />}</span>
                <span className={`block text-sm font-medium leading-snug ${scenario.id === activeId ? 'text-blue-200' : 'text-slate-300'}`}>{scenario.title}</span>
              </button>
            </li>)}
          </ul>
        </div>
      </div>
    </aside>
  );
}
