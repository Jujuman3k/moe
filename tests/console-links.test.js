import test from 'node:test';
import assert from 'node:assert/strict';
import {consoleChannel, consolePanel, findConsoleReturn} from '../src/utils/consoleLinks.js';
import {searchPortal} from '../src/utils/portalSearch.js';

test('a return from the signal chain follows the same input even when the source is patched twice', () => {
  const c=[{id:4,sourceId:'male'},{id:11,sourceId:'female'},{id:23,sourceId:'male'}];
  assert.equal(findConsoleReturn(4,'male','23',c,'4'),23);
  assert.equal(findConsoleReturn(5,'female','23',c,'23'),11);
  assert.equal(findConsoleReturn(4,'male',null,c,'23'),23);
  assert.equal(findConsoleReturn(2,null,'8',c),8);
  assert.equal(findConsoleReturn(3,'snare',null,{}),3);
});

test('the desk accepts only its supported panels and input numbers and search can link to them', () => {
  assert.equal(consoleChannel('24'),24);
  for (const invalid of ['1.5','25','',undefined]) assert.equal(consoleChannel(invalid),1);
  assert.equal(consolePanel('gate'),'gate');assert.equal(consolePanel('invalid'),'bank');
  assert.deepEqual(searchPortal('c3500 kompressor')[0].params,{ch:2,panel:'comp'});
});
