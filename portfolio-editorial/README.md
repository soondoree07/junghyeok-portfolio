# portfolio-editorial

박정혁 포트폴리오 (editorial 무드). Vite + React 18 + TypeScript, 해시 라우팅, Vercel 서버리스 함수 + Upstash Redis.

## 실행

```bash
npm install
npm run dev      # http://localhost:5174 — api/ 없이 뜨므로 학습 기록은 "로컬 개발 모드"(브라우저 저장)
npm run lint     # 앱·API·설정 타입 검사
npm run build
vercel dev       # api/ 까지 함께 띄울 때 (Vercel CLI, 환경변수 필요)
```

## 라우트

| 주소 | 화면 |
|---|---|
| `#/` | 포트폴리오 홈 (프로젝트 캐러셀·상세) |
| `#/roadmap` | 장기 로드맵 타임라인, 현재 위치 |
| `#/study` | 툴 학습 계획 개요 (툴별 카드, 전체 진행률) |
| `#/study/tool/:tool` | 툴별 상세 (`excel` `ppt` `word` `figma` `photoshop` `illustrator` `integration`) |
| `#/study/today` | 오늘 공부 (서울 기준 오늘 날짜) |
| `#/study/day/YYYY-MM-DD` | 특정 날짜 공부 |
| `#/study/lesson/:tool/:day` | 날짜별 레슨(공부 자료): 개념·따라 하기·마무리 문제 |
| `#/study/review` | 간격 반복 복습 (1·3·7일 전, 몰랐음은 다음 날 다시) |
| `#/study/log` | 달력, 누적 시간, 툴별 통계, 이전 메모 |

## 폴더 구조

```
src/
  App.tsx, components/, data.ts   포트폴리오 홈 (기존)
  hooks/useHashRoute.ts           해시 라우팅
  study/
    data/        커리큘럼(툴별 파일), 일정(schedule), 로드맵(roadmap), 툴 목록(tools)
    lib/         서울 날짜 계산, 복습 대기열, 진행률, 서버 호출, 형식 검사, 내보내기
    hooks/       저장 대기열, 오늘 날짜
    components/  체크리스트, 기록 입력, 달력, 로그인 등
    pages/       페이지 6종
    StudyContext.tsx   기록 상태·저장·인증
    lessons/     레슨 페이지·문제 채점·마크다운 표시, content/<툴>/day-NN.md + .quiz.json
scripts/excel/   엑셀 실습 파일(.xlsx) 생성 스크립트 → public/lessons/excel/
api/
  records.ts   GET 공개(메모·링크 제외) / PUT 로그인 후 날짜 단위 저장
  import.ts    POST 로그인 후 JSON 가져오기(전체 교체)
  auth/google.ts, auth/callback.ts   구글 로그인 시작·돌아온 계정 확인
  logout.ts
  _lib/        세션 쿠키, 구글 로그인, 저장소(Redis), 응답 도우미
```

커리큘럼을 고칠 때는 `src/study/data/<툴>.ts` 만 수정한다. 화면 코드는 건드리지 않는다.
데이터 파일은 순수 내용이라 200줄을 넘어도 툴 하나당 파일 하나로 둔다 (엑셀만 15일이라 두 개로 나눔).

## 레슨(공부 자료) 고치기

- 본문: `src/study/lessons/content/<툴>/day-NN.md`
  - 맨 위 frontmatter: `status`(미검수 / 검수 완료), `version`(기준 버전), `startFile`, `answerFile`, `exampleImage`, `updated`
  - `status: 미검수`면 페이지 상단에 미검수 표시가 떠요. 검수한 뒤 `검수 완료`로 바꿔요
  - 인용 블록 첫 줄을 `**체크포인트**`, `**버전 차이 주의**`, `**팁**`으로 쓰면 강조 상자가 돼요
  - `<!-- 문제 -->` 자리에 마무리 문제가 들어가요
- 문제: 같은 이름의 `.quiz.json`
  - `choice`(객관식), `numeric`(계산해서 입력, 자동 채점), `checklist`(완성 기준 자가 채점)
  - 틀린 문제는 복습 페이지의 "틀린 레슨 문제"에 모이고, 맞힐 때까지 다시 나와요
- 엑셀 실습 파일: `npm run lessons:excel`
  - 날짜별 시작·정답 파일을 `public/lessons/excel/`에 다시 만들어요
  - 문제의 계산형 정답이 스크립트 계산값과 다르면 실패해요 (데이터는 `scripts/excel/data.mjs`)
  - 새 함수(IFS, XLOOKUP 등)는 수식 문자열에 `_xlfn.` 접두사를 붙여야 엑셀에서 `#NAME?`이 나지 않아요

## 저장과 권한

- 누구나: 로드맵·계획·진행률·완료 여부·공부 시간·복습 결과를 읽을 수 있다
- 로그인한 사람만: 체크, 시간, 메모, 산출물 링크, 완료, 복습 답, 레슨 완료·문제 답, JSON 가져오기
- 메모와 산출물 링크는 로그인한 사람에게만 내려간다 (서버에서 뺀다)
- 로그인: 구글 계정으로 로그인 → 이메일이 `STUDY_ALLOWED_EMAIL` 과 같으면 30일짜리 HttpOnly 서명 쿠키 발급. 다른 계정은 로그인시키지 않고 "보기 전용"으로 안내
- 구글 로그인은 배포 사이트에서만 동작한다. 로컬 `npm run dev` 는 api/ 가 없어 "로컬 개발 모드"로 바로 편집된다
- 기록은 Redis 해시 세 개(`study:days`, `study:reviews`, `study:quiz`)에 날짜·질문 단위로 저장 → 폰과 PC에서 다른 날짜를 고쳐도 서로 덮어쓰지 않는다
- 브라우저에도 사본을 두고, 서버에 닿지 못하면 마지막 사본을 읽기 전용으로 보여준다
- 날짜 계산은 모두 Asia/Seoul. 휴식 기간(10-11~10-20)에 걸린 복습은 10-21로 미룬다

## 배포 (Vercel)

1. Vercel에서 레포를 가져오고 **Root Directory 를 `portfolio-editorial`** 로 지정 (Framework: Vite)
2. Storage(Marketplace) 에서 **Upstash Redis** 연결 → `KV_REST_API_URL`, `KV_REST_API_TOKEN` 자동 등록
3. Google Cloud Console 에서 OAuth 클라이언트 ID(웹 애플리케이션)를 만들고 리디렉션 URI `https://<사이트 주소>/api/auth/callback` 등록
4. 환경변수 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STUDY_ALLOWED_EMAIL`, `STUDY_SESSION_SECRET` 추가 (`.env.example` 참고) 후 재배포
5. 학습 페이지 맨 아래 "구글로 로그인"으로 편집 모드 진입
6. 개인 도메인: `study.junghyeok.com` (Cloudflare DNS 에 A 레코드 `study` → `76.76.21.21`, 프록시 끔). 도메인을 추가하면 그 주소의 리디렉션 URI 도 구글에 추가해야 한다
