import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test.describe.configure({ timeout: 60000 });
test.beforeEach(async ({ page }) => {
  // Serve the production graph's source for offline DSP tests, only inside this test.
  await page.route('**/__audio_source/**', async route => {
    const file = new URL(route.request().url()).pathname.replace('/__audio_source/', '');
    const root = path.resolve('src'); const resolved = path.resolve(root, file);
    if (!resolved.startsWith(root + path.sep)) return route.abort();
    await route.fulfill({ contentType: 'text/javascript', body: await readFile(resolved, 'utf8') });
  });
  await page.goto('/');
});

async function render(page, options = {}) {
  return page.evaluate(async options => {
    const { createSignalAudioGraph } = await import('/__audio_source/audio/signalAudioGraph.js');
    const rate = 48000; const seconds = options.seconds || 1.6;
    const context = new OfflineAudioContext(2, Math.ceil(rate * seconds), rate);
    // Worklet requests bypass Playwright's page routes. Fetch the exact worklet
    // through our fixture route, then register it as a module with a blob URL.
    const gateSource = await (await fetch('/__audio_source/audio/gate.worklet.js')).text();
    const gateUrl = URL.createObjectURL(new Blob([gateSource], { type: 'text/javascript' }));
    await context.audioWorklet.addModule(gateUrl); URL.revokeObjectURL(gateUrl);
    const graph = createSignalAudioGraph(context, options.settings || {}, options.listening || {});
    const buffer = context.createBuffer(1, Math.ceil(rate * seconds), rate);
    const values = buffer.getChannelData(0);
    for (let i = 0; i < values.length; i++) {
      const t = i / rate;
      const envelope = options.kind === 'burst' ? (t < 0.04 ? Math.sin(Math.PI * t / 0.04) : 0) : options.kind === 'steps' ? (t < 0.6 ? 0.1 : 1) : 1;
      values[i] = envelope * Math.sin(2 * Math.PI * (options.frequency || 1000) * t);
    }
    const source = context.createBufferSource(); source.buffer = buffer; source.connect(graph.input);
    if (options.tap === 'output') { graph.output.connect(context.destination); graph.start(); }
    else graph.taps[options.tap || 'processed'].analyser.connect(context.destination);
    source.start();
    const result = await context.startRendering();
    const channels = Array.from({ length: 2 }, (_, channel) => {
      const data = result.getChannelData(channel);
      const rms = (start, end) => { let power = 0; let count = 0; for (let i = Math.floor(start * rate); i < Math.min(data.length, end * rate); i++) { power += data[i] ** 2; count++; } return Math.sqrt(power / Math.max(1, count)); };
      let peak = 0; for (const value of data) peak = Math.max(peak, Math.abs(value));
      return { peak, rms: rms(0.2, seconds), quiet: rms(0.2, 0.5), loud: rms(1, seconds), windows: Array.from({ length: Math.floor(seconds * 10) }, (_, i) => rms(i / 10, (i + 1) / 10)), flat: Array.from(data).filter(value => Math.abs(value) > peak * 0.99).length / data.length };
    });
    graph.dispose(); return channels;
  }, options);
}

test('rendered PCM follows fader, monitor pre/post, Main assignment and PA routing', async ({ page }) => {
  test.setTimeout(60000);
  const base = (await render(page, { tap: 'monitor' }))[0].rms;
  const pre = (await render(page, { tap: 'monitor', settings: { fader: -18 } }))[0].rms;
  const post = (await render(page, { tap: 'monitor', settings: { fader: -18, monitorPre: false } }))[0].rms;
  expect(pre / base).toBeCloseTo(1, 3); expect(post / base).toBeCloseTo(10 ** (-18 / 20), 3);
  for (const settings of [{ mainAssigned: false }, { muted: true }, { connected: false }, { fader: -60 }]) expect((await render(page, { tap: 'mix', settings }))[0].peak).toBeLessThan(0.000001);
  expect((await render(page, { tap: 'pa', settings: { paEnabled: false } }))[0].peak).toBe(0);
  const main = (await render(page, { tap: 'mix' }))[0].rms;
  expect((await render(page, { tap: 'pa', settings: { matrixLevel: -12 } }))[0].rms / main).toBeCloseTo(10 ** (-12 / 20), 3);
  const pan = await render(page, { tap: 'mix', settings: { pan: -100 } });
  expect(pan[0].rms).toBeGreaterThan(0.05); expect(pan[1].rms).toBeLessThan(0.000001);
});

test('real filters, compressor, gate and preamp clipping change rendered samples', async ({ page }) => {
  test.setTimeout(60000);
  const base = (await render(page))[0];
  const eq = (await render(page, { settings: { eq: -12, eqHz: 1000 } }))[0];
  expect(eq.rms / base.rms).toBeCloseTo(10 ** (-12 / 20), 2);
  const hpf = (await render(page, { frequency: 80, settings: { hpf: true, hpfHz: 400 } }))[0];
  expect(hpf.rms / base.rms).toBeLessThan(0.05);
  const bypass = (await render(page, { settings: { hpf: true, hpfHz: 500, eq: -12, compressor: true, gate: true, gateThreshold: 0, bypass: true } }))[0];
  expect(bypass.rms / base.rms).toBeCloseTo(1, 3);
  const gate = (await render(page, { kind: 'steps', settings: { gate: true, gateThreshold: -25 } }))[0];
  expect(gate.quiet).toBeLessThan(0.001); expect(gate.loud).toBeGreaterThan(0.05);
  const comp = (await render(page, { kind: 'steps', settings: { compressor: true, threshold: -36, ratio: 8 } }))[0];
  expect(comp.loud / comp.quiet).toBeLessThan(4);
  const clipped = (await render(page, { tap: 'post', settings: { gain: 60, sourceLevel: -24, fader: -12 } }))[0];
  expect(clipped.peak).toBeCloseTo(10 ** (-12 / 20), 3); expect(clipped.flat).toBeGreaterThan(0.8);
});

test('delay timing, feedback, return and reverb decay alter audible tails', async ({ page }) => {
  test.setTimeout(60000);
  const options = { kind: 'burst', tap: 'wet', settings: { fxType: 'delay', fxSend: 0, delayMs: 350, feedback: 50 } };
  const delay = (await render(page, options))[0];
  expect(delay.windows[0]).toBeLessThan(0.000001); expect(delay.windows[3]).toBeGreaterThan(0.02);
  expect(delay.windows[7] / delay.windows[3]).toBeCloseTo(0.5, 2);
  const noFeedback = (await render(page, { ...options, settings: { ...options.settings, feedback: 0 } }))[0];
  expect(noFeedback.windows[7]).toBeLessThan(0.000001);
  const noReturn = (await render(page, { ...options, settings: { ...options.settings, fxReturn: false } }))[0];
  expect(noReturn.peak).toBeLessThan(0.000001);
  const reverb = { kind: 'burst', tap: 'wet', settings: { fxType: 'reverb', fxSend: 0, decay: 0.3 } };
  const short = (await render(page, reverb))[0];
  const long = (await render(page, { ...reverb, settings: { ...reverb.settings, decay: 2 } }))[0];
  expect(short.windows[8]).toBeLessThan(0.000001); expect(long.windows[8]).toBeGreaterThan(0.0001);
});

test('listening volume, A/B and output ceiling are outside the mix', async ({ page }) => {
  test.setTimeout(60000);
  const normal = (await render(page, { tap: 'output', listening: { volume: 50 } }))[0];
  const quiet = (await render(page, { tap: 'output', listening: { volume: 25 } }))[0];
  expect(quiet.rms / normal.rms).toBeCloseTo(0.5, 3);
  const original = (await render(page, { tap: 'output', settings: { connected: false, fader: -60 }, listening: { original: true, volume: 50 } }))[0];
  expect(original.rms).toBeGreaterThan(0.02);
  expect(original.rms / normal.rms).toBeCloseTo(1, 3);
  const extreme = (await render(page, { tap: 'output', settings: { gain: 60, sourceLevel: -24, eq: 12, fxType: 'delay', fxSend: 0, feedback: 75, returnLevel: 6 }, listening: { volume: 100 } }))[0];
  expect(extreme.peak).toBeLessThanOrEqual(0.70001);
});
