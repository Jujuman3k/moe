import { AudioLines, Cable, PanelsTopLeft, SlidersVertical } from 'lucide-react';
import '../../styles/console-entry.css';

const processors = [
  { panel:'peq', channel:1, label:'PEQ', caption:'Farg anslaget i kicket' },
  { panel:'gate', channel:3, label:'Gate', caption:'Bevar halen på skarpen' },
  { panel:'comp', channel:2, label:'Comp', caption:'Jevn ut basslinjen' },
];

export function ConsoleEntry({navigate}) {
  const launch = (ch, panel) => navigate('c3500', {ch, panel});
  return <section className="console-entry" aria-labelledby="console-entry-title">
    <div className="console-entry-copy"><p><SlidersVertical size={16} aria-hidden="true"/> Treningspult · C3500</p>
      <h2 id="console-entry-title">Fra signalkart til kanalstripe.</h2>
      <span>Velg en inngang, åpne prosessoren og hør hva grepet gjør. Vil du forstå hvorfor, følg samme ledd i signalveien.</span>
      <div><button type="button" onClick={()=>launch(1,'bank')}><PanelsTopLeft size={17} aria-hidden="true"/> Åpne pulten</button>
        <button type="button" onClick={()=>navigate('signal',{node:'input',source:'kick',mode:'easy'})}><Cable size={17} aria-hidden="true"/> Følg signalet</button></div>
    </div>
    <button type="button" className="console-photo-link" onClick={()=>launch(1,'overview')} aria-label="Åpne kanaloversikten på C3500-pulten">
      <img src="/references/oversikt.webp" width="908" height="547" loading="lazy" alt="Utsnitt fra dLive-skjermen: kanalens prosessorer fordelt i egne felt."/>
      <span>Overview · åpne kanaloversikten</span>
    </button>
    <div className="console-entry-links" role="group" aria-label="Åpne en prosessor på pulten">
      <p><AudioLines size={16} aria-hidden="true"/> Direkte til en kontroll</p>
      {processors.map(p=><button type="button" key={p.panel} onClick={()=>launch(p.channel,p.panel)}><strong>{p.label}</strong><span>{p.caption}</span><small>IP {String(p.channel).padStart(2,'0')}</small></button>)}
    </div>
  </section>;
}
