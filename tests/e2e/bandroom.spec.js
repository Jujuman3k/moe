import { expect, test } from '@playwright/test';

test('mix a scene, compare without losing faders and hear the exercise in context', async ({page})=>{
  await page.goto('/#bandroom?scene=vokalplass');
  await expect(page.getByRole('heading',{name:'Bandrommet',exact:true})).toBeVisible();
  const play=page.getByRole('button',{name:'Spill scenen',exact:true});
  const result=page.getByRole('button',{name:'Sjekk miksen'});
  await expect(result).toBeDisabled();
  await play.click();await expect(page.getByRole('button',{name:'Stopp scenen'})).toBeVisible();
  const vocal=page.getByRole('slider',{name:'Fader Mannsvokal'});
  await vocal.fill('5');
  await page.getByRole('button',{name:'Startmiks',exact:true}).click();await expect(vocal).toHaveValue('-10'); await expect(vocal).toBeDisabled();
  await page.getByRole('button',{name:'Din miks',exact:true}).click();await expect(vocal).toHaveValue('5');
  const solo=page.getByRole('button',{name:'Solo Gitar',exact:true});await solo.click();await result.click();
  await expect(page.getByText(/Slå av solo\. Vurder balansen/)).toBeVisible();
  await solo.click();await result.click();await expect(page.getByText('Øvingsmålet er nådd')).toBeVisible();
  await expect(page.getByRole('region',{name:'Kanalinspektør'}).getByRole('heading',{name:'Gitar'})).toBeVisible();
  await page.getByRole('combobox',{name:'Velg scene'}).selectOption('grunnmur');
  await expect(page).toHaveURL(/#bandroom\?scene=grunnmur/);await expect(play).toBeVisible();
  await page.goBack();await expect(vocal).toHaveValue('5');await expect(play).toBeVisible();
  await page.reload();await expect(vocal).toHaveValue('5');await expect(play).toBeVisible();
});

test('portrait keeps the three faders together and the selected channel in sync', async ({page})=>{
  await page.setViewportSize({width:320,height:568});await page.goto('/#bandroom?scene=duett');
  const bank=page.locator('.br-strips');await expect(bank).toBeVisible();
  const sliders=bank.getByRole('slider');await expect(sliders).toHaveCount(3);
  const rects=await sliders.evaluateAll(els=>els.map(el=>{const b=el.getBoundingClientRect();return [b.left,b.top,b.right,b.bottom];}));
  expect(rects.every(r=>r[0]>=0&&r[2]<=320&&r[1]===rects[0][1]&&r[3]===rects[0][3])).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Velg Kvinnevokal',exact:true}).click();
  const pan=page.getByRole('slider',{name:'Panorama Kvinnevokal'});await pan.fill('-35');
  await expect(page.getByRole('button',{name:'Plassering Kvinnevokal: 35 % V'})).toHaveAttribute('aria-pressed','true');
});
