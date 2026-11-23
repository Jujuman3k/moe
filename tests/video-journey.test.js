import assert from 'node:assert/strict';
import test from 'node:test';
import { allVideos, seriesFor, videoRecommendation } from '../src/utils/videoLibrary.js';
import { videoExperiment } from '../src/data/videoExperiments.js';
import { signalJourney } from '../src/data/signalJourney.js';
import { audioSources } from '../src/data/audioSources.js';

test('video recommendation resumes an unfinished lesson and fills earlier gaps before leaving the series', () => {
  const series = allVideos.filter(video => video.categoryId === 'dyn8_masterclass');
  const recommend = completed => videoRecommendation({lastVideoId: series.at(-1).videoId, completed}).video;
  assert.equal(recommend([]), series.at(-1));
  assert.equal(recommend([series[0].videoId, series.at(-1).videoId]), series[1]);
  assert.notEqual(recommend(series.map(video => video.videoId)).categoryId, 'dyn8_masterclass');
  assert.equal(recommend(allVideos.map(video => video.videoId)), series.at(-1));
  assert.deepEqual(seriesFor(series[2]), series);
});

test('video experiments can open a real recording at the correct signal stage', () => {
  const available = allVideos.map(video => videoExperiment(video.id)).filter(Boolean);
  assert.ok(available.length > 8);
  for (const group of new Set(available)) {
    assert.ok(group.ids.every(id => allVideos.some(video => video.id === id)));
    assert.ok(signalJourney.some(node => node.id === group.node));
    assert.ok(audioSources.some(source => source.id === group.source));
  }
});
