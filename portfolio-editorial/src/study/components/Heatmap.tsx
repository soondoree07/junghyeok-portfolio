// 학습 기간 달력. 월요일 시작 7열, 칸 색은 그날 상태(완료/부분/미완료/미룸/휴식/예정).
import { getStudyDay, getStudyPeriod } from '../data';
import { STATUS_LABEL, getDayStatus, type DayStatus } from '../lib/progress';
import { addDays, eachDate, formatShort, weekdayOf } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';

const WEEKDAY_HEADERS = ['월', '화', '수', '목', '금', '토', '일'];
const LEGEND: DayStatus[] = ['done', 'partial', 'missed', 'postponed', 'rest', 'upcoming'];

/** 월요일부터 세는 요일 번호 (월=0) */
function mondayIndex(date: string): number {
  return WEEKDAY_HEADERS.indexOf(weekdayOf(date));
}

export function Heatmap() {
  const { records, today } = useStudy();
  const studyPeriod = getStudyPeriod();
  const firstMonday = addDays(studyPeriod.start, -mondayIndex(studyPeriod.start));
  const dates = eachDate(firstMonday, studyPeriod.end);

  return (
    <div className="st-heatmap">
      <div className="st-heat-grid" aria-label="학습 달력">
        {WEEKDAY_HEADERS.map((weekday) => (
          <span key={weekday} className="st-heat-head">
            {weekday}
          </span>
        ))}
        {dates.map((date) => {
          if (date < studyPeriod.start) return <span key={date} className="st-heat-cell blank" />;
          const status = getDayStatus(date, records, today);
          const day = getStudyDay(date);
          const label = `${formatShort(date)} ${STATUS_LABEL[status]}${day ? ` · ${day.title}` : ''}`;
          const className = `st-heat-cell ${status} ${date === today ? 'today' : ''}`;
          const dayNumber = Number(date.slice(8, 10));
          return day ? (
            <a key={date} className={className} href={href({ name: 'day', date })} title={label} aria-label={label}>
              {dayNumber === 1 ? `${Number(date.slice(5, 7))}/1` : dayNumber}
            </a>
          ) : (
            <span key={date} className={className} title={label} aria-label={label}>
              {dayNumber === 1 ? `${Number(date.slice(5, 7))}/1` : dayNumber}
            </span>
          );
        })}
      </div>
      <div className="st-legend">
        {LEGEND.map((status) => (
          <span key={status}>
            <span className={`st-heat-cell mini ${status}`} />
            {STATUS_LABEL[status]}
          </span>
        ))}
      </div>
    </div>
  );
}
