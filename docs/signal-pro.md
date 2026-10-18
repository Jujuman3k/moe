# Enkel og Pro i signalverkstedet

Enkel er fortsatt standard. Knappene **Enkel / Pro** ved kontrollpanelets tittel bytter arbeidsmåte. Pro åpner PEQ, men beholder kilde, avspilling, gain, fadere, effekter og ruting. Hver modus har egne filtre, EQ og dynamikkinnstillinger. Modusbytte kan derfor endre lyden. De seks signaloppdragene åpner Enkel-modus.

## Betjening og læring

- **PEQ:** fire fargede bånd (LF, LM, HM, HF). Dra punktene med mus eller berøring for frekvens/gain. Tastaturpiler flytter også valgt punkt; de vanlige sliderne er et alternativ. Width stilles i oktaver. LF/HF kan bruke klokke, hylle eller høypass/lavpass. Bånd og samlet PEQ kan kobles ut uten å miste innstillingene.
- **Filtre:** HPF 20–2000 Hz med 12/24 dB/okt og LPF 50 Hz–20 kHz med 12 dB/okt. Grensefrekvensene kan dras i kurven.
- **Gate:** threshold, depth, attack, hold og release. Eget HPF/LPF for kanalens sidechain. Terskelen kan også dras i kurven.
- **Kompressor:** threshold, ratio, attack, release, knee, Peak/RMS, manuell make-up og parallell wet/dry. Eget sidechain-HPF/LPF. Kurven viser statisk reduksjon før make-up og parallell blanding; målt punkt/GR følger avspillingen.
- **Gain:** eksisterende inngangsgain, pluss digital trim og polaritetsvending. Trim kommer etter inngangens klipping, og reparerer derfor ikke klipping.
- **Forklaring / bok-knapp:** beskriver hver kontroll, hva man skal lytte etter, og et forsiktig startforslag for valgt opptak. Forslaget viser verdier før bruk, endrer bare valgt prosessor og kan angres. Senere manuelle endringer avslutter denne ene angremuligheten. Kildebytte laster aldri et forslag automatisk.

Forslagene dekker mannsvokal, kvinnevokal, piano, bass, akustisk gitar, kick og skarptromme. De er laget for øving med disse klippene. Vokaltype/kjønn gir ingen fasit for en stemmes EQ. Forslag for vokal, piano, bass og gitar lar gaten være avslått først.

Kurven og målerne ligger i samme faste arbeidsflate som kontrollene. Små parametergrupper erstatter en lang liste. Forklaringer åpnes i en lesedialog. Oversikt-knappen og Forrige/Neste gir vei tilbake til resten av signalveien.

## Lyd og moduler

| Modul | Ansvar |
| --- | --- |
| `src/data/proAudioSettings.js` | Nøytrale innstillinger, bånd, faner og frekvensskala |
| `src/data/proAudioLessons.js` | Forklaringer og avgrensede kildeforslag |
| `src/audio/proAudioGraph.js` | Mono trim → filtre → gate → PEQ → kompressor |
| `src/audio/proDynamics.worklet.js` | Gate og kompressor på lydtråden |
| `src/audio/proFilters.js` | Felles filterspecifikasjon og kurveberegning |
| `src/components/signal/pro/` | Kurver, kontroller og læringsdialog |
| `src/styles/signal-pro.css` | Responsiv Pro-layout |

Pro kobles inn før den eksisterende mute/fader/ruting/FX-kjeden. Enkel-behandlingen er beholdt som egen gren. Parametere glattes med 12 ms tidskonstant; av/på i dynamikkmodellen oppdateres direkte. En global bypass kobler ut filtre, gate, PEQ og kompressor, men ikke trim og polaritet. Stopp, kildebytte, skjult side og opprydding følger den eksisterende lydmotoren.

Gate bruker peak-detektor med 5 ms falltid, 3 dB hysterese, justerbare attack/hold/release og et dempegulv bestemt av depth. Tidsverdiene beskriver modellens eksponentielle tidskonstanter, ikke målinger av dLive. Kompressoren bruker peak med 1 ms detektorfall eller RMS med 20 ms energigjennomsnitt. Gain reduction glattes i dB; ingen automatisk make-up eller lookahead. Wet/dry summeres uten ekstra tidsforskyvning.

Filtrene er Web Audio-biquads. HPF bruker andre- eller fjerdeordens Butterworth; LPF er andreordens. PEQ-bredde konverteres til Q med `sqrt(2^width)/(2^width-1)`, en analog breddekonvensjon; digital båndbredde avviker nær Nyquist. Hyller bruker standard Web Audio-form med fast helning. Grafen beregnes fra samme koeffisientdefinisjoner og aktiv samplingsrate. Den viser det stasjonære frekvenssvaret, ikke overgangen under parameterglattingen.

RTA kommer fra den faktiske lyden etter Pro-PEQ. Den viser FFT-bin-nivå, med egen −100 til 0 dBFS-skala, ikke EQ-kurvens ±18 dB-skala eller akustisk lydtrykk. Meteret viser sample-peak. Uten valgt/spillende lyd er målerne stille, mens EQ-kurven fortsatt kan redigeres. Original/A-B velger bare hva brukeren hører; målerne og RTA viser fortsatt miksekjeden.

## Forholdet til dLive

Brukerens skjermbilder og Allen & Heaths [Processing Screen](https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen) og [Processing specs](https://support.allen-heath.com/hc/en-gb/articles/39827102349457-Processing-specs) er brukt som referanser for kontrollinndeling og navn. Kanal-EQ-en i bildene er en firebånds **PEQ**. dLives **GEQ** er en annen prosessor på mix-utgangene; den er ikke implementert her.

Dette er en selvstendig læringsmodell. Den emulerer ikke DEEP/Dyn8, dLives analoge nivåskala, full kanalbank, fysiske mikrofoninnganger, 48 V, patching, eksterne inserts eller eksterne sidechain-kilder. Tersklene i appen er dBFS. Klippene er fortsatt uavhengige kilder, én om gangen. Appen styrer ingen mikser og overskriver ikke lydfilene.

Teknisk referanse: [Web Audio Q](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/Q) og [W3C Audio EQ Cookbook](https://www.w3.org/TR/audio-eq-cookbook/).

## Verifikasjon

Kontrollert 18. oktober 2026:

- `npm run lint`: bestått uten feil.
- `npm test`: 33 tester bestått, inkludert gate-tider/depth, kompressorkurve, Peak/RMS, parallell miks og alle sju kildeforslag.
- `npm run build`: produksjonsbygg bestått. Ingen nye avhengigheter.
- Playwright i Chromium 153 mot produksjonsbygget: 21 tester bestått, én bevisst duplikatkontroll hoppet over. Åtte lydtester kjøres i begge nettleserprofilene: faktiske PCM-samples, alle fire EQ-bånd, kurve mot native filterrespons, filtre/trim/polaritet, gate/kompressor og sidechain, ruting, FX og A/B.
- Pro-grensesnittet er testet med mus, tastatur og emulert berøring. Bytte mellom Enkel/Pro, beholdte innstillinger, avspilling, kildebytte, forslag og angre er kontrollert.
- Alle parametergruppene og Pro-preamp er kontrollert uten panelscrolling ved 320×568, 390×664, 768×1024 og 844×390. EQ-grafen og kontrollene er samtidig synlige. Normal tekststørrelse; forstørret tekst får fortsatt rullefallback.
- De eksisterende testene for alle sju opptak og lydruting/startforslag bestod i begge nettleserprofilene tidligere i samme endring. Siste oppsett er også visuelt kontrollert ved 390×664 og 1440×1000.

Fysisk lydutstyr, fysisk iPhone/iPad, Safari/WebKit og sammenligning mot en dLive er **ikke testet**. PCM-verifikasjon dokumenterer signalbehandlingen, ikke en subjektiv lyttetest eller identisk klang med dLive.

## Skjermbilder

- [PEQ på mobil](screenshots/signal-pro-peq-mobile.png)
- [Gate på mobil](screenshots/signal-pro-gate-mobile.png)
- [PEQ på stor skjerm](screenshots/signal-pro-peq-desktop.png)
