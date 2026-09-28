// 브라우저 저장소. 서버 기록의 사본을 두고, 서버가 없을 때(로컬 개발)는 원본으로 쓴다.
// 사생활 모드 등에서 저장소 접근이 막혀도 화면은 동작하도록 예외를 삼킨다.
import type { StudyRecords } from '../types';
import { parseRecords } from './validateRecords';

const CACHE_KEY = 'study-records-v1';

export function emptyRecords(): StudyRecords {
  return { days: {}, reviews: {} };
}

export function readCache(): StudyRecords | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? parseRecords(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeCache(records: StudyRecords): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(records));
  } catch {
    // 저장소를 쓸 수 없는 환경. 서버 저장은 그대로 진행된다.
  }
}
