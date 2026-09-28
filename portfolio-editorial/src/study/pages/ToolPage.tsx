// 툴별 상세: 날짜별 커리큘럼 전체를 펼쳐 볼 수 있다.
import { getToolDays } from '../data';
import { TOOLS, getTool } from '../data/tools';
import { STATUS_LABEL, getDayStatus, getToolProgress } from '../lib/progress';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import type { ToolId } from '../types';
import { DayContent } from '../components/DayContent';
import { PageHeader } from '../components/PageHeader';
import { LessonLink } from '../lessons/components/LessonLink';
import { ProgressBar } from '../components/ProgressBar';

export function ToolPage({ toolId }: { toolId: ToolId }) {
  const { records, today } = useStudy();
  const tool = getTool(toolId);
  const days = getToolDays(toolId);

  return (
    <>
      <PageHeader
        kicker={`툴 학습 · ${tool.short}`}
        meta={days.length > 0 ? `${formatShort(days[0].date)} — ${formatShort(days[days.length - 1].date)}` : ''}
        title={tool.name}
        lead={tool.summary}
      />

      <nav className="st-tool-tabs" aria-label="툴 선택">
        {TOOLS.map((item) => (
          <a key={item.id} href={href({ name: 'tool', tool: item.id })} className={item.id === toolId ? 'on' : ''}>
            {item.name}
          </a>
        ))}
      </nav>

      <ProgressBar progress={getToolProgress(toolId, records)} label={`${tool.name} 진행률`} color={tool.color} />

      <div className="st-accordion">
        {days.map((day) => {
          const status = getDayStatus(day.date, records, today);
          return (
            <details key={day.date} className="st-acc-item" open={day.date === today}>
              <summary>
                <span className="st-acc-date">{formatShort(day.date)}</span>
                <span className="st-acc-title">
                  <span className="st-acc-index">{day.dayIndex}일차</span>
                  {day.title}
                </span>
                <span className={`st-status ${status}`}>{STATUS_LABEL[status]}</span>
              </summary>
              <div className="st-acc-body">
                <DayContent day={day} />
                <div className="st-notice-actions">
                  <LessonLink day={day} />
                  <a className="st-btn ghost" href={href({ name: 'day', date: day.date })}>
                    이날 체크리스트 열기 →
                  </a>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
