// "공부 자료" 버튼. 레슨 파일이 있는 날에만 보이고, 레슨을 끝냈으면 완료 표시가 붙는다.
import { href } from '../../routes';
import { useStudy } from '../../StudyContext';
import type { StudyDay } from '../../types';
import { hasLesson } from '../loadLesson';

export function LessonLink({ day, className = 'st-btn' }: { day: StudyDay; className?: string }) {
  const { records } = useStudy();
  if (!hasLesson(day.tool, day.dayIndex)) return null;
  const done = !!records.days[day.date]?.lessonDone;

  return (
    <a className={`${className} ls-link`} href={href({ name: 'lesson', tool: day.tool, day: day.dayIndex })}>
      공부 자료{done ? ' · 완료' : ''} →
    </a>
  );
}
