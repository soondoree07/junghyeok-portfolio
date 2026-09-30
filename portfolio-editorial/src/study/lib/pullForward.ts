// 하루 당겨오기. 가장 최근에 미룬 날(빈 칸)을 없애 일정을 하루 앞으로 되돌리고,
// 각 공부의 기록(하루 기록·문제 답·복습 답)이 자기 공부를 따라 새 날짜로 옮겨 가게 한다.
// 예) 9/30 미룸, 10/1 에 2일차 완료 → 2일차 기록은 9/30 로, 10/1 은 3일차가 된다.
import { buildSchedule, getStudyDay, getStudyDays } from '../data';
import type { StudyRecords } from '../types';
import { getPostponedDates } from './postpone';
import { addDays, diffDays } from './seoulDate';

/** 채울 수 있는 빈 칸: 오늘 이전에 미룬 날 중 가장 최근 날 */
export function findGapToFill(records: StudyRecords, today: string): string | undefined {
  return getPostponedDates(records)
    .filter((date) => date < today)
    .sort()
    .at(-1);
}

/** 오늘 공부를 끝냈고 채울 빈 칸이 있을 때만 당겨올 수 있다 */
export function canPullForward(records: StudyRecords, today: string): boolean {
  return !!getStudyDay(today) && !!records.days[today]?.completed && !!findGapToFill(records, today);
}

/** 옛 날짜 → 새 날짜. 날짜가 바뀌는 공부만 담는다 */
function buildDateMoves(postponedAfter: string[]): Map<string, string> {
  const before = getStudyDays();
  const after = buildSchedule(new Set(postponedAfter));
  const moves = new Map<string, string>();
  before.forEach((day, index) => {
    if (after[index].date !== day.date) moves.set(day.date, after[index].date);
  });
  return moves;
}

/** 키 앞부분의 날짜만 바꿔 옮긴다. 옮겨 온 값이 그 자리에 있던 값보다 우선한다 */
function moveEntries<T>(entries: Record<string, T>, remapKey: (key: string) => string | undefined) {
  const kept: Record<string, T> = {};
  const moved: Record<string, T> = {};
  for (const [key, value] of Object.entries(entries)) {
    const nextKey = remapKey(key);
    if (nextKey === undefined) kept[key] = value;
    else moved[nextKey] = value;
  }
  return { ...kept, ...moved };
}

/** 당겨온 뒤의 전체 기록. 당겨올 수 없으면 undefined */
export function pullForward(records: StudyRecords, today: string): StudyRecords | undefined {
  const gap = findGapToFill(records, today);
  if (!gap || !canPullForward(records, today)) return undefined;

  const postponed = { ...records.postponed };
  delete postponed[gap];
  const moves = buildDateMoves(getPostponedDates({ ...records, postponed }));

  const remapQuiz = (key: string) => {
    const [date, questionId] = key.split('|');
    const next = moves.get(date);
    return next && `${next}|${questionId}`;
  };
  // 복습 키는 `${dueDate}|${sourceDate}|${index}`. 원본 날짜가 옮겨 간 만큼 복습 날짜도 옮긴다
  const remapReview = (key: string) => {
    const [dueDate, sourceDate, index] = key.split('|');
    const next = moves.get(sourceDate);
    return next && `${addDays(dueDate, diffDays(sourceDate, next))}|${next}|${index}`;
  };

  return {
    days: moveEntries(records.days, (date) => moves.get(date)),
    quiz: moveEntries(records.quiz, remapQuiz),
    reviews: moveEntries(records.reviews, remapReview),
    postponed,
  };
}
