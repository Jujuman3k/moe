import { expect, test } from '@playwright/test';

test('listen: original and processed play on demand, grading and reveal complete a round, followed by a silent mixer', async ({page}) => {
  const audioRequests = []; const errors = [];
  page.on('request', request => { if (/\.mp3(?:\?|$)/.test(request.url())) audioRequests.push(request.url()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Lyttetest',exact:true})).toBeVisible();
  const a = page.getByRole('button',{name:'Spill A · Original'}); const b = page.getByRole('button',{name:'Spill B · Bearbeidet'});
  const answers = page.getByRole('group',{name:'Svaralternativer'}).getByRole('button');
  await expect(answers.first()).toBeDisabled(); expect(audioRequests.length).toBe(0);
  await a.click(); await expect(a).toHaveAttribute('aria-pressed','true'); await expect(answers.first()).toBeDisabled();
  await a.focus(); await page.keyboard.press('ArrowRight'); await expect(b).toHaveAttribute('aria-pressed','true');
  await expect(answers.first()).toBeEnabled(); expect(audioRequests.length).toBe(1);
  await page.getByRole('button',{name:'Spill fra start'}).click(); await expect(b).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Gi meg et lyttetips'}).click(); await expect(page.locator('#listen-tip')).toBeVisible();
  await answers.first().click(); await expect(answers.first()).toBeDisabled(); await expect(answers.filter({hasText:'riktig svar'})).toHaveCount(1);
  await page.getByRole('button',{name:'Neste oppgave'}).click(); await expect(a).toHaveAttribute('aria-pressed','false');
  await page.getByRole('button',{name:'Vis fasit uten poeng'}).click(); await page.getByRole('button',{name:'Neste oppgave'}).click();
  await page.getByRole('button',{name:'Vis fasit uten poeng'}).click(); await page.getByRole('button',{name:'Se rundens resultat'}).click();
  await expect(page.getByRole('heading',{name:/[01] av 3 riktige/})).toBeVisible();
  await page.getByRole('button',{name:'Start ny runde'}).click(); await expect(answers.first()).toBeDisabled();
  await page.getByRole('button',{name:'Vis fasit uten poeng'}).click();
  const match = await page.locator('.listen-feedback h3').textContent();
  const tools = { 'Lavpass ved 1,3 kHz':'lpf', 'Høypass ved 350 Hz':'hpf', 'Ekko etter 200 og 400 ms':'delay', 'Kort, diffus klanghale':'reverb','Gate med 15 ms lukketid':'gate','Kompressor med forhold 6:1':'comp','Klokkeløft ved 1,6 kHz':'peq' };
  expect(tools[match]).toBeTruthy();
  await page.getByRole('button',{name:'Prøv selv i mikseren'}).click();
  await expect(page).toHaveURL(/#signal\?.*source=/); await expect(page.getByRole('button',{name:'Spill lyd',exact:true})).toBeVisible();
  expect(new URLSearchParams(new URL(page.url()).hash.split('?')[1]).get('tool')).toBe(tools[match]);
  expect(audioRequests.length).toBe(1); expect(errors).toEqual([]);
});

test('focused dynamics rounds reveal measured evidence from the recording and let you replay beside the explanation', async ({page}) => {
  const audioRequests=[]; page.on('request', req=>{if(req.url().includes('.mp3'))audioRequests.push(req.url());});
  await page.goto('/#listen?track=dynamics');
  const track=page.getByLabel('Treningsspor');
  await expect(track).toHaveValue('dynamics'); await expect(page.getByRole('group',{name:'Svaralternativer'}).getByRole('button')).toHaveCount(2);
  await page.getByRole('button',{name:'Vis fasit uten poeng'}).click();
  await expect(page.getByText(/Spill A eller B for å se nivåkurvene/)).toBeVisible(); expect(audioRequests.length).toBe(0);
  await page.getByRole('button',{name:'Hør endringen igjen'}).click();
  await expect(page.getByRole('button',{name:'Hør endringen igjen'})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.listen-evidence svg[role=img]')).toBeVisible(); expect(audioRequests.length).toBe(1);
  await track.selectOption('tone');await page.getByRole('button',{name:'Behold runden'}).click();await expect(track).toHaveValue('dynamics');await expect(page).toHaveURL(/#listen\?track=dynamics$/);
  await track.selectOption('tone');await page.getByRole('button',{name:'Bytt spor',exact:true}).click();
  await expect(page).toHaveURL(/#listen\?track=tone$/);
  await expect(page.getByRole('group',{name:'Svaralternativer'}).getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('button',{name:'Spill B · Bearbeidet'})).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.listen-evidence')).toHaveCount(0);expect(audioRequests.length).toBe(1);
});
