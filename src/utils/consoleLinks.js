// Route only: do not pull the desk engine into the portal's entry bundle.
const panelNames = new Set(['bank', 'overview', 'preamp', 'filter', 'gate', 'peq', 'comp']);
export const consolePanel = value => panelNames.has(value) ? value : 'bank';

export function consoleChannel(value, fallback = 1) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 24 ? n : fallback;
}

// A source can be patched twice (or moved). Preserve the originating strip
// if it still matches. Never move or overwrite the user's existing patch.
export function findConsoleReturn(suggested, source, origin, channels = [], last) {
  const fallback = consoleChannel(suggested);
  const from = consoleChannel(origin, null);
  if (!source) return from || fallback;
  const matches = Array.isArray(channels) ? channels.filter(c => c && c.sourceId === source && consoleChannel(c.id, null)) : [];
  if (!matches.length) return from || fallback;
  for (const value of [from, consoleChannel(last, null), fallback]) {
    if (value && matches.some(c => Number(c.id) === value)) return value;
  }
  return Number(matches[0].id);
}

export function routeToConsole(suggested, source, origin) {
  try {
    const mix = JSON.parse(sessionStorage.getItem('lydteam:c3500:v1') || '{}');
    return findConsoleReturn(suggested, source, origin, mix?.channels, sessionStorage.getItem('lydteam:c3500:last-input'));
  } catch { return findConsoleReturn(suggested, source, origin); }
}
