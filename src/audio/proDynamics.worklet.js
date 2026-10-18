// Standalone audio-thread module. Exported envelopes also support deterministic
// tests. These are teaching algorithms, not Allen & Heath DEEP models.
const db = value => 20 * Math.log10(Math.max(1e-6, value));
const coefficient = (rate, ms) => Math.exp(-1 / (rate * Math.max(0.05, ms) / 1000));

export function compressionReduction(inputDb, threshold, ratio, knee) {
  const above = inputDb - threshold;
  if (knee > 0 && Math.abs(above) < knee / 2) return (1 - 1 / ratio) * (above + knee / 2) ** 2 / (2 * knee);
  return above > 0 ? above * (1 - 1 / ratio) : 0;
}

export class ProGateEnvelope {
  constructor(rate) { this.rate = rate; this.envelope = 0; this.gain = 1; this.hold = 0; this.open = true; this.fall = coefficient(rate, 5); }
  configure(p) { this.p = p; this.attack = coefficient(this.rate, p.attack); this.release = coefficient(this.rate, p.release); this.floor = 10 ** (-p.depth / 20); this.threshold = 10 ** (p.threshold / 20); }
  next(input, key = input) {
    const p = this.p;
    this.envelope = Math.max(Math.abs(key), this.envelope * this.fall);
    if (!p.enabled) { this.gain = 1; this.hold = 0; this.open = true; return input; }
    if (this.envelope >= this.threshold || (this.open && this.envelope >= this.threshold * 0.707)) { this.open = true; this.hold = this.rate * p.hold / 1000; }
    else if (this.hold > 0) this.hold--;
    else this.open = false;
    const target = this.open ? 1 : this.floor;
    this.gain = target + (this.gain - target) * (this.open ? this.attack : this.release);
    return input * this.gain;
  }
}

export class ProCompressorEnvelope {
  constructor(rate) { this.rate = rate; this.power = 0; this.peak = 0; this.reduction = 0; this.rmsFall = coefficient(rate, 20); this.peakFall = coefficient(rate, 1); }
  configure(p) { this.p = p; this.attack = coefficient(this.rate, p.attack); this.release = coefficient(this.rate, p.release); }
  next(input, key = input) {
    const p = this.p;
    this.power = this.power * this.rmsFall + key * key * (1 - this.rmsFall);
    this.peak = Math.max(Math.abs(key), this.peak * this.peakFall);
    if (!p.enabled) { this.reduction = 0; return input; }
    const target = compressionReduction(db(p.rms ? Math.sqrt(this.power) : this.peak), p.threshold, p.ratio, p.knee);
    this.reduction = target + (this.reduction - target) * (target > this.reduction ? this.attack : this.release);
    return input * ((1 - p.mix / 100) + p.mix / 100 * 10 ** ((p.makeup - this.reduction) / 20));
  }
}

if (typeof registerProcessor === 'function') {
  const parameter = (name, defaultValue, minValue, maxValue) => ({ name, defaultValue, minValue, maxValue, automationRate: 'k-rate' });
  function processor(Envelope, descriptors, isGate) {
    return class extends AudioWorkletProcessor {
      static get parameterDescriptors() { return descriptors; }
      constructor() { super(); this.envelope = new Envelope(sampleRate); this.frames = 0; this.values = {}; }
      process(inputs, outputs, parameters) {
        for (const [name, values] of Object.entries(parameters)) this.values[name] = values[0];
        this.envelope.configure(this.values);
        const output = outputs[0][0]; const input = inputs[0]?.[0]; const key = inputs[1]?.[0];
        for (let i = 0; i < output.length; i++) output[i] = this.envelope.next(input?.[i] || 0, key?.[i] ?? input?.[i] ?? 0);
        this.frames += output.length;
        if (this.frames >= sampleRate / 20) { this.port.postMessage({ reduction: isGate ? -db(this.envelope.gain) : this.envelope.reduction, closed: isGate && !this.envelope.open }); this.frames = 0; }
        return true;
      }
    };
  }
  const common = [parameter('enabled', 0, 0, 1), parameter('threshold', -30, -90, 0), parameter('attack', 10, 0.05, 300), parameter('release', 150, 10, 2000)];
  registerProcessor('lydteam-pro-gate', processor(ProGateEnvelope, [...common, parameter('depth', 40, 0, 60), parameter('hold', 80, 0, 5000)], true));
  registerProcessor('lydteam-pro-comp', processor(ProCompressorEnvelope, [...common, parameter('ratio', 3, 1, 20), parameter('knee', 6, 0, 24), parameter('makeup', 0, -12, 24), parameter('mix', 100, 0, 100), parameter('rms', 0, 0, 1)], false));
}
