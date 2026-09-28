// 오늘 공부(= 오늘 날짜의 하루 페이지)와 특정 날짜 페이지를 함께 담당한다.
import { STUDY_DAYS, getStudyDay } from '../data';
import { getTool } from '../data/tools';
import { buildReviewItems, splitReviewQueues } from '../lib/reviewQueue';
import { STATUS_LABEL, getDayStatus } from '../lib/progress';
import { formatLong, formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import { BlockChecklist } from '../components/BlockChecklist';
import { DayNotice } from '../components/DayNotice';
import { DayRecordForm } from '../components/DayRecordForm';
import { PageHeader } from '../components/PageHeader';
import { LessonLink } from '../lessons/components/LessonLink';

export function DayPage({ date }: { date?: string }) {
  const { records, today } = useStudy();
  const target = date ?? today;
  const isToday = target === today;
  const day = getStudyDay(target);
  const kicker = isToday ? `오늘 공부 · ${formatShort(target)}` : `하루 공부 · ${formatShort(target)}`;

  if (!day) {
    return (
      <>
        <PageHeader kicker={kicker} title={formatLong(target)} />
        <DayNotice date={target} />
      </>
    );
  }

  const tool = getTool(day.tool);
  const index = STUDY_DAYS.indexOf(day);
  const prev = STUDY_DAYS[index - 1];
  const next = STUDY_DAYS[index + 1];
  const reviewCount = isToday ? splitReviewQueues(buildReviewItems(records), today).today.length : 0;

  return (
    <>
      <PageHeader
        kicker={kicker}
        meta={`Day ${index + 1} / ${STUDY_DAYS.length} · ${STATUS_LABEL[getDayStatus(target, records, today)]}`}
        title={day.title}
        lead={
          <>
            <a href={href({ name: 'tool', tool: day.tool })} className="st-tool-tag" style={{ background: tool.color }}>
              {tool.name} {day.dayIndex}일차
            </a>
            예상 {day.estimatedHours}시간
            <LessonLink day={day} />
          </>
        }
      />

      {reviewCount > 0 && (
        <a className="st-banner" href={href({ name: 'review' })}>
          오늘 풀 복습 질문이 {reviewCount}개 있어요. 저녁 복습 때 풀어 보세요 →
        </a>
      )}

      <div className="st-day-grid">
        <div className="st-day-main">
          <section className="block">
            <div className="block-label">
              <span>학습 목표</span>
            </div>
            <ul className="bullets">
              {day.goals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </section>
          <BlockChecklist day={day} />
        </div>

        <aside className="st-day-side">
          <section className="block">
            <div className="block-label">
              <span>오늘 산출물</span>
            </div>
            <p className="st-deliverable">{day.deliverable}</p>
          </section>
          <DayRecordForm date={target} />
          <section className="block">
            <div className="block-label">
              <span>복습 질문 미리 보기</span>
            </div>
            <ol className="st-steps">
              {day.reviewQuestions.map((question, i) => (
                <li key={i}>{question}</li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <nav className="prev-next st-day-pager" aria-label="다른 날짜">
        {prev ? <a href={href({ name: 'day', date: prev.date })}>← {formatShort(prev.date)}</a> : <span />}
        {!isToday && <a href={href({ name: 'today' })}>오늘로 가기</a>}
        {next ? <a href={href({ name: 'day', date: next.date })}>{formatShort(next.date)} →</a> : <span />}
      </nav>
    </>
  );
}
