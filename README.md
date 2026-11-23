# LydTeam Pro

Norsk læringsportal for lydteknikk og Allen & Heath dLive C3500. Bygget med React 19, Vite, Tailwind CSS og Lucide.

[Åpne LydTeam Pro](https://lydteam-portal-duzy.vercel.app/) · [Bandrommet](https://lydteam-portal-duzy.vercel.app/#bandroom?scene=grunnmur) · [Lyttetest](https://lydteam-portal-duzy.vercel.app/#listen)

I **Bandrommet** mikser du tre samtidige kanaler. Standardøkten kombinerer en bassloop med et trommemønster ved 110 BPM. Vokaløktene bruker uavhengige opptak til å øve nivåbalanse og panorering, ikke synkroniserte spor fra én innspilling. Enkeltkanalen åpner de sju originalopptakene i Enkel eller Pro. I **Lyttetest** sammenligner du original og bearbeidet versjon på samme sted. **Øv selv** har en guidet lydsjekk og hele scenarioarkivet. Søkeknappen (eller Ctrl/⌘ K) finner en video, en oppgave eller et verktøy på tvers av portalen.

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
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Nettlesertestene starter en lokal forhåndsvisning av **produksjonsbygget** på port 4173. Kjør `npm run build` først. YouTube-avspillere og miniatyrbilder erstattes med testresponser; reell avspilling må kontrolleres separat.

## Kodestruktur

| Mappe / fil | Ansvar |
| --- | --- |
| `src/App.jsx` | Laster sider og kobler navigasjon til læringsprogresjon |
| `src/pages/` | Hjem, Bandrommet, lyttetest, videoarkiv, signalvei og øvingsoppgaver |
| `src/audio/bandRoom*.js` og `src/components/bandroom/` | Flerkanals signalgraf, stereomåling, kanalstriper og sceneøvelser |
| `src/data/learningPaths.js` | Tre praktiske løp som kobler en bestemt leksjon, mikserøvelse og feilsøkingsoppgave |
| `src/data/practice/diagnostic*.js` | Seks feilsaker, kontrollpunkter, tiltak og modell for undersøkelsene |
| `src/data/videoData.js` | 92 videoer fordelt på 8 kategorier |
| `src/data/signalPathData.js` | Signalveiens 9 ledd, undertrinn, fagtekst og videolenker |
| `src/data/practiceScenarios.js` | Samler 72 scenarioer fra fagmodulene; lastes ved øving eller når portalsøket åpnes |
| `src/data/practice/` | 12 fagmoduler med 6 scenarioer hver, og felles kilderegister |
| `src/data/practiceCatalog.js` | Lett katalog med temaer, nivåer og stabile ID-er for progresjon |
| `src/components/video/` | Felles avspiller, søkefelt, videokort og videohøydepunkter |
| `src/components/signal/` | Responsivt signalveikart, kontroller, målere, læringslab og detaljpanel |
| `src/data/signalJourney.js` | Ni forklaringssteg og seks praktiske signaloppdrag |
| `src/data/signalPanels.js` | Kontrollfaner og oppdragenes startfaner |
| `src/audio/` og `hooks/useSignalAudio.js` | Ekte lydbehandling, avspilling, måling og opprydding |
| `src/data/audioSources.js` og `public/audio/` | Sju øvingsopptak, lyttetips og dokumenterte lydkilder |
| `src/components/signal/pro/` og `src/data/proAudio*.js` | Pro-kontroller, interaktive prosessorkurver og forklarte startforslag |
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
- **Endre signalveiens lab:** bruk `utils/signalSimulation.js` for beregninger, `data/signalJourney.js` for læringsinnhold og `components/signal/` for visning. Se [fast mikservisning og tester](docs/signal-focus.md), [signalmodellen](docs/signal-workbench.md) og [Enkel/Pro med interaktiv PEQ og dynamikk](docs/signal-pro.md). Ekte lydavspilling og bruksrett er dokumentert i [lyd i signalverkstedet](docs/signal-audio.md).
- **Endre design:** arbeid i den relevante siden/komponenten eller `styles/app.css`; ikke legg fagdata tilbake i appskallet.
- **Ny side:** legg til siden i `pages/`, navn og tittel i `portalPages.js`, ikon i `AppLayout.jsx` og den utsatte importen i `App.jsx`.

Hold en endring avgrenset til relevant modul, og kjør kontrollene over. Det kreves ingen ny runtime-avhengighet for denne oppdelingen.

## Bruk og lagring

- Navigasjon bruker URL-fragmenter (`#home`, `#bandroom`, `#signal`, `#listen`, `#videos`, `#practice`), slik at frem/tilbake og direkte lenker fungerer på statisk hosting.
- Eksempler: `#signal?node=preamp` (teori), `#signal?node=processing&source=kick&mode=pro&tool=hpf` (stille mikser med riktig kontroll), `#practice?scenario=eq-hpf-rumble` og `#videos?video=q7BQkq6A5qc`.
- Lyttetest bruker de samme krediterte lydfilene som mikseren, med 23 kildebaserte oppgaver om høypass, lavpass, mellomtone-EQ, kompressor, gate, delay og romklang. Velg Blandet, EQ og filter, Dynamikk eller Rom og ekko. Hver runde har tre oppgaver. DSP-en lager to synkrone løkker med tilpasset RMS og felles toppgrense. Resultatet gjelder den aktuelle runden.
- Bandrommet starter først ved trykk på Spill. Hver scene husker sin miks i samme fane. Målerne viser faktiske sample-topper; en godkjent øvelse betyr at de konkrete øvingsmålene for fader/pan er nådd, ikke at det bare finnes én god miks.
- Under Pro → Tips → Miksminne og kildekort kan du lagre to navngitte mikser per opptak, se forskjellene og hente tilbake egen miks. De lagres lokalt; referansen til originalopptaket er separat.
- Videoløp kan deles som `#videos?track=trygg-monitor`; feilsaker som `#practice?fault=monitor-follows`; gehørtrening som `#listen?track=dynamics`. Diagnosebenken bruker simulerte observasjoner, og lar deg åpne tilsvarende ledd med lyd.
- Lydsjekken i fire trinn kan gjenopptas i samme fane (sessionStorage). Riktig løste case inngår også i ordinær oppgaveprogresjon.
- Sett-markeringer, favoritter, løste oppgaver og sist åpnete video lagres i nettleserens `localStorage` under `lydteam.learning.v1`. Ingen konto eller synkronisering mellom enheter.
- Sett-markering er manuell; avspilling alene fullfører ikke en video. «Fortsett» åpner sist valgte video, men lagrer ikke tidsposisjon inne i YouTube-videoen.
- Hvis lagring er blokkert, fungerer appen videre i minnet og viser beskjed. Ødelagte eller utdaterte lagringsverdier valideres og ignoreres.
- Hjemsidens pre/post-lab er en enkel modell av faderavhengighet. Signalveisiden tilbyr en lydløs skisse og sju ekte øvingsopptak gjennom en interaktiv lydkjede. Enkel er standard; Pro gir firebånds PEQ, flere dynamikkontroller og kildeforslag. Appen styrer ingen fysisk mikser.
- Signaloppdragenes løst-teller gjelder bare mens signalveisiden er åpen. Den er separat fra de 72 scenarioene på øvingssiden og lagres ikke mellom besøk.
- Øvingssiden tilbyr tema, nivå, søk, løst/uløst-filter og tilfeldig oppgave. Tilfeldig valg prioriterer uløste oppgaver i utvalget og unngår gjentakelse av aktiv oppgave når alternativer finnes. Riktig svar registrerer oppgaven som løst; dette er ikke en eksamen eller måling av mestring på første forsøk.

Se [refaktoreringsrapporten](docs/refactoring.md) for omfang og verifikasjon.
