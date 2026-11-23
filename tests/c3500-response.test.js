import test from 'node:test';
import assert from 'node:assert/strict';
import { curve, active } from '../src/components/c3500/ProcessorResponse.js';
import { createProSettings } from '../src/data/proAudioSettings.js';
const near=(a,b,tol=1e-4)=>assert.ok(Math.abs(a-b)<tol, a+' vs '+b);

test('logarithmic screen axis places a 200 Hz boost at exactly one third of the graph and sums bands in dB',()=>{
  const p=createProSettings();
  for(let i=0;i<2;i++) Object.assign(p.eq.bands[i],{frequency:200,gain:3,width:.7});
  const dbAt=(i,band)=>curve(p,'peq',band,48000,120)[i][1]*36-18;
  near(dbAt(40,0),3);near(dbAt(40,1),3);near(dbAt(40),6);
  p.eq.enabled=false;assert.equal(active(p,'peq',0),false);
  near(dbAt(40),6); // Out: grey remembered shape, as on the touchscreen.
});

test('unpatched high-pass is flat, 12 and 24 dB/octave meet near the same cutoff but attenuate the lower octave differently',()=>{
  const p=createProSettings();p.filters.hpfHz=200;
  const dbAt=i=>curve(p,'filter',null,48000,120)[i][1]*36-18;
  near(dbAt(40),0);p.filters.hpf=true;
  near(dbAt(40),-3.0103,.002);const octaveDown12=dbAt(28);
  p.filters.slope=24;near(dbAt(40),-3.0103,.002);
  assert.ok(dbAt(28)<octaveDown12-5);
});

test('gate depth gives an actual threshold discontinuity; hard-knee mix incorporates makeup and dry/wet',()=>{
  const p=createProSettings();
  Object.assign(p.gate,{threshold:-24,depth:12});
  const gate=curve(p,'gate',null,48000,120);
  near(gate[1][0],1/6);near(gate[2][0],2/3);near(gate[3][0],2/3);near((gate[3][1]-gate[2][1])*72,12);
  near((gate[2][1]-gate[1][1])/(gate[2][0]-gate[1][0]),1);
  Object.assign(p.comp,{threshold:-30,ratio:4,knee:0,mix:100,makeup:3});
  const output=(i)=>curve(p,'comp',null,48000,60)[i][1]*60-60;
  near(output(50),-22); // -10 in, 15 dB reduction, +3 makeup.
  p.comp.mix=0;near(output(50),-10);
});
