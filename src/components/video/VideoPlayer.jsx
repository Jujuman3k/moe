import { ExternalLink } from 'lucide-react';

// Only a direct click on Play/Next requests playback. A bookmarked course URL
// displays the native controls and waits for the viewer to press Play.
export function VideoPlayer({ videoId, title = 'Instruksjonsvideo', autoPlay = false, muted = false }) {
  const id = encodeURIComponent(videoId);
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&rel=0`;
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe key={videoId} className="absolute inset-0 h-full w-full"
          src={src} title={title} referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 px-1 py-1">
        <span className="text-xs text-slate-400">Spiller fra YouTube</span>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-300 hover:underline">Åpne på YouTube <ExternalLink aria-hidden="true" size={14}/><span className="sr-only">i ny fane</span></a>
      </div>
    </div>
  );
}
