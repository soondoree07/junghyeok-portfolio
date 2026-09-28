// 하루치 커리큘럼의 모든 필드를 보여준다. 툴 상세 페이지의 펼침 영역에서 쓴다.
import type { StudyDay } from '../types';

function Section({ label, items, ordered = false }: { label: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className="block">
      <div className="block-label">
        <span>{label}</span>
      </div>
      <List className={ordered ? 'st-steps' : 'bullets'}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </List>
    </section>
  );
}

export function DayContent({ day }: { day: StudyDay }) {
  return (
    <div className="st-daycontent">
      <Section label="학습 목표" items={day.goals} />
      <Section label="핵심 개념" items={day.concepts} />
      <Section label="실습 과제" items={day.practice} ordered />
      <section className="block">
        <div className="block-label">
          <span>오늘 산출물</span>
        </div>
        <p className="st-deliverable">{day.deliverable}</p>
      </section>
      <Section label="복습 질문" items={day.reviewQuestions} ordered />
      <section className="block">
        <div className="block-label">
          <span>키워드</span>
          <span className="st-muted-label">예상 {day.estimatedHours}시간</span>
        </div>
        <div className="tag-row">
          {day.keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
