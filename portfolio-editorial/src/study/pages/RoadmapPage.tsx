import { AI_DISCLOSURE_RULES, CAREER_GOAL, ROADMAP } from '../data/roadmap';
import { formatShort, isWithin } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';
import { PageHeader } from '../components/PageHeader';

type PhaseState = 'past' | 'now' | 'next';

function phaseState(start: string, end: string, today: string): PhaseState {
  if (isWithin(today, { start, end })) return 'now';
  return today > end ? 'past' : 'next';
}

const STATE_LABEL: Record<PhaseState, string> = { past: '지남', now: '지금 여기', next: '예정' };

export function RoadmapPage() {
  const { today } = useStudy();

  return (
    <>
      <PageHeader
        kicker="게임 기획자 준비 · 로드맵"
        meta={`오늘 ${formatShort(today)}`}
        title="메이플스토리 기획자까지"
        lead={`목표는 ${CAREER_GOAL.target}예요. ${CAREER_GOAL.graduation}이에요.`}
      />

      <div className="st-stat-row">
        {CAREER_GOAL.applications.map((application) => (
          <div key={application.what} className="st-stat">
            <span className="st-stat-num">{application.when}</span>
            <span className="st-stat-lbl">{application.what}</span>
          </div>
        ))}
      </div>

      <ol className="st-timeline">
        {ROADMAP.map((phase) => {
          const state = phaseState(phase.start, phase.end, today);
          return (
            <li key={phase.id} className={`st-phase ${state}`} aria-current={state === 'now' ? 'step' : undefined}>
              <div className="st-phase-mark" />
              <div className="st-phase-when">
                <span>{phase.label}</span>
                <span className={`st-status ${state === 'now' ? 'partial' : state === 'past' ? 'done' : 'upcoming'}`}>
                  {STATE_LABEL[state]}
                </span>
              </div>
              <div className="st-phase-body">
                <h3>{phase.title}</h3>
                <ul className="bullets">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {phase.id === 'tools' && (
                  <a className="st-btn ghost" href={href({ name: 'overview' })}>
                    툴 학습 계획 보기 →
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <section className="block st-ai-rule">
        <div className="block-label">
          <span>포트폴리오 AI 활용 표기 원칙</span>
        </div>
        <ul className="bullets">
          {AI_DISCLOSURE_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
