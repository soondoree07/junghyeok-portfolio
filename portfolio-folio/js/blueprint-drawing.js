// 청사진 인트로의 그림 데이터 — 위에서 본 게임 컨트롤러 한 대. 좌표는 SVG 사용자 단위.
// 스케치(손 선)는 blueprint-sketch.js 가, 흰 잉크 도면은 blueprint-svg.js 가 이 데이터로 그린다.
// 스타일 출처: ~/animation_styles/애니메이션_스타일_카드.md — Part 1 · 10. Pencil to Blueprint

export const COLORS = {
  paper: '#ECECE6', grid: '#7FA3C4', graphite: '#25262B',
  blue: '#1C4C8F', tide: '#143C76', ink: '#EEF4FB',
};

export const CENTER = { x: 820, y: 490 };                    // 십자키와 버튼을 잇는 축의 교차점 (중심 표시)
export const EMBLEM = CENTER;                                  // 치수 단계의 중심 표시 자리 (blueprint-annotations.js)
export const FLOOD_ORIGIN = { x: 820, y: 530 };               // 잉크가 번지기 시작하는 곳 (몸통 안쪽)
export const CONTENT_BOX = { x: 480, y: 170, w: 980, h: 600 }; // 화면 안에 꼭 들어와야 하는 영역
const TOP = 400;
const BOTTOM = 600;
const GRIP_BOTTOM = 722;
const LEFT = 500;
const RIGHT = 1140;

// 몸통 곡선 — 오른쪽 · 왼쪽 반쪽(좌우 대칭). [시작점, ...{C: [c1, c2, 끝]} | {L: 끝}]
export const BODY_CURVES = [
  { start: [1000, TOP], parts: [
    { C: [[1060, 400], [1090, 430], [1100, 500]] }, { L: [1130, 640] },
    { C: [[1140, 700], [1090, 730], [1050, 700]] }, { L: [980, 630] },
    { C: [[960, 610], [940, 600], [920, BOTTOM]] },
  ] },
  { start: [720, BOTTOM], parts: [
    { C: [[700, 600], [680, 610], [660, 630]] }, { L: [590, 700] },
    { C: [[550, 730], [500, 700], [510, 640]] }, { L: [540, 500] },
    { C: [[550, 430], [580, 400], [640, TOP]] },
  ] },
];

const DPAD = { x: 680, y: CENTER.y, arm: 36, half: 12 };
// 곧은 선 — 스케치로 그었다가, 잉크가 지나가면 흰 선으로 휜 채 나타나 튕기듯 곧게 펴진다
export const OUTLINE_SEGMENTS = [
  { x1: 640, y1: TOP, x2: 1000, y2: TOP },               // 몸통 윗변
  { x1: 720, y1: BOTTOM, x2: 920, y2: BOTTOM },           // 몸통 아랫변 (두 손잡이 사이)
  { x1: DPAD.x - DPAD.arm, y1: DPAD.y - DPAD.half, x2: DPAD.x + DPAD.arm, y2: DPAD.y - DPAD.half }, // 십자키 가로 위
  { x1: DPAD.x - DPAD.arm, y1: DPAD.y + DPAD.half, x2: DPAD.x + DPAD.arm, y2: DPAD.y + DPAD.half }, // 십자키 가로 아래
  { x1: DPAD.x - DPAD.half, y1: DPAD.y - DPAD.arm, x2: DPAD.x - DPAD.half, y2: DPAD.y + DPAD.arm }, // 십자키 세로 왼
  { x1: DPAD.x + DPAD.half, y1: DPAD.y - DPAD.arm, x2: DPAD.x + DPAD.half, y2: DPAD.y + DPAD.arm }, // 십자키 세로 오른
];
// 십자키 끝 마감 (짧아서 펴짐 없이 바로 흰 선)
export const DPAD_CAPS = [
  [DPAD.x - DPAD.arm, DPAD.y - DPAD.half, DPAD.x - DPAD.arm, DPAD.y + DPAD.half],
  [DPAD.x + DPAD.arm, DPAD.y - DPAD.half, DPAD.x + DPAD.arm, DPAD.y + DPAD.half],
  [DPAD.x - DPAD.half, DPAD.y - DPAD.arm, DPAD.x + DPAD.half, DPAD.y - DPAD.arm],
  [DPAD.x - DPAD.half, DPAD.y + DPAD.arm, DPAD.x + DPAD.half, DPAD.y + DPAD.arm],
];

// 원 — 아날로그 스틱 두 개(바깥 · 안), 오른쪽 버튼 네 개, 가운데 작은 버튼 두 개
const FACE = { x: 960, y: CENTER.y, gap: 34, r: 14 };
export const CIRCLES = [
  { x: 755, y: 560, r: 32 }, { x: 755, y: 560, r: 18 },
  { x: 885, y: 560, r: 32 }, { x: 885, y: 560, r: 18 },
  { x: FACE.x, y: FACE.y - FACE.gap, r: FACE.r }, { x: FACE.x + FACE.gap, y: FACE.y, r: FACE.r },
  { x: FACE.x, y: FACE.y + FACE.gap, r: FACE.r }, { x: FACE.x - FACE.gap, y: FACE.y, r: FACE.r },
  { x: 800, y: 452, r: 7 }, { x: 840, y: 452, r: 7 },
];

// 보조축 — 스케치에서는 연한 직선, 도면에서는 일점쇄선 중심선
export const AXES = [
  [CENTER.x, 360, CENTER.x, 745],
  [LEFT - 20, CENTER.y, RIGHT + 20, CENTER.y],
];

// 치수 — 보조선(extension) · 치수선(가운데에서 양쪽으로) · 화살촉 · 숫자
export const DIMENSIONS = [
  {
    id: 'width', extensions: [`M${LEFT} ${TOP + 100} V${TOP - 62}`, `M${RIGHT} ${TOP + 100} V${TOP - 62}`],
    from: { x: LEFT, y: TOP - 48 }, to: { x: RIGHT, y: TOP - 48 },
    text: { x: CENTER.x, y: TOP - 62, anchor: 'middle', count: 15, suffix: ' PROJECTS' },
  },
  {
    id: 'height', extensions: [`M${1010} ${TOP} H${RIGHT + 82}`, `M${1060} ${GRIP_BOTTOM} H${RIGHT + 82}`],
    from: { x: RIGHT + 64, y: TOP }, to: { x: RIGHT + 64, y: GRIP_BOTTOM },
    text: { x: RIGHT + 86, y: (TOP + GRIP_BOTTOM) / 2 + 16, anchor: 'start', count: 2026, from: 2000, prefix: '2025 – ' },
  },
];

// 라벨 — 3~5단어(프롬프트 기준), 그림 왼쪽 끝에 맞춘다. 가는 선 길이는 글자 폭을 재서 맞춘다(blueprint-intro.js)
export const LABEL = { x: LEFT, y: 258, rule: { x1: LEFT, y: 280 }, text: 'PARK JUNGHYEOK PORTFOLIO' };

// 손잡이 빗금 자리 — 왼쪽 손잡이 바깥 선을 따라
export const HATCH = { from: [550, 520], to: [524, 652], count: 8, dx: 24, dy: -14 };
