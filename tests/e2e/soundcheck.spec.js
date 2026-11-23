import { expect, test } from '@playwright/test';
import { soundcheckSteps as steps } from '../../src/data/practice/soundcheck.js';

test('guided soundcheck remembers a paused round, shares catalogue progress, and opens a relevant vocal mixer', async ({ page }) => {
  await page.goto('/#practice');
  await page.getByRole('button', { name: 'Start lydsjekken' }).click();
  for (const [i, step] of steps.entries()) {
    await expect(page.getByRole('heading', { name: step.scenario.title, exact: true })).toBeFocused();
    const choices = page.getByRole('group', { name: 'Velg tiltak' }).getByRole('button');
    if (i === 1) {
      await choices.nth(step.scenario.options.findIndex(opt => !opt.correct)).click();
      await expect(page.getByRole('button', { name: 'Neste: Monitor' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Gi meg et hint' }).click();
      await page.getByRole('button', { name: 'Ta en pause' }).click();
      await expect(page.getByRole('progressbar', { name: 'Oppgaver løst' })).toHaveAttribute('aria-valuenow', '1');
      await page.reload();
      await page.getByRole('button', { name: 'Fortsett lydsjekken' }).click();
      await expect(page.getByText(step.scenario.hint, { exact: true })).toBeVisible();
      await expect(page.getByText(step.scenario.options.find(opt => !opt.correct).feedback)).toBeVisible();
    }
    await choices.nth(step.scenario.options.findIndex(opt => opt.correct)).click();
    await expect(page.getByRole('status')).toContainText('Godt vurdert!');
    await page.getByRole('button', { name: i === steps.length - 1 ? 'Se oppsummeringen' : `Neste: ${steps[i + 1].label}` }).click();
  }
  await expect(page.getByRole('heading', { name: 'Vokalen er klar.' })).toBeFocused();
  await expect(page.getByText('3 av 4 satt på første forsøk.', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prøv inngangsgain' })).toBeVisible();
  await page.getByRole('button', { name: 'Åpne vokalen i mikseren' }).click();
  await expect(page).toHaveURL(/#signal\?node=preamp&source=female&mode=easy/);
  await page.goto('/#practice?scenario=fx-return-muted');
  await expect(page.getByRole('heading', { name: steps[3].scenario.title })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Oppgaver løst' })).toHaveAttribute('aria-valuenow', '4');
});
