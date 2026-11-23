import { memo } from 'react';
import { ArrowUpRight, ChevronsLeftRight, Headphones } from 'lucide-react';
import { c3500ChannelName } from '../../data/c3500Model.js';
import { frequencyLabel, proBands } from '../../data/proAudioSettings.js';
import { ProcessorMiniGraph } from './ProcessorGraphs.jsx';
import { BankPager, FaderTrack } from './SurfaceFaders.jsx';
import { SurfaceMeter } from './SurfaceMeters.jsx';

const slotNames=[['bank','Bank'],['overview','Overview'],['preamp','Preamp'],['filter','Filter'],['gate','Gate'],[null,'Ins A'],['peq','PEQ'],['comp','Comp'],[null,'Ins B'],[null,'Delay']];
function Dial({color,value=0,label}){
  return <span className={'c35-pot '+color} style={{'--pot-angle':Math.max(-135,Math.min(135,value*270-135))+'deg'}} title={label} aria-hidden="true"><i/></span>;
}
export function SurfaceTabs({panel,onOpen}){
  return <nav className="c35-tabs" aria-label="Touchskjerm"><div className="c35-tabs-inner">{slotNames.map(([id,label])=>id?
    <button key={label} type="button" data-active={panel===id} aria-current={panel===id?'page':undefined} onClick={()=>onOpen(id)}>{label}</button>:
    <span key={label} className="c35-empty-tab" title={label+' er ikke modellert i dette øverommet'}>{label}</span>)}</div></nav>;
}
export function InputRail({ch,onOpen}){
  return <aside className="c35-inputrail" aria-label="Valgt inngang"><span className="c35-ipcap">IP {ch.id}</span>
    <button type="button" onClick={()=>onOpen('preamp')} aria-label="Åpne gain og trim"><small>Gain</small><Dial color="red" value={ch.gain/60}/><b>{ch.gain} dB</b><small>Trim</small><Dial color="amber" value={(ch.pro.trim+24)/48}/><b>{ch.pro.trim} dB</b></button>
    <div className="c35-inputlevel" title="Inngangsnivå"><SurfaceMeter id={ch.id} point="input"/></div>
    <button type="button" onClick={()=>onOpen('filter')} aria-label="Åpne inngangsfilter"><small>HPF / LPF</small><ProcessorMiniGraph channel={ch} panel="filter"/><b>{ch.pro.filters.hpf?frequencyLabel(ch.pro.filters.hpfHz):'HPF av'}</b><b>{ch.pro.filters.lpf?frequencyLabel(ch.pro.filters.lpfHz):'LPF av'}</b></button>
  </aside>;
}
export function BankDynamicsRail({ch,onOpen}) {
  return <aside className="c35-dynrail" aria-label="Dynamikk på valgt inngang"><span className="c35-dynhead">IP {ch.id} · DYN</span>{[['gate','Gate','gateReduction'],['comp','Comp','reduction']].map(([id,name,field])=><button type="button" key={id} onClick={()=>onOpen(id)} aria-label={'Åpne '+name+' i dynamikkfeltet for IP '+ch.id}>
    <span className="c35-dyntitle"><b>{name}</b><small data-in={ch.pro[id].enabled}>{ch.pro[id].enabled?'IN':'OUT'}</small></span>
    <span className="c35-dyngraph"><ProcessorMiniGraph channel={ch} panel={id}/></span>
    <small className="c35-dynthresh">Thr {ch.pro[id].threshold} dB</small>
    <span className="c35-grclip" aria-hidden="true"><i data-c35-gr={field} data-input={ch.id}/></span>
    <span className="c35-grread">GR <output aria-label={name+' gain reduction'} data-c35-grtext={field} data-input={ch.id}>—</output></span>
  </button>)}</aside>;
}
export function MainRail({mix,onMaster}){
  return <aside className="c35-mainrail" aria-label="Masterkanal"><span className="c35-maincap">Main LR</span>
    <div className="c35-stereo"><div><SurfaceMeter point="left"/><b>L</b></div><div><SurfaceMeter point="right"/><b>R</b></div><small>0<br/>−6<br/>−12<br/>−24<br/>−48</small></div>
    <span className="c35-mainread">{mix.masterDb<=-60?'−∞':mix.masterDb} dB</span>
    <FaderTrack compact value={mix.masterDb} onChange={onMaster} label="Main LR-fader"/>
  </aside>;
}

const graphRows=[['gate','Gate'],['filter','Filter'],['peq','PEQ'],['comp','Comp']];
const BankColumn=memo(function BankColumn({ch,selected,onOpen}){
  return <div className="c35-bankcol" data-selected={selected} data-empty={!ch.sourceId}>
    <button className="c35-chname" type="button" onClick={()=>onOpen(ch.id,'overview')} aria-label={'Åpne Overview IP '+ch.id}><b>IP {ch.id}</b><small>{ch.sourceId?c3500ChannelName(ch):'—'}</small></button>
    <button className="c35-bankgain" type="button" onClick={()=>onOpen(ch.id,'preamp')} aria-label={'Åpne Preamp IP '+ch.id}><span><Dial color="red" value={ch.gain/60}/><small>{ch.gain} dB</small><Dial color="amber" value={(ch.pro.trim+24)/48}/><small>{ch.pro.trim} dB</small></span><SurfaceMeter id={ch.id} point="input"/></button>
    {graphRows.map(([id,label])=><button type="button" className={'c35-bankgraph '+id} onClick={()=>onOpen(ch.id,id)} aria-label={'Åpne '+label+' IP '+ch.id} key={id}><ProcessorMiniGraph panel={id} channel={ch}/></button>)}
    <div className="c35-bankpost"><span>{ch.fader<=-60?'−∞':ch.fader}</span><SurfaceMeter id={ch.id}/></div>
  </div>;
});

export function BankScreen({channels,selected,onOpen,page,size,onPage}){
  const view=channels.slice(page*size,(page+1)*size);
  return <div className="c35-bankview">
    <div className="c35-screenheading"><span>CHANNEL <b>BANK</b></span><BankPager page={page} size={size} count={24/size} onPage={onPage} label="Skjermbank"/></div>
    <div className="c35-bankgrid" style={{'--bankcols':view.length}}>
      <div className="c35-rowlabels" aria-hidden="true"><b>IP</b><b>Gain<br/>Trim</b><b>Gate</b><b>Filter</b><b>PEQ</b><b>Comp</b><b>Post</b></div>
      {view.map(ch=><BankColumn key={ch.id} ch={ch} selected={ch.id===selected} onOpen={onOpen}/>)}
    </div>
    <p className="c35-screenhint">Trykk på en kurve for å redigere den kanalen.</p>
  </div>;
}

function OverviewCard({label,mode,children,onClick,className=''}){
  return <button className={'c35-ovcard '+className} type="button" onClick={onClick} aria-label={'Åpne '+label+' for valgt kanal'}><span><b>{label}</b><small>{mode}</small><ArrowUpRight size={12}/></span>{children}</button>;
}
export function OverviewScreen({ch,onOpen}){
  const pro=ch.pro, on=id=>()=>onOpen(id);
  return <div className="c35-overview">
    <div className="c35-screenheading"><span>CHANNEL <b>OVERVIEW</b></span><span>IP {ch.id} · {c3500ChannelName(ch)}</span></div>
    <div className="c35-ovgrid">
      <OverviewCard label="Preamp" mode="A / D" onClick={on('preamp')} className="preamp">
        <div className="c35-ovpre"><Dial value={ch.gain/60} color="red"/><strong>{ch.gain}<small> dB</small></strong></div><p>{ch.sourceId?'Patchet · '+c3500ChannelName(ch):'Upatchet · velg kilde'}</p>
      </OverviewCard>
      {['filter','gate','peq','comp'].map(id=>{
        const info={filter:['Filter',pro.filters.hpf||pro.filters.lpf?'IN':'OUT',`HPF ${frequencyLabel(pro.filters.hpfHz)} · LPF ${frequencyLabel(pro.filters.lpfHz)}`], gate:['Gate',pro.gate.enabled?'IN':'OUT','Terskel '+pro.gate.threshold+' dB'],peq:['PEQ',pro.eq.enabled?'IN':'OUT','4 parametriske bånd'],comp:['Compressor',pro.comp.enabled?'IN':'OUT',pro.comp.ratio+':1 · '+pro.comp.threshold+' dB']}[id];
        return <OverviewCard key={id} label={info[0]} mode={info[1]} onClick={on(id)} className={id}><div className="c35-ovgraph"><ProcessorMiniGraph channel={ch} panel={id}/></div><p>{info[2]}</p></OverviewCard>;
      })}
      <div className="c35-unassigned ins-a"><b>Insert A</b><ChevronsLeftRight size={17}/><small>Unassigned</small></div>
      <div className="c35-unassigned ins-b"><b>Insert B</b><small>Unassigned</small><b>Delay</b><small>Ikke modellert</small></div>
    </div>
  </div>;
}

export function FastBands({ch,bandIndex,onBand,panel}){
  return <div className="c35-fastbands" role="group" aria-label="Hurtigvalg av EQ-bånd">{proBands.map((b,i)=><button type="button" key={b.id} onClick={()=>onBand(i)} style={{'--band':b.color}} aria-label={'Rediger '+b.label+' på IP '+ch.id} aria-pressed={panel==='peq'&&bandIndex===i}>
    <span><strong>{b.label}</strong><small>{frequencyLabel(ch.pro.eq.bands[i].frequency)}</small></span><ProcessorMiniGraph panel="peq" bandIndex={i} channel={ch}/>
  </button>)}</div>;
}

export function FocusStrip({ch,onPatch,onOpen}){
  return <div className="c35-focusstrip"><button type="button" className="c35-focusname" onClick={()=>onOpen('overview')} title="Åpne kanaloversikten"><i/><span>IP {ch.id}</span><b>{c3500ChannelName(ch)}</b></button>
    <div className="c35-focusfader"><label htmlFor="c35-focus-value">Fader</label><FaderTrack compact value={ch.fader} label={'Hurtigfader for valgt IP '+ch.id} onChange={fader=>onPatch({fader})}/><output id="c35-focus-value">{ch.fader<=-60?'−∞':ch.fader} dB</output></div>
    <div className="c35-focuskeys"><button className="c35-switch c35-mute" type="button" aria-label={'Mute valgt IP '+ch.id} aria-pressed={ch.mute} onClick={()=>onPatch({mute:!ch.mute})}>Mute</button><button className="c35-switch c35-pafl" type="button" aria-label={'PAFL valgt IP '+ch.id} aria-pressed={ch.pafl} onClick={()=>onPatch({pafl:!ch.pafl})}><Headphones size={12}/> PAFL</button></div>
  </div>;
}
