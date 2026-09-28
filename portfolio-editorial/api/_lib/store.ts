// Upstash Redis 저장소. 날짜별 기록·복습 답·레슨 문제 답을 해시 세 개에 나눠 담아
// 폰·PC에서 서로 다른 날짜를 고쳐도 덮어쓰지 않게 한다.
// 필요한 환경변수: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// (Vercel 마켓플레이스로 연결하면 KV_REST_API_URL / KV_REST_API_TOKEN 이름으로 들어온다)
import { Redis } from '@upstash/redis';
import type { DayRecord, QuizAnswer, ReviewAnswer, StudyRecords } from '../../src/study/types';

const DAYS_KEY = 'study:days';
const REVIEWS_KEY = 'study:reviews';
const QUIZ_KEY = 'study:quiz';
const LOGIN_FAIL_KEY = 'study:login-fail';
const LOGIN_FAIL_LIMIT = 10;
const LOGIN_LOCK_SECONDS = 15 * 60;

let client: Redis | null = null;

function redis(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Redis 환경변수가 없습니다');
  client = new Redis({ url, token });
  return client;
}

export async function readRecords(): Promise<StudyRecords> {
  const [days, reviews, quiz] = await Promise.all([
    redis().hgetall<Record<string, DayRecord>>(DAYS_KEY),
    redis().hgetall<Record<string, ReviewAnswer>>(REVIEWS_KEY),
    redis().hgetall<Record<string, QuizAnswer>>(QUIZ_KEY),
  ]);
  return { days: days ?? {}, reviews: reviews ?? {}, quiz: quiz ?? {} };
}

export async function mergeRecords(patch: Partial<StudyRecords>): Promise<void> {
  const writes: Promise<unknown>[] = [];
  if (patch.days && Object.keys(patch.days).length > 0) writes.push(redis().hset(DAYS_KEY, patch.days));
  if (patch.reviews && Object.keys(patch.reviews).length > 0) writes.push(redis().hset(REVIEWS_KEY, patch.reviews));
  if (patch.quiz && Object.keys(patch.quiz).length > 0) writes.push(redis().hset(QUIZ_KEY, patch.quiz));
  await Promise.all(writes);
}

export async function replaceRecords(records: StudyRecords): Promise<void> {
  const transaction = redis().multi();
  transaction.del(DAYS_KEY, REVIEWS_KEY, QUIZ_KEY);
  if (Object.keys(records.days).length > 0) transaction.hset(DAYS_KEY, records.days);
  if (Object.keys(records.reviews).length > 0) transaction.hset(REVIEWS_KEY, records.reviews);
  if (Object.keys(records.quiz).length > 0) transaction.hset(QUIZ_KEY, records.quiz);
  await transaction.exec();
}

/** 방문자에게 보여줄 공개본: 메모와 산출물 링크를 뺀다 */
export function toPublicRecords(records: StudyRecords): StudyRecords {
  const days = Object.fromEntries(
    Object.entries(records.days).map(([date, record]) => [date, { ...record, memo: '', links: [] }]),
  );
  return { days, reviews: records.reviews, quiz: records.quiz };
}

export async function isLoginLocked(): Promise<boolean> {
  const failures = await redis().get<number>(LOGIN_FAIL_KEY);
  return (failures ?? 0) >= LOGIN_FAIL_LIMIT;
}

export async function recordLoginFailure(): Promise<void> {
  const failures = await redis().incr(LOGIN_FAIL_KEY);
  if (failures === 1) await redis().expire(LOGIN_FAIL_KEY, LOGIN_LOCK_SECONDS);
}

export async function clearLoginFailures(): Promise<void> {
  await redis().del(LOGIN_FAIL_KEY);
}
