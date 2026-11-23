// One diagnosis per stop. Both alternatives explain which signals the action affects.
export const signalDepthCases = {
  input: {
    question: 'Du ser at sangeren synger, men inngangsmeteret står stille. Pianoet ved siden av fungerer. Hvor begynner du?',
    options: [
      ['Følg mikrofon, kabel og valgt socket', 'Dette er den første forbindelsen uten signal. Bekreft at kanalens inngang faktisk er socketen mikrofonen står i.'],
      ['Løft Main-faderen', 'Main påvirker alle i salen, også pianoet. Den kan ikke lage et signal på den tause inngangen.'],
    ], correct: 0,
  },
  preamp: {
    question: 'De hardeste skarpslagene låter knust. Preampen viser klipp, men meteret etter faderen er godt under null. Hva prøver du?',
    options: [
      ['Trekk ned kanalfaderen', 'Det demper også den ødelagte bølgetoppen. Lytt og mål før faderen for å finne hvor vrengen oppstår.'],
      ['Senk preamp-gain og be om like harde slag', 'Du retter det første stedet som klipper. Når toppene har klaring, kan du justere plasseringen i miksen med faderen.'],
    ], correct: 1,
  },
  processing: {
    question: 'De sterke ordene høres, men svake ordslutt kuttes brått. Inngangen har signal mens gatens dempingsmåler slår inn. Hva sammenligner du først?',
    options: [
      ['Samme frase med og uten gate', 'Hvis avslutningen kommer tilbake uten gate, juster terskel og lytt til hold/release på en fysisk pult.'],
      ['Samme frase med mer diskant', 'EQ påvirker klangen, men henter ikke tilbake lyden mens gaten holder kanalen lukket.'],
    ], correct: 0,
  },
  fader: {
    question: 'Bassen overdøver vokalen i salen. Bassisten er fornøyd med sin egen pre-fade monitor. Hva flytter du?',
    options: [
      ['Bassens inngangsgain', 'Gain ligger før avgreningen og påvirker derfor også det bassisten hører.'],
      ['Bassens kanalfader i salsmiksen', 'Her demper du bassens post-fade vei til Main, mens pre-fade monitorsenden beholder sitt nivå.'],
    ], correct: 1,
  },
  monitor_branch: {
    question: 'Gitaristen mister ledevokalen i monitor hver gang du demper den i salen. Senden er post-fade. Hvordan gjør du miksene uavhengige?',
    options: [
      ['Velg pre-fade for vokalsenden til denne auxen', 'Da hentes monitorlyden før kanalfaderen. Avstem deretter send-nivået med gitaristen.'],
      ['Øk bare nivået på post-fade-senden', 'Det gir mer akkurat nå, men neste faderbevegelse i salen blir fortsatt med til monitoren.'],
    ], correct: 0,
  },
  fx_branch: {
    question: 'To vokaler deler samme klang. Bare korvokalen skal få mindre klang; ledevokalen skal beholde sin hale. Hva demper du?',
    options: [
      ['Felles FX-retur', 'Returen inneholder begge stemmenes klang. Denne faderen vil dempe begge halene.'],
      ['Korvokalens send til klangen', 'Da mater akkurat den stemmen mindre inn i effekten. Den tørre korvokalen og ledevokalens send blir stående.'],
    ], correct: 1,
  },
  mixbus: {
    question: 'Pianoet låter tydelig i monitor. I salen høres bare klanghalen. Andre instrumenter går fint til Main. Hva sjekker du først?',
    options: [
      ['Pianokanalens direkte tildeling til Main LR', 'En aktiv retur kan føre klangen til Main på egen hånd. Finn ut om den tørre kanalen også er tilordnet.'],
      ['Øk Main LR', 'Det ville løftet klanghalen og alle de andre instrumentene. En manglende tørr rute kommer ikke tilbake.'],
    ], correct: 0,
  },
  matrix: {
    question: 'Frontfill og hovedanlegg mates fra samme Main. Frontfill har egen matrix og er for sterk. Vokal og gitar er balansert riktig. Hva justerer du?',
    options: [
      ['Vokalfaderen i Main', 'Da endres balansen mellom vokal og gitar, både i hovedanlegget og i frontfill.'],
      ['Nivået på frontfill-matrixen', 'Da endres bare nivået til sonen. Forholdet mellom instrumentene og nivået i hovedanlegget holdes fast.'],
    ], correct: 1,
  },
  speakers: {
    question: 'Meteret ved utgangen beveger seg, men én høyttalersone er stille. Hvilken observasjon avgrenser feilen best?',
    options: [
      ['Om riktig utgang når inngangen på sonens forsterker eller aktive høyttaler', 'Neste målepunkt viser om signalet faktisk kommer fram. Et digitalmeter ved pulten kan ikke fortelle om høyttaleren spiller.'],
      ['At nivået på Main LR ser normalt ut', 'Main ligger tidligere i kjeden. Et friskt Main-meter sier lite om lokal patch, utgang og mottaker i denne sonen.'],
    ], correct: 0,
  },
};
