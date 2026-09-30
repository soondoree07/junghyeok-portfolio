// 오늘 공부를 하루 미루는 카드. 오늘 화면에서, 편집할 수 있을 때만 보인다.
import { getNextStudyDay } from '../data';
import { getPostponeBlock } from '../lib/postpone';
import { formatShort } from '../lib/seoulDate';
import { useStudy } from '../StudyContext';

export function PostponeCard() {
  const { records, today, canEdit, setTodayPostponed, notify } = useStudy();
  // 다 끝낸 날은 미룰 필요가 없다
  if (!canEdit || records.days[today]?.completed) return null;

  const blocked = getPostponeBlock(today, records) === 'has-record';

  const postpone = () => {
    setTodayPostponed(true);
    const moved = getNextStudyDay(today);
    notify(moved ? `오늘 공부를 ${formatShort(moved.date)}로 미뤘어요.` : '오늘 공부를 미뤘어요.');
  };

  return (
    <section className="block">
      <div className="block-label">
        <span>오늘 못 하게 됐다면</span>
      </div>
      <p className="st-hint">
        {blocked
          ? '오늘 공부한 기록이 있어서 미룰 수 없어요. 체크·공부 시간·메모를 비우면 미룰 수 있어요.'
          : '오늘 공부부터 남은 일정이 하루씩 뒤로 밀려요. 오늘 안에는 되돌릴 수 있어요.'}
      </p>
      <button type="button" className="st-btn ghost wide" onClick={postpone} disabled={blocked}>
        내일로 미루기
      </button>
    </section>
  );
}
