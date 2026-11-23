// Geometry is in a shared 4 × 3 grid. A route is a reading aid: selecting one
// changes the drawing only, never the monitoring source, patch or fader values.
export const signalMapStops = {
  input:          { label: 'Kilde',   cell: [1, 1], zone: 'Kanal' },
  preamp:         { label: 'Gain',    cell: [2, 1], zone: 'Kanal' },
  processing:     { label: 'Prosess', cell: [3, 1], zone: 'Kanal' },
  fader:          { label: 'Fader',   cell: [4, 1], zone: 'Kanal' },
  monitor_branch: { label: 'Monitor', cell: [3, 2], zone: 'Avgrening' },
  fx_branch:      { label: 'FX',      cell: [4, 2], zone: 'Avgrening' },
  mixbus:         { label: 'Main LR', cell: [3, 3], zone: 'Utgang' },
  matrix:         { label: 'Matrix',  cell: [2, 3], zone: 'Utgang' },
  speakers:       { label: 'PA',      cell: [1, 3], zone: 'Utgang' },
};
export const routeNames = { all: 'Alle signalveier', main: 'Til salen', monitor: 'Til monitor', fx: 'Gjennom FX' };
const channel = ['input', 'preamp', 'processing'];
const house = ['mixbus', 'matrix', 'speakers'];
export function traceStops(route, pre) {
  if (route === 'monitor') return [...channel, ...(pre ? [] : ['fader']), 'monitor_branch'];
  if (route === 'main' || route === 'fx') return [...channel, 'fader', ...(route === 'fx' ? ['fx_branch'] : []), ...house];
  return Object.keys(signalMapStops);
}
export function traceCaption(route, state, signal) {
  if (route === 'monitor') return state.monitorPre ? 'PRE · før faderen' : 'POST · etter faderen';
  if (route === 'main') return 'Tørr kanal → Main LR → PA';
  if (route === 'fx') {
    if (state.fxType === 'off') return 'Effekt av · ingen retur';
    if (!state.fxReturn) return 'Returen er av';
    return signal.fxReturn === null ? 'Returen er stille' : 'Effektretur til Main LR';
  }
  return 'Velg én vei å følge';
}
export function signalEdges(signal, state) {
  const pre = state.monitorPre;
  // Every edge uses the meter at its destination or the applicable tap,
  // including the independent dry assignment and wet return into Main LR.
  return [
    ['in', 'M50 27H150', [100,27,0], signal.nodes.input, 'channel', 'all'],
    ['gain', 'M150 27H250', [200,27,0], signal.nodes.preamp, 'channel', 'all'],
    ['process', 'M250 27H350', [300,27,0], state.muted ? null : signal.nodes.processing, 'channel', pre ? 'main fx' : 'all'],
    ['dry', 'M350 27H394Q398 27 398 31V131Q398 135 394 135H250', [398,104,90], signal.main, 'main', 'main'],
    ['matrix', 'M250 135H150', [200,135,180], signal.matrix, 'main', 'main fx'],
    ['pa', 'M150 135H50', [100,135,180], signal.pa, 'main', 'main fx'],
    ['monitor', pre ? 'M250 27V81' : 'M350 27V49Q350 53 346 53H254Q250 53 250 57V81', pre ? [250,54,90] : [300,53,180], signal.monitor, 'monitor', 'monitor'],
    ['send', 'M350 27V81', [350,54,90], signal.fx, 'fx', 'fx'],
    ['return', 'M350 81V104Q350 108 346 108H254Q250 108 250 112V135', [300,108,180], signal.fxReturn, 'fx', 'fx'],
  ];
}
