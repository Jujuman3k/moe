import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultSignalState, simulateSignal } from '../src/utils/signalSimulation.js';
import { signalWaves, wetShape } from '../src/utils/signalWaves.js';

test('delay timing moves the first echo and feedback creates later repetitions', () => {
  const state = { ...defaultSignalState, fxType: 'delay', delayMs: 350, feedback: 0 };
  for (let time = 0; time < 350; time += 5) assert.equal(wetShape(time, state), 0);
  assert.notEqual(wetShape(400, state), 0);
  assert.equal(wetShape(750, state), 0);
  assert.notEqual(wetShape(750, { ...state, feedback: 50 }), 0);
  assert.equal(wetShape(400, { ...state, delayMs: 700 }), 0);
});

test('longer reverb decay leaves more visible late energy', () => {
  const energy = decay => Array.from({ length: 200 }, (_, n) => wetShape(1000 + n * 5, { ...defaultSignalState, fxType: 'reverb', decay }) ** 2).reduce((a,b) => a+b, 0);
  assert.ok(energy(2.5) > energy(0.4) * 10);
});

test('silent routes remove their output waveform and return layer completely', () => {
  for (const [patch, node] of [[{ connected: false }, 'fx_branch'], [{ muted: true }, 'mixbus'], [{ matrixLevel: -60 }, 'matrix'], [{ mainLevel: -60 }, 'speakers'], [{ paEnabled: false }, 'speakers'], [{ fxReturn: false }, 'fx_branch'], [{ returnLevel: -60 }, 'fx_branch']]) {
    const state = { ...defaultSignalState, fxType: 'delay', ...patch };
    const waves = signalWaves(state, simulateSignal(state), node);
    assert.ok(waves.after.every(value => value === 0), JSON.stringify(patch));
    assert.ok(waves.wet.every(value => value === 0), JSON.stringify(patch));
  }
});

test('fader reduction changes its output curve without changing its input reference', () => {
  const reference = signalWaves(defaultSignalState, simulateSignal(defaultSignalState), 'fader');
  const state = { ...defaultSignalState, fader: -12 };
  const reduced = signalWaves(state, simulateSignal(state), 'fader');
  assert.deepEqual(reference.before, reduced.before);
  assert.ok(Math.max(...reduced.after) < Math.max(...reference.after) / 3);
  for (const value of [...reduced.before, ...reduced.after, ...reduced.wet]) assert.ok(Number.isFinite(value));
});

test('each downstream stage receives the mixed curve including its effect tail', () => {
  for (const patch of [{}, { gain: 54 }, { mainLevel: -60 }, { matrixLevel: -60 }]) {
    const state = { ...defaultSignalState, fxType: 'delay', mainLevel: -6, matrixLevel: -12, ...patch };
    const signal = simulateSignal(state);
    const main = signalWaves(state, signal, 'mixbus');
    const matrix = signalWaves(state, signal, 'matrix');
    const pa = signalWaves(state, signal, 'speakers');
    for (let index = 0; index < main.after.length; index++) {
      assert.ok(Math.abs(matrix.before[index] - main.after[index]) < 1e-12);
      assert.ok(Math.abs(pa.before[index] - matrix.after[index]) < 1e-12);
      assert.ok(Math.abs(pa.after[index] - matrix.after[index]) < 1e-12);
    }
  }
});

test('gain comparison shows amplification of the actual input', () => {
  const waves = signalWaves(defaultSignalState, simulateSignal(defaultSignalState), 'preamp');
  const ratio = Math.max(...waves.after) / Math.max(...waves.before);
  assert.ok(Math.abs(ratio - 10 ** (30 / 20)) < 1e-9);
});
