// ============================================================
// DATA · NEON DARK PORTFOLIO
// All copy lives here, structured as { ko, en } per field.
// Components consume this via t(field, lang).
// ============================================================
window.DATA_NEON = {

  // ---------- UI strings ----------
  ui: {
    badge:   { ko: 'SYS // PORTFOLIO_026',  en: 'SYS // PORTFOLIO_026' },
    status:  { ko: 'ONLINE · BOOKING Q3',   en: 'ONLINE · BOOKING Q3' },
    nameA:   { ko: 'PARK',                  en: 'PARK' },
    nameB:   { ko: 'JUNGHYEOK',             en: 'JUNGHYEOK' },

    langKo:  { ko: 'KOR', en: 'KOR' },
    langEn:  { ko: 'EN',  en: 'EN' },

    role: {
      ko: '독립 프로덕트 디자이너. 금융과 도구, 그리고 조용한 인터페이스에 관심이 있습니다. 작은 팀과 끝까지 만드는 일을 좋아합니다.',
      en: 'Independent product designer focused on finance, tools, and quiet interfaces. I like seeing things through in small teams.',
    },
    heroMeta: {
      ko: ['EST · 2017', '09 YRS · 47 SHIPPED', 'BASED IN SEOUL · KST +09:00'],
      en: ['EST · 2017', '09 YRS · 47 SHIPPED', 'BASED IN SEOUL · KST +09:00'],
    },
    heroKicker: { ko: 'SYSTEM ACTIVE · 09:42 KST', en: 'SYSTEM ACTIVE · 09:42 KST' },
    heroLoc:    { ko: 'SEOUL · KR',                en: 'SEOUL · KR' },

    sectionLabel: { ko: 'Selected Work',             en: 'Selected Work' },
    sectionMeta:  { ko: 'No. 01 — 05 · 2023 → 2025', en: 'No. 01 — 05 · 2023 → 2025' },
    autoLabel:    { ko: 'LIVE FEED',  en: 'LIVE FEED' },
    pausedLabel:  { ko: 'PAUSED',     en: 'PAUSED' },
    manualLabel:  { ko: '// MANUAL',  en: '// MANUAL' },
    nudge: {
      ko: '카드 위에 마우스를 올리면 흐름이 멈춥니다. 클릭하면 상세로.',
      en: 'Hover a card to pause. Click to open.',
    },
    nudgeReduced: {
      ko: '← → 화살표로 직접 넘기세요.',
      en: 'Use the arrows below to step through.',
    },

    back:   { ko: '목록으로',     en: 'Back to index' },
    visit:  { ko: '사이트 방문', en: 'Visit site' },
    prev:   { ko: 'PREV',        en: 'PREV' },
    next:   { ko: 'NEXT',        en: 'NEXT' },
    arrowL: { ko: '←', en: '←' },
    arrowR: { ko: '→', en: '→' },

    detailYear:    { ko: 'YEAR',         en: 'YEAR' },
    detailRole:    { ko: 'ROLE',         en: 'ROLE' },
    detailClient:  { ko: 'CLIENT',       en: 'CLIENT' },
    detailIndex:   { ko: 'INDEX',        en: 'INDEX' },
    detailDid:     { ko: 'WHAT_I_DID',   en: 'WHAT_I_DID' },
    detailOutcome: { ko: 'OUTCOME',      en: 'OUTCOME' },
    detailTags:    { ko: 'TAGS',         en: 'TAGS' },
    featuredLabel: { ko: 'FEATURED',     en: 'FEATURED' },
    keyboardHint:  { ko: '← → 키로 이동 · Esc로 닫기',
                     en: '← → to navigate · Esc to close' },

    footerL:     { ko: '© Park Junghyeok · 2026', en: '© Park Junghyeok · 2026' },
    footerC:     { ko: 'Set in Space Grotesk + Noto Sans KR',
                   en: 'Set in Space Grotesk + Noto Sans KR' },
    footerEmail: { ko: 'hello@junghyeok.kr', en: 'hello@junghyeok.kr' },
    footerGit:   { ko: 'github.com/junghyeok', en: 'github.com/junghyeok' },

    toastLang: { ko: 'LANGUAGE · KOR', en: 'LANGUAGE · EN' },
  },

  // ---------- Projects ----------
  projects: [
    {
      id: 'calm-banking',
      num: '01',
      y: '2025',
      category: 'company',
      live: true,
      thumbBg: 'linear-gradient(135deg, #102035, #1A2D52)',
      thumbAccent: '#00F5D4',
      thumbLabel: 'TRANSFER_FLOW · v.02',
      categoryLabel: { ko: 'COMPANY', en: 'COMPANY' },
      client:        { ko: 'Lattice Bank', en: 'Lattice Bank' },
      title:         { ko: 'Calm Banking', en: 'Calm Banking' },
      tagline: {
        ko: '복잡한 송금 흐름을 한 화면으로 단정하게 줄였습니다.',
        en: 'Compressed the entire transfer flow into one calm screen.',
      },
      role:    { ko: 'Lead Product Designer · 7개월',
                 en: 'Lead Product Designer · 7 months' },
      roleSub: { ko: 'iOS · Android', en: 'iOS · Android' },
      tags:    { ko: ['Mobile', 'Fintech', 'Lead'],
                 en: ['Mobile', 'Fintech', 'Lead'] },
      did: {
        ko: [
          '거래 흐름 5단계를 3단계로 축약, 잘못 보낸 송금 되돌리기 패턴 신규 도입',
          '계좌·카드 정보를 단일 카드 UI로 재설계, 모듈 32개를 12개로 정리',
          '온보딩 5개 화면 신규 — 첫 송금까지 평균 시간 측정 가능하게 함',
        ],
        en: [
          'Reduced the 5-step transfer flow to 3, introduced an undo pattern for mis-sent payments.',
          'Redesigned account & card surfaces into a single card UI, cutting 32 modules to 12.',
          'Shipped 5 new onboarding screens that made time-to-first-transfer measurable.',
        ],
      },
      outcome: {
        ko: [['−38%', 'D7 신규 이탈률'], ['22→9s', '평균 송금 완료'], ['4.8★', 'App Store · 12.4k']],
        en: [['−38%', 'D7 NEW USER CHURN'], ['22→9s', 'AVG TRANSFER TIME'], ['4.8★', 'APP STORE · 12.4K']],
      },
    },

    {
      id: 'foundry-docs',
      num: '02',
      y: '2024',
      category: 'personal',
      thumbBg: 'linear-gradient(135deg, #1A0D2E, #2E0F4A)',
      thumbAccent: '#FF3DA5',
      thumbLabel: 'DOCS · /api/v2',
      categoryLabel: { ko: 'PERSONAL', en: 'PERSONAL' },
      client:        { ko: 'Open Source', en: 'Open Source' },
      title:         { ko: 'Foundry Docs', en: 'Foundry Docs' },
      tagline: {
        ko: '개발자 문서를 잡지처럼 읽히게 만든 정적 사이트 키트.',
        en: 'A static-site kit that makes dev docs read like a magazine.',
      },
      role:    { ko: 'Solo · Design & Build', en: 'Solo · Design & Build' },
      roleSub: { ko: '12주', en: '12 weeks' },
      tags:    { ko: ['Web', 'Tooling'], en: ['Web', 'Tooling'] },
      did: {
        ko: [
          '5단계 정보 위계를 책의 본문·각주·여백 모델로 재해석',
          '코드 블록과 본문을 한 그리드 안에서 정렬되도록 12-column 시스템 설계',
          '검색·내비게이션·다크모드 전환을 단축키 한 손으로 가능하게 함',
        ],
        en: [
          'Re-mapped 5 levels of hierarchy onto a book model — body, footnote, margin.',
          'Designed a 12-column grid that aligns code blocks and prose on the same axis.',
          'Made search, nav, and dark-mode all reachable with one-handed shortcuts.',
        ],
      },
      outcome: {
        ko: [['2.1k', 'GitHub stars'], ['14', 'OSS 채택'], ['4m 12s', '평균 체류']],
        en: [['2.1k', 'GITHUB STARS'], ['14', 'OSS ADOPTIONS'], ['4m 12s', 'AVG SESSION']],
      },
    },

    {
      id: 'saebyul-reader',
      num: '03',
      y: '2024',
      category: 'student',
      thumbBg: 'linear-gradient(160deg, #0E1F38, #14385C)',
      thumbAccent: '#7DF9FF',
      thumbLabel: 'READ · 03:14_AM',
      categoryLabel: { ko: 'THESIS', en: 'THESIS' },
      client:        { ko: 'SNU Visual Design', en: 'SNU Visual Design' },
      title:         { ko: 'Saebyul Reader', en: 'Saebyul Reader' },
      tagline: {
        ko: '한국 단편소설을 위한 새벽 시간대 독서 앱.',
        en: 'A short-fiction reader for the early hours of the morning.',
      },
      role:    { ko: 'Solo · UX/UI', en: 'Solo · UX/UI' },
      roleSub: { ko: '졸업 프로젝트 · 16주', en: 'Thesis · 16 weeks' },
      tags:    { ko: ['Mobile', 'Reading'], en: ['Mobile', 'Reading'] },
      did: {
        ko: [
          '한글 본문 조판 — 글자 사이·행간·여백을 시간대 따라 자동 조정',
          '한 호흡 단위로 끊어주는 문장 페이서 인터랙션 신규 설계',
          '오프라인 우선 아키텍처와 작가별 컬렉션 UI 구성',
        ],
        en: [
          'Built a Hangul body-text system that adjusts kerning and leading by time of day.',
          'Designed a sentence-pacer interaction that breaks prose at the breath line.',
          'Shipped an offline-first architecture with per-author collections.',
        ],
      },
      outcome: {
        ko: [['27분', '평균 세션'], ['64%', '재방문율'], ['SDF', '신인상 본선']],
        en: [['27m', 'AVG SESSION'], ['64%', 'REPEAT RATE'], ['SDF', 'ROOKIE AWARD']],
      },
    },

    {
      id: 'studio-kettle',
      num: '04',
      y: '2023',
      category: 'client',
      thumbBg: 'linear-gradient(135deg, #1A2A1E, #2F4D38)',
      thumbAccent: '#39FF88',
      thumbLabel: 'BREW · SS_23',
      categoryLabel: { ko: 'CLIENT', en: 'CLIENT' },
      client:        { ko: 'Local Brewery', en: 'Local Brewery' },
      title:         { ko: 'Studio Kettle', en: 'Studio Kettle' },
      tagline: {
        ko: '동네 양조장의 시즌별 라벨과 예약 사이트.',
        en: 'Seasonal labels and a reservation site for a neighbourhood brewery.',
      },
      role:    { ko: 'Lead Designer · 8주', en: 'Lead Designer · 8 weeks' },
      roleSub: { ko: '브랜드 + 웹', en: 'Brand + Web' },
      tags:    { ko: ['Brand', 'Web'], en: ['Brand', 'Web'] },
      did: {
        ko: [
          '시즌마다 바뀌는 라벨 시스템을 단일 그리드 위에서 모듈식으로 구성',
          '주중 한정 메뉴 예약 흐름을 3-step으로 단순화',
          '사진 없이도 메뉴를 묘사할 수 있는 타이포 중심 카드 시스템',
        ],
        en: [
          'Built a modular label system that flexes across seasons on a single grid.',
          'Streamlined the weekday-only menu reservation into a 3-step flow.',
          'Designed a typography-first menu card system that works without photos.',
        ],
      },
      outcome: {
        ko: [['8주', '연속 예약 만석'], ['600→9.2k', 'IG 팔로워'], ['Around', '베스트 스튜디오 10']],
        en: [['8 WK', 'BOOKED OUT'], ['600→9.2k', 'INSTAGRAM'], ['Top 10', 'AROUND MAGAZINE']],
      },
    },

    {
      id: 'loop-calendar',
      num: '05',
      y: '2025',
      category: 'personal',
      thumbBg: 'linear-gradient(135deg, #2A1A0E, #4D2D18)',
      thumbAccent: '#FFB73D',
      thumbLabel: 'WK_21 · LOOP',
      categoryLabel: { ko: 'EXPERIMENT', en: 'EXPERIMENT' },
      client:        { ko: 'Side Project', en: 'Side Project' },
      title:         { ko: 'Loop Calendar', en: 'Loop Calendar' },
      tagline: {
        ko: '반복 일정만을 위한 미니 캘린더 — 한 화면, 한 주.',
        en: 'A mini calendar only for recurring events — one screen, one week.',
      },
      role:    { ko: 'Solo · 사이드 프로젝트', en: 'Solo · Side project' },
      roleSub: { ko: '진행 중', en: 'In progress' },
      tags:    { ko: ['Mobile', 'Productivity'], en: ['Mobile', 'Productivity'] },
      did: {
        ko: [
          '주간 시간표를 7×24 그리드 한 장으로 압축, 캡쳐 가능한 카드 형태로 출력',
          '반복 패턴 입력을 3개 슬라이더(요일·시작·길이)로 단순화',
          'iCal 연동 + 위젯 3사이즈 디자인',
        ],
        en: [
          'Compressed a weekly schedule into a 7×24 grid that exports as a single shareable card.',
          'Reduced recurrence input to 3 sliders: day, start, length.',
          'Designed iCal sync and three widget sizes.',
        ],
      },
      outcome: {
        ko: [['n=180', 'TestFlight 베타'], ['#4', 'Product Hunt'], ['iOS 18', '위젯 피처드']],
        en: [['n=180', 'TESTFLIGHT BETA'], ['#4', 'PRODUCT HUNT'], ['iOS 18', 'WIDGET FEATURED']],
      },
    },
  ],
};

// ============================================================
// HELPER · t(field, lang)
// If field is { ko, en } -> return matching locale
// Otherwise return field as-is.
// ============================================================
window.t = function (field, lang) {
  if (
    field && typeof field === 'object' && !Array.isArray(field) &&
    ('ko' in field || 'en' in field)
  ) {
    return field[lang === 'kor' ? 'ko' : 'en'];
  }
  return field;
};
