import { useEffect, useRef } from 'react';

function path(values) {
  if (!values) return 'M0,50 H640';
  const points = 320; const stride = Math.floor(values.length / points);
  let output = '';
  for (let i = 0; i < points; i++) {
    let sample = 0;
    for (let j = 0; j < stride; j++) { const value = values[i * stride + j]; if (Math.abs(value) > Math.abs(sample)) sample = value; }
    output += `${i ? 'L' : 'M'}${(i / (points - 1) * 640).toFixed(1)},${(50 - Math.max(-1, Math.min(1, sample * 4)) * 46).toFixed(1)} `;
  }
  return output;
}

export function SignalAudioScope({ audio, node, animate }) {
  const before = useRef(null); const after = useRef(null); const wet = useRef(null);
  const showWet = ['fx_branch','mixbus','matrix','speakers'].includes(node.id);
  const { readScope, playing } = audio;
  useEffect(() => {
    let frame; let previous = -Infinity;
    function draw(now) {
      if (now - previous >= 40) {
        const data = playing ? readScope(node.id) : null;
        before.current?.setAttribute('d', path(data?.before));
        after.current?.setAttribute('d', path(data?.after));
        wet.current?.setAttribute('d', path(data?.wet));
        previous = now;
      }
      if (playing && animate) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [readScope, playing, node.id, animate]);
  return <figure className="signal-scope signal-audio-scope" aria-label={`Live lydbølge: ${node.label}`}>
    <figcaption><span>{node.id === 'fx_branch' ? 'Send → effektretur' : 'Lyd før / etter valgt ledd'}</span><span className="scope-legend"><i className="scope-before" /> Før <i className="scope-after" /> Etter {showWet && <><i className="scope-wet" /> FX</>}</span></figcaption>
    <svg viewBox="0 0 640 100" preserveAspectRatio="none" role="img" aria-label="Målt lydbølge fra avspillingen"><path d="M0,50 H640 M160,0 V100 M320,0 V100 M480,0 V100" stroke="#243047" fill="none" /><path ref={before} data-audio-wave="before" stroke="#64748b" strokeWidth="1.5" fill="none" /><path ref={after} data-audio-wave="after" stroke="#2dd4bf" strokeWidth="2" fill="none" />{showWet && <path ref={wet} data-audio-wave="wet" stroke="#c084fc" strokeWidth="1.5" fill="none" />}</svg>
    <div className="scope-caption"><span>{audio.playing ? audio.listening.original ? 'Du hører Original · kurven viser kjeden' : 'Live lyd · fast bølgezoom ×4' : 'Stoppet · trykk Spill øverst'}</span><span>Peak dBFS</span></div>
  </figure>;
}
