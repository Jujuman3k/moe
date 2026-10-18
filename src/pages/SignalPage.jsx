import { Activity } from 'lucide-react';
import { SignalFlowDiagram } from '../components/signal/SignalFlowDiagram.jsx';

export default function SignalPage({ initialNodeId }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow"><Activity size={15} /> Fra kilde til publikum · Interaktiv lab</p><h1 className="page-title">Følg signalet. Finn sammenhengen.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">Én stemme kan ta flere veier. Utforsk kartet, dra i kontrollene og se hvem som får lyd.</p></div><span className="rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-300">Trygt å prøve · simulert</span></div>
      <SignalFlowDiagram initialNodeId={initialNodeId} />
    </div>
  );
}
