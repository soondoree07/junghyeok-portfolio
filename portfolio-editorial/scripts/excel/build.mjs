// 엑셀 레슨 실습 파일 만들기: npm run lessons:excel
// - public/lessons/excel/day-NN-start.xlsx  (시작 파일)
// - public/lessons/excel/day-NN-answer.xlsx (정답 파일)
// 만든 뒤 레슨 문제(day-NN.quiz.json)의 계산형 정답이 여기서 계산한 값과 같은지 검사한다.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import {
  addAttendanceSheet, addDropSheet, addItemSheet, addMultiplierSheet, addShortcutSheet, attendanceAnswers,
  dropAnswers, itemAnswers, solveAttendanceSheet, solveDropSheet, solveItemSheet, solveMultiplierSheet,
} from './sheets.mjs';
import { addGuideSheet, freezeHeaderAndId } from './style.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUTPUT_DIR = path.join(ROOT, 'public/lessons/excel');
const QUIZ_DIR = path.join(ROOT, 'src/study/lessons/content/excel');

// 날마다 앞날의 정답 위에 쌓는다. start 는 그날 시작 상태, answer 는 그날 끝난 상태.
function day1Start(workbook) {
  addItemSheet(workbook);
  addShortcutSheet(workbook);
}
function day1Answer(workbook) {
  day1Start(workbook);
  solveItemSheet(workbook.getWorksheet('아이템'));
}
function day2Start(workbook) {
  day1Answer(workbook);
  addDropSheet(workbook);
}
function day2Answer(workbook) {
  day2Start(workbook);
  freezeHeaderAndId(workbook.getWorksheet('아이템'));
  solveDropSheet(workbook.getWorksheet('드롭'));
}
function day3Start(workbook) {
  day2Answer(workbook);
  addAttendanceSheet(workbook);
  addMultiplierSheet(workbook);
}
function day3Answer(workbook) {
  day3Start(workbook);
  solveAttendanceSheet(workbook.getWorksheet('출석'));
  solveMultiplierSheet(workbook.getWorksheet('배율표'));
}

const DAYS = [
  { day: 1, start: day1Start, answer: day1Answer, answers: itemAnswers() },
  { day: 2, start: day2Start, answer: day2Answer, answers: dropAnswers() },
  { day: 3, start: day3Start, answer: day3Answer, answers: attendanceAnswers() },
];

const pad = (day) => String(day).padStart(2, '0');

async function writeWorkbook(fill, guide, file) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'junghyeok-portfolio study';
  fill(workbook);
  addGuideSheet(workbook, guide);
  await workbook.xlsx.writeFile(file);
}

async function checkQuiz(day, answers) {
  const file = path.join(QUIZ_DIR, `day-${pad(day)}.quiz.json`);
  let quiz;
  try {
    quiz = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.warn(`  [${day}일차] 문제 파일이 아직 없어 정답 검사를 건너뛰어요`);
    return [];
  }
  const problems = [];
  for (const question of quiz.questions.filter((item) => item.type === 'numeric')) {
    const expected = answers[question.id];
    if (expected === undefined) problems.push(`${question.id}: 스크립트에 계산값이 없어요`);
    else if (Math.abs(expected - question.answer) > (question.tolerance ?? 0) + 1e-9) {
      problems.push(`${question.id}: 문제 정답 ${question.answer} ≠ 계산값 ${expected}`);
    }
  }
  return problems;
}

await mkdir(OUTPUT_DIR, { recursive: true });
let failed = false;
for (const { day, start, answer, answers } of DAYS) {
  const base = path.join(OUTPUT_DIR, `day-${pad(day)}`);
  await writeWorkbook(start, [`엑셀 ${day}일차 시작 파일`, '공부 자료의 "따라 하기"를 보면서 이 파일을 채워 나가세요.', '모든 이름과 수치는 학습용 가정 값이에요.'], `${base}-start.xlsx`);
  await writeWorkbook(answer, [`엑셀 ${day}일차 정답 파일`, '막히면 같은 위치의 셀을 열어 수식 입력줄에서 수식을 확인하세요.', '모든 이름과 수치는 학습용 가정 값이에요.'], `${base}-answer.xlsx`);
  const problems = await checkQuiz(day, answers);
  problems.forEach((problem) => console.error(`  [${day}일차] ${problem}`));
  failed ||= problems.length > 0;
  console.log(`${day}일차: 파일 2개 생성 · 계산값 ${JSON.stringify(answers)}`);
}
if (failed) {
  console.error('레슨 문제 정답과 실습 파일 계산값이 달라요. 위 목록을 고쳐 주세요.');
  process.exit(1);
}
