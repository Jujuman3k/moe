// A tool link opens an editor, never a saved mix. Only an FX editor needs its
// effect type selected to expose real controls; all numeric values stay neutral/default.
const tools = new Map([
  ['hpf', { node: 'processing', proPanel: 'filter', group: 'hpf' }],
  ['lpf', { node: 'processing', proPanel: 'filter', group: 'lpf' }],
  ['peq', { node: 'processing', proPanel: 'peq' }],
  ['gate', { node: 'processing', proPanel: 'gate' }],
  ['comp', { node: 'processing', proPanel: 'comp' }],
  ['delay', { node: 'fx_branch', panel: 'timing', fxType: 'delay' }],
  ['reverb', { node: 'fx_branch', panel: 'timing', fxType: 'reverb' }],
]);

export function signalToolEntry(id, nodeId) {
  const tool = tools.get(id);
  return tool && (!nodeId || nodeId === tool.node) ? tool : null;
}
