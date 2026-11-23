import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { signalDepthCases } from '../../../data/signalDepthCases.js';

export function StageChallenge({ nodeId }) {
  const [answer, setAnswer] = useState(null);
  const exercise = signalDepthCases[nodeId];
  if (!exercise) return null;
  const answered = answer !== null;

  return <details className="sd-desk sd-challenge">
    <summary><CircleHelp size={16} aria-hidden="true" /> Test deg selv · lydsjekk</summary>
    <fieldset>
      <legend>{exercise.question}</legend>
      {exercise.options.map(([label], index) =>
        <button type="button" key={label} aria-pressed={answer === index} onClick={() => setAnswer(index)}>
          <span aria-hidden="true">{'AB'[index]}</span>{label}
        </button>
      )}
    </fieldset>
    <p className="sd-answer" role="status">
      {answered && <><strong>{answer === exercise.correct ? 'Godt vurdert.' : 'Se hva det påvirker.'}</strong> {exercise.options[answer][1]}</>}
    </p>
  </details>;
}
