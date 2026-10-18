import { expect, test } from '@playwright/test';
import { audioSources } from '../../src/data/audioSources.js';
import { signalPanels } from '../../src/data/signalPanels.js';

test.describe.configure({ timeout: 90000 });
let errors;
test.beforeEach(async ({ page }) => {
  errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#signal');
  await expect(page.locator('.signal-lab')).toBeVisible();
});
test.afterEach(() => expect(errors).toEqual([]));
const picker = page => page.getByRole('button', { name: 'Velg lydkilde og lyttepunkt', exact: true }).click();
const node = (page, id) => page.locator(`[data-node="${id}"]`).click();
const meter = (page, name) => page.locator(`.signal-output-strip output[aria-label="${name}"]`);
async function start(page, label = 'Piano') {
  await picker(page);
  await page.getByRole('group', { name: 'Lydkilder' }).getByRole('button', { name: new RegExp('^' + label) }).click();
  await page.getByRole('button', { name: 'Spill og miks', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Lydvalg', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Stopp lyd', exact: true })).toBeVisible();
}

test('all seven bundled recordings decode and play through the production audio engine', async ({ page }) => {
  test.setTimeout(90000);
  for (const source of audioSources) {
    await start(page, source.label);
    await expect.poll(() => meter(page, 'Main LR').textContent()).not.toBe('Stille');
    await expect(page.locator('[data-audio-wave="after"]')).not.toHaveAttribute('d', 'M0,50 H640');
    await page.getByRole('button', { name: 'Stopp lyd', exact: true }).click();
    await expect(meter(page, 'Main LR')).toHaveText('Stille');
  }
});

test('heard routes, A/B, source changes and source-specific lessons preserve the mix', async ({ page }) => {
  test.setTimeout(90000);
  await start(page);
  await page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true }).fill('-60');
  await expect(meter(page, 'Main LR')).toHaveText('Stille');
  await expect.poll(() => meter(page, 'Monitor').textContent()).not.toBe('Stille');
  await page.getByRole('button', { name: 'Sammenlign med original' }).click();
  await expect(page.getByRole('button', { name: 'Sammenlign med original' })).toHaveAttribute('aria-pressed', 'true');
  await picker(page);
  await page.getByLabel('Lytt til', { exact: true }).selectOption('monitor');
  await page.getByRole('group', { name: 'Lydkilder' }).getByRole('button', { name: /^Bass/ }).click();
  await expect(page.getByRole('button', { name: 'Tilbake til miksen' })).toBeEnabled();
  await page.getByRole('button', { name: 'Tilbake til miksen' }).click();
  await expect(page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true })).toHaveValue('-60');
  await expect(page.getByRole('button', { name: 'Velg lydkilde og lyttepunkt' })).toContainText('Monitor');
  await node(page, 'monitor_branch');
  await page.getByRole('button', { name: 'Post-fade', exact: true }).click();
  await expect(meter(page, 'Monitor')).toHaveText('Stille');
  await node(page, 'processing');
  await page.getByRole('tab', { name: 'EQ', exact: true }).click();
  await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
  await expect(page.getByRole('heading', { name: 'Lytt etter · Bass' })).toBeVisible();
  await page.getByRole('button', { name: 'Prøv −4 dB ved 120 Hz' }).click();
  await expect(page.getByRole('slider', { name: 'EQ-frekvens' })).toHaveValue('120');
  await expect(page.getByRole('slider', { name: 'EQ-gain' })).toHaveValue('-4');
  await picker(page);
  await page.getByRole('button', { name: 'Tilbake til lydløs bølgeskisse' }).click();
  await expect(page.getByRole('button', { name: 'Stopp lyd', exact: true })).toHaveCount(0);
  await expect(page.locator('[data-wave="after"]')).toBeVisible();
});

test('audio panels and transport fit small phones and landscape without scrolling', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 568 });
  const enter = page.getByRole('button', { name: 'Åpne mikser i fullskjerm', exact: true });
  if (await enter.isVisible()) await enter.click();
  await start(page, 'Kvinnevokal');
  for (const [width, height] of [[320,568], [390,664], [844,390]]) {
    await page.setViewportSize({ width, height });
    for (const [id, panels] of Object.entries(signalPanels)) {
      await node(page, id);
      if (id === 'fx_branch') { await page.getByRole('tab', { name: 'Effekt', exact: true }).click(); await page.getByRole('button', { name: 'Delay', exact: true }).click(); }
      for (const [, label] of panels) {
        await page.getByRole('tab', { name: label, exact: true }).click();
        expect(await page.locator('.signal-panel-body').evaluate(element => element.scrollHeight <= element.clientHeight + 1), `${width}/${id}/${label}`).toBe(true);
        for (const control of await page.locator('.signal-panel-body input, .signal-panel-body button, .signal-focus-toolbar button').all()) await expect(control).toBeInViewport({ ratio: 1 });
      }
    }
    await expect(page.locator('.signal-audio-scope')).toBeInViewport({ ratio: 1 });
  }
});

test('loading can be cancelled, failed downloads recover and route changes close audio', async ({ page }) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    const Context = window.AudioContext;
    window.__audioContexts = [];
    window.AudioContext = class extends Context { constructor(...args) { super(...args); window.__audioContexts.push(this); } };
  });
  await page.reload();
  await page.route('**/audio/male.mp3', route => route.fulfill({ status: 404, body: 'missing' }));
  await picker(page);
  await page.getByRole('group', { name: 'Lydkilder' }).getByRole('button', { name: /^Mannsvokal/ }).click();
  await page.getByRole('button', { name: 'Spill og miks' }).click();
  await expect(page.getByRole('alert')).toContainText('Kunne ikke starte lyd');
  await page.unroute('**/audio/male.mp3');
  let release;
  const blocked = new Promise(resolve => { release = resolve; });
  await page.route('**/audio/male.mp3', async route => { await blocked; await route.continue().catch(() => {}); });
  await page.getByRole('button', { name: 'Spill og miks' }).click();
  await page.getByRole('dialog', { name: 'Lydvalg' }).getByRole('button', { name: 'Stopp lyd' }).click();
  release(); await page.unroute('**/audio/male.mp3');
  await page.getByRole('button', { name: 'Spill og miks' }).click();
  await expect(page.getByRole('dialog', { name: 'Lydvalg' })).toHaveCount(0);
  await expect.poll(() => meter(page, 'Main LR').textContent()).not.toBe('Stille');
  await page.evaluate(() => { location.hash = 'videos'; });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__audioContexts.every(context => context.state === 'closed'))).toBe(true);
});
