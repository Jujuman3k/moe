import { useEffect, useState } from 'react';
import { emptySoundcheck, readSoundcheck, updateSoundcheck, writeSoundcheck } from '../../data/practice/soundcheck.js';

const storageKey = 'lydteam.soundcheck.v1';

export function useSoundcheck() {
  const [round, setRound] = useState(() => {
    try { return readSoundcheck(window.sessionStorage.getItem(storageKey)); } catch { return null; }
  });
  useEffect(() => {
    if (round) try { window.sessionStorage.setItem(storageKey, writeSoundcheck(round)); } catch { /* In-memory practice still works. */ }
  }, [round]);
  return { round, start: () => setRound(emptySoundcheck()), update: event => setRound(prev => updateSoundcheck(prev, event)) };
}
