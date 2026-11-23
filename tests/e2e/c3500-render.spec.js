import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createProSettings } from '../../src/data/proAudioSettings.js';

test.describe.configure({ timeout: 60000 });
test.beforeEach(async ({ page }) => {
  await page.route('**/__c3500_test/**', async route => {
    const root = path.resolve('src');
    const file = path.resolve(root, new URL(route.request().url()).pathname.slice('/__c3500_test/'.length));
    if (!file.startsWith(root + path.sep)) return route.abort();
    await route.fulfill({ contentType: 'text/javascript', body: await readFile(file, 'utf8') });
  });
  await page.goto('/');
});

const strip = (id, pan) => ({ id, sourceId: 'kick', gain: 28, pro: createProSettings(), fader: 0, pan, mute: false, pafl: false });

async function render(page, { first = {}, second = {}, master = 0, frequency = 1000, monitor = false } = {}) {
  // Two independent strips share the same real-time source socket. Measuring one
  // on each side catches accidental coupling and distinguishes PAFL from Main.
  const channels = [{...strip(1,-100),...first},{...strip(24,100),...second}];
  return page.evaluate(async ({ channels, master, frequency, monitor }) => {
    const { createC3500Graph } = await import('/__c3500_test/audio/c3500Graph.js');
    const rate = 24000;
    const ctx = new OfflineAudioContext(2, rate / 2, rate);
    const worklet = await (await fetch('/__c3500_test/audio/proDynamics.worklet.js')).text();
    const url = URL.createObjectURL(new Blob([worklet], { type: 'text/javascript' }));
    try { await ctx.audioWorklet.addModule(url); } finally { URL.revokeObjectURL(url); }
    const graph = createC3500Graph(ctx, {channels, masterDb:master});
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    gain.gain.value = .12; oscillator.frequency.value = frequency;
    oscillator.connect(gain).connect(graph.socket('kick'));
    (monitor ? graph.output : graph.mainOutput).connect(ctx.destination);
    oscillator.start(); const result = await ctx.startRendering();
    const rms = [0, 1].map(ch => {
      const samples = result.getChannelData(ch).subarray(rate * .3);
      let power = 0; for (const sample of samples) power += sample * sample;
      return Math.sqrt(power / samples.length);
    });
    graph.dispose(); return rms;
  }, { channels, master, frequency, monitor });
}

test('independent fader and pan; pre-fader headphone audition leaves stereo Main intact', async ({page}) => {
  const [l,r] = await render(page);
  expect(l).toBeCloseTo(.12 / Math.SQRT2, 3); expect(r).toBeCloseTo(l, 4);
  const down = await render(page,{first:{fader:-12},master:-6});
  expect(down[0]/l).toBeCloseTo(10**(-18/20),3); expect(down[1]/r).toBeCloseTo(10**(-6/20),3);
  const first = {fader:-60, mute:true, pafl:true};
  const main = await render(page,{first});
  expect(main[0]).toBeLessThan(1e-6); expect(main[1]).toBeCloseTo(r, 4);
  const phones = await render(page,{first,master:-60,monitor:true});
  expect(phones[0]).toBeCloseTo(l*Math.SQRT1_2,3); expect(phones[1]).toBeCloseTo(phones[0],4);
});

test('preamp, trim, HPF, EQ, gate and compressor alter only their own rendered channel', async ({page}) => {
  const base = (await render(page))[1];
  const assertLeft = async (pro, ratio, tolerance=.012, extra={}) => {
    const [left,right] = await render(page,{first:{pro,...extra}});
    expect(right).toBeCloseTo(base,3);
    expect(Math.abs(left/right-ratio)).toBeLessThan(tolerance);
  };
  const trim = createProSettings(); trim.trim = -6;
  await assertLeft(trim,10**(-6/20));
  await assertLeft(trim,1,.012,{gain:34}); // preamp +6 offsets digital trim -6
  const eq = createProSettings(); Object.assign(eq.eq.bands[1],{frequency:1000,gain:-12});
  await assertLeft(eq,10**(-12/20));
  const gate = createProSettings(); Object.assign(gate.gate,{enabled:true,threshold:-6,depth:36,hold:5,release:10});
  await assertLeft(gate,10**(-36/20),.005);
  const comp = createProSettings(); Object.assign(comp.comp,{enabled:true,threshold:-36,ratio:8,knee:0,attack:1,release:80});
  const compressed = await render(page,{first:{pro:comp}});
  expect(compressed[0]/compressed[1]).toBeLessThan(.25); expect(compressed[0]/compressed[1]).toBeGreaterThan(.14);
  const hpf = createProSettings(); Object.assign(hpf.filters,{hpf:true,hpfHz:600,slope:24});
  const cut = await render(page,{first:{pro:hpf},frequency:100});
  expect(cut[0]/cut[1]).toBeLessThan(.005);
});
