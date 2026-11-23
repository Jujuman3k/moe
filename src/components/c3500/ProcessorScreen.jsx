import { useMemo } from 'react';
import { ChevronLeft, Ear, Radio } from 'lucide-react';
import { audioSources } from '../../data/audioSources.js';
import { proHelp, proSourceLesson } from '../../data/proAudioLessons.js';
import { proBands } from '../../data/proAudioSettings.js';
import { Encoder, InKey, Level } from './ProcessorControls.jsx';
import { ProcessorGraph } from './ProcessorGraphs.jsx';
import '../../styles/c3500-processors.css';

const titles={preamp:'Preamp', filter:'Filter',peq:'Parametric EQ',gate:'Gate',comp:'Compressor'};
const ids={preamp:'01',filter:'02',gate:'03',peq:'04',comp:'05'};
const sectionKey={filter:'filters',peq:'eq',gate:'gate',comp:'comp'};
const posColor='#ef7d62', trimColor='#e5c565', dynColor='#8ba9e5';

function PanelHelp({panel,source,lesson,onApply}) {
  const help=proHelp[panel], note=panel==='preamp'?source?.focus:lesson?.[panel==='peq'?'eq':panel];
  return <details className="cp-help" key={(source?.id||'empty')+panel}><summary><Ear size={15}/><b>Lytteguide</b><span>{source?.label||'Ingen kilde'}</span></summary>
    <div>{note&&<p className="cp-tip">{note}</p>}
      {lesson&&panel!=='preamp'&&<button type="button" className="cp-apply" onClick={()=>onApply(lesson.settings[sectionKey[panel]])}>Bruk startforslag for {source.label.toLowerCase()} · bare {titles[panel]}</button>}
      <dl>{help.fields.map(([label,body])=><div key={label}><dt>{label}</dt><dd>{panel==='preamp'&&label==='Polarity'?'Vender fortegnet. Prøv samme opptak på to like kanaler og vend bare den ene. Like signaler i motfase kan kansellere hverandre.':body}</dd></div>)}</dl>
    </div></details>;
}

function Preamp({channel,onPatch,source,meters,playing}) {
  const pro=channel.pro;
  return <div className="cp-preamp"><label className="cp-patch"><span><Radio size={15}/> Input socket</span>
    <select aria-label="Opptak på inngangen" value={channel.sourceId??''} onChange={e=>onPatch({sourceId:e.target.value||null})}><option value="">Ingen kilde · upatchet</option>{audioSources.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
    <small>IP {channel.id} <b>◂</b> {source?'Opptak':'Upatchet'}</small></label>
    <div className="cp-pre-row"><div className="cp-module"><h4>Socket Preamp</h4><Encoder label="Gain" name="Preamp Gain" value={channel.gain} min={0} max={60} step={.5} unit="dB" color={posColor} onChange={gain=>onPatch({gain})}/><small className="cp-hint">28 dB = opptakets nivå</small></div>
    <div className="cp-module"><h4>Digital Trim</h4><Encoder label="Trim" name="Digital Trim" value={pro.trim} min={-24} max={24} step={.5} unit="dB" color={trimColor} onChange={trim=>onPatch({pro:{...pro,trim}})}/><InKey label="Vend polaritet" value={pro.polarity} onChange={polarity=>onPatch({pro:{...pro,polarity}})}>Ø Polarity</InKey></div></div>
    <Level label="Nivå etter preamp" db={meters?.input} live={playing&&!!source&&!!meters}/><p className="cp-footnote">48 V og Pad hører til fysiske mikrofoninnganger. Her er inngangen en lydfil.</p>
  </div>;
}

function Filter({channel,change}) {
  const f=channel.pro.filters;
  return <div className="cp-filtergrid">{['hpf','lpf'].map((id,i)=><div className="cp-fband" key={id}>
    <div className="cp-inlinehead"><h4>{i?'Low Pass':'High Pass'}</h4><InKey label={(i?'LPF':'HPF')+' inn'} value={f[id]} onChange={v=>change({[id]:v})}/></div>
    <Encoder label={i?'LPF Freq':'HPF Freq'} value={f[id+'Hz']} onChange={v=>change({[id+'Hz']:v})} min={i?50:20} max={i?20000:2000} unit="Hz" log color={i?'#ed9b80':'#a2d79a'}/>
    {!i?<label className="cp-select">Slope<select aria-label="HPF bratthet" value={f.slope} onChange={e=>change({slope:Number(e.target.value)})}><option value={12}>12 dB/okt</option><option value={24}>24 dB/okt</option></select></label>:<small className="cp-hint">12 dB/okt</small>}
  </div>)}</div>;
}
function Peq({channel,bandIndex,onBand}) {
  const meta=proBands[bandIndex], b=channel.pro.eq.bands[bandIndex], patch=v=>onBand(bandIndex,v);
  const choices=bandIndex===0?[['lowshelf','Low shelf'],['highpass','High pass']]:bandIndex===3?[['highshelf','High shelf'],['lowpass','Low pass']]:[];
  const cut=['highpass','lowpass'].includes(b.type);
  return <div className="cp-bandbox" style={{'--cp-band':meta.color}}><div className="cp-bandtop"><strong>{meta.label}</strong><span>{meta.name}</span>{choices.length>0?<select aria-label={meta.label+' filtertype'} value={b.type} onChange={e=>patch({type:e.target.value})}><option value="peaking">Bell</option>{choices.map(([v,t])=><option value={v} key={v}>{t}</option>)}</select>:<small>Bell</small>}
    <InKey label={meta.label+' bånd inn'} value={b.enabled} onChange={enabled=>patch({enabled})}/></div>
    <div className="cp-encoders"><Encoder label="Frequency" name={meta.label+' frekvens'} value={b.frequency} min={20} max={20000} log color={meta.color} unit="Hz" onChange={frequency=>patch({frequency})}/>
    {!cut&&<Encoder label="Gain" name={meta.label+' gain'} value={b.gain} min={-15} max={15} step={.1} color={meta.color} unit="dB" onChange={gain=>patch({gain})}/>}
    {b.type==='peaking'&&<Encoder label="Width" name={meta.label+' bredde'} value={b.width} min={.11} max={1.5} step={.01} unit="okt" color={meta.color} onChange={width=>patch({width})}/>}</div></div>;
}

function Dynamics({panel,channel,change,meters,playing}) {
  const gate=panel==='gate', s=channel.pro[panel], title=gate?'Gate':'Comp', gr=gate?meters?.gateReduction:meters?.reduction;
  const dial=(key,label,min,max,step,unit,log=false)=> <Encoder key={key} name={title+' '+label} {...{label,min,max,step,unit,log}} color={dynColor} value={s[key]} onChange={v=>change({[key]:v})}/>;
  const live=playing&&!!channel.sourceId&&!!meters;
  return <div className="cp-dynamics"><div className="cp-dynamics-head"><Level label="Gain reduction" db={gr} gr live={live}/>
    {gate?<b className="cp-state">{!live?'Ingen måling':!s.enabled?'Bypass':meters.gateClosed?'Lukket':'Åpen'}</b>:<label className="cp-select">Detector<select aria-label="Kompressorens detektor" value={s.rms?'rms':'peak'} onChange={e=>change({rms:e.target.value==='rms'})}><option value="peak">Manual Peak</option><option value="rms">Manual RMS</option></select></label>}</div>
    <div className="cp-encoders">{dial('threshold','Threshold',gate?-72:-60,0,.5,'dBFS')}{gate?dial('depth','Depth',0,60,.5,'dB'):dial('ratio','Ratio',1,20,.1,':1')}{dial('attack','Attack',gate?.05:.1,300,gate?.05:.1,'ms',true)}{gate&&dial('hold','Hold',10,5000,1,'ms',true)}{dial('release','Release',10,gate?1000:2000,1,'ms',true)}</div>
    <details className="cp-extra"><summary>{gate?'Sidechain-filter':'Knee, make-up, parallell miks og sidechain'}</summary>
      {!gate&&<div className="cp-encoders">{dial('knee','Knee',0,24,.5,'dB')}{dial('makeup','Make-up',-12,24,.5,'dB')}{dial('mix','Wet',0,100,1,'%')}</div>}
      <div className="cp-inlinehead"><h4>Side Chain · Self keyed</h4><InKey label={title+' sidechain-filter inn'} value={s.keyEnabled} onChange={keyEnabled=>change({keyEnabled})}/></div>
      <div className="cp-encoders">{dial('keyHPF','Key HPF',20,5000,1,'Hz',true)}{dial('keyLPF','Key LPF',120,20000,1,'Hz',true)}</div><p className="cp-footnote">Filtrerer detektoren som utløser behandlingen. Dette er ikke et filter på kanalens lyd.</p>
    </details></div>;
}

export function ProcessorScreen({panel,channel,onPatch,meters,onOverview,bandIndex=0,onBandSelect,playing=false,sampleRate=48000}) {
  const {pro}=channel;
  const source=audioSources.find(s=>s.id===channel.sourceId);
  const lesson=useMemo(()=>proSourceLesson(channel.sourceId),[channel.sourceId]);
  const change=(part,patch)=>onPatch({pro:{...pro,[part]:{...pro[part],...patch}}});
  const setBand=(index,patch)=>change('eq',{bands:pro.eq.bands.map((b,i)=>i===index?{...b,...patch}:b)});
  const part=sectionKey[panel], dyn=panel==='gate'||panel==='comp';
  return <section className="cp-screen" aria-label={titles[panel]+' prosessor'}>
    <header className="cp-head"><div><small>PROCESSING / {ids[panel]}</small><h3>{titles[panel]}</h3></div><div>{panel!=='preamp'&&panel!=='filter'&&<InKey label={titles[panel]+' inn'} value={pro[part].enabled} onChange={enabled=>change(part,{enabled})}/>}
      <button type="button" title="Til kanaloversikt" aria-label="Til kanaloversikt" className="cp-back" onClick={onOverview}><ChevronLeft size={14}/>Oversikt</button></div></header>
    {panel==='preamp'?<Preamp {...{channel,onPatch,source,meters,playing}}/>:<div className={'cp-rackbody cp-'+panel}>
      <div className="cp-scope"><div><b>{dyn?'TRANSFER':'RESPONSE'}</b><span>{dyn?'Inn → ut · dBFS':'Frekvens · Hz / gain · dB'}</span></div>
        <ProcessorGraph {...{panel,channel,bandIndex,onBandSelect,sampleRate}} onBand={setBand} onFilter={v=>change('filters',v)} onDynamic={v=>change(part,v)}/>
        <p>{dyn?'Flytt T for å endre terskelen. Kurven viser stabilt nivå; GR viser faktisk demping.':panel==='peq'?'Velg et bånd. Dra sidelengs for frekvens og opp eller ned for gain.':'Slå inn HP eller LP og dra punktet sidelengs for å flytte grensen.'}</p></div>
      {panel==='filter'?<Filter channel={channel} change={v=>change(part,v)}/>:panel==='peq'?<Peq {...{channel,bandIndex}} onBand={setBand}/>:<Dynamics key={panel} {...{panel,channel,meters,playing}} change={v=>change(part,v)}/>}
    </div>}
    <PanelHelp {...{panel,source,lesson}} onApply={v=>change(part,v)}/>
  </section>;
}
export default ProcessorScreen;
