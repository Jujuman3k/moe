import test from 'node:test';
import assert from 'node:assert/strict';
import { captureProMix, compareProMixes, parseProBank, readProBank, snapshotName, writeProBank } from '../src/utils/proSnapshots.js';
import { defaultSignalState } from '../src/utils/signalSimulation.js';
import { proSourceLesson } from '../src/data/proAudioLessons.js';
import { audioSources } from '../src/data/audioSources.js';
import { proListeningGuides } from '../src/data/proListeningGuides.js';

test('a memory captures actual Pro, routing and FX without changing independent Enkel or monitor volume',()=>{
  const untouched = structuredClone(defaultSignalState);
  const state = structuredClone(untouched);
  state.proMode = true; state.pro.eq.bands[1].gain=-4;state.fxType='delay';state.fxSend=-8;state.fader=-6;state.monitorPre=false;state.pro.comp.ratio=3.5;
  const saved=captureProMix({...state,sourceId:'male',volume:99,proMode:true});
  state.pro.eq.bands[1].gain=3;state.pro.comp.ratio=2;state.fader=-24;state.eq=-8;state.fxType='off';
  const recalled={...state,...saved};
  assert.equal(recalled.pro.eq.bands[1].gain,-4);assert.equal(recalled.fader,-6);assert.equal(recalled.fxType,'delay');
  assert.equal(recalled.eq,-8);assert.equal(recalled.monitorPre,false);assert.equal(saved.volume,undefined);assert.equal(saved.proMode,undefined);
  const changes=compareProMixes(saved,captureProMix(state));
  assert.deepEqual(changes.map(x=>x.label).sort(),['LM · Gain','Kanalfader','Effekt','Comp · Ratio'].sort());
  assert.equal(changes.find(x=>x.label==='Comp · Ratio').before,'3,5:1');assert.deepEqual(compareProMixes(saved,captureProMix(recalled)),[]);
});
test('storage safely reads a valid slot alongside corrupt, oversized or out-of-range settings',()=>{
  const mix=captureProMix(defaultSignalState), good={name:' Prøve ',mix};
  for(const corrupt of [null,{...mix,pro:{...mix.pro,eq:{enabled:true,bands:[]}}},{...mix,gain:2e7},{...mix,pan:'10'},{...mix,fxType:'invalid'}]){
    const raw=JSON.stringify({version:1,A:good,B:{name:'Feil',mix:corrupt},Z:good});
    assert.deepEqual(parseProBank(raw),{A:{name:'Prøve',mix}});
  }
  assert.deepEqual(parseProBank('{!'),{});assert.deepEqual(parseProBank(JSON.stringify({version:2,A:good})),{});
  assert.equal(snapshotName(' ', 'B'),'Miks B');assert.equal(snapshotName('x'.repeat(40),'A').length,32);
});
test('source banks stay separated when browser storage is unavailable',()=>{
  const saved={B:{name:'Kontrast',mix:captureProMix(defaultSignalState)}};
  assert.equal(writeProBank('snare',saved),false);assert.deepEqual(readProBank('snare'),saved);assert.deepEqual(readProBank('piano'),{});
  assert.throws(()=>readProBank('anything'));assert.equal(writeProBank('snare',{}),false);
});
test('every recorded source has a guided three-step path and its suggested processor settings can be saved',()=>{
  for(const src of audioSources) {
    const guide=proListeningGuides[src.id];assert.equal(guide.steps.length,3);
    assert.equal(new Set(guide.steps.map(([p])=>p)).size,3);
    for(const [panel,,description,band] of guide.steps){
      assert.ok(['preamp','peq','comp','gate','filter'].includes(panel));assert.ok(description.length>35);
      if(band!==undefined)assert.ok(panel==='peq'&&band>=0&&band<4);
    }
    const preset=proSourceLesson(src.id);assert.doesNotThrow(()=>captureProMix({...defaultSignalState,pro:preset.settings}));
  }
});
