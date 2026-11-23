import { useEffect, useRef, useState } from 'react';
import { AudioLines, Check, ChevronDown, CircleHelp, Drum, Ear, Headphones, Lightbulb, MicVocal, Target } from 'lucide-react';
import { BandRoomEngine } from '../audio/bandRoomEngine.js';
import { bandScenes, checkBandBalance, getBandScene, initialBandMix, restoreBandMix } from '../data/bandScenes.js';
import { BandDesk, ScenePicker } from '../components/bandroom/BandDesk.jsx';
import '../styles/bandroom.css';

const sceneIcons={vocal:MicVocal,rhythm:Drum,stereo:Headphones};
const storageKey=id=>'lydteam:bandrom:v1:'+id;
function loadMix(scene) {
  try { return restoreBandMix(scene,JSON.parse(sessionStorage.getItem(storageKey(scene.id)))); }
  catch { return initialBandMix(scene); }
}

function SceneWorkroom({ scene, onScene }) {
  const [mix,setMix]=useState(()=>loadMix(scene)), [compare,setCompare]=useState(false);
  const [selected,setSelected]=useState(scene.focus), [status,setStatus]=useState('idle'), [error,setError]=useState('');
  const [engine,setEngine]=useState(null), engineRef=useRef(null);
  const [feedback,setFeedback]=useState(null), [tip,setTip]=useState(false);
  const playing=status==='playing', busy=status==='loading', Icon=sceneIcons[scene.icon];
  const displayed=compare?{...initialBandMix(scene),masterDb:mix.masterDb}:mix;
  useEffect(()=>()=>{ engineRef.current?.dispose(); },[]);
  useEffect(()=>{
    try { sessionStorage.setItem(storageKey(scene.id), JSON.stringify(mix)); } catch { /* Mixing still works without storage. */ }
  },[mix,scene.id]);
  function update(next, reference=compare) {
    const audible=reference?{...initialBandMix(scene),masterDb:next.masterDb}:next;
    engineRef.current?.setMix(audible);
    setFeedback(null);
    setMix(next);
  }
  function patch(id,change) { if(!compare) update({...mix,channels:mix.channels.map(t=>t.id===id?{...t,...change}:t)}); }
  function toggle(value) {
    engineRef.current?.setMix(value?{...initialBandMix(scene),masterDb:mix.masterDb}:mix);
    setCompare(value);setFeedback(null);
  }
  function transport() {
    if(playing||busy){engineRef.current?.stop();return;}
    if(!engineRef.current) {
      engineRef.current=new BandRoomEngine({onStatus:(state,message='')=>{setStatus(state);setError(message);}});
      setEngine(engineRef.current);
    }
    void engineRef.current.play(displayed);
  }
  function reset() {
    setCompare(false);update(initialBandMix(scene),false);setSelected(scene.focus);setTip(false);
  }
  function evaluate() {
    const guidance=checkBandBalance(scene,mix);
    setFeedback(guidance?{success:false,text:guidance}:{success:true,text:scene.why});
  }
  return <div className="br-room animate-fade-in">
    <header className="br-intro"><div><p className="br-eyebrow"><AudioLines size={16}/> Flerkanalsstudio</p><h1>Bandrommet</h1><p>Miks tre separate øvingsopptak i stereo. Velg en scene og form lyden med fader og panorama.</p></div>
      <ScenePicker scene={scene} scenes={bandScenes} onSelect={onScene}/></header>
    <div className="br-brief"><div className="br-scene-symbol"><Icon size={23}/></div><div><p className="br-eyebrow">{scene.topic}</p><h2>{scene.title}</h2><p>{scene.brief}</p></div></div>
    <BandDesk scene={scene} displayed={displayed} selected={selected} setSelected={setSelected} compare={compare} toggleCompare={toggle} status={status} playing={playing} busy={busy} error={error} onTransport={transport} patch={patch} onMaster={masterDb=>update({...mix,masterDb})} engine={engine} onReset={reset}/>
    <section className="br-coach" aria-label="Øvingsmål">
      <div className="br-coach-copy"><p className="br-eyebrow"><Target size={15}/> Øvingsmål</p><h2>Prøv det på øret</h2><p>{scene.target}</p></div>
      <div className="br-coach-tools"><button type="button" className="br-check" disabled={!playing||compare} onClick={evaluate}><Ear size={17}/> Sjekk miksen</button><button type="button" className="br-tip-toggle" aria-expanded={tip} aria-controls="band-tip" onClick={()=>setTip(!tip)}><Lightbulb size={15}/>{tip?'Skjul lyttetips':'Vis lyttetips'}</button></div>
      {(!playing||compare) && <p className="br-coach-note">Spill «Din miks» med alle kanalene for å sjekke balansen.</p>}
      {tip && <p className="br-tip" id="band-tip">{scene.tip}</p>}
      {feedback && <div className="br-feedback" data-success={feedback.success} role="status">{feedback.success?<Check size={19}/>:<Ear size={19}/>}<div><b>{feedback.success?'Øvingsmålet er nådd':'Prøv ett grep til'}</b><p>{feedback.text}</p></div></div>}
    </section>
    <details className="br-about"><summary><CircleHelp size={17}/> Om opptakene og målerne <ChevronDown size={15}/></summary>
      <p>Scenene er bygd av separate opptak, ikke spor fra samme låt. Kick og skarp spiller et fast mønster på 110 BPM. Melodiske fraser gjentas i sin egen lengde og beholder tonehøyden.</p>
      <p>Kanalene har samme toppreferanse ved start, men kan oppleves ulikt sterke. Kanalmåleren viser nivå etter fader, solo og mute; MAIN LR viser faktisk stereo ut. Startmiks bruker den samme masterinnstillingen som din miks. Øvingsmålet sammenligner fader- og panoramaverdier, ikke det menneskelige øret.</p>
      <p>Miksen huskes per scene i denne fanen når nettleseren tillater det. Velger du en annen scene, stopper avspillingen.</p>
    </details>
  </div>;
}

export default function BandRoomPage({ initialScene, onSceneChange }) {
  const [local,setLocal]=useState(initialScene);
  const scene=getBandScene(onSceneChange?initialScene:local);
  return <SceneWorkroom key={scene.id} scene={scene} onScene={onSceneChange||setLocal}/>;
}
