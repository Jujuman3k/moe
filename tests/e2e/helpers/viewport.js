import { expect } from '@playwright/test';

// This DOM read is deliberately deferred until a real assertion has failed.
async function withGeometry(error, locator, context) {
  let report;
  try {
    report = await locator.evaluate(el => {
      const bounds = r => [r.left, r.top, r.right, r.bottom].map(x => Number(x.toFixed(3))).join(', ');
      const name = item => (item.getAttribute('aria-label') || Array.from(item.labels || [], l => l.textContent).join(' ') || item.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 75);
      const tag = item => item.tagName.toLowerCase() + (item.id ? `#${item.id}` : '') + Array.from(item.classList, c => `.${c}`).slice(0, 3).join('');
      const describe = item => `${tag(item)} “${name(item)}” [${bounds(item.getBoundingClientRect())}]`;
      const lines = [`Target ${describe(el)}`, `Viewport [0, 0, ${innerWidth}, ${innerHeight}] (left, top, right, bottom)`];
      for (let p = el.parentElement; p; p = p.parentElement) {
        const { overflowX, overflowY } = getComputedStyle(p);
        if (overflowX === 'visible' && overflowY === 'visible') continue;
        const rect = p.getBoundingClientRect();
        const left = rect.left + p.clientLeft, top = rect.top + p.clientTop;
        lines.push(`Clip ${tag(p)} [${bounds({ left, top, right: left + p.clientWidth, bottom: top + p.clientHeight })}] overflow=${overflowX}/${overflowY} scroll=${p.scrollLeft},${p.scrollTop}`);
      }
      // A panel-size assertion can fire before the per-control assertions. Include
      // offending controls so the failure still identifies the specific item.
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        const r = el.getBoundingClientRect(), left = r.left + el.clientLeft, top = r.top + el.clientTop;
        const outside = Array.from(el.querySelectorAll('button,input,select,svg[tabindex]')).filter(child => {
          const c = child.getBoundingClientRect();
          return c.width && c.height && (c.top < top || c.left < left || c.bottom > top + el.clientHeight || c.right > left + el.clientWidth);
        });
        lines.push(`Panel client=${el.clientWidth}×${el.clientHeight} scroll=${el.scrollWidth}×${el.scrollHeight}`);
        lines.push(...outside.slice(0, 5).map(child => `Outside panel: ${describe(child)}`));
      }
      return lines.join('\n');
    }, undefined, { timeout: 1000 });
  } catch { report = 'Geometry unavailable (target detached or page closed).'; }
  throw new Error(`${context}\n${report}\n\n${error.message}`, { cause: error });
}

export async function expectFullyInViewport(locator, context) {
  try { await expect(locator, context).toBeInViewport({ ratio: 1 }); }
  catch (error) { await withGeometry(error, locator, context); }
}

export async function expectPanelFits(locator, context, checkWidth = false) {
  const sizes = await locator.evaluate(el => ({ height: el.clientHeight, content: el.scrollHeight, width: el.clientWidth, contentWidth: el.scrollWidth }));
  try {
    expect(sizes.content, `${context}: content height`).toBeLessThanOrEqual(sizes.height + 1);
    if (checkWidth) expect(sizes.contentWidth, `${context}: content width`).toBeLessThanOrEqual(sizes.width + 1);
  } catch (error) { await withGeometry(error, locator, context); }
}
