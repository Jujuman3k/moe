import test from 'node:test';
import assert from 'node:assert/strict';
import { signalDepth } from '../src/data/signalDepth.js';
import { signalDepthCases } from '../src/data/signalDepthCases.js';
import { signalJourney } from '../src/data/signalJourney.js';
import { signalPanels } from '../src/data/signalPanels.js';
import { simulateSignal } from '../src/utils/signalSimulation.js';

const pair = id => {
  const { baseline, alternate } = signalDepth[id];
  return [simulateSignal(baseline), simulateSignal({ ...baseline, ...alternate })];
};

test('each stage compares two different results and every inspection point opens a real panel for that stage', () => {
  assert.deepEqual(Object.keys(signalDepth).sort(), signalJourney.map(node => node.id).sort());
  for (const [id, lesson] of Object.entries(signalDepth)) {
    const results = pair(id);
    const keys = lesson.points.map(point => point.key);
    assert.equal(new Set(keys).size, 3, id);
    for (const point of lesson.points) {
      assert.ok(signalPanels[id].some(([key]) => key === point.panel), id + '/' + point.panel);
      if (!['room', 'detector', 'performer'].includes(point.key)) {
        for (const result of results) assert.ok(result[point.key] === null || Number.isFinite(result[point.key]), id + '/' + point.key);
      }
    }
    assert.ok(keys.some(key => results[0][key] !== results[1][key]), id + ': example never changes a reading');
  }
});

test('study cases isolate gain, gate, fader, send, return and zone changes from the other routes', () => {
  const [gainLo, gainHi] = pair('preamp');
  assert.equal(gainLo.input, gainHi.input);
  assert.equal(gainLo.clipped, false);
  assert.equal(gainHi.clipped, true);
  assert.ok(gainHi.post < 0);
  const [gateLo, gateHi] = pair('processing');
  assert.equal(gateLo.preamp, gateHi.preamp);
  assert.equal(gateLo.gateClosed, false);
  assert.equal(gateHi.gateClosed, true);
  assert.equal(gateHi.processed, null);
  const [up, down] = pair('fader');
  assert.equal(up.post - down.post, 18);
  assert.equal(up.monitor, down.monitor);
  const [pre, post] = pair('monitor_branch');
  assert.equal(pre.post, post.post);
  assert.equal(pre.monitor - post.monitor, 18);
  const [wetOn, wetOff] = pair('fx_branch');
  assert.equal(wetOn.fx, wetOff.fx);
  assert.equal(wetOn.post, wetOff.post);
  assert.equal(wetOff.fxReturn, null);
  const [both, wetOnly] = pair('mixbus');
  assert.equal(both.fxReturn, wetOnly.fxReturn);
  assert.equal(wetOnly.main, null);
  assert.ok(wetOnly.mix !== null && Math.abs(wetOnly.mix - wetOnly.fxReturn) < 1e-6);
  const [zoneUp, zoneDown] = pair('matrix');
  assert.equal(zoneUp.mix, zoneDown.mix);
  assert.equal(zoneUp.pa - zoneDown.pa, 12);
  const [paOn, paOff] = pair('speakers');
  assert.equal(paOn.matrix, paOff.matrix);
  assert.equal(paOff.pa, null);
});

test('every stage has a diagnostic decision with a reason for both outcomes', () => {
  assert.deepEqual(Object.keys(signalDepthCases).sort(), Object.keys(signalDepth).sort());
  for (const [id, item] of Object.entries(signalDepthCases)) {
    assert.ok(item.options[item.correct], id + ': invalid solution');
    assert.equal(item.options.length, 2);
    assert.notEqual(item.options[0][0], item.options[1][0]);
    assert.ok(item.options.every(([, reason]) => reason.length > 20));
  }
});
