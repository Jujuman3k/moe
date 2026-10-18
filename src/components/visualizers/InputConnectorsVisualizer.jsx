import { ChevronRight } from 'lucide-react';

export const InputConnectorsVisualizer = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">

      {/* 1. XLR (Mer detaljert hunn-kontakt) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="relative">
          {/* Selve kontakten (Sølv ring) */}
          <div className="w-14 h-14 rounded-full bg-slate-800 border-4 border-slate-400 flex items-center justify-center relative shadow-inner">
            {/* Låse-knapp (Push) */}
            <div className="absolute -top-1 w-4 h-2 bg-slate-500 rounded-b"></div>
            {/* 3 Hull (Hunn-kontakt) */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
               <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
               <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
               <div className="w-2.5 h-2.5 bg-black rounded-full col-span-2 mx-auto shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"></div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">XLR</span>
          <span className="text-[9px] text-slate-400">Mikrofoner (Inn)</span>
        </div>
      </div>

      {/* 2. JACK (Med kabel-hale) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="flex items-center justify-center h-14 w-full relative">
           {/* Kabel hale (SVG for krøll) */}
           <svg width="40" height="20" viewBox="0 0 40 20" className="absolute right-[60%] top-1/2 -translate-y-1/2 text-slate-600 stroke-current fill-none" style={{zIndex: 0}}>
              <path d="M40,10 C30,10 30,18 20,18 C10,18 10,2 0,2" strokeWidth="3" strokeLinecap="round"/>
           </svg>

           {/* Selve Jack Pluggen */}
           <div className="flex items-center relative z-10 rotate-[-15deg]">
              {/* Kropp/Håndtak */}
              <div className="w-8 h-4 bg-slate-700 rounded-l border border-slate-600"></div>
              {/* Isolator */}
              <div className="w-1 h-3 bg-black"></div>
              {/* Sleeve */}
              <div className="w-4 h-2.5 bg-slate-300"></div>
              {/* Ring (Isolator) */}
              <div className="w-0.5 h-2.5 bg-black"></div>
              {/* Tupp */}
              <div className="w-3 h-2.5 bg-slate-300 rounded-r-full"></div>
           </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Jack (6.3mm)</span>
          <span className="text-[9px] text-slate-400">Instrumenter (Inn)</span>
        </div>
      </div>

      {/* 3. DI BOKS (Viser flyten) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="flex items-center gap-1 mt-2">
            {/* Jack ikon liten */}
            <div className="flex flex-col items-center">
               <div className="w-1 h-3 bg-slate-500 rounded-full mb-0.5"></div>
               <span className="text-[8px] text-slate-500">Jack</span>
            </div>
            {/* BOKSEN */}
            <div className="w-16 h-10 bg-yellow-600/20 border-2 border-yellow-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.2)]">
               <span className="text-xs font-bold text-yellow-500">DI</span>
            </div>
            {/* Pil */}
            <ChevronRight size={12} className="text-slate-500"/>
            {/* XLR ikon liten */}
            <div className="flex flex-col items-center">
               <div className="w-3 h-3 rounded-full border border-slate-500 bg-black"></div>
               <span className="text-[8px] text-slate-500">XLR</span>
            </div>
        </div>
        <span className="text-[9px] text-slate-400 mt-2">Konverterer Jack til XLR</span>
      </div>

      {/* 4. SPEAKON (Blå/Svart) */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[110px]">
        <div className="relative w-14 h-14 flex items-center justify-center">
           {/* Ytre ring (Blå) */}
           <div className="w-12 h-12 rounded-full bg-blue-900/50 border-4 border-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.3)]">
              {/* Indre lås (Svart) */}
              <div className="w-6 h-6 bg-black rounded-full relative">
                 {/* Keyway slot */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-slate-700"></div>
              </div>
           </div>
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Speakon</span>
          <span className="text-[9px] text-slate-400">Høyttaler (Ut)</span>
        </div>
      </div>

    </div>
  );
};
