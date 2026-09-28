// 레슨 파일 해석: frontmatter(key: value 한 줄씩), 본문 분할, 문제 JSON 검사.
// 형식이 틀리면 어느 부분이 틀렸는지 알려 주는 오류를 던진다 (직접 고칠 때 찾기 쉽게).
import type { LessonMeta, LessonQuiz, QuizQuestion, ReviewStatus } from './types';

/** 본문에서 마무리 문제가 들어갈 자리 */
export const QUIZ_MARKER = '<!-- 문제 -->';

const STATUSES: ReviewStatus[] = ['미검수', '검수 완료'];
const ID_PATTERN = /^[a-z0-9-]{1,40}$/;

export function splitFrontmatter(source: string): { fields: Record<string, string>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { fields: {}, body: source };
  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator <= 0) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { fields, body: source.slice(match[0].length) };
}

export function parseMeta(fields: Record<string, string>, file: string): LessonMeta {
  const status = fields.status as ReviewStatus;
  if (!STATUSES.includes(status)) throw new Error(`${file}: status 는 ${STATUSES.join(' / ')} 중 하나여야 해요`);
  if (!fields.version) throw new Error(`${file}: version 이 비어 있어요`);
  return {
    status,
    version: fields.version,
    startFile: fields.startFile || undefined,
    answerFile: fields.answerFile || undefined,
    exampleImage: fields.exampleImage || undefined,
    updated: fields.updated || undefined,
  };
}

export function splitBody(body: string): { before: string; after: string } {
  const index = body.indexOf(QUIZ_MARKER);
  if (index < 0) return { before: body, after: '' };
  return { before: body.slice(0, index), after: body.slice(index + QUIZ_MARKER.length) };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function checkQuestion(value: unknown, file: string): QuizQuestion {
  const question = value as Record<string, unknown>;
  const where = `${file} 문제 ${String(question?.id ?? '(id 없음)')}`;
  if (typeof question?.id !== 'string' || !ID_PATTERN.test(question.id)) throw new Error(`${where}: id 는 영문 소문자·숫자·- 로 써요`);
  if (typeof question.question !== 'string') throw new Error(`${where}: question 이 없어요`);

  if (question.type === 'choice') {
    const valid =
      isStringArray(question.options) &&
      Number.isInteger(question.answer) &&
      (question.answer as number) >= 0 &&
      (question.answer as number) < question.options.length &&
      typeof question.explanation === 'string';
    if (!valid) throw new Error(`${where}: 객관식은 options, answer(0부터), explanation 이 필요해요`);
  } else if (question.type === 'numeric') {
    if (typeof question.answer !== 'number' || typeof question.explanation !== 'string') {
      throw new Error(`${where}: 계산형은 숫자 answer 와 explanation 이 필요해요`);
    }
  } else if (question.type === 'checklist') {
    if (!isStringArray(question.items) || question.items.length === 0) throw new Error(`${where}: 체크리스트형은 items 가 필요해요`);
  } else {
    throw new Error(`${where}: type 은 choice / numeric / checklist 중 하나예요`);
  }
  return question as unknown as QuizQuestion;
}

export function parseQuiz(value: unknown, file: string): LessonQuiz {
  const questions = (value as { questions?: unknown })?.questions;
  if (!Array.isArray(questions)) throw new Error(`${file}: questions 배열이 없어요`);
  const parsed = questions.map((question) => checkQuestion(question, file));
  const ids = new Set(parsed.map((question) => question.id));
  if (ids.size !== parsed.length) throw new Error(`${file}: 문제 id 가 겹쳐요`);
  return { questions: parsed };
}
