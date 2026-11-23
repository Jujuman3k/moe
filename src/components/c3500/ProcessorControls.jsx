import { useId, useRef, useState } from 'react';

const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

/** Both input methods change the same parameter: drag the encoder or type the exact number. */
export function Encoder({label,name=label,unit='',value,min,max,step=1,log=false,color='#8fd9e0',onChange}) {
  const gesture=useRef(null), [draft,setDraft]=useState(null), id=useId();
  const fraction=log?Math.log(value/min)/Math.log(max/min):(value-min)/(max-min);
  const emit=n=>onChange(clamp(+(Math.round(n/step)*step).toFixed(3),min,max));
  const move=e=>{
    const g=gesture.current;if(!g||e.pointerId!==g.id)return;
    const pos=clamp(g.start+(g.y-e.clientY)/135,0,1);
    emit(log?min*(max/min)**pos:min+pos*(max-min));
  };
  function keyboard(e) {
    const dir={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10}[e.key];
    if(e.key!=='Home'&&e.key!=='End'&&dir==null)return;
    e.preventDefault();emit(e.key==='Home'?min:e.key==='End'?max:value+dir*(e.shiftKey?10:1)*step);
  }
  function commit(e) {
    const v=e.currentTarget.valueAsNumber;
    if(Number.isFinite(v)) emit(v);
    setDraft(null);
  }
  return <div className="cp-encoder" style={{'--cp-accent':color,'--cp-angle':(-133+266*fraction)+'deg'}}>
    <label htmlFor={id}>{label}</label>
    <div role="slider" aria-label={name+' dreiehjul'} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-valuetext={value+' '+unit}
      tabIndex={0} className="cp-knob" title="Dra opp / ned eller bruk piltastene" onKeyDown={keyboard}
      onPointerDown={e=>{if(e.button!==0)return;gesture.current={start:fraction,y:e.clientY,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={move} onPointerUp={()=>{gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;}} onLostPointerCapture={()=>{gesture.current=null;}}><i/></div>
    <span className="cp-digits"><input id={id} aria-label={name+' verdi'} type="number" min={min} max={max} step={step} value={draft??value}
      onChange={e=>setDraft(e.target.value)} onFocus={e=>e.target.select()} onBlur={commit}
      onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur();}else if(e.key==='Escape'){setDraft(null);e.preventDefault();}}}/><small>{unit}</small></span>
  </div>;
}

export function InKey({label,value,onChange,children}) {
  return <button type="button" className="cp-key" aria-label={label} title={label} aria-pressed={value} onClick={()=>onChange(!value)}><i/>{children??'In'}</button>;
}
export function Level({label,db,gr=false,live}) {
  const min=gr?0:-72,max=gr?36:0,n=clamp(Number.isFinite(db)?db:min,min,max);
  return <div className={'cp-level'+(gr?' gr':'')}><span>{label}</span><i role="meter" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={live?n:min}><b style={{width:(live?(n-min)/(max-min)*100:0)+'%'}}/></i><output>{live?(n<=-72?'−∞':n.toFixed(1)):'—'} <small>{gr?'dB':'dBFS'}</small></output></div>;
}
