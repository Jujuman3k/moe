import { allVideos } from './videoLibrary.js';
import { practiceScenarioIds } from '../data/practiceCatalog.js';

export const PROGRESS_KEY = 'lydteam.learning.v1';
const videoIds = new Set(allVideos.map(video => video.videoId));
const scenarioIds = new Set(practiceScenarioIds);
const validIds = (values, allowed) => Array.isArray(values)
  ? [...new Set(values.filter(value => allowed.has(value)))] : [];

export function normalizeProgress(value) {
  return {
    completed: validIds(value?.completed, videoIds),
    favorites: validIds(value?.favorites, videoIds),
    solved: validIds(value?.solved, scenarioIds),
    lastVideoId: videoIds.has(value?.lastVideoId) ? value.lastVideoId : null,
  };
}

export function parseProgress(raw) {
  try { return normalizeProgress(JSON.parse(raw)); }
  catch { return normalizeProgress(null); }
}

export function toggleId(values, id) {
  return values.includes(id) ? values.filter(value => value !== id) : [...values, id];
}
