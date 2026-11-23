// Shared by the teaching displays and offline renders. Dynamics thresholds are
// relative to the clip peak, so recordings of different levels exercise the same control.
export const listenFilters = {
  dark: { enabled: true, type: 'lowpass', frequency: 1300, Q: 20 * Math.log10(Math.SQRT1_2), gain: 0 },
  thin: { enabled: true, type: 'highpass', frequency: 350, Q: 20 * Math.log10(Math.SQRT1_2), gain: 0 },
  presence: { enabled: true, type: 'peaking', frequency: 1600, Q: 1.2, gain: 9 },
};
export const listenDynamics = {
  pressed: { relativeDb: -22, attack: 1.3, release: 85, ratio: 6, knee: 2, makeup: 0, mix: 100, rms: 0 },
  gated: { relativeDb: -8, attack: 0.2, hold: 6, release: 15, depth: 36 },
};
