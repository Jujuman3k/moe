import { videoData } from '../data/videoData.js';

export const allVideos = Object.entries(videoData).flatMap(([categoryId, category]) =>
  category.videos.map(video => ({ ...video, categoryId, categoryName: category.title })),
);

export function filterVideos({ query = '', category = 'all', status = 'all', completed = [], favorites = [] }) {
  const terms = query.trim().toLocaleLowerCase('nb-NO').split(/\s+/).filter(Boolean);
  return allVideos.filter(video => {
    const searchable = `${video.title} ${video.desc} ${video.categoryName}`.toLocaleLowerCase('nb-NO');
    return (category === 'all' || video.categoryId === category)
      && terms.every(term => searchable.includes(term))
      && (status !== 'unseen' || !completed.includes(video.videoId))
      && (status !== 'completed' || completed.includes(video.videoId))
      && (status !== 'favorites' || favorites.includes(video.videoId));
  });
}

export function seriesFor(video) {
  return allVideos.filter(item => item.categoryId === video.categoryId);
}

// Resume an unfinished lesson. If it is marked watched, continue through that
// same series before recommending another series or inviting a replay.
export function videoRecommendation({ lastVideoId, completed }) {
  const last = allVideos.find(item => item.videoId === lastVideoId);
  if (last && !completed.includes(last.videoId)) return { video: last, label: 'Sist åpnet' };
  const series = seriesFor(last || allVideos[0]);
  const index = last ? series.indexOf(last) : -1;
  const next = [...series.slice(index + 1), ...series.slice(0, index + 1), ...allVideos]
    .find(item => !completed.includes(item.videoId));
  if (next) return { video: next, label: last || completed.length ? 'Neste usette leksjon' : 'Begynn her' };
  return { video: last || allVideos[0], label: 'Repetisjon' };
}
