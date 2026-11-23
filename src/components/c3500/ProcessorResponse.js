import { proFilterSpecs, responseDb } from '../../audio/proFilters.js';
import { compressionReduction } from '../../audio/proDynamics.worklet.js';
import { positionFrequency } from '../../data/proAudioSettings.js';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const isDynamic = panel => panel === 'gate' || panel === 'comp';
export const extent = panel => panel === 'gate' ? -72 : -60;
export function active(pro, panel, bandIndex) {
  if (panel === 'filter') return pro.filters.hpf || pro.filters.lpf;
  if (panel === 'peq') return pro.eq.enabled && (bandIndex == null || pro.eq.bands[bandIndex]?.enabled);
  return pro[panel]?.enabled;
}
export function curve(pro, panel, bandIndex, sampleRate, n) {
  if (isDynamic(panel)) {
    const s = pro[panel], floor = extent(panel);
    const norm = db => clamp((db-floor) / -floor, 0, 1);
    if (panel === 'gate') {
      const threshold = norm(s.threshold);
      // The closed branch has unity slope, clipped only by the plot floor.
      const knee = Math.min(threshold, norm(floor+s.depth));
      return [[0,0],[knee,0],[threshold,norm(s.threshold - s.depth)],[threshold,threshold],[1,1]];
    }
    return Array.from({length:n+1}, (_,i) => {
      const x=i/n, db=floor*(1-x);
      const reduction=compressionReduction(db,s.threshold,s.ratio,s.knee);
      const scale=(1-s.mix/100)+s.mix/100*10**((s.makeup-reduction)/20);
      return [x,norm(db+20*Math.log10(scale))];
    });
  }
  if (panel !== 'peq' && panel !== 'filter') return [[0,.5],[1,.5]];
  const specs = proFilterSpecs(pro);
  const view = panel === 'filter' ? specs.slice(0,3) : bandIndex == null ? specs.slice(3) : [specs[bandIndex+3]];
  // The stored curve remains visible in grey when the insert is out.
  const selected = panel === 'peq' ? view.map((s,i)=>({...s, enabled:pro.eq.bands[bandIndex ?? i].enabled})) : view;
  return Array.from({length:n+1}, (_,i) => {
    const x = i/n, y = responseDb(selected, positionFrequency(x),sampleRate);
    return [x,clamp((y + 18)/36,0,1)];
  });
}
