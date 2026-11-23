function cancelError() { return new DOMException('Avbrutt', 'AbortError'); }

function renderInWorker(input, sampleRate, effect, signal) {
  if (signal.aborted) return Promise.reject(cancelError());
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./listenRender.worker.js', import.meta.url), { type: 'module' });
    const finish = (fn, value) => {
      signal.removeEventListener('abort', abort); worker.terminate(); fn(value);
    };
    const abort = () => finish(reject, cancelError());
    signal.addEventListener('abort', abort, { once: true });
    worker.onerror = () => finish(reject, new Error('Behandlingen av lydklippet mislyktes. Prøv igjen.'));
    worker.onmessage = ({ data }) => data.error ? finish(reject, new Error(data.error)) : finish(resolve, data);
    try { worker.postMessage({ input, sampleRate, effect }, [input.buffer]); }
    catch (error) { finish(reject, error); }
  });
}

async function preparePair(context, url, effect, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Kunne ikke hente opptaket. Prøv igjen.');
  const decoded = await context.decodeAudioData(await response.arrayBuffer());
  if (signal.aborted) throw cancelError();
  // All seven credited local clips are mono. Transfer a copy, never AudioBuffer's own storage.
  const { dry, changed, peaks, duration } = await renderInWorker(decoded.getChannelData(0).slice(), decoded.sampleRate, effect, signal);
  if (signal.aborted) throw cancelError();
  const buffers = [dry, changed].map(samples => {
    const buffer = context.createBuffer(1, samples.length, decoded.sampleRate);
    buffer.copyToChannel(samples, 0); return buffer;
  });
  return { buffers, preview: { peaks, duration } };
}

export class ListenEngine {
  constructor() {
    this.context = null; this.active = null; this.pending = null; this.variant = 'A';
    this.cache = new Map(); this.preview = null; this.closed = false;
  }

  async play({ url, effect }, variant = 'A') {
    if (this.closed) return false;
    this.stop(); this.variant = variant === 'B' ? 'B' : 'A';
    const key = `${url}|${effect}`;
    if (!this.cache.has(key)) this.preview = null;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new Error('Denne nettleseren støtter ikke lydtesten.');
    const context = this.context || (this.context = new Context({ latencyHint: 'interactive' }));
    const controller = new AbortController(); const { signal } = controller;
    this.pending = controller;
    let timedOut = false, onAbort;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    try {
      // Must run in the click handler, before fetching on Safari/iOS.
      const resumed = context.resume();
      const prepared = this.cache.get(key) || preparePair(context, url, effect, signal);
      const [, pair] = await Promise.race([
        Promise.all([resumed, prepared]),
        new Promise((_, reject) => { onAbort = () => reject(cancelError()); signal.addEventListener('abort', onAbort, { once: true }); }),
      ]);
      if (signal.aborted || this.closed || this.pending !== controller) return false;
      if (context.state !== 'running') throw new Error('Lyden ble avbrutt. Trykk spill for å prøve igjen.');
      this.cache.delete(key); this.cache.set(key, pair);
      if (this.cache.size > 2) this.cache.delete(this.cache.keys().next().value);
      this.preview = pair.preview;
      const master = context.createGain(); master.gain.value = 0; master.connect(context.destination);
      const now = context.currentTime, start = now + 0.012;
      const active = { master, start, duration: pair.preview.duration, lanes: [] };
      this.active = active;
      for (const [index, buffer] of pair.buffers.entries()) {
        const gain = context.createGain(), source = context.createBufferSource();
        active.lanes.push({ gain, source });
        source.buffer = buffer; source.loop = true;
        gain.gain.value = (index === 0 ? 'A' : 'B') === this.variant ? 1 : 0;
        source.connect(gain).connect(master); source.start(start);
      }
      master.gain.setValueAtTime(0, start); master.gain.linearRampToValueAtTime(1, start + 0.012);
      return true;
    } catch (error) {
      if (timedOut) throw new Error('Lydstart tok for lang tid. Prøv igjen.');
      if (signal.aborted || this.closed || this.pending !== controller) return false;
      controller.abort(); this.disconnect(); throw error;
    } finally {
      clearTimeout(timeout); if (onAbort) signal.removeEventListener('abort', onAbort);
      if (this.pending === controller) this.pending = null;
    }
  }

  select(variant) {
    this.variant = variant === 'B' ? 'B' : 'A';
    if (!this.active) return;
    // The sources remain on the same audio clock throughout. Complementary
    // gains with the same time constant avoid a level spike even on rapid taps.
    const now = this.context.currentTime;
    this.active.lanes.forEach(({ gain }, i) => gain.gain.setTargetAtTime((i === 0 ? 'A' : 'B') === this.variant ? 1 : 0, now, 0.006));
  }

  position() {
    if (!this.active) return 0;
    return (Math.max(0, this.context.currentTime - this.active.start) % this.active.duration) / this.active.duration;
  }

  disconnect() {
    if (!this.active) return;
    this.active.master.disconnect();
    for (const { source, gain } of this.active.lanes) {
      try { source.stop(); } catch { /* Node may have failed before start(). */ }
      source.disconnect(); gain.disconnect();
    }
    this.active = null;
  }

  stop() { this.pending?.abort(); this.pending = null; this.disconnect(); }

  async close() {
    this.closed = true; this.stop(); this.cache.clear(); this.preview = null;
    const context = this.context; this.context = null;
    if (context && context.state !== 'closed') await context.close();
  }
}
