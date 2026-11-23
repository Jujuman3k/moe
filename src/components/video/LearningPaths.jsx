import { createElement, useState } from 'react';
import { AudioLines, Check, ChevronDown, Film, Map, ScanLine } from 'lucide-react';
import { learningPaths } from '../../data/learningPaths.js';
import { allVideos } from '../../utils/videoLibrary.js';

export function LearningPaths({ trackId, navigate, progress }) {
  const [expanded, setExpanded] = useState(false);
  const track = learningPaths.find(item => item.id === trackId);
  const active = track || learningPaths[0];
  const open = expanded || Boolean(track);
  const video = allVideos.find(v => v.id === active.video);
  const watched = progress.completed.includes(video.videoId);
  const steps = [
    {icon:Film, type:'Se', label:video.title, detail:active.watch, done:watched, open:()=>navigate('videos',{track:active.id,video:video.videoId})},
    {icon:AudioLines, type:'Miks', ...active.lab, open:()=>navigate(active.lab.page,active.lab.params)},
    {icon:ScanLine, type:'Løs', ...active.finish, done:active.finish.params.scenario && progress.solved.includes(active.finish.params.scenario), open:()=>navigate(active.finish.page,active.finish.params)},
  ];
  return <section className="vl-paths" aria-labelledby="vl-path-title">
    <div className="vl-paths-top"><Map size={23} aria-hidden="true"/><div><p className="vl-tag">Fra video til øvelse</p><h2 id="vl-path-title">Praktiske læringsløp</h2></div>
      <button type="button" aria-expanded={open} aria-controls="vl-path-body" onClick={()=>{ if(track) { setExpanded(false); navigate('videos'); } else setExpanded(!expanded); }}>{open?'Lukk løpene':'Vis læringsløp'}<ChevronDown size={16}/></button></div>
    {open && <div id="vl-path-body">
      <div className="vl-path-picks" role="group" aria-label="Velg læringsløp">{learningPaths.map(p=><button type="button" key={p.id} aria-pressed={active.id===p.id} onClick={()=>navigate('videos',{track:p.id})}>{p.tag}</button>)}</div>
      <h3>{active.title}</h3><p className="vl-path-goal">{active.goal}</p>
      <ol className="vl-path-steps">{steps.map(({icon:Icon,type,label,detail,done,open:visit})=><li key={type}><div className="vl-path-step-type">{createElement(Icon, {size:17, 'aria-hidden':true})}{type}{done&&<span><Check size={13} aria-hidden="true"/> {type==='Se'?'Sett':'Løst'}</span>}</div><p>{detail}</p><button type="button" onClick={visit}>{label}</button></li>)}</ol>
    </div>}
  </section>;
}
