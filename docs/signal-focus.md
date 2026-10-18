# Fast mikservisning

Signalverkstedet bruker nå et avgrenset mikserpanel. Kart, bølge, utgangsmålere og navigasjon har faste plasser, mens små faner viser kontrollene for valgt ledd. Parameterendringer flytter ikke siden.

Lydvalg og ekte avspilling er senere lagt til uten å endre den faste plasseringen; se [lyd i signalverkstedet](signal-audio.md).

## Bruk

- På skjermer under 900 px bredde åpnes mikseren i en egen fullskjermdialog. Dette er fullskjerm innenfor nettsiden, uten krav til nettleserens Fullscreen API. `100dvh` og safe-area-innrykk tar hensyn til mobilens tilgjengelige plass.
- På større skjermer vises panelet i portalen. Utvid-knappen åpner samme panel i fullskjerm. Lukk-knappen eller Escape tar brukeren tilbake uten å nullstille innstillingene.
- Kartet velger ledd. «Forrige», «Oversikt» og «Neste» ligger alltid nederst. Oversikten viser alle ni ledd, gjeldende nivåer og markering av valgt ledd.
- FX har «Effekt», «Send», «Klang/delay» og «Retur». Processing har egne faner for HPF, EQ, gate, kompressor, ratio og bypass. Øvrige ledd er delt i tilsvarende korte grupper.
- Hvert ledd husker sist brukte fane gjennom leddbytter og inn/ut av fullskjerm. Signalinnstillingene deles fortsatt på tvers av hele kjeden. De lagres ikke over en sideoppdatering.
- Bok-knappen åpner forklaring, diagnose og inngang til de opprinnelige fordypningsverktøyene. Disse beholder egne innstillinger. De eksisterende direkte lenkene til verktøyene fungerer fortsatt.
- Målsymbolet åpner de seks signaloppdragene. «Til kontrollene» går tilbake til relevant ledd/fane; åpne oppdraget igjen for hint og vurdering. Fri utforsking beholder innstillingene.

De vanlige kontrollfanene skal få plass uten rulling ved normal tekststørrelse i de testede skjermstørrelsene. Tekstforstørrelse og svært lave skjermer kan bruke intern rulling som tilgjengelighetsreserve; innholdet klippes ikke bort. Forklaringer, oversikt og oppdragsbeskrivelser kan rulles i egne vinduer.

## Kode

`SignalLab` eier signaltilstanden, valg av ledd/fane, oppdrag og fullskjerm. `signalPanels.js` definerer stabile fane-ID-er og startfanene for oppdrag. `SignalControls` gir tilgjengelige faner med piltaster, Home/End og tilhørende tabpanel. `SignalNodeControls` viser små grupper uten duplisert signaltilstand.

`SignalFullscreen` bruker en native modal dialog, plassert direkte under body via en portal. Bakgrunnen er inert mens dialogen er åpen. `useModalDialog` deler rullelåsing mellom fullskjerm, hjelp og gamle verktøy, og gjenoppretter fokus. Dette hindrer at samtidig avmontering ved nettleserens tilbakeknapp etterlater siden låst.

`signal-focus.css` avgrenser arbeidsflaten og tilpasser den til stående/liggende visning. Nivå- og bølgemodellen er uendret; se [modell og avgrensninger](signal-workbench.md). Ingen nye produksjonsavhengigheter.

## Verifikasjon

Kontrollert 18. oktober 2026:

- `npm run lint`: bestått.
- `npm test`: 26 logikktester bestått. Signalberegningene er uendret.
- `npm run build`: produksjonsbygg bestått.
- 30 nettlesertilfeller bestått mot produksjonsbygget, fordelt på desktop og mobil. Første runde besto 28. Den lange gjennomgangen av alle fordypningsverktøy fikk økt tidsgrense til 120 sekunder og besto ved ny kjøring. Oversiktstesten besto isolert etter avbrudd ved oppstart av nettleserkontekst og treg oppstart som brukte mesteparten av testens tidsgrense.
- Alle kontrollfaner kontrollert ved 320×568, 390×664, 768×1024, 844×390 og 1440×1000: ingen intern rulling i kontrollpanelet ved normal tekststørrelse, og bølge og kontroller innenfor visningen.
- Ekte klikk/berøring på faderen, fast plassering av bølge/navigasjon, faneminne, FX-respons, seks oppdrag, tastaturnavigasjon, fokusretur og nettleserens tilbakeknapp kontrollert.
- Eksisterende videobibliotek, favoritter, progresjon, prosesseringsverktøy, detaljvideoer, direkte lenker og berøringsnavigasjon kontrollert.

Fysisk iPhone/iPad, Safari/WebKit og fysisk dLive er ikke testet. Nettlesertestene bruker Chromium 153 med desktop- og mobiloppsett. YouTube-avspilleren testes med kontrollerte nettverkssvar; ekstern videoavspilling er ikke kontrollert på nytt.

Visuelt kontrollerte skjermbilder: [mobil](screenshots/signal-focus-mobile.png), [liten mobil med delay](screenshots/signal-focus-small-phone.png) og [liggende visning](screenshots/signal-focus-landscape.png).
