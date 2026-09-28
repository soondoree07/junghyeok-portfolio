// 원본 학습일 하나에 딸린 복습 질문 묶음. 질문마다 알았음/헷갈림/몰랐음을 고른다.
import { getTool } from '../data/tools';
import type { ReviewItem } from '../lib/reviewQueue';
import { diffDays, formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import type { ReviewResult, StudyDay } from '../types';

const RESULTS: { id: ReviewResult; label: string }[] = [
  { id: 'known', label: '알았음' },
  { id: 'unsure', label: '헷갈림' },
  { id: 'unknown', label: '몰랐음' },
];

function itemBadge(item: ReviewItem, today: string): string {
  if (item.kind === 'retry') return '다시 풀기';
  if (item.dueDate < today) return `${formatShort(item.dueDate)} 복습`;
  return `${diffDays(item.sourceDate, item.dueDate)}일 전 학습`;
}

export function ReviewGroup({ day, items }: { day: StudyDay; items: ReviewItem[] }) {
  const { canEdit, answerReview, today } = useStudy();
  const tool = getTool(day.tool);

  return (
    <section className="st-review-group">
      <div className="block-label">
        <a href={href({ name: 'day', date: day.date })}>
          <span className="st-dot" style={{ background: tool.color }} />
          {formatShort(day.date)} · {day.title}
        </a>
        <span className="st-muted-label">
          {tool.name} {day.dayIndex}일차
        </span>
      </div>
      <ol className="st-review-list">
        {items.map((item) => (
          <li key={item.key} className="st-review-item">
            <div className="st-review-q">
              <span className="st-badge">{itemBadge(item, today)}</span>
              <p>{item.question}</p>
            </div>
            <div className="st-review-actions" role="group" aria-label="이해도">
              {RESULTS.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className={`st-choice ${result.id} ${item.answer?.result === result.id ? 'on' : ''}`}
                  aria-pressed={item.answer?.result === result.id}
                  disabled={!canEdit}
                  onClick={() => answerReview(item.coveredKeys, result.id)}
                >
                  {result.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
