import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkSignalMission, defaultSignalState, formatSignalLevel, signalPercent, simulateSignal } from '../src/utils/signalSimulation.js';
import { signalJourney, signalMissions } from '../src/data/signalJourney.js';
import { signalPathData } from '../src/data/signalPathData.js';

test('pre-fade monitor stays independent while dry Main and FX follow the fader', () => {
  for (const fader of [-36, -12, 0]) {
    const signal = simulateSignal({ ...defaultSignalState, fader });
    assert.equal(signal.preamp, -18);
    assert.equal(signal.main, -18 + fader);
    assert.equal(signal.fx, -30 + fader);
    assert.equal(signal.monitor, -24);
    assert.equal(simulateSignal({ ...defaultSignalState, monitorPre: false, fader }).monitor, -24 + fader);
  }
});

test('gain affects all branches, and lowering a fader never repairs upstream clipping', () => {
  assert.equal(simulateSignal({ ...defaultSignalState, gain: 48 }).clipped, false);
  assert.equal(simulateSignal({ ...defaultSignalState, gain: 49 }).clipped, true);
  assert.equal(simulateSignal({ ...defaultSignalState, gain: 36 }).monitor, -18);
  const signal = simulateSignal({ ...defaultSignalState, gain: 54, fader: -24 });
  assert.equal(signal.clipped, true);
  assert.equal(signal.preamp, 0);
  assert.equal(signal.main, -24);
  assert.equal(simulateSignal({ ...defaultSignalState, gain: 30, fader: -24 }).clipped, false);
});

test('disconnect, mute and infinite attenuation stop the appropriate paths', () => {
  const disconnected = simulateSignal({ ...defaultSignalState, connected: false, gain: 60 });
  assert.ok(Object.values(disconnected.nodes).every(value => value === null));
  assert.equal(disconnected.clipped, false);
  const muted = simulateSignal({ ...defaultSignalState, muted: true });
  assert.equal(muted.preamp, -18);
  for (const key of ['post', 'main', 'monitor', 'fx', 'fxReturn']) assert.equal(muted[key], null);
  const faderOff = simulateSignal({ ...defaultSignalState, fader: -60 });
  assert.equal(faderOff.main, null);
  assert.equal(faderOff.fx, null);
  assert.equal(faderOff.monitor, -24);
  assert.equal(simulateSignal({ ...defaultSignalState, fader: -60, monitorPre: false }).monitor, null);
  assert.equal(simulateSignal({ ...defaultSignalState, monitorSend: -60 }).monitor, null);
  assert.equal(simulateSignal({ ...defaultSignalState, fxSend: -60 }).fx, null);
});

test('Main assignment and FX return are independent routes', () => {
  const unassigned = simulateSignal({ ...defaultSignalState, mainAssigned: false, fxType: 'reverb' });
  assert.equal(unassigned.main, null);
  assert.equal(unassigned.monitor, -24);
  assert.equal(unassigned.fxReturn, -30);
  const noReturn = simulateSignal({ ...defaultSignalState, fxReturn: false });
  assert.equal(noReturn.fx, -30);
  assert.equal(noReturn.fxReturn, null);
  assert.equal(noReturn.main, -18);
});

test('every mission starts unsolved and can be solved through its intended controls', () => {
  const solutions = { connection: { connected: true }, headroom: { gain: 30 }, monitor: { monitorPre: true }, mute: { muted: false }, assignment: { mainAssigned: true }, return: { fxReturn: true } };
  assert.equal(signalMissions.length, 6);
  assert.equal(new Set(signalMissions.map(item => item.id)).size, 6);
  for (const mission of signalMissions) {
    const state = { ...defaultSignalState, ...mission.start };
    assert.equal(checkSignalMission(mission.id, state), false, mission.id);
    assert.equal(checkSignalMission(mission.id, { ...state, ...solutions[mission.id] }), true, mission.id);
  }
  assert.equal(checkSignalMission('headroom', { ...defaultSignalState, gain: 54, fader: -60 }), false);
  assert.equal(checkSignalMission('monitor', { ...defaultSignalState, fader: -60 }), false);
  assert.equal(checkSignalMission('return', { ...defaultSignalState, fxSend: -60 }), false);
  assert.equal(checkSignalMission('unknown', defaultSignalState), false);
});

test('journey covers every existing detail module, with bounded readable meters', () => {
  assert.deepEqual(signalJourney.map(item => item.id).sort(), signalPathData.map(item => item.id).sort());
  for (const value of [null, -120, -72, -18, 0, 6]) assert.ok(signalPercent(value) >= 0 && signalPercent(value) <= 100);
  assert.equal(signalPercent(null), 0);
  assert.equal(formatSignalLevel(null), 'Stille');
  assert.equal(formatSignalLevel(-24), '-24 dBFS');
});

test('processing changes downstream paths and bypass restores the unprocessed signal', () => {
  const filtered = simulateSignal({ ...defaultSignalState, hpf: true, hpfHz: 220 });
  assert.ok(Math.abs(filtered.filterDb + 10 * Math.log10(2)) < 1e-9);
  assert.ok(filtered.main < -21 && filtered.monitor < -27);
  const gated = simulateSignal({ ...defaultSignalState, gate: true, gateThreshold: -12 });
  assert.equal(gated.preamp, -18);
  assert.equal(gated.processed, null);
  assert.equal(gated.main, null);
  assert.equal(gated.monitor, null);
  const compressed = simulateSignal({ ...defaultSignalState, compressor: true });
  assert.equal(compressed.reduction, 4.5);
  assert.equal(compressed.processed, -22.5);
  const bypass = simulateSignal({ ...defaultSignalState, gate: true, gateThreshold: -12, hpf: true, eq: 9, compressor: true, bypass: true });
  assert.equal(bypass.processed, -18);
});

test('matrix, PA, Main, pan and wet return have independent effects', () => {
  const signal = simulateSignal({ ...defaultSignalState, matrixLevel: -12 });
  assert.equal(signal.mix, -18);
  assert.equal(signal.matrix, -30);
  assert.equal(signal.monitor, -24);
  assert.equal(simulateSignal({ ...defaultSignalState, paEnabled: false }).pa, null);
  const right = simulateSignal({ ...defaultSignalState, pan: 100 });
  assert.equal(right.left, null);
  assert.equal(right.right, -18);
  const withFx = simulateSignal({ ...defaultSignalState, pan: 100, fxType: 'delay' });
  assert.ok(withFx.left !== null && withFx.mix > right.mix);
  const wetOnly = simulateSignal({ ...defaultSignalState, fxType: 'reverb', mainAssigned: false });
  assert.equal(wetOnly.main, null);
  assert.equal(wetOnly.mix, -30);
});
