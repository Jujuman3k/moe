import { Activity } from 'lucide-react';
import { SignalFlowDiagram } from '../components/signal/SignalFlowDiagram.jsx';

export default function SignalPage({ initialNodeId }) {
  return <div className="animate-fade-in space-y-4">
    <div><p className="eyebrow"><Activity size={15} /> Signalverkstedet</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">Se det. Skru på det. Forstå det.</h1><p className="mt-2 text-xs text-slate-400 md:text-sm">Velg et ledd. Kart, bølger og målere følger justeringene dine.</p></div>
    <SignalFlowDiagram initialNodeId={initialNodeId} />
  </div>;
}
