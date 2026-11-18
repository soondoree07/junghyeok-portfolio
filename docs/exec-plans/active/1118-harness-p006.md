---
id: 1118-harness-p006
project: P006
type: 설정
branch: claude/1118-harness-p006
port: 4105
status: 진행 중
created: 2026-11-18
---

# 실행 계획: harness-p006

## 목표
"내가 하는 모든 프로젝트에 하네스 다 적용시켜" (정혁님 2026-11-18)
= junghyeok-portfolio 에 하네스(검증 환경)를 붙여서, 이후 작업이 `verify-task` 8가지로 검사되게 한다. 사이트 동작은 바꾸지 않는다.

## 완료 기준
- [ ] `harness.json` · 프로젝트 `CLAUDE.md`(기존 내용 합침) · `ARCHITECTURE.md` · `docs/exec-plans/tech-debt-tracker.md` 가 있다
- [ ] `verify-task` 8가지가 모두 통과한다
- [ ] Vitest 단위 테스트가 공부 사이트 순수 계산(날짜 · 채점 · 기록 검사)과 책장 데이터(id · 캡처 파일)를 잡는다
- [ ] Playwright E2E 가 책장(junghyeok.com)과 공부 사이트의 주요 화면을 PC · 390px 로 열고 콘솔 오류 · 가로 스크롤이 없음을 본다. 바깥 주소는 막고, 구글 로그인 · Upstash 에 닿지 않는다
- [ ] 100줄 넘는 파일 기준선 · 첫 검사 결과를 tech-debt-tracker 에 적는다

## 접근법
- 저장소 하나에 앱이 여럿이라 harness.json 하나로 다 덮지 못한다. 배포 중인 두 앱을 중심으로 묶는다
  - `portfolio-editorial/` = 공부 사이트 study.junghyeok.com (Vite React TS): 린트 · 빌드 · `dev`(ui-capture) · 레이어 검사 · 단위 테스트
  - `portfolio-folio/` = junghyeok.com 책장 (정적 HTML + three.js): 단위 테스트(데이터) · E2E
- 테스트 도구(vitest · @playwright/test)는 저장소 루트 package.json 에 둔다. 루트는 배포되지 않는 옛 cinematic 앱이라, 배포되는 두 폴더의 package · Vercel 빌드에 영향이 없다
- E2E 는 앱마다 설정 파일을 따로 두고 차례로 돌린다(둘 다 배정 포트 4155 하나만 씀, 다른 프로젝트 포트와 안 겹치게)
- 책장은 three.js 를 jsDelivr 에서 받는다. E2E 는 바깥 주소를 막으므로 같은 버전(0.160.0)을 devDependency 로 깔고 그 요청만 로컬 파일로 돌려준다
- 버린 방법: 두 앱을 한 서버로 합쳐 띄우기(경로가 겹쳐 꼼수가 필요), 포트 2개 쓰기(다른 프로젝트 E2E 포트와 겹칠 수 있음)

## 단계
1. 전체 기준 첫 검사 (빌드 · 린트 · 100줄 · 레이어 · 비밀값 · 기록 속 키)
2. harness.json · CLAUDE.md · ARCHITECTURE.md · tech-debt-tracker · .gitignore
3. Vitest 설치 · 단위 테스트
4. Playwright E2E (책장 · 공부 사이트)
5. 커밋 → verify-task (최대 5번) → PR

## 결정 기록
- 2026-11-18 · harness.json 은 공부 사이트(`portfolio-editorial`)에 린트 · 빌드 · dev · 레이어를 묶고, 책장(`portfolio-folio`)은 빌드가 없어 단위 · E2E 로만 덮는다. 루트 cinematic 앱 · `home-landing` · `portfolio-neon` · `_UI` 는 배포 안 해서 검사 대상에서 뺀다(100줄 기준선에는 나옴)
- 2026-11-18 · 테스트 도구(vitest 3.2 · @playwright/test 1.63 · three 0.160.0)를 루트 devDependency 로 깔았다. 배포되는 두 폴더의 package · Vercel 빌드는 그대로. vitest 4 는 vite 6 이상을 요구해서 루트 vite 5 와 맞는 3.2 로
- 2026-11-18 · 단위 테스트는 앱 폴더 밖 `tests/` 에 둔다. editorial `src` 에 두면 Vercel 의 `tsc -b` 가 vitest 를 못 찾아 배포가 깨지고, folio 는 폴더째 공개 배포된다
- 2026-11-18 · E2E 는 앱별 설정 2개를 차례로, 같은 포트 4155 로. 바깥 주소는 전부 막고 책장의 three.js 만 로컬 파일로 돌려준다. 공부 사이트는 `/api/` 를 끊어 Upstash · 구글에 닿지 않는다
- 2026-11-18 · 화면 캡처(ui-capture)는 dev 하나만 띄울 수 있어 공부 사이트를 골랐다(React 코드 · 화면이 가장 자주 바뀜). 책장은 E2E 가 PC · 390px 로 본다
- 2026-11-18 · 레이어 = `types → helpers·data → study → hooks → components → App·main`. import 를 집계하니 거꾸로 가는 곳 0개. `study/` 안쪽은 못 보고, 안쪽 `data ↔ lib` 는 tech-debt 로
- 2026-11-18 · 기존 CLAUDE.md 는 덮지 않고 틀에 맞춰 합쳤다(devlog 필드명 · 서브에이전트 표 유지). 첫 줄 이름 "배정혁"은 메모리 · 사이트 기준 "박정혁"으로 바로잡음
- 2026-11-18 · 사이트 동작은 바꾸지 않았다(앱 폴더 안 파일 변경 0)
- 2026-11-18 · 합치기 레벨 L3 예상(배포 중인 프로젝트 · 의존성 추가) → 정혁님 확인 뒤 합침

## 오류 기록

## 검증 결과
