// 레슨 파일 찾기와 불러오기. 파일은 content/<툴>/day-NN.md + day-NN.quiz.json.
// 레슨마다 따로 불러와서(코드 분할) 첫 화면 용량에 영향을 주지 않는다.
import type { ToolId } from '../types';
import { parseMeta, parseQuiz, splitBody, splitFrontmatter } from './parseLesson';
import type { Lesson } from './types';

const markdownFiles = import.meta.glob('./content/*/day-*.md', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>;
const quizFiles = import.meta.glob('./content/*/day-*.quiz.json', { import: 'default' }) as Record<
  string,
  () => Promise<unknown>
>;

function basePath(tool: ToolId, dayIndex: number): string {
  return `./content/${tool}/day-${String(dayIndex).padStart(2, '0')}`;
}

export function hasLesson(tool: ToolId, dayIndex: number): boolean {
  return `${basePath(tool, dayIndex)}.md` in markdownFiles;
}

const cache = new Map<string, Promise<Lesson>>();

async function readLesson(tool: ToolId, dayIndex: number): Promise<Lesson> {
  const base = basePath(tool, dayIndex);
  const loadMarkdown = markdownFiles[`${base}.md`];
  const loadQuiz = quizFiles[`${base}.quiz.json`];
  if (!loadMarkdown) throw new Error(`${base}.md 파일이 없어요`);
  const [source, quizSource] = await Promise.all([loadMarkdown(), loadQuiz ? loadQuiz() : { questions: [] }]);
  const { fields, body } = splitFrontmatter(source);
  return {
    tool,
    dayIndex,
    meta: parseMeta(fields, `${base}.md`),
    ...splitBody(body),
    quiz: parseQuiz(quizSource, `${base}.quiz.json`),
  };
}

export function loadLesson(tool: ToolId, dayIndex: number): Promise<Lesson> {
  const key = `${tool}-${dayIndex}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const pending = readLesson(tool, dayIndex);
  cache.set(key, pending);
  pending.catch(() => cache.delete(key));
  return pending;
}
