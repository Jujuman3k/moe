// Each recorded channel is a mono input to an equal-power stereo panner.
export const BAND_BPM = 110;
export const METER_FLOOR = -72;
const INPUT_PEAK = 10 ** (-6 / 20);
const FLOOR_GAIN = -60;
const clamp = (n, low, high, fallback) => Number.isFinite(n) ? Math.max(low, Math.min(high, n)) : fallback;
const dbGain = (db, fallback) => {
  const v = clamp(db, FLOOR_GAIN, 6, fallback);
  return v <= FLOOR_GAIN ? 0 : 10 ** (v / 20);
};

// Assemble the rhythm group on the same four-beat clock, without time-stretching
// or retuning any phrase. Vocal, piano and guitar are independent field recordings.
export function arrangeBandLoop(id, samples, sampleRate) {
  const bar = Math.round(4 * 60 * sampleRate / BAND_BPM);
  const percussion = id === 'kick' || id === 'snare';
  const output = new Float32Array(percussion || id === 'bass' ? bar : samples.length);
  const offsets = percussion
    ? (id === 'kick' ? [0, .5] : [.25, .75]).map(at => Math.round(at * bar))
    : [0];
  let peak = 0;
  for (const x of samples) peak = Math.max(peak, Math.abs(x));
  if (!Number.isFinite(peak) || peak < 1e-6) throw new Error('Opptaket inneholder ikke brukbar lyd.');
  const scale = INPUT_PEAK / peak;
  for (const offset of offsets) {
    const count = Math.min(samples.length, output.length - offset);
    const fade = Math.min(Math.round(sampleRate * .003), Math.floor(count / 2));
    for (let i = 0; i < count; i++) {
      const edge = fade > 0 ? Math.min(1, i / fade, (count - 1 - i) / fade) : 1;
      output[offset + i] += samples[i] * scale * edge;
    }
  }
  return output;
}

// Linear at ordinary levels, smooth bounded sample peaks on overloaded sums.
// Scale by 1/8 before the WaveShaper so its native ±1 input range has headroom.
const guardCurve = Float32Array.from({ length: 8193 }, (_, i) => {
  const x = (2 * i / 8192 - 1) * 8, amplitude = Math.abs(x);
  return Math.sign(x) * (amplitude <= .75 ? amplitude : .75 + .2 * Math.tanh((amplitude - .75) / .2));
});

function levelMeter(context) {
  const analyser = context.createAnalyser();
  analyser.fftSize = 4096;
  const data = new Float32Array(analyser.fftSize);
  return { node: analyser, read() {
    analyser.getFloatTimeDomainData(data);
    let peak = 0;
    for (const x of data) peak = Math.max(peak, Math.abs(x));
    return peak > 0 ? Math.max(METER_FLOOR, 20 * Math.log10(peak)) : METER_FLOOR;
  } };
}

function smooth(param, target, time, immediate) {
  if (immediate) param.setValueAtTime(target, time);
  else param.setTargetAtTime(target, time, .009);
}

export function createBandRoomGraph(context, mix) {
  const master = context.createGain(), headroom = context.createGain(), ceiling = context.createWaveShaper();
  const output = context.createGain(), split = context.createChannelSplitter(2);
  const left = levelMeter(context), right = levelMeter(context);
  headroom.gain.value = 1 / 8;
  ceiling.curve = guardCurve;
  master.connect(headroom).connect(ceiling).connect(output);
  output.connect(split);
  split.connect(left.node, 0); split.connect(right.node, 1);
  const tracks = new Map(mix.channels.map(({id}) => {
    const gain = context.createGain(), pan = context.createStereoPanner(), meter = levelMeter(context);
    gain.connect(meter.node).connect(pan).connect(master);
    return [id, { gain, pan, meter }];
  }));
  function setMix(next, immediate = false) {
    const time = context.currentTime;
    const solo = next.channels.some(channel => tracks.has(channel.id) && channel.solo);
    const channels = new Map(next.channels.map(channel => [channel.id, channel]));
    for (const [id, track] of tracks) {
      const ch = channels.get(id);
      const audible = ch && !ch.mute && (!solo || ch.solo);
      smooth(track.gain.gain, audible ? dbGain(ch.gainDb, -6) : 0, time, immediate);
      smooth(track.pan.pan, clamp(ch?.pan, -1, 1, 0), time, immediate);
    }
    smooth(master.gain, dbGain(next.masterDb, -6), time, immediate);
  }
  setMix(mix, true);
  return {
    inputs: new Map([...tracks].map(([id, { gain }]) => [id, gain])),
    output, setMix,
    readMeters: () => ({ left: left.read(), right: right.read(), channels: Object.fromEntries([...tracks].map(([id, {meter}]) => [id, meter.read()])) }),
    fadeOut() { smooth(output.gain, 0, context.currentTime, false); },
    dispose() {
      for (const {gain, pan, meter} of tracks.values()) { gain.disconnect(); pan.disconnect(); meter.node.disconnect(); }
      for (const node of [master, headroom, ceiling, output, split, left.node, right.node]) node.disconnect();
    },
  };
}
