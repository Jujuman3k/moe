import { audioSources } from '../data/audioSources.js';
import { arrangeBandLoop } from './bandRoomGraph.js';
import { createC3500Graph, silentC3500Meters } from './c3500Graph.js';

const sources = new Map(audioSources.map(s => [s.id, s]));
const assigned = mix => new Set(mix.channels.map(ch => ch.sourceId).filter(id => sources.has(id)));
const startError = 'Lydstart tok for lang tid. Prøv igjen.';
const timeout = 16000;

// decodeAudioData and addModule don't support AbortSignal: race the work with
// cancellation, release the timeout, and ignore any eventual stale completion.
async function duringRun(run, work) {
  let timer, onAbort;
  const interruption = new Promise((_, reject) => {
    onAbort = () => reject(new Error('Avbrutt.'));
    timer = setTimeout(() => reject(new Error(startError)), timeout);
    if (run.abort.signal.aborted) onAbort();
    else run.abort.signal.addEventListener('abort', onAbort, { once: true });
  });
  try { return await Promise.race([work, interruption]); }
  finally {
    clearTimeout(timer);
    run.abort.signal.removeEventListener('abort', onAbort);
  }
}

export class C3500Engine {
  constructor({ onStatus = () => {} } = {}) {
    this.onStatus = onStatus;
    this.status = 'idle';
    this.buffers = new Map();
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

  readMeters() {
    return this.run?.graph?.readMeters() || silentC3500Meters();
  }

  setMix(mix) {
    this.mix = mix;
    const run = this.run;
    if (!run?.graph) return;
    try {
      run.graph.setMix(mix);
      this.syncVoices(run);
    } catch (error) { this.fail(run, error); }
  }

  fail(run, error) {
    if (this.run !== run) return;
    this.release();
    this.notify('error', error instanceof Error ? error.message : 'Kunne ikke starte lyden.');
  }

  async load(run, id) {
    const key = id + ':' + run.ctx.sampleRate;
    if (this.buffers.has(key)) return this.buffers.get(key);
    if (run.loading.has(id)) return run.loading.get(id);
    const source = sources.get(id);

    const decode = async () => {
      const response = await fetch(source.file, { signal: run.abort.signal });
      if (!response.ok) throw new Error('Opptaket er ikke tilgjengelig.');
      const clip = await run.ctx.decodeAudioData(await response.arrayBuffer());
      if (this.run !== run) return null;
      const values = arrangeBandLoop(id, clip.getChannelData(0), clip.sampleRate);
      const buffer = run.ctx.createBuffer(1, values.length, clip.sampleRate);
      buffer.copyToChannel(values, 0);
      this.buffers.set(key, buffer);
      return buffer;
    };

    const result = duringRun(run, decode()).catch(() => {
      throw new Error('Kunne ikke åpne ' + source.label.toLowerCase() + '. Sjekk forbindelsen og prøv igjen.');
    }).finally(() => run.loading.delete(id));
    run.loading.set(id, result);
    return result;
  }

  startVoice(run, id, buffer) {
    if (this.run !== run || !buffer || run.voices.has(id) || !assigned(this.mix).has(id)) return;
    const voice = run.ctx.createBufferSource();
    voice.buffer = buffer;
    voice.loop = true;
    voice.connect(run.graph.socket(id));
    const when = Math.max(run.zero, run.ctx.currentTime + .008);
    // Newly patched sources join the existing transport. Two strips patched to
    // the same recording listen to the same source node, in phase.
    voice.start(when, (when - run.zero) % buffer.duration);
    run.voices.set(id, voice);
  }

  syncVoices(run) {
    const wanted = assigned(this.mix);
    for (const [id, voice] of run.voices) {
      if (!wanted.has(id)) {
        voice.stop();
        voice.disconnect();
        run.voices.delete(id);
      }
    }
    for (const id of wanted) {
      if (run.voices.has(id) || run.scheduled.has(id)) continue;
      const cached = this.buffers.get(id + ':' + run.ctx.sampleRate);
      if (cached) {
        this.startVoice(run, id, cached);
        continue;
      }
      run.scheduled.add(id);
      this.load(run, id).then(buffer => this.startVoice(run, id, buffer)).catch(error => {
        if (assigned(this.mix).has(id)) this.fail(run, error);
      }).finally(() => run.scheduled.delete(id));
    }
  }

  async play(mix) {
    if (this.closed) return false;
    if (this.run) { this.setMix(mix); return this.status === 'playing'; }
    this.mix = mix;
    if (document.hidden) return false;
    if (!assigned(mix).size) {
      this.notify('error', 'Velg en lydkilde i Preamp før du starter.');
      return false;
    }

    let run;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Nettleseren støtter ikke Web Audio.');
      const ctx = new Context({ latencyHint: 'interactive' });
      run = { ctx, abort: new AbortController(), voices: new Map(), loading: new Map(), scheduled: new Set(), graph: null };
      this.run = run;
      if (!ctx.audioWorklet) throw new Error('Lydprosessorene trenger Web AudioWorklet. Åpne portalen over HTTPS i en støttet nettleser.');
      this.notify('loading');
      // Unlock before the first await, under the initiating user gesture.
      const resumed = ctx.resume();
      await duringRun(run, Promise.all([
        resumed,
        ctx.audioWorklet.addModule(new URL('./proDynamics.worklet.js', import.meta.url)),
        ...Array.from(assigned(mix), id => this.load(run, id)),
      ]));
      if (this.run !== run || this.closed) return false;
      if (ctx.state !== 'running') throw new Error('Avspillingen ble avbrutt. Trykk Spill igjen.');

      run.graph = createC3500Graph(ctx, this.mix);
      run.graph.output.connect(ctx.destination);
      run.zero = ctx.currentTime + .035;
      this.syncVoices(run);
      ctx.onstatechange = () => { if (this.run === run && ctx.state !== 'running') this.stop(); };
      this.notify('playing');
      return true;
    } catch (error) {
      if (!run) this.notify('error', error instanceof Error ? error.message : startError);
      else this.fail(run, error);
      return false;
    }
  }

  release() {
    const run = this.run;
    if (!run) return;
    this.run = null;
    run.ctx.onstatechange = null;
    run.abort.abort();
    const finish = () => {
      for (const voice of run.voices.values()) voice.disconnect();
      run.graph?.dispose();
      if (run.ctx.state !== 'closed') void run.ctx.close().catch(() => {});
    };
    if (run.graph && run.ctx.state === 'running') {
      run.graph.fadeOut();
      for (const voice of run.voices.values()) voice.stop(run.ctx.currentTime + .04);
      setTimeout(finish, 50);
    } else finish();
  }

  stop() {
    this.release();
    if (this.status !== 'idle') this.notify('idle');
  }

  dispose() {
    this.closed = true;
    this.release();
    this.buffers.clear();
    document.removeEventListener('visibilitychange', this.onHide);
    window.removeEventListener('pagehide', this.onPageHide);
  }
}
