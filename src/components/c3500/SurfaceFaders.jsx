import { memo } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, SlidersVertical } from 'lucide-react';
import { c3500ChannelName } from '../../data/c3500Model.js';
import { SurfaceMeter } from './SurfaceMeters.jsx';

// A tapered track gives -10..+5 dB more physical travel than the quiet end.
const anchors=[[0,-60],[130,-40],[250,-25],[400,-15],[550,-8],[750,0],[900,5],[1000,10]];
function mapTrack(val,from) {
  const to=1-from;
  for(let i=1;i<anchors.length;i++){
    const a=anchors[i-1],b=anchors[i];
    if(val<=b[from]) return a[to]+(val-a[from])*(b[to]-a[to])/(b[from]-a[from]);
  }
  return anchors.at(-1)[to];
}
const displayDb = v=>v<=-60?'−∞':(v>0?'+':'')+String(v).replace('-','−');
const clampDb = v=>Math.round(Math.max(-60,Math.min(10,v))*10)/10;
const dbTicks=[10,5,0,-10,-20,-40,-60];

export function FaderTrack({ value, onChange, label, compact=false }) {
  function key(e) {
    const delta=e.shiftKey?3:.5;
    const target={ArrowUp:value+delta,ArrowRight:value+delta,ArrowDown:value-delta,ArrowLeft:value-delta,PageUp:value+3,PageDown:value-3,Home:-60,End:10,'0':0}[e.key];
    if(target===undefined) return;
    e.preventDefault();onChange(clampDb(target));
  }
  return <input type="range" className={compact?'c35-horizontal':'c35-vertical'} min="0" max="1000" step="1" aria-label={label} aria-orientation={compact?'horizontal':'vertical'} aria-valuemin="-60" aria-valuemax="10" aria-valuenow={value} aria-valuetext={value<=-60?'Av':displayDb(value)+' dB'}
    title="Dra for å endre nivå. Piltaster: 0,5 dB. Dobbelklikk eller trykk 0 for unity."
    value={Math.round(mapTrack(value,1))} onKeyDown={key} onDoubleClick={()=>onChange(0)}
    onChange={e=>onChange(clampDb(mapTrack(+e.target.value,0)))}/>;
}

export function BankPager({page,count,onPage,size,label='Vis kanalgruppe'}){
  return <div className="c35-pager" role="group" aria-label={label}>
    <button type="button" aria-label={label+' – forrige'} disabled={!page} onClick={()=>onPage(page-1)}><ChevronLeft size={15}/></button>
    <span>IP {page*size+1}–{Math.min(24,(page+1)*size)}</span>
    <button type="button" aria-label={label+' – neste'} disabled={page>=count-1} onClick={()=>onPage(page+1)}><ChevronRight size={15}/></button>
  </div>;
}

const FaderStrip=memo(function FaderStrip({ ch, selected, onSelect, onPatch }) {
  const name=c3500ChannelName(ch);
  return <div className="c35-strip" data-c35-strip={ch.id} data-selected={selected} data-empty={!ch.sourceId}>
    <div className="c35-lcd" title={'IP '+ch.id+' · '+name}><span>IP {ch.id}</span><strong>{ch.sourceId?name:'—'}</strong></div>
    <label className="c35-pan" title={'Panorama: '+(ch.pan===0?'midt':Math.abs(ch.pan)+(ch.pan<0?' % venstre':' % høyre'))}>
      <span aria-hidden="true" style={{'--pan-angle':ch.pan*1.35+'deg'}}/><small>{ch.pan===0?'PAN':Math.abs(ch.pan)+(ch.pan<0?'L':'R')}</small>
      <input aria-label={'Panorama IP '+ch.id} aria-valuetext={ch.pan===0?'Midt':Math.abs(ch.pan)+(ch.pan<0?' % venstre':' % høyre')} type="range" min="-100" max="100" value={ch.pan} onDoubleClick={()=>onPatch(ch.id,{pan:0})} onChange={e=>onPatch(ch.id,{pan:+e.target.value})}/>
    </label>
    <button type="button" className="c35-switch c35-sel" aria-pressed={selected} aria-label={'Sel IP '+ch.id+' '+name} onClick={()=>onSelect(ch.id)}>Sel</button>
    <button type="button" className="c35-switch c35-mute" aria-label={'Mute IP '+ch.id} aria-pressed={ch.mute} onClick={()=>onPatch(ch.id,{mute:!ch.mute})}>Mute</button>
    <div className="c35-trackwell">
      <div className="c35-ticks" aria-hidden="true">{dbTicks.map(db=><span key={db} style={{bottom:mapTrack(db,1)/10+'%'}}>{displayDb(db)}</span>)}</div>
      <FaderTrack label={'Fader IP '+ch.id} value={ch.fader} onChange={fader=>onPatch(ch.id,{fader})}/>
      <SurfaceMeter id={ch.id} label="Etter fader"/>
    </div>
    <output className="c35-db">{displayDb(ch.fader)}<small> dB</small></output>
    <button type="button" className="c35-switch c35-pafl" aria-label={'PAFL IP '+ch.id} aria-pressed={ch.pafl} onClick={()=>onPatch(ch.id,{pafl:!ch.pafl})}>PAFL</button>
  </div>;
});

export function SurfaceFaders({ mix, selected, onSelect, onPatch, visibleCount,page, onPage,onOpenSelected }){
  const first=page*visibleCount,view=mix.channels.slice(first,first+visibleCount);
  const groups=visibleCount===24?[view.slice(0,12),view.slice(12)]:[view];
  return <section className="c35-faders" aria-label="Faderflate">
    <header className="c35-faderbar"><h2><SlidersVertical size={17}/> Faderflate</h2><button type="button" className="c35-open-ip" onClick={onOpenSelected}>Åpne IP {selected} <ArrowUpRight size={13}/></button>{visibleCount===24?<span>24 FADERE · 2 BANKER</span>:<BankPager page={page} size={visibleCount} count={24/visibleCount} onPage={onPage} label="Fadergruppe"/>}</header>
    <div className="c35-faderbanks">{groups.map(g=><div className="c35-faderbank" key={g[0].id}>
      <div className="c35-bankline"><i/><b>{g[0].id<=12?'A':'B'}</b> INPUT {g[0].id}–{g.at(-1).id}<i/></div>
      <div className="c35-strips" style={{'--strips':g.length}}>{g.map(ch=><FaderStrip key={ch.id} ch={ch} selected={ch.id===selected} onSelect={onSelect} onPatch={onPatch}/>)}</div>
    </div>)}</div>
    <p className="c35-faderhelp"><b>Sel</b> velger kanalen på skjermen. <b>Mute</b> demper i Main. <b>PAFL</b> lar deg høre kanalen før faderen, også når Mute er på. Dobbelklikk faderen for 0 dB.</p>
  </section>;
}
