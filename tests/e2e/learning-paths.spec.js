import { test, expect } from '@playwright/test';

test('a course path leads to a case and survives back, then opens its exact video', async ({page}) => {
  await page.route('https://www.youtube-nocookie.com/**', r=>r.fulfill({contentType:'text/html',body:'<body>Video fixture</body>'}));
  await page.goto('/#videos?track=skarptromme');
  await expect(page.getByRole('heading',{name:'Bevar slaget og halen'})).toBeVisible();
  await page.getByRole('button',{name:'Finn feilen i trommekanalen'}).click();
  await expect(page).toHaveURL(/#practice\?fault=snare-tail$/);
  await expect(page.getByRole('heading',{name:'Skarptromma mister halen'})).toBeVisible();
  await page.goBack();
  await page.getByRole('button',{name:'Del 11: Input Processing Gate',exact:true}).click();
  await expect(page.getByRole('region',{name:'Valgt video'}).getByRole('heading',{name:'Del 11: Input Processing Gate'})).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src',/autoplay=0/);
});

test('search distinguishes a learning path from a video and finds a band scene', async ({page})=>{
  await page.goto('/#videos');
  const open=page.getByRole('button',{name:'Søk i portalen',exact:true});
  const field=page.getByRole('searchbox',{name:'Søkeord i portalen'});
  await open.click();await field.fill('skill scenen fra salen');await field.press('Enter');
  await expect(page.getByRole('heading',{name:'Skill scenen fra salen'})).toBeVisible();
  await open.click();await field.fill('kick og bass');await field.press('Enter');
  await expect(page).toHaveURL(/#bandroom\?scene=grunnmur$/);
  await expect(page.getByRole('heading',{name:'Bandrommet',exact:true})).toBeVisible();
});
