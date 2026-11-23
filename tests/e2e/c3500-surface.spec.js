import { expect, test } from '@playwright/test';

const route=(ch,panel)=>'/#c3500?ch='+ch+'&panel='+panel;
const tab=(page,label)=>page.getByRole('navigation',{name:'Touchskjerm'}).getByRole('button',{name:label,exact:true});
const strip=(page,id)=>page.locator('[data-c35-strip="'+id+'"]');

test('view changes and browser history preserve the independent faders, mute and PAFL',async({page})=>{
  const recordings=[];
  page.on('request',r=>{if(r.url().endsWith('.mp3'))recordings.push(r.url());});
  await page.goto(route(1,'bank'));
  const kick=page.getByRole('slider',{name:'Fader IP 1',exact:true});
  const bass=page.getByRole('slider',{name:'Fader IP 2',exact:true});
  await expect(kick).toHaveAttribute('aria-valuenow','-2');
  await kick.press('0');await kick.press('ArrowDown');
  await expect(kick).toHaveAttribute('aria-valuenow','-0.5');
  await bass.press('Home');
  await expect(bass).toHaveAttribute('aria-valuetext','Av');
  await strip(page,2).getByRole('button',{name:'Mute IP 2',exact:true}).click();
  await strip(page,2).getByRole('button',{name:'PAFL IP 2',exact:true}).click();
  await expect(page.getByRole('button',{name:'Tøm PAFL'})).toBeVisible();
  await page.getByRole('button',{name:'Åpne Gate IP 2',exact:true}).click();
  await expect(page).toHaveURL(/ch=2&panel=gate/);
  await expect(tab(page,'Gate')).toHaveAttribute('aria-current','page');
  await expect(page.getByRole('slider',{name:'Hurtigfader for valgt IP 2'})).toHaveAttribute('aria-valuetext','Av');
  await page.goBack();
  await expect(tab(page,'Bank')).toHaveAttribute('aria-current','page');
  await expect(kick).toHaveAttribute('aria-valuenow','-0.5');
  await expect(strip(page,2).getByRole('button',{name:'Mute IP 2',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Tøm PAFL'}).click();
  await expect(strip(page,2).getByRole('button',{name:'PAFL IP 2',exact:true})).toHaveAttribute('aria-pressed','false');
  expect(recordings).toEqual([]);
});

test('a custom patch returns to the same channel from the signal lesson without starting any sound',async({page})=>{
  await page.goto(route(24,'preamp'));
  await expect(page.getByLabel('Opptak på inngangen')).toHaveValue('');
  await page.getByLabel('Opptak på inngangen').selectOption('female');
  await tab(page,'PEQ').click();
  await page.getByRole('button',{name:'Rediger HF på IP 24'}).click();
  await expect(page.getByRole('button',{name:'Rediger HF på IP 24'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Følg i signalveien'}).click();
  await expect(page).toHaveURL(/#signal\?.*source=female/);
  await page.getByRole('button',{name:'Åpne C3500-pulten'}).click();
  await expect(page).toHaveURL(/#c3500\?ch=24&panel=peq/);
  await expect(page.getByRole('button',{name:'Spill miks',exact:true})).toBeVisible();
  await tab(page,'Preamp').click();
  await expect(page.getByLabel('Opptak på inngangen')).toHaveValue('female');
  await page.reload();await expect(page.getByLabel('Opptak på inngangen')).toHaveValue('female');
});

test('the console reaches all 24 faders, fits the viewport and meters real playback',async({page})=>{
  await page.goto(route(1,'bank'));
  const strips=page.locator('[data-c35-strip]'),next=page.getByRole('button',{name:'Fadergruppe – neste'});
  await expect(strips.first()).toBeVisible();
  const width=await page.evaluate(()=>innerWidth),count=await strips.count();
  if(width>=1150)expect(count).toBe(24);
  if(width<600)expect(count).toBe(4);
  for(let start=1;start<=24;start+=count){
    if(start>1)await next.click();
    await expect(strips.first()).toHaveAttribute('data-c35-strip',String(start));
    await expect(strips.last()).toHaveAttribute('data-c35-strip',String(start+count-1));
  }
  await page.getByRole('button',{name:'Sel IP 24 Upatchet',exact:true}).click();
  await expect(page).toHaveURL(/ch=24&panel=bank/);
  await expect(strip(page,24).getByRole('button',{name:/Sel IP 24/})).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
  await page.getByRole('button',{name:'Spill miks',exact:true}).click();
  await expect(page.getByRole('button',{name:'Stopp miks',exact:true})).toBeVisible({timeout:20000});
  const left=page.locator('[data-c35-meter="left"]');
  await expect.poll(()=>left.evaluate(e=>Number(e.style.getPropertyValue('--c35-level')))).toBeGreaterThan(.1);
  await tab(page,'Comp').click();
  await expect(page.getByRole('button',{name:'Stopp miks',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Stopp miks',exact:true}).click();
  await expect.poll(()=>left.evaluate(e=>Number(e.style.getPropertyValue('--c35-level')))).toBe(0);
});

test('peking på en fysisk fader oppdaterer hurtigfaderen på samme kanal',async({page,isMobile})=>{
  await page.goto(route(1,'bank'));
  const physical=page.getByRole('slider',{name:'Fader IP 1',exact:true});
  await physical.scrollIntoViewIfNeeded();
  const rect=await physical.boundingBox();
  const pos={x:rect.x+rect.width/2,y:rect.y+rect.height*.79};
  if(isMobile) await page.touchscreen.tap(pos.x,pos.y);
  else await page.mouse.click(pos.x,pos.y);
  await expect(physical).not.toHaveAttribute('aria-valuenow','-2');
  const newValue=await physical.getAttribute('aria-valuenow');
  await expect(page.getByRole('slider',{name:'Hurtigfader for valgt IP 1'})).toHaveAttribute('aria-valuenow',newValue);
  await expect(page.getByRole('slider',{name:'Fader IP 2',exact:true})).toHaveAttribute('aria-valuenow','-6');
});
