import { VideoPlayer } from './VideoPlayer.jsx';
import { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';

export const VideoHighlight = ({ videoId, title }) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!videoId) return null;

  return (
    <div className="mt-6 border-t border-slate-700 pt-4 animate-fade-in">
      {!showVideo ? (
        <button
          onClick={() => setShowVideo(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 transition-all rounded-xl p-3 flex items-center gap-4 group text-left group"
        >
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/30">
            <Play size={18} className="text-white fill-current ml-1" />
          </div>
          <div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-0.5">Se Video</span>
            <span className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">{title || "Lær mer om dette"}</span>
          </div>
          <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-white" />
        </button>
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black animate-fade-in relative">
          <div className="relative">
            <VideoPlayer videoId={videoId} title={title} />
          </div>
          <button
            onClick={() => setShowVideo(false)}
            className="w-full py-2 bg-slate-900 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800"
          >
            Lukk Video
          </button>
        </div>
      )}
    </div>
  );
};
