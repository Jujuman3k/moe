import { createElement, useState } from 'react';
import { GitMerge, Layers, Mic2, Music, Scissors, Sliders, Sparkles } from 'lucide-react';

const MiniSpeaker = ({ label, view }) => (
    <div className="relative flex flex-col items-center z-10">
       <div className={`w-16 h-24 bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center gap-2 ${view === 'overview' || view === 'group' ? 'border-red-500/50 shadow-red-500/20' : ''}`}>
          <div className="w-4 h-4 bg-slate-900 rounded-full border border-slate-600"></div>
          <div className="relative w-12 h-12 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-center overflow-visible">
             <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-lg relative z-10"></div>
             {/* Puls effekt når lyden er på */}
             {(view === 'overview' || view === 'group') && (
                <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping"></div>
             )}
          </div>
       </div>
       <div className="w-16 h-1 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-800">
          <div className={`h-full bg-red-500 transition-all duration-300 ${view === 'overview' || view === 'group' ? 'w-3/4' : 'w-0'}`}></div>
       </div>
       <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{label}</span>
    </div>
  );

const ConnectionLine = ({ view, active, type, startX, endX, startY, endY, color }) => {
    if (!active && view !== 'overview') return null;
    const isDCA = type === 'control';
    const opacity = active ? 1 : 0.1;
    const strokeWidth = active ? 3 : 1;
    const dash = isDCA ? "5,5" : "none";
    // Bezier kurve
    const x1 = parseFloat(startX);
    const x2 = parseFloat(endX);
    const y1 = Number(startY);
    const y2 = Number(endY);
    const path = `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;

    return (
      <path vectorEffect="non-scaling-stroke" d={path} stroke={color} strokeWidth={strokeWidth} strokeDasharray={dash} fill="none" opacity={opacity} className={active ? (isDCA ? "animate-pulse" : "animate-signal-pulse") : ""} />
    );
  };

const ChannelIcon = ({ label, icon, color, dimmed }) => (
    <div className={`flex flex-col items-center z-10 transition-all duration-300 ${dimmed ? 'opacity-20 grayscale' : 'opacity-100'}`}>
      <div className="w-10 h-10 rounded-lg border-2 bg-slate-900 flex items-center justify-center shadow-lg" style={{ borderColor: color }}>
        {createElement(icon, { size: 20, style: { color } })}
      </div>
      <span className="text-[9px] font-bold mt-1 text-slate-300">{label}</span>
    </div>
  );

export const MixBusVisualizer = () => {
  const [view, setView] = useState('overview'); // overview, dca, group, mute

  // Farger
  const colorVox = "#e879f9"; // Pink
  const colorBand = "#38bdf8"; // Blue
  const colorFX = "#a855f7";   // Purple
  const colorDCA = "#facc15";  // Yellow
  const colorGrp = "#4ade80";  // Green

  // Hjelper for animert høyttaler (Mini-versjon av den store)






  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-red-500/50 animate-fade-in">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h3 className="text-red-400 font-bold text-sm flex items-center gap-2"><GitMerge size={16}/> Mix Bus & Routing</h3>
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
           <button onClick={() => setView('overview')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'overview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}>Oversikt</button>
           <button onClick={() => setView('group')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'group' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-green-400'}`}>Audio Group</button>
           <button onClick={() => setView('dca')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'dca' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:text-yellow-400'}`}>DCA</button>
           <button onClick={() => setView('mute')} className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${view === 'mute' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-red-400'}`}>Mute</button>
        </div>
      </div>

      <div className="relative w-full h-96 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mb-4">
        {/* SVG LAYER */}
        <svg viewBox="0 0 100 384" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
           {/* 1. INPUTS TO GROUPS (Audio) */}
           <ConnectionLine view={view} active={view === 'group' || view === 'overview'} type="audio" startX="15%" startY="60" endX="20%" endY="160" color={colorVox} />
           <ConnectionLine view={view} active={view === 'group' || view === 'overview'} type="audio" startX="30%" startY="60" endX="20%" endY="160" color={colorVox} />

           {/* Band -> Main (Direkte linjer til L og R) */}
           <ConnectionLine view={view} active={view === 'overview'} type="audio" startX="45%" startY="60" endX="40%" endY="280" color={colorBand} /> {/* Gtr -> L */}
           <ConnectionLine view={view} active={view === 'overview'} type="audio" startX="60%" startY="60" endX="60%" endY="280" color={colorBand} /> {/* Bass -> R/L */}
           <ConnectionLine view={view} active={view === 'overview'} type="audio" startX="75%" startY="60" endX="40%" endY="280" color={colorBand} /> {/* Drum -> L */}

           {/* FX -> Main */}
           <ConnectionLine view={view} active={view === 'overview'} type="audio" startX="90%" startY="60" endX="60%" endY="280" color={colorFX} />

           {/* 2. VOX GROUP TO MAIN */}
           <ConnectionLine view={view} active={view === 'group' || view === 'overview'} type="audio" startX="20%" startY="220" endX="40%" endY="280" color={colorGrp} />
           <ConnectionLine view={view} active={view === 'group' || view === 'overview'} type="audio" startX="20%" startY="220" endX="60%" endY="280" color={colorGrp} />

           {/* 3. DCA CONTROL */}
           <ConnectionLine view={view} active={view === 'dca'} type="control" startX="75%" startY="160" endX="45%" endY="60" color={colorDCA} />
           <ConnectionLine view={view} active={view === 'dca'} type="control" startX="75%" startY="160" endX="60%" endY="60" color={colorDCA} />
           <ConnectionLine view={view} active={view === 'dca'} type="control" startX="75%" startY="160" endX="75%" endY="60" color={colorDCA} />

           {/* 4. MUTE GROUP */}
           <ConnectionLine view={view} active={view === 'mute'} type="control" startX="50%" startY="160" endX="15%" endY="60" color="red" />
           <ConnectionLine view={view} active={view === 'mute'} type="control" startX="50%" startY="160" endX="30%" endY="60" color="red" />
           <ConnectionLine view={view} active={view === 'mute'} type="control" startX="50%" startY="160" endX="45%" endY="60" color="red" />
           <ConnectionLine view={view} active={view === 'mute'} type="control" startX="50%" startY="160" endX="60%" endY="60" color="red" />
           <ConnectionLine view={view} active={view === 'mute'} type="control" startX="50%" startY="160" endX="75%" endY="60" color="red" />
        </svg>

        {/* LEVEL 1: INPUTS */}
        <div className="absolute top-4 w-full flex justify-around px-4">
           <ChannelIcon label="Vox 1" icon={Mic2} color={colorVox} dimmed={view === 'dca'} />
           <ChannelIcon label="Vox 2" icon={Mic2} color={colorVox} dimmed={view === 'dca'} />
           <ChannelIcon label="Gitar" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="Bass" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="Trommer" icon={Music} color={colorBand} dimmed={view === 'group'} />
           <ChannelIcon label="FX Retur" icon={Sparkles} color={colorFX} dimmed={view === 'group' || view === 'dca'} />
        </div>

        {/* LEVEL 2: BUSSES / DCA / MUTE */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-around px-8">

           {/* VOX GROUP */}
           <div className={`relative flex flex-col items-center p-2 rounded-xl border-2 bg-slate-900 z-10 transition-all ${view === 'group' ? 'scale-110 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'border-slate-700 opacity-50'}`}>
              <Layers size={20} className="text-green-500 mb-1" />
              <span className="text-[9px] font-bold text-white">VOX GRP</span>
              {view === 'group' && <div className="absolute -right-12 top-0 bg-slate-800 text-[8px] p-1 rounded border border-slate-600 w-10 text-center">Glue Comp</div>}
           </div>

           {/* MUTE GROUP */}
           <div className={`flex flex-col items-center p-2 rounded-xl border-2 border-dashed bg-slate-900 z-10 transition-all ${view === 'mute' ? 'scale-110 border-red-500 bg-red-900/20' : 'border-slate-700 opacity-30'}`}>
              <Scissors size={20} className="text-red-500 mb-1" />
              <span className="text-[9px] font-bold text-white">MUTE BAND</span>
           </div>

           {/* BAND DCA */}
           <div className={`relative flex flex-col items-center p-2 rounded-xl border-2 border-dashed bg-slate-900 z-10 transition-all ${view === 'dca' ? 'scale-110 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-slate-700 opacity-50'}`}>
              <Sliders size={20} className="text-yellow-500 mb-1" />
              <span className="text-[9px] font-bold text-white">BAND DCA</span>
              {view === 'dca' && <div className="absolute -top-8 w-20 bg-yellow-900/80 text-yellow-200 text-[8px] p-1 rounded text-center">Fjernkontroll</div>}
           </div>
        </div>

        {/* LEVEL 3: MAIN LR SPEAKERS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-16 px-12">
           <MiniSpeaker view={view} label="MAIN L" />
           <MiniSpeaker view={view} label="MAIN R" />
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-slate-800/50 p-3 rounded border border-slate-700 min-h-[80px] flex items-center gap-3">
         <div className="bg-slate-900 p-2 rounded-full">
            {view === 'group' && <Layers className="text-green-400" size={20}/>}
            {view === 'dca' && <Sliders className="text-yellow-400" size={20}/>}
            {view === 'mute' && <Scissors className="text-red-400" size={20}/>}
            {view === 'overview' && <GitMerge className="text-blue-400" size={20}/>}
         </div>
         <div className="text-xs text-slate-300 leading-relaxed">
            {view === 'overview' && "Oversikt: Instrumenter og Vokaler rutes enten via Grupper eller direkte til Main LR. DCA styrer nivåer uten å røre lyden."}
            {view === 'group' && "Audio Group: Samler lyd. Brukes ofte til å 'lime' sammen Trommer (Drum Bus) eller Vokal. Her kan du bruke kompressor på hele pakka!"}
            {view === 'dca' && "DCA: En fjernkontroll. Ingen lyd går gjennom her! Når du drar i DCA-en, justeres kanalnivået, ikke preamp-gain. Faderne beveger seg ikke fysisk."}
            {view === 'mute' && "Mute Group: Panikk-knapp. Kutter lyden på mange kanaler samtidig (f.eks. hele bandet når pastoren snakker)."}
         </div>
      </div>
    </div>
  );
};
