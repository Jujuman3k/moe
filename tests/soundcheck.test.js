import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptySoundcheck, readSoundcheck, soundcheckResult, soundcheckSteps as steps, updateSoundcheck, writeSoundcheck } from '../src/data/practice/soundcheck.js';

const right = i => steps[i].scenario.options.findIndex(option => option.correct);
const wrong = i => steps[i].scenario.options.findIndex(option => !option.correct);
const answer = index => ({ type: 'answer', index });

test('a soundcheck round only advances on a correct diagnosis and recommends hands-on practice for the first retry', () => {
  let round = emptySoundcheck();
  for (let i = 0; i < steps.length; i++) {
    assert.equal(updateSoundcheck(round, { type: 'next' }), round);
    if (i === 1) {
      round = updateSoundcheck(round, answer(wrong(i)));
      assert.equal(updateSoundcheck(round, { type: 'next' }), round);
    }
    round = updateSoundcheck(round, answer(right(i)));
    assert.equal(updateSoundcheck(round, answer(wrong(i))), round);
    round = updateSoundcheck(round, { type: 'next' });
  }
  assert.equal(round.step, steps.length);
  assert.deepEqual(soundcheckResult(round), { firstTry: [true, false, true, true], total: 3, recommended: 1 });
  assert.equal(steps[soundcheckResult(round).recommended].node, 'preamp');
  assert.deepEqual(readSoundcheck(writeSoundcheck(round)), round);
});

test('restores unfinished feedback and hints; rejects stale IDs, impossible scores, and damaged storage', () => {
  const paused = updateSoundcheck(updateSoundcheck(emptySoundcheck(), { type: 'hint' }), answer(wrong(0)));
  const raw = writeSoundcheck(paused);
  assert.deepEqual(readSoundcheck(raw), paused);
  assert.equal(readSoundcheck(null), null);
  assert.equal(readSoundcheck('broken'), null);
  for (const mutate of [s => { s.step = 1; }, s => { s.answers[0].id = 'removed'; }, s => { s.answers[1].last = 0; }, s => { s.answers[0].first = 5; }]) {
    const saved = JSON.parse(raw); mutate(saved);
    assert.equal(readSoundcheck(JSON.stringify(saved)), null);
  }
});
