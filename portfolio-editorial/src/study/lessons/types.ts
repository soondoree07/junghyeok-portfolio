// 레슨(날짜별 공부 자료) 타입. 본문은 마크다운, 문제는 같은 이름의 .quiz.json 에 둔다.
import type { ToolId } from '../types';

export type ReviewStatus = '미검수' | '검수 완료';

/** 레슨 파일 상단 frontmatter */
export interface LessonMeta {
  status: ReviewStatus;
  /** 기준 버전 (예: Microsoft 365 한국어판) */
  version: string;
  startFile?: string;
  answerFile?: string;
  /** 디자인 툴 레슨의 완성 예시 이미지 */
  exampleImage?: string;
  updated?: string;
}

export interface ChoiceQuestion {
  id: string;
  type: 'choice';
  question: string;
  options: string[];
  /** 정답 보기 번호 (0부터) */
  answer: number;
  explanation: string;
}

/** 엑셀처럼 값을 계산해 입력하면 자동 채점하는 문제 */
export interface NumericQuestion {
  id: string;
  type: 'numeric';
  question: string;
  answer: number;
  /** 허용 오차. 없으면 정확히 같아야 정답 */
  tolerance?: number;
  unit?: string;
  hint?: string;
  explanation: string;
}

/** 디자인 툴처럼 완성 기준을 스스로 체크하는 문제 */
export interface ChecklistQuestion {
  id: string;
  type: 'checklist';
  question: string;
  items: string[];
  explanation?: string;
}

export type QuizQuestion = ChoiceQuestion | NumericQuestion | ChecklistQuestion;

export interface LessonQuiz {
  questions: QuizQuestion[];
}

export interface Lesson {
  tool: ToolId;
  dayIndex: number;
  meta: LessonMeta;
  /** 마무리 문제 앞에 오는 본문 (마크다운) */
  before: string;
  /** 마무리 문제 뒤에 오는 본문 (마크다운) */
  after: string;
  quiz: LessonQuiz;
}
