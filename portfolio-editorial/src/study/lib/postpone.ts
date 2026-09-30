// 하루 미루기 규칙. 미루면 그날부터 남은 일정이 하루씩 뒤로 밀린다 (data/index.ts 의 buildSchedule).
import { getStudyDay } from '../data';
import type { StudyRecords } from '../types';
import { hasActivity } from './progress';

export type PostponeBlock = 'not-study-day' | 'has-record';

/** 지금 미뤄 둔 날짜 목록 */
export function getPostponedDates(records: StudyRecords): string[] {
  return Object.entries(records.postponed)
    .filter(([, postponed]) => postponed)
    .map(([date]) => date);
}

export function isPostponed(date: string, records: StudyRecords): boolean {
  return !!records.postponed[date];
}

/**
 * 그날을 미룰 수 없는 이유. 미룰 수 있으면 undefined.
 * 기록이 있는 날을 미루면 체크·문제 답이 공부 없는 날에 남으므로 막는다.
 */
export function getPostponeBlock(date: string, records: StudyRecords): PostponeBlock | undefined {
  if (!getStudyDay(date)) return 'not-study-day';
  const answeredQuiz = Object.keys(records.quiz).some((key) => key.startsWith(`${date}|`));
  if (hasActivity(records.days[date]) || records.days[date]?.completed || answeredQuiz) return 'has-record';
  return undefined;
}
