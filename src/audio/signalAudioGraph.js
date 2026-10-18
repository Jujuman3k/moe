import { defaultSignalState } from '../utils/signalSimulation.js';
import { createProAudioGraph } from './proAudioGraph.js';

export const dbGain = db => 10 ** (db / 20);
const faderGain = db => db <= -60 ? 0 : dbGain(db);
const chain = (...nodes) => nodes.slice(1).forEach((node, index) => nodes[index].connect(node));

// Deterministic diffuse room response; decay is the approximate -60 dB time.
export function roomImpulse(context, seconds) {
  const buffer = context.createBuffer(2, Math.ceil(context.sampleRate * seconds), context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let seed = 173 + channel * 71;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const time = i / context.sampleRate;
      data[i] = time < 0.012 ? 0 : ((seed / 4294967296) * 2 - 1) * Math.exp(-6.908 * time / seconds);
    }
  }
  return buffer;
}

export async function loadGate(context) {
  if (!context.audioWorklet) throw new Error('Nettleseren støtter ikke lydbehandlingen. Prøv en oppdatert nettleser.');
  await Promise.all([
    context.audioWorklet.addModule(new URL('./gate.worklet.js', import.meta.url)),
    context.audioWorklet.addModule(new URL('./proDynamics.worklet.js', import.meta.url)),
  ]);
}

export function createSignalAudioGraph(context, initialState = {}, initialListening = {}) {
  const nodes = [];
  const own = node => { nodes.push(node); return node; };
  const gain = (value = 1) => { const node = own(context.createGain()); node.gain.value = value; return node; };
  const taps = {};
  const tap = (name, node) => {
    const analyser = own(context.createAnalyser()); analyser.fftSize = 4096;
    node.connect(analyser); taps[name] = { analyser, data: new Float32Array(analyser.fftSize) };
    return node;
  };
  const input = gain(); input.channelCount = 1; input.channelCountMode = 'explicit';
  const source = tap('input', gain());
  const preGain = tap('requested', gain());
  const clipper = own(context.createWaveShaper()); clipper.curve = new Float32Array([-1, 1]);
  tap('preamp', clipper);
  chain(input, source, preGain, clipper);
  const hpf = own(context.createBiquadFilter()); hpf.type = 'highpass'; hpf.Q.value = Math.SQRT1_2;
  const hpfDry = gain(); const hpfWet = gain(0); const filtered = tap('filtered', gain());
  chain(clipper, hpfDry, filtered); chain(clipper, hpf, hpfWet, filtered);
  const gate = own(new AudioWorkletNode(context, 'lydteam-gate', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] }));
  let gateClosed = false;
  gate.port.onmessage = event => { gateClosed = event.data.closed; };
  const eq = own(context.createBiquadFilter()); eq.type = 'peaking'; eq.Q.value = 0.8;
  const compressor = own(context.createDynamicsCompressor());
  compressor.attack.value = 0.01; compressor.release.value = 0.15; compressor.knee.value = 6;
  const compDry = gain(); const compWet = gain(0); const compMix = gain();
  chain(filtered, gate, eq); chain(eq, compDry, compMix); chain(eq, compressor, compWet, compMix);
  const processWet = gain(); const processDry = gain(0); const processed = tap('processed', gain());
  // Keep the channel mono up to its panner. The native compressor has a stereo
  // output even when bypassed, which would otherwise change the centre pan law.
  processed.channelCount = 1; processed.channelCountMode = 'explicit';
  chain(compMix, processWet, processed); chain(clipper, processDry, processed);
  const proChannel = createProAudioGraph(context, own, tap);
  clipper.connect(proChannel.input); proChannel.output.connect(processed);
  const mute = tap('channel', gain()); const fader = tap('post', gain());
  chain(processed, mute, fader);
  const preMonitor = gain(); const postMonitor = gain(0); const monitor = tap('monitor', gain());
  chain(mute, preMonitor, monitor); chain(fader, postMonitor, monitor);
  const panner = own(context.createStereoPanner()); const assigned = tap('main', gain());
  chain(fader, panner, assigned);
  const send = tap('fx', gain()); fader.connect(send);
  const reverbInput = gain(0); const convolver = own(context.createConvolver()); const reverbOut = gain(0);
  chain(send, reverbInput, convolver, reverbOut);
  const delayInput = gain(0); const delay = own(context.createDelay(1)); const feedback = gain(0); const delayOut = gain(0);
  chain(send, delayInput, delay, delayOut); chain(delay, feedback, delay);
  const wet = tap('wet', gain()); reverbOut.connect(wet); delayOut.connect(wet);
  const main = tap('mix', gain()); assigned.connect(main); wet.connect(main);
  const splitter = own(context.createChannelSplitter(2)); main.connect(splitter);
  const left = tap('left', gain()); const right = tap('right', gain()); splitter.connect(left, 0); splitter.connect(right, 1);
  const matrix = tap('matrix', gain()); const pa = tap('pa', gain()); chain(main, matrix, pa);
  // Match the dry channel's centre pan law at neutral settings. Changes in
  // gain/fader/dynamics are deliberately not loudness-matched during A/B.
  const referencePan = own(context.createStereoPanner());
  const reference = tap('reference', gain(dbGain(-18))); chain(input, referencePan, reference);
  const listenMain = gain(1); const listenMonitor = gain(0); const listenPa = gain(0); const listenOriginal = gain(0);
  const sum = gain();
  chain(main, listenMain, sum); chain(monitor, listenMonitor, sum); chain(pa, listenPa, sum); chain(reference, listenOriginal, sum);
  // Listening protection is outside the teaching chain and its meters.
  const limiter = own(context.createDynamicsCompressor());
  limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.1;
  const ceiling = own(context.createWaveShaper()); ceiling.curve = Float32Array.from({ length: 1025 }, (_, i) => Math.max(-0.7, Math.min(0.7, i / 512 - 1)));
  const volume = gain(0.5); const output = gain(0);
  chain(sum, limiter, ceiling, volume, output);
  let state; let listening; let lastDecay;
  function set(param, value, immediate) {
    param.cancelScheduledValues(context.currentTime);
    if (immediate) param.setValueAtTime(value, context.currentTime);
    else param.setTargetAtTime(value, context.currentTime, 0.012);
  }
  function update(nextState, nextListening = {}, immediate = false) {
    state = { ...defaultSignalState, ...nextState };
    listening = { target: 'main', original: false, volume: 50, ...nextListening };
    const level = (node, value) => set(node.gain, value, immediate);
    level(source, state.connected ? dbGain(state.sourceLevel) : 0);
    level(preGain, dbGain(state.gain));
    set(hpf.frequency, state.hpfHz, immediate); level(hpfDry, state.hpf ? 0 : 1); level(hpfWet, state.hpf ? 1 : 0);
    set(gate.parameters.get('enabled'), state.gate ? 1 : 0, immediate);
    set(gate.parameters.get('threshold'), state.gateThreshold, immediate);
    set(eq.frequency, state.eqHz || 1000, immediate); set(eq.gain, state.eq, immediate);
    set(compressor.threshold, state.threshold, immediate); set(compressor.ratio, state.ratio, immediate);
    level(compDry, state.compressor ? 0 : 1); level(compWet, state.compressor ? 1 : 0);
    level(processWet, !state.proMode && !state.bypass ? 1 : 0); level(processDry, !state.proMode && state.bypass ? 1 : 0);
    proChannel.update(state.pro, state.proMode, state.bypass, (param, value, discrete = false) => set(param, value, immediate || discrete));
    level(mute, state.muted ? 0 : 1); level(fader, faderGain(state.fader));
    level(preMonitor, state.monitorPre ? 1 : 0); level(postMonitor, state.monitorPre ? 0 : 1); level(monitor, faderGain(state.monitorSend));
    set(panner.pan, state.pan / 100, immediate); level(assigned, state.mainAssigned ? 1 : 0);
    level(send, faderGain(state.fxSend));
    level(reverbInput, state.fxType === 'reverb' ? 1 : 0); level(reverbOut, state.fxType === 'reverb' ? 1 : 0);
    level(delayInput, state.fxType === 'delay' ? 1 : 0); level(delayOut, state.fxType === 'delay' ? 1 : 0);
    set(delay.delayTime, state.delayMs / 1000, immediate);
    level(feedback, state.fxType === 'delay' ? Math.min(0.75, state.feedback / 100) : 0);
    if (state.fxType === 'reverb' && lastDecay !== state.decay) { convolver.buffer = roomImpulse(context, state.decay); lastDecay = state.decay; }
    level(wet, state.fxReturn ? faderGain(state.returnLevel) : 0);
    level(main, faderGain(state.mainLevel)); level(matrix, faderGain(state.matrixLevel)); level(pa, state.paEnabled ? 1 : 0);
    level(listenMain, !listening.original && listening.target === 'main' ? 1 : 0);
    level(listenMonitor, !listening.original && listening.target === 'monitor' ? 1 : 0);
    level(listenPa, !listening.original && listening.target === 'pa' ? 1 : 0);
    level(listenOriginal, listening.original ? 1 : 0);
    level(volume, Math.max(0, Math.min(1, listening.volume / 100)));
  }
  update(initialState, initialListening, true);
  function read(name) { const entry = taps[name]; entry.analyser.getFloatTimeDomainData(entry.data); return entry.data; }
  function levels() {
    const peaks = {};
    for (const name of Object.keys(taps)) {
      let peak = 0; for (const value of read(name)) peak = Math.max(peak, Math.abs(value));
      peaks[name] = peak < 0.000001 ? null : 20 * Math.log10(peak);
    }
    return { ...peaks, clipped: peaks.requested !== null && peaks.requested > 0, gateClosed: state.gate && !state.bypass && gateClosed,
      reduction: state.compressor && !state.bypass ? -compressor.reduction : 0, ...(state.proMode ? proChannel.levels() : {}),
      fxReturn: peaks.wet,
      nodes: { input: peaks.input, preamp: state.proMode ? peaks.proTrim : peaks.preamp, processing: peaks.processed, fader: peaks.post, monitor_branch: peaks.monitor, fx_branch: peaks.fx, mixbus: peaks.mix, matrix: peaks.matrix, speakers: peaks.pa } };
  }
  function scope(node) {
    const pair = { input: ['input','input'], preamp: ['input','preamp'], processing: ['preamp','processed'], fader: ['channel','post'], monitor_branch: [state.monitorPre ? 'channel' : 'post','monitor'], fx_branch: ['fx','wet'], mixbus: ['post','mix'], matrix: ['mix','matrix'], speakers: ['matrix','pa'] }[node];
    return { before: read(pair[0]), after: read(state.proMode && node === 'preamp' ? 'proTrim' : pair[1]), wet: read('wet'), duration: 4096 / context.sampleRate };
  }
  const spectrum = new Float32Array(taps.proEqualized.analyser.frequencyBinCount);
  function readSpectrum() { taps.proEqualized.analyser.getFloatFrequencyData(spectrum); return { values: spectrum, sampleRate: context.sampleRate }; }
  return { input, output, taps, update, levels, scope, readSpectrum,
    start: () => set(output.gain, 1, false),
    silence: () => { output.gain.cancelScheduledValues(context.currentTime); output.gain.value = 0; },
    dispose: () => { gate.port.close(); proChannel.dispose(); for (const node of nodes) node.disconnect(); },
  };
}
