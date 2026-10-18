import assert from 'node:assert/strict';
import { test } from 'node:test';
import { videoData } from '../src/data/videoData.js';
import { signalPathData } from '../src/data/signalPathData.js';
import { practiceScenarios } from '../src/data/practiceScenarios.js';
import { allVideos, filterVideos } from '../src/utils/videoLibrary.js';
import { normalizeProgress, parseProgress, toggleId } from '../src/utils/learningProgress.js';
import { routingLevels } from '../src/utils/routing.js';
import { toFreq, toPercent } from '../src/utils/frequency.js';

test('all original video categories and signal modules are retained', () => {
  assert.equal(Object.keys(videoData).length, 8);
  assert.equal(allVideos.length, 92);
  assert.equal(new Set(allVideos.map(video => video.id)).size, 92);
  assert.equal(new Set(allVideos.map(video => video.videoId)).size, 92);
  assert.equal(signalPathData.length, 9);
  assert.deepEqual(signalPathData.find(node => node.id === 'processing').subChain.map(step => step.viz), ['hpf', 'gate', 'inserts', 'peq', 'comp']);
});

test('search trims whitespace, ignores case and matches multiple terms across fields', () => {
  assert.equal(filterVideos({ query: '  ' }).length, 92);
  const results = filterVideos({ query: '  dAnTe   PATCHING ' });
  assert.ok(results.length > 0);
  assert.ok(results.some(video => video.videoId === 'o6NFlr42Omg'));
  assert.equal(filterVideos({ query: 'no-match-123' }).length, 0);
});

test('category and progress filters compose without changing video order', () => {
  const id = videoData.dlive_course.videos[0].videoId;
  const options = { category: 'dlive_course', completed: [id], favorites: [id] };
  assert.equal(filterVideos({ ...options, status: 'unseen' }).length, 23);
  assert.equal(filterVideos({ ...options, status: 'completed' })[0].videoId, id);
  assert.equal(filterVideos({ ...options, status: 'favorites' }).length, 1);
  assert.equal(filterVideos({ ...options, category: 'mixing', status: 'favorites' }).length, 0);
  assert.deepEqual(filterVideos({ category: 'dlive_course' }).map(video => video.id), videoData.dlive_course.videos.map(video => video.id));
});

test('malformed or outdated stored progress recovers safely', () => {
  const empty = normalizeProgress(null);
  for (const raw of [null, '', 'not-json', 'null', '[]', '42', '{"completed":"wrong"}']) assert.deepEqual(parseProgress(raw), empty);
  const id = allVideos[0].videoId;
  const scenarioId = practiceScenarios[0].id;
  assert.deepEqual(normalizeProgress({ completed: [id, id, 'deleted'], favorites: {}, solved: [scenarioId, 'invalid'], lastVideoId: 'unknown' }), {
    completed: [id], favorites: [], solved: [scenarioId], lastVideoId: null,
  });
});

test('completion and favorite toggles are reversible without mutating state', () => {
  const original = ['first'];
  assert.deepEqual(toggleId(original, 'second'), ['first', 'second']);
  assert.deepEqual(toggleId(original, 'first'), []);
  assert.deepEqual(original, ['first']);
});

test('each exercise has one correct answer and a valid exploration target', () => {
  for (const scenario of practiceScenarios) {
    assert.equal(scenario.options.filter(option => option.correct).length, 1);
    assert.ok(scenario.options.every(option => option.feedback));
    assert.ok(signalPathData.some(node => node.id === scenario.nodeId));
    assert.ok(scenario.source.startsWith('https://support.allen-heath.com/'));
  }
});

test('pre-fade stays constant and post-fade follows fader changes in both directions', () => {
  for (const db of [-30, -12, 0, 6]) {
    assert.deepEqual(routingLevels(db, true), { main: db, monitor: 0 });
    assert.deepEqual(routingLevels(db, false), { main: db, monitor: db });
  }
});

test('extracted frequency conversion keeps endpoints and logarithmic midpoint', () => {
  assert.equal(toFreq(0), 20);
  assert.equal(toFreq(100), 20000);
  assert.equal(toPercent(20), 0);
  assert.equal(toPercent(20000), 100);
  assert.ok(Math.abs(toFreq(50) - Math.sqrt(20 * 20000)) < 1);
});
