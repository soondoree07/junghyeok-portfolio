# 진행 상황 (2026-10-01 KST 기준)

## 한 줄
엑셀 2일차를 공부하고 채점했다(본문 만점, 보스드롭 실습 과제 완료). 공부하면서 나온 레슨 문제 3가지를 고쳐 배포했다. 당겨오기는 쓰지 않아서 3일차는 **10/2**이다.

## 오늘 완료한 것
- `/공부` 엑셀 2일차 (10.01) 진행 + 채점 3회 → `바탕화면\툴 공부\엑셀 2일차 (10.01)\공부 정리.txt` 작성 (채점·막힌 부분 4개·헷갈린 개념)
- `c99bbd4` 레슨 렌더러: 번호 단계의 굵은 제목 다음 설명을 한 줄 아래로 (`renderMarkdown.ts` 전처리, 모든 레슨)
- `b32286b` 2일차 실습 과제: 언급이 없던 최소·최대수량을 BD001~BD012 표로, 완성 기준에 평균수량 합계 `41.5`
- `1b26d36` 2·3일차 계산 문제에 기준 시트 명시 (따라 하기 시트, 실습 과제 시트 아님) — Q5·Q6를 보스드롭 기준으로 풀어 오답이 났었다
- 메모리 규칙 추가: 실습 과제엔 모든 값이 언급돼야 함(범위 가정은 OK) + 확인 값 + 계산 문제 기준 시트 명시 (`feedback_study_assume_values.md`)

## 결정 대기 / 막힌 지점
- 막힌 것 없음
- 2일차 Q5·Q6는 기록에 아직 오답 — 사용자가 다시 풀기에서 4.38 / 0.92 입력하면 정리됨
- 오늘 기록(체크·메모·완료)을 사용자가 사이트에 남겼는지 미확인 (마감 시점 API `days["2026-10-01"]` 없음)
- 당겨오기는 여전히 실사용 전

## 검수 의견 (엑셀 레슨에 반영할 것)
- 사용자 지정 목록: 옵션 경로가 찾기 어렵다 → "데이터 > 정렬 > 사용자 지정 목록..." 경로를 레슨에 같이 적을지 제안했으나 답 없음
- "자주 하는 실수"에 추가 후보: 머리글 안쪽 클릭 → `[#머리글]` 들어가 SUM 0 / Scroll Lock 으로 방향키가 화면만 움직임
- 앞으로 레슨: 실습 과제 열마다 값 출처 명시, 확인 값 포함, 계산 문제는 기준 시트 명시

## 다음 액션 (우선순위)
1. 10/2 `/공부` — 엑셀 3일차 (IF/IFS/AND/OR, 참조). 공부 폴더 `엑셀 3일차 (10.02)` 만들기. 3일차 실습 과제는 값이 다 정해져 있음(확인함). 1일차 3일 복습도 10/2
2. 위 검수 의견을 2일차 레슨 "자주 하는 실수"에 반영할지 사용자에게 확인
3. 엑셀 4~15일차 레슨 작성 (새 규칙 적용)
4. (이전 목록 유지) 파워포인트 레슨, 폰 로그인 확인, junghyeok.com 포트폴리오

## 이미 끝난 것
- 마지막 push 커밋: `1b26d36 공부 레슨 문제: 계산 문제가 어느 시트 기준인지 명시`

---

# 진행 상황 (2026-09-30 KST 기준)

## 한 줄
공부 사이트에 **하루 미루기**와 **다음 공부 당겨오기**를 추가하고 배포했다. 9/30은 실제로 미뤄서 엑셀 2일차가 **10/1**로 옮겨졌고, 종료일은 12/2가 됐다.

## 오늘 완료한 것
- `/공부` 준비: 바탕화면 `툴 공부\엑셀 2일차 (10.01)\{시작,정답,결과물}` 폴더 만들고 실습 파일 복사 (처음 이름은 09.30이었고, 미룬 뒤 10.01로 바꿈)
- **하루 미루기** (`b39afa2`): 오늘 화면의 "내일로 미루기" 버튼, 미룬 날에는 안내와 "미루기 취소" 버튼. 기록 `postponed`(Redis `study:postponed`)에 저장하고 `data/index.ts` `buildSchedule`이 남은 일정을 하루씩 뒤로 민다(휴식 10/11~10/20은 유지). 그날 기록이 있으면 미룰 수 없다. 달력·상태에 "미룸" 추가
- **다음 공부 당겨오기** (`3aeadef`): 오늘 공부를 완료했고 앞에 미룬 날이 있으면 버튼이 보인다. 누르면 가장 최근에 미룬 날을 채우고, 하루 기록·문제 답·복습 답을 공부별 새 날짜로 옮긴다(`lib/pullForward.ts`, 전체 교체 저장). 전체 교체 전에 저장 대기열을 비우도록 고침(가져오기에도 적용)
- 배포된 사이트 API에 `postponed` 필드가 나오고 9/30 미룸이 저장된 것 확인

## 결정 대기 / 막힌 지점
- 막힌 것 없음
- **당겨오기는 배포된 사이트에서 아직 한 번도 눌러 보지 않았다.** 로컬에서 날짜를 10/1로 바꿔 검증만 했다. 10/1에 사용자가 2일차를 완료하고 누르면 첫 실사용이 된다 → 결과 확인 필요(9/30=2일차 완료, 10/1=3일차, 종료일 12/1)
- 3일차를 당겨온 뒤 3일차 공부 폴더(`엑셀 3일차 (10.01)`)를 만들지는 그때 정한다

## 다음 액션 (우선순위)
1. 10/1 `/공부` — 엑셀 2일차 (10.01) 진행. 여유가 있으면 완료 후 당겨오기 → 동작 확인
2. 엑셀 1·2일차 레슨 **검수 의견** 받기 → 반영 후 엑셀 4~15일차 레슨 작성
3. (이전 목록 유지) 파워포인트 레슨, 폰 로그인 확인, junghyeok.com 포트폴리오

## 이미 끝난 것
- 마지막 push 커밋: `3aeadef feat(study): 다음 공부 당겨오기`
- Redis 해시 4개: `study:days`, `study:reviews`, `study:quiz`, `study:postponed`

---

# 진행 상황 (2026-09-28 KST 기준)

## 한 줄
포트폴리오 레포가 **공부 사이트(study.junghyeok.com)** + **임시 첫 페이지(junghyeok.com)** 로 나뉘어 배포 완료. 툴 학습은 **9/29(엑셀 1일차)부터 시작**. 다음은 사용자가 1일차 레슨으로 공부하며 검수 → 그 의견 반영해 엑셀 4~15일차 레슨 작성.

## 오늘 완료한 것
- **공부 섹션** (`portfolio-editorial/src/study/`): 로드맵·학습 계획·툴 상세·오늘 공부·복습·기록 6페이지, 54일 커리큘럼(툴별 데이터 파일), 간격 반복 복습(1·3·7일, 몰랐음 다음 날, 휴식 중 복습은 10/21로)
- **날짜별 레슨** `#/study/lesson/<툴>/<일차>`: 엑셀 1~3일차 (전부 **미검수**). 마무리 문제 자동 채점, 틀린 문제는 복습 페이지 "틀린 레슨 문제"로. 실습 xlsx 는 `npm run lessons:excel` (exceljs, 정답값 대조)
- **저장·로그인**: Vercel 함수 `api/` + Upstash Redis 무료(`junghyeok-study`), **구글 로그인**(본인 계정만 편집, 나머지 보기 전용), JSON 내보내기·가져오기
- **배포**: GitHub 레포 보관 해제, Vercel `junghyeok-portfolio`(Root `portfolio-editorial`) → **https://study.junghyeok.com**, 첫 화면 = 오늘 공부, 옛 포트폴리오 홈은 `#/work`
- **junghyeok.com·www**: 임시 첫 페이지 `home-landing/index.html` (Vercel `junghyeok-home`) — 이름·소개·"공부 기록 보기"
- **디자인**: 시안 8개 비교 → **글래스 테마** 적용 (`src/study/theme/glass-*.css`, 공부 화면에서만 켜짐). 폰 전용 디자인은 보류 결정
- **일정**: 하루 미룸 → 9/29 시작, 12/1 종료 (휴식 10/11~10/20 유지)
- KO/EN 언어 전환 버튼 숨김 (`Topbar.tsx` 의 `SHOW_LANG_TOGGLE`)

## 결정 대기 / 막힌 지점
- 막힌 것 없음
- 레슨 내용 중 **실제 엑셀 화면과 대조가 필요한 메뉴 이름**: 1일차 Alt→H→O→I, 2일차 정렬 창 "내림차순"·필터 중 상태 표시줄 문구·"자동 고침 옵션"·테이블 디자인 탭 위치, 3일차 수식 > 수식 분석 > 수식 표시·Ctrl+` → 사용자 검수 의견으로 확정

## 다음 액션 (우선순위)
1. 사용자가 9/29 엑셀 1일차 레슨으로 공부 → **검수 의견 받기** (설명 깊이·문제 난이도·틀린 메뉴명)
2. 의견 반영 후 **엑셀 4~15일차 레슨 작성** (1~3일차와 같은 구조, 실습 xlsx 는 `scripts/excel/` 에 날짜 추가) → 검수된 레슨은 frontmatter `status: 검수 완료`
3. 사용자가 "다음 툴 진행"이라고 하면 **파워포인트 레슨** (디자인 툴은 완성 예시 이미지 SVG/HTML)
4. 폰에서도 구글 로그인·체크·메모 저장 확인 (사용자)
5. (나중) junghyeok.com 에 완전한 포트폴리오 → study 로 연결 / (보류) neon 무드

## 이미 끝난 환경 (다시 할 필요 없음)
- Vercel 두 프로젝트 모두 GitHub 연결 + **자기 폴더 변경 시에만 빌드** (Ignored Build Step)
- Vercel 환경변수(Production): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STUDY_ALLOWED_EMAIL`, `STUDY_SESSION_SECRET`, `KV_REST_API_*`
- Google OAuth: Google Cloud 프로젝트 `junghyeok-portfolio` (대시보드용 `junghyeok1` 은 건드리지 않음), 리디렉션 URI 에 vercel.app·study 도메인 둘 다 등록
- Cloudflare DNS: `study`, `@`, `www` → A 76.76.21.21 (DNS only)
- 마지막 push 커밋: `97b6246 chore(topbar): 언어 전환(KO/EN) 버튼 숨김`

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
