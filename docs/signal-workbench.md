# Signalverkstedet – sammenhengende læring

Denne versjonen erstatter plasseringen fra den første signal-laben. Kontroller og tilbakemelding hører nå sammen i én arbeidsflate.

## Bruk

På desktop står signalveikart, før/etter-bølge og målere til venstre, og valgt ledds kontroller til høyre. På mobil festes forhåndsvisningen under toppmenyen mens kontrollene ruller under. På skjermer som er høyst 600 px høye og under 900 px brede, erstattes kartet med en tilgjengelig leddvelger for å beholde plass til kontroller og bølge. Gain og kanalfader er tilgjengelige ved alle ledd.

Et klikk i kartet velger kontroller i hovedlaben. «Flere verktøy, teori og video» åpner de eksisterende fordypningsverktøyene. Disse har egne innstillinger, tydelig forklart i dialogen. Gamle direkte node-lenker fortsetter å åpne detaljvinduet og velger samtidig riktig ledd i bakgrunnen.

| Ledd | Interaktivt innhold |
| --- | --- |
| Kilde | Tilkobling, kildenivå, tonepuls/sinus og testfrekvens |
| Gain | Felles gain, headroom, klippeeksempel og før/etter-kurve |
| Processing | HPF, EQ ved testtonen, gate, kompressor og samlet bypass |
| Fader | Kanalfader, mute, panorama og L/R-målere |
| Monitor | Pre/post-fade og eget sendnivå |
| FX | Av/klang/delay, sendnivå, klangtid, delaytid, feedback og retur |
| Main LR | Assignment, masterfader, tørr/FX-fordeling og forvalg for tørr kanal/effekt |
| Matrix | Eget nivå til PA uten å endre Main eller monitor |
| PA | Utgang av/på og visuell høyttalerrespons |

Ni læringssteg, seks praktiske oppdrag, alle opprinnelige videoer, underverktøy, sveipefunksjoner og 72 scenarioer er bevart. Oppdragsprogresjonen i laben gjelder fortsatt denne økten.

## Modell og avgrensning

Dette er en pedagogisk, deterministisk modell uten lydavspilling eller forbindelse til mikseren. Det er ikke en emulering av C3500 eller en beskrivelse av et bestemt show.

- HPF beregner nivåresponsen ved testfrekvensen for et ideelt 12 dB/oktav-filter. EQ er ett løft/kutt ved samme tone. Gate og hard-knee-kompressor arbeider på det nominelle nivået uten attack/release eller dynamisk detektor.
- Bølgeformen er en skisse med langsom bærebølge. Før og etter har felles zoom. Kildens frekvens brukes i HPF-beregningen, ikke som faktisk lydfrekvens i grafen.
- Delay kopierer tonepulsen med valgt tidsavstand og avtakende feedback. Klang bruker en endelig serie tette, avtakende refleksjoner. Dette visualiserer prinsippene, ikke en produsents DSP-algoritme.
- Tørr kanal og wet-retur summeres som tilnærmet ukorrelert effekt i nivåmodellen. Dette er ikke et presist peak-meter. L/R bruker konstant-effekt-pan for tørr kanal og lik fordeling av retur. Matrix har separat nivå.
- Et beregnet PA-nivå over 0 dBFS gir advarsel. DAC, høyttaler, rom, faktisk SPL og feedback i et rom simuleres ikke. Gamle klanghaler lagres ikke over parameterendringer eller mute; skissen beregnes på nytt.
- Routing/mute er valgt for eksemplet: monitor etter processing, valgfri pre/post-fade, FX post-fade og kanal-mute stopper alle sends.

Faggrunnlag lest 18. oktober 2026: Allen & Heaths [Processing Screen](https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen), [Routing](https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing) og [FX](https://support.allen-heath.com/hc/en-gb/articles/39793907886609-FX). Beregnings- og tegnealgoritmene er appens forenklinger.

## Kode

`SignalLab` eier den felles tilstanden. `SignalControls` gir gain/fader ved alle ledd; `SignalNodeControls` håndterer hvert ledd; `SignalFields` gir tilgjengelige kontroller. `SignalMap` viser ruter og nivåer. `SignalScope` tegner kurver fra `signalWaves.js`, mens `signalSimulation.js` beregner nivåer og oppdragsmål. Ingen nye avhengigheter. Laben lastes fortsatt med signalveisiden.

## Kontroll

Verifisert 18. oktober 2026:

| Kontroll | Resultat |
| --- | --- |
| `npm run lint` | Bestått |
| `npm test` | 26 bestått |
| `npm run build` | Bestått, Vite 7.2.6 |
| Siste nettleserrunde på produksjonsbygget | 18 av 18 bestått: signalverkstedet, gamle detaljverktøy, øvingslenker og touch, på desktop og mobil |
| Øvrige nettlesercase | 18 bestått i den innledende fulle runden; disse sidene ble ikke endret i oppfølgingen |

Kontrollene dekker at fader, bølge og kart er synlige samtidig, faktisk pekertilgang til faderen, alle ni ledd, processing/bypass, klang/delay, mute/ruting, seks oppdrag, gamle verktøy, tastatur/fokus, redusert bevegelse og smale/lave skjermer. Bredder 320–1440 px og kompakt 320 × 568 er kontrollert. Mobiloppsettet bruker en 390 × 664 px viewport. En tidlig runde avdekket at automatisk rulling kunne plassere knapper under den faste forhåndsvisningen eller mobilmenyen; kontrollenes `scroll-margin` retter dette. En separat nettleseroppstart feilet i testmiljøet; den siste runden ble kjørt med én arbeider og bestod uten feil.

Før/etter-testene kontrollerer at faderen ikke endrer inngangskurven, at gain forsterker den faktiske inngangen, og at effektkurven følger Main → Matrix → PA. Delaytid flytter første ekko, feedback gir senere gjentakelser, lengre klangtid beholder mer sen energi, og stengte ruter gir stillhet.

Fysisk dLive og Safari på fysisk iPhone/iPad er ikke verifisert. Nettlesertestene bruker Chromium 153 med desktop- og mobiloppsett. De opprinnelige YouTube-testene bruker testresponser.
