// 학교 수업 · 캡스톤 프로젝트 — 책장 뒤쪽. 여기 있으면 표지와 상세 화면에 '학교 프로젝트' 표시가 붙는다.
// color: 표지 바탕 / ink: 표지 글자 / accent: 표지 강조색 / motif: covers.js 의 도형 이름
// 캡처: images/<id>/ 에 넣고 shots 에 파일 이름과 설명을 적는다(panel.js).

export const SCHOOL_PROJECTS = [
  {
    id: 'encore', title: 'ENCORE', sub: 'Virtual Legend Concert', year: '2026 · 진행 중',
    color: '#14161f', ink: '#f3e9d2', accent: '#d9b46a', motif: 'rings',
    oneLine: 'K-pop 팬덤과 한국 클래식 아티스트 팬을 잇는 AI·VR 가상 콘서트 플랫폼이에요.',
    role: '컨셉 디자인 · 플랫폼 구조 · 비주얼 디렉션',
    points: ['스마트 이머시브 애플리케이션 수업 프로젝트', '레퍼런스 분석: Fortnite Travis Scott, BLACKPINK VR, HYBE Face Pass', '관람 → 참여 → 공유로 이어지는 몰입형 공연 경험 흐름 설계'],
    insight: '공연을 "보는 것"에서 "들어가는 것"으로 바꾸는 구조는 게임의 라이브 이벤트 설계와 같아요.',
    shots: [
      { file: '1.jpg', caption: '다크 무드 — 홈 · 공연 상세 · 리뷰' },
      { file: '2.png', caption: '다크 무드 — 예매 · 구매 · XR 기기 연결' },
      { file: '3.png', caption: '같은 화면을 파스텔 무드로 — 홈 · 공연 상세 · XR 기기 연결' },
    ],
  },
  {
    id: 'ohouse', title: 'Living Alone', sub: 'UX Research · Ohouse', year: '2026 · 진행 중',
    color: '#efe6d6', ink: '#1d1a16', accent: '#3a7bd5', motif: 'window',
    oneLine: '1인 가구 트렌드를 바탕으로 오늘의집 서비스를 다시 설계하는 리서치 프로젝트예요.',
    role: '유저 리서치 · 인사이트 정리',
    points: ['1인 가구 5명 심층 인터뷰 — 1명당 1시간 이상 진행', '녹취록 · 프로필 시트 · 리서치 기록지 작성', '인터뷰 근거로 리디자인 방향 도출'],
    insight: '"왜"를 끝까지 묻는 인터뷰가 기능 아이디어보다 먼저라는 걸 배웠어요.',
    shots: [
      { file: '1.png', caption: '인터뷰 참여자 — 1인 가구 5명을 1명당 1시간 이상 인터뷰했어요' },
      { file: '2.png', caption: '핵심 인사이트 13개 — 인터뷰에서 나온 말을 묶어 정리' },
      { file: '3.jpg', caption: '프로토타입 — 내 방에 가구 배치 · 8평 맞춤 추천 · 1인 가구 단품' },
    ],
  },
  {
    id: 'lopa', title: 'LOPA', sub: 'Path of Experience Map', year: '2025',
    color: '#e8763a', ink: '#1a120c', accent: '#fff4e6', motif: 'path',
    oneLine: '장소(POI)가 아니라 로컬이 검증한 경로(POE)를 중심에 둔 지도 커뮤니티 앱 기획이에요.',
    role: '문제 정의 · 서비스 구조 · UX 흐름 설계',
    points: ['문제: SNS 추천의 정보 비대칭과 바이럴 편향', '설문 n=54, 페르소나 · 고객 여정 지도', '하루 경로 · 경로 시각화 · 로컬 검증 커뮤니티'],
    insight: '점이 아니라 선을 추천하면, 사용자의 하루 전체를 설계하게 돼요.',
    shots: [
      { file: '1.png', caption: '메인 지도 · 그룹 경로 · 마이 패스 — 점이 아니라 선으로 추천해요' },
      { file: '2.png', caption: '시작 화면 · 프리미엄 — 광고 제거 · AI 경로 추천 · 해외 이용을 묶은 구독' },
    ],
  },
  {
    id: 'highway', title: 'Smart Highway', sub: 'Night Accident Prevention', year: '2025',
    color: '#0d1220', ink: '#e9eef8', accent: '#f6d33c', motif: 'lanes',
    oneLine: '운전자 상태 · 도로 환경 · V2I 인프라를 한 흐름으로 묶은 야간 사고 예방 시스템 기획이에요.',
    role: '시스템 흐름 설계 · 리서치',
    points: ['설문 n=61, 운전자 인터뷰', '센싱 → 판단 → 경고 → 제어 흐름', '졸음 감지, 기상·노면 연계 가변 제한속도, 시인성 강화'],
    insight: '상태 감지 → 피드백 → 행동 제어 구조는 게임 시스템 설계와 맞닿아 있어요.',
    shots: [
      { file: '1.jpg', caption: '전체 구상도 — 중앙 관제 · 도로 인프라 · 차량 안 시스템' },
      { file: '2.png', caption: '정보 구조(IA) — 세 시스템이 어떤 기능으로 나뉘는지' },
      { file: '3.png', caption: '웨어러블 UI — 심박이 떨어지면 졸음 경고로 바뀌어요' },
    ],
  },
  {
    id: 'hopetail', title: 'Hopetail', sub: '호프테일 · Dog Adoption Platform', year: '2025',
    color: '#7a9a6c', ink: '#fbf8f0', accent: '#2c3a26', motif: 'arch',
    oneLine: '보호소 중심의 신뢰도 낮은 유기견 정보 구조를 다시 설계한 창업 캡스톤 프로젝트예요.',
    role: '기획 30% · 디자인 100% (Figma)',
    points: ['입양 탐색 → 결정 → 소통 흐름 설계', '한국어 · 영어 두 언어 지원 — 해외 입양까지 고려', 'AI 를 전혀 쓰지 않고 직접 기획 · 디자인한 사이트'],
    insight: '신뢰는 정보의 양보다 정보가 놓인 순서에서 생겨요.',
    shots: [
      { file: '1.png', caption: '입양하기 — 보호 중인 유기견을 카드로 탐색' },
      { file: '2.png', caption: '입양 상세 — 정보를 보고 입양을 결정' },
      { file: '3.png', caption: '채팅 — 보호자와 바로 이야기해요' },
    ],
  },
  {
    id: 'capstone', title: 'One App, Endless Play', sub: 'Capstone · 4 Mobile Games', year: '2025 – 2026',
    color: '#6b4cf6', ink: '#ffffff', accent: '#ffd84a', motif: 'play',
    oneLine: '장르가 다른 모바일 게임 네 개를 한 앱 안에서 자유롭게 오가며 즐기게 묶은 캡스톤 프로젝트예요.',
    role: 'Tap Blast 기획 30% · 디자인 100% / Slime Dash 3D 디자인 50% / Chrono Cat 기획 50% · 디자인 100%',
    points: ['러닝 액션 · 물리 퍼즐 · 탑다운 아케이드 · 웨이브 슈팅, 네 장르를 한 진입점으로 연결', '"Play. Switch. Repeat." — 가볍게 시작하고, 바꿔서 즐기고, 다시 돌아오는 구조', 'Unity 6 · Android, 5인 팀 HyHyper'],
    insight: '장르가 달라도 "짧게 시작해서 다시 돌아오게" 만드는 루프는 같았어요.',
    shots: [
      { file: '1.jpg', caption: 'Tap Blast: Drop & Merge — 물리 퍼즐 · 기획 30% · 디자인 100%' },
      { file: '2.jpg', caption: 'Slime Dash 3D — 탑다운 아케이드 · 디자인 50%' },
      { file: '3.jpg', caption: 'Chrono Cat — 웨이브 생존 슈팅 · 기획 50% · 디자인 100%' },
    ],
  },
];
