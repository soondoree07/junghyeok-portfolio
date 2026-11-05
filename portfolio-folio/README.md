# portfolio-folio — 3D 책장 포트폴리오

검은 화면에 큰 이름이 있고, 그 아래 프로젝트 책 줄이 사선으로 놓인 한 화면짜리 포트폴리오입니다.
책 한 권이 프로젝트 하나이고, 마우스 근처의 책이 파도처럼 위로 올라오며, 책을 누르면 화면 전체를 덮는 상세 페이지(소개 · 캡처 · 한 일 · 배운 것)가 열립니다.
메뉴 Projects 를 누르면 화면이 잠깐 어두워진 뒤 프로젝트 책이 한 줄에 4권(휴대폰 2권)씩 정렬되고 아래로 스크롤됩니다. Projects 를 다시 누르거나 로고 · Esc 를 누르면 책장으로 돌아갑니다(책장은 아래에서 한 권씩 솟아오름).
책장 화면은 아래로 스크롤하면 책 밑동까지 보이고, 맨 아래에 연락처(이름 · 전화 · 이메일 · GitHub · 사이트)가 있습니다.
(motionsites.ai 의 "Folio" 프롬프트 구조를 바탕으로, 표지 이미지는 쓰지 않고 캔버스로 직접 그립니다.)

처음 접속하면(세션마다 한 번) 연필 스케치가 파란 청사진으로 바뀌는 인트로가 나온 뒤 사이트가 열립니다. 화면을 클릭하면 건너뜁니다. 다시 보려면 로고를 누르거나 주소 뒤에 `?intro` 를 붙입니다. 윈도우 애니메이션 효과 끄기(움직임 줄이기)는 따르지 않습니다(사용자 결정).
스타일 출처: `~/animation_styles/애니메이션_스타일_카드.md` — Part 1 · 10. Pencil to Blueprint

빌드 없는 정적 사이트입니다. **https://junghyeok.com 메인 화면** — Vercel 프로젝트 `junghyeok-home`(Root Directory = `portfolio-folio`), GitHub 에 push 하면 자동 배포. `vercel.json` 은 고친 뒤 예전 화면이 남지 않게 매번 새로 확인하게 하는 설정, `.vercelignore` 는 미리보기 서버를 배포에서 뺀다. Three.js r160 은 jsDelivr 의 import map 으로 불러옵니다.

```
python3 dev-server.py   # 이 폴더에서 실행 → http://localhost:4321 (브라우저가 예전 파일을 저장하지 않게 함)
```

## 파일

| 파일 | 하는 일 |
|---|---|
| `index.html` | 메뉴 · 큰 이름 · 키워드 · 캔버스 · 상세 패널 틀 |
| `styles.css` | 레이아웃, 메뉴, 연락처, 휴대폰(≤760px), 움직임 줄이기 설정 |
| `detail.css` | 책을 누르면 열리는 전체 화면 상세 페이지 |
| `images/` | 프로젝트 캡처 (`images/README.md` 참고) |
| `favicon.png` · `apple-touch-icon.png` | 사이트 아이콘 — 검정 바탕에 큰 이름과 같은 세리프 J (32px · 180px) |
| `js/projects-work.js` | **프로젝트 내용 (회사 · 공모전 · 개인)** — 책장 앞쪽. 글 · 캡처 설명은 여기서 고칩니다 |
| `js/projects-school.js` | **프로젝트 내용 (학교)** — 책장 뒤쪽. 여기 있는 책은 표지에 SCHOOL, 상세에 '학교 프로젝트' 표시가 붙습니다 |
| `js/projects.js` | 두 파일을 합쳐 `PROJECTS` 로 내보냄 (개인 → 학교 순) |
| `js/project-retros.js` | **돌아보기 글** — 프로젝트 id 별 아쉬운 점 · 배운 점 · 다음엔. 없으면 상세 화면에 한 줄 요약(insight)만 나옴 |
| `js/book-model.js` | 양장본 책 모양 — 앞 · 뒤 표지 판지(속지보다 살짝 큼) · 둥근 책등 · 안쪽으로 들어간 속지 |
| `js/intro-entry.js` | 인트로 시작점 — 3D 를 기다리지 않고 가장 먼저 인트로를 시작(그 전엔 index.html 의 종이색 가림막) |
| `js/blueprint-intro.js` | 첫 접속 청사진 인트로 본체 — 스케치 → 약 1.7초 잉크 번짐(흰 선이 튕기듯 펴짐) → 치수 · 라벨 → 1.5초 멈춤 → 사이트 |
| `js/blueprint-timing.js` | 인트로 시간표와 공용 움직임 도구 |
| `js/blueprint-annotations.js` | 인트로 치수(17 PROJECTS · 2025 – 2026) · 라벨(PARK JUNGHYEOK PORTFOLIO) |
| `js/blueprint-svg.js` | 인트로 SVG 만들기 — 종이 · 격자 · 결, 잉크 마스크, 스케치 · 도면 층 |
| `js/blueprint-drawing.js` | 인트로 그림 데이터 — 위에서 본 게임 컨트롤러(몸통 곡선 · 십자키 · 버튼 · 스틱), 치수 · 라벨 |
| `js/blueprint-sketch.js` | 인트로 연필 스케치 — 그림 데이터를 손 선(겹침 · 넘침 · 흔들림)으로 |
| `blueprint.css` | 인트로 화면 · 글꼴(Barlow Semi Condensed) · 시작 전 가림막 |
| `js/covers.js` | 표지 · 종이 단면을 캔버스로 그리기 (`MOTIFS` = 표지 도형) |
| `js/scene.js` | 렌더러 · 조명 · 카메라 · 책 줄 배치 (`ROW_SPAN_X` · `ROW_SPAN_Z` = 책 줄 전체 길이, 권수로 나눠 간격 자동) |
| `js/motion.js` | 책마다 목표 높이를 스프링으로 따라감 (K 13, C 6.9, 프레임당 4번) · 펼치기: 가리킨 책이 앞으로 |
| `js/wave.js` | 책장 파도 — 마우스 올린 책 100%, 양옆 45%, 그 옆 15% 위로만. 파도 중심은 초당 최대 4권 속도로 마우스를 따라가 지나간 길의 책이 차례로 출렁임. 들어오고 나갈 때 파도 세기가 서서히 커지고 잦아듦 |
| `js/page.js` | 책장 화면 스크롤 — 내리면 카메라도 같이 내려가 책 밑동과 맨 아래 연락처가 보임 |
| `js/layout.js` | 펼치기 격자 자리 계산, 화면이 어두워진 뒤 격자 책이 한 권씩 나타나기 · 책장 책이 한 권씩 솟기 |
| `js/view.js` | 책장 / 펼치기 전환 — Projects 메뉴 상태, `grid-mode` · 잠깐 어둡게(`switching`) 클래스, 스크롤 영역 높이 |
| `js/panel.js` | 전체 화면 상세 · 소개 페이지, 캡처 자리, 이전/다음 프로젝트 |
| `js/intro.js` | 첫 등장 애니메이션 |
| `js/main.js` | 시작점 — 위 모듈을 묶고 클릭 · 매 프레임 갱신 |

## 프로젝트 추가 · 순서 바꾸기
`js/projects-work.js` → `js/projects-school.js` 의 배열 순서가 책 순서(앞 → 뒤)입니다.
책은 프로젝트 수만큼만 놓입니다(표지 없는 장식 책 없음). 권수가 바뀌어도 책 간격은 자동으로 맞춰집니다.
