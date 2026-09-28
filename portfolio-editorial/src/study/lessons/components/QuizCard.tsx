// 문제 하나. 객관식·계산형·체크리스트형을 같은 틀(질문 → 답 → 결과·해설 → 다시 풀기)로 보여준다.
// 로그인하지 않은 방문자도 풀어 볼 수 있지만 답은 저장하지 않는다.
import { useState } from 'react';
import { useStudy } from '../../StudyContext';
import type { QuizAnswer } from '../../types';
import { quizKey } from '../grading';
import type { QuizQuestion } from '../types';
import { ChecklistAnswer, ChoiceAnswer, NumericAnswer } from './QuizInputs';

interface Props {
  question: QuizQuestion;
  date: string;
  number: number;
  /** 복습에서 다시 낼 때: 지난 답을 숨기고 처음부터 풀게 한다 */
  startFresh?: boolean;
}

const TYPE_LABEL = { choice: '객관식', numeric: '계산해서 입력', checklist: '완성 기준 자가 채점' } as const;

export function QuizCard({ question, date, number, startFresh = false }: Props) {
  const { records, canEdit, answerQuiz, notify } = useStudy();
  const key = quizKey(date, question.id);
  const saved = records.quiz[key];
  // 방금 푼 답(local)이 우선이고, 없으면 저장된 답을 보여준다 (서버 기록은 늦게 도착할 수 있다)
  const [local, setLocal] = useState<Omit<QuizAnswer, 'answeredOn'>>();
  const [retrying, setRetrying] = useState(startFresh);
  const answer = retrying ? undefined : (local ?? saved);

  const submit = (next: Omit<QuizAnswer, 'answeredOn'>) => {
    setLocal(next);
    setRetrying(false);
    answerQuiz(key, next);
    if (startFresh && next.correct) notify('맞혔어요. 틀린 문제 목록에서 뺐어요.');
  };

  return (
    <article className={`ls-quiz ${answer ? (answer.correct ? 'correct' : 'wrong') : ''}`}>
      <header className="ls-quiz-head">
        <span className="ls-quiz-num">Q{number}</span>
        <span className="st-badge">{TYPE_LABEL[question.type]}</span>
        {answer && <span className={`ls-quiz-result ${answer.correct ? 'correct' : 'wrong'}`}>{answer.correct ? '정답' : '오답'}</span>}
      </header>
      <p className="ls-quiz-q">{question.question}</p>

      {question.type === 'choice' && <ChoiceAnswer question={question} answer={answer} onSubmit={submit} />}
      {question.type === 'numeric' && <NumericAnswer question={question} answer={answer} onSubmit={submit} />}
      {question.type === 'checklist' && <ChecklistAnswer question={question} answer={answer} onSubmit={submit} />}

      {answer && (
        <div className="ls-quiz-foot">
          {!answer.correct && <p className="ls-quiz-note">틀린 문제는 복습 페이지의 "틀린 레슨 문제"에 모여요. 맞힐 때까지 다시 나와요.</p>}
          {!canEdit && <p className="ls-quiz-note">로그인하지 않아 답은 저장되지 않아요.</p>}
          <button type="button" className="st-link" onClick={() => setRetrying(true)}>
            다시 풀기
          </button>
        </div>
      )}
    </article>
  );
}
