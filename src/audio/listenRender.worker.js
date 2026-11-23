import { renderListenPair } from './listenRender.js';

self.onmessage = ({ data: { input, sampleRate, effect } }) => {
  try {
    const pair = renderListenPair(input, sampleRate, effect);
    self.postMessage(pair, [pair.dry.buffer, pair.changed.buffer]);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
