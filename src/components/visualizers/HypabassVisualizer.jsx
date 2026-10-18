import { useState } from 'react';
import { Activity, Check, X } from 'lucide-react';

export const HypabassVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-pink-500/30">
              <h4 className="text-sm font-bold text-pink-300 mb-2">Hva er Hypabass?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">En <strong>subharmonic generator</strong> som lager ny bass-informasjon én oktav under originalen.</p>
              <div className="bg-slate-900 p-2 rounded text-center italic text-[10px] text-slate-400 border-l-2 border-pink-500">"Tenk: Mer sub, uten å måtte booste EQ."</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-green-400 uppercase mb-1 flex items-center gap-1"><Check size={10}/> Bruk på</h5>
                <ul className="text-[10px] text-slate-400 list-disc pl-3"><li>Kick</li><li>Bass-gitar</li></ul>
              </div>
              <div className="bg-slate-800/50 p-2 rounded">
                <h5 className="text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center gap-1"><X size={10}/> Unngå på</h5>
                <ul className="text-[10px] text-slate-400 list-disc pl-3"><li>Vokal (!)</li><li>Toms / Snare</li></ul>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-pink-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(236,72,153,0.1)]">
      <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2 text-sm"><Activity size={16}/> Hypabass</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-pink-600 text-white border-pink-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};
