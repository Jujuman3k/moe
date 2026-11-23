import { memo, useMemo, useRef } from 'react';
import { active, curve, extent, isDynamic } from './ProcessorResponse.js';
import { frequencyLabel, frequencyPosition, positionFrequency, proBands } from '../../data/proAudioSettings.js';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const responseColor = '#f3e14f';
const dynColor = '#65a7ff';
const freqs = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const silence = '#98a4b0';
const pass = type => type === 'highpass' || type === 'lowpass';
function pathString(points, X, Y) {
  return points.map(([x,y],i)=>(i?'L':'M')+X(x).toFixed(2)+' '+Y(y).toFixed(2)).join(' ');
}

export const ProcessorMiniGraph = memo(function ProcessorMiniGraph({channel, panel, bandIndex, sampleRate = 48000}) {
  const pro=channel.pro, dyn=isDynamic(panel);
  const d=useMemo(()=>pathString(curve(pro,panel,bandIndex,sampleRate,48),x=>x*100,y=>30-30*y),[pro,panel,bandIndex,sampleRate]);
  const color = active(pro,panel,bandIndex) ? dyn ? dynColor : responseColor : silence;
  return <svg className="cp-mini" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true" focusable="false" style={{width:'100%', height:'100%',display:'block'}}>
    <path d="M0 15H100 M25 0V30 M50 0V30 M75 0V30" stroke="#5c6b75" opacity=".38" fill="none" strokeWidth=".5"/>
    {dyn && <path d={d+'L100 30H0Z'} fill={color} opacity=".22"/>}
    <path d={d} fill="none" stroke={color} strokeWidth="1.7" vectorEffect="non-scaling-stroke"/>
  </svg>;
});

const X=x=>42+530*x, Y=y=>145-132*y;
export const ProcessorGraph = memo(function ProcessorGraph({channel,panel,bandIndex=0,onBandSelect,onBand,onFilter,onDynamic,sampleRate=48000}) {
  const pro=channel.pro, dyn=isDynamic(panel), floor=extent(panel), svg=useRef(null), gesture=useRef(null);
  const d=useMemo(()=>pathString(curve(pro,panel,null,sampleRate,160),X,Y),[pro,panel,sampleRate]);
  const layers=useMemo(()=>panel==='peq' ? pro.eq.bands.map((b,i)=>b.enabled && Math.abs(b.gain)>.05 && !pass(b.type) ? pathString(curve(pro,'peq',i,sampleRate,100),X,Y) : null) : [],[pro,panel,sampleRate]);
  const tickY = dyn ? panel==='gate' ? [-72,-54,-36,-18,0] : [-60,-45,-30,-15,0] : [-18,-12,-6,0,6,12,18];
  const yd = db => Y(dyn ? (db-floor)/-floor : (db+18)/36);
  const handles= panel==='peq' ? pro.eq.bands.map((b,i)=>({id:i, color:proBands[i].color, text:proBands[i].label, x:frequencyPosition(b.frequency), y:(pass(b.type) ? 15 : b.gain+18)/36, label:proBands[i].label+' · '+frequencyLabel(b.frequency), selected:bandIndex===i}))
    : panel==='filter' ? ['hpf','lpf'].map((id,i)=>({id,color:i?'#ef9771':'#a7daa3',text:i?'LP':'HP',x:frequencyPosition(pro.filters[id+'Hz']),y:15/36,label:(i?'Lavpass':'Høypass')+' · '+frequencyLabel(pro.filters[id+'Hz']),selected:pro.filters[id]}))
    : [{id:'threshold',color:'#ffbe67',text:'T',x:(pro[panel].threshold-floor)/-floor,y:(pro[panel].threshold-floor)/-floor,label:'Threshold · '+pro[panel].threshold+' dBFS',selected:true}];
  const setAt = (id,x,y) => {
    if(panel==='peq') {
      const b=pro.eq.bands[id], change={frequency:Math.round(positionFrequency(x))};
      if(!pass(b.type)) change.gain=clamp(Math.round((y*36-18)*10)/10,-15,15);
      onBand(id,change);
    } else if(panel==='filter') onFilter({[id+'Hz']:clamp(Math.round(positionFrequency(x)),id==='hpf'?20:50,id==='hpf'?2000:20000)});
    else onDynamic({threshold:clamp(Math.round((floor+(-floor*x))*10)/10,floor,0)});
  };
  function move(event) {
    if(!gesture.current || gesture.current.pointer!==event.pointerId) return;
    const {left,top,width,height}=svg.current.getBoundingClientRect();
    setAt(gesture.current.id,clamp(((event.clientX-left)*604/width-42)/530,0,1),clamp((145-(event.clientY-top)*171/height)/132,0,1));
  }
  function key(event,h) {
    const dir = {ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[event.key];
    if(dir == null && event.key!=='Enter' && event.key!==' ') return;
    event.preventDefault(); if(panel==='peq') onBandSelect(h.id);
    if(!dir) return;
    if(panel==='peq' && (event.key==='ArrowUp'||event.key==='ArrowDown')) {
      const b=pro.eq.bands[h.id]; if(!pass(b.type)) onBand(h.id,{gain:clamp(+(b.gain+dir*(event.shiftKey?1:0.5)).toFixed(1),-15,15)});
    } else if(dyn) onDynamic({threshold:clamp(+(pro[panel].threshold+dir*(event.shiftKey?3:1)).toFixed(1),floor,0)});
    else {
      const freq=Math.round(positionFrequency(h.x+dir*(event.shiftKey?.035:.007)));
      if(panel==='peq') onBand(h.id,{frequency:freq}); else onFilter({[h.id+'Hz']:clamp(freq,h.id==='hpf'?20:50,h.id==='hpf'?2000:20000)});
    }
  }
  const color=active(pro,panel)?dyn?dynColor:responseColor:silence;
  const ticksX=dyn?tickY:freqs;
  return <svg ref={svg} viewBox="0 0 604 171" preserveAspectRatio="none" className="cp-plot" role="group" aria-label={dyn?'Inn- og utgangskurve':'Frekvensrespons'} onPointerMove={move} onLostPointerCapture={()=>{gesture.current=null;}} onPointerUp={()=>{gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;}}>
    <rect x="42" y="13" width="530" height="132" fill="#0c141a"/>
    {tickY.map(db=><g key={db}><line x1="42" x2="572" y1={yd(db)} y2={yd(db)} stroke={!db?'#72818c':'#35414b'}/><text x="34" y={yd(db)+3} textAnchor="end">{db>0?'+'+db:db}</text></g>)}
    {ticksX.map(f=>{const x=X(dyn?(f-floor)/-floor:frequencyPosition(f));return <g key={f}><line x1={x} x2={x} y1="13" y2="145" stroke="#35414b"/><text x={x} y="162" textAnchor="middle">{!dyn&&f>=1000?f/1000+'k':f}</text></g>;})}
    {dyn&&<><path d="M42 145L572 13" stroke="#929b9f" strokeDasharray="4 4"/><path d={d+'L572 145H42Z'} fill="#376db5" opacity=".27"/>
      <line x1={X(handles[0].x)} x2={X(handles[0].x)} y1="13" y2="145" stroke="#ce9e57" strokeDasharray="3 4"/></>}
    {layers.map((line,i)=>line&&<path key={i} d={line+'L572 79H42Z'} fill={proBands[i].color} opacity={pro.eq.enabled?(i===bandIndex?.21:.1):.045}/>)}
    <path data-testid="c3500-response" d={d} stroke={color} strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke"/>
    {handles.map(h=><g key={h.id} transform={'translate('+X(h.x)+' '+Y(h.y)+')'} className="cp-node" role="button" tabIndex={0}
      aria-label={h.label+' · dra eller bruk piltastene'} onKeyDown={e=>key(e,h)} onClick={()=>{if(panel==='peq')onBandSelect(h.id);}}
      onPointerDown={e=>{if(e.button!==0)return; e.preventDefault();if(panel==='peq')onBandSelect(h.id);gesture.current={id:h.id,pointer:e.pointerId};e.currentTarget.focus({preventScroll:true});e.currentTarget.setPointerCapture(e.pointerId);}}>
      <title>{h.label}</title><circle r="16" fill="transparent"/><circle r={h.selected?9:7.5} fill="#11212e" stroke={h.color} strokeWidth={h.selected?2.5:1.5}/><text textAnchor="middle" dy="3" style={{fill:h.color,fontWeight:800,fontSize:9}}>{h.text}</text>
    </g>)}
  </svg>;
});
