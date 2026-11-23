import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Exercise the exact production graph, including its final stereo sample guard.
test('Bandrom renders separate channels, dB changes, solo/mute, pan and bounded peaks', async ({page}) => {
  await page.route('**/__band_graph_module__.js', async route => {
    await route.fulfill({ contentType: 'text/javascript', body: await readFile('src/audio/bandRoomGraph.js', 'utf8') });
  });
  await page.goto('/');
  const metrics = await page.evaluate(async () => {
    const {createBandRoomGraph} = await import('/__band_graph_module__.js');
    const sr = 24000, length = 12000;
    async function render(changes = {}, masterDb = 0, sourceLevel = .12) {
      const ctx = new OfflineAudioContext(2, length, sr);
      const channels = ['bass','piano'].map((id,i) => ({ id, gainDb:0, pan:i ? 1 : -1, ...changes[id] }));
      const g = createBandRoomGraph(ctx, {channels, masterDb}); g.output.connect(ctx.destination);
      for (const [i, ch] of channels.entries()) {
        const source = ctx.createBufferSource();
        const b = ctx.createBuffer(1, length, sr);
        const d = b.getChannelData(0);
        for (let n = 0; n < length; n++) d[n] = sourceLevel * Math.sin(2*Math.PI*(i ? 400 : 200)*n/sr);
        source.buffer = b; source.connect(g.inputs.get(ch.id)); source.start();
      }
      const result = await ctx.startRendering(); g.dispose();
      return Array.from({length:2}, (_,i) => {
        const data = result.getChannelData(i).subarray(sr/4);
        let sum = 0, peak = 0, component200 = 0, component400 = 0;
        data.forEach((x,n) => {
          sum += x*x; peak = Math.max(peak,Math.abs(x));
          component200 += x*Math.sin(2*Math.PI*200*n/sr);
          component400 += x*Math.sin(2*Math.PI*400*n/sr);
        });
        return {rms:Math.sqrt(sum/data.length), peak, hz200:2*component200/data.length, hz400:2*component400/data.length};
      });
    }
    return {
      base:await render(), down:await render({bass:{gainDb:-12}}), trim:await render({},-6),
      solo:await render({piano:{solo:true}}), muteSolo:await render({piano:{solo:true,mute:true}}),
      loud:await render({bass:{gainDb:6,pan:0},piano:{gainDb:6,pan:0}},6,.9),
    };
  });
  expect(metrics.base[0].hz200).toBeCloseTo(.12,3);
  expect(metrics.base[1].hz400).toBeCloseTo(.12,3);
  expect(Math.abs(metrics.base[0].hz400)).toBeLessThan(.00001);
  expect(Math.abs(metrics.base[1].hz200)).toBeLessThan(.00001);
  expect(metrics.down[0].rms / metrics.base[0].rms).toBeCloseTo(10**(-12/20),3);
  expect(metrics.down[1].rms).toBeCloseTo(metrics.base[1].rms,4);
  expect(metrics.trim[1].rms / metrics.base[1].rms).toBeCloseTo(10**(-6/20),3);
  expect(metrics.solo[1].rms).toBeCloseTo(metrics.base[1].rms,4);
  expect(metrics.solo[0].peak).toBeLessThan(.000001);
  expect(metrics.muteSolo.map(ch=>ch.peak)).toEqual([0,0]);
  for (const ch of metrics.loud) { expect(ch.peak).toBeGreaterThan(.8); expect(ch.peak).toBeLessThanOrEqual(.951); }
});
