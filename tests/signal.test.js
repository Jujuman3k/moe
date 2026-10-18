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
  const unassigned = simulateSignal({ ...defaultSignalState, mainAssigned: false });
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
