// 학습일이 아닌 날(시작 전, 휴식, 종료 후)의 안내.
import { getNextStudyDay } from '../data';
import { REST_PERIOD, STUDY_PERIOD } from '../data/schedule';
import { formatLong, formatShort, isWithin } from '../lib/seoulDate';
import { href } from '../routes';

export function DayNotice({ date }: { date: string }) {
  const next = getNextStudyDay(date);

  if (isWithin(date, REST_PERIOD)) {
    return (
      <div className="st-notice">
        <p className="st-notice-big">휴식 기간이에요</p>
        <p>
          {formatShort(REST_PERIOD.start)} ~ {formatShort(REST_PERIOD.end)}는 공부 없이 쉬어요. 이 기간에 걸린 복습은
          복귀하는 날에 모아서 나와요.
        </p>
        {next && (
          <a className="st-btn" href={href({ name: 'day', date: next.date })}>
            복귀일 {formatShort(next.date)} 미리 보기
          </a>
        )}
      </div>
    );
  }

  if (date < STUDY_PERIOD.start) {
    return (
      <div className="st-notice">
        <p className="st-notice-big">곧 시작해요</p>
        <p>툴 학습은 {formatLong(STUDY_PERIOD.start)}에 시작해요.</p>
        {next && (
          <a className="st-btn" href={href({ name: 'day', date: next.date })}>
            첫날 미리 보기
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="st-notice">
      <p className="st-notice-big">툴 학습 기간이 끝났어요</p>
      <p>다음 단계는 메이플스토리 PC 최근 1~2년 패치 정리와 방향 분석이에요.</p>
      <div className="st-notice-actions">
        <a className="st-btn" href={href({ name: 'roadmap' })}>
          로드맵 보기
        </a>
        <a className="st-btn ghost" href={href({ name: 'log' })}>
          기록 돌아보기
        </a>
      </div>
    </div>
  );
}
