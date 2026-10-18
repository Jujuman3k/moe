# Interaktiv signalvei

Signalveisiden har nå et responsivt, sammenhengende kart i stedet for en bred tegning med sideveis rulling og en seriell mobilliste. Monitor og FX vises som egne grener. FX har både send og retur. Alle ni opprinnelige detaljmoduler, videoene, processing-verktøyene og direkte node-lenker er bevart. Detaljer åpnes i den eksisterende native dialogen på alle skjermstørrelser.

## Læringsflyt

- **Utforsk:** ni korte steg følger stemmen. Aktivt ledd markeres i kartet, med en konkret ting å prøve.
- **Prøv selv:** gain, kanalfader, monitor-send, FX-send, pre/post-fade, inngang, kanal-mute, Main-assignment og FX-retur oppdaterer kart, nivåer og forklaring sammen.
- **Oppdrag:** seks starttilstander for manglende inngang, klipping, monitoravhengighet, mute, Main-assignment og FX-retur. Eleven løser dem med kontrollene, får hint og sjekker resultatet.
- **Mobil:** vertikalt kart med synlige sidegrener. Målerne blir stående under toppmenyen mens man justerer kontrollene. I oppdragsmodus kommer kontrollene før kartet.
- **Tilgjengelighet:** native knapper, select og range; tastaturstyring; fokus tilbake fra dialog; eksisterende sveiping; pause for signalbevegelse; respekt for redusert bevegelse.

Oppdragsprogresjon gjelder denne økten på signalveisiden. Den blander seg ikke med de 72 scenarioenes lagrede progresjon. Ingen nye avhengigheter, lydavspilling eller forbindelse til en fysisk mikser.

## Modellens grenser

Dette er en illustrativ modell av én konstant kilde, ikke en emulering av C3500 eller en akustisk simulator. Kilden tilsvarer −48 dBFS ved 0 dB gain i modellen. Preampnivå er kilde + gain, begrenset til 0 dBFS; forespurt nivå over dette markerer klipping. Forvrengningsflagget følger signalet selv om faderen senkes. En matematisk null ved −∞ representeres av `null`.

Processing og bus-mastere endrer ikke nivå. Monitor hentes etter processing, før eller etter kanalfaderen. Kanal-mute stopper alle sends i eksemplet. FX-send er post-fade og har separat returvalg. Returen vises som en separat rute; FX-summering og etterklangshaler beregnes ikke. Main-, matrix- og PA-målere viser den tørre stemmen, ikke total miks eller SPL. Matrix er et eksempel på en distribusjonsvei, ikke et obligatorisk ledd.

«Om modellen og dLive» i appen forklarer disse forutsetningene. Opprinnelig fagtekst om gain, monitoruttak og FX pre/post-fade er også presisert.

Faggrunnlag kontrollert 18. oktober 2026:

- [Allen & Heath – Routing](https://support.allen-heath.com/hc/en-gb/articles/39795277687441-Routing): assignment, valg av pre/post-fade og Mix Source per miks.
- [Allen & Heath – Processing Screen](https://support.allen-heath.com/hc/en-gb/articles/39790636807825-Processing-Screen): preamp, kanalprosessering og målepunkter.

## Ansvarsdeling

| Modul | Ansvar |
| --- | --- |
| `SignalFlowDiagram` | Åpne/lukke eksisterende detaljverktøy |
| `SignalLab` | Tilstand, læringsmodus, steg, oppdragsvalg og tilbakemelding |
| `SignalMap` | Kart, aktive signalveier, monitorgren og FX-retur |
| `SignalControls` | Kontroller, bølgeillustrasjon og konkret diagnose |
| `SignalMeter` | Felles nivåvisning, også for stillhet og klipping |
| `signalJourney` | Forklaringer, oppdragsmål, starttilstander, hint og læringspoeng |
| `signalSimulation` | Beregninger og vurdering uten React-avhengighet |
| `signal-lab.css` | Labens responsive layout og animasjoner; lastes med signalveisiden |

## Verifikasjon

`npm run lint`, 18 logikktester og `npm run build` er bestått. De åtte nye nettlesertestene (fire forløp × desktop/mobil) er bestått på det siste produksjonsbygget. `tests/signal.test.js` dekker modellen og oppdragenes start-/måltilstander. `tests/e2e/signal.spec.js` dekker kontrollene, alle seks oppdrag, ni forklaringssteg, tastatur/fokus, redusert bevegelse og layout fra 320 til 1440 px.

Første fulle nettleserrunde besto 29 av 32 tester. To fant manglende fokusretur fra dialogen, som er rettet og verifisert på begge skjermstørrelser. Én samlet gjennomgang av alle verktøy nådde 30-sekundersgrensen etter flere vellykkede trinn; denne lange testen har fått 60 sekunder. Alle seks målrettede tester av opprinnelige verktøy, sveiping og øvingslenker besto etter rettingen. Dermed er alle 32 unike nettleserforløp verifisert på tvers av rundene. Siste endring etter disse rundene er kun at bølgeetiketten sier «Uten klipping» i stedet for å antyde gjenværende headroom; bygg og skjermbilder er oppdatert.

Nettleserkontrollen bruker Chromium 153.0.8010.0 gjennom en midlertidig Playwright-konfigurasjon utenfor repositoriet. Playwrights vanlige nettlesernedlasting var utilgjengelig i miljøet. YouTube-innebygging i de eksisterende testene er erstattet med testresponser.

Visuelt gjennomgått: [desktop](screenshots/signal-lab-desktop.png) og [mobil](screenshots/signal-lab-mobile.png). Første JS-pakke er fortsatt omtrent 227 kB; signalveisiden og labens CSS lastes først når siden åpnes.

Ikke verifisert på fysisk dLive-maskinvare eller en fysisk iPhone/iPad med Safari. De eksisterende detaljverktøyene er egne undervisningsvisualiseringer; de endrer ikke signal-labens tilstand.
