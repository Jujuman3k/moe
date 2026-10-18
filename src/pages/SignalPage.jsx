import { Activity } from 'lucide-react';
import { SignalFlowDiagram } from '../components/signal/SignalFlowDiagram.jsx';

export default function SignalPage({ initialNodeId }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div><p className="eyebrow"><Activity size={15} /> Fra kilde til publikum</p><h1 className="page-title">Følg signalet.</h1><p className="mt-3 text-sm text-slate-400">Velg et ledd for å åpne forklaringer, videoer og interaktive verktøy.</p></div>
      <SignalFlowDiagram initialNodeId={initialNodeId} />
    </div>
  );
}
