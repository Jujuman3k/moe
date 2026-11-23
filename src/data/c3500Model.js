// This is the patch for the local teaching scene, not the desk's factory patch.
import { createProSettings } from './proAudioSettings.js';
import { audioSources } from './audioSources.js';
import { captureProSettings } from '../utils/proSnapshots.js';

export const C3500_INPUTS = 24;
const patch = ['kick', 'bass', 'snare', 'male', 'female', 'piano', 'guitar'];
const names = new Map(audioSources.map(s => [s.id, s.label]));
export const defaultChannelForSource = sourceId => Math.max(1, patch.indexOf(sourceId) + 1);
export const c3500ChannelName = ch => names.get(ch?.sourceId) || 'Upatchet';

const number = (value, min, max, fallback) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const flag = (value, fallback) => typeof value === 'boolean' ? value : fallback;

function defaults(index) {
  const sourceId = patch[index] ?? null;
  return {
    id: index + 1, sourceId, gain: 28, pro: createProSettings(),
    fader: [-2, -6, -7][index] ?? -8, pan: 0,
    mute: index >= 3 && Boolean(sourceId), pafl: false,
  };
}

export function createC3500Mix() {
  return { channels: Array.from({ length: C3500_INPUTS }, (_, i) => defaults(i)), masterDb: -6 };
}

function safePro(pro, fallback) {
  // Same parameter schema as the existing Pro mixer and its A/B snapshots.
  if (!pro || pro === fallback) return fallback;
  try { return captureProSettings(pro); } catch { return fallback; }
}

function channelUpdate(current, change) {
  if (!change || typeof change !== 'object') return current;
  const validSource = change.sourceId === null || names.has(change.sourceId);
  return {
    id: current.id,
    sourceId: validSource ? change.sourceId : current.sourceId,
    gain: number(change.gain, 0, 60, current.gain),
    pro: safePro(change.pro, current.pro),
    fader: number(change.fader, -60, 10, current.fader),
    pan: number(change.pan, -100, 100, current.pan),
    mute: flag(change.mute, current.mute), pafl: flag(change.pafl, current.pafl),
  };
}

export function patchC3500Channel(mix, id, change) {
  if (!Number.isInteger(id) || id < 1 || id > C3500_INPUTS) return mix;
  return { ...mix, channels: mix.channels.map(ch => ch.id === id ? channelUpdate(ch, change) : ch) };
}

export function restoreC3500Mix(raw) {
  const base = createC3500Mix();
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(value?.channels) || value.channels.length !== C3500_INPUTS) return base;
    return {
      masterDb: number(value.masterDb, -60, 10, base.masterDb),
      channels: base.channels.map((ch, i) => {
        const saved = value.channels[i];
        // Strip identities derive from their socket index; never accept duplicates.
        return saved?.id === ch.id ? channelUpdate(ch, saved) : ch;
      }),
    };
  } catch { return base; }
}
