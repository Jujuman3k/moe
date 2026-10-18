import { expect, test } from '@playwright/test';
import { signalJourney } from '../../src/data/signalJourney.js';
import { signalPanels } from '../../src/data/signalPanels.js';

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#signal');
  await expect(page.locator('.signal-lab')).toBeVisible();
  const open = page.getByRole('button', { name: 'Åpne mikser i fullskjerm', exact: true });
  if (await open.isVisible()) await open.click();
  await expect(page.getByRole('dialog', { name: 'Signalverksted i fullskjerm', exact: true })).toBeVisible();
});
test.afterEach(() => expect(errors).toEqual([]));
const output = (page, name) => page.locator(`.signal-output-strip output[aria-label="${name}"]`);
const select = (page, id) => page.locator(`.signal-map-node[data-node="${id}"]`).click();
const tab = (page, name) => page.getByRole('tab', { name, exact: true }).click();
const full = page => page.getByRole('dialog', { name: 'Signalverksted i fullskjerm', exact: true });

test('fader reacts to a real pointer while the waveform and navigation stay fixed', async ({ page, isMobile }) => {
  const fader = page.getByRole('slider', { name: 'Kanalfader i signalveien', exact: true });
  await expect(fader).toBeInViewport({ ratio: 1 });
  const wave = await page.locator('.signal-scope').boundingBox();
  const footer = await page.getByRole('navigation', { name: 'Navigasjon i signalveien' }).boundingBox();
  const original = await page.locator('[data-wave="after"]').getAttribute('d');
  const box = await fader.boundingBox();
  if (isMobile) await page.touchscreen.tap(box.x + box.width * 0.7, box.y + box.height / 2);
  else await fader.click({ position: { x: box.width * 0.7, y: box.height / 2 } });
  await expect(fader).not.toHaveValue('0');
  await expect(page.locator('[data-wave="after"]')).not.toHaveAttribute('d', original);
  await fader.fill('-12');
  await expect(output(page, 'Main LR')).toHaveText('-30 dBFS');
  await expect(output(page, 'Monitor')).toHaveText('-24 dBFS');
  expect(await page.locator('.signal-scope').boundingBox()).toEqual(wave);
  expect(await page.getByRole('navigation', { name: 'Navigasjon i signalveien' }).boundingBox()).toEqual(footer);
  await select(page, 'monitor_branch');
  await page.getByRole('button', { name: 'Post-fade', exact: true }).click();
  await expect(output(page, 'Monitor')).toHaveText('-36 dBFS');
  await tab(page, 'Sammenlign');
  await expect(fader).toHaveValue('-12');
  await fader.fill('-6');
  await expect(output(page, 'Monitor')).toHaveText('-30 dBFS');
});

test('every control panel fits without scrolling on small phones, tablet and landscape', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[320,568], [390,664], [768,1024], [844,390], [1440,1000]]) {
    await page.setViewportSize({ width, height });
    for (const [node, panels] of Object.entries(signalPanels)) {
      await select(page, node);
      if (node === 'fx_branch') { await tab(page, 'Effekt'); await page.getByRole('button', { name: 'Delay', exact: true }).click(); }
      for (const [, label] of panels) {
        await tab(page, label);
        const metrics = await page.locator('.signal-panel-body').evaluate(element => ({ height:element.clientHeight, content:element.scrollHeight, width:element.clientWidth, contentWidth:element.scrollWidth }));
        expect(metrics.content, `${width}×${height}: ${node}/${label}`).toBeLessThanOrEqual(metrics.height + 1);
        expect(metrics.contentWidth).toBeLessThanOrEqual(metrics.width + 1);
        for (const control of await page.getByRole('tabpanel').locator('input,button').all()) await expect(control).toBeInViewport({ ratio:1 });
        await expect(page.locator('.signal-scope')).toBeInViewport({ ratio:1 });
        expect(await full(page).evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
      }
    }
  }
});

test('processing, routing and distribution retain their effects across tabs', async ({ page }) => {
  await select(page, 'processing');
  await page.getByRole('button', { name:'Høypassfilter AV', exact:true }).click();
  await page.getByRole('slider', { name:'HPF-frekvens' }).fill('220');
  await expect(output(page,'Main LR')).toHaveText('-21 dBFS');
  await tab(page,'Gate');
  await page.getByRole('button', { name:'Gate AV', exact:true }).click();
  await page.getByRole('slider', { name:'Gate-terskel' }).fill('-12');
  await expect(output(page,'Main LR')).toHaveText('Stille');
  await tab(page,'Bypass');
  await page.getByRole('button', { name:'Bypass all processing AV', exact:true }).click();
  await expect(output(page,'Main LR')).toHaveText('-18 dBFS');
  await page.getByRole('button', { name:'Nullstill', exact:true }).click();
  await tab(page,'Comp');
  await page.getByRole('button', { name:'Kompressor AV', exact:true }).click();
  await expect(page.getByText('4.5 dB', { exact:true })).toBeVisible();
  await tab(page,'EQ');
  await page.getByRole('slider', { name:'EQ ved testtonen' }).fill('-6');
  await select(page,'matrix');
  await page.getByRole('slider', { name:'Matrix til PA' }).fill('-12');
  await expect(output(page,'PA')).toHaveText('-36 dBFS');
  await expect(output(page,'Main LR')).toHaveText('-24 dBFS');
  await select(page,'speakers');
  await page.getByRole('button', { name:'PA-utgang aktiv PÅ', exact:true }).click();
  await expect(output(page,'PA')).toHaveText('Stille');
  await select(page,'input');
  await page.getByRole('button', { name:'Inngang tilkoblet PÅ', exact:true }).click();
  await expect(page.locator('.signal-output-strip output')).toHaveText(['Stille','Stille','Stille']);
});

test('FX controls, tab position and settings survive node changes and fullscreen exits', async ({ page }) => {
  await select(page,'fx_branch');
  await page.getByRole('button', { name:'Delay', exact:true }).click();
  await tab(page,'Klang/delay');
  const initial = await page.locator('[data-wave="wet"]').getAttribute('d');
  await page.getByRole('slider', { name:'Delaytid', exact:true }).fill('700');
  await page.getByRole('slider', { name:'Feedback', exact:true }).fill('70');
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d',initial);
  await select(page,'fader'); await select(page,'fx_branch');
  await expect(page.getByRole('tab', { name:'Klang/delay' })).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('slider', { name:'Delaytid', exact:true })).toHaveValue('700');
  await page.getByRole('button', { name:'Tilbake til portalen', exact:true }).click();
  await expect(full(page)).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
  await page.getByRole('button', { name:'Åpne mikser i fullskjerm', exact:true }).click();
  await expect(page.getByRole('slider', { name:'Feedback', exact:true })).toHaveValue('70');
  await tab(page,'Effekt');
  await page.getByRole('button', { name:'Klang', exact:true }).click();
  await tab(page,'Klang/delay');
  const short=await page.locator('[data-wave="wet"]').getAttribute('d');
  await page.getByRole('slider', { name:'Klangtid', exact:true }).fill('3');
  await expect(page.locator('[data-wave="wet"]')).not.toHaveAttribute('d',short);
  await tab(page,'Retur');
  await page.getByRole('button', { name:'FX-retur til Main PÅ', exact:true }).click();
  await expect(output(page,'Main LR')).toHaveText('-18 dBFS');
  await expect(page.locator('[data-node="fx_branch"]')).toContainText('-30 dBFS');
});

test('all six missions remain solvable through their selected compact panels', async ({ page }) => {
  test.setTimeout(60000);
  await page.getByRole('button', { name:'6 oppdrag', exact:true }).click();
  const solve=[
    ()=>page.getByRole('button',{name:'Inngang tilkoblet AV',exact:true}).click(),
    ()=>page.getByRole('slider',{name:'Preamp-gain',exact:true}).fill('30'),
    ()=>page.getByRole('button',{name:'Pre-fade',exact:true}).click(),
    ()=>page.getByRole('button',{name:'Kanal-mute PÅ',exact:true}).click(),
    ()=>page.getByRole('button',{name:'Til Main LR AV',exact:true}).click(),
    ()=>page.getByRole('button',{name:'FX-retur til Main AV',exact:true}).click(),
  ];
  for(let index=0;index<solve.length;index++){
    await expect(page.getByLabel('Velg signaloppdrag')).toHaveValue(String(index));
    await page.getByRole('button',{name:'Sjekk løsningen',exact:true}).click();
    await expect(page.getByText('Ikke helt ennå. Følg signalet én gang til.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Vis hint',exact:true}).click();
    await page.getByRole('button',{name:'Til kontrollene',exact:true}).click();
    await solve[index]();
    await page.getByRole('button',{name:'6 oppdrag',exact:true}).click();
    await page.getByRole('button',{name:'Sjekk løsningen',exact:true}).click();
    await expect(page.getByText('Løst! Du fant sammenhengen.',{exact:true})).toBeVisible();
    await expect(page.getByText(`${index+1}/6 løst denne økten`,{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Neste oppdrag',exact:true}).click();
  }
});

test('overview, keyboard tabs, help, pause and portal exit keep orientation and focus', async ({ page }) => {
  await page.getByRole('button',{name:'Oversikt',exact:true}).click();
  await page.getByRole('dialog',{name:'Signaloversikt',exact:true}).getByRole('button',{name:/1. Kabler/}).click();
  for(let step=0;step<signalJourney.length;step++){
    await expect(page.locator(`[data-node="${signalJourney[step].id}"]`)).toHaveAttribute('data-active','true');
    if(step<signalJourney.length-1)await page.getByRole('button',{name:'Neste steg',exact:true}).click();
  }
  await page.getByRole('button',{name:'Fra starten',exact:true}).click();
  await expect(page.getByRole('button',{name:'Forrige steg',exact:true})).toBeDisabled();
  await page.getByRole('tab',{name:'Inngang',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Testtone',exact:true})).toBeFocused();
  await expect(page.getByRole('tab',{name:'Testtone',exact:true})).toHaveAttribute('aria-selected','true');
  const help=page.getByRole('button',{name:'Lær om valgt ledd',exact:true});
  await help.click(); await page.keyboard.press('Escape');
  await expect(full(page)).toBeVisible(); await expect(help).toBeFocused();
  await page.getByRole('button',{name:'Pause signalbevegelse'}).click();
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-play-state','paused');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.signal-travelling-line').first()).toHaveCSS('animation-name','none');
  await page.keyboard.press('Escape');
  await expect(full(page)).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
  await expect(page.getByRole('button',{name:'Åpne mikser i fullskjerm'})).toBeFocused();
});

test('browser back closes stacked dialogs and releases scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { location.hash = 'signal?node=processing'; });
  await expect(page.getByRole('dialog', { name:'Processing Strip', exact:true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level:1 })).toContainText('Forstå signalet');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
});
