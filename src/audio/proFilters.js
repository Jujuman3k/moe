// The same filter specs drive Web Audio and the drawn response. Low/high-pass
// Q is expressed in dB in Web Audio; peaking Q is linear. Shelves use S=1.
export const widthQ = width => Math.sqrt(2 ** width) / (2 ** width - 1);
const butterworthQ = 20 * Math.log10(Math.SQRT1_2);
export function proFilterSpecs(pro, bypass = false) {
  const f = pro.filters;
  const hp = (q, enabled) => ({ type: 'highpass', frequency: f.hpfHz, Q: 20 * Math.log10(q), gain: 0, enabled: enabled && !bypass });
  return [hp(f.slope === 24 ? 0.541196100146197 : Math.SQRT1_2, f.hpf), hp(1.306562964876377, f.hpf && f.slope === 24),
    { type: 'lowpass', frequency: f.lpfHz, Q: butterworthQ, gain: 0, enabled: f.lpf && !bypass },
    ...pro.eq.bands.map(band => ({ ...band, Q: ['highpass', 'lowpass'].includes(band.type) ? butterworthQ : widthQ(band.width), enabled: band.enabled && pro.eq.enabled && !bypass })),
  ];
}

// RBJ biquads, matching BiquadFilterNode's coefficient definitions.
export function filterCoefficients(spec, sampleRate = 48000) {
  if (!spec.enabled) return [1, 0, 0, 1, 0, 0];
  const w = 2 * Math.PI * Math.min(spec.frequency, sampleRate * 0.499) / sampleRate;
  const c = Math.cos(w); const s = Math.sin(w); const A = 10 ** (spec.gain / 40);
  const q = ['highpass', 'lowpass'].includes(spec.type) ? 10 ** (spec.Q / 20) : spec.Q;
  const alpha = s / (2 * q);
  if (spec.type === 'highpass') return [(1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + alpha, -2 * c, 1 - alpha];
  if (spec.type === 'lowpass') return [(1 - c) / 2, 1 - c, (1 - c) / 2, 1 + alpha, -2 * c, 1 - alpha];
  if (spec.type === 'peaking') return [1 + alpha * A, -2 * c, 1 - alpha * A, 1 + alpha / A, -2 * c, 1 - alpha / A];
  const k = Math.sqrt(2 * A) * s;
  if (spec.type === 'lowshelf') return [A * ((A + 1) - (A - 1) * c + k), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - k), (A + 1) + (A - 1) * c + k, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - k];
  return [A * ((A + 1) + (A - 1) * c + k), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - k), (A + 1) - (A - 1) * c + k, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - k];
}

export function responseDb(specs, frequency, sampleRate = 48000) {
  const w = 2 * Math.PI * frequency / sampleRate;
  const power = (a, b, c) => (a + b * Math.cos(w) + c * Math.cos(2 * w)) ** 2 + (b * Math.sin(w) + c * Math.sin(2 * w)) ** 2;
  return specs.reduce((sum, spec) => {
    const [b0, b1, b2, a0, a1, a2] = filterCoefficients(spec, sampleRate);
    return sum + 10 * Math.log10(Math.max(1e-15, power(b0, b1, b2) / power(a0, a1, a2)));
  }, 0);
}
