import { expect, test } from '@playwright/test';
import { signalPathData } from '../../src/data/signalPathData.js';

let browserErrors;
test.beforeEach(async ({ page }) => {
  browserErrors = [];
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()); });
  // Test our embed lifecycle independently of external video/network availability.
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><body>Test video embed</body></html>' }));
  await page.route('https://img.youtube.com/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#17233b"/></svg>' }));
});
test.afterEach(() => { expect(browserErrors).toEqual([]); });

const menu = page => page.getByRole('navigation', { name: 'Hovedmeny' }).isVisible().then(visible => page.getByRole('navigation', { name: visible ? 'Hovedmeny' : 'Mobilmeny' }));

test('navigation, pre/post lab and browser back', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Forstå signalet');
  const slider = page.getByRole('slider', { name: 'Kanalfader' });
  await slider.fill('-18');
  await expect(page.locator('output')).toHaveText(['-18 dB', '-18 dB']);
  await page.getByRole('button', { name: 'Pre-fade', exact: true }).click();
  await expect(page.locator('output')).toHaveText(['-18 dB', '0 dB']);
  await (await menu(page)).getByRole('button', { name: 'Videoer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Videoarkivet');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Forstå signalet');
});

test('search, favorite, completion and persistence', async ({ page }) => {
  await page.goto('/#videos');
  const search = page.getByRole('searchbox', { name: 'Søk i videoarkivet' });
  await search.fill(' dAnTe patching ');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Lagre favoritt: Del 6: Patching part 3' }).click();
  await page.getByRole('button', { name: 'Marker som sett: Del 6: Patching part 3' }).click();
  await page.reload();
  await page.getByLabel('Visningsfilter').selectOption('favorites');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Fjern favoritt: Del 6: Patching part 3' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('Visningsfilter').selectOption('completed');
  await expect(page.getByRole('article')).toHaveCount(1);
  await search.fill('No such video 123');
  await expect(page.getByText('Ingen videoer i dette utvalget')).toBeVisible();
  await page.getByRole('button', { name: 'Nullstill filtre' }).click();
  await expect(page.getByRole('article')).toHaveCount(92);
});

test('only one archive player and sequential course playback', async ({ page }) => {
  await page.goto('/#videos');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Spill av Del 1: Introduksjon', exact: true }).click();
  await expect(page.locator('iframe')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveAttribute('src', /q7BQkq6A5qc/);
  await page.getByRole('button', { name: 'Neste i serien' }).click();
  await expect(page.locator('iframe')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveAttribute('src', /Lgr2cALG_1w/);
  await page.getByRole('button', { name: 'Lukk video' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await (await menu(page)).getByRole('button', { name: 'Hjem', exact: true }).click();
  await page.getByRole('button', { name: 'Fortsett å lære', exact: true }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', /Lgr2cALG_1w/);
});

test('practice feedback, saved progress and relevant signal link', async ({ page }) => {
  await page.goto('/#practice');
  await page.getByLabel('Fagområde').selectOption('monitor');
  await page.getByRole('button', { name: 'A Øke preamp-gain' }).click();
  await expect(page.getByText('Prøv en annen tilnærming')).toBeVisible();
  await page.getByRole('button', { name: 'B Sjekke om monitor-senden er post-fade' }).click();
  await expect(page.getByText('Godt vurdert!')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await page.getByLabel('Fagområde').selectOption('monitor');
  await page.getByRole('button', { name: 'Utforsk i signalveien' }).click();
  await expect(page.getByRole('heading', { name: 'Aux Send (Monitor)', exact: true, level: 2 })).toBeVisible();
});

test('every signal node, processing tool and video tab remains reachable', async ({ page }) => {
  await page.goto('/#signal');
  for (const node of signalPathData) {
    await page.getByRole('button', { name: node.label, exact: false }).first().click();
    await expect(page.getByRole('heading', { name: node.label, exact: true, level: 2 })).toBeVisible();
    const panel = page.getByRole('region', { name: `Detaljer: ${node.label}` });
    if (node.id === 'preamp') {
      const knob = panel.getByRole('slider', { name: 'Input Gain' });
      await knob.focus();
      await page.keyboard.press('ArrowUp');
      await expect(knob).toHaveAttribute('aria-valuenow', '31');
    }
    if (node.subChain) {
      for (const step of node.subChain) {
        await panel.getByRole('button', { name: new RegExp(step.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
        await expect(panel.getByRole('button', { name: 'Tilbake', exact: true })).toBeVisible();
        if (step.viz === 'inserts') {
          // Visit all plugin cards so extracted secondary visualizers are rendered.
          const labels = ['1. Dyn8', '2. De-Esser', '3. Transient Controller', '4. Multiband Compressor', '5. Hypabass'];
          for (const label of labels) {
            await panel.getByRole('button', { name: new RegExp(label) }).click();
            await expect(panel.getByRole('button', { name: 'Tilbake', exact: true })).toHaveCount(2);
            await panel.getByRole('button', { name: 'Tilbake', exact: true }).last().click();
          }
        }
        await panel.getByRole('button', { name: 'Tilbake', exact: true }).first().click();
      }
    }
    const videoTab = panel.getByRole('button', { name: /^Video( \d+)?$/ });
    if (await videoTab.count()) {
      await videoTab.click();
      await expect(page.locator('iframe')).toHaveCount(1);
    }
    const dialog = page.getByRole('dialog');
    if (await dialog.count()) {
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    }
  }
});

test('invalid saved data and blocked storage keep the app usable', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('lydteam.learning.v1', '{invalid'));
  await page.goto('/#videos');
  await expect(page.getByRole('article')).toHaveCount(24);
  await page.evaluate(() => Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new Error('Storage blocked'); } }));
  await page.getByRole('button', { name: 'Lagre favoritt: Del 1: Introduksjon', exact: true }).click();
  await expect(page.getByText('Nettleseren tillater ikke lagring.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fjern favoritt: Del 1: Introduksjon', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('new pages fit mobile, tablet and desktop without page overflow', async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['home', 'videos', 'practice', 'signal']) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
});

test('touch navigation distinguishes vertical scroll, nested back and edge swipe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#signal?node=processing');
  const dialog = page.getByRole('dialog');
  const swipe = (locator, dx, dy) => locator.evaluate((element, delta) => {
    const touch = (x, y) => new Touch({ identifier: 1, target: element, clientX: x, clientY: y });
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, targetTouches: [touch(0, 100)] }));
    element.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, targetTouches: [touch(delta.dx, 100 + delta.dy)] }));
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, targetTouches: [] }));
  }, { dx, dy });
  const heading = dialog.getByRole('heading', { level: 2 });
  await swipe(heading, 80, 240);
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /Filters/ }).click();
  // Gestures on inputs must never trigger navigation.
  await swipe(dialog.locator('input[type="range"]').first(), 120, 0);
  await expect(dialog.getByRole('button', { name: 'Tilbake', exact: true })).toBeVisible();
  const subPanel = dialog.getByRole('button', { name: 'Tilbake', exact: true }).locator('..').locator('..');
  await swipe(subPanel, 120, 0);
  await expect(dialog.getByRole('button', { name: /Filters/ })).toBeVisible();
  await expect(dialog).toBeVisible();
  await swipe(heading, 120, 0);
  await expect(dialog).toHaveCount(0);
});
