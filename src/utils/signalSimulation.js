// A steady-state teaching model: one source, unity processing and bus masters.
// null means silence. Levels are digital reference levels, never acoustic SPL.
export const defaultSignalState = Object.freeze({
  gain: 30, fader: 0, monitorSend: -6, fxSend: -12,
  monitorPre: true, connected: true, muted: false, mainAssigned: true, fxReturn: true,
});

export function simulateSignal(state) {
  const input = state.connected ? -48 : null;
  const requested = input === null ? null : input + state.gain;
  const clipped = requested !== null && requested > 0;
  const preamp = requested === null ? null : Math.min(0, requested);
  const channel = state.muted ? null : preamp;
  const post = channel === null || state.fader <= -60 ? null : channel + state.fader;
  const monitorSource = state.monitorPre ? channel : post;
  const monitor = monitorSource === null || state.monitorSend <= -60 ? null : monitorSource + state.monitorSend;
  const fx = post === null || state.fxSend <= -60 ? null : post + state.fxSend;
  const main = state.mainAssigned ? post : null;
  return {
    input, preamp, requested, clipped, post, main, monitor, fx,
    fxReturn: state.fxReturn ? fx : null,
    nodes: { input, preamp, processing: preamp, fader: post, monitor_branch: monitor, fx_branch: fx, mixbus: main, matrix: main, speakers: main },
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
  if (state.muted) return { title: 'Signal inn. Stille ut.', text: 'Inngangsmåleren viser fortsatt lyd. Kanal-mute stopper her både Main LR, monitor og FX-send.', tone: 'amber' };
  if (state.fader <= -60) return { title: 'Faderen er helt nede.', text: state.monitorPre ? 'Main og FX-send er stille. Monitoren får fortsatt lyd fra uttaket før faderen.' : 'Alle tre veier er stille. Monitoren er post-fade og følger derfor faderen.', tone: 'amber' };
  if (!state.mainAssigned) return { title: 'Kanalen er ikke sendt til Main LR.', text: 'En åpen fader er ikke nok: ruten må også være på. Monitor og FX-send kan fortsatt ha signal.', tone: 'amber' };
  if (!state.fxReturn) return { title: 'Lyd inn i effekten, men ingen retur.', text: 'FX-senden har signal. Slå på FX-returen til Main LR for å få effekten tilbake i miksen.', tone: 'amber' };
  return { title: state.monitorPre ? 'To uavhengige mikser.' : 'Monitoren følger faderen.', text: state.monitorPre ? 'Dra ned kanalfaderen: Salen og FX-senden blir svakere, mens monitoren holder nivået.' : 'Dra i kanalfaderen og se alle tre målerne. Velg pre-fade hvis monitoren skal være uavhengig.', tone: 'teal' };
}
