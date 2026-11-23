import { expect, test } from '@playwright/test';

test('a shared studio link arms the right channel, waits for Play, and preserves it while navigating', async ({ page }) => {
  const requests = [];
  page.on('request', request => { if (request.url().endsWith('.mp3')) requests.push(request.url()); });
  await page.goto('/#signal?source=kick&mode=pro&node=processing');
  await expect(page.getByRole('button', { name:'Pro-modus', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('tab', { name:'PEQ', exact:true })).toHaveAttribute('aria-selected','true');
  const source = page.getByRole('button', { name:'Velg lydkilde og lyttepunkt' });
  await expect(source).toContainText('Kick');
  await expect(page.getByRole('dialog', { name:'Processing Strip', exact:true })).toHaveCount(0);
  await expect(page.getByRole('button', { name:'Spill lyd', exact:true })).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.getByRole('button', { name:'Spill lyd', exact:true }).click();
  await expect(source).toContainText('spiller');
  await expect(page.getByRole('button', { name:'Neste steg' })).toContainText('Fader');
  await page.getByRole('button', { name:'Neste steg' }).click();
  await expect(page.getByRole('slider', { name:'Kanalfader i signalveien', exact:true })).toBeVisible();
  await page.getByRole('button', { name:'Oversikt', exact:true }).click();
  await expect(page.getByRole('button', { name:/^4\./ })).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button', { name:/^3\./ }).click();
  await expect(source).toContainText('spiller');
  await page.getByRole('button', { name:'Stopp lyd', exact:true }).click();
  await expect(page.locator('.signal-output-strip output[aria-label="Main LR"]')).toHaveText('Stille');
  expect(requests.some(url => url.endsWith('/audio/kick.mp3'))).toBe(true);
});

test('invalid deep links fall back to the silent standard mixer', async ({ page }) => {
  await page.goto('/#signal?node=ukjent&source=ukjent&mode=ukjent');
  await expect(page.getByRole('button', { name:'Enkel modus', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button', { name:'Velg lydkilde og lyttepunkt' })).toContainText('Velg lyd');
  await expect(page.getByRole('slider', { name:'Kanalfader i signalveien', exact:true })).toBeVisible();
  await expect(page.getByRole('button', { name:'Stopp lyd', exact:true })).toHaveCount(0);
});

test('signal missions use a separate sketch and return to the previous mix without restarting audio', async ({ page }) => {
  await page.goto('/#signal?source=piano&mode=pro');
  await page.getByRole('slider', { name:'LF Gain', exact:true }).fill('-4');
  await page.getByRole('button', { name:'6 oppdrag', exact:true }).click();
  const missions = page.getByRole('dialog', { name:'Signaloppdrag' });
  await expect(missions.getByLabel('Velg signaloppdrag')).toBeVisible();
  await missions.getByRole('button', { name:'Til kontrollene' }).click();
  await expect(page.getByRole('button', { name:'Enkel modus', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button', { name:'Stopp lyd', exact:true })).toHaveCount(0);
  await page.getByRole('button', { name:'6 oppdrag', exact:true }).click();
  await missions.getByRole('button', { name:'Fortsett fri utforsking' }).click();
  await expect(page.getByRole('button', { name:'Pro-modus', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button', { name:'Velg lydkilde og lyttepunkt' })).toContainText('Piano');
  await expect(page.getByRole('button', { name:'Spill lyd', exact:true })).toBeVisible();
  await expect(page.getByRole('slider', { name:'LF Gain', exact:true })).toHaveValue('-4');
});

test('tool links open the relevant editor without loading audio or an EQ preset', async ({ page }) => {
  const recordings = [];
  page.on('request', request => { if (request.url().endsWith('.mp3')) recordings.push(request.url()); });
  await page.goto('/#signal?node=processing&source=kick&mode=pro&tool=lpf');
  await expect(page.getByRole('tab', { name:'Filter', exact:true })).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('button', { name:'Lavpass', exact:true })).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button', { name:/^Pro LPF/ })).toHaveAttribute('aria-pressed','false');
  await expect(page.getByRole('button', { name:'Spill lyd', exact:true })).toBeVisible();
  await page.goto('/#signal?source=snare&tool=gate');
  await expect(page.getByRole('tab', { name:'Gate', exact:true })).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('button', { name:'Pro Gate', exact:true })).toHaveAttribute('aria-pressed','false');
  for (const [tool, slider] of [['reverb','Klangtid'],['delay','Delaytid']]) {
    await page.goto(`/#signal?node=fx_branch&source=piano&mode=easy&tool=${tool}`);
    await expect(page.getByRole('tab', { name:'Klang/delay', exact:true })).toHaveAttribute('aria-selected','true');
    await expect(page.getByRole('slider', { name:slider, exact:true })).toBeVisible();
  }
  await page.goto('/#signal?node=processing&source=male&mode=pro&tool=does-not-exist');
  await expect(page.getByRole('tab', { name:'PEQ', exact:true })).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('slider', { name:'LF Gain', exact:true })).toHaveValue('0');
  expect(recordings).toHaveLength(0);
});
