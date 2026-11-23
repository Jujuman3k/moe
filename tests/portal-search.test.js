import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPortal } from '../src/utils/portalSearch.js';
test('portal search ranks exact titles first, supports Norwegian spelling, and combines terms', () => {
  assert.equal(searchPortal('  miks KICK  ')[0].params.source,'kick');
  assert.deepEqual(searchPortal('høyttalere'), searchPortal('hoyttalere'));
  assert.ok(searchPortal('høyttalere','Signalvei').some(row=>row.params.node==='speakers'));
  assert.deepEqual(searchPortal('umuligtreff123'),[]);
  assert.ok(searchPortal('dante patching', 'Video').length >= 1);
});
test('portal result links map to individual content and search suggestions span learning formats', () => {
  const scenarios = searchPortal('', 'Oppgave');
  assert.equal(new Set(scenarios.map(row=>row.params.scenario)).size,72);
  assert.equal(searchPortal('', 'Video').length,92);
  assert.equal(searchPortal('monitor','Oppgave').some(row=>row.params.scenario==='monitor-pre-fade'),true);
  assert.deepEqual(new Set(searchPortal('').map(row=>row.kind)),new Set(['Verktøy','Video','Oppgave','Signalvei']));
});
