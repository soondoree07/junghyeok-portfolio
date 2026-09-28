// 기록 데이터 형태 검사. 브라우저(가져오기)와 서버(api/)가 함께 쓰므로
// 타입 import 외에는 다른 모듈을 가져오지 않는다.
import type { DayRecord, QuizAnswer, ReviewAnswer, StudyRecords } from '../types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REVIEW_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}\|\d{4}-\d{2}-\d{2}\|\d{1,2}$/;
const QUIZ_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}\|[a-z0-9-]{1,40}$/;
const REVIEW_RESULTS = ['known', 'unsure', 'unknown'];

export const LIMITS = { memo: 5000, links: 10, linkLength: 500, minutes: 1440 } as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isDayRecord(value: unknown): value is DayRecord {
  if (!isPlainObject(value)) return false;
  const { checks, minutes, memo, links, completed, completedAt, lessonDone } = value;
  return (
    isPlainObject(checks) &&
    Object.values(checks).every((checked) => typeof checked === 'boolean') &&
    typeof minutes === 'number' &&
    minutes >= 0 &&
    minutes <= LIMITS.minutes &&
    typeof memo === 'string' &&
    memo.length <= LIMITS.memo &&
    Array.isArray(links) &&
    links.length <= LIMITS.links &&
    links.every((link) => typeof link === 'string' && link.length <= LIMITS.linkLength) &&
    typeof completed === 'boolean' &&
    (completedAt === undefined || typeof completedAt === 'string') &&
    (lessonDone === undefined || typeof lessonDone === 'boolean')
  );
}

export function isReviewAnswer(value: unknown): value is ReviewAnswer {
  return (
    isPlainObject(value) &&
    REVIEW_RESULTS.includes(value.result as string) &&
    typeof value.answeredOn === 'string' &&
    DATE_PATTERN.test(value.answeredOn)
  );
}

export function isQuizAnswer(value: unknown): value is QuizAnswer {
  if (!isPlainObject(value)) return false;
  const { correct, answeredOn, value: answerValue, checked } = value;
  return (
    typeof correct === 'boolean' &&
    typeof answeredOn === 'string' &&
    DATE_PATTERN.test(answeredOn) &&
    (answerValue === undefined || (typeof answerValue === 'number' && Number.isFinite(answerValue))) &&
    (checked === undefined ||
      (Array.isArray(checked) && checked.length <= 30 && checked.every((index) => Number.isInteger(index))))
  );
}

function parseEntries<T>(
  value: unknown,
  keyPattern: RegExp,
  isEntry: (entry: unknown) => entry is T,
): Record<string, T> | null {
  if (value === undefined) return {};
  if (!isPlainObject(value)) return null;
  const entries = Object.entries(value);
  if (!entries.every(([key, entry]) => keyPattern.test(key) && isEntry(entry))) return null;
  return Object.fromEntries(entries) as Record<string, T>;
}

/** 전체 기록(가져오기용). 형태가 틀리면 null */
export function parseRecords(value: unknown): StudyRecords | null {
  if (!isPlainObject(value)) return null;
  const days = parseEntries(value.days, DATE_PATTERN, isDayRecord);
  const reviews = parseEntries(value.reviews, REVIEW_KEY_PATTERN, isReviewAnswer);
  const quiz = parseEntries(value.quiz, QUIZ_KEY_PATTERN, isQuizAnswer);
  if (!days || !reviews || !quiz) return null;
  return { days, reviews, quiz };
}
