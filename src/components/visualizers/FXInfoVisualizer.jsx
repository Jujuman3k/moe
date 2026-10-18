import { Check, Sparkles } from 'lucide-react';

export const FXInfoVisualizer = ({ deepDive }) => {
    return (
        <div className="space-y-3 animate-fade-in">
            <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2"><Sparkles size={16}/> FX Detaljer</h4>
            {deepDive && deepDive.map((item, i) => (
                <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-200 text-sm">{item.name}</span>
                        <span className="text-[10px] bg-purple-900/30 text-purple-200 px-2 py-0.5 rounded border border-purple-500/20">{item.tag}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.info}</p>
                    {item.usage && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[10px] text-green-400 italic">
                            <Check size={10}/> Anbefalt bruk: {item.usage}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
