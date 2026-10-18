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
