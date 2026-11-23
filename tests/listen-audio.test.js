import test from 'node:test';
import assert from 'node:assert/strict';
import { renderListenPair } from '../src/audio/listenRender.js';
import { ListenEngine } from '../src/audio/listenEngine.js';

const rate = 24000;
const rms = samples => Math.sqrt(samples.reduce((sum, x) => sum + x * x, 0) / samples.length);
const peak = samples => samples.reduce((max, x) => Math.max(max, Math.abs(x)), 0);
const tone = hz => Float32Array.from({ length: rate / 2 }, (_, i) => Math.sin(2 * Math.PI * hz * i / rate));

function amplitude(samples, hz) {
  let sin = 0, cos = 0;
  // 0.2 s in a settled section (integer cycles for both frequencies).
  for (let i = rate / 8; i < rate / 8 + rate / 5; ++i) {
    sin += samples[i] * Math.sin(2 * Math.PI * hz * i / rate);
    cos += samples[i] * Math.cos(2 * Math.PI * hz * i / rate);
  }
  return Math.hypot(sin, cos);
}

test('A/B renders preserve sample timing, RMS level, peak headroom and a neutral waveform for every effect', () => {
  const low = tone(100), high = tone(6000);
  const input = low.map((value, i) => 0.4 * (value + high[i]));
  for (const effect of ['dark', 'thin', 'echo', 'room']) {
    const { dry, changed, peaks, duration } = renderListenPair(input, rate, effect);
    assert.equal(dry.length, changed.length);
    assert.equal(dry.length, input.length + rate * 0.65);
    assert.equal(duration, dry.length / rate);
    assert.ok(Math.abs(rms(dry) - rms(changed)) / rms(dry) < 1e-6);
    assert.ok(Math.max(peak(dry), peak(changed)) <= 0.420001);
    assert.equal(Math.max(...peaks), 1);
    assert.equal(peaks.length, 96);
    assert.equal(peaks.at(-1), 0);
    const originalToneRatio = amplitude(dry, 100) / amplitude(dry, 6000);
    assert.ok(Math.abs(originalToneRatio - 1) < 0.001);
    const processedToneRatio = amplitude(changed, 100) / amplitude(changed, 6000);
    if (effect === 'dark') assert.ok(processedToneRatio > 12, 'LPF suppresses the high tone');
    if (effect === 'thin') assert.ok(processedToneRatio < 0.12, 'HPF suppresses the low tone');
  }
});

test('identical isolated transients gain two spaced repeats for echo, or a dense decaying tail for room', () => {
  const impulse = new Float32Array(rate / 5); impulse[32] = 1;
  const echo = renderListenPair(impulse, rate, 'echo');
  const taps = Array.from(echo.changed.keys()).filter(i => Math.abs(echo.changed[i]) > 0.00001);
  assert.deepEqual(taps, [32, 32 + rate / 5, 32 + 2 * rate / 5]);
  assert.ok(Math.abs(echo.changed[taps[1]] / echo.changed[taps[0]] - 0.38) < 1e-6);
  assert.ok(Math.abs(echo.changed[taps[2]] / echo.changed[taps[0]] - 0.17) < 1e-6);
  const { changed } = renderListenPair(impulse, rate, 'room');
  assert.equal(changed.findIndex(x => x !== 0), 32);
  const early = changed.slice(rate / 20, rate / 5);
  const late = changed.slice(rate / 2, rate * 0.65);
  assert.ok(early.filter(x => Math.abs(x) > 1e-5).length > 300);
  assert.ok(rms(late) < rms(early) / 25, 'short room decays instead of sustaining');
  assert.throws(() => renderListenPair(new Float32Array(20), rate, 'room'), /brukbar lyd/);
  assert.throws(() => renderListenPair(impulse, rate, 'missing'), /Ukjent/);
});

// Verify Web Audio scheduling/lifecycle separately from the rendered samples.
function fakeContext() {
  const sources = [], gains = [];
  let resume = () => Promise.resolve();
  return { currentTime: 3, state: 'running', destination: {}, sources, gains,
    holdResume() { resume = () => new Promise(() => {}); },
    resume() { return resume(); }, close() { this.state = 'closed'; },
    createGain() {
      const gain = { value: 1, targets: [], setTargetAtTime(...args) { this.targets.push(args); }, setValueAtTime() {}, linearRampToValueAtTime() {} };
      const node = { gain, connect(target) { return target; }, disconnect() { this.disconnected = true; } };
      gains.push(node); return node;
    },
    createBufferSource() {
      const source = { connect(target) { return target; }, start(at) { this.startedAt = at; }, stop() { this.stopped = true; }, disconnect() { this.disconnected = true; } };
      sources.push(source); return source;
    },
  };
}

test('A/B uses one start time, swaps gains without retrigger, and cannot restart after a canceled load', async t => {
  const context = fakeContext(), previous = globalThis.window;
  globalThis.window = { AudioContext: class { constructor() { return context; } } };
  t.after(() => { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; });
  const engine = new ListenEngine();
  engine.cache.set('/test|echo', { buffers: [{ duration: 1 }, { duration: 1 }], preview: { duration: 1, peaks: [0, 1] } });
  assert.equal(await engine.play({ url: '/test', effect: 'echo' }, 'A'), true);
  assert.equal(context.sources[0].startedAt, context.sources[1].startedAt);
  assert.deepEqual(context.gains.slice(1).map(node => node.gain.value), [1, 0]);
  context.currentTime += 0.23; const before = engine.position();
  engine.select('B'); assert.equal(context.sources.length, 2); assert.equal(engine.position(), before);
  assert.deepEqual(context.gains.slice(1).map(node => node.gain.targets.at(-1)[0]), [0, 1]);
  context.holdResume(); const pending = engine.play({ url: '/test', effect: 'echo' }, 'B');
  engine.stop(); assert.equal(await pending, false); assert.equal(context.sources.length, 2);
  assert.ok(context.sources.every(source => source.stopped && source.disconnected));
  assert.ok(context.gains.every(gain => gain.disconnected));
  assert.equal(engine.position(), 0); await engine.close(); assert.equal(context.state, 'closed');
});
