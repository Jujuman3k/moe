import { Speaker } from 'lucide-react';

export const PAVisualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
       <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulsing Circles */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="absolute inset-4 bg-blue-500/40 rounded-full animate-pulse"></div>

          {/* Speaker Icon */}
          <div className="relative z-10 bg-slate-900 p-4 rounded-full border-4 border-slate-800 shadow-2xl">
             <Speaker size={48} className="text-blue-400"/>
          </div>
       </div>
       <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-white">Lyd i rommet!</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
             Signalet har nå reist hele veien fra mikrofonen, gjennom mikseren, via matrix, og ut av høyttalerne.
          </p>
       </div>
    </div>
  );
};
