import type { PortfolioData } from './types';

export const DATA_EDITORIAL: PortfolioData = {
  ui: {
    issue:    { ko: 'Selected Works · 2025–26', en: 'Selected Works · 2025–26' },
    location: { ko: 'SEOUL · KST +09:00',        en: 'SEOUL · KST +09:00' },
    booking:  { ko: 'OPEN TO ROLES · 2026',      en: 'OPEN TO ROLES · 2026' },
    nameA:    { ko: 'Park.',                     en: 'Park.' },
    nameB:    { ko: 'Jung—hyeok',                en: 'Jung—hyeok' },

    langKo:   { ko: 'KO',                        en: 'KO' },
    langEn:   { ko: 'EN',                        en: 'EN' },

    role: {
      ko: '지금은 시스템과 UX 흐름을 중심으로 기획하지만, 아이디어를 실제로 동작하는 제품까지 직접 끌고 갑니다. 기획을 중심에 두고, UX/UI 디자인과 개발도 직접 해내는 사람.',
      en: 'I plan around systems and UX flow, then carry ideas through to a working product. A planner first — who also designs the UX/UI and writes the code.',
    },
    heroMeta: {
      ko: ['HANYANG UNIV · ICT-DT', 'PLAN · DESIGN · BUILD', 'BASED IN SEOUL'],
      en: ['HANYANG UNIV · ICT-DT', 'PLAN · DESIGN · BUILD', 'BASED IN SEOUL'],
    },

    sectionLabel: { ko: 'Selected Work',             en: 'Selected Work' },
    sectionMeta:  { ko: 'No. 01 — 07 · 2025 → 2026', en: 'No. 01 — 07 · 2025 → 2026' },
    autoLabel:    { ko: 'AUTO',                      en: 'AUTO' },
    pausedLabel:  { ko: 'PAUSED',                    en: 'PAUSED' },
    nudge: {
      ko: '카드 위에 마우스를 올리면 흐름이 멈춥니다. 클릭하면 상세로.',
      en: 'Hover a card to pause. Click to open.',
    },
    nudgeReduced: {
      ko: '← → 화살표로 직접 넘기세요.',
      en: 'Use the arrows below to step through.',
    },

    back:   { ko: '목록으로',    en: 'Back to index' },
    visit:  { ko: '사이트 방문', en: 'Visit site' },
    prev:   { ko: 'Prev',        en: 'Prev' },
    next:   { ko: 'Next',        en: 'Next' },
    arrowL: { ko: '←',           en: '←' },
    arrowR: { ko: '→',           en: '→' },

    detailYear:    { ko: 'YEAR',                en: 'YEAR' },
    detailRole:    { ko: 'ROLE',                en: 'ROLE' },
    detailClient:  { ko: 'CLIENT',              en: 'CLIENT' },
    detailDid:     { ko: 'What I did · 한 일',  en: 'What I did' },
    detailOutcome: { ko: 'Outcome · 결과',      en: 'Outcome' },
    detailTags:    { ko: 'Tags',                en: 'Tags' },
    keyboardHint: {
      ko: '← → 키로 이동 · Esc로 닫기',
      en: '← → to navigate · Esc to close',
    },

    footerL: {
      ko: '© Park Junghyeok · 2026',
      en: '© Park Junghyeok · 2026',
    },
    footerC: {
      ko: 'Set in Inter + Noto Sans KR · Designed in Seoul',
      en: 'Set in Inter + Noto Sans KR · Designed in Seoul',
    },
    footerEmail: { ko: 'soondoree07@gmail.com', en: 'soondoree07@gmail.com' },
    footerGit:   { ko: 'github.com/soondoree07', en: 'github.com/soondoree07' },

    toastLang: { ko: '언어 변경 · KOR', en: 'Language · EN' },
  },

  projects: [
    {
      id: 'zellopang',
      num: '01',
      y: '2026',
      category: 'company',
      live: true,
      thumbBg: '#2E5D3A',
      thumbLight: true,
      thumbCorner: '#D6402E',
      thumbLabel: 'OFFERWALL · 2026',
      categoryLabel: { ko: 'Company · WAVLE', en: 'Company · WAVLE' },
      client:        { ko: 'WAVLE', en: 'WAVLE' },
      title:         { ko: '젤로팡', en: 'Zellopang' },
      tagline: {
        ko: '10–20대 학생을 위한 보상형 오퍼월 앱 — “커피값이라도 벌 수 있도록.”',
        en: 'A reward-based offerwall app for teens & 20s — “earn at least your coffee money.”',
      },
      role:    { ko: '기획 50% (공동) · 디자인 100% (단독)', en: 'Planning 50% (joint) · Design 100% (solo)' },
      roleSub: { ko: '회사 협업 · 출시 전',                   en: 'Industry · Pre-launch' },
      tags:    { ko: ['Mobile', 'Reward', 'Design'], en: ['Mobile', 'Reward', 'Design'] },
      did: {
        ko: [
          '출석·미션·광고 시청·캐시 출금까지 5개 핵심 흐름의 IA·플로우 정의',
          '단독 디자인 — 그린 메인 + 화이트 카드 + 코인·지폐 아이콘으로 보상감과 친근함을 동시에 전달',
          '돈이돼지 분석에서 얻은 리텐션 루프 인사이트를 진입→행동→보상→재방문 단계에 직접 적용',
        ],
        en: [
          'Defined IA and flow for 5 core surfaces — daily check-in, missions, ads, cash-out.',
          'Sole designer — bright green palette + white cards + coin/cash icons to mix reward feel with approachability.',
          'Carried retention-loop insights from the prior 돈이돼지 analysis into the entry → action → reward → return cycle.',
        ],
      },
      outcome: {
        ko: [['1인', '디자인 단독'], ['5', '핵심 화면 IA·플로우'], ['v0', 'Pre-launch']],
        en: [['SOLO', 'ALL DESIGN'], ['5', 'CORE FLOWS'], ['v0', 'PRE-LAUNCH']],
      },
    },

    {
      id: 'pochams',
      num: '02',
      y: '2026',
      category: 'personal',
      live: true,
      thumbBg: '#15171A',
      thumbLight: true,
      thumbCorner: '#D6402E',
      thumbLabel: 'TEAM · API',
      categoryLabel: { ko: 'Personal', en: 'Personal' },
      client:        { ko: 'Personal', en: 'Personal' },
      title:         { ko: '포챔스', en: 'pochams' },
      tagline: {
        ko: '포켓몬 챔피언스 팀빌딩·커뮤니티. pokenova에 API를 제공하는 마이크로서비스 분리 구조.',
        en: 'A team-builder & community for Pokémon Champions — also the API source for pokenova in a microservice split.',
      },
      role:    { ko: '시스템 설계 · 풀스택 · DB 스키마', en: 'System Design · Fullstack · DB Schema' },
      roleSub: { ko: 'Next.js 16 · NextAuth · Neon',     en: 'Next.js 16 · NextAuth · Neon' },
      tags:    { ko: ['Web', 'Fullstack', 'Personal'],   en: ['Web', 'Fullstack', 'Personal'] },
      did: {
        ko: [
          'pochams(데이터·API·커뮤니티) ↔ pokenova(UI·소비자) 마이크로서비스 분리 구조 설계',
          'Next.js 16 App Router + NextAuth + Neon PostgreSQL로 풀스택 단독 구축',
          '유저 계정·좋아요·팀빌딩·샘플 공유 4개 도메인 DB 스키마 정의',
        ],
        en: [
          'Architected the pochams(API + community) ↔ pokenova(UI) microservice split.',
          'Built solo on Next.js 16 App Router + NextAuth + Neon PostgreSQL.',
          'Designed the schema for the four domains — accounts, likes, team-building, sample sharing.',
        ],
      },
      outcome: {
        ko: [['1인', '풀스택'], ['2', '연결된 서비스'], ['Live', 'pochams.com']],
        en: [['SOLO', 'FULLSTACK'], ['2', 'LINKED SERVICES'], ['Live', 'POCHAMS.COM']],
      },
    },

    {
      id: 'pokenova',
      num: '03',
      y: '2026',
      category: 'personal',
      thumbBg: '#D6402E',
      thumbLight: true,
      thumbCorner: '#15171A',
      thumbLabel: 'DEX · QUIZ',
      categoryLabel: { ko: 'Personal', en: 'Personal' },
      client:        { ko: 'Personal', en: 'Personal' },
      title:         { ko: '포케노바', en: 'pokenova' },
      tagline: {
        ko: '포켓몬 챔피언스 도감 + 5종 퀴즈. 1,285종·learnset 11,542항목을 직접 정리한 1인 운영형.',
        en: 'Pokémon Champions dex + 5 quiz modes — built on 1,285 species and 11,542 learnset entries I curated by hand.',
      },
      role:    { ko: '1인 기획 · 개발 · 데이터 관리', en: 'Solo · Plan · Build · Data' },
      roleSub: { ko: 'Vanilla JS · Firebase · Vercel', en: 'Vanilla JS · Firebase · Vercel' },
      tags:    { ko: ['Web', 'Game', 'Data'],          en: ['Web', 'Game', 'Data'] },
      did: {
        ko: [
          '5종 퀴즈(포켓몬·기술·특성·도구·능력치)와 오늘의 포켓몬 뽑기, 도감 3종 자체 설계',
          '챔피언스 186마리 learnset 11,542항목·리전폼·메가·거다이맥스를 한 스키마로 정규화',
          'pochams API + 로컬 JSON에 localStorage 6시간 캐싱을 얹어 응답 비용·속도 최적화',
        ],
        en: [
          'Designed five quiz modes, the daily Pokémon draw, and three dex variants from scratch.',
          'Normalized 11,542 learnset entries across 186 Champions, plus regional/mega/Gigantamax forms into one schema.',
          'Stacked localStorage 6-hour caching over the pochams API + local JSON to cut response cost and latency.',
        ],
      },
      outcome: {
        ko: [['1,285', '포켓몬 종'], ['11,542', 'Learnset 항목'], ['Live', 'pokenova.pochams.com']],
        en: [['1,285', 'POKÉMON'], ['11,542', 'LEARNSET ROWS'], ['Live', 'POKENOVA']],
      },
    },

    {
      id: 'jbae-portfolio',
      num: '04',
      y: '2026',
      category: 'client',
      thumbBg: '#EFE3CB',
      thumbLight: false,
      thumbCorner: '#15171A',
      thumbLabel: 'ARCHIVE · 134',
      categoryLabel: { ko: 'Client', en: 'Client' },
      client:        { ko: '배정혜 (화가)', en: 'Jeonghye Bae (painter)' },
      title:         { ko: '작가 포트폴리오', en: 'Artist Portfolio' },
      tagline: {
        ko: '화가 배정혜의 작품 134점 아카이브 — 무빌드 구조로 JSON 수정만으로 운영.',
        en: 'A 134-piece archive for painter Jeonghye Bae — a no-build site updated by editing one JSON file.',
      },
      role:    { ko: '요구분석 · 정보구조 · 풀스택 · 운영 가이드', en: 'Reqs · IA · Fullstack · Ops Guide' },
      roleSub: { ko: 'Vanilla · GitHub Pages',                  en: 'Vanilla · GitHub Pages' },
      tags:    { ko: ['Web', 'Client', 'Archive'],              en: ['Web', 'Client', 'Archive'] },
      did: {
        ko: [
          '작품 물리 크기(cm) → 화면 비례 자동 변환 레이아웃과 4→3→2→1열 반응형 그리드 설계',
          '단일 data.json이 작가 정보 + 134점 메타데이터를 통합 관리 — 이미지·JSON 수정만으로 업데이트되는 무빌드 구조',
          '키보드 ↔/ESC 라이트박스, 닫기 시 진입 위치로 스크롤 복원, Python 자동 크롭 파이프라인 제공',
        ],
        en: [
          'Designed a layout that maps physical cm sizes to on-screen proportions, with a 4→3→2→1-column responsive grid.',
          'Unified the artist bio + 134 work entries into a single data.json — site updates by editing the file, no build step.',
          'Added keyboard-driven lightbox (↔/ESC) with scroll-restore on close, plus a Python pipeline that auto-crops white borders.',
        ],
      },
      outcome: {
        ko: [['134', '아카이브 작품'], ['0', '빌드 단계'], ['Live', 'jbae-portfolio']],
        en: [['134', 'WORKS ARCHIVED'], ['0', 'BUILD STEPS'], ['Live', 'JBAE-PORTFOLIO']],
      },
    },

    {
      id: 'remote-dashboard',
      num: '05',
      y: '2026',
      category: 'personal',
      thumbBg: '#15171A',
      thumbLight: true,
      thumbCorner: '#D6402E',
      thumbLabel: 'TERMINAL · WS',
      categoryLabel: { ko: 'Personal', en: 'Personal' },
      client:        { ko: 'Personal', en: 'Personal' },
      title:         { ko: '원격 대시보드', en: 'Remote Dashboard' },
      tagline: {
        ko: '브라우저에서 집 데스크탑에 접속해 코딩 — 자체 구축 원격 개발 터미널.',
        en: 'A self-hosted in-browser dev terminal — reach my home desktop from anywhere and code through it.',
      },
      role:    { ko: '인프라 · 풀스택 단독 구축',       en: 'Solo · Infra & Fullstack' },
      roleSub: { ko: 'Next.js · WebSocket · PM2',     en: 'Next.js · WebSocket · PM2' },
      tags:    { ko: ['Web', 'DevTool', 'Infra'],     en: ['Web', 'DevTool', 'Infra'] },
      did: {
        ko: [
          'xterm.js + WebSocket + node-pty로 브라우저 ↔ 셸 양방향 통신 풀스택 구현',
          'WSL/Ubuntu + Cloudflare Tunnel + PM2로 외부 접속·도메인·프로세스 관리 인프라 직접 구축',
          'ai.junghyeok.com 도메인 연결 — 노트북에서 집 컴퓨터로 vibe coding 가능',
        ],
        en: [
          'Built the browser↔shell pipe with xterm.js + WebSocket + node-pty end-to-end.',
          'Wired WSL/Ubuntu + Cloudflare Tunnel + PM2 for external access, domain routing, and process management.',
          'Mapped it to ai.junghyeok.com — vibe-coding into my home desktop from any laptop.',
        ],
      },
      outcome: {
        ko: [['24/7', '셀프 호스팅'], ['1', '원격 도메인'], ['Live', 'ai.junghyeok.com']],
        en: [['24/7', 'SELF-HOSTED'], ['1', 'REMOTE DOMAIN'], ['Live', 'AI.JUNGHYEOK.COM']],
      },
    },

    {
      id: 'shelter-adoption',
      num: '06',
      y: '2025',
      category: 'student',
      thumbBg: '#2E443A',
      thumbLight: true,
      thumbCorner: '#D6402E',
      thumbLabel: 'ADOPT · TRUST',
      categoryLabel: { ko: 'Capstone', en: 'Capstone' },
      client:        { ko: 'School Capstone', en: 'School Capstone' },
      title:         { ko: '유기견 분양 플랫폼', en: 'Shelter Adoption Platform' },
      tagline: {
        ko: '보호소 중심의 신뢰도 낮은 정보 구조를 입양자 신뢰 중심으로 재설계.',
        en: 'Re-designed shelter-centric, low-trust adoption info into an adopter-trust-first platform.',
      },
      role:    { ko: '기획 30% · 디자인 100%',     en: 'Planning 30% · Design 100%' },
      roleSub: { ko: 'Figma · 졸업과제',           en: 'Figma · Capstone' },
      tags:    { ko: ['Service', 'UX', 'Figma'],  en: ['Service', 'UX', 'Figma'] },
      did: {
        ko: [
          '보호소 입양 흐름의 신뢰 단절 지점을 페르소나·여정 맵 단위로 분해',
          '탐색 → 결정 → 소통 3단계 흐름과 입양 상태 라벨 시스템 신규 설계',
          '영어 인터페이스 기반 해외 입양 가능성을 포함한 화면 아키텍처 제안',
        ],
        en: [
          'Broke down trust gaps in shelter adoption flows into personas and a customer journey map.',
          'Designed a 3-stage flow — Browse → Decide → Talk — with a new adoption-status label system.',
          'Proposed a screen architecture that includes English-first UI for overseas adoption.',
        ],
      },
      outcome: {
        ko: [['100%', '디자인 단독'], ['3', '플로우 단계'], ['Capstone', '졸업과제']],
        en: [['100%', 'DESIGN SOLO'], ['3', 'FLOW STAGES'], ['Capstone', 'GRAD PROJECT']],
      },
    },

    {
      id: 'donidoeji-analysis',
      num: '07',
      y: '2025',
      category: 'company',
      thumbBg: '#5F6A75',
      thumbLight: true,
      thumbCorner: '#D6402E',
      thumbLabel: 'RETENTION · LOOP',
      categoryLabel: { ko: 'Company · WAVLE', en: 'Company · WAVLE' },
      client:        { ko: 'WAVLE',           en: 'WAVLE' },
      title:         { ko: '돈이돼지 분석',    en: '돈이돼지 Analysis' },
      tagline: {
        ko: '리워드 앱테크의 UX 흐름·유지 구조 분석 — 핵심은 보상 금액이 아니라 “다시 들어오는 흐름”.',
        en: 'Analyzed UX flow and retention loops in a reward-cash app — the lever isn’t reward size, it’s the return path.',
      },
      role:    { ko: 'UX 분석가',                en: 'UX Analyst' },
      roleSub: { ko: '회사 협업 · 라이브 서비스', en: 'Industry · Live service' },
      tags:    { ko: ['UX', 'Analysis', 'Industry'], en: ['UX', 'Analysis', 'Industry'] },
      did: {
        ko: [
          '진입 → 행동 → 보상 → 재방문의 리텐션 루프를 단계별로 분리해 분석',
          '라이브 서비스 게임의 일일 콘텐츠 설계와 유사한 구조 발견 — 게임 시스템적 사고와 연결',
          '분석 인사이트가 이후 같은 회사의 젤로팡 기획·디자인으로 직접 이어짐',
        ],
        en: [
          'Sliced the retention loop into entry → action → reward → return and analyzed each stage.',
          'Identified the parallel to daily-content design in live-service games — direct link to game system thinking.',
          'Carried these insights forward into the next WAVLE project — Zellopang — as planner & designer.',
        ],
      },
      outcome: {
        ko: [['4', '루프 단계'], ['→', 'Zellopang으로'], ['WAVLE', '회사 의뢰']],
        en: [['4', 'LOOP STAGES'], ['→', 'INTO ZELLOPANG'], ['WAVLE', 'COMMISSIONED']],
      },
    },
  ],
};
