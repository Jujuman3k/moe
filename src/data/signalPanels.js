// Stable panel IDs preserve the user's place without changing audio settings.
export const signalPanels = {
  input: [['source', 'Inngang'], ['tone', 'Testtone']],
  preamp: [['gain', 'Gain'], ['examples', 'Prøv selv']],
  processing: [['hpf', 'HPF'], ['eq', 'EQ'], ['gate', 'Gate'], ['comp', 'Comp'], ['ratio', 'Ratio'], ['bypass', 'Bypass']],
  fader: [['level', 'Nivå'], ['pan', 'Panorama'], ['gain', 'Gain']],
  monitor_branch: [['send', 'Monitor'], ['compare', 'Sammenlign']],
  fx_branch: [['type', 'Effekt'], ['send', 'Send'], ['timing', 'Klang/delay'], ['return', 'Retur']],
  mixbus: [['main', 'Main'], ['balance', 'Tørr / FX']],
  matrix: [['level', 'Sonenivå'], ['compare', 'Main / PA']],
  speakers: [['output', 'Utgang'], ['level', 'Nivå']],
};

export const missionPanels = ['source', 'gain', 'send', 'level', 'main', 'return'];
