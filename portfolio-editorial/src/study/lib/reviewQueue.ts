// 간격 반복 복습 목록 만들기.
// - 정기 복습: 학습일 +1, +3, +7일에 그날의 복습 질문을 다시 낸다
// - 다시 풀기: "몰랐음"으로 답한 질문은 답한 다음 날 다시 낸다
// - 휴식 기간에 걸린 복습은 복귀일로 미룬다
import { getStudyDays } from '../data';
import { REST_PERIOD, RESUME_DATE, REVIEW_OFFSETS, STUDY_PERIOD } from '../data/schedule';
import type { ReviewAnswer, StudyDay, StudyRecords } from '../types';
import { addDays, isWithin } from './seoulDate';

export type ReviewKind = 'scheduled' | 'retry';

export interface ReviewItem {
  key: string;
  dueDate: string;
  sourceDate: string;
  questionIndex: number;
  question: string;
  day: StudyDay;
  kind: ReviewKind;
  answer?: ReviewAnswer;
  /** 답하면 함께 처리할 키. 밀린 같은 질문을 한 번에 정리하려고 쓴다 */
  coveredKeys: string[];
}

export function reviewKey(dueDate: string, sourceDate: string, questionIndex: number): string {
  return `${dueDate}|${sourceDate}|${questionIndex}`;
}

function parseReviewKey(key: string) {
  const [dueDate, sourceDate, index] = key.split('|');
  return { dueDate, sourceDate, questionIndex: Number(index) };
}

function moveOutOfRest(date: string): string {
  return isWithin(date, REST_PERIOD) ? RESUME_DATE : date;
}

export function buildReviewItems(records: StudyRecords, days: StudyDay[] = getStudyDays()): ReviewItem[] {
  const dayByDate = new Map(days.map((day) => [day.date, day]));
  const items = new Map<string, ReviewItem>();

  const addItem = (dueDate: string, day: StudyDay, questionIndex: number, kind: ReviewKind) => {
    const key = reviewKey(dueDate, day.date, questionIndex);
    if (items.has(key)) return;
    items.set(key, {
      key,
      dueDate,
      sourceDate: day.date,
      questionIndex,
      question: day.reviewQuestions[questionIndex],
      day,
      kind,
      answer: records.reviews[key],
      coveredKeys: [key],
    });
  };

  for (const day of days) {
    for (const offset of REVIEW_OFFSETS) {
      const dueDate = moveOutOfRest(addDays(day.date, offset));
      day.reviewQuestions.forEach((_, index) => addItem(dueDate, day, index, 'scheduled'));
    }
  }

  for (const [key, answer] of Object.entries(records.reviews)) {
    if (answer.result !== 'unknown') continue;
    const { sourceDate, questionIndex } = parseReviewKey(key);
    const day = dayByDate.get(sourceDate);
    if (!day || !day.reviewQuestions[questionIndex]) continue;
    addItem(moveOutOfRest(addDays(answer.answeredOn, 1)), day, questionIndex, 'retry');
  }

  return [...items.values()].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || a.key.localeCompare(b.key),
  );
}

export interface ReviewQueues {
  today: ReviewItem[];
  overdue: ReviewItem[];
}

function questionId(item: ReviewItem): string {
  return `${item.sourceDate}|${item.questionIndex}`;
}

/**
 * 오늘 낼 복습과 밀린 복습으로 나눈다.
 * 밀린 복습은 같은 질문을 하나로 합치고, 오늘도 나오는 질문이면 오늘 쪽에 합친다.
 */
export function splitReviewQueues(items: ReviewItem[], today: string): ReviewQueues {
  const todayItems = items
    .filter((item) => item.dueDate === today)
    .map((item) => ({ ...item, coveredKeys: [item.key] }));
  const todayById = new Map(todayItems.map((item) => [questionId(item), item]));
  const overdueById = new Map<string, ReviewItem>();

  for (const item of items) {
    if (item.dueDate >= today || item.dueDate < STUDY_PERIOD.start || item.answer) continue;
    const id = questionId(item);
    const target = todayById.get(id) ?? overdueById.get(id);
    if (target) {
      target.coveredKeys.push(item.key);
      continue;
    }
    overdueById.set(id, { ...item, coveredKeys: [item.key] });
  }

  return { today: todayItems, overdue: [...overdueById.values()] };
}

/** 같은 원본 날짜끼리 묶는다 (화면에서 날짜별 카드로 보여주기 위해) */
export function groupBySource(items: ReviewItem[]): { day: StudyDay; items: ReviewItem[] }[] {
  const groups = new Map<string, { day: StudyDay; items: ReviewItem[] }>();
  for (const item of items) {
    const group = groups.get(item.sourceDate) ?? { day: item.day, items: [] };
    group.items.push(item);
    groups.set(item.sourceDate, group);
  }
  return [...groups.values()];
}
