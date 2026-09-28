// 오전·오후·저녁 블록별 체크리스트.
import { DAY_BLOCKS } from '../data/schedule';
import { getChecklist } from '../lib/progress';
import { useStudy } from '../StudyContext';
import type { StudyDay } from '../types';

export function BlockChecklist({ day }: { day: StudyDay }) {
  const { records, canEdit, updateDay } = useStudy();
  const checks = records.days[day.date]?.checks ?? {};
  const checklist = getChecklist(day);

  const toggle = (checkId: string) =>
    updateDay(day.date, (record) => ({
      ...record,
      checks: { ...record.checks, [checkId]: !record.checks[checkId] },
    }));

  return (
    <div className="st-blocks">
      {DAY_BLOCKS.map((block) => {
        const items = checklist[block.id];
        const doneCount = items.filter((_, index) => checks[`${block.id}-${index}`]).length;
        return (
          <section key={block.id} className="block st-block">
            <div className="block-label">
              <span>
                {block.label} <span className="accent">{block.time}</span>
              </span>
              <span className="st-muted-label">
                {doneCount}/{items.length} · {block.hours}
              </span>
            </div>
            <ul className="st-checklist">
              {items.map((item, index) => {
                const checkId = `${block.id}-${index}`;
                return (
                  <li key={checkId}>
                    <label className={checks[checkId] ? 'done' : ''}>
                      <input
                        type="checkbox"
                        checked={!!checks[checkId]}
                        disabled={!canEdit}
                        onChange={() => toggle(checkId)}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
