import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({contentType:'text/html', body:'<body>Local player fixture</body>'}));
  await page.route('https://img.youtube.com/**', route => route.fulfill({contentType:'image/svg+xml', body:'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="72"/>'}));
});

test('a saved lesson outside the course is one click away and its mixer exercise opens the chosen recording', async ({page}) => {
  await page.goto('/#videos');
  await page.getByLabel('Videotema').selectOption('mixing');
  await page.getByRole('button', {name:'Lagre favoritt: Vokal EQ',exact:true}).click();
  await page.getByLabel('Videotema').selectOption('dlive_course');
  await page.getByRole('button', {name:/^Mine favoritter/}).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', {name:'Spill av Vokal EQ',exact:true}).click();
  await expect(page.getByRole('link', {name:/Åpne på YouTube/})).toHaveAttribute('href','https://www.youtube.com/watch?v=EPjrFU5d_OA');
  await expect(page.locator('iframe')).toHaveAttribute('src',/autoplay=1&mute=0/);
  await page.getByRole('button',{name:'Prøv EQ på vokal'}).click();
  await expect(page).toHaveURL(/#signal\?/);
  const params = new URLSearchParams(new URL(page.url()).hash.split('?')[1]);
  expect(Object.fromEntries(params)).toMatchObject({node:'processing',source:'male',mode:'pro',tool:'peq'});
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('opening a direct lesson link waits for user playback and permits navigating back one lesson', async ({page}) => {
  await page.goto('/#videos?video=Lgr2cALG_1w');
  await expect(page.locator('iframe')).toHaveAttribute('src',/Lgr2cALG_1w\?autoplay=0/);
  await page.getByRole('button',{name:'Forrige i serien'}).click();
  await expect(page.locator('iframe')).toHaveAttribute('src',/q7BQkq6A5qc\?autoplay=1/);
  await expect(page.getByRole('button',{name:'Forrige i serien'})).toBeDisabled();
  await page.getByRole('button',{name:'Lukk video'}).click();
  await expect(page.locator('iframe')).toHaveCount(0);
});
