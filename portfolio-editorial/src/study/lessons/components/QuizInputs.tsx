// 문제 유형별 답 입력칸과 해설.
import { useState, type FormEvent } from 'react';
import type { QuizAnswer } from '../../types';
import { isChecklistComplete, isNumericCorrect, parseNumberInput } from '../grading';
import type { ChecklistQuestion, ChoiceQuestion, NumericQuestion } from '../types';

type Submit = (answer: Omit<QuizAnswer, 'answeredOn'>) => void;
type Answer = Omit<QuizAnswer, 'answeredOn'> | undefined;

function Explanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="ls-explain">
      <strong>해설</strong> {text}
    </p>
  );
}

export function ChoiceAnswer({ question, answer, onSubmit }: { question: ChoiceQuestion; answer: Answer; onSubmit: Submit }) {
  return (
    <>
      <ol className="ls-options">
        {question.options.map((option, index) => {
          const picked = answer?.value === index;
          const state = !answer ? '' : index === question.answer ? 'is-answer' : picked ? 'is-wrong' : '';
          return (
            <li key={index}>
              <button
                type="button"
                className={`ls-option ${state}`}
                disabled={!!answer}
                aria-pressed={picked}
                onClick={() => onSubmit({ correct: index === question.answer, value: index })}
              >
                <span className="ls-option-num">{index + 1}</span>
                {option}
              </button>
            </li>
          );
        })}
      </ol>
      {answer && <Explanation text={question.explanation} />}
    </>
  );
}

export function NumericAnswer({ question, answer, onSubmit }: { question: NumericQuestion; answer: Answer; onSubmit: Submit }) {
  const [input, setInput] = useState('');
  const [invalid, setInvalid] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = parseNumberInput(input);
    setInvalid(value === null);
    if (value !== null) onSubmit({ correct: isNumericCorrect(question, value), value });
  };

  if (answer) {
    return (
      <>
        <p className="ls-numeric-result">
          입력한 값 <strong>{answer.value?.toLocaleString('ko-KR')}</strong>
          {!answer.correct && (
            <>
              {' '}
              · 정답 <strong>{question.answer.toLocaleString('ko-KR')}</strong>
            </>
          )}
          {question.unit && ` ${question.unit}`}
        </p>
        <Explanation text={question.explanation} />
      </>
    );
  }

  return (
    <form className="ls-numeric" onSubmit={submit}>
      {question.hint && <p className="ls-hint">힌트: {question.hint}</p>}
      <div className="st-link-input">
        <input
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={question.unit ? `숫자만 입력 (${question.unit})` : '숫자만 입력'}
          aria-label="답"
        />
        <button type="submit" className="st-btn" disabled={!input.trim()}>
          채점하기
        </button>
      </div>
      {invalid && <p className="st-error">숫자로 읽을 수 없어요. 쉼표는 있어도 되지만 글자는 빼고 입력해 주세요.</p>}
    </form>
  );
}

export function ChecklistAnswer({ question, answer, onSubmit }: { question: ChecklistQuestion; answer: Answer; onSubmit: Submit }) {
  const [checked, setChecked] = useState<number[]>(answer?.checked ?? []);
  const toggle = (index: number) =>
    setChecked((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]));
  const shown = answer?.checked ?? checked;

  return (
    <>
      <ul className="st-checklist">
        {question.items.map((item, index) => (
          <li key={index}>
            <label className={shown.includes(index) ? 'done' : ''}>
              <input type="checkbox" checked={shown.includes(index)} disabled={!!answer} onChange={() => toggle(index)} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      {answer ? (
        <Explanation text={question.explanation} />
      ) : (
        <button
          type="button"
          className="st-btn ghost"
          onClick={() => onSubmit({ correct: isChecklistComplete(question, checked), checked })}
        >
          채점하기 ({checked.length}/{question.items.length})
        </button>
      )}
    </>
  );
}
