// 복습 페이지의 "틀린 레슨 문제". 마지막 답이 오답인 문제를 날짜별로 다시 낸다.
import { useMemo } from 'react';
import { getStudyDay } from '../../data';
import { getTool } from '../../data/tools';
import { formatShort } from '../../lib/seoulDate';
import { href } from '../../routes';
import { useStudy } from '../../StudyContext';
import { getWrongQuizEntries } from '../grading';
import { useLessons } from '../useLesson';
import { QuizCard } from './QuizCard';

export function WrongQuizList() {
  const { records } = useStudy();
  const entries = useMemo(() => getWrongQuizEntries(records), [records]);
  const dates = [...new Set(entries.map((entry) => entry.date))];
  const days = dates.flatMap((date) => {
    const day = getStudyDay(date);
    return day ? [day] : [];
  });
  const lessons = useLessons(days.map((day) => ({ tool: day.tool, dayIndex: day.dayIndex })));

  if (entries.length === 0) {
    return <p className="st-empty">틀린 레슨 문제가 없어요. 공부 자료의 마무리 문제에서 틀리면 여기에 모여요.</p>;
  }

  return (
    <>
      {days.map((day) => {
        const lesson = lessons.find((item) => item.tool === day.tool && item.dayIndex === day.dayIndex);
        const wrongIds = entries.filter((entry) => entry.date === day.date).map((entry) => entry.questionId);
        const questions = lesson?.quiz.questions.filter((question) => wrongIds.includes(question.id)) ?? [];
        return (
          <section key={day.date} className="st-review-group">
            <div className="block-label">
              <a href={href({ name: 'lesson', tool: day.tool, day: day.dayIndex })}>
                <span className="st-dot" style={{ background: getTool(day.tool).color }} />
                {formatShort(day.date)} · {day.title}
              </a>
              <span className="st-muted-label">{wrongIds.length}문제</span>
            </div>
            {!lesson && <p className="st-hint">문제를 불러오는 중..</p>}
            {questions.map((question, index) => (
              <QuizCard key={question.id} question={question} date={day.date} number={index + 1} startFresh />
            ))}
          </section>
        );
      })}
    </>
  );
}
