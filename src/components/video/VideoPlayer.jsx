export function VideoPlayer({ videoId, title = 'Instruksjonsvideo', muted = true }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <iframe key={videoId} className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&playsinline=1&rel=0`}
        title={title} referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen />
    </div>
  );
}
