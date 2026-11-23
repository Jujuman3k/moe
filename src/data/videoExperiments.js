// Only link lessons for which the mixer can reproduce the actual listening task.
const experiments = [
  { ids: [10, 12, 105, 311], node: 'processing', source: 'male', mode: 'pro', tool: 'peq', label: 'Prøv EQ på vokal', text: 'Start opptaket og løft mellomtonen forsiktig. Slå EQ av og på. Hvilke ord trer tydeligere fram?' },
  { ids: [11], node: 'processing', source: 'snare', mode: 'pro', tool: 'gate', label: 'Prøv gate på skarp', text: 'Bruk startforslaget for skarptromme. Forkort release og lytt etter når halen på slaget blir for kort.' },
  { ids: [101, 310], node: 'preamp', source: 'female', mode: 'easy', label: 'Prøv gain på vokal', text: 'Spill vokalen og løft gain trinnvis. Se etter hvor klippingen oppstår, før du prøver å senke faderen.' },
  { ids: [104, 703, 704], node: 'fx_branch', source: 'male', mode: 'easy', tool: 'reverb', label: 'Prøv klang på vokal', text: 'Spill en vokal med klang. Slå FX-returen av og på og lytt til hva som blir igjen etter ordene.' },
  { ids: [709], node: 'matrix', source: 'piano', mode: 'easy', label: 'Prøv en matriseutgang', text: 'Velg PA som lyttepunkt og senk matrisen. Sammenlign nivåene på Main LR og PA.' },
  { ids: [713], node: 'monitor_branch', source: 'male', mode: 'easy', label: 'Prøv monitorsendingen', text: 'Velg Monitor som lyttepunkt. Sammenlign pre-fade og post-fade med kanalfaderen senket.' },
];

export const videoExperiment = id => experiments.find(experiment => experiment.ids.includes(id));
