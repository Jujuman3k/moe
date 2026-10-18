# LydTeam Pro

Norsk læringsportal for lydteknikk og Allen & Heath dLive C3500. Bygget med React 19, Vite, Tailwind CSS og Lucide.

## Kom i gang

Bruk Node.js 22.12+ eller 24 og npm.

```sh
npm ci
npm run dev
```

## Kontroll før levering

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Nettlesertestene starter en lokal forhåndsvisning av **produksjonsbygget** på port 4173. Kjør `npm run build` først. YouTube-avspillere og miniatyrbilder erstattes med testresponser; reell avspilling må kontrolleres separat.

## Kodestruktur

| Mappe / fil | Ansvar |
| --- | --- |
| `src/App.jsx` | Laster sider og kobler navigasjon til læringsprogresjon |
| `src/pages/` | Hjem, videoarkiv, signalvei og øvingsoppgaver |
| `src/data/videoData.js` | 92 videoer fordelt på 8 kategorier |
| `src/data/signalPathData.js` | Signalveiens 9 ledd, undertrinn, fagtekst og videolenker |
| `src/data/practiceScenarios.js` | Samler 72 scenarioer fra fagmodulene; lastes med øvingssiden |
| `src/data/practice/` | 12 fagmoduler med 6 scenarioer hver, og felles kilderegister |
| `src/data/practiceCatalog.js` | Lett katalog med temaer, nivåer og stabile ID-er for progresjon |
| `src/components/video/` | Felles avspiller, søkefelt, videokort og videohøydepunkter |
| `src/components/signal/` | Responsivt signalveikart, kontroller, målere, læringslab og detaljpanel |
| `src/data/signalJourney.js` | Ni forklaringssteg og seks praktiske signaloppdrag |
| `src/data/signalPanels.js` | Kontrollfaner og oppdragenes startfaner |
| `src/utils/signalSimulation.js` | Sammenkoblet nivåmodell, processing, ruting og oppdragsmål |
| `src/utils/signalWaves.js` | Illustrative før/etter-bølger, klangrefleksjoner og delay |
| `src/components/visualizers/` | Én modul per eksisterende simulator eller visualisering |
| `src/components/learning/` | Pre/post-lab og øvingskort |
| `src/components/ui/` | Knapper, progresjonslinje, modal, ikoner og dreieknott |
| `src/components/layout/` | Toppmeny, mobilmeny og sideramme |
| `src/hooks/` | Navigasjon, mediespørring, sveiping og lagring |
| `src/utils/` | Søk, validering av progresjon, frekvensskala og lab-beregning |
| `src/styles/app.css` | Appens visuelle stil og animasjoner |
| `tests/` | Logikktester og Playwright-tester |

## Videreutvikle med KI

- **Ny video:** legg den inn i riktig kategori i `videoData.js`. Behold stabile `id`- og `videoId`-verdier; progresjon og favoritter bruker `videoId`.
- **Nytt øvingscase:** legg til et objekt i relevant fagmodul under `data/practice/` og ID-en i `practiceCatalog.js`. Bruk tre svaralternativer med én korrekt valgmulighet, forklaring på hvert svar, `level` (1–3), `hint`, `lesson`, eksisterende `nodeId` og `sourceId` fra `sources.js`. Behold ID-er for eksisterende case. Se [scenarioarkivet](docs/practice-scenarios.md) for oversikt og verifikasjon.
- **Endre en simulator:** arbeid i den aktuelle filen i `components/visualizers/`. Behold eksisterende props. Nye visualiseringer kobles til `DetailPanel.jsx` gjennom fagdataenes `viz`-verdi.
- **Endre signalveiens lab:** bruk `utils/signalSimulation.js` for beregninger, `data/signalJourney.js` for læringsinnhold og `components/signal/` for visning. Se [fast mikservisning og tester](docs/signal-focus.md) og [signalmodellen](docs/signal-workbench.md).
- **Endre design:** arbeid i den relevante siden/komponenten eller `styles/app.css`; ikke legg fagdata tilbake i appskallet.
- **Ny side:** legg til siden i `pages/`, ruten i `useNavigation.js`, menypunktet i `AppLayout.jsx` og den utsatte importen i `App.jsx`.

Hold en endring avgrenset til relevant modul, og kjør kontrollene over. Det kreves ingen ny runtime-avhengighet for denne oppdelingen.

## Bruk og lagring

- Navigasjon bruker URL-fragmenter (`#home`, `#signal`, `#videos`, `#practice`), slik at frem/tilbake og direkte lenker fungerer på statisk hosting.
- Eksempler: `#signal?node=preamp` og `#videos?video=q7BQkq6A5qc`.
- Sett-markeringer, favoritter, løste oppgaver og sist åpnete video lagres i nettleserens `localStorage` under `lydteam.learning.v1`. Ingen konto eller synkronisering mellom enheter.
- Sett-markering er manuell; avspilling alene fullfører ikke en video. «Fortsett» åpner sist valgte video, men lagrer ikke tidsposisjon inne i YouTube-videoen.
- Hvis lagring er blokkert, fungerer appen videre i minnet og viser beskjed. Ødelagte eller utdaterte lagringsverdier valideres og ignoreres.
- Hjemsidens pre/post-lab er en enkel modell av faderavhengighet. Signalveisiden har en større visuell lab med gain, fader, monitor/FX-send, mute, routing, ni forklaringssteg og seks praktiske oppdrag. Appen spiller ikke lyd eller styrer en fysisk mikser.
- Signaloppdragenes løst-teller gjelder bare mens signalveisiden er åpen. Den er separat fra de 72 scenarioene på øvingssiden og lagres ikke mellom besøk.
- Øvingssiden tilbyr tema, nivå, søk, løst/uløst-filter og tilfeldig oppgave. Tilfeldig valg prioriterer uløste oppgaver i utvalget og unngår gjentakelse av aktiv oppgave når alternativer finnes. Riktig svar registrerer oppgaven som løst; dette er ikke en eksamen eller måling av mestring på første forsøk.

Se [refaktoreringsrapporten](docs/refactoring.md) for omfang og verifikasjon.
