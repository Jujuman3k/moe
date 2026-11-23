import { AudioLines } from 'lucide-react';
import { SignalLab } from '../components/signal/SignalLab.jsx';
import { audioSources } from '../data/audioSources.js';
import { signalToolEntry } from '../data/signalToolLinks.js';
import { signalJourney } from '../data/signalJourney.js';
import '../styles/signal-studio.css';

export default function SignalPage({ initialNodeId, initialSourceId, initialMode, initialTool, onConsole }) {
  const source = audioSources.find(item => item.id === initialSourceId);
  const nodeId = signalJourney.find(item => item.id === initialNodeId)?.id;
  const tool = signalToolEntry(initialTool, initialNodeId);
  const mode = tool?.proPanel ? 'pro' : ['pro', 'easy'].includes(initialMode) ? initialMode : null;
  return <div className="animate-fade-in signal-studio-page">
    <header className="signal-studio-intro">
      <div><p className="eyebrow"><AudioLines size={16} /> Miksebord · dLive C3500</p><h1>Signalverkstedet</h1></div>
      <p>Velg et opptak og trykk <b>Spill</b>. I <b>Enkel</b> følger du lyden fra kilde til PA. I <b>Pro</b> former du lyden med EQ, gate og kompressor.</p>
    </header>
    <SignalLab onConsole={onConsole} initialTool={tool} initialNodeId={nodeId || tool?.node} initialSourceId={source?.id} initialMode={mode} />
  </div>;
}
