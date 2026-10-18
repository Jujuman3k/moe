import { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';

export const MultibandVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [bands, setBands] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBands([Math.random() * 30, Math.random() * 50, Math.random() * 40, Math.random() * 20]);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-bold text-cyan-300 mb-2">Hva gjør en MBC?</h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">En MBC er en kompressor delt opp i 3–4 frekvensområder. Du kan komprimere kun området som er problemet uten å påvirke resten.</p>
              <div className="bg-slate-900/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Når bruker du den?</h5>
                <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-4">
                  <li>Boomy vokal (nær mikk)</li>
                  <li>Resonanser som dukker opp av og til</li>
                  <li>Keys/Pads som bygger seg opp</li>
                  <li>Master Bus for å "lime" miksen</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default: return <div className="text-xs text-slate-400">Velg en fane for detaljer.</div>;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-cyan-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(34,211,238,0.1)]">
      <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm"><BarChart2 size={16}/> Multiband Compressor</h3>
      {/* Viz Animation */}
      <div className="flex gap-1 h-24 items-end justify-center px-2 mb-4 bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
        <div className="absolute top-2 left-2 text-[9px] text-slate-600 font-mono">GAIN REDUCTION</div>
        {['Low', 'Lo-Mid', 'Hi-Mid', 'High'].map((label, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative group">
            <div className="absolute top-8 w-full border-t border-slate-800 border-dashed"></div>
            <div className="w-full bg-cyan-500/30 border-b-2 border-cyan-400 transition-all duration-200 absolute top-0" style={{ height: `${bands[i]}%` }}></div>
            <span className="text-[9px] text-slate-500 mt-1 z-10 font-mono">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};
