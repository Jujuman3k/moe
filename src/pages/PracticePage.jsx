import { useState } from 'react';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import { practiceScenarios } from '../data/practiceScenarios.js';
import { ScenarioCard } from '../components/learning/ScenarioCard.jsx';
import { RoutingLab } from '../components/learning/RoutingLab.jsx';
import { ProgressBar } from '../components/ui/ProgressBar.jsx';

export default function PracticePage({ learning, onExplore }) {
  const [activeId, setActiveId] = useState(practiceScenarios[0].id);
  const scenario = practiceScenarios.find(item => item.id === activeId);
  return (
    <div className="animate-fade-in space-y-7">
      <div><p className="eyebrow"><GraduationCap size={15} /> Fra teori til praksis</p><h1 className="page-title">En trygg plass å prøve.</h1><p className="mt-3 text-sm text-slate-400">Utforsk signalet, ta et valg og forstå hvorfor det virker.</p></div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Øvingsoppgaver">
            {practiceScenarios.map((item, index) => <button key={item.id} onClick={() => setActiveId(item.id)} aria-pressed={activeId === item.id}
              className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${activeId === item.id ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}>
              {learning.progress.solved.includes(item.id) ? <CheckCircle2 size={14} className="text-teal-400" /> : <span className="text-slate-500">0{index + 1}</span>}{item.tag}
            </button>)}
          </div>
          <ScenarioCard key={scenario.id} scenario={scenario} onSolve={learning.solveScenario} onExplore={onExplore} />
          <ProgressBar value={learning.progress.solved.length} max={practiceScenarios.length} label="Oppgaver løst" />
        </div>
        <RoutingLab />
      </div>
    </div>
  );
}
