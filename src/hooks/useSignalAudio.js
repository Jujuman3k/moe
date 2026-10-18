import { useCallback, useEffect, useRef, useState } from 'react';
import { SignalAudioEngine } from '../audio/SignalAudioEngine.js';
import { audioSources } from '../data/audioSources.js';

export function useSignalAudio(state) {
  const engine = useRef(null);
  const sequence = useRef(0);
  const [sourceId, setSourceId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [meters, setMeters] = useState(null);
  const [listening, setListening] = useState({ target: 'main', volume: 50, original: false });
  useEffect(() => { engine.current?.update(state, listening); }, [state, listening]);
  const stop = useCallback(() => {
    sequence.current += 1; engine.current?.stop(); setStatus('stopped'); setMeters(null);
  }, []);
  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', stop);
    return () => {
      sequence.current += 1;
      engine.current?.close(); engine.current = null;
      document.removeEventListener('visibilitychange', hidden); window.removeEventListener('pagehide', stop);
    };
  }, [stop]);
  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => { const next = engine.current?.graph?.levels(); if (next) setMeters(next); }, 100);
    return () => clearInterval(timer);
  }, [status]);
  async function play(id = sourceId || audioSources[0].id) {
    const source = audioSources.find(item => item.id === id);
    if (!source) return false;
    const token = ++sequence.current;
    setSourceId(id); setStatus('loading'); setError(''); setMeters(null);
    if (!engine.current) engine.current = new SignalAudioEngine();
    const current = engine.current;
    current.update(state, listening);
    try {
      const started = await current.play(source.file);
      if (token !== sequence.current) return false;
      setStatus(started ? 'playing' : 'stopped'); return started;
    } catch (cause) {
      if (token !== sequence.current) return false;
      if (engine.current === current) engine.current = null;
      await current.close();
      if (token !== sequence.current) return false;
      setError(cause.name === 'AbortError' ? 'Lydfilen tok for lang tid å laste. Prøv igjen.' : 'Kunne ikke starte lyd. Sjekk forbindelsen og prøv Spill igjen.');
      setStatus('error'); return false;
    }
  }
  function select(id) {
    setSourceId(id); setError('');
    if (status === 'playing' || status === 'loading') void play(id);
  }
  const readScope = useCallback(node => engine.current?.graph?.scope(node), []);
  const readSpectrum = useCallback(() => engine.current?.graph?.readSpectrum(), []);
  return { sourceId, source: audioSources.find(item => item.id === sourceId), status, playing: status === 'playing', error, meters, listening, readScope, readSpectrum,
    play, stop, select, setListening: patch => setListening(previous => ({ ...previous, ...patch })),
    useSketch: () => { stop(); setSourceId(null); setError(''); setListening(previous => ({ ...previous, original: false })); },
  };
}
