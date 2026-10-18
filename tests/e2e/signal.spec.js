import { expect, test } from '@playwright/test';
import { signalJourney } from '../../src/data/signalJourney.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/#signal');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Følg signalet');
});

const output = (page, name) => page.locator(`.signal-output-strip output[aria-label="${name}"]`);

test('live controls explain pre/post-fade, mute, routing and upstream clipping', async ({ page }) => {
  await page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true }).fill('-12');
  await expect(output(page, 'Main LR · tørr stemme')).toHaveText('-30 dBFS');
  await expect(output(page, 'Til monitor')).toHaveText('-24 dBFS');
  await expect(output(page, 'Til FX')).toHaveText('-42 dBFS');
  await page.getByRole('button', { name: 'Post-fade Etter faderen' }).click();
  await expect(output(page, 'Til monitor')).toHaveText('-36 dBFS');
  await expect(page.locator('[data-node="monitor_branch"]')).toContainText('POST');
  await page.getByRole('button', { name: 'Til Main LR PÅ', exact: true }).click();
  await expect(output(page, 'Main LR · tørr stemme')).toHaveText('Stille');
  await expect(output(page, 'Til FX')).toHaveText('-42 dBFS');
  await page.getByRole('button', { name: 'Nullstill', exact: true }).click();
  await page.getByRole('slider', { name: 'Preamp-gain', exact: true }).fill('54');
  await expect(page.getByText('Det klipper allerede i inngangen.', { exact: true })).toBeVisible();
  await page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true }).fill('-30');
  await expect(output(page, 'Main LR · tørr stemme')).toHaveText('-30 dBFS');
  await expect(page.getByText('Det klipper allerede i inngangen.', { exact: true })).toBeVisible();
  await page.getByRole('slider', { name: 'Preamp-gain', exact: true }).fill('30');
  await expect(page.getByText('Det klipper allerede i inngangen.', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Kanal-mute AV', exact: true }).click();
  await expect(page.locator('.signal-output-strip output')).toHaveText(['Stille', 'Stille', 'Stille']);
  await expect(page.locator('[data-node="preamp"]')).toContainText('-18 dBFS');
});

test('all six hands-on missions provide hints, evaluate changes and track the session', async ({ page }) => {
  test.setTimeout(60000);
  await page.getByRole('button', { name: '6 oppdrag', exact: true }).click();
  const solve = [
    () => page.getByRole('button', { name: 'Inngang tilkoblet AV', exact: true }).click(),
    () => page.getByRole('slider', { name: 'Preamp-gain', exact: true }).fill('30'),
    () => page.getByRole('button', { name: 'Pre-fade Før faderen', exact: true }).click(),
    () => page.getByRole('button', { name: 'Kanal-mute PÅ', exact: true }).click(),
    () => page.getByRole('button', { name: 'Til Main LR AV', exact: true }).click(),
    () => page.getByRole('button', { name: 'FX-retur til Main AV', exact: true }).click(),
  ];
  for (let index = 0; index < solve.length; index++) {
    await expect(page.getByLabel('Velg signaloppdrag')).toHaveValue(String(index));
    await page.getByRole('button', { name: 'Sjekk løsningen', exact: true }).click();
    await expect(page.getByText('Ikke helt ennå. Følg signalet én gang til.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Vis hint', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Skjul hint', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await solve[index]();
    await expect(page.getByText('Ikke helt ennå. Følg signalet én gang til.', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Sjekk løsningen', exact: true }).click();
    await expect(page.getByText('Løst! Du fant sammenhengen.', { exact: true })).toBeVisible();
    await expect(page.getByText(`${index + 1}/6 løst denne økten`, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Neste oppdrag', exact: true }).click();
  }
  await expect(page.getByLabel('Velg signaloppdrag')).toHaveValue('0');
  await page.getByLabel('Velg signaloppdrag').selectOption('4');
  await expect(page.getByRole('button', { name: 'Til Main LR AV', exact: true })).toBeVisible();
});

test('guided journey, motion pause, keyboard controls and detail focus restoration', async ({ page }) => {
  for (let step = 0; step < signalJourney.length; step++) {
    await expect(page.getByRole('heading', { name: signalJourney[step].title, exact: true })).toBeVisible();
    await expect(page.locator(`[data-node="${signalJourney[step].id}"]`)).toHaveAttribute('data-active', 'true');
    if (step < signalJourney.length - 1) await page.getByRole('button', { name: 'Neste steg', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Fra starten', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Forrige steg', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Pause signalbevegelse', exact: true }).click();
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-play-state', 'paused');
  const node = page.getByRole('button', { name: 'Preamp / Gain – åpne verktøy', exact: true });
  await node.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(node).toBeFocused();
  const gain = page.getByRole('slider', { name: 'Preamp-gain', exact: true });
  await gain.focus();
  await page.keyboard.press('ArrowRight');
  await expect(gain).toHaveValue('31');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-name', 'none');
});

test('map, controls and mission layout fit narrow screens with visible live feedback', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const node of await page.locator('.signal-map-node').all()) {
      const bounds = await node.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('slider', { name: 'Send til monitor', exact: true }).scrollIntoViewIfNeeded();
  const strip = await page.locator('.signal-output-strip').boundingBox();
  expect(strip.y).toBeGreaterThanOrEqual(79);
  expect(strip.y).toBeLessThan(100);
  await page.getByRole('button', { name: '6 oppdrag', exact: true }).click();
  await page.getByLabel('Velg signaloppdrag').selectOption('3');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Nullstill', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Kanal-mute PÅ', exact: true })).toBeVisible();
});
