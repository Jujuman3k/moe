

export const MatrixVisualizer = () => {
  return (
    <div className="space-y-4 animate-fade-in">
       <div className="relative h-40 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-4 flex items-center justify-between">
          {/* SOURCE */}
          <div className="flex flex-col items-center z-10">
             <div className="w-16 h-10 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white shadow-lg">Main LR</div>
             <div className="h-full w-0.5 bg-blue-600/30 absolute top-14 bottom-4 left-12"></div>
          </div>

          {/* SPLIT LINES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <path d="M80,60 C150,60 150,30 220,30" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4,4"/>
             <path d="M80,60 C150,60 150,60 220,60" fill="none" stroke="#3b82f6" strokeWidth="3"/>
             <path d="M80,60 C150,60 150,90 220,90" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4,4"/>
          </svg>

          {/* DESTINATIONS */}
          <div className="flex flex-col gap-4 z-10 w-32">
             <div className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center">
                <span className="text-[10px] text-slate-300">Foajé</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-green-500"></div></div>
             </div>
             <div className="bg-slate-800 p-2 rounded border border-blue-500/50 shadow-lg flex justify-between items-center scale-110">
                <span className="text-[10px] text-white font-bold">Main PA</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-blue-500"></div></div>
             </div>
             <div className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center">
                <span className="text-[10px] text-slate-300">Ammerom</span>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden"><div className="w-[40%] h-full bg-green-500"></div></div>
             </div>
          </div>
       </div>

       <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
          <h4 className="text-xs font-bold text-blue-300 mb-1">Hvorfor Matrix?</h4>
          <p className="text-xs text-slate-300">
             Matrix lar deg sende <strong>samme miks</strong> (Main LR) til flere rom, men med <strong>forskjellig volum</strong> og EQ.
             <br/><br/>
             Eks: Hvis noen klager på at det er for høyt i foajeen, skrur du bare ned "Foyer Matrix", uten å ødelegge lyden i hovedsalen!
          </p>
       </div>
    </div>
  );
};
