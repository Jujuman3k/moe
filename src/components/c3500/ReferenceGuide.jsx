import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Images, X } from 'lucide-react';
import { useModalDialog } from '../../hooks/useModalDialog.js';
import { photos, panelNames } from './ReferencePhotos.js';
import '../../styles/c3500-reference.css';

function PhotoDialog({ onClose, onPanel }) {
  const ref = useRef(null);
  const id = useId();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [markIndex, setMarkIndex] = useState(0);
  useModalDialog(ref);
  const photo = photos[photoIndex];
  const selected = photo.marks[markIndex];
  function changePhoto(index) {
    setPhotoIndex(index);
    setMarkIndex(0);
  }
  return <dialog ref={ref} className="c35-ref-dialog" aria-labelledby={`${id}-title`}
    onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="c35-ref-inner">
      <header className="c35-ref-head">
        <div><p className="c35-ref-kicker">DLIVE C3500 <span>/</span> BILDEATLAS</p><h2 id={`${id}-title`}>Bildereferanser</h2></div>
        <button type="button" className="c35-ref-close" aria-label="Lukk bildereferanser" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      </header>
      <p className="c35-ref-intro">Velg et punkt i originalbildet. Åpne deretter samme del i øvingsmikseren for å høre hva den gjør.</p>
      <div role="group" aria-label="Velg referansebilde" className="c35-ref-tabs">
        {photos.map((p, i) => <button type="button" key={p.file} aria-pressed={i === photoIndex} onClick={() => changePhoto(i)}><span>0{i + 1}</span> {p.tab}</button>)}
      </div>
      <div className="c35-ref-grid">
        <figure className="c35-ref-figure">
          <figcaption><span>Originalbilde · 0{photoIndex + 1}/04</span><strong>{photo.title}</strong></figcaption>
          <div className="c35-ref-frame"><div className="c35-ref-photo" style={{ '--ref-aspect': photo.width / photo.height }}>
            <img key={photo.file} src={`${import.meta.env.BASE_URL}references/${photo.file}.webp`} alt={photo.alt} width={photo.width} height={photo.height} />
            {photo.marks.map((mark, i) => <button type="button" key={mark.label} className="c35-ref-pin" style={{ '--ref-x': `${mark.at[0]}%`, '--ref-y': `${mark.at[1]}%` }}
              aria-label={`Bildepunkt ${i + 1}: ${mark.label}`} aria-pressed={markIndex === i} onClick={() => setMarkIndex(i)}><span>{i + 1}</span></button>)}
          </div></div>
          <p className="c35-ref-credit">Allen &amp; Heath dLive · Utsnitt fra innsendte skjermbilder.</p>
        </figure>
        <section className="c35-ref-guide" aria-label="Forklaring til bildepunktene">
          <p className="c35-ref-kicker">FINN ET KONTROLLFELT</p>
          <div className="c35-ref-key" role="group" aria-label="Bildepunkter som liste">
            {photo.marks.map((mark, i) => <button type="button" key={mark.label} aria-pressed={markIndex === i} onClick={() => setMarkIndex(i)}><span>{i + 1}</span>{mark.label}</button>)}
          </div>
          <div className="c35-ref-detail" aria-live="polite" aria-atomic="true"><h3>{selected.label}</h3><p>{selected.note}</p></div>
          <button type="button" className="c35-ref-jump" onClick={() => { onClose(); onPanel(selected.panel, selected.band); }}>Åpne {panelNames[selected.panel]} i mikseren <ArrowUpRight size={16} aria-hidden="true" /></button>
        </section>
      </div>
    </div>
  </dialog>;
}

export default function ReferenceGuide({ onPanel }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className="c35-ref-trigger" aria-haspopup="dialog" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}><Images aria-hidden="true" size={16} />Bildereferanser</button>
    {open && <PhotoDialog onClose={() => setOpen(false)} onPanel={onPanel} />}</>;
}
