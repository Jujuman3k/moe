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
| `src/data/practiceScenarios.js` | Øvingscase, svarforklaringer og fagkilder |
| `src/components/video/` | Felles avspiller, søkefelt, videokort og videohøydepunkter |
| `src/components/signal/` | Signalveikart, mobilkort og detaljpanel |
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
- **Nytt øvingscase:** legg til et objekt i `practiceScenarios.js`. Bruk én korrekt valgmulighet, forklaring på hvert svar, en eksisterende `nodeId` og en relevant primærkilde.
- **Endre en simulator:** arbeid i den aktuelle filen i `components/visualizers/`. Behold eksisterende props. Nye visualiseringer kobles til `DetailPanel.jsx` gjennom fagdataenes `viz`-verdi.
- **Endre design:** arbeid i den relevante siden/komponenten eller `styles/app.css`; ikke legg fagdata tilbake i appskallet.
- **Ny side:** legg til siden i `pages/`, ruten i `useNavigation.js`, menypunktet i `AppLayout.jsx` og den utsatte importen i `App.jsx`.

Hold en endring avgrenset til relevant modul, og kjør kontrollene over. Det kreves ingen ny runtime-avhengighet for denne oppdelingen.

## Bruk og lagring

- Navigasjon bruker URL-fragmenter (`#home`, `#signal`, `#videos`, `#practice`), slik at frem/tilbake og direkte lenker fungerer på statisk hosting.
- Eksempler: `#signal?node=preamp` og `#videos?video=q7BQkq6A5qc`.
- Sett-markeringer, favoritter, løste oppgaver og sist åpnete video lagres i nettleserens `localStorage` under `lydteam.learning.v1`. Ingen konto eller synkronisering mellom enheter.
- Sett-markering er manuell; avspilling alene fullfører ikke en video. «Fortsett» åpner sist valgte video, men lagrer ikke tidsposisjon inne i YouTube-videoen.
- Hvis lagring er blokkert, fungerer appen videre i minnet og viser beskjed. Ødelagte eller utdaterte lagringsverdier valideres og ignoreres.
- Pre/post-laben er en forenklet modell av nivåendringer, uten lyd, mute, DCA eller annen prosessering. Appen styrer ikke en fysisk mikser.

Se [refaktoreringsrapporten](docs/refactoring.md) for omfang og verifikasjon.
