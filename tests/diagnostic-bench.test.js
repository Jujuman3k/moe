import assert from 'node:assert/strict';
import test from 'node:test';
import { diagnosticCases } from '../src/data/practice/diagnosticCases.js';
import { diagnosticIndex } from '../src/data/practice/diagnosticIndex.js';
import { freshDiagnostic, restoreDiagnostic, updateDiagnostic } from '../src/data/practice/diagnosticSession.js';
import { audioSources } from '../src/data/audioSources.js';
import { signalToolEntry } from '../src/data/signalToolLinks.js';
import { signalPanels } from '../src/data/signalPanels.js';

test('each indexed fault has two independent diagnostic paths, a corrective action and a working mixer target', () => {
  assert.equal(new Set(diagnosticIndex.map(p=>p.id)).size, 6);
  for (const item of diagnosticCases) {
    assert.ok(audioSources.find(s=>s.id === item.source));
    assert.ok(signalPanels[item.mixer.node]);
    if (item.mixer.tool) assert.ok(signalToolEntry(item.mixer.tool, item.mixer.node));
    assert.ok(item.verify && item.cause && item.report);
    assert.equal(item.options.filter(o=>!o.outcome).length, 1);
    assert.ok(item.options.find(o=>o.id === item.correct && !o.outcome));
    assert.equal(new Set(item.probes.map(p=>p.id)).size, 4);
    const roots = item.probes.filter(p=>!p.after);
    assert.equal(roots.length, 2);
    for (const start of roots) {
      const follow = item.probes.find(p=>p.after === start.id && p.proof);
      const step = (state, type, id) => updateDiagnostic(item, state, {type,id});
      let s = freshDiagnostic();
      assert.deepEqual(step(s,'inspect',follow.id), s);
      assert.deepEqual(step(s,'apply',item.correct), s);
      s = step(s,'inspect',start.id);
      assert.equal(step(s,'apply', item.correct).solved, false);
      s = step(s,'inspect',follow.id);
      assert.equal(step(s,'apply',item.options.find(o=>o.outcome).id).solved, false);
      s = step(s,'apply',item.correct);
      assert.equal(s.solved,true);
      assert.deepEqual(restoreDiagnostic(item,JSON.stringify(s)),s);
      assert.deepEqual(step(s,'reset'),freshDiagnostic());
    }
  }
});

test('saved work cannot bypass the evidence chain or become solved by viewing a later clue', () => {
  const item = diagnosticCases[0], first = item.probes.find(p=>!p.after), next = item.probes.find(p=>p.after===first.id);
  assert.deepEqual(restoreDiagnostic(item, '{'), freshDiagnostic());
  const forged = {seen:[next.id], attempt:item.correct, solved:true};
  assert.deepEqual(restoreDiagnostic(item,JSON.stringify(forged)),freshDiagnostic());
  let s = updateDiagnostic(item,freshDiagnostic(),{type:'inspect',id:first.id});
  s = updateDiagnostic(item,s,{type:'apply',id:item.correct});
  assert.equal(restoreDiagnostic(item,JSON.stringify(s)).solved,false);
  s = updateDiagnostic(item,s,{type:'inspect',id:next.id});
  const restored = restoreDiagnostic(item,JSON.stringify(s));
  assert.equal(restored.solved,false); assert.equal(restored.attempt,null);
});
