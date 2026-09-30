// 툴별 커리큘럼 파일을 하나의 날짜순 목록으로 모은다. 화면은 여기서만 가져다 쓴다.
//
// 커리큘럼 파일의 date 는 "처음 계획한 날짜"다. 실제 날짜는 미룬 날(기록의 postponed)을
// 반영해 다시 계산한다. StudyProvider 가 기록이 바뀔 때마다 applyPostponedDates 를 부르고,
// 아래 get* 함수들은 늘 그 결과(현재 일정)를 돌려준다.
import type { StudyDay, ToolId } from '../types';
import { addDays, isWithin } from '../lib/seoulDate';
import { EXCEL_BASICS } from './excel-basics';
import { EXCEL_PLANNING } from './excel-planning';
import { PPT_DAYS } from './ppt';
import { WORD_DAYS } from './word';
import { FIGMA_DAYS } from './figma';
import { PHOTOSHOP_DAYS } from './photoshop';
import { ILLUSTRATOR_DAYS } from './illustrator';
import { INTEGRATION_DAYS } from './integration';
import { REST_PERIOD, STUDY_PERIOD } from './schedule';

const PLANNED_DAYS: StudyDay[] = [
  ...EXCEL_BASICS,
  ...EXCEL_PLANNING,
  ...PPT_DAYS,
  ...WORD_DAYS,
  ...FIGMA_DAYS,
  ...PHOTOSHOP_DAYS,
  ...ILLUSTRATOR_DAYS,
  ...INTEGRATION_DAYS,
].sort((a, b) => a.date.localeCompare(b.date));

/**
 * 미룬 날짜를 반영한 일정. 각 학습일은 계획한 날짜와 바로 앞 학습일 다음 날 중 늦은 날에
 * 배치하되, 휴식 기간과 미룬 날은 건너뛴다. 미룬 날이 없으면 계획 그대로다.
 */
export function buildSchedule(postponedDates: ReadonlySet<string>): StudyDay[] {
  const isBlocked = (date: string) => isWithin(date, REST_PERIOD) || postponedDates.has(date);
  let previous = '';
  return PLANNED_DAYS.map((day) => {
    let date = previous && day.date <= previous ? addDays(previous, 1) : day.date;
    while (isBlocked(date)) date = addDays(date, 1);
    previous = date;
    return date === day.date ? day : { ...day, date };
  });
}

let studyDays = PLANNED_DAYS;
let dayByDate = new Map(studyDays.map((day) => [day.date, day]));
let appliedKey = '';

/** 미룬 날짜로 현재 일정을 다시 계산한다. 같은 목록이면 아무 일도 하지 않는다 */
export function applyPostponedDates(dates: string[]): void {
  const key = [...dates].sort().join(',');
  if (key === appliedKey) return;
  appliedKey = key;
  studyDays = buildSchedule(new Set(dates));
  dayByDate = new Map(studyDays.map((day) => [day.date, day]));
}

/** 현재 일정 전체 (날짜순) */
export function getStudyDays(): StudyDay[] {
  return studyDays;
}

export function getStudyDay(date: string): StudyDay | undefined {
  return dayByDate.get(date);
}

export function getToolDays(tool: ToolId): StudyDay[] {
  return studyDays.filter((day) => day.tool === tool);
}

/** date 이후(당일 제외) 첫 학습일 */
export function getNextStudyDay(date: string): StudyDay | undefined {
  return studyDays.find((day) => day.date > date);
}

/** 현재 일정의 학습 기간. 미루면 끝나는 날이 늦어진다 */
export function getStudyPeriod(): { start: string; end: string } {
  const last = studyDays[studyDays.length - 1];
  return { start: STUDY_PERIOD.start, end: last && last.date > STUDY_PERIOD.end ? last.date : STUDY_PERIOD.end };
}
