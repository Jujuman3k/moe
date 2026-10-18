import { amplitude } from './signalSimulation.js';

export const waveDuration = 2400;
export const waveSamples = 481;

// Schematic carrier, deliberately slowed for visibility. Timing of echo offsets
// is in milliseconds; this is not sampled audio or a model of a particular FX.
export function dryShape(time, kind) {
  if (time < 0 || time > waveDuration) return 0;
  if (kind === 'sine') return Math.sin(time / 90 * Math.PI * 2);
  if (time > 260) return 0;
  return Math.sin(time / 45 * Math.PI * 2) * Math.sin(time / 260 * Math.PI);
}

export function wetShape(time, state) {
  if (state.fxType === 'delay') {
    let sample = 0;
    for (let echo = 1; echo <= 16; echo++) sample += dryShape(time - state.delayMs * echo, state.sourceKind) * (state.feedback / 100) ** (echo - 1);
    return sample;
  }
  if (state.fxType === 'reverb') {
    // Dense delayed copies with a decay envelope and a fixed display scale.
    let sample = 0;
    for (let tap = 1; tap <= 80; tap++) {
      const offset = 29 * tap + (tap % 3) * 7;
      sample += dryShape(time - offset, state.sourceKind) * Math.exp(-6.91 * offset / (state.decay * 1000)) * (tap % 2 ? 1 : -1);
    }
    return sample * 0.8;
  }
  return 0;
}

export function signalWaves(state, signal, nodeId) {
  const beforeLevel = { fader: signal.processed, monitor_branch: state.monitorPre ? (state.muted ? null : signal.processed) : signal.post, fx_branch: signal.fx, mixbus: signal.post }[nodeId];
  const afterLevel = signal.nodes[nodeId];
  const afterScale = nodeId === 'matrix' || nodeId === 'speakers' ? amplitude(state.mainLevel + state.matrixLevel) : nodeId === 'mixbus' ? amplitude(state.mainLevel) : 1;
  const combined = ['mixbus', 'matrix', 'speakers'].includes(nodeId);
  const duration = ['fx_branch', 'mixbus', 'matrix', 'speakers'].includes(nodeId) ? waveDuration : 400;
  const before = []; const after = []; const wet = [];
  for (let index = 0; index < waveSamples; index++) {
    const time = index / (waveSamples - 1) * duration;
    const shape = dryShape(time, state.sourceKind);
    const requestedWave = shape * amplitude(signal.requested);
    const preampWave = Math.max(-1, Math.min(1, requestedWave));
    const normalized = amplitude(signal.preamp) ? preampWave / amplitude(signal.preamp) : 0;
    const fxWave = wetShape(time, state) * amplitude(signal.fxReturn);
    const mixedWave = (normalized * amplitude(signal.main) + fxWave) * amplitude(state.mainLevel);
    const matrixWave = signal.matrix === null ? 0 : mixedWave * amplitude(state.matrixLevel);
    let incoming = normalized * amplitude(beforeLevel ?? null);
    if (nodeId === 'input') incoming = shape * amplitude(state.sourceLevel);
    if (nodeId === 'preamp') incoming = shape * amplitude(signal.input);
    if (nodeId === 'processing') incoming = preampWave;
    if (nodeId === 'matrix') incoming = signal.mix === null ? 0 : mixedWave;
    if (nodeId === 'speakers') incoming = matrixWave;
    before.push(incoming);
    let value = normalized * amplitude(afterLevel);
    if (nodeId === 'preamp') value = preampWave;
    if (nodeId === 'input') value = shape * amplitude(signal.input);
    if (nodeId === 'fx_branch') value = fxWave;
    if (combined) value = (normalized * amplitude(signal.main) + fxWave) * afterScale;
    if (combined && afterLevel === null) value = 0;
    after.push(value);
    wet.push(combined ? (afterLevel === null ? 0 : fxWave * afterScale) : nodeId === 'fx_branch' ? fxWave : 0);
  }
  const largest = Math.max(nodeId === 'fx_branch' ? 0.0625 : 0.25, ...before.map(Math.abs), ...after.map(Math.abs));
  const zoom = nodeId === 'input' ? 0.8 / Math.max(0.01, amplitude(state.sourceLevel)) : 0.8 / largest;
  return { before, after, wet, zoom, duration };
}

export function wavePath(samples, zoom) {
  return samples.map((sample, index) => `${index === 0 ? 'M' : 'L'}${(index / (samples.length - 1) * 640).toFixed(1)},${(50 - sample * zoom * 44).toFixed(2)}`).join(' ');
}
