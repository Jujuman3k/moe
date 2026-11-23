import { expect, test } from '@playwright/test';

test('four reference crops load on demand; a photo hotspot opens the live processor on the same channel', async ({ page }) => {
  const loaded = [];
  page.on('request', request => { if (/\/references\/[^/]+\.webp$/.test(request.url())) loaded.push(request.url()); });
  await page.goto('/#c3500?ch=2&panel=bank');
  const opener = page.getByRole('button', { name: 'Bildereferanser', exact: true });
  await expect(opener).toBeVisible();
  expect(loaded).toHaveLength(0);
  await opener.click();
  const guide = page.getByRole('dialog', { name: 'Bildereferanser' });
  const tabs = guide.getByRole('group', { name: 'Velg referansebilde' });
  for (const [tab, width] of [['Bank', 1290], ['Preamp', 763], ['EQ-bånd', 961], ['Oversikt', 908]]) {
    await tabs.getByRole('button', { name: new RegExp(tab) }).click();
    await expect.poll(() => guide.getByRole('img').evaluate(img => img.naturalWidth)).toBe(width);
  }
  const button = guide.getByRole('button', { name: 'Bildepunkt 2: Gatekurve' });
  await button.focus();
  await button.press('Enter');
  await expect(guide.getByRole('heading', { name: 'Gatekurve' })).toBeVisible();
  await guide.getByRole('button', { name: 'Åpne gate i mikseren' }).click();
  await expect(guide).toHaveCount(0);
  await expect(page).toHaveURL(/#c3500\?ch=2&panel=gate/);
  await expect(page.getByRole('navigation', { name: 'Touchskjerm' }).getByRole('button', { name: 'Gate', exact: true })).toHaveAttribute('aria-current', 'page');
  expect(new Set(loaded).size).toBe(4);
  await opener.click();
  await tabs.getByRole('button', { name: /EQ-bånd/ }).click();
  await guide.getByRole('button', { name: 'Bildepunkt 3: HF · diskant' }).click();
  await guide.getByRole('button', { name: 'Åpne PEQ i mikseren' }).click();
  await expect(page.getByRole('button', { name: 'Rediger HF på IP 2' })).toHaveAttribute('aria-pressed', 'true');
  await opener.click();
  await page.keyboard.press('Escape');
  await expect(guide).toHaveCount(0);
  await expect(opener).toBeFocused();
});
