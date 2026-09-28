import { STUDY_DAYS } from '../data';
import { getTool } from '../data/tools';
import { formatMinutes, getOverallProgress, getToolStats, getTotalMinutes } from '../lib/progress';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import { Heatmap } from '../components/Heatmap';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';

export function LogPage() {
  const { records, authed, mode } = useStudy();
  const totalMinutes = getTotalMinutes(records);
  const overall = getOverallProgress(records);
  const toolStats = getToolStats(records);
  const notes = STUDY_DAYS.filter((day) => {
    const record = records.days[day.date];
    return record && (record.memo.trim() !== '' || record.links.length > 0);
  }).reverse();
  const canSeeNotes = authed || mode === 'local';

  return (
    <>
      <PageHeader kicker="기록" meta="Asia/Seoul" title="공부 기록" lead="날마다 얼마나 했는지, 어느 툴에 시간을 썼는지 모아 봐요." />

      <div className="st-stat-row">
        <div className="st-stat">
          <span className="st-stat-num">{formatMinutes(totalMinutes)}</span>
          <span className="st-stat-lbl">누적 공부 시간</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">
            {overall.done}/{overall.total}
          </span>
          <span className="st-stat-lbl">완료한 날</span>
        </div>
      </div>

      <Heatmap />

      <h2 className="st-section-title">툴별 통계</h2>
      <div className="st-table-wrap">
        <table className="st-table">
          <thead>
            <tr>
              <th>툴</th>
              <th>실제 시간</th>
              <th>계획 시간</th>
              <th>진행률</th>
            </tr>
          </thead>
          <tbody>
            {toolStats.map((stat) => (
              <tr key={stat.tool}>
                <td>
                  <a href={href({ name: 'tool', tool: stat.tool })}>
                    <span className="st-dot" style={{ background: stat.color }} />
                    {stat.name}
                  </a>
                </td>
                <td>{formatMinutes(stat.minutes)}</td>
                <td>{stat.plannedHours}시간</td>
                <td className="st-table-bar">
                  <ProgressBar progress={stat.progress} color={stat.color} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="st-section-title">이전 메모</h2>
      {!canSeeNotes ? (
        <p className="st-empty">메모와 산출물 링크는 주인만 볼 수 있어요.</p>
      ) : notes.length === 0 ? (
        <p className="st-empty">아직 남긴 메모가 없어요. 오늘 공부 페이지에서 저녁 기록을 남기면 여기에 모여요.</p>
      ) : (
        <div className="st-notes">
          {notes.map((day) => {
            const record = records.days[day.date];
            const tool = getTool(day.tool);
            return (
              <article key={day.date} className="st-note">
                <a className="st-note-head" href={href({ name: 'day', date: day.date })}>
                  <span className="st-dot" style={{ background: tool.color }} />
                  {formatShort(day.date)} · {tool.name} {day.dayIndex}일차 · {formatMinutes(record.minutes)}
                </a>
                <p className="st-note-title">{day.title}</p>
                {record.memo && <p className="st-note-memo">{record.memo}</p>}
                {record.links.map((link) => (
                  <a key={link} className="st-note-link" href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                ))}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
