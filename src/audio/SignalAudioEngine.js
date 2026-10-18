import { createSignalAudioGraph, loadGate } from './signalAudioGraph.js';

export class SignalAudioEngine {
  constructor() { this.context = null; this.graph = null; this.source = null; this.cache = new Map(); this.ticket = 0; this.disposed = false; }
  update(state, listening) { this.state = state; this.listening = listening; this.graph?.update(state, listening); }
  async play(url) {
    this.stop();
    const ticket = this.ticket;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new Error('Denne nettleseren støtter ikke Web Audio.');
    if (!this.context) {
      this.context = new Context({ latencyHint: 'interactive' });
      this.ready = loadGate(this.context);
    }
    // Resume directly in the user's click, before fetching/decoding (iOS).
    const resumed = this.context.resume();
    let startupTimer;
    try {
      await Promise.race([Promise.all([resumed, this.ready]), new Promise((_, reject) => { startupTimer = setTimeout(() => reject(new Error('Lydstart tok for lang tid. Trykk Spill igjen.')), 10000); })]);
    } finally { clearTimeout(startupTimer); }
    if (this.disposed || ticket !== this.ticket) return false;
    if (this.context.state !== 'running') throw new Error('Lydavspillingen ble avbrutt. Trykk Spill igjen.');
    if (!this.cache.has(url)) {
      const controller = new AbortController(); this.request = controller;
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Lydfilen kunne ikke lastes.');
        const buffer = await this.context.decodeAudioData(await response.arrayBuffer());
        // One input channel; normalize only once, never while adjusting a fader.
        let peak = 0;
        for (const value of buffer.getChannelData(0)) peak = Math.max(peak, Math.abs(value));
        if (peak < 0.000001) throw new Error('Lydfilen inneholder ikke et brukbart signal.');
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const values = buffer.getChannelData(channel);
          for (let i = 0; i < values.length; i++) values[i] /= peak;
        }
        if (this.disposed || ticket !== this.ticket) return false;
        this.cache.set(url, buffer);
      } finally { clearTimeout(timeout); }
    }
    if (this.disposed || ticket !== this.ticket) return false;
    this.graph = createSignalAudioGraph(this.context, this.state, this.listening);
    this.graph.output.connect(this.context.destination);
    this.source = this.context.createBufferSource(); this.source.buffer = this.cache.get(url); this.source.loop = true;
    this.source.connect(this.graph.input); this.source.start(); this.graph.start();
    return true;
  }
  stop() {
    this.ticket += 1;
    this.request?.abort(); this.request = null;
    this.graph?.silence();
    if (this.source) { this.source.stop(); this.source.disconnect(); this.source = null; }
    this.graph?.dispose(); this.graph = null;
  }
  async close() { this.disposed = true; this.stop(); this.cache.clear(); if (this.context && this.context.state !== 'closed') await this.context.close(); }
}
