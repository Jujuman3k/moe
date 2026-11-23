export function echo(dry, rate) {
  const gap = Math.round(rate * 0.2);
  return dry.map((x, i) => x + 0.38 * (dry[i - gap] || 0) + 0.17 * (dry[i - gap * 2] || 0));
}

// A short Schroeder room: four damped, differently spaced reflections feed
// two allpasses. The energy spreads into a tail instead of two rhythmic taps.
export function room(dry, rate) {
  const wet = new Float32Array(dry.length);
  for (const ms of [29.7, 37.1, 41.1, 43.7]) {
    const length = Math.max(1, Math.round(ms * rate / 1000));
    const line = new Float32Array(length);
    const feedback = 10 ** (-3 * length / (rate * 0.55));
    let head = 0, smooth = 0;
    for (let i = 0; i < dry.length; ++i) {
      const delayed = line[head]; smooth += 0.72 * (delayed - smooth);
      line[head] = dry[i] + smooth * feedback;
      wet[i] += 0.37 * delayed;
      if (++head === length) head = 0;
    }
  }
  for (const ms of [5, 1.7]) {
    const length = Math.max(1, Math.round(ms * rate / 1000));
    const line = new Float32Array(length); let head = 0;
    for (let i = 0; i < wet.length; ++i) {
      const x = wet[i], y = line[head] - 0.58 * x;
      line[head] = x + 0.58 * y;
      wet[i] = y;
      if (++head === length) head = 0;
    }
  }
  for (let i = 0; i < wet.length; ++i) wet[i] += dry[i];
  return wet;
}
