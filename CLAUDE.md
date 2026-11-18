# P006 junghyeok-portfolio — 프로젝트 규칙

> 전역 규칙(~/.claude/CLAUDE.md) 위에 이 프로젝트만의 것만 적는다. 길어지면 docs/ 로 뺀다.

## 한 줄 소개
박정혁(soondoree07)의 취업용 포트폴리오와 툴 학습(공부) 사이트. 채용 담당자(게임 스튜디오 · IT)가 1순위 독자다.
한 저장소에 앱이 여럿 있다 — 무엇이 배포되는지는 `ARCHITECTURE.md` 의 "앱" 표.

## 실행
- 검증: `verify-task` (명령은 `harness.json`). 단위 `npm test`(루트, `tests/`) · 흐름 `npm run e2e`(루트, 책장 → 공부 사이트 차례로 포트 4155)
- 개발 서버: `harness.json` 의 `dev` = 공부 사이트(`portfolio-editorial`) vite. api/ 없이 떠서 "로컬 개발 모드"(브라우저 저장)
- 책장 미리보기: `portfolio-folio/` 에서 `python3 dev-server.py` → localhost:4321. sessionStorage `folio-blueprint-seen=1` 이면 인트로 건너뜀
- 의존성: 루트 `npm ci`(테스트 도구) + `portfolio-editorial/` 에서 `npm ci`(앱)
- 배포: main 에 push 하면 Vercel 2곳이 자기 폴더가 바뀔 때만 자동 배포. **배포 중이라 앱 코드 변경은 L3**(미리보기 주소와 함께 묻기)
  - `portfolio-folio/` → Vercel `junghyeok-home` → https://junghyeok.com
  - `portfolio-editorial/` → Vercel `junghyeok-portfolio` → https://study.junghyeok.com

## 이 프로젝트만의 규칙
- 책장 프로젝트 내용은 `portfolio-folio/js/projects-work.js`(회사 · 공모전 · 개인) · `projects-school.js`(학교) · `project-retros.js`(돌아보기)에서만 고친다. 캡처는 `images/<id>/`
- 공부 커리큘럼은 `portfolio-editorial/src/study/data/<툴>.ts` 만 고친다. 화면 코드는 건드리지 않는다
- 레슨 본문 · 문제 쓰는 법은 `portfolio-editorial/README.md` "레슨 고치기"(굵은 글씨 뒤 조사 · `_xlfn.` 접두사 등)
- `portfolio-editorial/api/` 에서 가져오는 파일의 상대 import 는 `.js` 확장자를 붙인다(Vercel 함수 빌드가 node16 규칙으로 검사)
- 옛 포트폴리오 홈(`#/work`)은 데이터 주도: 프로젝트는 `src/data.ts` 배열에 객체 하나 추가, 문구는 `{ ko, en }` + `t(field, lang)`
- 두 무드(editorial · neon)는 독립 프로젝트로 둔다. 한 빌드에서 토글하지 않는다. 시안 정본은 `_UI/`
- 구글 로그인 비밀값(`GOOGLE_CLIENT_*` · `STUDY_*`)은 정혁님이 Google Cloud · Vercel 에 직접 넣는다. 대화 · 문서에 남기지 않는다. OAuth 는 Google Cloud 프로젝트 `junghyeok-portfolio` 것만 쓴다(`junghyeok1` 은 대시보드용이라 건드리지 않음)
- 테스트 · E2E 는 Upstash · 구글에 닿지 않는다(바깥 주소와 `/api/` 를 막음). 실제 기록을 바꾸는 테스트 금지
- 공개 글(소개 · 돌아보기)을 내가 정리했으면 humanize-korean 으로 다듬고 전/후 표를 보여 준 뒤 적용
- reduced-motion(움직임 줄이기)은 따르지 않는다(정혁님 PC 설정 탓)
- 이 PC 의 DNS 는 캐시가 남아 새 기록이 늦게 보인다. 도메인 확인은 dns.google DoH + `curl --resolve`
- 테스트 파일은 앱 폴더 밖 `tests/` · `e2e/` 에 둔다. editorial 의 `tsc` 빌드(Vercel)가 vitest 를 못 찾고, folio 는 폴더째 배포되기 때문

## Devlog
이 프로젝트의 `project` 필드명: **`junghyeok-portfolio`** (변종 `portfolio` 금지). devlog 는 main 에 합친 뒤에만 기록한다.

## 사용 가능한 서브에이전트

| 에이전트 | 용도 |
|---|---|
| `engineering-frontend-developer` | 페이지 · 컴포넌트 · 인터랙션 구현 |
| `design-ui-designer` | 비주얼 시스템 · 컴포넌트 디자인 |
| `design-visual-storyteller` | 프로젝트 소개 · 랜딩 내러티브 |
| `design-image-prompt-engineer` | 이미지 · 아트워크 생성 프롬프트 |
| `marketing-seo-specialist` | 검색 노출 · OG · 메타 |
| `marketing-content-creator` | 카피 · 블로그 톤 |
| `engineering-code-reviewer` (공용) | PR 리뷰 |
| `testing-reality-checker` (공용) | 배포 전 실동작 검증 |

## 빠른 참조
| 목적 | 문서 |
|---|---|
| 앱 · 레이어 · 데이터 흐름 · 시험 위치 | `ARCHITECTURE.md` |
| 책장 파일별 역할 | `portfolio-folio/README.md` |
| 공부 사이트 라우트 · 저장 · 레슨 · 배포 | `portfolio-editorial/README.md` |
| 이어하기 | `RESUME.md` · `LAST_CHAT.md` |
| 진행 중 · 끝난 작업 | `docs/exec-plans/` |
| 미뤄 둔 문제 · 100줄 기준선 | `docs/exec-plans/tech-debt-tracker.md` |
| 기획 원본 | `포트폴리오-사이트-기획서.md` · `portfolio-input.md` |
