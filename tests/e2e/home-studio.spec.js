import { expect, test } from '@playwright/test';

test('Home previews the selected recording, stops it on change, and arms the Pro mixer', async ({ page }) => {
  await page.goto('/');
  const source = page.getByLabel('Velg lyd til mikseren', { exact:true });
  await source.selectOption('piano');
  const clip = page.locator('.studio-clip audio');
  await expect(clip).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name:'Lytt til klippet', exact:true }).click();
  await expect(page.getByText('Spiller original', { exact:true })).toBeVisible();
  await expect.poll(() => clip.evaluate(audio => audio.currentTime)).toBeGreaterThan(0);
  const firstRecording = await clip.elementHandle();
  await source.selectOption('bass');
  // Verify the previous player actually stopped, not just that its UI vanished.
  await expect.poll(() => firstRecording.evaluate(audio => audio.paused)).toBe(true);
  await firstRecording.dispose();
  await expect(clip).toHaveAttribute('src', '/audio/bass.mp3');
  await expect(clip).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name:'Åpne Pro-mikseren', exact:true }).click();
  await expect(page.getByRole('button', { name:'Pro-modus', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button', { name:'Velg lydkilde og lyttepunkt' })).toContainText('Bass');
  await expect(page.getByRole('button', { name:'Spill lyd', exact:true })).toBeVisible();
});

test('navigating from a playing preview to the ear test leaves both silent', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Velg lyd til mikseren', { exact:true }).selectOption('guitar');
  await page.getByRole('button', { name:'Lytt til klippet', exact:true }).click();
  await expect(page.getByText('Spiller original', { exact:true })).toBeVisible();
  const recording = await page.locator('.studio-clip audio').elementHandle();
  await page.getByRole('button', { name:'Ta en lyttetest', exact:true }).click();
  await expect(page.getByRole('heading', { level:1, name:'Lyttetest', exact:true })).toBeVisible();
  await expect.poll(() => recording.evaluate(audio => audio.paused)).toBe(true);
  await recording.dispose();
  const player = page.getByRole('region', { name:'Lytt til A og B' });
  await expect(player.getByRole('status')).toHaveText('Klar til lytting');
  await expect(player.getByRole('button', { name:'Stopp lyd', exact:true })).toBeDisabled();
});

test('a session choice opens the requested band mix and each waveform opens the matching solo channel', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width:320, height:640 });
  await page.goto('/');
  const picker = page.getByRole('group', { name:'Velg økt i Bandrommet' });
  await expect(picker.getByRole('button', { name:'Rytme', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('heading', { name:'Kick og bass', exact:true })).toBeVisible();
  await picker.getByRole('button', { name:'Duett', exact:true }).click();
  await expect(page.getByRole('heading', { name:'To stemmer', exact:true })).toBeVisible();
  if (isMobile) {
    const fitting = await page.locator('.studio-home').evaluate(home => {
      const viewport = document.documentElement.clientWidth;
      return document.documentElement.scrollWidth <= viewport + 1 && Array.from(home.querySelectorAll('button,select')).every(control => {
        const box = control.getBoundingClientRect();
        return !box.width || (box.left >= 0 && box.right <= viewport + 1);
      });
    });
    expect(fitting, 'Home controls should fit a 320px portrait phone').toBe(true);
  }
  await page.getByRole('button', { name:'Utforsk kvinnevokal alene', exact:true }).click();
  const source = page.getByLabel('Velg lyd til mikseren', { exact:true });
  await expect(source).toBeFocused();
  await expect(source).toHaveValue('female');
  await expect(page.locator('.studio-clip audio')).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name:'Åpne Bandrommet', exact:true }).click();
  await expect(page).toHaveURL(/#bandroom\?scene=duett$/);
  await expect(page.getByRole('heading', { level:1, name:'Bandrommet', exact:true })).toBeVisible();
});
