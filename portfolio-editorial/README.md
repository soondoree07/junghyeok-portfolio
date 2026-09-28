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
api/
  records.ts   GET 공개(메모·링크 제외) / PUT 로그인 후 날짜 단위 저장
  import.ts    POST 로그인 후 JSON 가져오기(전체 교체)
  login.ts, logout.ts
  _lib/        인증(서명 쿠키), 저장소(Redis), 응답 도우미
```

커리큘럼을 고칠 때는 `src/study/data/<툴>.ts` 만 수정한다. 화면 코드는 건드리지 않는다.
데이터 파일은 순수 내용이라 200줄을 넘어도 툴 하나당 파일 하나로 둔다 (엑셀만 15일이라 두 개로 나눔).

## 저장과 권한

- 누구나: 로드맵·계획·진행률·완료 여부·공부 시간·복습 결과를 읽을 수 있다
- 로그인한 사람만: 체크, 시간, 메모, 산출물 링크, 완료, 복습 답, JSON 가져오기
- 메모와 산출물 링크는 로그인한 사람에게만 내려간다 (서버에서 뺀다)
- 로그인: 서버가 `STUDY_PASSWORD` 와 비교 → 30일짜리 HttpOnly 서명 쿠키. 15분 안에 10번 틀리면 15분 잠금 (IP 구분 없음)
- 기록은 Redis 해시 두 개(`study:days`, `study:reviews`)에 날짜·질문 단위로 저장 → 폰과 PC에서 다른 날짜를 고쳐도 서로 덮어쓰지 않는다
- 브라우저에도 사본을 두고, 서버에 닿지 못하면 마지막 사본을 읽기 전용으로 보여준다
- 날짜 계산은 모두 Asia/Seoul. 휴식 기간(10-11~10-20)에 걸린 복습은 10-21로 미룬다

## 배포 (Vercel)

1. Vercel에서 레포를 가져오고 **Root Directory 를 `portfolio-editorial`** 로 지정 (Framework: Vite)
2. Storage(Marketplace) 에서 **Upstash Redis** 연결 → `KV_REST_API_URL`, `KV_REST_API_TOKEN` 자동 등록
3. 환경변수 `STUDY_PASSWORD`, `STUDY_SESSION_SECRET` 추가 (`.env.example` 참고)
4. 배포 후 `#/study` 아래 "로그인"으로 편집 모드 진입
