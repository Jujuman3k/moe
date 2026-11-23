import { useMemo, useState } from 'react';
import { BookOpen, Headphones, Layers2, Play, Save, Square, Undo2 } from 'lucide-react';
import { captureProMix, compareProMixes, readProBank, snapshotName, writeProBank } from '../../../utils/proSnapshots.js';
import { proListeningGuides } from '../../../data/proListeningGuides.js';
import '../../../styles/signal-notebook.css';

const slots = ['A','B'];
const panelLabels = { preamp:'Gain', filter:'Høypass', peq:'PEQ', gate:'Gate', comp:'Kompressor' };

function MemorySlot({ slot, entry, selected, onSave, onRecall, onDelete }) {
  const [name,setName] = useState(entry?.name || '');
  const [pending,setPending] = useState(null);
  function commit() {
    if (pending === 'delete') { onDelete(); setName(''); }
    else { const title=snapshotName(name,slot); onSave(title); setName(title); }
    setPending(null);
  }
  return <article className="mixmem-slot" data-slot={slot} data-selected={selected || undefined} aria-label={'Minneplass '+slot}>
    <div className="mixmem-slot-head"><b aria-hidden="true">{slot}</b><div><small>Minneplass {slot}</small><h3>{entry?.name || 'Ledig plass'}</h3></div></div>
    <button type="button" className="mixmem-recall" disabled={!entry} aria-pressed={selected} onClick={()=>{onRecall();setPending(null);}}>Hent miks {slot}</button>
    <details className="mixmem-edit" open={!entry || undefined}>
      <summary>{entry ? 'Lagre eller slett' : 'Lagre her'}</summary>
      <label>Navn på miks {slot}<input value={name} maxLength={32} placeholder={'Miks '+slot} onChange={e=>{setName(e.target.value);setPending(null);}}/></label>
      {pending ? <div className="mixmem-confirm"><p>{pending==='delete' ? 'Slette den lagrede miksen?' : 'Erstatte innstillingene i denne plassen?'}</p><button type="button" onClick={commit}>{pending==='delete' ? 'Slett '+slot : 'Erstatt '+slot}</button><button type="button" onClick={()=>setPending(null)}>Avbryt</button></div> :
        <div className="mixmem-edit-buttons"><button type="button" aria-label={'Lagre nåværende miks i '+slot} onClick={()=>entry ? setPending('save') : commit()}><Save size={15}/> Lagre {slot}</button>{entry && <button type="button" onClick={()=>setPending('delete')}>Slett minne {slot}</button>}</div>}
    </details>
  </article>;
}

export function NotebookEntry({ onOpen }) {
  return <button type="button" className="mixmem-entry" onClick={onOpen}><Layers2 size={19} aria-hidden="true"/><span><b>Miksminne og kildekort</b><small>Lagre A/B, sammenlign to mikser og finn neste lyttegrep</small></span></button>;
}

export function ProNotebook({ source, audio, state, onRecall, canRestore, onRestore, onJump, onClose }) {
  const [bank,setBank] = useState(()=>readProBank(source.id));
  const [openTab,setOpenTab] = useState('mix'), [selected,setSelected] = useState(null);
  const [notice,setNotice] = useState('');
  const [localOnly,setLocalOnly] = useState(false);
  const guide=proListeningGuides[source.id], busy=audio.playing || audio.status==='loading';
  const diffs = useMemo(()=>compareProMixes(bank.A?.mix,bank.B?.mix),[bank]);
  const saveBank = (next,message) => { setBank(next); setLocalOnly(!writeProBank(source.id,next)); setNotice(message); };
  function recall(slot) {
    onRecall(bank[slot].mix); setSelected(slot);
    setNotice('Hentet '+slot+': '+bank[slot].name+'.');
  }
  function restore() {
    onRestore(); setSelected(null);
    setNotice('Miksen fra før sammenligningen er tilbake.');
  }
  function chooseTab(tab) { setOpenTab(tab);setNotice(''); }
  return <div className="mixmem" style={{'--source-accent':source.color}}>
    <div className="mixmem-eyebrow"><Headphones size={15} aria-hidden="true"/> Proverksted · {source.label}</div>
    <h2>Miksminne og kildekort</h2>
    <div role="group" aria-label="Verkstedvisning" className="mixmem-tabs">
      <button type="button" aria-pressed={openTab==='mix'} onClick={()=>chooseTab('mix')}><Layers2 size={16}/> Miksminne A/B</button>
      <button type="button" aria-pressed={openTab==='guide'} onClick={()=>chooseTab('guide')}><BookOpen size={16}/> Kildekort</button>
    </div>
    <div className="mixmem-monitor"><span><i data-playing={audio.playing}/> {audio.listening.original ? 'Originalopptak' : {main:'Main LR',monitor:'Monitor',pa:'PA'}[audio.listening.target]}<small>{audio.status==='loading' ? 'Laster opptaket' : audio.playing ? 'Sløyfen spiller' : 'Avspilling stoppet'}</small></span>
      <button type="button" onClick={()=>busy ? audio.stop() : void audio.play()}>{busy ? <Square size={13}/> : <Play size={14}/>} {busy ? 'Stopp opptaket' : 'Spill opptaket'}</button></div>
    {audio.error && <p role="alert">{audio.error}</p>}
    {openTab==='mix' ? <>
      <p className="mixmem-intro">Lagre miksen slik den låter nå i A. Endre ett grep, lagre i B og veksle mens samme opptak spiller.</p>
      <div className="mixmem-grid">{slots.map(slot=><MemorySlot key={slot} slot={slot} entry={bank[slot]} selected={selected===slot}
        onSave={name=>{saveBank({...bank,[slot]:{name,mix:captureProMix(state)}},'Lagret '+slot+': '+name+'.');}}
        onRecall={()=>recall(slot)} onDelete={()=>{const next={...bank};delete next[slot];saveBank(next,'Minne '+slot+' er slettet.');if(selected===slot)setSelected(null);}}/>)}</div>
      {canRestore && <button type="button" className="mixmem-undo" onClick={restore}><Undo2 size={15}/> Tilbake til miksen før sammenligning</button>}
      {bank.A && bank.B && <details className="mixmem-diff"><summary>{diffs.length ? 'Se forskjellene mellom A og B ('+diffs.length+')' : 'A og B har identiske innstillinger'}</summary>
        {diffs.length>0 && <table><caption className="sr-only">Innstillinger i A og B</caption><thead><tr><th>Kontroll</th><th>A</th><th>B</th></tr></thead><tbody>{diffs.map(d=><tr key={d.label}><th>{d.label}</th><td>{d.before}</td><td>{d.after}</td></tr>)}</tbody></table>}</details>}
      <p className="mixmem-note">Hent bytter behandling, gain, fadere og ruting. Avspillingen fortsetter hvis den allerede går. Lyttevolum og lyttepunkt beholdes. Match nivået med ørene; «Ref» i mikseren er alltid originalopptaket.</p>
      <p className="mixmem-storage">{localOnly ? 'Lagring er blokkert. Minnene beholdes til siden lastes på nytt.' : 'Minneplassene gjelder bare dette opptaket og lagres i denne nettleseren.'}</p>
    </> : <section className="mixmem-guide" aria-label={'Kildekort for '+source.label}><small>Lyttemål · {source.label}</small><h3>{guide.aim}</h3><p>Åpne én kontroll om gangen. Hvert trinn viser deg hvor du kan gjøre forsøket i din egen miks.</p>
      <ol>{guide.steps.map(([panel,title,description,band],i)=><li key={title}><span aria-hidden="true">{i+1}</span><div><h4>{title}</h4><p>{description}</p><button type="button" onClick={()=>onJump(panel,band)}>Åpne {panelLabels[panel]}</button></div></li>)}</ol></section>}
    <p className="mixmem-notice" role="status">{notice}</p>
    <button type="button" className="mixmem-return" onClick={onClose}>Tilbake til mikseren</button>
  </div>;
}
