import { useEffect, useRef } from 'react';

const percent = db => Math.max(0,Math.min(100,(db+60)/60*100));
const peakText = db => db<=-60 ? '−∞' : db.toFixed(1).replace('-', '−');
export function MeterBus({ engine, playing, children }) {
  const root=useRef(null);
  useEffect(()=>{
    const meters=[...root.current.querySelectorAll('[data-band-meter]')];
    const peak=root.current.querySelector('[data-band-peak]');
    function paint(reading) {
      for(const el of meters) {
        const key=el.dataset.bandMeter, db=reading?.channels?.[key] ?? reading?.[key] ?? -72;
        el.style.setProperty('--level', percent(db)+'%');
      }
      if (peak) {
        const value=peakText(Math.max(reading?.left??-72,reading?.right??-72));
        if(peak.textContent!==value) peak.textContent=value;
      }
    }
    paint(playing ? engine?.readMeters():null);
    if(!playing) return;
    const id=window.setInterval(()=>paint(engine?.readMeters()),90);
    return ()=>window.clearInterval(id);
  },[playing,engine]);
  return <div ref={root} className="br-meterbus">{children}</div>;
}
export function ChannelMeter({ id }) {
  return <span className="br-meter br-meter-v" data-band-meter={id} aria-hidden="true"><i/></span>;
}
export function MasterMeters() {
  return <div className="br-stereo" aria-label="Målt toppnivå på stereoutgangen">
    <div className="br-stereo-head"><b>MAIN LR</b><span><span data-band-peak="">−∞</span> dBFS</span></div>
    {['left','right'].map((id,i)=><div className="br-stereo-row" key={id}><small>{i?'R':'L'}</small><span className="br-meter" data-band-meter={id} aria-hidden="true"><i/></span></div>)}
  </div>;
}
