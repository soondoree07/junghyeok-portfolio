// 프로젝트 데이터 — 책 한 권 = 프로젝트 하나. 내용은 portfolio-input.md 기준.
// color: 표지 바탕 / ink: 표지 글자 / motif: covers.js 의 도형 이름

export const PROJECTS = [
  {
    id: 'encore', title: 'ENCORE', sub: 'Virtual Legend Concert', year: '2026 · 진행 중',
    color: '#14161f', ink: '#f3e9d2', accent: '#d9b46a', motif: 'rings',
    oneLine: 'K-pop 팬덤과 한국 클래식 아티스트 팬을 잇는 AI·VR 가상 콘서트 플랫폼이에요.',
    role: '컨셉 디자인 · 플랫폼 구조 · 비주얼 디렉션',
    points: [
      '스마트 이머시브 애플리케이션 수업 프로젝트',
      '레퍼런스 분석: Fortnite Travis Scott, BLACKPINK VR, HYBE Face Pass',
      '관람 → 참여 → 공유로 이어지는 몰입형 공연 경험 흐름 설계',
    ],
    insight: '공연을 "보는 것"에서 "들어가는 것"으로 바꾸는 구조는 게임의 라이브 이벤트 설계와 같아요.',
  },
  {
    id: 'zellopang', title: 'Zellopang', sub: 'Reward Mobile App · WAVLE', year: '2026 · 출시 준비',
    color: '#2fbf6a', ink: '#ffffff', accent: '#fff2a8', motif: 'coins',
    oneLine: '광고 시청과 미션으로 캐시를 모아 상품권·계좌로 바꾸는 10~20대용 리워드 앱이에요.',
    role: '기획 50% (회사 공동) · 디자인 100% (단독)',
    points: [
      'WAVLE 와의 두 번째 협업 — 돈이돼지 분석에서 신규 앱 제작으로',
      '출석 · 친구 추천 · 광고 시청 · 미션 · 캐시 출금 기능 설계',
      '밝은 그린 + 화이트 카드 + 코인 아이콘으로 보상감과 친근함을 함께 전달',
    ],
    insight: '분석가에서 메이커로 — 같은 도메인에서 해석한 루프를 직접 만들어 봤어요.',
  },
  {
    id: 'pokenova', title: 'pokenova', sub: 'Dex & Quiz Platform', year: '2026',
    color: '#c8312b', ink: '#fff7ec', accent: '#141414', motif: 'orbit',
    oneLine: '포켓몬 챔피언스 데이터를 중심으로 한 도감 + 퀴즈 플랫폼이에요. 1인 기획·개발·데이터 관리.',
    role: '기획 · 개발 · 데이터 관리 (1인)',
    points: [
      '퀴즈 5종, 오늘의 포켓몬 뽑기, 도감 3종',
      '포켓몬 1,285종 · learnset 11,542개 항목을 직접 관리',
      '퀴즈 → 리더보드 → 재방문 루프 설계 (Firebase · GA4)',
    ],
    insight: '메타 데이터 구조와 유저 행동 루프를 직접 짠 경험이 게임 시스템 기획과 바로 이어져요.',
    link: 'https://pokenova.pochams.com',
  },
  {
    id: 'ohouse', title: 'Living Alone', sub: 'UX Research · Ohouse', year: '2026 · 진행 중',
    color: '#efe6d6', ink: '#1d1a16', accent: '#3a7bd5', motif: 'window',
    oneLine: '1인 가구 트렌드를 바탕으로 오늘의집 서비스를 다시 설계하는 리서치 프로젝트예요.',
    role: '유저 리서치 · 인사이트 정리',
    points: [
      '심층 인터뷰 5명 이상, 1인당 1시간',
      '녹취록 · 프로필 시트 · 리서치 기록지 작성',
      '인터뷰 근거로 리디자인 방향 도출',
    ],
    insight: '"왜"를 끝까지 묻는 인터뷰가 기능 아이디어보다 먼저라는 걸 배웠어요.',
  },
  {
    id: 'pochams', title: 'pochams', sub: 'Team Builder & Community', year: '2026',
    color: '#1b2f5e', ink: '#f2f0ea', accent: '#f5c84b', motif: 'grid',
    oneLine: '포켓몬 챔피언스 팀 빌딩 도구와 샘플 공유 커뮤니티예요. pokenova 에 API 를 제공해요.',
    role: '시스템 설계 · 풀스택 개발 · DB 스키마 설계',
    points: [
      'pokenova(데이터·UI) ↔ pochams(API·커뮤니티) 서비스 분리 구조',
      '유저 계정 · 좋아요 · 팀 빌딩 · 샘플 공유',
      'Next.js · NextAuth · Neon PostgreSQL · Vercel',
    ],
    insight: '두 서비스가 같은 데이터를 나눠 쓰도록 경계를 정하는 일이 제일 중요했어요.',
    link: 'https://pochams.com',
  },
  {
    id: 'lopa', title: 'LOPA', sub: 'Path of Experience Map', year: '2025',
    color: '#e8763a', ink: '#1a120c', accent: '#fff4e6', motif: 'path',
    oneLine: '장소(POI)가 아니라 로컬이 검증한 경로(POE)를 중심에 둔 지도 커뮤니티 앱 기획이에요.',
    role: '문제 정의 · 서비스 구조 · UX 흐름 설계',
    points: [
      '문제: SNS 추천의 정보 비대칭과 바이럴 편향',
      '설문 n=54, 페르소나 · 고객 여정 지도',
      '하루 경로 · 경로 시각화 · 로컬 검증 커뮤니티',
    ],
    insight: '점이 아니라 선을 추천하면, 사용자의 하루 전체를 설계하게 돼요.',
  },
  {
    id: 'donidwaeji', title: 'Reward Loop', sub: '돈이돼지 Analysis · WAVLE', year: '2025',
    color: '#f2b8c6', ink: '#2a1418', accent: '#2a1418', motif: 'loop',
    oneLine: '리워드 앱테크 서비스의 진입 → 행동 → 보상 → 재방문 흐름을 분석한 회사 의뢰 프로젝트예요.',
    role: 'UX 흐름 분석 · 유지 구조 분석',
    points: [
      '회사 WAVLE 의 요청으로 진행',
      '보상 금액보다 "다시 들어오게 되는 흐름"이 핵심이라는 결론',
      '라이브 서비스 게임의 일일 콘텐츠 구조와 비교',
    ],
    insight: '리텐션은 보상의 크기가 아니라 돌아올 이유의 리듬에서 나와요.',
  },
  {
    id: 'highway', title: 'Smart Highway', sub: 'Night Accident Prevention', year: '2025',
    color: '#0d1220', ink: '#e9eef8', accent: '#f6d33c', motif: 'lanes',
    oneLine: '운전자 상태 · 도로 환경 · V2I 인프라를 한 흐름으로 묶은 야간 사고 예방 시스템 기획이에요.',
    role: '시스템 흐름 설계 · 리서치',
    points: [
      '설문 n=61, 운전자 인터뷰',
      '센싱 → 판단 → 경고 → 제어 흐름',
      '졸음 감지, 기상·노면 연계 가변 제한속도, 시인성 강화',
    ],
    insight: '상태 감지 → 피드백 → 행동 제어 구조는 게임 시스템 설계와 맞닿아 있어요.',
  },
  {
    id: 'jbae', title: 'J.Bae', sub: 'Artist Portfolio · Client', year: '2026',
    color: '#f4f1ea', ink: '#1b1b1b', accent: '#b4462f', motif: 'frames',
    oneLine: '화가 배정혜의 2007~2026년 작품 134점을 연도별로 정리한 포트폴리오 사이트예요.',
    role: '요구 분석 · 정보 구조 · 데이터 스키마 · 구현 · 운영 가이드',
    points: [
      'data.json 하나로 작가 정보와 작품 정보를 관리하는 무빌드 구조',
      '작품 실제 크기(cm)를 화면 비례로 바꾸는 레이아웃',
      '키보드로 넘기는 라이트박스, 닫으면 보던 위치로 복귀',
    ],
    insight: '클라이언트가 혼자서도 고칠 수 있게 만드는 것까지가 기획이었어요.',
    link: 'https://jbae.art',
  },
  {
    id: 'adopt', title: 'Second Home', sub: 'Dog Adoption Platform', year: '2025',
    color: '#7a9a6c', ink: '#fbf8f0', accent: '#2c3a26', motif: 'arch',
    oneLine: '보호소 중심의 신뢰도 낮은 유기견 정보 구조를 다시 설계한 창업 캡스톤 프로젝트예요.',
    role: '기획 30% · 디자인 100% (Figma)',
    points: [
      '입양 탐색 → 결정 → 소통 흐름 설계',
      '영어 기반 해외 입양 가능성 포함',
      '보호소 중심 서비스와 다른 신뢰 중심 모델 제안',
    ],
    insight: '신뢰는 정보의 양보다 정보가 놓인 순서에서 생겨요.',
  },
  {
    id: 'dashboard', title: 'Remote Desk', sub: 'Claude Code Dashboard', year: '2026',
    color: '#101010', ink: '#d7ffd9', accent: '#3ddc84', motif: 'terminal',
    oneLine: '밖에서 노트북으로 집 데스크톱에 접속해 AI 개발을 이어 가는 브라우저 원격 터미널이에요.',
    role: '기획 · 개발 · 인프라 구성 (1인)',
    points: [
      'Next.js · xterm.js · WebSocket · node-pty',
      'WSL · Cloudflare Tunnel · PM2',
      '여러 프로젝트를 탭으로 오가며 작업 기록을 남기는 구조',
    ],
    insight: '내가 매일 쓰는 도구를 직접 만들면, 불편함이 곧 기획서가 돼요.',
  },
];

// 책 줄을 채우는 장식용 책 (누를 수 없음) — 천 장정 색
export const FILLER_COLORS = [
  '#2c4f63', '#7f7263', '#c9b99a', '#3d2b24', '#5b6b4a', '#a33a2c', '#d8cfbd',
  '#24304a', '#8a6a3f', '#4a4a52', '#b8a58a', '#1e3b33', '#6b1d2a', '#e4dccb', '#3a3f2c',
];
