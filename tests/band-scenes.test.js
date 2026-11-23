import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audioSources } from '../src/data/audioSources.js';
import { bandScenes, checkBandBalance, getBandScene, initialBandMix, restoreBandMix } from '../src/data/bandScenes.js';

const solved={ vokalplass:{male:{gainDb:-2},piano:{gainDb:-8},guitar:{gainDb:-9}},
  grunnmur:{kick:{gainDb:-2},bass:{gainDb:-5},snare:{gainDb:-8}},
  duett:{female:{pan:-.35,gainDb:-5},male:{pan:.35,gainDb:-5}} };
for(const scene of bandScenes) test('Bandrom: '+scene.title+' can be solved with all channels audible',()=>{
  const mix=initialBandMix(scene);
  assert.equal(scene.tracks.length,3); assert.equal(new Set(scene.tracks.map(t=>t.id)).size,3);
  assert.ok(scene.tracks.every(t=>audioSources.some(s=>s.id===t.id)));
  assert.ok(checkBandBalance(scene,mix));
  for(const c of mix.channels) Object.assign(c,solved[scene.id][c.id]);
  assert.equal(checkBandBalance(scene,mix),null);
  mix.channels[1].mute=true;assert.ok(checkBandBalance(scene,mix));
  mix.channels[1].mute=false;mix.channels[0].solo=true;assert.ok(checkBandBalance(scene,mix));
  mix.channels[0].solo=false;mix.masterDb=-60;assert.ok(checkBandBalance(scene,mix));
});
test('stored mixes preserve the scene channels and recover broken values',()=>{
  const scene=getBandScene('vokalplass');const mix=restoreBandMix(scene,{masterDb:'bad',channels:[{id:'guitar',gainDb:Infinity,pan:-4,mute:'false',solo:true},{id:'other',gainDb:99}]});
  assert.deepEqual(mix.channels.map(c=>c.id),['male','piano','guitar']);assert.deepEqual(mix.channels[2],{id:'guitar',gainDb:-1,pan:-1,mute:false,solo:true});assert.equal(mix.masterDb,-6);
  assert.equal(getBandScene('unknown'),bandScenes[0]);
});
