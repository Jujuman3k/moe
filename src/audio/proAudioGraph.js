import { proFilterSpecs } from './proFilters.js';

export function createProAudioGraph(context, own, tap) {
  const gain = () => own(context.createGain());
  const input = gain(); const trim = tap('proTrim', gain()); input.connect(trim);
  function filterCell(source) {
    const node = own(context.createBiquadFilter());
    const dry = gain(); const wet = gain(); const output = gain();
    source.connect(dry).connect(output); source.connect(node).connect(wet).connect(output);
    return { node, dry, wet, output };
  }
  const filters = []; let tail = trim;
  for (let i = 0; i < 3; i++) { const filter = filterCell(tail); filters.push(filter); tail = filter.output; }
  tap('proFiltered', tail);
  function dynamics(name, source, meter) {
    const node = own(new AudioWorkletNode(context, name, { numberOfInputs: 2, numberOfOutputs: 1, outputChannelCount: [1] }));
    source.connect(node, 0, 0);
    const lo = filterCell(source); const hi = filterCell(lo.output);
    hi.output.connect(node, 0, 1);
    let values = { reduction: 0, closed: false };
    node.port.onmessage = event => { values = event.data; };
    tap(meter, node);
    return { node, lo, hi, levels: () => values };
  }
  const gate = dynamics('lydteam-pro-gate', tail, 'proGated'); tail = gate.node;
  for (let i = 0; i < 4; i++) { const filter = filterCell(tail); filters.push(filter); tail = filter.output; }
  tap('proEqualized', tail);
  const comp = dynamics('lydteam-pro-comp', tail, 'proCompressed');
  const output = gain(); comp.node.connect(output);
  function update(pro, enabled, bypass, set) {
    set(trim.gain, 10 ** (pro.trim / 20) * (pro.polarity ? -1 : 1));
    set(output.gain, enabled ? 1 : 0);
    const applyFilter = (cell, spec) => {
      cell.node.type = spec.type;
      set(cell.node.frequency, Math.min(spec.frequency, context.sampleRate * 0.499));
      set(cell.node.Q, spec.Q); set(cell.node.gain, spec.gain);
      set(cell.dry.gain, spec.enabled ? 0 : 1); set(cell.wet.gain, spec.enabled ? 1 : 0);
    };
    proFilterSpecs(pro, bypass).forEach((spec, index) => applyFilter(filters[index], spec));
    for (const [processor, settings] of [[gate, pro.gate], [comp, pro.comp]]) {
      for (const [name, param] of processor.node.parameters) {
        const value = name === 'enabled' ? settings.enabled && !bypass && enabled : settings[name];
        set(param, Number(value), typeof value === 'boolean');
      }
      applyFilter(processor.lo, { type: 'highpass', frequency: settings.keyHPF, Q: -3.0103, gain: 0, enabled: settings.keyEnabled });
      applyFilter(processor.hi, { type: 'lowpass', frequency: settings.keyLPF, Q: -3.0103, gain: 0, enabled: settings.keyEnabled });
    }
  }
  return { input, output, update,
    levels: () => ({ gateReduction: gate.levels().reduction, gateClosed: gate.levels().closed && gate.levels().reduction > 1, reduction: comp.levels().reduction }),
    dispose: () => { gate.node.port.close(); comp.node.port.close(); },
  };
}
