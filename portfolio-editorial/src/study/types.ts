// 학습 섹션 전용 타입. 커리큘럼(정적 데이터)과 기록(저장 데이터)을 나눈다.

export type ToolId =
  | 'excel'
  | 'ppt'
  | 'word'
  | 'figma'
  | 'photoshop'
  | 'illustrator'
  | 'integration';

/** 하루치 커리큘럼. date 는 Asia/Seoul 기준 YYYY-MM-DD. */
export interface StudyDay {
  date: string;
  tool: ToolId;
  /** 툴 안에서 몇 번째 날인지 (1부터) */
  dayIndex: number;
  title: string;
  /** 학습 목표 3개 */
  goals: string[];
  /** 핵심 개념 */
  concepts: string[];
  /** 실습 과제, 순서대로 진행하는 단계 */
  practice: string[];
  /** 그날 산출물 */
  deliverable: string;
  /** 복습 질문 3~5개 */
  reviewQuestions: string[];
  estimatedHours: number;
  keywords: string[];
}

export interface ToolInfo {
  id: ToolId;
  name: string;
  short: string;
  /** 툴 카드 강조색 */
  color: string;
  summary: string;
}

export interface RoadmapPhase {
  id: string;
  /** YYYY-MM-DD, 포함 */
  start: string;
  /** YYYY-MM-DD, 포함 */
  end: string;
  label: string;
  title: string;
  items: string[];
}

export type BlockId = 'am' | 'pm' | 'eve';

/** 하루 기록. checks 의 키는 `${BlockId}-${index}` */
export interface DayRecord {
  checks: Record<string, boolean>;
  minutes: number;
  memo: string;
  links: string[];
  completed: boolean;
  completedAt?: string;
  /** 그날 레슨(공부 자료)을 끝까지 봤는지 */
  lessonDone?: boolean;
}

export type ReviewResult = 'known' | 'unsure' | 'unknown';

/** 복습 답. 키는 `${dueDate}|${sourceDate}|${questionIndex}` */
export interface ReviewAnswer {
  result: ReviewResult;
  answeredOn: string;
}

/** 레슨 마무리 문제 답. 키는 `${date}|${questionId}` */
export interface QuizAnswer {
  correct: boolean;
  answeredOn: string;
  /** 객관식이면 고른 보기 번호, 계산형이면 입력한 값 */
  value?: number;
  /** 체크리스트형이면 체크한 항목 번호 */
  checked?: number[];
}

export interface StudyRecords {
  days: Record<string, DayRecord>;
  reviews: Record<string, ReviewAnswer>;
  quiz: Record<string, QuizAnswer>;
  /** 미룬 날. 키는 날짜, true 면 미룸 · false 면 미루기를 취소함 */
  postponed: Record<string, boolean>;
}
