# =====================================================================
# CONTEXT OVERRIDE — READ THIS FIRST
# =====================================================================

이 프롬프트의 원본 템플릿은 "graduate student / Ph.D. researcher" 용
학술 포트폴리오 페이지를 위해 작성됐다. 그러나 이 프로젝트의 대상자는
**학부생이자 UX·콘텐츠 기획자, 게임 기획자 지망생**이다.

따라서 다음 규칙을 적용해 템플릿을 재해석한다:

1. "Ph.D." / "graduate student" / "researcher" 같은 표현은
   "designer / planner / aspiring game designer / undergraduate"
   같은 표현으로 자연스럽게 치환한다.

2. "Research" 같은 단어가 나오는 섹션 헤더는 다음 후보 중에서
   대상자에게 어울리는 표현으로 바꾼다:
   - SELECTED WORK
   - FEATURED PROJECTS
   - DESIGN & PLANNING
   - CURRENT DIRECTIONS

3. 학술 논문·인용·연구실 같은 메타포 대신,
   디자인·기획·시스템 사고·UX·게임 기획 메타포를 사용한다.

4. 비주얼 디자인 DNA(다크 우주 테마, liquid-glass UI, Anton/Condiment
   폰트, 시네마틱 분위기, 비디오 배경, 텍스처 오버레이 등)는
   원본 그대로 100% 유지한다.

5. CV의 한글 콘텐츠는 영문 cinematic copy로 변환하되,
   Vision Statement는 한글의 강한 어조(특히 "빠르게가 아니라 정확하게")
   를 영문에서도 살린다.

6. Featured Work 그리드는 카드 3개로 구성하되, 가능하면
   다음 3개 묶음 중 하나를 추천한다:
   - (A) 학업 진행 중 / 산업 협업 / 클라이언트 워크
   - (B) 시스템 기획 / UX 리서치 / 풀스택 구축
   - (C) ENCORE / pokenova-pochams / Zellopang  (가장 임팩트 큰 셋)

7. 톤은 "스타트업 SaaS"가 아니라 "젊고 야심 있는 디자이너 겸
   기획자의 시네마틱 포트폴리오"로 잡는다. Premium · Minimal ·
   Intellectual · Cinematic · Design-driven 의 키워드를 유지하되,
   "academic"은 "design-led"로 대체한다.


# =====================================================================
# ORIGINAL TEMPLATE (NFT-style cinematic landing page reinterpreted)
# =====================================================================

Create a personal portfolio landing page for an undergraduate
designer / planner / aspiring game designer.

I want you to keep the overall visual design language, layout structure,
cinematic atmosphere, liquid-glass UI, dark space theme, typography
hierarchy, and responsive behavior from the original "Orbis.Nft" style
landing page.

However, this should no longer feel like an NFT page.
Instead, reinterpret it as a premium personal landing page for a young
designer / planner / aspiring game designer.

The final result should feel:
- futuristic
- elegant
- minimal
- intellectual
- cinematic
- design-led

Do not make it look like a startup SaaS page.
Do not make it look playful or childish.
Do not make it look like a generic resume site.
It should feel like a high-end design / planning portfolio.

-----------------------------------
FRAMEWORK / STACK
-----------------------------------

- Framework: React + TypeScript + Vite + Tailwind CSS
- Icons: lucide-react
- No extra packages beyond standard Vite + React + Tailwind setup
- Responsive: mobile-first
- Max content width: 1831px
- Keep the same 4-section layout
- Keep the liquid-glass UI effect
- Keep the texture overlay
- Keep video backgrounds in the same places as the reference design
- All videos should use autoPlay loop muted playsInline

-----------------------------------
FONTS
-----------------------------------

Use Google Fonts exactly like this:

- Anton → for all headings and navigation text (alias: font-grotesk in Tailwind)
- Condiment → for cursive accent / overlay text (alias: font-condiment)
- System monospace font → for body text (font-mono)

Load in index.html:
https://fonts.googleapis.com/css2?family=Anton&family=Condiment&display=swap

-----------------------------------
COLOR SYSTEM
-----------------------------------

Use the exact same color system:

- Background: #010828
- cream: #EFF4FF
- neon: #6FFF00

Use:
- cream for most text
- neon for accent cursive text and underline bars
- background as the main deep dark navy

-----------------------------------
LIQUID GLASS EFFECT
-----------------------------------

Use this exact CSS and preserve the same appearance:

.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

Apply this class to:
- navbar
- icon buttons
- project cards
- overlay bars
- final CTA icon stack

-----------------------------------
TEXTURE OVERLAY
-----------------------------------

Keep a full-screen fixed texture overlay above everything:
- z-50
- pointer-events-none
- use /texture.png
- mix-blend-mode: lighten
- opacity: 0.6
- background-size: cover
- full viewport coverage

-----------------------------------
SOURCE MATERIAL / INPUT RULES
-----------------------------------

The CV/portfolio input is provided at the bottom of this document.

Your job is to:
1. extract the person's identity, focus areas, strengths, and tone
2. convert the CV into concise landing-page copy
3. preserve the same premium visual structure from the reference design
4. avoid dumping raw CV text
5. transform the CV into a polished designer/planner narrative

Important rules:
- Do NOT paste the CV verbatim into the page
- Do NOT create long paragraphs
- Do NOT create a crowded resume layout
- Do NOT include every detail from the CV
- Instead, summarize and curate the most impressive information

You should identify and prioritize:
- name
- current position / status
- institution
- main focus areas
- selected achievements
- selected projects / awards / industry work / client work if relevant
- contact / online presence if available

-----------------------------------
SECTION 1: HERO
-----------------------------------

Keep the same hero composition as the original design:
- full viewport
- full-bleed looping muted autoplay video background
- rounded bottom corners
- centered max-width container
- logo on left
- liquid-glass nav in center
- social icons on right (desktop) / below heading (mobile)

Use this background video:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4

Header:
- left logo text = person's name
- center nav = 5 menu items adapted to the CV
- right social icons = Mail, Github, Instagram or Website depending on context
- hidden nav on mobile, same as original

Navigation labels should be chosen from the CV and should feel appropriate.
Examples:
- HOME
- ABOUT
- WORK
- PROJECTS
- DESIGN
- CLIENT
- CONTACT

Hero heading:
Create a large cinematic heading in Anton based on the person's identity.
It should be 3–5 short lines, all uppercase, and feel bold but not cheesy.

Examples of heading style:
- DESIGNING SYSTEMS, PLANNING PLAY.
- BUILDING WHAT USERS COME BACK TO.
- FROM UX FLOWS TO GAME LOOPS.
- STRUCTURED THINKING. CINEMATIC EXECUTION.
- DESIGNED TO BE PLAYED.

Do not use generic phrases like "welcome to my portfolio".

Accent cursive text:
Use Condiment in neon green for a short overlay phrase related to the field.
Examples:
- Design portfolio
- Planner & Designer
- Aspiring game designer
- UX & systems
- Future game design

Place it similarly to the original decorative accent text.

Social icons:
Use Mail, Github, Instagram, or Website depending on the available info.

-----------------------------------
SECTION 2: ABOUT / INTRO
-----------------------------------

Keep the same full-viewport background video section and same layout logic.

Use this background video:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4

Top-left heading:
Create a strong intro heading based on the person's profile.

Examples:
- HELLO! I'M [NAME]
- [NAME], DESIGNER & PLANNER
- ABOUT THE WORK
- WORKING AT THE EDGE OF UX & GAMES

Overlay a Condiment accent word in neon green such as:
- Designer
- Planner
- Builder
- Aspiring Game Designer

Top-right paragraph:
Write a short uppercase monospace statement based on the CV.
This should be 1–3 short sentences max.
It should summarize:
- current status (undergrad)
- institution
- focus
- the kind of problems they design / plan around

Bottom row:
Keep the decorative faint-text layout from the original.
Instead of visible informational text, use repeated low-opacity keyword
clusters extracted from the CV.

Examples:
- UX RESEARCH / SYSTEM DESIGN / GAME LOOPS / IMMERSIVE MEDIA
- CONTENT PLANNING / SERVICE DESIGN / FRONTEND / AI-ASSISTED DEV

The bottom row is decorative, not meant for dense reading.

-----------------------------------
SECTION 3: FEATURED WORK GRID
-----------------------------------

Keep the same section layout as the original NFT collection grid, but
reinterpret it as featured work / selected projects.

Background:
- solid #010828

Header left:
Create a heading like:
- SELECTED WORK
- FEATURED PROJECTS
- CURRENT DIRECTIONS
- WORK HIGHLIGHTS

One key word may be in Condiment neon green, similar to the original
line-break structure.

Header right:
Keep the same bold button composition, but change text to something like:
- SEE ALL WORK
- EXPLORE PROJECTS
- VIEW FULL CV

Keep the neon underline bar.

Grid:
- 3 cards
- 1 column mobile / 2 tablet / 3 desktop
- same gap and same liquid-glass style
- same square video format
- same overlay bar and purple arrow button

Use these same 3 videos:
1. https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4
2. https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4
3. https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4

For THIS person specifically, use the following 3 cards
(chosen as the strongest "story buckets" from the CV — Industry +
Personal Product + Client Work spectrum):

  CARD 1 → Zellopang (젤로팡)
    Type: Industry · Pre-launch · Design 100%
    Why featured: 실제로 출시되는 산업 제품의 비주얼 디자인을 단독으로
    수행한 작업. 가장 최신이며, "지금 만들고 있는 제품"이라는 신선함.
    Suggested overlay label/value examples:
      - TYPE: INDUSTRY · PRE-LAUNCH
      - ROLE: DESIGN 100%
      - CLIENT: WAVLE

  CARD 2 → pokenova + pochams (Pokémon Champions Ecosystem)
    Type: System Architecture · Personal Product · Live Service
    Why featured: 1인 기획·개발·데이터 관리. 데이터 레이어(pokenova) ↔
    API/커뮤니티 레이어(pochams)의 마이크로서비스 분리 설계.
    게임 기획자 지망과 직결되는 메타 데이터 + 유저 행동 루프 설계 경험.
    Suggested overlay label/value examples:
      - FOCUS: SYSTEM DESIGN
      - SCALE: 1,285 POKÉMON · 11K+ ENTRIES
      - ROLE: SOLO PRODUCT

  CARD 3 → jbae-portfolio (Artist Portfolio · Client Work)
    Type: Client Work · Information Architecture
    Why featured: 30년 경력 화가의 작품 134점을 연도별로 아카이브하는
    클라이언트 작업. 외부 신뢰 기반 작업이라는 점에서 다른 프로젝트와
    성격이 다름. 단일 data.json 기반의 무빌드 구조 설계가 핵심.
    Suggested overlay label/value examples:
      - TYPE: CLIENT WORK
      - SCOPE: 134 ARTWORKS · 19 YEARS
      - ROLE: IA + FULL-STACK

Each card should include:
- a concise title
- optionally 1 short descriptive subtitle or tag
- bottom overlay label + value

Examples of overlay label/value:
- FOCUS: IMMERSIVE MEDIA
- AREA: SYSTEM DESIGN
- TYPE: INDUSTRY · PRE-LAUNCH
- ROLE: PLANNING + DESIGN
- METHOD: USER FLOW + LOOPS

Do not overload the cards with too much text.
Keep them highly visual and premium.

-----------------------------------
SECTION 4: FINAL CTA / CONTACT
-----------------------------------

Keep the same final section structure:
- native-aspect video
- absolute text overlay
- bottom-left social stack
- cinematic closing statement

Use this video:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4

Do not use object-cover.
Use:
- w-full
- h-auto
- block

Accent cursive text:
Use a short phrase like:
- Let's connect
- Beyond the page
- Further signals
- Explore more

Heading:
Create a final multi-line CTA based on the CV.
Examples:
- LET'S BUILD WHAT COMES NEXT.
- DESIGN. PLAN. PLAY.
- FROM UX FLOWS TO GAME LOOPS.
- READY TO DESIGN WHAT'S NEXT.

This should feel elegant, not salesy.

Bottom-left icon stack:
Keep the same vertical liquid-glass stacked icon component.
Use social/contact icons appropriate for the person.

-----------------------------------
CONTENT TRANSFORMATION LOGIC
-----------------------------------

When converting the CV into page content, follow these rules:

1. HERO
Turn the person's identity into a bold positioning statement
about a designer/planner growing toward game design.

2. ABOUT
Summarize their current role, institution, focus, and direction
in a concise and intelligent way. Echo the Vision Statement's
"not quickly, but correctly" tension if possible.

3. FEATURED GRID
Use the recommended 3 cards above. Keep titles short and
overlay labels punchy.

4. FINAL CTA
End with a statement that feels like an invitation to explore
the work or connect professionally.

-----------------------------------
STYLE RULES
-----------------------------------

- Preserve the original premium visual DNA
- Use uppercase for most text
- Keep Condiment accents in normal case
- Keep typography dramatic and spacious
- Do not clutter the page
- Do not create dense biography sections
- Do not use tables
- Do not use timeline-heavy resume blocks
- Do not make the page feel like LinkedIn
- Do not make it feel corporate
- Keep it cinematic, premium, intelligent, and minimal

-----------------------------------
IMPLEMENTATION DETAILS
-----------------------------------

Please build:
- a single-page React component
- reusable arrays for nav items, social links, and featured cards
- text constants near the top of the file for easy editing
- clean Tailwind structure
- semantic HTML where appropriate
- polished responsive behavior faithful to the original design

-----------------------------------
EXTENSIBILITY — 프로젝트 추가 용이성 (CRITICAL)
-----------------------------------

This site will grow over time. New projects must be addable by editing
ONE data file — never by digging into React components.

REQUIRED FOLDER STRUCTURE:

  src/
    data/
      profile.ts      → name, vision, contact, currentPosition
      nav.ts          → navigation menu items
      social.ts       → social links (mail, github, instagram, website)
      projects.ts     → ALL projects (master list)
    components/
      Hero.tsx
      About.tsx
      FeaturedWork.tsx
      FinalCTA.tsx
      LiquidGlass.tsx (shared utility)
    App.tsx
    main.tsx

PROJECT INTERFACE (in src/data/projects.ts):

  export interface Project {
    id: string;                     // unique slug (e.g. 'zellopang')
    title: string;                  // display title
    subtitle?: string;              // short tag under title
    year: string;                   // "2026" or "2026 · Ongoing"
    type: 'industry' | 'personal' | 'client'
        | 'academic' | 'capstone' | 'tool';
    featured: boolean;              // true → shown on the 3-card grid
    overlayLabel?: string;          // bottom overlay label (e.g. "TYPE")
    overlayValue?: string;          // bottom overlay value (e.g. "INDUSTRY · PRE-LAUNCH")
    videoUrl?: string;              // card background video
    description: string;            // 1-2 line summary
    role?: string;
    stack?: string[];
    url?: string;
    repo?: string;
  }

  export const projects: Project[] = [
    {
      id: 'zellopang',
      title: 'Zellopang',
      year: '2026 · Pre-Launch',
      type: 'industry',
      featured: true,
      overlayLabel: 'TYPE',
      overlayValue: 'INDUSTRY · PRE-LAUNCH',
      videoUrl: 'https://...',
      description: 'WAVLE의 신규 오퍼월 앱. ...',
      role: 'Planning 50% · Design 100%',
      url: '...',
    },
    // ... rest of projects
  ];

FEATUREDWORK COMPONENT BEHAVIOR:

  // Auto-pick first 3 featured projects
  const featured = projects.filter(p => p.featured).slice(0, 3);

  → No hard-coded card data inside the component.
  → Adding a new project to the grid = set featured: true on that
    project AND set featured: false on whichever one it replaces.

WORKFLOW FOR ADDING A NEW PROJECT (6 months from now):

  1. Open src/data/projects.ts
  2. Add a new Project object at the top of the array
  3. (Optional) Set featured: true if you want it in the 3-card grid
  4. (Optional) Set featured: false on the project it replaces
  5. Done. No component changes needed. No layout work.

WORKFLOW FOR UPDATING PROFILE / VISION / CONTACT:

  1. Open src/data/profile.ts
  2. Edit the relevant string
  3. Done.

This separation is non-negotiable. The React components must read
from the data files only. Never hard-code project data inside JSX.

-----------------------------------
OUTPUT REQUIREMENT
-----------------------------------

Use the CV below as the source of truth and generate the landing
page content accordingly.

If some information is missing:
- infer cautiously
- keep the language broad and elegant
- do not fabricate specific achievements

At the end, output the full React + TypeScript + Tailwind component.


# =====================================================================
# CV INPUT (source of truth)
# =====================================================================

# 박정혁 (Park Junghyeok)

## Current Position
Undergraduate Student · UX & Content Planner
Hanyang University · ICT Convergence · Design Technology
한양대학교 ICT융합학부 디자인테크놀로지전공
Aspiring **Game Designer**

---

## Vision Statement

### KOR
지금은 시스템과 UX 흐름을 중심으로 기획하지만,
장기적으로 "이 결정이 맞는가?"를 빠르게가 아니라
정확하게 판단할 수 있는 **게임 기획자**로 성장한다.

좋은 기획자의 결정 기준은 어디서 만들어지는가 —
경험인가, 구조인가, 질문의 방식인가.
프로젝트로 사고 방식을 정리하고,
멘토링으로 판단 기준을 검증한다.

### EN
Today, I plan around systems and UX flow.
But long term, I want to become a **game designer**
who can judge — not quickly, but **correctly** —
whether a decision is right.

Where does a good designer's judgment come from?
Experience? Structure? Or the way one frames the question?
I refine my thinking through projects
and validate my judgment through mentorship.

---

## Focus Areas
- Game Design (long-term direction)
- UX Research & Service Design
- System & User Flow Architecture
- Immersive Media (VR / AR)
- Content Planning & Production
- Web Development (frontend, AI-assisted dev)

---

## Selected Projects

### [2026 · Ongoing] ENCORE — Virtual Legend Concert Platform
AI/VR 가상 콘서트 플랫폼. K-pop 팬덤과 한국 클래식 아티스트 팬을 연결하는 몰입형 공연 경험 기획.
- **Role**: Concept Design, Platform Architecture, Visual Direction
- **Context**: Smart Immersive Application coursework
- **References**: Fortnite Travis Scott, BLACKPINK VR, HYBE Face Pass

### [2026 · Ongoing] Single-Household UX Research — Ohouse
1인 가구 트렌드 기반 서비스 리디자인 프로젝트. 오늘의집 대상.
- **Method**: 심층 유저 인터뷰 (5명+, 1시간/인)
- **Deliverables**: 녹취록, 프로필 시트, 리서치 기록지
- **Context**: UX Research coursework

### [2026 · Pre-Launch] Zellopang (젤로팡) — Reward-Based Mobile App
WAVLE의 신규 오퍼월 앱. 광고 시청과 미션 완료로 캐시를 적립해 상품권 교환·계좌 출금까지 가능. **10–20대 학생 타겟** ("커피값이라도 벌 수 있도록").
- **Company**: WAVLE (Industry · 돈이돼지 분석 후 같은 회사의 두 번째 협업)
- **Role**: Planning 50% (회사 공동) · **Design 100%** (단독 진행)
- **Status**: Pre-launch
- **Features**: 출석, 친구 추천, 광고 시청, 미션, 캐시 출금
- **Design Direction**: 밝은 그린 메인 컬러 + 화이트 카드 + 코인·지폐·선물 아이콘 — 보상감과 친근함을 동시에 전달
- **Growth Arc**: 분석가(돈이돼지 UX 해석) → 메이커(젤로팡 기획·디자인) 로 이어진 같은 도메인 내 성장

### [2026] Remote Claude Code Dashboard — Personal Dev Tool
브라우저 기반 자체 구축 원격 터미널. 외부에서 노트북으로 집 데스크탑에 접속해 vibe coding 가능.
- **URL**: ai.junghyeok.com
- **Stack**: Next.js · xterm.js · WebSocket · node-pty
- **Infrastructure**: WSL/Ubuntu · Cloudflare Tunnel · PM2

### [2026] pokenova — Pokémon Dex & Quiz Platform
포켓몬 챔피언스(공식 대전) 데이터를 중심으로 한 도감 + 퀴즈 플랫폼. 5종 퀴즈(포켓몬/기술/특성/도구/능력치), 오늘의 포켓몬 뽑기, 도감 3종 제공. **1인 기획·개발·데이터 관리**.
- **URL**: pokenova.pochams.com
- **Repo**: github.com/soondoree07/pokenova_project
- **Stack**: Vanilla HTML/JS/CSS · Firebase Firestore (리더보드) · GA4 · Vercel
- **Data**: pochams API (Neon PostgreSQL) + 로컬 JSON, localStorage 6시간 캐싱
- **Scale**: 포켓몬 1,285종 · 챔피언스 186마리 learnset 11,542개 항목 자체 관리
- **System Design**: 리전폼/메가/거다이맥스 세대 분류, hidden forms 처리, en 필드 underscore 정규화 룩업
- **Game-Plan Insight**: 메타 데이터 구조와 유저 행동 루프(퀴즈→리더보드→재방문)를 직접 설계 — 게임 시스템 기획과 직결되는 경험

### [2026] pochams — Pokémon Champions Team Builder & Community
포켓몬 챔피언스 유저 대상의 팀 빌딩 도구 + 샘플 공유 커뮤니티. pokenova와 동일 DB를 공유하며 **API 제공자 역할**을 겸함.
- **URL**: pochams.com
- **Stack**: Next.js 16 (App Router) · NextAuth · Neon PostgreSQL · Vercel
- **Architecture**: pokenova(데이터·UI) ↔ pochams(API·커뮤니티)의 **마이크로서비스 분리 구조**
- **Features**: 유저 계정, 좋아요, 팀 빌딩, 샘플 공유
- **Role**: 시스템 설계 · 풀스택 개발 · DB 스키마 설계

### [2026] jbae-portfolio — Artist Portfolio Site (Client Work)
화가 **배정혜** (홍익대 회화과 졸·30년 경력) 의 작품 포트폴리오 사이트 구축. **2007–2026년 134점**의 작품을 연도별로 아카이브하고 라이트박스 기반으로 감상할 수 있도록 설계.
- **URL**: soondoree07.github.io/jbae-portfolio
- **Repo**: github.com/soondoree/jbae-portfolio
- **Stack**: Vanilla HTML/CSS/JS · GitHub Pages
- **Architecture**: 단일 `data.json`이 작가 정보 + 134점 메타데이터를 통합 관리 — 이미지 교체와 JSON 수정만으로 업데이트 가능한 무빌드 구조
- **Highlights**:
  - 작품 물리 크기(cm) → 화면 비례 자동 변환 레이아웃
  - 4열 → 3 → 2 → 1열 반응형 CSS Grid 갤러리
  - 키보드 ↔/ESC 라이트박스, 닫기 시 진입 위치 스크롤 복원
  - 흰 테두리·캡션 자동 크롭 Python 파이프라인
- **Role**: 클라이언트 요구 분석 · 정보 구조 설계 · 데이터 스키마 정의 · 풀스택 구현 · 운영 가이드 제공

### [2025] LOPA — POE-Based Local Path Map App
기존 지도 앱의 POI(Point of Interest) 중심 구조를 넘어, 로컬이 검증한 **POE(Path of Experience)** 기반 경로 커뮤니티 앱 기획.
- **Problem**: SNS 추천의 정보 비대칭과 바이럴 편향
- **Research**: 설문 n=54, 페르소나 / Customer Journey Map
- **Solution**: One-day Path · Interactive Path Visualization · Local-Validated Community
- **Role**: Problem Definition, Service Architecture, UX Flow Design

### [2025] 유기견 분양 플랫폼 — Startup Capstone
보호소 중심의 신뢰도 낮은 유기견 정보 구조를 재설계. 단순한 입양 UX와 영어 기반 해외 입양 가능성을 포함한 플랫폼 제안.
- **Contribution**: Planning 30% / Design 100%
- **Tool**: Figma
- **Role**: Service Structure Definition · 입양 탐색 → 결정 → 소통 흐름 설계 · Screen Architecture
- **Outcome**: 보호소 중심 서비스와 차별화된 신뢰 중심 모델 제안

### [2025] Smart Highway — Night Accident Prevention System
야간 고속도로 사고를 사전 감지·예방하는 커넥티드 오토 모빌리티 시스템 기획. 운전자 상태 + 도로 환경 + V2I 인프라를 하나의 흐름으로 통합.
- **Research**: 설문 n=61, 운전자 인터뷰
- **Flow**: 센싱 → 판단 → 경고 → 제어
- **Scope**: 심박·얼굴 인식 기반 졸음 감지, 기상·노면 연계 VSL(Variable Speed Limit), 인프라 시인성 강화
- **Insight**: 상태 감지 → 피드백 → 행동 제어 구조는 게임 시스템 설계와 맞닿음

### [2025] 돈이돼지 App Analysis — WAVLE (Industry)
리워드 기반 앱테크 서비스의 UX 흐름 및 유저 유지 구조 분석. 회사 WAVLE의 요청 프로젝트.
- **Focus**: 진입 → 행동 → 보상 → 재방문 루프 분석
- **Key Insight**: 앱테크의 핵심은 보상 금액이 아닌 "다시 들어오게 되는 흐름 설계"
- **Cross-reference**: 라이브 서비스 게임의 일일 콘텐츠 설계와 유사한 구조

---

## Skills & Methods
- UX Research · Service Design · System Design
- User Flow · Information Architecture · Persona / CJM
- Figma · Prototyping · Visual Direction
- Web Development (React/Next.js, Vercel, SEO basics)
- AI-assisted workflow (Claude Code, prompt engineering)
- Presentation & Visual Content Design

---

## Contact
- **Phone**: 010-5003-2782
- **Email**: soondoree07@gmail.com / soondoree07@naver.com
- **GitHub**: github.com/soondoree07
- **Website**: junghyeok.com
- **Dev Environment**: ai.junghyeok.com
