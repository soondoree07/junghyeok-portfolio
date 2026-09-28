# 진행 상황 (2026-09-28 KST 기준)

## 한 줄
editorial 에 **"게임 기획자 준비 & 툴 학습" 섹션** 추가 완료 (로드맵·학습 계획·툴 상세·오늘 공부·복습·기록). 코드는 커밋됨, **Vercel 배포와 Upstash 연결은 아직** — 배포 전까지는 로컬 개발 모드(브라우저 저장)로만 기록된다.

## 오늘 한 것
- 54일 커리큘럼 데이터 (`portfolio-editorial/src/study/data/`, 툴별 파일) — 메이플 소재 실습, 가정 수치 명시
- 해시 라우팅 `#/roadmap`, `#/study/...` + 상단 메뉴 (작업 / 로드맵 / 학습)
- 저장: Vercel 함수(`api/`) + Upstash Redis, 공개 읽기 / 비밀번호 로그인 후 쓰기, 메모·링크는 비공개
- JSON 내보내기·가져오기, 간격 반복 복습(1·3·7일, 몰랐음 다음 날 재출제, 휴식 기간 복습은 10-21로)
- 상위 폴더 postcss(tailwind) 설정을 끌어오던 문제 차단 (`vite.config.ts` 의 `css.postcss`)
- 사용법·배포 절차: `portfolio-editorial/README.md`

## 레슨(공부 자료) — 같은 날 추가
- 날짜별 레슨 페이지 `#/study/lesson/excel/1` + 엑셀 1~3일차 레슨(미검수) + 실습 xlsx(`npm run lessons:excel`)
- 마무리 문제 채점, 틀린 문제는 복습 페이지 "틀린 레슨 문제"로
- **사용자가 1일차로 공부하며 검수 중** → 의견 받아 4~15일차 작성 → "다음 툴 진행"이면 파워포인트 레슨

## 배포 (2026-09-28 완료)
- GitHub 레포 보관 해제 → push. Vercel 프로젝트 `junghyeok-portfolio` (Root Directory `portfolio-editorial`, GitHub 연결 → push 하면 자동 배포)
- 주소: https://junghyeok-portfolio.vercel.app (학습: `#/study/today`)
- Upstash Redis 무료 요금제 `junghyeok-study` 연결, `STUDY_SESSION_SECRET` 등록
- **`STUDY_PASSWORD` 는 사용자가 Vercel 대시보드에서 직접 등록** (값을 대화에 남기지 않기 위해) → 등록 후 재배포

## 다음 할 일
1. 비밀번호 등록·재배포 후 폰에서 로그인·체크·메모 저장 확인
2. 배포 사이트에서 엑셀 1~3일차 레슨 검수 → 4~15일차 작성
3. 개인 도메인(junghyeok.com) 연결 여부 결정
4. (보류) neon 무드 C 단계

---

# 이전 기록 (2026-05-21)


## 한 줄
박정혁 포트폴리오 사이트 작업. 두 무드(editorial / neon)를 각각 독립 Vite 프로젝트로 제작 중. **editorial은 A·B 단계 완료, neon은 아직 시작 안 함.**

## 트리거 키워드
다음 세션에서 사용자가 **"포트폴리오"** 또는 `/포트폴리오`라고 하면 이 RESUME.md를 가장 먼저 읽고 이어간다.

## 오늘 완료한 것 (editorial)
- `/home/soondoree07/junghyeok-portfolio/portfolio-editorial/`를 독립 Vite + React 18 + TypeScript 프로젝트로 셋업
  - `package.json`, `vite.config.ts`(port 5174), `tsconfig.json`/`tsconfig.app.json`/`tsconfig.node.json`, `index.html`, `.gitignore`
- `_UI/Portfolio Site editorial.html`의 인라인 `<style>` 전체를 `src/styles.css`로 분리
- `window.X` 글로벌 React 패턴 → ESM import/export로 변환
  - `src/data.ts`, `src/types.ts`, `src/helpers/t.ts`
  - `src/hooks/useReducedMotion.ts`, `src/hooks/useScrollY.ts`
  - `src/components/`: `Hero.tsx`, `Carousel.tsx`, `ProjectCard.tsx`, `ProjectDetail.tsx`, `LangToggle.tsx`, `Topbar.tsx`, `Footer.tsx`, `Toast.tsx`
  - `src/App.tsx`, `src/main.tsx`
- **시안 5개 가상 데이터 → 기획서 7개 실제 프로젝트로 교체 (한·영 완비)**
  - 01 젤로팡 (WAVLE, 회사연계) / 02 포챔스 (개인) / 03 포케노바 (개인) / 04 작가 포트폴리오 (클라이언트) / 05 원격 대시보드 (개인) / 06 유기견 분양 (학교 캡스톤) / 07 돈이돼지 분석 (WAVLE)
  - Hero 카피·heroMeta·footerEmail·footerGit·sectionMeta까지 박정혁 본인 정보로 교체
- `npx tsc -b` 통과 / dev 서버(`npm run dev` → port 5174) 모든 모듈 URL 200 확인
- 두 번의 dev 서버는 종료된 상태

## 사용자가 다음에 할 일
1. 내일 dev 서버 다시 띄워 editorial 동작 확인 — `cd portfolio-editorial && npm run dev` → http://localhost:5174
2. 점검 포인트:
   - 우→좌 자동 캐러셀 (카드 7장, 한 바퀴 ~140s)
   - 카드 hover → 정지 + 살짝 떠오름 / 클릭 → 상세
   - 상세에서 ←/→ 이전·다음, Esc 닫기, 좌측 sticky 메타
   - 우상단 KO/EN 토글 (전환 시 토스트)
   - 900px 이하 모바일 1열 반응형
3. 수정 사항 알려주면 그 자리에서 반영
4. **editorial 확정되면 → C 단계로 `portfolio-neon` 동일 패턴 진행**

## C 단계 (neon, 아직 시작 안 함)
- 정본 소스: `_UI/Portfolio Site neon.html`(다크 + 네온 무드, 735줄, CSS 인라인) + `_UI/portfolio-neon/{app.jsx,data.js,components/*.jsx}`
- 작업 위치: `/home/soondoree07/junghyeok-portfolio/portfolio-neon/`
- editorial과 동일한 폴더 구조·ESM 변환·데이터 교체 패턴을 그대로 따른다
- Vite 포트만 다르게 (5175 권장)
- 데이터는 editorial의 `src/data.ts`와 같은 7개 프로젝트로 채우되, neon UI 텍스트(`badge`, `status`, `manualLabel` 등 다크/네온 스타일 라벨)는 _UI 시안의 컨벤션 유지

## 결정 대기 (없음)
지금은 모두 editorial 본인 확인 대기 중.

## 변경되지 않은 항목
- 루트 `package.json`, 루트 `src/`(이전 cinematic 시도) — 사용자가 "기존 src 덮어쓰기 OK"라고 했으나 별도 프로젝트 폴더로 진행하기로 결정해 그대로 둠. 정리 여부는 사용자 결정.

## 참고 경로
- 기획서: `/home/soondoree07/junghyeok-portfolio/포트폴리오-사이트-기획서.md`
- 프로젝트 입력(콘텐츠 원본): `/home/soondoree07/junghyeok-portfolio/portfolio-input.md`
- 시안 정본: `/home/soondoree07/junghyeok-portfolio/_UI/`
- 로컬 작업 가이드: `/home/soondoree07/junghyeok-portfolio/CLAUDE.md`
