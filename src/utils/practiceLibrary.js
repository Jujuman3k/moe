export function filterScenarios(scenarios, { topic = 'all', level = 'all', status = 'all', query = '', solved = [] } = {}) {
  const terms = query.toLocaleLowerCase('nb-NO').trim().split(/\s+/).filter(Boolean);
  const solvedIds = new Set(solved);
  return scenarios.filter(scenario => {
    if (topic !== 'all' && scenario.topicId !== topic) return false;
    if (level !== 'all' && scenario.level !== Number(level)) return false;
    if (status === 'unsolved' && solvedIds.has(scenario.id)) return false;
    if (status === 'solved' && !solvedIds.has(scenario.id)) return false;
    // Answers and explanations are deliberately excluded: searching should not reveal the solution.
    const text = `${scenario.title} ${scenario.question} ${scenario.tag}`.toLocaleLowerCase('nb-NO');
    return terms.every(term => text.includes(term));
  });
}

export function pickScenario(scenarios, currentId, solved = [], random = Math.random) {
  const alternatives = scenarios.filter(scenario => scenario.id !== currentId);
  const unsolved = alternatives.filter(scenario => !solved.includes(scenario.id));
  const pool = unsolved.length ? unsolved : alternatives;
  if (!pool.length) return scenarios[0] ?? null;
  return pool[Math.floor(random() * pool.length)];
}

export function nextScenario(scenarios, currentId) {
  if (!scenarios.length || (scenarios.length === 1 && scenarios[0].id === currentId)) return null;
  const index = scenarios.findIndex(scenario => scenario.id === currentId);
  return scenarios[(index + 1) % scenarios.length];
}
