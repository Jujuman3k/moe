import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BAND_BPM, arrangeBandLoop } from '../src/audio/bandRoomGraph.js';

test('kick, skarp and bass share a bar clock with distinct downbeats and backbeats', () => {
  const rate = 44100;
  const sample = new Float32Array(rate);
  sample[300] = .25; sample[320] = -.15;
  const kick = arrangeBandLoop('kick', sample, rate);
  const snare = arrangeBandLoop('snare', sample, rate);
  const bass = arrangeBandLoop('bass', sample.subarray(0, 600), rate);
  const bar = Math.round(4 * 60 / BAND_BPM * rate);
  assert.deepEqual([kick.length, snare.length, bass.length], [bar, bar, bar]);
  const ref = 10 ** (-6 / 20);
  for (let beat = 0; beat < 4; beat++) {
    const t = Math.round(beat * bar / 4) + 300;
    assert.ok(Math.abs(kick[t] - (beat % 2 ? 0 : ref)) < 1e-6);
    assert.ok(Math.abs(snare[t] - (beat % 2 ? ref : 0)) < 1e-6);
  }
  assert.ok(bass[300] > .5 && bass[600] === 0);
});

test('calibration preserves pitch, internal dynamics and duration; loops ease to silence', () => {
  const rate = 10000;
  const p = new Float32Array(4700).fill(.04);
  p[500] = .5; p[800] = -.4;
  const quiet = p.map(x => x / 20);
  const a = arrangeBandLoop('male', p, rate), b = arrangeBandLoop('piano', quiet, rate);
  assert.equal(a.length, p.length); assert.equal(b.length, quiet.length);
  assert.equal(a[0], 0); assert.equal(a.at(-1), 0);
  for (let i = 0; i < a.length; i++) assert.ok(Math.abs(a[i] - b[i]) < 1e-6);
  assert.ok(Math.abs(a[800] / a[500] - (-.4 / .5)) < 1e-6);
  assert.throws(() => arrangeBandLoop('male', new Float32Array(16), rate), /brukbar lyd/);
});

test('a cancelled decoder cannot restart a closed scene; failed downloads can be retried', async () => {
  const { BandRoomEngine } = await import('../src/audio/bandRoomEngine.js');
  const g = globalThis;
  const saved = Object.fromEntries(['document','window','fetch'].map(k => [k, Object.getOwnPropertyDescriptor(g, k)]));
  const contexts = []; let complete, started;
  const decoding = new Promise(resolve => { started = resolve; });
  class TestContext {
    constructor() { contexts.push(this); this.state = 'running'; this.sampleRate = 48000; }
    resume() { return Promise.resolve(); }
    decodeAudioData() { started(); return new Promise(resolve => { complete = resolve; }); }
    close() { this.state = 'closed'; return Promise.resolve(); }
  }
  const doc = Object.assign(new EventTarget(), {hidden:false});
  const win = Object.assign(new EventTarget(), {AudioContext:TestContext});
  const mix = { channels:[{id:'male',gainDb:-6}], masterDb:-6 };
  const states = [];
  let engine;
  try {
    g.document = doc; g.window = win;
    g.fetch = async () => ({ok:true,arrayBuffer:async () => new ArrayBuffer(16)});
    engine = new BandRoomEngine({onStatus:(state,error) => states.push([state,error])});
    assert.equal(contexts.length,0);
    const stale = engine.play(mix);
    await decoding; doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(await stale,false);
    assert.equal(contexts[0].state,'closed');
    complete({}); // decodeAudioData cannot always be aborted; ignore this stale result.
    await Promise.resolve();
    assert.equal(engine.status,'idle'); assert.equal(engine.buffers.size,0);
    doc.hidden = false;
    g.fetch = async () => ({ok:false});
    assert.equal(await engine.play(mix),false); assert.equal(engine.status,'error');
    assert.match(states.at(-1)[1],/mannsvokal/);
    assert.equal(contexts[1].state,'closed');
    const retry = engine.play(mix); win.dispatchEvent(new Event('pagehide'));
    assert.equal(await retry,false); assert.equal(engine.status,'idle');
    assert.deepEqual(states.map(([state])=>state),['loading','idle','loading','error','loading','idle']);
    assert.equal(contexts.length,3);
  } finally {
    engine?.dispose();
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(g,key,descriptor); else delete g[key];
    }
  }
});
