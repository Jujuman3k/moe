import { useId, useState } from 'react';
import { CircleHelp, Minus, Plus } from 'lucide-react';
import { signalDepthCases } from '../../../data/signalDepthCases.js';

export function StageChallenge({ nodeId }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(null);
  const contentId = useId();
  const exercise = signalDepthCases[nodeId];
  if (!exercise) return null;

  return <div className="sd-desk sd-challenge">
    <button type="button" className="sd-challenge-toggle" aria-expanded={open}
      aria-controls={contentId} onClick={() => setOpen(previous => !previous)}>
      <CircleHelp size={16} aria-hidden="true" /> Test deg selv · lydsjekk
      {open ? <Minus size={16} aria-hidden="true"/> : <Plus size={16} aria-hidden="true"/>}
    </button>
    <div id={contentId}>
      {open && <>
        <fieldset>
          <legend>{exercise.question}</legend>
          {exercise.options.map(([label], index) =>
            <button type="button" key={label} aria-pressed={answer === index} onClick={() => setAnswer(index)}>
              <span aria-hidden="true">{'AB'[index]}</span>{label}
            </button>
          )}
        </fieldset>
        <p className="sd-answer" role="status">
          {answer !== null && <><strong>{answer === exercise.correct ? 'Godt vurdert.' : 'Se hva det påvirker.'}</strong> {exercise.options[answer][1]}</>}
        </p>
      </>}
    </div>
  </div>;
}
