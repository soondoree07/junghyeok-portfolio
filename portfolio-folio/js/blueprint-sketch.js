// 청사진 인트로의 연필 스케치 — blueprint-drawing.js 의 그림 데이터를 손으로 그은 듯한 선으로 바꾼다.
// 선은 두 번 겹쳐 긋고(두 번째는 연하게), 끝이 조금 넘치고, 살짝 휘거나 흔들린다.
import * as D from './blueprint-drawing.js';

// 정해진 씨앗으로 만드는 난수 — 새로고침해도 같은 손 선이 나오게
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const random = seededRandom(20261102);
const jitter = (amount) => (random() * 2 - 1) * amount;
const f = (n) => n.toFixed(1);

// 곡선 모음(시작점 + C/L 조각)을 SVG 경로 글자로 — 흰 잉크 도면이 그대로 쓴다
export function curvePath({ start, parts }) {
  return `M${start.join(' ')} ` + parts.map((p) => (p.C ? `C${p.C.map((pt) => pt.join(' ')).join(' ')}` : `L${p.L.join(' ')}`)).join(' ');
}

// 곡선 모음을 촘촘한 점 목록으로 (손 선 흔들림을 얹기 위해)
function sampleCurve({ start, parts }) {
  const points = [start];
  let from = start;
  parts.forEach((p) => {
    for (let i = 1; i <= 14; i++) {
      const t = i / 14;
      if (p.L) { points.push([from[0] + (p.L[0] - from[0]) * t, from[1] + (p.L[1] - from[1]) * t]); continue; }
      const [c1, c2, end] = p.C; const u = 1 - t;
      points.push([0, 1].map((k) => u * u * u * from[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * end[k]));
    }
    from = p.L ?? p.C[2];
  });
  return points;
}

// 손으로 그은 직선 — 양끝이 조금 넘치고 가운데가 살짝 휜다
function sketchLine(x1, y1, x2, y2) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len; const uy = (y2 - y1) / len;
  const over1 = 3 + random() * 8; const over2 = 3 + random() * 8;
  const bow = jitter(Math.min(5, len * 0.012));
  const sx = x1 - ux * over1; const sy = y1 - uy * over1;
  const ex = x2 + ux * over2; const ey = y2 + uy * over2;
  return `M${f(sx)} ${f(sy)} Q${f((sx + ex) / 2 - uy * bow)} ${f((sy + ey) / 2 + ux * bow)} ${f(ex)} ${f(ey)}`;
}

// 손으로 그은 곡선 — 느린 흔들림을 얹고, 양끝을 진행 방향으로 조금 넘긴다
function sketchCurve(curve) {
  const pts = sampleCurve(curve);
  const phase = random() * 6; const amp = 1.2 + random() * 1.4;
  const out = pts.map(([x, y], i) => {
    const a = pts[Math.max(0, i - 1)]; const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const wobble = Math.sin(i * 0.23 + phase) * amp;
    return [x - ((b[1] - a[1]) / len) * wobble, y + ((b[0] - a[0]) / len) * wobble];
  });
  const extend = (p, q, by) => { const len = Math.hypot(p[0] - q[0], p[1] - q[1]) || 1; return [p[0] + ((p[0] - q[0]) / len) * by, p[1] + ((p[1] - q[1]) / len) * by]; };
  out.unshift(extend(out[0], out[1], 4 + random() * 7));
  out.push(extend(out[out.length - 1], out[out.length - 2], 4 + random() * 7));
  return `M${out.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}`;
}

// 손으로 그린 원 — 한 바퀴를 조금 넘겨 겹친다
function sketchCircle(cx, cy, r) {
  const start = random() * Math.PI * 2; const wobble = random() * Math.PI;
  const points = [];
  for (let i = 0; i <= 40; i++) {
    const a = start + (i / 40) * (Math.PI * 2 + 0.45);
    const rr = r * (1 + 0.02 * Math.sin(a * 3 + wobble)) + i * 0.05;
    points.push(`${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`);
  }
  return `M${points.join(' L')}`;
}

// 스케치 순서 — 보조축 → 외곽선 → 이음 원 → 빗금. group 은 그리는 단계(시간표는 blueprint-timing.js)
export function sketchStrokes() {
  const strokes = [];
  const add = (group, make) => [1, 0.5].forEach((weight) => strokes.push({ group, weight, d: make() }));
  D.AXES.forEach(([x1, y1, x2, y2]) => add('construction', () => sketchLine(x1, y1, x2, y2)));
  D.BODY_CURVES.forEach((curve) => add('outline', () => sketchCurve(curve)));
  D.OUTLINE_SEGMENTS.forEach((s) => add('outline', () => sketchLine(s.x1, s.y1, s.x2, s.y2)));
  D.DPAD_CAPS.forEach(([x1, y1, x2, y2]) => add('outline', () => sketchLine(x1, y1, x2, y2)));
  D.CIRCLES.forEach((c) => add('joint', () => sketchCircle(c.x, c.y, c.r)));
  const { from, to, count, dx, dy } = D.HATCH;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = from[0] + (to[0] - from[0]) * t; const y = from[1] + (to[1] - from[1]) * t;
    strokes.push({ group: 'hatch', weight: 0.8, d: sketchLine(x, y, x + dx, y + dy) });
  }
  return strokes;
}
