export function SignalModelNote() {
  return <details className="signal-model-note"><summary>Om modellen og dLive</summary>
      <p>En visuell læringsmodell uten lydavspilling eller miksertilkobling. Bølgeformen er tegnet langsommere og med felles zoom for før/etter. Tonepulsen gjør refleksjoner og ekko synlige. Tidsforskyvningene er i millisekunder; bærebølgen er en skisse.</p>
      <p>Nivåene beregnes for testfrekvensen. HPF er et ideelt 12 dB/oktav-filter, EQ er et løft/kutt ved testtonen, gate og kompressor er statiske modeller uten attack/release. Bypass lar deg sammenligne. Klang er en forenklet serie refleksjoner, ikke en kopi av en dLive-effekt.</p>
      <p>Main LR summerer tørr kanal og FX-retur som tilnærmet effekt for ukorrelerte signaler. Meteret er ikke et nøyaktig peak-meter. Pan flytter den tørre kanalen; FX-returen fordeles likt til L/R. Matrix er én mulig distribusjonsvei, og PA viser elektrisk nivå, ikke lydtrykk. Ingen høyttaler- eller rommodell. Parameterendringer beregner en ny skisse; allerede eksisterende klanghaler beholdes ikke når en rute slås av.</p>
      <p>Monitoruttaket er etter processing, med valgfri pre/post-fade. Mute stopper alle sends her; FX er post-fade. Kontroller faktisk Mix Source, routing og mute-oppsett i showet.</p>
      <p>Kilder: <a href="https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing" target="_blank" rel="noreferrer">Allen & Heath · Routing</a>, <a href="https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen" target="_blank" rel="noreferrer">Processing</a> og <a href="https://support.allen-heath.com/hc/en-gb/articles/39793907886609-FX" target="_blank" rel="noreferrer">FX</a>.</p>
    </details>;
}
