import { expect, test } from '@playwright/test';

const stop = (page, id) => page.locator(`.flow-stop[data-node="${id}"]`);
const edge = (page, id) => page.locator(`.flow-wire[data-edge="${id}"]`);
const trace = page => page.getByRole('combobox', { name: 'Fremhev signalvei' });

test('trace follows the real monitor tap, dry fader and independent FX return', async ({ page }) => {
  await page.goto('/#signal');
  const fader = page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true });
  await fader.fill('-60');
  await trace(page).selectOption('monitor');
  await expect(stop(page, 'fader')).toHaveAttribute('data-traced', 'false');
  await expect(edge(page, 'monitor')).toHaveAttribute('data-live', 'true');
  await expect(edge(page, 'dry')).toHaveAttribute('data-live', 'false');
  await stop(page, 'monitor_branch').click();
  await page.getByRole('button', { name: 'Post-fade', exact: true }).click();
  await expect(stop(page, 'fader')).toHaveAttribute('data-traced', 'true');
  await expect(edge(page, 'monitor')).toHaveAttribute('data-live', 'false');
  await stop(page, 'fader').click();
  await expect(fader).toHaveValue('-60');
  await fader.fill('-12');
  await trace(page).selectOption('fx');
  await stop(page, 'fx_branch').click();
  await expect(edge(page, 'send')).toHaveAttribute('data-live', 'true');
  await expect(edge(page, 'return')).toHaveAttribute('data-live', 'false');
  await page.getByRole('button', { name: 'Delay', exact: true }).click();
  await expect(edge(page, 'return')).toHaveAttribute('data-live', 'true');
  await expect(edge(page, 'return').locator('.signal-travelling-line')).toHaveCount(1);
  await expect(edge(page, 'dry')).toHaveAttribute('data-traced', 'false');
  await expect(edge(page, 'dry')).toHaveAttribute('data-live', 'true');
  await expect(stop(page, 'fader')).toContainText('-30 dBFS');
});

test('drilling inside a selected stop preserves the sound, control settings and route', async ({ page }) => {
  await page.goto('/#signal?source=guitar&mode=easy&node=fader');
  await page.getByRole('button', { name: 'Spill lyd', exact: true }).click();
  const playing = page.getByRole('button', { name: 'Stopp lyd', exact: true });
  await expect(playing).toBeVisible();
  await page.getByRole('slider', { name: 'Kanalfader i signalveien' }).fill('-9');
  await trace(page).selectOption('main');
  await stop(page, 'processing').click();
  await stop(page, 'processing').click();
  const details = page.getByRole('dialog', { name: 'Processing Strip', exact: true });
  await expect(details.getByRole('region', { name: 'Spor signalet inni leddet' })).toBeVisible();
  await details.getByRole('button', { name: 'Prøv i egen miks' }).click();
  await expect(details).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Gate', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(trace(page)).toHaveValue('main');
  await expect(playing).toBeVisible();
  await stop(page, 'fader').click();
  await expect(page.getByRole('slider', { name: 'Kanalfader i signalveien' })).toHaveValue('-9');
});

test('the C3500 shortcut opens the matching input and active processor', async ({ page }) => {
  await page.goto('/#signal?mode=pro&node=processing&source=female');
  await page.getByRole('tab', { name: 'Gate', exact: true }).click();
  await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
  await page.getByRole('dialog', { name: 'Lær: Processing Strip' }).getByRole('button', { name: 'Se inni Processing Strip', exact: true }).click();
  await page.getByRole('dialog', { name: 'Processing Strip', exact: true }).getByRole('button', { name: 'Lukk detaljer' }).click();
  await expect(page.getByRole('tab', { name: 'Gate', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Åpne C3500-pulten', exact: true }).click();
  await expect(page).toHaveURL(/#c3500\?ch=5&panel=gate$/);
});
