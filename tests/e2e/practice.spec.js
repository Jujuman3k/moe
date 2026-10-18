import { expect, test } from '@playwright/test';
import { practiceScenarios } from '../../src/data/practiceScenarios.js';
import { practiceTopics } from '../../src/data/practiceCatalog.js';

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#practice');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Små valg. Bedre lyd.');
  const filters = page.getByRole('button', { name: 'Flere filtre' });
  if (await filters.isVisible()) await filters.click();
});
test.afterEach(() => { expect(errors).toEqual([]); });

test('topic, level, search and completion filters work together with an empty state', async ({ page }) => {
  await page.getByLabel('Fagområde').selectOption('recording');
  await expect(page.getByRole('status')).toContainText('6 scenarioer');
  await page.getByLabel('Vanskelighetsgrad').selectOption('2');
  await page.getByRole('searchbox', { name: 'Søk i scenarioer' }).fill(' dAnTe tomt ');
  await expect(page.getByRole('status')).toContainText('1 scenario i utvalget');
  await expect(page.locator('#scenario-heading')).toHaveText('Dante er tilkoblet, men sporet er tomt');
  await expect(page.getByRole('button', { name: 'Tilfeldig oppgave' })).toBeDisabled();
  await page.getByLabel('Oppgavestatus').selectOption('solved');
  await expect(page.getByRole('heading', { name: 'Ingen scenarioer i dette utvalget' })).toBeVisible();
  await page.getByRole('button', { name: 'Vis alle scenarioer' }).click();
  await expect(page.getByRole('status')).toContainText('72 scenarioer');
  await expect(page.getByLabel('Fagområde')).toHaveValue('all');
});

test('solving the last unsolved result preserves its explanation and stored completion', async ({ page }) => {
  await page.getByLabel('Fagområde').selectOption('gain');
  await page.getByRole('searchbox', { name: 'Søk i scenarioer' }).fill('trim skjuler');
  await page.getByLabel('Oppgavestatus').selectOption('unsolved');
  const correct = page.getByRole('button', { name: 'C Preamp-nivået må fortsatt reduseres' });
  await page.getByRole('button', { name: 'Vis et hint' }).click();
  await expect(page.getByText('Hint:', { exact: false })).toBeVisible();
  await correct.click();
  await expect(page.getByText('Godt vurdert!')).toBeVisible();
  await expect(page.getByText('Ta med deg', { exact: true })).toBeVisible();
  await expect(page.getByText('Alle oppgavene i dette utvalget er løst!')).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Oppgaver løst' })).toHaveAttribute('aria-valuenow', '1');
  await page.getByRole('button', { name: 'Prøv på nytt' }).click();
  await expect(page.getByText('Godt vurdert!')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Vis et hint' })).toBeVisible();
  await correct.click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Små valg. Bedre lyd.');
  const filters = page.getByRole('button', { name: 'Flere filtre' });
  if (await filters.isVisible()) await filters.click();
  await page.getByLabel('Oppgavestatus').selectOption('solved');
  await expect(page.getByRole('status')).toContainText('1 scenario i utvalget');
  await expect(page.locator('#scenario-heading')).toHaveText('Trim skjuler den røde toppen');
});

test('next, previous, random and mobile archive reset answers and move focus', async ({ page }) => {
  await page.getByLabel('Fagområde').selectOption('microphones');
  await page.getByRole('button', { name: 'Vis et hint' }).click();
  await page.getByRole('button', { name: 'Neste oppgave' }).click();
  await expect(page.locator('#scenario-heading')).toHaveText('Monitoren møter feil side');
  await expect(page.locator('#scenario-heading')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Vis et hint' })).toBeVisible();
  await page.getByRole('button', { name: 'Forrige', exact: true }).click();
  await expect(page.locator('#scenario-heading')).toHaveText('Taleren går bort fra mikrofonen');
  await page.getByRole('button', { name: 'Tilfeldig oppgave' }).click();
  await expect(page.locator('#scenario-heading')).not.toHaveText('Taleren går bort fra mikrofonen');
  const browse = page.getByRole('button', { name: 'Bla i 6 scenarioer' });
  if (await browse.isVisible()) await browse.click();
  await page.getByRole('complementary', { name: 'Scenarioarkiv' }).getByRole('button', { name: /Kassegitaren buldrer/ }).click();
  await expect(page.locator('#scenario-heading')).toHaveText('Kassegitaren buldrer');
  await expect(page.locator('#scenario-heading')).toBeFocused();
  if (await browse.isVisible()) await expect(browse).toHaveAttribute('aria-expanded', 'false');
});

test('all 72 scenarios are reachable by topic and keep individual answers and source links', async ({ page }) => {
  test.setTimeout(120000);
  for (const topic of practiceTopics) {
    await page.getByLabel('Fagområde').selectOption(topic.id);
    const selection = practiceScenarios.filter(scenario => scenario.topicId === topic.id);
    for (let index = 0; index < selection.length; index++) {
      const scenario = selection[index];
      await expect(page.locator('#scenario-heading')).toHaveText(scenario.title);
      const choices = page.getByRole('group', { name: 'Velg et svar' }).getByRole('button');
      await expect(choices).toHaveCount(3);
      await choices.nth(scenario.options.findIndex(option => !option.correct)).click();
      await expect(page.getByText('Prøv en annen tilnærming')).toBeVisible();
      await choices.nth(scenario.options.findIndex(option => option.correct)).click();
      await expect(page.getByText('Godt vurdert!')).toBeVisible();
      await expect(page.getByText(scenario.lesson, { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /Faggrunnlag:/ })).toHaveAttribute('href', scenario.source);
      if (index < selection.length - 1) await page.getByRole('button', { name: 'Neste oppgave' }).click();
    }
  }
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Små valg. Bedre lyd.');
  const filters = page.getByRole('button', { name: 'Flere filtre' });
  if (await filters.isVisible()) await filters.click();
  await page.getByLabel('Oppgavestatus').selectOption('unsolved');
  await expect(page.getByRole('heading', { name: 'Ingen scenarioer i dette utvalget' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72');
});
