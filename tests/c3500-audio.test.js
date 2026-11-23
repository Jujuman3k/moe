import test from 'node:test';
import assert from 'node:assert/strict';
import { createC3500Mix, patchC3500Channel, restoreC3500Mix, defaultChannelForSource, c3500ChannelName } from '../src/data/c3500Model.js';
import { C3500Engine } from '../src/audio/c3500Engine.js';

test('24 independent sockets retain separate signal settings when patched to the same recording',()=>{
  const m=createC3500Mix();
  assert.deepEqual(m.channels.filter(c=>!c.mute&&c.sourceId).map(c=>c.sourceId),['kick','bass','snare']);
  assert.equal(new Set(m.channels.map(c=>c.id)).size,24);
  const ch=m.channels[23], p=ch.pro;
  const n=patchC3500Channel(m,24,{sourceId:'kick',fader:4,pro:{...p,gate:{...p.gate,enabled:true,threshold:-16}}});
  assert.equal(n.channels[23].sourceId,'kick');assert.equal(n.channels[23].pro.gate.enabled,true);
  assert.equal(m.channels[0].pro.gate.enabled,false);assert.equal(m.channels[23].sourceId,null);
  assert.equal(n.channels[0],m.channels[0]); assert.equal(c3500ChannelName(ch),'Upatchet');
  assert.equal(defaultChannelForSource('guitar'),7);assert.deepEqual(restoreC3500Mix(JSON.stringify(n)),n);
});

test('invalid settings cannot silently repurpose a socket or inject an invalid parameter into Web Audio',()=>{
  const m=createC3500Mix(),raw=structuredClone(m);
  raw.masterDb=Infinity;raw.channels[2].id=24;raw.channels[3].pro.eq.bands[2].gain=Infinity;
  raw.channels[23].pan=999;raw.channels[23].sourceId='outside';raw.channels[23].mute='true';
  const saved=restoreC3500Mix(raw);
  assert.equal(saved.masterDb,-6); assert.deepEqual(saved.channels[2],m.channels[2]);
  assert.equal(saved.channels[3].pro.eq.bands[2].gain,0); assert.equal(saved.channels[23].sourceId,null);
  assert.equal(saved.channels[23].pan,100); assert.equal(saved.channels[23].mute,false);
  assert.deepEqual(restoreC3500Mix('bad JSON'),m);
});

test('loading never starts on selection; hiding the desk cancels a pending transport and prevents stale decode',async()=>{
  const g=globalThis, keys=['document','window','fetch'];
  const saved=Object.fromEntries(keys.map(k=>[k,Object.getOwnPropertyDescriptor(g,k)]));const contexts=[];
  let decoded,notifyDecoder;const decoderStarted=new Promise(resolve=>{notifyDecoder=resolve;});
  class MockContext {
    constructor(){this.sampleRate=44100;this.state='running';this.audioWorklet={addModule:async()=>{}};contexts.push(this);}
    resume(){return Promise.resolve();}
    decodeAudioData(){notifyDecoder();return new Promise(resolve=>{decoded=resolve;});}
    close(){this.state='closed';return Promise.resolve();}
  }
  let e;
  try {
    const doc=Object.assign(new EventTarget(),{hidden:false});g.document=doc;g.window=Object.assign(new EventTarget(),{AudioContext:MockContext});
    let fetches=0;g.fetch=async()=>{fetches++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(0)};};
    const m=createC3500Mix();m.channels=m.channels.map(c=>({...c,sourceId:c.id<3?'bass':null}));
    e=new C3500Engine();e.setMix(m);assert.equal(fetches,0);assert.equal(contexts.length,0);
    const a=e.play(m);await decoderStarted;assert.equal(fetches,1,'one decode for the same physical source on two strips');
    doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(await a,false);assert.equal(e.status,'idle');
    decoded({});await Promise.resolve();assert.equal(e.buffers.size,0);assert.equal(contexts[0].state,'closed');
    doc.hidden=false;g.fetch=async()=>({ok:false});
    assert.equal(await e.play(m),false);assert.equal(e.status,'error');assert.equal(contexts[1].state,'closed');
  } finally {e?.dispose();for(const k of keys){if(saved[k])Object.defineProperty(g,k,saved[k]);else delete g[k];}}
});
