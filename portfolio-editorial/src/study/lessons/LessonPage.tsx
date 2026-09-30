// 날짜별 레슨(공부 자료) 페이지.
// 순서: 목표·시간 → 준비물 → 본문(개념·따라 하기·체크포인트·실습 과제) → 마무리 문제 → 본문(실수·더 공부할 자료) → 완료
import { getStudyDays } from '../data';
import { getTool } from '../data/tools';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import type { StudyDay, ToolId } from '../types';
import { PageHeader } from '../components/PageHeader';
import { LessonMarkdown } from './components/LessonMarkdown';
import { LessonPrep } from './components/LessonPrep';
import { QuizCard } from './components/QuizCard';
import { hasLesson } from './loadLesson';
import { useLesson } from './useLesson';
import './lesson.css';

function LessonNav({ tool, dayIndex, date }: { tool: ToolId; dayIndex: number; date: string }) {
  const withLesson = getStudyDays().filter((day) => hasLesson(day.tool, day.dayIndex));
  const index = withLesson.findIndex((day) => day.tool === tool && day.dayIndex === dayIndex);
  const prev = withLesson[index - 1];
  const next = withLesson[index + 1];
  const label = (day: StudyDay) => `${getTool(day.tool).name} ${day.dayIndex}일차`;

  return (
    <nav className="ls-nav" aria-label="레슨 이동">
      {prev ? <a href={href({ name: 'lesson', tool: prev.tool, day: prev.dayIndex })}>← {label(prev)}</a> : <span />}
      <a href={href({ name: 'day', date })}>이날 체크리스트로 돌아가기</a>
      {next ? <a href={href({ name: 'lesson', tool: next.tool, day: next.dayIndex })}>{label(next)} →</a> : <span />}
    </nav>
  );
}

export function LessonPage({ tool, dayIndex }: { tool: ToolId; dayIndex: number }) {
  const { records, canEdit, updateDay, notify } = useStudy();
  const state = useLesson(tool, dayIndex);
  const day = getStudyDays().find((item) => item.tool === tool && item.dayIndex === dayIndex);
  const toolInfo = getTool(tool);

  if (!day) return <p className="st-empty">해당 날짜의 커리큘럼이 없어요. 학습 계획에서 날짜를 다시 골라 주세요.</p>;

  const done = !!records.days[day.date]?.lessonDone;
  const toggleDone = () => {
    updateDay(day.date, (record) => ({ ...record, lessonDone: !done }));
    notify(done ? '공부 자료 완료를 취소했어요.' : '공부 자료를 끝냈어요. 체크리스트에서 남은 항목을 확인해 보세요.');
  };

  return (
    <>
      <LessonNav tool={tool} dayIndex={dayIndex} date={day.date} />
      <PageHeader
        kicker={`${toolInfo.name} ${dayIndex}일차 공부 자료 · ${formatShort(day.date)}`}
        meta={state.status === 'ready' ? state.lesson.meta.status : ''}
        title={day.title}
      />
      {state.status === 'ready' && state.lesson.meta.status === '미검수' && (
        <p className="ls-unreviewed" role="note">
          <strong>미검수</strong> 아직 검수하지 않은 자료예요. 메뉴 이름이나 설명이 실제 화면과 다르면 메모에 적어 두세요.
        </p>
      )}

      <section className="block">
        <div className="block-label">
          <span>오늘의 목표</span>
          <span className="st-muted-label">예상 {day.estimatedHours}시간</span>
        </div>
        <ul className="bullets">
          {day.goals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </section>

      {state.status === 'loading' && <p className="st-empty">공부 자료를 불러오는 중..</p>}
      {state.status === 'error' && (
        <p className="st-empty">
          공부 자료를 열지 못했어요. 잠시 후 새로고침해 주세요.
          {import.meta.env.DEV && <code className="ls-dev-error">{state.message}</code>}
        </p>
      )}

      {state.status === 'ready' && (
        <>
          <LessonPrep meta={state.lesson.meta} />
          <LessonMarkdown markdown={state.lesson.before} />
          {state.lesson.quiz.questions.length > 0 && (
            <section className="ls-quiz-section">
              <h2>마무리 문제</h2>
              {state.lesson.quiz.questions.map((question, index) => (
                <QuizCard key={question.id} question={question} date={day.date} number={index + 1} />
              ))}
            </section>
          )}
          <LessonMarkdown markdown={state.lesson.after} />
          <div className="ls-done">
            <button type="button" className={`st-btn wide ${done ? 'done' : ''}`} disabled={!canEdit} onClick={toggleDone}>
              {done ? '공부 자료 완료 · 취소하기' : '공부 자료 다 봤어요'}
            </button>
            {!canEdit && <p className="st-hint">완료 표시는 로그인한 뒤에 할 수 있어요.</p>}
          </div>
          <LessonNav tool={tool} dayIndex={dayIndex} date={day.date} />
        </>
      )}
    </>
  );
}
