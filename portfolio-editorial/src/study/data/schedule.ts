// 학습 기간·휴식 기간·하루 구성. 날짜는 모두 Asia/Seoul 기준 YYYY-MM-DD.
import type { BlockId } from '../types';

export const STUDY_PERIOD = { start: '2026-09-28', end: '2026-11-30' } as const;

export const REST_PERIOD = { start: '2026-10-11', end: '2026-10-20' } as const;

/** 휴식 기간에 걸린 복습은 이 날로 미룬다 */
export const RESUME_DATE = '2026-10-21';

/** 간격 반복 주기(일) */
export const REVIEW_OFFSETS = [1, 3, 7] as const;

export interface DayBlock {
  id: BlockId;
  label: string;
  time: string;
  hours: string;
}

export const DAY_BLOCKS: DayBlock[] = [
  { id: 'am', label: '오전', time: '개념 학습', hours: '2~3시간' },
  { id: 'pm', label: '오후', time: '실습', hours: '3~4시간' },
  { id: 'eve', label: '저녁', time: '복습·기록', hours: '1시간' },
];

/** 저녁 블록은 날마다 같은 할 일이다 */
export const EVENING_TASKS = [
  '오늘 복습 질문에 소리 내어 답해 보기',
  '실제 공부 시간과 메모 남기기',
  '산출물 파일 저장하고 링크 등록하기',
  '복습 페이지에서 오늘 나온 질문 풀기',
];
