// 프로젝트 데이터 — 책 한 권 = 프로젝트 하나. 회사 · 공모전 · 개인 작업을 앞에, 학교 프로젝트를 뒤에 둔다.
// 내용은 projects-work.js · projects-school.js 에서 고친다.
import { WORK_PROJECTS } from './projects-work.js';
import { SCHOOL_PROJECTS } from './projects-school.js';

export const PROJECTS = [
  ...WORK_PROJECTS,
  ...SCHOOL_PROJECTS.map((project) => ({ ...project, school: true })),
];
