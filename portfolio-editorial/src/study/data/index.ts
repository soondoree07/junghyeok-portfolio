// 툴별 커리큘럼 파일을 하나의 날짜순 목록으로 모은다. 화면은 여기서만 가져다 쓴다.
import type { StudyDay, ToolId } from '../types';
import { EXCEL_BASICS } from './excel-basics';
import { EXCEL_PLANNING } from './excel-planning';
import { PPT_DAYS } from './ppt';
import { WORD_DAYS } from './word';
import { FIGMA_DAYS } from './figma';
import { PHOTOSHOP_DAYS } from './photoshop';
import { ILLUSTRATOR_DAYS } from './illustrator';
import { INTEGRATION_DAYS } from './integration';

export const STUDY_DAYS: StudyDay[] = [
  ...EXCEL_BASICS,
  ...EXCEL_PLANNING,
  ...PPT_DAYS,
  ...WORD_DAYS,
  ...FIGMA_DAYS,
  ...PHOTOSHOP_DAYS,
  ...ILLUSTRATOR_DAYS,
  ...INTEGRATION_DAYS,
].sort((a, b) => a.date.localeCompare(b.date));

const DAY_BY_DATE = new Map(STUDY_DAYS.map((day) => [day.date, day]));

export function getStudyDay(date: string): StudyDay | undefined {
  return DAY_BY_DATE.get(date);
}

export function getToolDays(tool: ToolId): StudyDay[] {
  return STUDY_DAYS.filter((day) => day.tool === tool);
}

/** date 이후(당일 제외) 첫 학습일 */
export function getNextStudyDay(date: string): StudyDay | undefined {
  return STUDY_DAYS.find((day) => day.date > date);
}
