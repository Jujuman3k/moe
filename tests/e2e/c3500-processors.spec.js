import { test, expect } from '@playwright/test';

const scope=page=>page.locator('.cp-screen');
const open=(page,panel)=>page.getByRole('navigation',{name:'Touchskjerm'}).getByRole('button',{name:panel,exact:true}).click();
async function setValue(page,name,value) {
  const n=scope(page).getByRole('spinbutton',{name});
  await n.fill(String(value));await n.press('Enter');await expect(n).toHaveValue(String(value));
}
test('PEQ-bånd reagerer på graf, dreiehjul og eksakt verdi og beholdes per kanal',async({page})=>{
  await page.goto('/#c3500?ch=1&panel=peq');
  const screen=scope(page), line=screen.getByTestId('c3500-response');
  const node=screen.getByRole('button',{name:/^LM · /});
  await node.focus();await node.press('ArrowUp');
  await expect(screen.getByRole('spinbutton',{name:'LM gain verdi'})).toHaveValue('0.5');
  const shape=await line.getAttribute('d');
  await setValue(page,'LM gain verdi',8);
  await expect(line).not.toHaveAttribute('d',shape);
  const b=screen.getByRole('slider',{name:'LM bredde dreiehjul'}); await b.focus();await b.press('ArrowLeft');
  await expect(screen.getByRole('spinbutton',{name:'LM bredde verdi'})).toHaveValue('0.99');
  await screen.getByRole('button',{name:'Parametric EQ inn'}).click();
  await expect(line).toHaveAttribute('stroke','#98a4b0');
  await screen.getByRole('button',{name:'Til kanaloversikt'}).click();await expect(page).toHaveURL(/panel=overview/);
  await page.getByRole('button',{name:'Rediger LM på IP 1'}).click();
  await expect(screen.getByRole('spinbutton',{name:'LM gain verdi'})).toHaveValue('8');
  await page.goto('/#c3500?ch=2&panel=peq');
  await page.getByRole('button',{name:'Rediger LM på IP 2'}).click();
  await expect(screen.getByRole('spinbutton',{name:'LM gain verdi'})).toHaveValue('0');
});

test('valgt opptak får egne råd for filter, gate og kompressor',async({page})=>{
  await page.goto('/#c3500?ch=9&panel=preamp');
  const screen=scope(page);
  const socket=screen.getByRole('combobox',{name:'Opptak på inngangen'});
  await expect(socket).toHaveValue('');await socket.selectOption('snare');
  await setValue(page,'Digital Trim verdi',-6);
  await open(page,'Filter');
  const response=screen.getByTestId('c3500-response'), flat=await response.getAttribute('d');
  await screen.getByRole('button',{name:'HPF inn',exact:true}).click();
  await setValue(page,'HPF Freq verdi',180);await expect(response).not.toHaveAttribute('d',flat);
  await open(page,'Gate');
  await screen.getByText('Lytteguide',{exact:true}).click();
  await expect(screen.getByText(/La seidingen få leve/)).toBeVisible();
  await screen.getByRole('button',{name:/Bruk startforslag/}).click();
  await expect(screen.getByRole('button',{name:'Gate inn',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(screen.getByRole('spinbutton',{name:'Gate Threshold verdi'})).toHaveValue('-32');
  await open(page,'Comp');await screen.getByRole('button',{name:'Compressor inn'}).click();
  const before=await response.getAttribute('d');
  await setValue(page,'Comp Ratio verdi',8);await expect(response).not.toHaveAttribute('d',before);
  await screen.getByRole('combobox',{name:'Kompressorens detektor'}).selectOption('rms');
  await open(page,'Preamp');await expect(socket).toHaveValue('snare');await expect(screen.getByRole('spinbutton',{name:'Digital Trim verdi'})).toHaveValue('-6');
});

test('dra PEQ-punktet i to retninger på grafen',async({page,isMobile})=>{
  test.skip(isMobile,'Tester musedrag; samme Pointer Events brukes for berøring.');
  await page.goto('/#c3500?ch=1&panel=peq');const screen=scope(page);
  const node=screen.getByRole('button',{name:/^LF · /});
  await node.scrollIntoViewIfNeeded();const start=await node.boundingBox();
  const dx=start.x+start.width/2,dy=start.y+start.height/2;
  await page.mouse.move(dx,dy);await page.mouse.down();await page.mouse.move(dx+45,dy-24,{steps:5});await page.mouse.up();
  expect(Number(await screen.getByRole('spinbutton',{name:'LF frekvens verdi'}).inputValue())).toBeGreaterThan(100);
  expect(Number(await screen.getByRole('spinbutton',{name:'LF gain verdi'}).inputValue())).toBeGreaterThan(1);
});
