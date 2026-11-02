// 청사진 인트로의 그림 — 그래파이트 스케치(손 선)와 흰 잉크 도면(곧은 선 · 치수)을 SVG 로 만든다.
// 물체: 정면에서 본 양장본 책 한 권. 좌표는 SVG 사용자 단위 (blueprint-intro.js 가 화면 비율에 맞춰 viewBox 를 정한다).
// 스타일 출처: ~/animation_styles/애니메이션_스타일_카드.md — Part 1 · 10. Pencil to Blueprint

export const COLORS = {
  paper: '#ECECE6', grid: '#7FA3C4', graphite: '#25262B',
  blue: '#1C4C8F', tide: '#143C76', ink: '#EEF4FB',
};

export const BOOK = { x: 640, y: 250, w: 330, h: 520, hinge: 30 };
export const GROUND_Y = BOOK.y + BOOK.h;
export const EMBLEM = { x: 820, y: 560, r: 70 };
export const CONTENT_BOX = { x: 560, y: 40, w: 740, h: 780 }; // 화면 안에 꼭 들어와야 하는 영역
export const FLOOD_ORIGIN = { x: EMBLEM.x, y: EMBLEM.y };      // 잉크가 번지기 시작하는 곳 (그림 안쪽)

const right = BOOK.x + BOOK.w;

// 책 외곽선 — 왼쪽 · 위 · 오른쪽 · 책등 경계 · 표지 제목 칸 위아래 (바닥은 땅선이 맡는다)
export const OUTLINE_SEGMENTS = [
  { x1: BOOK.x, y1: GROUND_Y, x2: BOOK.x, y2: BOOK.y },
  { x1: BOOK.x, y1: BOOK.y, x2: right, y2: BOOK.y },
  { x1: right, y1: BOOK.y, x2: right, y2: GROUND_Y },
  { x1: BOOK.x + BOOK.hinge, y1: BOOK.y, x2: BOOK.x + BOOK.hinge, y2: GROUND_Y },
  { x1: 705, y1: 320, x2: 935, y2: 320 },
  { x1: 705, y1: 395, x2: 935, y2: 395 },
];

// 정해진 씨앗으로 만드는 난수 — 새로고침해도 같은 손 선이 나오게
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const random = seededRandom(20261102);
const jitter = (amount) => (random() * 2 - 1) * amount;

// 손으로 그은 직선 — 양끝이 조금 넘치고 가운데가 살짝 휜다
function sketchLine(x1, y1, x2, y2) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len; const uy = (y2 - y1) / len;
  const over1 = 4 + random() * 9; const over2 = 4 + random() * 9;
  const bow = jitter(Math.min(5, len * 0.012));
  const sx = x1 - ux * over1; const sy = y1 - uy * over1;
  const ex = x2 + ux * over2; const ey = y2 + uy * over2;
  const cx = (sx + ex) / 2 - uy * bow; const cy = (sy + ey) / 2 + ux * bow;
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

// 손으로 그린 원 — 한 바퀴를 조금 넘겨 겹친다
function sketchCircle(cx, cy, r) {
  const start = random() * Math.PI * 2;
  const wobble = random() * Math.PI;
  const points = [];
  for (let i = 0; i <= 44; i++) {
    const a = start + (i / 44) * (Math.PI * 2 + 0.45);
    const rr = r * (1 + 0.018 * Math.sin(a * 3 + wobble)) + i * 0.06;
    points.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${points.join(' L')}`;
}

// 선 하나를 두 번 긋는다 (두 번째는 연하게)
const doubled = (make) => [{ d: make(), weight: 1 }, { d: make(), weight: 0.5 }];

// 스케치 순서 — 땅선 · 보조축 → 외곽선 → 이음 원 → 빗금. group 은 그리는 단계(시간표는 blueprint-intro.js)
export function sketchStrokes() {
  const strokes = [];
  const add = (group, make) => doubled(make).forEach((s) => strokes.push({ group, ...s }));
  add('construction', () => sketchLine(BOOK.x - 70, GROUND_Y, right + 130, GROUND_Y));
  add('construction', () => sketchLine(EMBLEM.x, BOOK.y - 40, EMBLEM.x, GROUND_Y + 25));
  add('construction', () => sketchLine(BOOK.x - 30, EMBLEM.y, right + 30, EMBLEM.y));
  OUTLINE_SEGMENTS.forEach((s) => add('outline', () => sketchLine(s.x1, s.y1, s.x2, s.y2)));
  add('joint', () => sketchCircle(EMBLEM.x, EMBLEM.y, EMBLEM.r));
  add('joint', () => sketchCircle(EMBLEM.x, EMBLEM.y, EMBLEM.r + 22));
  for (let y = BOOK.y + 40; y < GROUND_Y - 10; y += 24) {
    strokes.push({ group: 'hatch', weight: 0.8, d: sketchLine(BOOK.x + 4, y, BOOK.x + BOOK.hinge - 4, y - 18) });
  }
  return strokes;
}

// 흰 잉크 도면 — 땅선은 번진 곳에 바로 보이고, 외곽선(OUTLINE_SEGMENTS)은 휜 채로 나타났다가 튕기듯 곧게 펴진다
export const INK_LINES = [`M${BOOK.x - 70} ${GROUND_Y} H${right + 130}`];
export const INK_CIRCLE = EMBLEM;
// 보조축은 도면에서 일점쇄선 중심선이 된다
export const CENTER_LINES = [
  `M${EMBLEM.x} ${BOOK.y - 40} V${GROUND_Y + 25}`,
  `M${BOOK.x - 30} ${EMBLEM.y} H${right + 30}`,
];

// 치수 — 보조선(extension) · 치수선(가운데에서 양쪽으로) · 화살촉 · 숫자
export const DIMENSIONS = [
  {
    id: 'width', extensions: [`M${BOOK.x} ${BOOK.y - 8} V${BOOK.y - 62}`, `M${right} ${BOOK.y - 8} V${BOOK.y - 62}`],
    from: { x: BOOK.x, y: BOOK.y - 48 }, to: { x: right, y: BOOK.y - 48 },
    text: { x: (BOOK.x + right) / 2, y: BOOK.y - 62, anchor: 'middle', count: 15, suffix: ' PROJECTS' },
  },
  {
    id: 'height', extensions: [`M${right + 8} ${BOOK.y} H${right + 80}`, `M${right + 8} ${GROUND_Y} H${right + 80}`],
    from: { x: right + 62, y: BOOK.y }, to: { x: right + 62, y: GROUND_Y },
    text: { x: right + 82, y: EMBLEM.y - 10, anchor: 'start', count: 2026, from: 2000, prefix: '2025 – ' },
  },
];

// 라벨 — 3~5단어(프롬프트 기준). 가는 선 길이는 글자 폭을 재서 맞춘다(blueprint-intro.js)
export const LABEL = { x: BOOK.x, y: 118, rule: { x1: BOOK.x, y: 140 }, text: 'PARK JUNGHYEOK PORTFOLIO' };
