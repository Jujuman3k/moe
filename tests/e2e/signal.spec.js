import { expect, test } from '@playwright/test';
import { signalJourney } from '../../src/data/signalJourney.js';
import { signalPathData } from '../../src/data/signalPathData.js';

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#signal');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Se det.');
});
test.afterEach(() => expect(errors).toEqual([]));
const output = (page, name) => page.locator(`.signal-output-strip output[aria-label="${name}"]`);
async function select(page, id) {
  const picker = page.getByLabel('Velg signalledd');
  if (await picker.isVisible()) await picker.selectOption(id);
  else await page.locator(`.signal-map-node[data-node="${id}"]`).click();
}

async function exposeControl(page, locator) {
  await locator.evaluate(element => {
    const preview = document.querySelector('.signal-preview').getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const top = innerWidth < 900 ? preview.height + 88 : 110;
    const bottom = innerHeight - (innerWidth < 768 ? 90 : 20);
    window.scrollBy({ top: rect.top - (top + bottom - rect.height) / 2, behavior: 'instant' });
  });
}

test('fader and visible map/wave stay together while levels respond immediately', async ({ page, isMobile }) => {
  const fader = page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true });
  await exposeControl(page, fader);
  await expect(fader).toBeInViewport({ ratio: 1 });
  const sliderBox = await fader.boundingBox();
  const waveBox = await page.locator('.signal-scope').boundingBox();
  const previewBox = await page.locator('.signal-preview').boundingBox();
  expect(waveBox.y).toBeGreaterThanOrEqual(79);
  expect(waveBox.y + waveBox.height).toBeLessThan(page.viewportSize().height - 70);
  if (page.viewportSize().width < 900) expect(sliderBox.y).toBeGreaterThanOrEqual(previewBox.y + previewBox.height);
  else expect(sliderBox.x).toBeGreaterThan(waveBox.x + waveBox.width);
  const original = await page.locator('[data-wave="after"]').getAttribute('d');
  await fader.fill('-12');
  await expect(output(page, 'Main LR')).toHaveText('-30 dBFS');
  await expect(output(page, 'Monitor')).toHaveText('-24 dBFS');
  await expect(page.locator('[data-wave="after"]')).not.toHaveAttribute('d', original);
  // Exercise the actual pointer target while the sticky preview is visible.
  if (isMobile) await page.touchscreen.tap(sliderBox.x + sliderBox.width * 0.7, sliderBox.y + sliderBox.height / 2);
  else await fader.click({ position: { x: sliderBox.width * 0.7, y: sliderBox.height / 2 } });
  await expect(fader).not.toHaveValue('-12');
  await fader.fill('-12');
  await select(page, 'monitor_branch');
  await page.getByRole('button', { name: 'Post-fade', exact: true }).click();
  await expect(output(page, 'Monitor')).toHaveText('-36 dBFS');
  await expect(fader).toHaveValue('-12');
});

test('all processing and distribution controls affect the shared signal path', async ({ page }) => {
  await select(page, 'processing');
  await page.getByRole('button', { name: 'Høypassfilter AV', exact: true }).click();
  await page.getByRole('slider', { name: 'HPF-frekvens' }).fill('220');
  await expect(output(page, 'Main LR')).toHaveText('-21 dBFS');
  await page.getByRole('button', { name: 'Gate', exact: true }).click();
  await page.getByRole('button', { name: 'Gate AV', exact: true }).click();
  await page.getByRole('slider', { name: 'Gate-terskel' }).fill('-12');
  await expect(output(page, 'Main LR')).toHaveText('Stille');
  await page.getByRole('button', { name: 'Bypass all processing AV', exact: true }).click();
  await expect(output(page, 'Main LR')).toHaveText('-18 dBFS');
  await page.getByRole('button', { name: 'Nullstill', exact: true }).click();
  await select(page, 'processing');
  await page.getByRole('button', { name: 'Comp', exact: true }).click();
  await page.getByRole('button', { name: 'Kompressor AV', exact: true }).click();
  await expect(page.getByText('4.5 dB', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'EQ', exact: true }).click();
  await page.getByRole('slider', { name: 'EQ ved testtonen' }).fill('-6');
  await expect(output(page, 'Main LR')).toHaveText('-24 dBFS');
  await select(page, 'matrix');
  await page.getByRole('slider', { name: 'Matrix til PA' }).fill('-12');
  await expect(output(page, 'PA')).toHaveText('-36 dBFS');
  await expect(output(page, 'Main LR')).toHaveText('-24 dBFS');
  await select(page, 'speakers');
  await page.getByRole('button', { name: 'PA-utgang aktiv PÅ', exact: true }).click();
  await expect(output(page, 'PA')).toHaveText('Stille');
  await select(page, 'input');
  await page.getByRole('button', { name: 'Inngang tilkoblet PÅ', exact: true }).click();
  await expect(page.locator('.signal-output-strip output')).toHaveText(['Stille', 'Stille', 'Stille']);
});

test('delay and reverb draw distinct tails and return remains separate from send', async ({ page }) => {
  await select(page, 'fx_branch');
  await page.getByRole('button', { name: 'Delay', exact: true }).click();
  const first = await page.locator('[data-wave="wet"]').getAttribute('d');
  await page.getByRole('slider', { name: 'Delaytid', exact: true }).fill('700');
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d', first);
  const shifted = await page.locator('[data-wave="wet"]').getAttribute('d');
  await page.getByRole('slider', { name: 'Feedback', exact: true }).fill('70');
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d', shifted);
  await page.getByRole('button', { name: 'Klang', exact: true }).click();
  const short = await page.locator('[data-wave="wet"]').getAttribute('d');
  await page.getByRole('slider', { name: 'Klangtid', exact: true }).fill('3');
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d', short);
  await page.getByRole('button', { name: 'FX-retur til Main PÅ', exact: true }).click();
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d', short);
  await expect(page.locator('[data-node="fx_branch"]')).toContainText('-30 dBFS');
  await expect(output(page, 'Main LR')).toHaveText('-18 dBFS');
  await page.getByRole('button', { name: 'FX-retur til Main AV', exact: true }).click();
  await select(page, 'mixbus');
  await page.getByRole('button', { name: 'Til Main LR PÅ', exact: true }).click();
  await expect(output(page, 'Main LR')).toHaveText('-30 dBFS');
});

test('all six practical missions still evaluate the controls and keep session progress', async ({ page }) => {
  test.setTimeout(60000);
  await page.getByRole('button', { name: '6 oppdrag', exact: true }).click();
  const solve = [
    () => page.getByRole('button', { name: 'Inngang tilkoblet AV', exact: true }).click(),
    () => page.getByRole('slider', { name: 'Preamp-gain', exact: true }).fill('30'),
    () => page.getByRole('button', { name: 'Pre-fade', exact: true }).click(),
    () => page.getByRole('button', { name: 'Kanal-mute PÅ', exact: true }).click(),
    () => page.getByRole('button', { name: 'Til Main LR AV', exact: true }).click(),
    () => page.getByRole('button', { name: 'FX-retur til Main AV', exact: true }).click(),
  ];
  for (let index = 0; index < solve.length; index++) {
    await expect(page.getByLabel('Velg signaloppdrag')).toHaveValue(String(index));
    await page.getByRole('button', { name: 'Sjekk løsningen', exact: true }).click();
    await expect(page.getByText('Ikke helt ennå. Følg signalet én gang til.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Vis hint', exact: true }).click();
    await solve[index]();
    await page.getByRole('button', { name: 'Sjekk løsningen', exact: true }).click();
    await expect(page.getByText('Løst! Du fant sammenhengen.', { exact: true })).toBeVisible();
    await expect(page.getByText(`Feilsøk med hendene · ${index + 1}/6 løst denne økten`, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Neste oppdrag', exact: true }).click();
  }
});

test('node journey, keyboard, pause, reduced motion and advanced-tool focus restoration', async ({ page }) => {
  await select(page, 'input');
  for (let step = 0; step < signalJourney.length; step++) {
    const item = signalPathData.find(node => node.id === signalJourney[step].id);
    await expect(page.getByRole('heading', { name: item.label, exact: true })).toBeVisible();
    await expect(page.locator(`[data-node="${item.id}"]`)).toHaveAttribute('data-active', 'true');
    if (step < signalJourney.length - 1) await page.getByRole('button', { name: 'Neste steg', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Fra starten', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Forrige steg', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Pause signalbevegelse' }).click();
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-play-state', 'paused');
  await select(page, 'preamp');
  const detail = page.getByRole('button', { name: 'Flere verktøy, teori og video →', exact: true });
  await detail.click();
  await page.keyboard.press('Escape');
  await expect(detail).toBeFocused();
  const gain = page.getByRole('slider', { name: 'Preamp-gain', exact: true });
  await gain.focus(); await page.keyboard.press('ArrowRight'); await expect(gain).toHaveValue('31');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-name', 'none');
});

test('compact layout and short-screen picker preserve access without overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const node of await page.locator('.signal-map-node').all()) {
      const box = await node.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  }
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(page.getByLabel('Velg signalledd')).toBeVisible();
  await page.getByLabel('Velg signalledd').selectOption('fx_branch');
  await page.getByRole('button', { name: 'Delay', exact: true }).click();
  const slider = page.getByRole('slider', { name: 'Delaytid', exact: true });
  await exposeControl(page, slider);
  const box = await slider.boundingBox();
  const preview = await page.locator('.signal-preview').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(preview.y + preview.height);
  expect(box.y + box.height).toBeLessThan(490);
  await slider.fill('500');
  await expect(page.locator('.scope-caption')).toContainText('500 ms');
});
