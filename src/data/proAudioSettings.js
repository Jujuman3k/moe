// Pro is a separate processing setup. Gain, faders, FX and routing stay shared.
export const proBands = [
  { id: 'lf', label: 'LF', name: 'Bass', color: '#c084fc', frequency: 100 },
  { id: 'lm', label: 'LM', name: 'Lav mellomtone', color: '#2dd4bf', frequency: 400 },
  { id: 'hm', label: 'HM', name: 'Øvre mellomtone', color: '#60a5fa', frequency: 2500 },
  { id: 'hf', label: 'HF', name: 'Diskant', color: '#fb7185', frequency: 10000 },
];

export function createProSettings() {
  return {
    trim: 0, polarity: false,
    filters: { hpf: false, hpfHz: 80, slope: 12, lpf: false, lpfHz: 16000 },
    eq: { enabled: true, bands: proBands.map(band => ({ frequency: band.frequency, gain: 0, width: 1, type: 'peaking', enabled: true })) },
    gate: { enabled: false, threshold: -35, depth: 40, attack: 1, hold: 80, release: 150, keyEnabled: false, keyHPF: 20, keyLPF: 20000 },
    comp: { enabled: false, threshold: -24, ratio: 3, attack: 20, release: 180, knee: 6, makeup: 0, mix: 100, rms: false, keyEnabled: false, keyHPF: 20, keyLPF: 20000 },
  };
}

export const proPanels = [['filter', 'Filter'], ['peq', 'PEQ'], ['gate', 'Gate'], ['comp', 'Comp'], ['bypass', 'Bypass']];
export const proPages = {
  filter: [['hpf', 'Høypass'], ['lpf', 'Lavpass']],
  peq: [['tone', 'Frekvens / gain'], ['shape', 'Bredde / type']],
  gate: [['level', 'Nivå'], ['attack', 'Åpning'], ['release', 'Lukking'], ['key', 'Sidechain']],
  comp: [['level', 'Nivå'], ['time', 'Tider'], ['knee', 'Kne / detektor'], ['output', 'Utgang'], ['key', 'Sidechain']],
  bypass: [],
};

export const frequencyPosition = frequency => Math.log(frequency / 20) / Math.log(1000);
export const positionFrequency = value => 20 * 1000 ** Math.max(0, Math.min(1, value));
export const frequencyLabel = value => value >= 1000 ? `${+(value / 1000).toFixed(2)} kHz` : `${Math.round(value)} Hz`;

export function patchProSection(pro, section, patch) {
  return { ...pro, [section]: { ...pro[section], ...patch } };
}
