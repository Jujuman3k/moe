import { expect, test } from '@playwright/test';

// WebKit CI timing is emitted per interaction as well as in the Playwright trace.
// A slow sheet transition can thus be distinguished from a missed touch.
async function measured(name, run) {
  return test.step(name, async () => {
    const start = Date.now();
    try {
      return await run();
    } finally {
      if (test.info().project.name === 'ipad-webkit') console.info('[signal-depth]', name, (Date.now() - start) + ' ms');
    }
  });
}

const activate = (control, touch) => touch ? control.tap() : control.click();

async function openMonitor(page) {
  return measured('Open monitor sheet', async () => {
    await page.goto('/#signal?node=monitor_branch');
    const dialog = page.getByRole('dialog', { name: 'Aux Send (Monitor)' });
    const lesson = dialog.getByRole('region', { name: 'Spor signalet inni leddet' });
    await expect(lesson).toBeVisible();
    return { dialog, lesson };
  });
}

test('inspect a monitor tap, keep the comparison while reading, then return to the unchanged mix', async ({ page, hasTouch }) => {
  const { dialog, lesson } = await openMonitor(page);
  const points = lesson.getByRole('group', { name: 'Målepunkter i eksemplet' }).getByRole('button');

  await measured('Switch monitor tap and inspect using the keyboard', async () => {
    await expect(points.nth(2)).toContainText('-24 dBFS');
    await activate(lesson.getByRole('button', { name: 'Post-fade', exact: true }), hasTouch);
    await expect(points.nth(2)).toContainText('-42 dBFS');
    await expect(points.nth(1)).toContainText('-36 dBFS');
    await points.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(lesson.getByRole('heading', { name: 'Sal', exact: true })).toBeVisible();
  });

  await measured('Revisit overview without resetting the tap', async () => {
    await activate(dialog.getByRole('button', { name: 'Verktøy', exact: true }), hasTouch);
    await expect(lesson).toBeHidden();
    await activate(dialog.getByRole('button', { name: 'Oversikt', exact: true }), hasTouch);
    await expect(points.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(points.nth(2)).toContainText('-42 dBFS');
  });

  await measured('Return to the unchanged mix', async () => {
    await activate(lesson.getByRole('button', { name: 'Prøv i egen miks' }), hasTouch);
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Sammenlign', exact: true })).toHaveAttribute('aria-selected', 'true');
    await activate(page.getByRole('tab', { name: 'Monitor', exact: true }), hasTouch);
    await expect(page.getByRole('group', { name: 'Monitorens uttak' }).getByRole('button', { name: 'Pre-fade' })).toHaveAttribute('aria-pressed', 'true');
  });
});

test('open a soundcheck case and revise an answer after feedback', async ({ page, hasTouch }) => {
  const { lesson } = await openMonitor(page);
  const challenge = lesson.getByRole('button', { name: 'Test deg selv · lydsjekk' });
  const exercise = lesson.getByRole('group', { name: /^Gitaristen mister/ });
  const wrong = exercise.getByRole('button', { name: /Øk bare nivået/ });
  const right = exercise.getByRole('button', { name: /Velg pre-fade/ });

  await measured('Expand soundcheck case', async () => {
    await expect(challenge).toHaveAttribute('aria-expanded', 'false');
    await activate(challenge, hasTouch);
    await expect(challenge).toHaveAttribute('aria-expanded', 'true');
    await expect(exercise).toBeVisible();
  });

  await measured('Choose raising the send and read its consequence', async () => {
    await activate(wrong, hasTouch);
    await expect(wrong).toHaveAttribute('aria-pressed', 'true');
    await expect(lesson.getByText(/neste faderbevegelse/)).toBeVisible();
  });

  await measured('Revise to pre-fade and read its consequence', async () => {
    await activate(right, hasTouch);
    await expect(right).toHaveAttribute('aria-pressed', 'true');
    await expect(wrong).toHaveAttribute('aria-pressed', 'false');
    await expect(lesson.getByText(/Avstem deretter send-nivået/)).toBeVisible();
  });
});
