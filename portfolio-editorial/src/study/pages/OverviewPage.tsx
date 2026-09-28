import { STUDY_DAYS, getToolDays } from '../data';
import { REST_PERIOD, STUDY_PERIOD } from '../data/schedule';
import { TOOLS } from '../data/tools';
import { getElapsedStudyDays, getOverallProgress, getToolProgress } from '../lib/progress';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';

export function OverviewPage() {
  const { records, today } = useStudy();
  const overall = getOverallProgress(records);
  const elapsed = getElapsedStudyDays(today);
  const plannedHours = STUDY_DAYS.reduce((sum, day) => sum + day.estimatedHours, 0);

  return (
    <>
      <PageHeader
        kicker="게임 기획자 준비 · 툴 학습"
        meta={`${formatShort(STUDY_PERIOD.start)} — ${formatShort(STUDY_PERIOD.end)}`}
        title="툴 학습 계획"
        lead={`기획 문서와 UI를 직접 만들 수 있도록 여섯 가지 툴을 ${STUDY_DAYS.length}일 동안 익혀요. 실습은 메이플스토리 소재로 해요.`}
      />

      <div className="st-stat-row">
        <div className="st-stat">
          <span className="st-stat-num">{STUDY_DAYS.length}일</span>
          <span className="st-stat-lbl">학습일</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">{plannedHours}h</span>
          <span className="st-stat-lbl">예상 시간</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">
            {elapsed}/{STUDY_DAYS.length}
          </span>
          <span className="st-stat-lbl">지난 학습일</span>
        </div>
        <div className="st-stat">
          <span className="st-stat-num">10일</span>
          <span className="st-stat-lbl">
            휴식 {formatShort(REST_PERIOD.start).slice(0, 5)}~{formatShort(REST_PERIOD.end).slice(0, 5)}
          </span>
        </div>
      </div>

      <ProgressBar progress={overall} label="전체 진행률" size="lg" />

      <p className="st-hint">하루 구성 — 오전 개념 학습 2~3시간 · 오후 실습 3~4시간 · 저녁 복습·기록 1시간</p>

      <div className="st-tool-grid">
        {TOOLS.map((tool) => {
          const days = getToolDays(tool.id);
          const first = days[0];
          const last = days[days.length - 1];
          return (
            <a key={tool.id} className="st-tool-card" href={href({ name: 'tool', tool: tool.id })}>
              <div className="card-meta-top">
                <span style={{ color: tool.color }}>{tool.short}</span>
                <span>{days.length}일</span>
              </div>
              <h3 className="card-title">{tool.name}</h3>
              <p className="card-tagline">{tool.summary}</p>
              <p className="st-tool-range">
                {first && last ? `${formatShort(first.date)} — ${formatShort(last.date)}` : '일정 준비 중'}
              </p>
              <ProgressBar progress={getToolProgress(tool.id, records)} color={tool.color} />
            </a>
          );
        })}
      </div>
    </>
  );
}
