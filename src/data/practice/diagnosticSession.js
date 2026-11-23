export function freshDiagnostic() {
  return { seen: [], selected: null, attempt: null, solved: false };
}

export function hasEvidence(item, seen) {
  return item.probes.some(probe => probe.proof && seen.includes(probe.id));
}

export function updateDiagnostic(item, round, event) {
  if (event.type === 'reset') return freshDiagnostic();
  if (event.type === 'inspect') {
    const probe = item.probes.find(p => p.id === event.id);
    if (!probe || (probe.after && !round.seen.includes(probe.after))) return round;
    const seen = round.seen.includes(probe.id) ? round.seen : [...round.seen, probe.id];
    return { ...round, selected: probe.id, seen, attempt: round.solved ? round.attempt : null };
  }
  if (event.type === 'apply' && !round.solved && round.seen.length && item.options.some(o => o.id === event.id)) {
    return { ...round, attempt: event.id, solved: event.id === item.correct && hasEvidence(item, round.seen) };
  }
  return round;
}

// Replay valid inspections in order rather than trusting hand-edited/stale session storage.
export function restoreDiagnostic(item, serialized) {
  try {
    const saved = JSON.parse(serialized);
    if (!saved || !Array.isArray(saved.seen)) return freshDiagnostic();
    let round = freshDiagnostic();
    for (const id of saved.seen.slice(0, item.probes.length)) round = updateDiagnostic(item, round, { type: 'inspect', id });
    if (round.seen.includes(saved.selected)) round = { ...round, selected: saved.selected };
    if (saved.attempt !== item.correct || saved.solved === true || !hasEvidence(item, round.seen)) {
      round = updateDiagnostic(item, round, { type: 'apply', id: saved.attempt });
    }
    return round;
  } catch { return freshDiagnostic(); }
}
