# Lyd i signalverkstedet

Denne siden beskriver den opprinnelige lydmotoren i Enkel-modus. Se [Enkel og Pro](signal-pro.md) for den utvidede PEQ-en, filtre, gate og kompressor.

«Velg lyd» øverst åpner sju opptak: mannsvokal, kvinnevokal, piano, bass, akustisk gitar, kick og skarptromme. Velg et opptak og trykk «Spill og miks». Én kilde spilles i loop gjennom kanalens signalkjede. Opptakene er uavhengige øvingsklipp; dette er ikke en flersporslåt eller DAW.

Spill/stopp og Original/Mikset ligger i den faste verktøylinjen. Lydvalg inneholder lyttepunkt (Main LR, monitor eller PA), separat lyttevolum, animasjonsvalg og nullstilling. Valg av lyd eller fullskjerm endrer ikke parameterne. Bok-knappen viser lyttetips for kilden og valgt ledd, med avgrensede forslag man kan prøve. Overgang til eldre fordypningsverktøy stopper opptaket, slik at det ikke spiller over videoer eller andre verktøy.

## Lydmotor

- `src/audio/SignalAudioEngine.js` håndterer brukerutløst AudioContext, lasting, dekoding, cache, kildebytte, kansellering og opprydding. Ingen mikrofon eller konto brukes. Ingen lyd starter automatisk.
- `src/audio/signalAudioGraph.js` kobler inngang → gain/klipping → HPF → gate → parametrisk EQ → kompressor → mute → fader. Monitor har pre/post-valg. Post-fade FX-send går til klang/delay og retur. Tørr kanal og retur summeres til Main → matrix → PA.
- `src/audio/gate.worklet.js` behandler gaten på lydtråden med peak-detektor, hysterese, 50 ms hold, 2 ms åpning og 80 ms lukking. Ingen hovedtrådtimer styrer gaten.
- HPF er et andreordens høypass. EQ har ett peaking-bånd, 40–8000 Hz, ±12 dB og fast Q 0,8. Nettleserkompressoren har 10 ms attack, 150 ms release og 6 dB knee. Den har nettleserens innebygde nivåkompensasjon; gain reduction vises separat.
- Klang er en deterministisk, generert stereoimpuls med omtrent angitt −60 dB-tid. Delay har 80–800 ms tid og maksimalt 75 % feedback. Endringer i klangtid erstatter romresponsen; dette er ikke en sømløs dLive-emulering.
- Gain- og faderendringer glattes med 12 ms tidskonstant. Overstyring i preamp klippes før faderen. Å senke faderen reparerer derfor ikke forvrengningen.
- Main, monitor og PA velges som lyttepunkt. Original bruker fast −18 dBFS peak-referanse før sentrert panorering. Kanal og referanse har samme mono-panoreringslov, slik at en urørt miks og Original starter på samme nivå. A/B er ikke automatisk nivåmatchet etter justeringer. Kanal-mute og ruting gjelder «Mikset»; Original er en separat referanse.
- Lyttevolum, en kompressor som begrenser utgangen, og et endelig tak på ±0,7 ligger etter lyttevalget og utenfor kjedens målere. Dette begrenser digitale topper, men angir ikke lydtrykket fra brukerens utstyr.

Alle klipp er mono og normaliseres én gang ved dekoding til peak 1 før det valgte kildenivået legges til. Med standard −48 dBFS kilde og +30 dB gain er preamp-toppen omtrent −18 dBFS. Normalisering skjer aldri under justering av fadere.

Meterverdiene kommer fra den faktiske lyden (sample-peak over 4096 samples, oppdatert 10 ganger/sekund). Dette er ikke true-peak- eller SPL-måling, og helt korte topper mellom målevinduene kan overses. Livebølgen har fast zoom ×4 og oppdateres opptil 25 ganger/sekund. Visuell pause stopper bevegelsen, ikke lyden. Ingen av justeringene overskriver originalfilen.

Den lydløse bølgeskissen og de eksisterende oppdragene er beholdt. Oppdrag vurderes etter innstillingene i modellen, ikke ved å bedømme lydopptakets musikalske kvalitet. Lyd slås av ved skjult side, sidenavigasjon eller åpning av fordypningsverktøy. Lydvalg og innstillinger beholdes i denne økten, ikke etter sideoppdatering.

## Opptak og bruksrett

Alle sju originalene er publisert som CC0 på Freesound. Appen bruker de offentlig tilgjengelige HQ MP3-forhåndsvisningene, ikke innloggingsbeskyttede originalnedlastinger. Klippene følger med appen; avspilling kontakter ikke Freesound. Den samlede nedlastingen for alle lydfiler er omtrent 850 KiB; bare valgt kilde lastes.

| Valg | Opphav | Kilde | Tilpasning |
| --- | --- | --- | --- |
| Mannsvokal | Apisov | [voice.wav](https://freesound.org/people/Apisov/sounds/496234/) | Kort sunget frase, stillhet til 3 s |
| Kvinnevokal | buggly | [feminine voice singing random melody](https://freesound.org/people/buggly/sounds/505438/) | Omtrent 12 s |
| Piano | josefpres | [Piano loops 216 octave short loop 120 bpm](https://freesound.org/people/josefpres/sounds/874647/) | Første 12 s |
| Bass | josefpres | [01 Bass guitar loop 110 bpm.wav](https://freesound.org/people/josefpres/sounds/483926/) | 2,181 s |
| Gitar | smallclone | [Acoustic guitar loop.wav](https://freesound.org/people/smallclone/sounds/693197/) | Første 12 s |
| Kick | dossantosbarbosa | [KickNormal2.wav](https://freesound.org/people/dossantosbarbosa/sounds/221144/) | Ett akustisk slag, stillhet til 1 s |
| Skarp | dossantosbarbosa | [SnareNormal2.wav](https://freesound.org/people/dossantosbarbosa/sounds/221143/) | Ett akustisk slag, stillhet til 1 s |

Tilpasset til mono, 44,1 kHz, MP3 160 kbps, 3 ms innfading og 30 ms utfading. Romlyd eller behandling fra originalopptakene er ikke fjernet. Lisens, eksakte forhåndsvisningsadresser, filstørrelser, bearbeiding og SHA-256 er dokumentert i `public/audio/credits.json`. `scripts/prepare-audio.py` kan gjenskape klippene med ffmpeg. En annen encoder-versjon kan gi en annen binær hash; kildens hash kontrolleres før bearbeiding.

Tekniske referanser: [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet), [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode), [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode).

## Verifikasjon

Kontrollert 18. oktober 2026:

- `npm run lint`, `npm test` (29 tester) og `npm run build` bestått.
- 38 UI-kontroller på desktop og emulert mobil: 36 bestod i samlet kjøring; de to layoutkontrollene bestod ved ny kjøring etter retting av knappehøyde i liggende visning. Eksisterende navigasjon, videoarkiv, øvelser og signalverktøy inngår.
- Alle sju opptak lastes, dekodes og spiller i begge nettleserprofilene. Kildebytte beholder innstillinger. Lyttepunkt, A/B, lyttetips, feil ved lasting, nytt forsøk, avbrutt lasting og lukking av lydkontekst er kontrollert.
- Fire tester gjengir faktiske PCM-samples gjennom produksjonens lydgraf: fader/ruting, HPF/EQ/gate/kompresjon/klipping, delay/klang og lyttevolum/A/B/utgangstak. Alle fire bestod etter siste retting av mono-panoreringsloven.
- Lydpaneler og verktøylinje er kontrollert uten intern scrolling ved 320 × 568, 390 × 664 og 844 × 390. De eksisterende layouttestene dekker også 768 × 1024 og 1440 × 1000.
- Visuelt kontrollert ved 390 × 664 og 1440 × 1000: [lydvalg på mobil](screenshots/signal-audio-picker-mobile.png), [mikser på desktop](screenshots/signal-audio-mixer-desktop.png) og [lyttetips på mobil](screenshots/signal-audio-lesson-mobile.png). Ingen sidefeil eller overflyt i kontrollpanelet ble registrert i denne gjennomgangen.

Nettleserkontrollene brukte Chromium 153 med Playwright og en lokal produksjonsbygging. Fysisk iPhone/iPad, Safari/WebKit og lytting gjennom fysiske høyttalere eller hodetelefoner er ikke testet. Ingen test er en verifikasjon mot en fysisk dLive-mikser.
