import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, AudioLines, ChevronRight, CircleHelp, Headphones, Play, Square } from 'lucide-react';
import { C3500Engine } from '../audio/c3500Engine.js';
import { createC3500Mix, patchC3500Channel, restoreC3500Mix } from '../data/c3500Model.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import ProcessorScreen from '../components/c3500/ProcessorScreen.jsx';
import ReferenceGuide from '../components/c3500/ReferenceGuide.jsx';
import { SurfaceFaders } from '../components/c3500/SurfaceFaders.jsx';
import { SurfaceMeterClock } from '../components/c3500/SurfaceMeters.jsx';
import { BankDynamicsRail, BankScreen, FastBands, FocusStrip, InputRail, MainRail, OverviewScreen, SurfaceTabs } from '../components/c3500/SurfaceScreen.jsx';
import '../styles/c3500-surface.css';

const storageKey='lydteam:c3500:v1';
const panels={bank:'Bank',overview:'Overview',preamp:'Preamp',filter:'Filter',gate:'Gate',peq:'PEQ',comp:'Compressor'};
const help={
  bank:'Velg en kurve i banken for å åpne akkurat den prosessoren.',
  overview:'Se signalbehandlingen på én kanal. Trykk på feltet du vil undersøke.',
  preamp:'Velg opptak og sett inngangsnivå før du former klangen.',
  filter:'Ta bort det som ligger under eller over frekvensområdet du trenger.',
  gate:'Lytt til de svakeste tonene mens du finner terskelen.',
  peq:'Flytt et punkt i kurven og sammenlign klangen med PEQ av og på.',
  comp:'Senk terskelen og følg hvor mye nivå toppene mister.',
};
function loadMix() {
  try {return restoreC3500Mix(sessionStorage.getItem(storageKey));}catch{return createC3500Mix();}
}
// Editor alone subscribes to the selected input. The faders do not re-render on every metering tick.
function LiveEditor({ch,engine,playing,...props}){
  const [level,setLevel]=useState();
  useEffect(()=>{
    if(!engine || !playing)return;
    const id=window.setInterval(()=>setLevel(engine.readMeters()?.channels?.[ch.id]),105);
    return ()=>window.clearInterval(id);
  },[engine,playing,ch.id]);
  return <ProcessorScreen {...props} channel={ch} playing={playing} meters={playing?level:undefined} sampleRate={engine?.run?.ctx?.sampleRate || 48000}/>;
}

export default function C3500Page({initialChannel=1,initialPanel='bank',onRouteChange,onSignal}) {
  const [local,setLocal]=useState({ch:initialChannel,panel:initialPanel});
  const rawCh=onRouteChange?initialChannel:local.ch,rawPanel=onRouteChange?initialPanel:local.panel;
  const channelId=Math.max(1,Math.min(24,Math.trunc(Number(rawCh))||1)),panel=Object.hasOwn(panels,rawPanel)?rawPanel:'bank';
  const [mix,setMix]=useState(loadMix), mixRef=useRef(mix);
  const channel=mix.channels[channelId-1];
  const [status,setStatus]=useState('idle'),[error,setError]=useState('');
  const [engine,setEngine]=useState(null),engineRef=useRef(null);
  const deskRef=useRef(null), screenRef=useRef(null), [bandIndex,setBandIndex]=useState(0);
  const mobile=useMediaQuery('(max-width:599px)'), medium=useMediaQuery('(max-width:1149px)'),narrow=useMediaQuery('(max-width:759px)');
  const screenSize=mobile?4:narrow?6:12, visibleCount=mobile?4:narrow?6:medium?12:24;
  // Paging the desk does not switch the selected channel or alter the audio.
  const [pages,setPages]=useState(null);
  const screenPage=pages?.id===channelId&&pages?.screenSize===screenSize&&pages?.screen!=null ? pages.screen : Math.floor((channelId-1)/screenSize);
  const faderPage=pages?.id===channelId&&pages?.visibleCount===visibleCount&&pages?.fader!=null ? pages.fader : Math.floor((channelId-1)/visibleCount);
  const playing=status==='playing',busy=status==='loading';
  useEffect(()=>()=>{engineRef.current?.dispose();},[]);
  useEffect(()=>{try{sessionStorage.setItem('lydteam:c3500:last-input',String(channelId));}catch{/* storage unavailable */}},[channelId]);
  useEffect(()=>{
    // Coalesce writes while dragging a fader. Flush on route exit / pagehide as well.
    const save=()=>{try{sessionStorage.setItem(storageKey,JSON.stringify(mixRef.current));}catch{/* private mode */}};
    const timer=window.setTimeout(save,220);
    window.addEventListener('pagehide',save);
    return ()=>{clearTimeout(timer);window.removeEventListener('pagehide',save);};
  },[mix]);
  useEffect(()=>()=>{try {sessionStorage.setItem(storageKey,JSON.stringify(mixRef.current));}catch{/* private mode */}},[]);
  const update=useCallback(next=>{mixRef.current=next;engineRef.current?.setMix(next);setMix(next);},[]);
  const patch=useCallback((id,change)=>update(patchC3500Channel(mixRef.current,id,change)),[update]);
  const go=useCallback((id,nextPanel)=>{
    setPages(null);
    if(onRouteChange) {if(id!==channelId||nextPanel!==panel)onRouteChange(id,nextPanel);}
    else setLocal({ch:id,panel:nextPanel});
  },[channelId,panel,onRouteChange]);
  const open=next=>go(channelId,next);
  const select=useCallback(id=>go(id,panel),[go,panel]);
  function transport(){
    if(playing||busy){engineRef.current?.stop();return;}
    if(!engineRef.current){
      engineRef.current=new C3500Engine({onStatus:(s,msg='')=>{setStatus(s);setError(msg);}});
      setEngine(engineRef.current);
    }
    void engineRef.current.play(mixRef.current);
  }
  const phones=mix.channels.filter(c=>c.pafl).map(c=>c.id);
  function learn(){
    const node=panel==='preamp'?'preamp':panel==='bank'?'fader':'processing';
    const tool={filter:'hpf',peq:'peq',gate:'gate',comp:'comp'}[panel];
    onSignal?.(node,{source:channel.sourceId || undefined,mode:'pro',...(tool?{tool}:{})});
  }
  return <div className="c35" ref={deskRef}>
    <header className="c35-intro"><div><p className="c35-eyebrow"><i/> LYDTEAM <span>/</span> KONSOLLROM</p>
      <h1>dLive <strong>C3500</strong></h1><p>Velg en kanal, åpne prosessoren og hør hva som skjer i miksen.</p></div>
      <div className="c35-actions"><ReferenceGuide onPanel={(id,band)=>{if(band!=null)setBandIndex(band);open(id);}}/><button type="button" className="c35-play" aria-label={playing?'Stopp miks':busy?'Avbryt lydstart':'Spill miks'} onClick={transport}>{playing||busy?<Square size={16} fill="currentColor"/>:<Play size={16} fill="currentColor"/>}{playing?'Stopp miks':busy?'Avbryt':'Spill miks'}</button></div>
    </header>
    {error&&<div className="c35-error" role="alert">{error}</div>}
    <div className="c35-chassis"><div className="c35-brandbar"><b><AudioLines size={17}/> dLive <span>C3500</span></b><div><i data-playing={playing}/>{playing?'TRANSPORT I GANG':busy?'LASTER OPPTAK':'TRANSPORT STOPPET'}</div></div>
      {phones.length>0&&<div className="c35-phonealert" role="status"><Headphones size={15}/><strong>PAFL</strong> Du lytter til IP {phones.join(', ')} før fader.<button type="button" onClick={()=>update({...mix,channels:mix.channels.map(c=>c.pafl?{...c,pafl:false}:c)})}>Tøm PAFL</button></div>}
      <div className="c35-glass" ref={screenRef}><SurfaceTabs panel={panel} onOpen={open}/>
        <FocusStrip ch={channel} onOpen={open} onPatch={p=>patch(channelId,p)}/>
        <div className="c35-screenbody" data-bank={panel==='bank'}>
          <InputRail ch={channel} onOpen={open}/>
          <div className="c35-center">
            {panel==='bank'?<BankScreen channels={mix.channels} selected={channelId} onOpen={go} page={screenPage} size={screenSize} onPage={p=>setPages({id:channelId,screenSize,visibleCount,screen:p,fader:faderPage})}/>:
              panel==='overview'?<OverviewScreen ch={channel} onOpen={open}/>:
              <LiveEditor key={channelId} ch={channel} panel={panel} engine={engine} playing={playing} onPatch={p=>patch(channelId,p)} onOverview={()=>open('overview')} bandIndex={bandIndex} onBandSelect={setBandIndex}/>}
          </div>
          {panel==='bank'&&<BankDynamicsRail ch={channel} onOpen={open}/>}
          <MainRail mix={mix} onMaster={masterDb=>update({...mixRef.current,masterDb})}/>
        </div>
        <FastBands ch={channel} panel={panel} bandIndex={bandIndex} onBand={i=>{setBandIndex(i);open('peq');}}/>
      </div>
      <div className="c35-orient"><div className="c35-crumb" aria-label="Plassering på mikseren"><button type="button" onClick={()=>open('bank')}>Bank</button><ChevronRight size={12}/><button type="button" onClick={()=>open('overview')}>IP {channelId}</button>{panel!=='bank'&&<><ChevronRight size={12}/><b>{panels[panel]}</b></>}</div><p>{help[panel]}</p>{onSignal&&<button className="c35-deeper" type="button" onClick={learn}>Følg i signalveien <ArrowRight size={14}/></button>}</div>
      <SurfaceFaders mix={mix} selected={channelId} onSelect={select} onPatch={patch} onOpenSelected={()=>{open('overview');screenRef.current?.scrollIntoView({block:'start'});}} visibleCount={visibleCount} page={faderPage} onPage={p=>setPages({id:channelId,screenSize,visibleCount,screen:screenPage,fader:p})}/>
      <SurfaceMeterClock engine={engine} playing={playing} root={deskRef}/>
    </div>
    <details className="c35-about"><summary><CircleHelp size={16}/> Slik er øverommet koblet</summary><p>Øverommet har 24 innganger og sju forskjellige opptak. IP 1–3 starter som kick, bass og skarp. IP 4–7 har vokaler, piano og gitar med Mute på. Åpne Preamp for å bytte kilde eller patche en ledig inngang. To innganger med samme kilde deler opptaket, men får hver sin prosessering.</p><p>Main LR viser summen til miksen. PAFL endrer bare lyttingen. Nivåmålerne får signal fra nettleserens lydmotor når du trykker Spill miks. Dette er en selvstendig øvingssimulator; eksterne inserts, kanal-delay og mikserens komplette lagoppsett er ikke modellert. Miksen huskes i denne fanen.</p></details>
  </div>;
}
