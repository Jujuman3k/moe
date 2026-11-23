import { useMemo } from 'react';
import { ScanLine } from 'lucide-react';
import { responseDb } from '../../audio/proFilters.js';
import { echo, room } from '../../audio/listenSpace.js';
import { listenDynamics, listenFilters } from '../../data/listenProfiles.js';

const width = 420, height = 104;
const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const path = (values, ordinate) => values.map((v,i) => (i ? 'L' : 'M') + (i * width / (values.length - 1)).toFixed(1) + ' ' + ordinate(v).toFixed(1)).join(' ');
const levelTicks = [0,-18,-36,-54].map((db,index) => ({ label: db, y: 6 + (height - 12)*index/3 }));
const amplitudeY = v => 6 + (height - 12) * clamp(-20 * Math.log10(Math.max(0.002,v)) / 54, 0, 1);
function trace(effect, preview) {
  const filter = listenFilters[effect];
  if (filter) {
    const frequencies = Array.from({ length: 144 }, (_,i) => 30 * (16000/30) ** (i/143));
    const y = db => 6 + (height - 12) * (12 - clamp(db,-30,12)) / 42;
    const marker = width * Math.log(filter.frequency / 30) / Math.log(16000 / 30);
    return { title: 'Dette frekvensområdet endret seg', axis: ['30 Hz','1 kHz','16 kHz'], marker, tick: width * Math.log(1000 / 30) / Math.log(16000 / 30),
      ticks: [6,0,-12,-24].map(db => ({ label: db > 0 ? '+' + db : db, y: y(db) })), dry: path([0,0],y), wet: path(frequencies.map(f => responseDb([filter],f)),y), caption: 'Beregnet filterrespons før nivåtilpasning. Venstre er bass, høyre er diskant. Markøren viser filterfrekvensen, og høyden er endringen i dB.',
      stat: effect === 'presence' ? '+9 dB' : '12 dB/okt', alt: effect === 'presence' ? 'Et klokkeformet løft i mellomtonen.' : effect === 'thin' ? 'Responskurven demper bunnen og flater ut mot diskanten.' : 'Responskurven demper diskanten og lar bunnen passere.' };
  }
  if (effect === 'echo' || effect === 'room') {
    // Audition impulse passes through the actual algorithm. Fixed time bins use
    // peaks, so narrow delay taps never disappear when the plot is resized.
    const rate = 24000; const impulse = new Float32Array(rate * 0.6); impulse[0] = 1;
    const response = (effect === 'room' ? room : echo)(impulse, rate);
    const bins = Array(180).fill(0);
    response.forEach((v,i) => { const k = Math.floor(i / response.length * bins.length); bins[k] = Math.max(bins[k], Math.abs(v)); });
    return { title: 'Dette blir igjen etter ett slag', axis: ['0 ms','300 ms','600 ms'], tick: width/2,
      ticks:levelTicks, dry: path(bins.map((_,i) => i === 0 ? 1 : 0),amplitudeY), wet: path(bins,amplitudeY),
      caption: 'Impulssvar: Vi sender ett kort klikk gjennom akkurat denne effekten. Skalaen viser dB i forhold til det opprinnelige klikket.',
      stat: effect === 'echo' ? '2 ekko' : 'Klanghale', alt: effect === 'echo' ? 'To mindre topper følger etter klikket, med 200 ms mellomrom.' : 'Tette, avtakende refleksjoner følger den første toppen.' };
  }
  const measured = preview?.evidence, profile = listenDynamics[effect];
  const timing = ms => ms.toLocaleString('nb-NO', {maximumFractionDigits:1}) + ' ms';
  const settings = [
    ['Terskel', measured ? measured.thresholdDb.toLocaleString('nb-NO', {maximumFractionDigits:1}) + ' dBFS' : profile.relativeDb + ' dB fra opptakets topp'],
    ['Attack', timing(profile.attack)], ['Release', timing(profile.release)],
  ];
  return { title: 'Slik endret nivået seg i opptaket', axis: ['Start','Tid','Slutt'], tick: width/2,
    ticks:levelTicks, dry: measured && path(measured.dry,amplitudeY), wet: measured && path(measured.changed,amplitudeY),
    caption: measured ? 'Målt etter nivåtilpasning. Begge kurvene viser toppnivå over tid i dB, relativt til den høyeste toppen i paret. Følg de sterke anslagene og de svake halene.' : 'Spill A eller B for å se nivåkurvene fra dette opptaket.',
    settings, stat: effect === 'gated' ? 'Gate' : '6:1', alt: effect === 'gated' ? 'Original og gatet opptak: sammenlign nivået i pausene.' : 'Original og komprimert opptak: sammenlign styrkeforskjellene over tid.' };
}

export function ListenEvidence({ effect, preview }) {
  const graph = useMemo(() => trace(effect, preview), [effect, preview]);
  return <figure className="listen-evidence">
    <figcaption><span><ScanLine size={16} aria-hidden="true"/> Lyttelupen</span><strong>{graph.title}</strong></figcaption>
    {graph.wet && <>
      <div className="listen-evidence-legend" aria-hidden="true"><span>A · original</span><span>B · bearbeidet</span><b>{graph.stat}</b></div>
      <div className="listen-evidence-chart">
      <div className="listen-evidence-scale" aria-hidden="true">{graph.ticks.map(tick => <span key={tick.label} style={{top:100*tick.y/height+'%'}}>{tick.label}</span>)}</div>
      <svg role="img" aria-label={graph.alt} viewBox={'-2 0 ' + (width+4) + ' ' + height} preserveAspectRatio="none">
        {graph.ticks.map(tick => <line key={tick.label} x1="0" y1={tick.y} x2={width} y2={tick.y} className="listen-evidence-grid"/>)}
        {graph.marker != null && <line x1={graph.marker} x2={graph.marker} y1="0" y2={height} className="listen-evidence-marker"/>}
        <path d={graph.dry} className="listen-evidence-a"/><path d={graph.wet} className="listen-evidence-b"/>
      </svg></div>
      <div className="listen-evidence-axis" aria-hidden="true"><span>{graph.axis[0]}</span><span style={{left:100 * graph.tick/width + '%'}}>{graph.axis[1]}</span><span>{graph.axis[2]}</span></div>
    </>}
    <p>{graph.caption}</p>
    {graph.settings && <dl className="listen-evidence-values">{graph.settings.map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>}
  </figure>;
}
