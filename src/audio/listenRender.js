import { filterCoefficients } from './proFilters.js';

// Use one mono loop and one shared tail window: switching must never give away
// the answer through a moved downbeat, a different loop length or a louder take.
const tailSeconds = 0.65;
const targetRms = 0.085;
const peakCeiling = 0.42;

function filter(dry, rate, highpass) {
  const [b0, b1, b2, a0, a1, a2] = filterCoefficients({ enabled: true,
    type: highpass ? 'highpass' : 'lowpass', frequency: highpass ? 350 : 1300,
    Q: 20 * Math.log10(Math.SQRT1_2), gain: 0 }, rate);
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

function echo(dry, rate) {
  const gap = Math.round(rate * 0.2);
  return dry.map((x, i) => x + 0.38 * (dry[i - gap] || 0) + 0.17 * (dry[i - gap * 2] || 0));
}

// A short Schroeder room: four damped, differently spaced reflections feed
// two allpasses. The energy spreads into a tail instead of two rhythmic taps.
function room(dry, rate) {
  const wet = new Float32Array(dry.length);
  for (const ms of [29.7, 37.1, 41.1, 43.7]) {
    const length = Math.max(1, Math.round(ms * rate / 1000));
    const line = new Float32Array(length);
    const feedback = 10 ** (-3 * length / (rate * 0.55));
    let head = 0, smooth = 0;
    for (let i = 0; i < dry.length; ++i) {
      const delayed = line[head]; smooth += 0.72 * (delayed - smooth);
      line[head] = dry[i] + smooth * feedback;
      wet[i] += 0.37 * delayed;
      if (++head === length) head = 0;
    }
  }
  for (const ms of [5, 1.7]) {
    const length = Math.max(1, Math.round(ms * rate / 1000));
    const line = new Float32Array(length); let head = 0;
    for (let i = 0; i < wet.length; ++i) {
      const x = wet[i], y = line[head] - 0.58 * x;
      line[head] = x + 0.58 * y;
      wet[i] = y;
      if (++head === length) head = 0;
    }
  }
  for (let i = 0; i < wet.length; ++i) wet[i] += dry[i];
  return wet;
}

function measure(samples) {
  let power = 0, peak = 0;
  for (const value of samples) { power += value * value; peak = Math.max(peak, Math.abs(value)); }
  return { rms: Math.sqrt(power / samples.length), peak };
}

function overview(samples, peak) {
  const peaks = Array(96).fill(0);
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
  let changed;
  if (effect === 'dark' || effect === 'thin') changed = filter(dry, sampleRate, effect === 'thin');
  else if (effect === 'echo') changed = echo(dry, sampleRate);
  else if (effect === 'room') changed = room(dry, sampleRate);
  else throw new Error('Ukjent lyttingseksempel.');
  const fade = Math.ceil(0.008 * sampleRate);
  for (let i = 0; i < fade; ++i) changed[changed.length - 1 - i] *= i / fade;
  const a = measure(dry), b = measure(changed);
  if (!(a.rms > 1e-8 && b.rms > 1e-8)) throw new Error('Opptaket har ikke brukbar lyd.');
  const peaks = overview(dry, a.peak);
  // Equal RMS, then one linked gain for both. This is sample-peak management,
  // not LUFS matching or a prediction of acoustic loudness on a device.
  const rms = Math.min(targetRms, peakCeiling * a.rms / a.peak, peakCeiling * b.rms / b.peak);
  const gainA = rms / a.rms, gainB = rms / b.rms;
  for (let i = 0; i < dry.length; ++i) { dry[i] *= gainA; changed[i] *= gainB; }
  return { dry, changed, peaks, duration: dry.length / sampleRate };
}
