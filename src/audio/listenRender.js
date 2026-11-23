import { echo, room } from './listenSpace.js';
import { filterCoefficients } from './proFilters.js';
import { ProGateEnvelope, ProCompressorEnvelope } from './proDynamics.worklet.js';
import { listenFilters, listenDynamics } from '../data/listenProfiles.js';

// Use one mono loop and one shared tail window: switching must never give away
// the answer through a moved downbeat, a different loop length or a louder take.
const tailSeconds = 0.65;
const targetRms = 0.085;
const peakCeiling = 0.42;

function filter(dry, rate, spec) {
  const [b0, b1, b2, a0, a1, a2] = filterCoefficients(spec, rate);
  const output = new Float32Array(dry.length);
  const c0 = b0 / a0, c1 = b1 / a0, c2 = b2 / a0, d1 = a1 / a0, d2 = a2 / a0;
  let s1 = 0, s2 = 0;
  for (let i = 0; i < dry.length; ++i) {
    const x = dry[i], y = c0 * x + s1;
    s1 = c1 * x - d1 * y + s2; s2 = c2 * x - d2 * y;
    output[i] = y;
  }
  return output;
}

function dynamics(dry, rate, effect, peak) {
  const processor = effect === 'gated' ? new ProGateEnvelope(rate) : new ProCompressorEnvelope(rate);
  const profile = listenDynamics[effect];
  processor.configure({ ...profile, enabled: true, threshold: 20 * Math.log10(peak) + profile.relativeDb });
  return dry.map(value => processor.next(value));
}

function measure(samples) {
  let power = 0, peak = 0;
  for (const value of samples) { power += value * value; peak = Math.max(peak, Math.abs(value)); }
  return { rms: Math.sqrt(power / samples.length), peak };
}

function overview(samples, peak, bins = 96) {
  const peaks = Array(bins).fill(0);
  for (let i = 0; i < samples.length; ++i) {
    const bin = Math.floor(i * peaks.length / samples.length);
    peaks[bin] = Math.max(peaks[bin], Math.abs(samples[i]) / peak);
  }
  return peaks;
}

export function renderListenPair(input, sampleRate, effect) {
  if (!input?.length || !Number.isFinite(sampleRate) || sampleRate < 8000) throw new Error('Ugyldig lydopptak.');
  const dry = new Float32Array(input.length + Math.ceil(tailSeconds * sampleRate));
  dry.set(input);
  const a = measure(dry);
  if (!(a.rms > 1e-8)) throw new Error('Opptaket har ikke brukbar lyd.');
  let changed;
  if (Object.hasOwn(listenFilters, effect)) changed = filter(dry, sampleRate, listenFilters[effect]);
  else if (Object.hasOwn(listenDynamics, effect)) changed = dynamics(dry, sampleRate, effect, a.peak);
  else if (effect === 'echo') changed = echo(dry, sampleRate);
  else if (effect === 'room') changed = room(dry, sampleRate);
  else throw new Error('Ukjent lyttingseksempel.');
  const fade = Math.ceil(0.008 * sampleRate);
  for (let i = 0; i < fade; ++i) changed[changed.length - 1 - i] *= i / fade;
  const b = measure(changed);
  if (!(b.rms > 1e-8)) throw new Error('Opptaket har ikke brukbar lyd.');
  const peaks = overview(dry, a.peak);
  // Equal RMS, then one linked gain for both. This is sample-peak management,
  // not LUFS matching or a prediction of acoustic loudness on a device.
  const rms = Math.min(targetRms, peakCeiling * a.rms / a.peak, peakCeiling * b.rms / b.peak);
  const gainA = rms / a.rms, gainB = rms / b.rms;
  for (let i = 0; i < dry.length; ++i) { dry[i] *= gainA; changed[i] *= gainB; }
  // Comparison evidence uses identical time bins and the SAME scale for both lanes.
  // Kept separate from the neutral player waveform so it cannot give away the answer.
  const sharedPeak = Math.max(a.peak * gainA, b.peak * gainB);
  const evidence = { dry: overview(dry, sharedPeak, 160), changed: overview(changed, sharedPeak, 160),
    thresholdDb: Object.hasOwn(listenDynamics, effect) ? 20 * Math.log10(a.peak) + listenDynamics[effect].relativeDb : null };
  return { dry, changed, peaks, evidence, duration: dry.length / sampleRate };
}
