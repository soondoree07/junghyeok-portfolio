// 오늘 공부를 끝냈고 앞에 미룬 날이 있으면, 다음 공부를 오늘로 당겨오는 카드.
import { getNextStudyDay } from '../data';
import { getTool } from '../data/tools';
import { canPullForward, findGapToFill } from '../lib/pullForward';
import { formatShort } from '../lib/seoulDate';
import { href } from '../routes';
import { useStudy } from '../StudyContext';

export function PullForwardCard() {
  const { records, today, canEdit, pullNextDay, notify } = useStudy();
  if (!canEdit || !canPullForward(records, today)) return null;

  const gap = findGapToFill(records, today) as string;
  const nextDay = getNextStudyDay(today);

  const pull = async () => {
    const ok = await pullNextDay();
    if (!ok) {
      notify('당겨오지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.');
      return;
    }
    notify('다음 공부를 오늘로 당겨왔어요.');
    window.location.hash = href({ name: 'today' });
    window.scrollTo({ top: 0 });
  };

  return (
    <section className="block">
      <div className="block-label">
        <span>여유가 있다면</span>
      </div>
      <p className="st-hint">
        {nextDay ? `${getTool(nextDay.tool).name} ${nextDay.dayIndex}일차도 오늘 할 수 있어요. ` : ''}오늘 한 공부 기록은 미뤄 둔 {formatShort(gap)} 칸으로 옮기고,
        남은 일정이 하루씩 앞으로 와요.
      </p>
      <button type="button" className="st-btn wide" onClick={() => void pull()}>
        다음 공부 당겨오기
      </button>
    </section>
  );
}
