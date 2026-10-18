// Relative changes only: fixed input and send level, no mute/DCA/processing model.
export function routingLevels(faderDb, preFade) {
  return { main: faderDb, monitor: preFade ? 0 : faderDb };
}
