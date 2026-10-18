import { useEffect, useState } from 'react';
import { normalizeProgress, parseProgress, PROGRESS_KEY, toggleId } from '../utils/learningProgress.js';

function readProgress() {
  try { return { progress: parseProgress(window.localStorage.getItem(PROGRESS_KEY)), storageAvailable: true }; }
  catch { return { progress: normalizeProgress(null), storageAvailable: false }; }
}

export function useLearningProgress() {
  const [state, setState] = useState(readProgress);
  useEffect(() => {
    const sync = event => {
      if (event.key === PROGRESS_KEY || event.key === null) setState(readProgress());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = changes => {
    const progress = normalizeProgress({ ...state.progress, ...changes });
    let storageAvailable = true;
    try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
    catch { storageAvailable = false; }
    setState({ progress, storageAvailable });
  };
  return {
    ...state,
    toggleCompleted: id => update({ completed: toggleId(state.progress.completed, id) }),
    toggleFavorite: id => update({ favorites: toggleId(state.progress.favorites, id) }),
    rememberVideo: id => update({ lastVideoId: id }),
    solveScenario: id => update({ solved: [...state.progress.solved, id] }),
  };
}
