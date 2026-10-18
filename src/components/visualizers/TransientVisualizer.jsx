import { useState } from 'react';
import { Activity, Music } from 'lucide-react';

export const TransientVisualizer = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const renderContent = () => {
    switch(activeTab) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-slate-200 mb-2">Hva gjør Transient Controller?</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Den lar deg justere to ting uavhengig av hverandre:
              </p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-slate-900 p-2 rounded text-center border-b-2 border-orange-500">
                  <div className="font-bold text-orange-400 text-xs">ATTACK</div>
                  <div className="text-[10px] text-slate-500">"Klikk" / "Snap"</div>
                </div>
                <div className="bg-slate-900 p-2 rounded text-center border-b-2 border-blue-500">
                  <div className="font-bold text-blue-400 text-xs">SUSTAIN</div>
                  <div className="text-[10px] text-slate-500">"Boom" / "Body"</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'parametere':
        return (
          <div className="space-y-3">
            <div className="bg-slate-800 p-2 rounded">
              <div className="flex justify-between mb-1"><span className="text-xs font-bold text-orange-400">Attack Gain</span></div>
              <p className="text-[10px] text-slate-400"><strong>+</strong> Mer punch/klikk. <strong>-</strong> Mykere anslag (dytt ting bak i miksen).</p>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="flex justify-between mb-1"><span className="text-xs font-bold text-blue-400">Sustain Gain</span></div>
              <p className="text-[10px] text-slate-400"><strong>+</strong> Mer kropp/hale. <strong>-</strong> Tørrere lyd (mindre romklang/lekkasje).</p>
            </div>
          </div>
        );
      case 'kick':
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2"><Music size={12}/> Kick Drum</h4>
            <p className="text-[10px] text-slate-400 mb-2">Mål: Mer punch i miksen uten "mud".</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-orange-400">Attack Gain</span><span className="text-slate-300 font-bold">+2 til +6 dB</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-blue-400">Sustain Gain</span><span className="text-slate-300 font-bold">-2 til -6 dB</span>
              </div>
            </div>
            <p className="text-[10px] text-green-400 italic mt-2">Resultat: Gir tydelig "thump" og renere bunn.</p>
          </div>
        );
      case 'snare':
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2"><Music size={12}/> Snare</h4>
            <p className="text-[10px] text-slate-400 mb-2">Mål: Mer "crack" og mindre rom/hale.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-orange-400">Attack Gain</span><span className="text-slate-300 font-bold">+2 til +5 dB</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800 pb-1">
                <span className="text-blue-400">Sustain Gain</span><span className="text-slate-300 font-bold">-2 til -6 dB</span>
              </div>
            </div>
            <p className="text-[10px] text-green-400 italic mt-2">Resultat: Tydelig snap i lovsangsmiks.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-orange-500/50 w-full animate-fade-in shadow-[0_0_15px_rgba(249,115,22,0.1)]">
      <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2 text-sm"><Activity size={16}/> Transient Controller</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {['Intro', 'Parametere', 'Kick', 'Snare'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-2 py-1 text-[10px] rounded font-bold border transition-all ${activeTab === tab.toLowerCase() ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{tab}</button>
        ))}
      </div>
      <div className="animate-fade-in min-h-[150px]">{renderContent()}</div>
    </div>
  );
};
