import { expect, test } from '@playwright/test';
import { proPages, proPanels } from '../../src/data/proAudioSettings.js';

test.describe.configure({ timeout: 90000 });
let errors;
test.beforeEach(async ({ page }) => {
  errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#signal');
  await expect(page.getByRole('button', { name: 'Enkel modus', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
test.afterEach(() => expect(errors).toEqual([]));
async function source(page, label) {
  await page.getByRole('button', { name: 'Velg lydkilde og lyttepunkt' }).click();
  await page.getByRole('group', { name: 'Lydkilder' }).getByRole('button', { name: new RegExp('^' + label) }).click();
  const resume = page.getByRole('button', { name: /^(Spill og miks|Tilbake til miksen)$/ });
  await expect(resume).toBeEnabled(); await resume.click();
  await expect(page.getByRole('dialog', { name: 'Lydvalg' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Stopp lyd', exact: true })).toBeVisible();
}

test('Pro has draggable EQ, real playback and independent settings in each mode', async ({ page, isMobile }) => {
  await source(page, 'Piano');
  await page.getByRole('button', { name: 'Pro-modus', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'PEQ', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('group', { name: 'EQ-bånd' }).getByRole('button', { name: /^HM/ }).click();
  const handle = page.getByRole('button', { name: /^HM EQ-punkt/ });
  const before = await page.locator('[data-pro-curve="eq"]').getAttribute('d');
  const box = await handle.boundingBox();
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  if (isMobile) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x + 20, y: point.y - 15 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  } else {
    await page.mouse.move(point.x, point.y); await page.mouse.down(); await page.mouse.move(point.x + 40, point.y - 20, { steps: 5 }); await page.mouse.up();
  }
  await expect(page.locator('[data-pro-curve="eq"]')).not.toHaveAttribute('d', before);
  await page.getByRole('slider', { name: 'HM Gain', exact: true }).fill('-4');
  await handle.focus(); await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('slider', { name: 'HM Gain', exact: true })).toHaveValue('-3.5');
  await page.getByRole('button', { name: 'Bredde / type', exact: true }).click();
  await page.getByRole('slider', { name: 'HM Width', exact: true }).fill('0.25');
  await page.getByRole('button', { name: 'Enkel modus', exact: true }).click();
  await page.getByRole('tab', { name: 'EQ', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'EQ-gain' })).toHaveValue('0');
  await page.getByRole('slider', { name: 'EQ-gain' }).fill('-6');
  await page.getByRole('button', { name: 'Pro-modus', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'HM Width', exact: true })).toHaveValue('0.25');
  await page.getByRole('button', { name: 'Frekvens / gain', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'HM Gain', exact: true })).toHaveValue('-3.5');
  await expect.poll(() => page.locator('.signal-output-strip output[aria-label="Main LR"]').textContent()).not.toBe('Stille');
  await page.getByRole('button', { name: 'Enkel modus', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'EQ-gain' })).toHaveValue('-6');
});

test('Pro source recommendations explain changes, apply only their section and can be undone', async ({ page }) => {
  await source(page, 'Kick');
  await page.getByRole('button', { name: 'Pro-modus', exact: true }).click();
  await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
  await expect(page.getByRole('heading', { name: 'Startforslag · Kick' })).toBeVisible();
  await page.getByRole('button', { name: 'Prøv forslag for PEQ' }).click();
  await expect(page.getByRole('slider', { name: 'LF Gain' })).toHaveValue('3');
  await page.getByRole('button', { name: 'Angre startforslag' }).click();
  await expect(page.getByRole('slider', { name: 'LF Gain' })).toHaveValue('0');
  await page.getByRole('tab', { name: 'Gate', exact: true }).click();
  await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
  await page.getByRole('button', { name: 'Prøv forslag for gate' }).click();
  await expect(page.getByRole('button', { name: 'Pro Gate', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('slider', { name: 'Gate Depth' })).toHaveValue('25');
  for (const label of ['Mannsvokal', 'Kvinnevokal']) {
    await source(page, label);
    await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
    await expect(page.getByRole('heading', { name: 'Startforslag · ' + label })).toBeVisible();
    await page.getByRole('button', { name: 'Prøv forslag for gate' }).click();
    await expect(page.getByRole('button', { name: 'Pro Gate', exact: true })).toHaveAttribute('aria-pressed', 'false');
  }
  await page.getByRole('tab', { name: 'Comp', exact: true }).click();
  await page.getByRole('button', { name: 'Lær om valgt ledd' }).click();
  await page.getByRole('button', { name: 'Prøv forslag for kompressor' }).click();
  await expect(page.getByRole('slider', { name: 'Comp Ratio' })).toHaveValue('2.5');
  await page.getByRole('button', { name: 'Tider', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'Comp Attack' })).toHaveValue('20');
  await page.getByRole('button', { name: 'Sammenlign med original' }).click();
  await expect(page.getByRole('button', { name: 'Sammenlign med original' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Stopp lyd', exact: true }).click();
  await expect(page.locator('.signal-output-strip output[aria-label="Main LR"]')).toHaveText('Stille');
});

test('all Pro parameter groups fit small phone, portrait, tablet and landscape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'This test explicitly resizes through all target viewports.');
  test.setTimeout(180000);
  await page.getByRole('button', { name: 'Åpne mikser i fullskjerm', exact: true }).click();
  await page.getByRole('button', { name: 'Pro-modus', exact: true }).click();
  for (const [width, height] of [[320,568], [390,664], [768,1024], [844,390]]) {
    await page.setViewportSize({ width, height });
    for (const [panel, label] of proPanels) {
      await page.getByRole('tab', { name: label, exact: true }).click();
      const groups = proPages[panel].length ? proPages[panel] : [[null, null]];
      for (const [, group] of groups) {
        if (group) await page.getByRole('group', { name: 'Parametergruppe' }).getByRole('button', { name: group, exact: true }).click();
        expect(await page.locator('.pro-panel-body').evaluate(el => el.scrollHeight <= el.clientHeight + 1), `${width}/${panel}/${group}`).toBe(true);
        await expect(page.locator('.pro-graph')).toBeInViewport({ ratio: 1 });
        for (const control of await page.locator('.pro-panel-body :is(input,button,select)').all()) await expect(control).toBeInViewport({ ratio: 1 });
      }
    }
    await page.getByRole('button', { name: 'Forrige steg', exact: true }).click();
    expect(await page.locator('.pro-panel-body').evaluate(el => el.scrollHeight <= el.clientHeight + 1), `${width}/preamp`).toBe(true);
    expect(await page.locator('.signal-preview').evaluate(el => el.scrollHeight <= el.clientHeight + 1), `${width}/preamp preview`).toBe(true);
    await page.locator('[data-node="processing"]').click();
  }
});
