// Standalone worklet: no external imports, so Vite can copy it as an asset.
export class GateEnvelope {
  constructor(rate) {
    this.envelope = 0;
    this.gain = 1;
    this.hold = 0;
    this.rate = rate;
    this.fall = Math.exp(-1 / (rate * 0.025));
    this.attack = Math.exp(-1 / (rate * 0.002));
    this.release = Math.exp(-1 / (rate * 0.08));
  }
  next(input, threshold, enabled) {
    this.envelope = Math.max(Math.abs(input), this.envelope * this.fall);
    if (this.envelope >= threshold) this.hold = this.rate * 0.05;
    else this.hold = Math.max(0, this.hold - 1);
    const open = !enabled || this.hold > 0 || (this.gain > 0.5 && this.envelope >= threshold * 0.707);
    const target = open ? 1 : 0;
    const speed = open ? this.attack : this.release;
    this.gain = target + (this.gain - target) * speed;
    return input * this.gain;
  }
}

if (typeof registerProcessor === 'function') {
  class SignalGateProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [{ name: 'threshold', defaultValue: -35, minValue: -90, maxValue: 0, automationRate: 'k-rate' }, { name: 'enabled', defaultValue: 0, automationRate: 'k-rate' }];
    }
    constructor() { super(); this.gate = new GateEnvelope(sampleRate); this.frames = 0; }
    process(inputs, outputs, parameters) {
      const input = inputs[0]?.[0];
      const output = outputs[0][0];
      const threshold = 10 ** (parameters.threshold[0] / 20);
      for (let i = 0; i < output.length; i++) output[i] = this.gate.next(input?.[i] || 0, threshold, parameters.enabled[0] > 0.5);
      this.frames += output.length;
      if (this.frames > sampleRate / 10) { this.port.postMessage({ closed: this.gate.gain < 0.1 }); this.frames = 0; }
      return true;
    }
  }
  registerProcessor('lydteam-gate', SignalGateProcessor);
}
