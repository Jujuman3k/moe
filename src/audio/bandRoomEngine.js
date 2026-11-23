import { audioSources } from '../data/audioSources.js';
import { arrangeBandLoop, createBandRoomGraph, METER_FLOOR } from './bandRoomGraph.js';

const sources = new Map(audioSources.map(source => [source.id, source]));
const silentMeters = () => ({ left: METER_FLOOR, right: METER_FLOOR, channels: {} });

function activeMix(mix) {
  const seen = new Set();
  const channels = (Array.isArray(mix?.channels) ? mix.channels : []).filter(ch => {
    if (!sources.has(ch?.id) || seen.has(ch.id)) return false;
    seen.add(ch.id); return true;
  });
  return { channels, masterDb: mix?.masterDb };
}

export class BandRoomEngine {
  constructor({ onStatus = () => {} } = {}) {
    this.onStatus = onStatus;
    this.buffers = new Map();
    this.status = 'idle';
    this.run = null;
    this.closed = false;
    this.onHide = () => { if (document.hidden) this.stop(); };
    this.onPageHide = () => this.stop();
    document.addEventListener('visibilitychange', this.onHide);
    window.addEventListener('pagehide', this.onPageHide);
  }
  notify(status, message = '') {
    this.status = status;
    if (!this.closed) this.onStatus(status, message);
  }
  setMix(mix) {
    this.mix = activeMix(mix);
    this.run?.graph?.setMix(this.mix);
  }
  readMeters() { return this.run?.graph?.readMeters() ?? silentMeters(); }
  async load(id, run) {
    const key = id + ':' + run.context.sampleRate;
    if (this.buffers.has(key)) return this.buffers.get(key);
    const source = sources.get(id);
    try {
      const response = await fetch(source.file, { signal: run.controller.signal });
      if (!response.ok) throw new Error('Opptaket er ikke tilgjengelig.');
      const decoded = await run.context.decodeAudioData(await response.arrayBuffer());
      if (this.run !== run) return null;
      const pcm = arrangeBandLoop(id, decoded.getChannelData(0), decoded.sampleRate);
      const buffer = run.context.createBuffer(1, pcm.length, decoded.sampleRate);
      buffer.copyToChannel(pcm, 0);
      this.buffers.set(key, buffer);
      return buffer;
    } catch {
      throw new Error('Kunne ikke laste ' + source.label.toLowerCase() + '. Prøv igjen.');
    }
  }
  async play(mix) {
    if (this.closed) return false;
    this.release();
    this.setMix(mix);
    if (!this.mix.channels.length) { this.notify('error', 'Scenen har ingen lydkilder.'); return false; }
    if (document.hidden) { this.notify('idle'); return false; }
    let run;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Denne nettleseren støtter ikke Web Audio.');
      const context = new Context({ latencyHint: 'interactive' });
      run = { context, sources: [], controller: new AbortController(), graph: null };
      this.run = run;
      this.notify('loading');
      const ids = this.mix.channels.map(ch => ch.id);
      // Unlock on the user's gesture, before awaiting any network or decoder work.
      const resumed = context.resume();
      const limit = new Promise((_, reject) => {
        run.timer = setTimeout(() => reject(new Error('Lydstart tok for lang tid. Prøv igjen.')), 16000);
        run.controller.signal.addEventListener('abort', () => reject(new Error('Avbrutt.')), { once: true });
      });
      const [, buffers] = await Promise.race([Promise.all([resumed, Promise.all(ids.map(id => this.load(id, run)))]), limit]);
      clearTimeout(run.timer);
      if (this.run !== run || this.closed) return false;
      if (context.state !== 'running') throw new Error('Lydavspillingen ble avbrutt. Trykk Spill igjen.');
      const graph = createBandRoomGraph(context, this.mix);
      run.graph = graph; graph.output.connect(context.destination);
      const when = context.currentTime + .025;
      ids.forEach((id, i) => {
        const track = graph.inputs.get(id);
        if (!track) return;
        const voice = context.createBufferSource();
        run.sources.push(voice);
        voice.loop = true; voice.buffer = buffers[i]; voice.connect(track); voice.start(when);
      });
      context.onstatechange = () => { if (this.run === run && context.state !== 'running') this.stop(); };
      this.notify('playing');
      return true;
    } catch (error) {
      if (run && this.run !== run) return false;
      this.release(); this.notify('error', error instanceof Error ? error.message : 'Lydstart mislyktes. Prøv igjen.');
      return false;
    }
  }
  release() {
    const run = this.run;
    if (!run) return;
    this.run = null;
    clearTimeout(run.timer); run.controller.abort(); run.context.onstatechange = null;
    const finish = () => {
      for (const voice of run.sources) voice.disconnect();
      run.graph?.dispose();
      if (run.context.state !== 'closed') void run.context.close().catch(() => {});
    };
    if (run.graph && run.context.state === 'running') {
      run.graph.fadeOut();
      for (const voice of run.sources) voice.stop(run.context.currentTime + .04);
      setTimeout(finish, 50);
    } else finish();
  }
  stop() { this.release(); if (this.status !== 'idle') this.notify('idle'); }
  dispose() {
    this.closed = true;
    this.release(); this.buffers.clear();
    document.removeEventListener('visibilitychange', this.onHide);
    window.removeEventListener('pagehide', this.onPageHide);
  }
}
