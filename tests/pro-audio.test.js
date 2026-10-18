import test from 'node:test';
import assert from 'node:assert/strict';
import { ProGateEnvelope, ProCompressorEnvelope, compressionReduction } from '../src/audio/proDynamics.worklet.js';
import { createProSettings } from '../src/data/proAudioSettings.js';
import { proSourceLesson } from '../src/data/proAudioLessons.js';
import { audioSources } from '../src/data/audioSources.js';

function run(processor, input, ms) { let output; for (let i = 0; i < 48 * ms; i++) output = processor.next(input); return output; }
test('Pro gate attack, hold, release and finite depth preserve their intended timing', () => {
  const settings = { ...createProSettings().gate, enabled: true, threshold: -20, depth: 20, attack: 10, hold: 100, release: 100 };
  const gate = new ProGateEnvelope(48000); gate.configure(settings);
  run(gate, 0.001, 2000); assert.ok(Math.abs(gate.gain - 0.1) < 0.001);
  run(gate, 0.5, 10); assert.ok(gate.gain > 0.65 && gate.gain < 0.69);
  run(gate, 0.5, 200); run(gate, 0, 80); assert.ok(gate.gain > 0.99, 'hold keeps the gate open');
  run(gate, 0, 150); assert.ok(gate.gain > 0.1 && gate.gain < 0.6, 'release is gradual');
  run(gate, 0, 1500); assert.ok(Math.abs(gate.gain - 0.1) < 0.001);
});

test('Pro compressor curve has correct knee, ratio and explicit make-up', () => {
  assert.equal(compressionReduction(-30, -24, 4, 0), 0);
  assert.equal(compressionReduction(-12, -24, 4, 0), 9);
  assert.ok(compressionReduction(-26, -24, 4, 6) > 0);
  assert.equal(compressionReduction(0, -24, 1, 6), 0);
  const comp = new ProCompressorEnvelope(48000);
  comp.configure({ ...createProSettings().comp, enabled: true, threshold: -20, ratio: 4, knee: 0, attack: 10 });
  run(comp, 1, 1000); assert.ok(Math.abs(comp.reduction - 15) < 0.01);
  const before = comp.reduction; run(comp, 0.001, 10); assert.ok(comp.reduction > before / 2, 'release cannot drop reduction immediately');
});

test('Peak/RMS and attack/release audibly differ on short transients', () => {
  const result = (attack, release, rms) => {
    const comp = new ProCompressorEnvelope(48000); comp.configure({ ...createProSettings().comp, enabled: true, threshold: -24, ratio: 8, knee: 0, attack, release, rms });
    run(comp, 0, 100); const transient = run(comp, 0.8, 2); run(comp, 0, 80); return { transient, reduction: comp.reduction };
  };
  assert.ok(result(0.1, 100, false).transient < result(100, 100, false).transient / 2);
  assert.ok(result(0.1, 100, true).transient > result(0.1, 100, false).transient);
  assert.ok(result(0.1, 500, false).reduction > result(0.1, 10, false).reduction);
});

test('each recording has an independent, conservative and fully explained Pro starting point', () => {
  for (const source of audioSources) {
    const lesson = proSourceLesson(source.id);
    for (const section of ['filter', 'eq', 'gate', 'comp']) assert.ok(lesson[section].length > 30);
    assert.equal(lesson.settings.eq.bands.length, 4);
    assert.ok(lesson.settings.eq.bands.every(band => Math.abs(band.gain) <= 3));
    assert.equal(lesson.settings.comp.makeup, 0);
    lesson.settings.eq.bands[0].gain = 99;
    assert.notEqual(proSourceLesson(source.id).settings.eq.bands[0].gain, 99);
  }
});
