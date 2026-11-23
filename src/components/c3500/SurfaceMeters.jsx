import { useEffect } from 'react';

// Meter bars read one engine snapshot per frame interval, shared across all 24 strips.
export function SurfaceMeter({ id, point='post', label }) {
  return <span className="c35-meter" data-c35-meter={point} data-input={id} aria-hidden="true" title={label}><i /></span>;
}

export function SurfaceMeterClock({ engine, playing, root }) {
  useEffect(()=>{
    let timer;
    function paint(){
      const m=playing ? engine?.readMeters() : null;
      root.current?.querySelectorAll('[data-c35-meter]').forEach(el=>{
        const type=el.dataset.c35Meter;
        const db=el.dataset.input ? m?.channels?.[el.dataset.input]?.[type] : m?.[type];
        const height=Math.min(1,Math.max(0,((Number.isFinite(db)?db:-72)+72)/72));
        el.style.setProperty('--c35-level',height);
      });
      root.current?.querySelectorAll('[data-c35-gr], [data-c35-grtext]').forEach(el=>{
        const field=el.dataset.c35Gr || el.dataset.c35Grtext;
        const gr=m?.channels?.[el.dataset.input]?.[field];
        if(el.dataset.c35Gr)el.style.setProperty('--gr',Number.isFinite(gr)?Math.min(1,Math.max(0,gr/24)):0);
        else el.textContent=Number.isFinite(gr)?gr.toFixed(1)+' dB':'—';
      });
    }
    paint();
    if(playing) timer=window.setInterval(paint,95);
    return ()=>window.clearInterval(timer);
  },[engine,playing,root]);
  return null;
}
