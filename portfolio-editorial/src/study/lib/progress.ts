// 진행률·상태·통계 계산. 화면은 기록을 직접 세지 않고 여기 함수를 쓴다.
import { STUDY_DAYS, getStudyDay } from '../data';
import { DAY_BLOCKS, EVENING_TASKS, REST_PERIOD, STUDY_PERIOD } from '../data/schedule';
import { TOOLS } from '../data/tools';
import type { BlockId, DayRecord, StudyDay, StudyRecords, ToolId } from '../types';
import { isWithin } from './seoulDate';

export type DayStatus = 'rest' | 'done' | 'partial' | 'missed' | 'upcoming' | 'outside';

export const STATUS_LABEL: Record<DayStatus, string> = {
  rest: '휴식',
  done: '완료',
  partial: '부분',
  missed: '미완료',
  upcoming: '예정',
  outside: '기간 외',
};

export function emptyDayRecord(): DayRecord {
  return { checks: {}, minutes: 0, memo: '', links: [], completed: false };
}

export function hasActivity(record: DayRecord | undefined): boolean {
  if (!record) return false;
  return (
    record.minutes > 0 ||
    record.memo.trim() !== '' ||
    record.links.length > 0 ||
    Object.values(record.checks).some(Boolean)
  );
}

export function getDayStatus(date: string, records: StudyRecords, today: string): DayStatus {
  if (isWithin(date, REST_PERIOD)) return 'rest';
  if (!getStudyDay(date)) return 'outside';
  const record = records.days[date];
  if (record?.completed) return 'done';
  if (hasActivity(record)) return 'partial';
  return date < today ? 'missed' : 'upcoming';
}

/** 하루 체크리스트: 오전은 핵심 개념, 오후는 실습 단계, 저녁은 공통 할 일 */
export function getChecklist(day: StudyDay): Record<BlockId, string[]> {
  return { am: day.concepts, pm: day.practice, eve: EVENING_TASKS };
}

export function countChecks(day: StudyDay, record: DayRecord | undefined) {
  const checklist = getChecklist(day);
  const total = DAY_BLOCKS.reduce((sum, block) => sum + checklist[block.id].length, 0);
  const done = DAY_BLOCKS.reduce(
    (sum, block) =>
      sum + checklist[block.id].filter((_, index) => record?.checks[`${block.id}-${index}`]).length,
    0,
  );
  return { done, total };
}

export interface Progress {
  done: number;
  total: number;
  ratio: number;
}

function toProgress(done: number, total: number): Progress {
  return { done, total, ratio: total === 0 ? 0 : done / total };
}

export function getOverallProgress(records: StudyRecords): Progress {
  const done = STUDY_DAYS.filter((day) => records.days[day.date]?.completed).length;
  return toProgress(done, STUDY_DAYS.length);
}

export function getToolProgress(tool: ToolId, records: StudyRecords): Progress {
  const days = STUDY_DAYS.filter((day) => day.tool === tool);
  const done = days.filter((day) => records.days[day.date]?.completed).length;
  return toProgress(done, days.length);
}

/** 기간 진행: 오늘까지 지나간 학습일 수 */
export function getElapsedStudyDays(today: string): number {
  return STUDY_DAYS.filter((day) => day.date <= today).length;
}

export interface ToolStat {
  tool: ToolId;
  name: string;
  color: string;
  minutes: number;
  plannedHours: number;
  progress: Progress;
}

export function getToolStats(records: StudyRecords): ToolStat[] {
  return TOOLS.map((tool) => {
    const days = STUDY_DAYS.filter((day) => day.tool === tool.id);
    return {
      tool: tool.id,
      name: tool.name,
      color: tool.color,
      minutes: days.reduce((sum, day) => sum + (records.days[day.date]?.minutes ?? 0), 0),
      plannedHours: days.reduce((sum, day) => sum + day.estimatedHours, 0),
      progress: getToolProgress(tool.id, records),
    };
  });
}

export function getTotalMinutes(records: StudyRecords): number {
  return Object.entries(records.days)
    .filter(([date]) => isWithin(date, STUDY_PERIOD))
    .reduce((sum, [, record]) => sum + record.minutes, 0);
}

/** 90 → '1시간 30분' */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}분`;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
