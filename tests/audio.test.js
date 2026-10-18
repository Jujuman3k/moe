import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { GateEnvelope } from '../src/audio/gate.worklet.js';
import { audioSources, audioLesson } from '../src/data/audioSources.js';
import { signalPanels } from '../src/data/signalPanels.js';

test('all seven recordings have local files, verified checksums and documented CC0 sources', () => {
  const credits = JSON.parse(readFileSync(new URL('../public/audio/credits.json', import.meta.url)));
  assert.equal(audioSources.length, 7);
  for (const source of audioSources) {
    const credit = credits.sounds.find(item => item.id === source.id);
    assert.equal(credit.license, 'CC0-1.0');
    assert.equal(credit.source, source.sourceUrl);
    const data = readFileSync(new URL('../public' + source.file, import.meta.url));
    assert.equal(createHash('sha256').update(data).digest('hex'), credit.sha256);
  }
});

test('gate closes below threshold, opens for a transient and releases gradually', () => {
  const gate = new GateEnvelope(48000);
  for (let i = 0; i < 48000; i++) gate.next(0.001, 0.01, true);
  assert.ok(gate.gain < 0.001);
  for (let i = 0; i < 1000; i++) gate.next(0.1, 0.01, true);
  assert.ok(gate.gain > 0.99);
  for (let i = 0; i < 4800; i++) gate.next(0, 0.01, true);
  assert.ok(gate.gain > 0.1, 'hold and release preserve the transient tail');
  for (let i = 0; i < 48000; i++) gate.next(0, 0.01, true);
  assert.ok(gate.gain < 0.001);
  for (let i = 0; i < 1000; i++) gate.next(0.001, 0.01, false);
  assert.ok(gate.gain > 0.99, 'disabled gate passes a quiet source');
});

test('source-specific listening lessons point to existing panels and bounded settings', () => {
  for (const source of audioSources) for (const [node, panels] of Object.entries(signalPanels)) for (const [panel] of panels) {
    const lesson = audioLesson(source, node, panel);
    assert.ok(lesson.text.length > 30);
    if (lesson.patch) assert.ok(signalPanels[lesson.node].some(([id]) => id === lesson.panel));
  }
});
