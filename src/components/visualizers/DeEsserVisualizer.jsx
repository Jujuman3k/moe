import { Zap } from 'lucide-react';

export const DeEsserVisualizer = () => {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/50 animate-fade-in">
      <h3 className="text-blue-400 font-bold text-sm mb-4 flex items-center gap-2"><Zap size={16}/> De-Esser</h3>
      <div className="relative w-full h-32 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-4">
        <svg className="w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
          <path d="M0,80 Q50,70 100,80 T200,60 T300,80" fill="none" stroke="#334155" strokeWidth="2" opacity="0.5"/>
          <rect x="200" y="20" width="60" height="100" fill="rgba(59, 130, 246, 0.1)" />
          <line x1="230" y1="20" x2="230" y2="120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2"/>
          <text x="215" y="15" fill="#3b82f6" fontSize="10" fontWeight="bold">5k - 8kHz</text>
        </svg>
      </div>
      <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
        <h4 className="font-bold text-xs text-slate-300 mb-1">Innstillinger</h4>
        <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
          <li><strong>Mann:</strong> Start søket rundt 5-6 kHz.</li>
          <li><strong>Dame:</strong> Start søket rundt 7-9 kHz.</li>
          <li><strong>Tips:</strong> Ikke overdriv. Vi vil fjerne "skjæring", ikke gjøre sangeren lespende.</li>
        </ul>
      </div>
    </div>
  );
};
