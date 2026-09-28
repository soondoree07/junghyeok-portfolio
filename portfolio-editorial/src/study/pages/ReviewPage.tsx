import { useMemo } from 'react';
import { REVIEW_OFFSETS } from '../data/schedule';
import { buildReviewItems, groupBySource, splitReviewQueues } from '../lib/reviewQueue';
import { formatShort } from '../lib/seoulDate';
import { useStudy } from '../StudyContext';
import { PageHeader } from '../components/PageHeader';
import { ReviewGroup } from '../components/ReviewGroup';
import { WrongQuizList } from '../lessons/components/WrongQuizList';

export function ReviewPage() {
  const { records, today, canEdit } = useStudy();
  const queues = useMemo(() => splitReviewQueues(buildReviewItems(records), today), [records, today]);
  const answeredToday = queues.today.filter((item) => item.answer).length;
  const unknownToday = queues.today.filter((item) => item.answer?.result === 'unknown').length;

  return (
    <>
      <PageHeader
        kicker={`복습 · ${formatShort(today)}`}
        meta={`${REVIEW_OFFSETS.join(' · ')}일 간격`}
        title="오늘의 복습"
        lead="1일 전, 3일 전, 7일 전에 배운 내용을 다시 물어요. 몰랐음을 고른 질문은 다음 날 한 번 더 나와요."
      />

      <div className="st-stat-row">
        <div className="st-stat">
          <span className="st-stat-num">{queues.today.length}</span>
          <span className="st-stat-lbl">오늘 복습</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">{answeredToday}</span>
          <span className="st-stat-lbl">답한 질문</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num accent">{unknownToday}</span>
          <span className="st-stat-lbl">내일 다시</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">{queues.overdue.length}</span>
          <span className="st-stat-lbl">밀린 복습</span>
        </div>
      </div>

      {!canEdit && <p className="st-hint">답은 로그인한 뒤에 고를 수 있어요. 질문은 누구나 볼 수 있어요.</p>}

      <h2 className="st-section-title">오늘 풀 질문</h2>
      {queues.today.length === 0 ? (
        <p className="st-empty">오늘은 복습할 질문이 없어요. 공부한 날부터 하루 뒤에 첫 복습이 나와요.</p>
      ) : (
        groupBySource(queues.today).map((group) => (
          <ReviewGroup key={group.day.date} day={group.day} items={group.items} />
        ))
      )}

      <h2 className="st-section-title">틀린 레슨 문제</h2>
      <WrongQuizList />

      <h2 className="st-section-title">밀린 복습</h2>
      {queues.overdue.length === 0 ? (
        <p className="st-empty">밀린 복습이 없어요. 이대로만 이어가면 돼요.</p>
      ) : (
        groupBySource(queues.overdue).map((group) => (
          <ReviewGroup key={group.day.date} day={group.day} items={group.items} />
        ))
      )}
    </>
  );
}
