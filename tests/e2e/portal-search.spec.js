import { expect, test } from '@playwright/test';

test('global search opens the exact scenario and supports keyboard-only studio entry',async ({page})=>{
  await page.goto('/');
  const launch=page.getByRole('button',{name:'Søk i portalen',exact:true});
  await launch.click();
  const field=page.getByRole('searchbox',{name:'Søkeord i portalen'});
  await expect(field).toBeFocused();
  await field.fill('rumling');
  await page.getByRole('button',{name:'Oppgave',exact:true}).click();
  const title='Trinn og rumling i talemikrofonen';
  await page.getByRole('button',{name:new RegExp(title)}).click();
  await expect(page).toHaveURL(/#practice\?scenario=eq-hpf-rumble$/);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(field).toBeFocused();
  await field.fill('miks kick');
  await field.press('ArrowDown');await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#signal\?node=processing&source=kick&mode=pro$/);
  await expect(page.getByRole('button',{name:'Velg lydkilde og lyttepunkt'})).toContainText('Kick');
});
test('escape closes the search and restores keyboard focus',async ({page})=>{
  await page.goto('/');
  const launch=page.getByRole('button',{name:'Søk i portalen',exact:true});
  await launch.click();await page.getByRole('searchbox',{name:'Søkeord i portalen'}).fill('ikkefinnes987');
  await expect(page.getByText(/Ingen treff\. Prøv et kortere/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(launch).toBeFocused();
});
