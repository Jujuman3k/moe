// Visual teaching model. null means silence; levels are not acoustic SPL.
export const defaultSignalState = Object.freeze({
  gain: 30, fader: 0, monitorSend: -6, fxSend: -12,
  monitorPre: true, connected: true, muted: false, mainAssigned: true, fxReturn: true,
  sourceLevel: -48, sourceKind: 'pulse', frequency: 220,
  hpf: false, hpfHz: 100, eq: 0, eqHz: 1000, gate: false, gateThreshold: -35,
  compressor: false, threshold: -24, ratio: 4, bypass: false,
  fxType: 'off', decay: 1.4, delayMs: 350, feedback: 35, returnLevel: 0,
  pan: 0, mainLevel: 0, matrixLevel: 0, paEnabled: true,
});

export const attenuate = (level, db) => level === null || db <= -60 ? null : level + db;
export const amplitude = level => level === null ? 0 : 10 ** (level / 20);
// Approximate combined power for dry and decorrelated wet signals, not a peak meter.
export function sumLevels(...levels) {
  const power = levels.reduce((sum, level) => sum + (level === null ? 0 : 10 ** (level / 10)), 0);
  return power > 0 ? 10 * Math.log10(power) : null;
}

export function simulateSignal(settings) {
  const state = { ...defaultSignalState, ...settings };
  const input = state.connected ? state.sourceLevel : null;
  const requested = input === null ? null : input + state.gain;
  const clipped = requested !== null && requested > 0;
  const preamp = requested === null ? null : Math.min(0, requested);
  const filterDb = state.hpf && !state.bypass ? -10 * Math.log10(1 + (state.hpfHz / state.frequency) ** 4) : 0;
  const filtered = preamp === null ? null : preamp + filterDb;
  const gateClosed = state.gate && !state.bypass && filtered !== null && filtered < state.gateThreshold;
  const equalized = filtered === null || gateClosed ? null : filtered + (state.bypass ? 0 : state.eq);
  const reduction = state.compressor && !state.bypass && equalized !== null ? Math.max(0, equalized - state.threshold) * (1 - 1 / state.ratio) : 0;
  const processed = equalized === null ? null : equalized - reduction;
  const channel = state.muted ? null : processed;
  const post = attenuate(channel, state.fader);
  const monitor = attenuate(state.monitorPre ? channel : post, state.monitorSend);
  const fx = attenuate(post, state.fxSend);
  const fxReturn = state.fxReturn && state.fxType !== 'off' ? attenuate(fx, state.returnLevel) : null;
  const main = state.mainAssigned ? post : null;
  const mix = attenuate(sumLevels(main, fxReturn), state.mainLevel);
  const matrix = attenuate(mix, state.matrixLevel);
  const pa = state.paEnabled ? matrix : null;
  const angle = (state.pan + 100) / 200 * Math.PI / 2;
  const dryMain = attenuate(main, state.mainLevel);
  const wetMain = attenuate(fxReturn, state.mainLevel);
  const wetSide = wetMain === null ? null : wetMain - 10 * Math.log10(2);
  const left = sumLevels(dryMain === null || state.pan === 100 ? null : dryMain + 20 * Math.log10(Math.cos(angle)), wetSide);
  const right = sumLevels(dryMain === null || state.pan === -100 ? null : dryMain + 20 * Math.log10(Math.sin(angle)), wetSide);
  return {
    input, requested, preamp, clipped, processed, gateClosed, reduction, filterDb,
    post, main, mix, matrix, pa, monitor, fx, fxReturn, left, right,
    nodes: { input, preamp, processing: processed, fader: post, monitor_branch: monitor, fx_branch: fx, mixbus: mix, matrix, speakers: pa },
  };
}

export function formatSignalLevel(level) {
  return level === null ? 'Stille' : `${Math.round(level)} dBFS`;
}

export function signalPercent(level) {
  return level === null ? 0 : Math.max(2, Math.min(100, (level + 72) / 72 * 100));
}

export function checkSignalMission(id, state) {
  const signal = simulateSignal(state);
  if (id === 'connection') return signal.main !== null && !signal.clipped;
  if (id === 'headroom') return signal.preamp !== null && signal.preamp >= -24 && signal.preamp <= -12;
  if (id === 'monitor') return state.monitorPre && signal.main !== null && signal.main <= -30 && signal.monitor === -24 && !signal.clipped;
  if (id === 'mute') return !state.muted && signal.main !== null && signal.monitor !== null;
  if (id === 'assignment') return signal.main !== null && signal.monitor !== null && !signal.clipped;
  if (id === 'return') return signal.fxReturn !== null && signal.main !== null && !signal.clipped;
  return false;
}

export function signalDiagnosis(state, signal) {
  if (!state.connected) return { title: 'Signalkjeden starter med stillhet.', text: 'Inngangen er frakoblet. Gain og fadere kan ikke forsterke et signal som ikke kommer inn.', tone: 'amber' };
  if (signal.clipped) return { title: 'Det klipper allerede i inngangen.', text: 'Senk gain. En lavere fader gjør den forvrengte lyden svakere, men reparerer den ikke.', tone: 'rose' };
  if (signal.pa !== null && signal.pa > 0) return { title: 'Utgangsnivået er for høyt.', text: 'Det beregnede nivået overstiger 0 dBFS. Senk Main eller Matrix for mer headroom ved utgangen. Modellen beregner ikke DAC-klipping.', tone: 'rose' };
  if (signal.gateClosed) return { title: 'Gaten holder signalet igjen.', text: 'Senk gate-terskelen eller slå av gaten. Følg forskjellen mellom gain og processing i kartet.', tone: 'amber' };
  if (state.muted) return { title: 'Signal inn. Stille ut.', text: 'Inngangsmåleren viser fortsatt lyd. Kanal-mute stopper her både Main LR, monitor og FX-send.', tone: 'amber' };
  if (state.fader <= -60) return { title: 'Faderen er helt nede.', text: state.monitorPre ? 'Main og FX-send er stille. Monitoren får fortsatt lyd fra uttaket før faderen.' : 'Alle tre veier er stille. Monitoren er post-fade og følger derfor faderen.', tone: 'amber' };
  if (!state.mainAssigned) return { title: 'Kanalen er ikke sendt til Main LR.', text: 'En åpen fader er ikke nok: ruten må også være på. Monitor og FX-send kan fortsatt ha signal.', tone: 'amber' };
  if (state.fxType !== 'off' && !state.fxReturn) return { title: 'Lyd inn i effekten, men ingen retur.', text: 'FX-senden har signal. Slå på FX-returen til Main LR for å få effekten tilbake i miksen.', tone: 'amber' };
  if (!state.paEnabled) return { title: 'PA-utgangen er slått av.', text: 'Main LR og monitoren kan fortsatt ha signal. Slå på PA-utgangen for å sende matrixen videre.', tone: 'amber' };
  if (state.matrixLevel <= -60) return { title: 'Matrixen er helt nede.', text: 'Main LR kan fortsatt ha signal, men denne sonen er stille. Løft Matrix til PA for å åpne utgangen.', tone: 'amber' };
  return { title: state.monitorPre ? 'To uavhengige mikser.' : 'Monitoren følger faderen.', text: state.monitorPre ? 'Dra ned kanalfaderen: Salen og FX-senden blir svakere, mens monitoren holder nivået.' : 'Dra i kanalfaderen og se alle tre målerne. Velg pre-fade hvis monitoren skal være uavhengig.', tone: 'teal' };
}
