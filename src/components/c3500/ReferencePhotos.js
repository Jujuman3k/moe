// Coordinates are percentages of the cropped image, not of the surrounding frame.
// These are read-only visual references. The destination names belong to the live mixer.
export const photos = [
  {
    tab: 'Bank', file: 'bank', width: 1290, height: 758,
    title: 'Se tolv kanaler samtidig',
    alt: 'Bank-visning på dLive: tolv inngangsstriper med små grafer, og dynamikk for den valgte kanalen til høyre.',
    marks: [
      { at: [28, 44], label: 'Valgt kanal', panel: 'bank', note: 'Den grønne stripen er Ip 3. I øvingsbanken kan du velge en annen kanal og se hvilken lydkilde kontrollene tilhører.' },
      { at: [24, 4], label: 'Til Overview', panel: 'overview', note: 'Se fanen Overview ved siden av Bank. Den samler prosessorene for én kanal, slik at du kan finne neste ledd uten å lete i hele banken.' },
      { at: [94, 24], label: 'Gate', panel: 'gate', note: 'Øverst til høyre viser den knekte kurven hvordan gaten demper den svake delen av signalet. Prøv med skarp og lytt til halen etter hvert slag.' },
      { at: [94, 69], label: 'Kompressor', panel: 'comp', note: 'Under gaten ligger kompressoren. Velg en vokal i mikseren og senk terskelen mens du lytter til forskjellen mellom svake og sterke stavelser.' },
    ],
  },
  {
    tab: 'Oversikt', file: 'oversikt', width: 908, height: 547,
    title: 'Les én kanal fra inngang til dynamikk',
    alt: 'Kanaloversikt med egne ruter for Preamp, Filter, Gate, PEQ og Compressor Manual Peak.',
    marks: [
      { at: [20, 24], label: 'Inngangsnivå', panel: 'preamp', note: 'Preamp-ruten viser gain. Nivået du sender videre herfra avgjør blant annet hvor lett kompressoren passerer terskelen.' },
      { at: [67, 27], label: 'Gatekurve', panel: 'gate', note: 'Finn Gate-ruten i øverste rad. Sett terskelen mellom bakgrunnslyden og slagene du vil beholde; åpne så gaten og hør på de svakeste slagene.' },
      { at: [32, 75], label: 'PEQ-kurve', panel: 'peq', note: 'Den vannrette linjen står for 0 dB. I PEQ kan du flytte et bånd og både se og høre akkurat hvilken del av klangen du endrer.' },
      { at: [73, 77], label: 'Dynamikkurve', panel: 'comp', note: 'Til høyre for PEQ ligger kompressoren. Der knekket begynner, vil høye partier få mindre nivåøkning enn før.' },
    ],
  },
  {
    tab: 'Preamp', file: 'preamp', width: 763, height: 640,
    title: 'Skill fysisk gain fra digital trim',
    alt: 'Nærbilde av dLive Preamp-siden: Input Source over Socket Preamp med 21 dB gain og digital trim på 0 dB.',
    marks: [
      { at: [51, 85], label: 'Socket Gain', panel: 'preamp', note: 'I bildet står gain på 21 dB. Det er innstillingen for denne inngangen, ikke en fasit. I øvingen: spill av en kilde, øk gain og følg nivået på de sterkeste toppene.' },
      { at: [83, 86], label: 'Digital trim', panel: 'preamp', note: 'Trim er 0 dB i bildet. På mikseren kan digital trim finjustere nivået etter forforsterkeren; den kan ikke reparere et signal som allerede klipper i inngangen.' },
      { at: [29, 21], label: 'Inngangskilde', panel: 'preamp', note: 'Øverst står kilde A som DX 1/2: 10. Her ser du hvilken fysisk inngang som mater kanalen. Start øvingen med å velge hvilken innspilling du vil høre.' },
    ],
  },
  {
    tab: 'EQ-bånd', file: 'eq-band', width: 961, height: 185,
    title: 'Les formen på EQ-båndene',
    alt: 'Forstørret detalj fra bankbildet: LM med et lite kutt, og de flate HM- og HF-kurvene.',
    marks: [
      { at: [13, 67], label: 'LM · lav mellomtone', band: 1, panel: 'peq', note: 'Den grønne LM-kurven har en liten grop. Prøv et kutt rundt 300 Hz på gitar eller piano, og sammenlign med EQ av: blir det ryddigere eller bare tynnere?' },
      { at: [50, 62], label: 'HM · høy mellomtone', band: 2, panel: 'peq', note: 'Den blå HM-kurven ligger flatt her. Løft forsiktig rundt 3 kHz på vokal, og lytt etter både tydeligere ord og om konsonantene blir skarpe.' },
      { at: [84, 62], label: 'HF · diskant', band: 3, panel: 'peq', note: 'Den røde HF-kurven ligger også på 0 dB. Prøv en liten endring øverst på skarptromma. Hør etter raslingen fra seidematten før du bestemmer deg.' },
    ],
  },
];

export const panelNames = { bank: 'kanalbanken', overview: 'kanaloversikten', preamp: 'preamp', gate: 'gate', peq: 'PEQ', comp: 'kompressoren' };
