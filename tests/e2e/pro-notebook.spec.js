import { expect, test } from '@playwright/test';

const button=(p,name)=>p.getByRole('button',{name,exact:true});
async function notebook(p) {
  await button(p,'Lær om valgt ledd').click();
  await p.getByRole('button',{name:/^Miksminne og kildekort/}).click();
  return p.getByRole('dialog',{name:'Miksminne og kildekort'});
}
test('two named mixes restore actual EQ, preserve transport and survive reload for only their own source',async({page})=>{
  await page.goto('/#signal?node=processing&source=male&mode=pro');
  const gain=page.getByRole('slider',{name:'LF Gain',exact:true});
  await gain.fill('-4');let dialog=await notebook(page);
  await dialog.getByLabel('Navn på miks A').fill('Mindre bunn');
  await button(dialog,'Lagre nåværende miks i A').click();
  await expect(dialog.getByRole('heading',{name:'Mindre bunn'})).toBeVisible();
  await button(dialog,'Tilbake til mikseren').click();
  await gain.fill('3');dialog=await notebook(page);
  await dialog.getByLabel('Navn på miks B').fill('Mer bunn');await button(dialog,'Lagre nåværende miks i B').click();
  await dialog.getByText(/Se forskjellene mellom A og B/).click();
  await expect(dialog.getByRole('row',{name:/LF · Gain.*-4 dB.*3 dB/})).toBeVisible();
  await button(dialog,'Hent miks A').click();await expect(button(dialog,'Spill opptaket')).toBeVisible();
  await button(dialog,'Spill opptaket').click();await expect(button(dialog,'Stopp opptaket')).toBeVisible();
  await button(dialog,'Hent miks B').click();await expect(button(dialog,'Stopp opptaket')).toBeVisible();
  await button(dialog,'Hent miks A').click();await button(dialog,'Stopp opptaket').click();
  await button(dialog,'Tilbake til mikseren').click();await expect(gain).toHaveValue('-4');dialog=await notebook(page);
  await button(dialog,'Tilbake til miksen før sammenligning').click();
  await button(dialog,'Tilbake til mikseren').click();await expect(gain).toHaveValue('3');
  await page.reload();dialog=await notebook(page);await button(dialog,'Hent miks A').click();
  await button(dialog,'Tilbake til mikseren').click();await expect(gain).toHaveValue('-4');await expect(button(page,'Spill lyd')).toBeVisible();
  await page.goto('/#signal?node=processing&source=kick&mode=pro');
  dialog=await notebook(page);await expect(button(dialog,'Hent miks A')).toBeDisabled();
  await button(dialog,'Kildekort').click();await button(dialog,'Åpne Gate').click();
  await expect(page.getByRole('tab',{name:'Gate',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(button(page,'Spill lyd')).toBeVisible();
});
