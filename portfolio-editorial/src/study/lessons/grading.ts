// 문제 채점과 틀린 문제 목록.
import type { QuizAnswer, StudyRecords } from '../types';
import type { ChecklistQuestion, NumericQuestion } from './types';

export function quizKey(date: string, questionId: string): string {
  return `${date}|${questionId}`;
}

/** '12,500메소' 같은 입력에서 숫자만 읽는다. 숫자가 아니면 null */
export function parseNumberInput(input: string): number | null {
  const cleaned = input.replace(/[,\s]/g, '').replace(/[^\d.+-]+$/, '');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function isNumericCorrect(question: NumericQuestion, value: number): boolean {
  return Math.abs(value - question.answer) <= (question.tolerance ?? 0) + 1e-9;
}

export function isChecklistComplete(question: ChecklistQuestion, checked: number[]): boolean {
  return question.items.every((_, index) => checked.includes(index));
}

export interface WrongQuizEntry {
  key: string;
  date: string;
  questionId: string;
  answer: QuizAnswer;
}

/** 마지막 답이 오답인 문제. 다시 풀어 맞히면 목록에서 빠진다 */
export function getWrongQuizEntries(records: StudyRecords): WrongQuizEntry[] {
  return Object.entries(records.quiz)
    .filter(([, answer]) => !answer.correct)
    .map(([key, answer]) => {
      const [date, questionId] = key.split('|');
      return { key, date, questionId, answer };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.questionId.localeCompare(b.questionId));
}
