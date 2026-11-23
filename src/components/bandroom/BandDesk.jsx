import { ChevronDown, Drum, Guitar, Headphones, MicVocal, Piano, Play, RotateCcw, SlidersHorizontal, Square } from 'lucide-react';
import { audioSources } from '../../data/audioSources.js';
import { ChannelMeter, MasterMeters, MeterBus } from './BandMeters.jsx';

const sourceById=Object.fromEntries(audioSources.map(s=>[s.id,s]));
const icons={male:MicVocal,female:MicVocal,piano:Piano,bass:Guitar,guitar:Guitar,kick:Drum,snare:Drum};
const displayDb = db => db<=-60?'−∞ dB':(db>0?'+':'')+db.toString().replace('-','−')+' dB';
const panLabel = n => n===0?'Midt':Math.round(Math.abs(n)*100)+' % '+(n<0?'V':'H');
const chNo = i => String(i+1).padStart(2,'0');

function ChannelStrip({ channel, role, index, selected, compare, excluded, onSelect, onPatch }) {
  const { id,gainDb,mute,solo }=channel, source=sourceById[id], Icon=icons[id];
  return <article className="br-strip" data-selected={selected} data-muted={mute||excluded} style={{'--ch':source.color}} aria-label={source.label}>
    <button type="button" className="br-strip-heading" aria-pressed={selected} aria-label={'Velg '+source.label} onClick={onSelect}>
      <span className="br-strip-id"><span>IN {chNo(index)}</span><Icon size={15} aria-hidden="true"/></span>
      <strong>{source.label}</strong><small>{role}</small>
    </button>
    <div className="br-strip-middle">
      <span className="br-scale" aria-hidden="true"><i>+6</i><i>0</i><i>−12</i><i>−24</i><i>−36</i><i>−∞</i></span>
      <input type="range" className="br-fader" aria-orientation="vertical" aria-label={'Fader '+source.label} aria-valuetext={displayDb(gainDb)} min="-60" max="6" step="1" value={gainDb} disabled={compare} onFocus={onSelect} onChange={e=>onPatch({gainDb:Number(e.target.value)})}/>
      <ChannelMeter id={id}/>
    </div>
    <output className="br-strip-value" aria-label={'Faderverdi '+source.label}>{displayDb(gainDb)}</output>
    <div className="br-strip-switches">{[['solo',solo,'S'],['mute',mute,'M']].map(([key,on,text])=><button key={key} type="button" aria-label={(key==='solo'?'Solo ':'Mute ')+source.label} aria-pressed={on} data-key={key} title={key==='solo'?'Lytt til kanalen alene':'Demp kanalen'} disabled={compare} onClick={()=>{onSelect();onPatch({[key]:!on});}}>{text}</button>)}</div>
  </article>;
}

function SpatialField({ channels, selected, onSelect }) {
  return <div className="br-field"><div className="br-field-axis" aria-hidden="true"><span>V</span><b>STEREOBILDE</b><span>H</span></div>
    <div className="br-field-lanes">{channels.map(c=>{
      const source=sourceById[c.id];
      return <button type="button" key={c.id} className="br-field-lane" style={{'--ch':source.color,'--pos':(c.pan+1)*50+'%'}} aria-label={'Plassering '+source.label+': '+panLabel(c.pan)} aria-pressed={c.id===selected} onClick={()=>onSelect(c.id)}><span className="br-lane-name">{({male:"Mann",female:"Kvinne"})[c.id] || source.label}</span><span className="br-lane-track"><span className="br-pan-trace"/><span className="br-pan-dot"/></span></button>;
    })}</div>
  </div>;
}
export function BandDesk({ scene, displayed, selected, setSelected, compare, toggleCompare, status, error, playing, busy, onTransport, patch, onMaster, engine, onReset }) {
  const anySolo=displayed.channels.some(t=>t.solo), channel=displayed.channels.find(c=>c.id===selected)??displayed.channels[0];
  const source=sourceById[channel.id], Icon=icons[channel.id];
  return <MeterBus engine={engine} playing={playing}><section className="br-desk" aria-label="Miksepult for tre kanaler">
    <div className="br-transport">
      <button type="button" className="br-play" onClick={onTransport} aria-label={playing?'Stopp scenen':busy?'Avbryt lasting':'Spill scenen'}>{playing||busy?<Square size={15} fill="currentColor"/>:<Play size={16} fill="currentColor"/>}<span>{playing?'Stopp':busy?'Avbryt':'Spill scene'}</span></button>
      <div className="br-status" role="status"><span data-playing={playing}/>{playing?'Spiller':busy?'Laster opptak':status==='error'?'Lydfeil':'Klar til lydsjekk'}</div>
      <div className="br-transport-ab" role="group" aria-label="Sammenlign miks"><button type="button" aria-pressed={!compare} onClick={()=>toggleCompare(false)}>Din miks</button><button type="button" aria-pressed={compare} onClick={()=>toggleCompare(true)}>Startmiks</button></div>
      <MasterMeters/>
    </div>
    {error && <p className="br-message" role="alert">{error} Trykk «Spill scene» for å prøve igjen.</p>}
    {compare && <p className="br-compare-info"><Headphones size={15}/> Startmiksen er valgt. Velg «Din miks» for å justere videre.</p>}
    <div className="br-surface">
      <div className="br-bank"><div className="br-bank-caption"><span>INNGANGER</span><span>FADER · dB</span></div>
        <div className="br-strips">{displayed.channels.map((c,i)=><ChannelStrip key={c.id} channel={c} role={scene.tracks[i].role} index={i} selected={c.id===selected} compare={compare} excluded={anySolo&&!c.solo} onSelect={()=>setSelected(c.id)} onPatch={p=>patch(c.id,p)}/>)}</div>
        <p className="br-legend"><b>S</b> Solo <b>M</b> Mute <span>Velg en kanal for panorama.</span></p>
      </div>
      <section className="br-monitor" aria-label="Kanalinspektør" style={{'--ch':source.color}}>
        <div className="br-monitor-title"><span><SlidersHorizontal size={14}/> VALGT KANAL</span><small>IN {chNo(displayed.channels.indexOf(channel))}</small></div>
        <div className="br-selected"><i><Icon size={20}/></i><h2>{source.label}</h2><output>{displayDb(channel.gainDb)}</output></div>
        <SpatialField channels={displayed.channels} selected={selected} onSelect={setSelected}/>
        <label className="br-horizontal"><span>Panorama <output>{panLabel(channel.pan)}</output></span><input aria-label={'Panorama '+source.label} type="range" min="-100" max="100" value={Math.round(channel.pan*100)} step="1" aria-valuetext={panLabel(channel.pan)} disabled={compare} onChange={e=>patch(channel.id,{pan:Number(e.target.value)/100})}/></label>
        <label className="br-horizontal br-master"><span>Master <output>{displayDb(displayed.masterDb)}</output></span><input aria-label="Masterfader" type="range" min="-60" max="6" step="1" value={displayed.masterDb} aria-valuetext={displayDb(displayed.masterDb)} onChange={e=>onMaster(Number(e.target.value))}/></label>
      </section>
    </div>
    <div className="br-desk-foot"><span><Headphones size={15}/> Spill på behagelig lyttevolum.</span><button type="button" onClick={onReset}><RotateCcw size={14}/> Nullstill scene</button></div>
  </section></MeterBus>;
}
export function ScenePicker({ scene, scenes, onSelect }) {
  return <label className="br-picker"><span>VELG SCENE</span><span className="br-picker-control"><select aria-label="Velg scene" value={scene.id} onChange={e=>onSelect(e.target.value)}>{scenes.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select><ChevronDown size={16}/></span></label>;
}
