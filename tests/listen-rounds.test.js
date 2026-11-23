import assert from 'node:assert/strict';
import test from 'node:test';
import { audioSources } from '../src/data/audioSources.js';
import { listenCases, listenChanges, listenTracks, makeListenRound } from '../src/data/listenRounds.js';

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
      assert.equal(item.choices.length,4);
      assert.equal(new Set(item.choices).size,4);
      assert.ok(item.choices.includes(item.effect));
      assert.ok(item.choices.every(choice=>Object.hasOwn(listenChanges,choice)));
      answerPositions.add(item.choices.indexOf(item.effect)); seen.add(item.id);
    }
    previous = round;
  }
  assert.equal(seen.size, listenCases.length); assert.equal(answerPositions.size, 4);
});

test('focused rounds use only their subject, cover each technique, rotate sources and use the corresponding Pro tool', () => {
  let seed=378;const random=()=>(seed=seed*16807%2147483647)/2147483647;
  for(const [trackId,{effects}] of Object.entries(listenTracks).filter(([key])=>key!=='mixed')){
    let previous=[];const seen=new Set();
    for(let i=0;i<120;i++){
      const round=makeListenRound(previous,random,trackId);
      assert.equal(round.length,3);assert.equal(new Set(round.map(it=>it.source)).size,3);
      assert.deepEqual(new Set(round.map(it=>it.effect)),new Set(effects));
      for(const it of round){
        seen.add(it.id);assert.deepEqual(new Set(it.choices), new Set(effects));
        assert.ok(['hpf','lpf','peq','comp','gate','delay','reverb'].includes(listenChanges[it.effect].tool));
      }
      previous=round;
    }
    assert.equal(seen.size,listenCases.filter(c=>effects.includes(c.effect)).length);
  }
});
