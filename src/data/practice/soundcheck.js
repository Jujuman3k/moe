import { practiceScenarios } from '../practiceScenarios.js';

// Refer to permanent catalogue IDs so guided and independent practice share progress.
const programme = [
  { id: 'mic-distance', label: 'Mikrofon', cue: 'Før bandet spiller tester dere vokalmikrofonen med tale.', takeaway: 'Avtal jevn avstand til mikrofonen.', task: 'Hør den tørre vokalen og legg merke til hvor mye nivået varierer før du skrur på noe.', action: 'Lytt til kilden', node: 'input' },
  { id: 'gain-headroom', label: 'Gain', cue: 'Nå skal dere sette inngangsnivået for det sterkeste refrenget.', takeaway: 'Sett gain etter de sterkeste partiene.', task: 'Spill vokalen, juster inngangsgain og følg toppene. La det være margin før klipping.', action: 'Prøv inngangsgain', node: 'preamp' },
  { id: 'monitor-pre-fade', label: 'Monitor', cue: 'Du lager miksen i salen. Vokalisten har sin egen monitormiks.', takeaway: 'Sjekk om monitorsenden skal følge faderen.', task: 'Velg Monitor som lyttepunkt. Bytt mellom pre og post, og senk kanalfaderen. Når endrer lyden i øret seg?', action: 'Sammenlign pre og post', node: 'monitor_branch' },
  { id: 'fx-return-muted', label: 'Klang', cue: 'Vokalisten er klar. Gi den tørre stemmen litt rom i salen.', takeaway: 'Følg klangen hele veien tilbake til miksen.', task: 'Spill vokalen med litt klangsend. Slå FX-returen av og på, og lytt til halen mellom frasene.', action: 'Prøv klangreturen', node: 'fx_branch' },
];

export const soundcheckSteps = programme.map(step => ({ ...step, scenario: practiceScenarios.find(item => item.id === step.id) }));
const correct = (step, index) => Boolean(step?.scenario?.options[index]?.correct);
export const emptySoundcheck = () => ({ step: 0, answers: soundcheckSteps.map(() => ({ first: null, last: null, hint: false })) });

// Session data is optional. Fail closed on obsolete IDs, impossible transitions or
// invalid choice indexes; the main catalogue's independent progress is untouched.
export function readSoundcheck(raw) {
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !Array.isArray(saved.answers) || saved.answers.length !== soundcheckSteps.length || !Number.isInteger(saved.step) || saved.step < 0 || saved.step > soundcheckSteps.length) return null;
    for (const [i, s] of soundcheckSteps.entries()) {
      const a = saved.answers[i];
      const valid = n => n === null || (Number.isInteger(n) && n >= 0 && n < s.scenario.options.length);
      if (!a || a.id !== s.id || typeof a.hint !== 'boolean' || !valid(a.first) || !valid(a.last) || (a.first === null) !== (a.last === null) || (correct(s, a.first) && a.first !== a.last) || (i < saved.step && !correct(s, a.last)) || (i > saved.step && (a.first !== null || a.hint))) return null;
    }
    return { step: saved.step, answers: saved.answers.map(({ first, last, hint }) => ({ first, last, hint })) };
  } catch { return null; }
}

export function writeSoundcheck(round) {
  return JSON.stringify({ version: 1, step: round.step, answers: round.answers.map((a, i) => ({ id: soundcheckSteps[i].id, ...a })) });
}

export function updateSoundcheck(round, event) {
  const i = round.step;
  const s = soundcheckSteps[i];
  if (!s) return round;
  const a = round.answers[i];
  if (event.type === 'next') return correct(s, a.last) ? { ...round, step: i + 1 } : round;
  if (correct(s, a.last)) return round;
  let next;
  if (event.type === 'hint') next = { ...a, hint: !a.hint };
  else if (event.type === 'answer' && Number.isInteger(event.index) && s.scenario.options[event.index]) next = { ...a, first: a.first ?? event.index, last: event.index };
  else return round;
  return { ...round, answers: round.answers.map((answer, j) => j === i ? next : answer) };
}

export function soundcheckResult(round) {
  const firstTry = soundcheckSteps.map((step, i) => correct(step, round.answers[i].first));
  const missed = firstTry.indexOf(false);
  return { firstTry, total: firstTry.filter(Boolean).length, recommended: missed < 0 ? soundcheckSteps.length - 1 : missed };
}
