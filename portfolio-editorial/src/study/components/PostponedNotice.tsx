// 미룬 날의 안내. 오늘 미룬 것이면 되돌릴 수 있다.
import { getNextStudyDay } from '../data';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';

export function PostponedNotice({ date }: { date: string }) {
  const { today, canEdit, setTodayPostponed, notify } = useStudy();
  const next = getNextStudyDay(date);
  const canCancel = canEdit && date === today;

  const cancel = () => {
    setTodayPostponed(false);
    notify('미루기를 취소했어요. 오늘 공부를 이어서 하면 돼요.');
  };

  return (
    <div className="st-notice">
      <p className="st-notice-big">{date === today ? '오늘 공부를 미뤘어요' : '공부를 미룬 날이에요'}</p>
      {next && (
        <p>
          {formatShort(next.date)}에 이어서 해요. 남은 일정도 하루씩 뒤로 밀렸어요.
        </p>
      )}
      <div className="st-notice-actions">
        {next && (
          <a className="st-btn" href={href({ name: 'day', date: next.date })}>
            {formatShort(next.date)} 미리 보기
          </a>
        )}
        {canCancel && (
          <button type="button" className="st-btn ghost" onClick={cancel}>
            미루기 취소
          </button>
        )}
      </div>
    </div>
  );
}
