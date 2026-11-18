# 미뤄 둔 문제

## 100줄 기준선 (2026-11-18, 하네스 붙일 때)

100줄 넘는 코드 파일 36개. 더 커지면 `check-file-size` 가 막는다. 줄이면 여기서 지운다.
`_UI/` · `portfolio-neon/` · 루트 `src/` 는 배포 안 하는 시안 · 옛 앱이라 고칠 대상은 아니지만 검사에는 걸린다.

| 줄 | 파일 |
|---|---|
| 370 | `_UI/portfolio-bubble/app.jsx` |
| 334 | `portfolio-editorial/src/data.ts` |
| 293 | `_UI/portfolio-bubble/data.js` |
| 270 | `portfolio-neon/data.js` |
| 270 | `_UI/portfolio-neon/data.js` |
| 264 | `_UI/portfolio-editorial/data.js` |
| 190 | `portfolio-editorial/src/study/StudyContext.tsx` |
| 182 | `portfolio-editorial/scripts/excel/sheets-day6.mjs` |
| 177 | `portfolio-folio/js/covers.js` |
| 159 | `portfolio-editorial/scripts/excel/sheets-day4.mjs` |
| 156 | `portfolio-editorial/scripts/excel/build.mjs` |
| 152 | `portfolio-folio/js/projects-work.js` |
| 152 | `portfolio-editorial/src/components/ProjectDetail.tsx` |
| 151 | `portfolio-editorial/scripts/excel/sheets.mjs` |
| 148 | `portfolio-editorial/scripts/excel/sheets-day5.mjs` |
| 146 | `_UI/portfolio-editorial/app.jsx` |
| 145 | `portfolio-neon/app.jsx` |
| 145 | `_UI/portfolio-neon/app.jsx` |
| 141 | `portfolio-folio/js/blueprint-intro.js` |
| 141 | `portfolio-editorial/src/study/components/DayRecordForm.tsx` |
| 137 | `src/components/FeaturedWork.tsx` |
| 130 | `_UI/portfolio-editorial/components/ProjectDetail.jsx` |
| 128 | `portfolio-editorial/src/study/lessons/components/QuizInputs.tsx` |
| 127 | `portfolio-editorial/src/study/lib/progress.ts` |
| 125 | `portfolio-neon/components/ProjectDetail.jsx` |
| 125 | `_UI/portfolio-neon/components/ProjectDetail.jsx` |
| 123 | `src/components/Hero.tsx` |
| 121 | `portfolio-editorial/src/study/lib/reviewQueue.ts` |
| 117 | `portfolio-editorial/scripts/excel/data-crash.mjs` |
| 115 | `portfolio-folio/js/panel.js` |
| 114 | `portfolio-editorial/src/study/lessons/components/FunctionTip.tsx` |
| 111 | `portfolio-editorial/api/_lib/google.ts` |
| 108 | `portfolio-folio/js/layout.js` |
| 108 | `portfolio-editorial/src/study/pages/DayPage.tsx` |
| 105 | `portfolio-editorial/src/study/lessons/LessonPage.tsx` |
| 102 | `portfolio-editorial/src/study/pages/LogPage.tsx` |

## 첫 검사에서 본 것

- 2026-11-18 · 레이어 위반 0 (`src` 바로 아래 기준). 다만 `study/` 안쪽에서 `data ↔ lib` 가 서로 가져다 씀(`data → lib` 1곳, `lib → data` 7곳). `check-arch` 는 안쪽을 못 보니, 나누려면 `study/` 를 따로 레이어로 정리
- 2026-11-18 · `npm audit`: `portfolio-editorial` 10개(high 5, 개발 도구 @babel/core · browserslist 등, 배포 결과물엔 안 들어감, `npm audit --omit=dev` 0개). 루트 22개(high 15 · critical 2)는 배포 안 하는 옛 cinematic 앱 의존성 + 테스트 도구. `npm audit fix` 는 따로 작업으로
- 2026-11-18 · 린트(`tsc --noEmit` 3종) · 빌드 통과, 비밀값 0 · git 기록 속 키 0 · `.env` 커밋 기록 0
- 2026-11-18 · 책장(`portfolio-folio`)은 린트 · 빌드 · 레이어 검사가 없다(정적 js). 지금은 단위(데이터) · E2E 로만 지킨다
- 2026-11-18 · 화면 캡처(`ui-capture`)는 `dev` 하나만 띄울 수 있어 공부 사이트만 찍는다. 책장 캡처는 E2E 실패 시 `logs/e2e-results/folio` 에만 남음
