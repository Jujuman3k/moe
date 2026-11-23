import assert from 'node:assert/strict';
import test from 'node:test';
import { audioSources } from '../src/data/audioSources.js';
import { listenCases, listenChanges, makeListenRound } from '../src/data/listenRounds.js';

test('a listening round always has three distinct playable sources, changes and unambiguous answer sets', () => {
  let seed = 1979;
  const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  let previous = [];
  const seen = new Set(); const answerPositions = new Set();
  for (let i = 0; i < 500; i++) {
    const round = makeListenRound(previous, random);
    assert.equal(round.length, 3);
    assert.equal(new Set(round.map(x => x.source)).size, 3);
    assert.equal(new Set(round.map(x => x.effect)).size, 3);
    assert.ok(round.some(x => !previous.some(y => y.id === x.id)));
    for (const item of round) {
      assert.ok(audioSources.some(source => source.id === item.source));
      assert.deepEqual(new Set(item.choices), new Set(Object.keys(listenChanges)));
      answerPositions.add(item.choices.indexOf(item.effect)); seen.add(item.id);
    }
    previous = round;
  }
  assert.equal(seen.size, listenCases.length); assert.equal(answerPositions.size, 4);
});
