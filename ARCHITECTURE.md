# 구조

폴더 안 파일별 역할은 각 앱의 README 에 있다(`portfolio-folio/README.md` · `portfolio-editorial/README.md`). 여기엔 앱 · 레이어 · 흐름만 적는다.

## 앱

| 폴더 | 무엇 | 배포 | 하네스 |
|---|---|---|---|
| `portfolio-folio/` | 3D 책장 포트폴리오 (정적 HTML + three.js r160, 빌드 없음) | junghyeok.com (Vercel `junghyeok-home`) | 단위(데이터) · E2E |
| `portfolio-editorial/` | 공부 사이트 + 옛 포트폴리오 홈 `#/work` (Vite React TS, `api/` = Vercel 함수) | study.junghyeok.com (Vercel `junghyeok-portfolio`) | 린트 · 빌드 · 화면 캡처 · 레이어 · 단위 · E2E |
| 루트 `src/` · `index.html` | 처음 만든 cinematic 랜딩 | 안 함 | 루트 package.json 은 테스트 도구 자리로 씀 |
| `home-landing/` | 옛 junghyeok.com 임시 첫 페이지 | 안 함(책장으로 바뀜) | 없음 |
| `portfolio-neon/` · `_UI/` | 네온 무드 시안 · 디자인 시안 원본 (.jsx, 빌드 없음) | 안 함 | 없음 |

## 레이어 (portfolio-editorial/src)
화살표 방향으로만 import 한다 (`check-arch` 가 검사, 바꾸려면 `harness.json` 의 `layers`).

```
types → helpers · data → study → hooks → components → App · main
```

- `study/` 는 공부 기능 전체가 들어 있는 큰 묶음이다. 옛 홈의 `hooks/useHashRoute` · `components/Topbar` 가 `study/routes` 를 가져다 쓴다
- `check-arch` 는 `src` 바로 아래 폴더만 본다. `study/` 안쪽(lib · data · hooks · components · pages · lessons)은 검사 밖이라 리뷰로 본다. 안쪽 방향은 `pages → components → StudyContext → hooks → lib · data → types` 이고, `data ↔ lib` 는 서로 가져다 쓴다(tech-debt-tracker)
- 책장(`portfolio-folio/js`)은 레이어 검사를 하지 않는다. `main.js` 가 모듈을 묶고, 데이터는 `projects*.js` · `project-retros.js`

## 데이터 흐름

```
공부 사이트: 주소 #/... ─ routes.parseRoute ─> StudySection ─> pages
            StudyContext ─ lib/recordsApi ─> /api/records ─> Upstash Redis (읽기 누구나, 쓰기 로그인)
                        └─ lib/localCache (브라우저 사본, api 가 없으면 원본)
            커리큘럼 = study/data/<툴>.ts, 레슨 = study/lessons/content/<툴>/day-NN.md + .quiz.json

책장: index.html ─ intro-entry.js(첫 접속 청사진 인트로) ─ main.js ─ scene · motion · wave · view · panel
     내용 = projects-work.js + projects-school.js (projects.js 가 합침) + project-retros.js, 캡처 = images/<id>/
```

## 외부 서비스
- Vercel 2개(위 표) · Cloudflare DNS
- 공부 사이트: Upstash Redis(`junghyeok-study`) · 구글 로그인(Google Cloud 프로젝트 `junghyeok-portfolio`). 비밀값은 Vercel 환경변수, 예시는 `portfolio-editorial/.env.example`
- 책장: three.js · Pretendard 는 jsDelivr, 글꼴은 Google Fonts

## 시험
- 단위: `tests/study/*.test.ts`(날짜 · 채점 · 기록 검사 · 주소) · `tests/folio/*.test.js`(책 id · 캡처 파일 · 돌아보기). 루트 `vitest.config.ts`
- 흐름: `e2e/folio.config.ts`(정적 서버) → `e2e/study.config.ts`(vite build + preview), 둘 다 포트 4155, PC · 390px
  - 바깥 주소는 전부 막는다. 책장의 three.js 는 루트 devDependency `three@0.160.0` 을 로컬 파일로 돌려준다
  - 공부 사이트는 `/api/` 를 끊어 Upstash · 구글에 닿지 않는다. 로그인 필요한 편집 화면은 보지 않는다
- 화면 캡처: `ui-capture` 가 `dev`(공부 사이트)를 띄워 `harness.json` 의 `pages` 를 찍는다. 책장은 E2E 만
