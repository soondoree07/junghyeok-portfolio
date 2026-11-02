// 첫 접속 인트로 — 연필 스케치가 그려지고, 잉크가 안쪽에서 번지며 흰 선의 청사진으로 바뀐 뒤 사이트가 열린다.
// 순서: 스케치(약 1.8초) → 0.3초 멈춤 → 잉크 번짐 → 치수 · 라벨 → 1.5초 멈춤 → 사라지며 사이트 시작
// 한 세션에 한 번만 나오고, 누르거나 키를 치면 건너뛴다.
import * as D from './blueprint-drawing.js';
import { el, fitViewBox, buildDefs, buildSketch, buildInk } from './blueprint-svg.js';

const SEEN_KEY = 'folio-blueprint-seen';
const HAND = 'cubic-bezier(.45,0,.25,1)'; // 손처럼 천천히 시작해 천천히 멈춤
const POP = 'cubic-bezier(.3,1.6,.5,1)';  // 작게 튀어나옴
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 시간표 (ms)
const T = { outline: 380, joint: 1050, hatch: 1300, flood: 2130, floodLength: 1100, system: 2950, label: 3500, exit: 5600, exitLength: 650 };
const SKETCH = { // 단계별 시작 · 한 획 길이 · 다음 획 간격
  construction: { start: 0, length: 380, step: 160 }, outline: { start: T.outline, length: 300, step: 110 },
  joint: { start: T.joint, length: 420, step: 180 }, hatch: { start: T.hatch, length: 120, step: 34 },
};

const timers = [];
const later = (ms, fn) => timers.push(setTimeout(fn, reducedMotion ? 0 : ms));
const animate = (node, keyframes, options) => node.animate(keyframes, { fill: 'both', ...options, duration: reducedMotion ? 0 : options.duration });
const drawStroke = (node, delay, duration, easing = HAND) => animate(node, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay, duration, easing });

function hasSeen() { try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; } }
function markSeen() { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* 저장이 막혀도 인트로는 동작 */ } }

function playSketch(strokes) {
  const counters = {};
  strokes.forEach(({ group, node }) => {
    const plan = SKETCH[group];
    const index = (counters[group] = (counters[group] ?? -1) + 1);
    drawStroke(node, plan.start + Math.floor(index / 2) * plan.step + (index % 2) * 60, plan.length);
  });
}

// 잉크 번짐 — 빠르게 퍼지다 천천히 멈춘다
function playFlood(targets, view) {
  const o = D.FLOOD_ORIGIN;
  const maxR = Math.max(...[[view.x, view.y], [view.x + view.width, view.y], [view.x, view.y + view.height], [view.x + view.width, view.y + view.height]]
    .map(([x, y]) => Math.hypot(x - o.x, y - o.y))) * 1.12;
  const set = (s) => targets.forEach((t) => t.setAttribute('transform', `translate(${o.x} ${o.y}) scale(${Math.max(s, 0.001)})`));
  set(0);
  later(T.flood, () => {
    const start = performance.now();
    const frame = (now) => {
      const p = reducedMotion ? 1 : Math.min(1, (now - start) / T.floodLength);
      set(maxR * (1 - (1 - p) ** 4));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

function pop(node, delay) {
  node.style.transformBox = 'fill-box'; node.style.transformOrigin = 'center';
  animate(node, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { delay, duration: 260, easing: POP });
}

function arrow(parent, tip, toward) {
  const len = Math.hypot(toward.x - tip.x, toward.y - tip.y);
  const ux = (toward.x - tip.x) / len; const uy = (toward.y - tip.y) / len;
  const bx = tip.x + ux * 16; const by = tip.y + uy * 16;
  return el('path', { d: `M${tip.x} ${tip.y} L${bx - uy * 5} ${by + ux * 5} L${bx + uy * 5} ${by - ux * 5} Z`, fill: D.COLORS.ink, stroke: 'none' }, parent);
}

function tickNumber(node, dim, delay) {
  const { from = 0, count, prefix = '', suffix = '' } = dim.text;
  const show = (n) => { node.textContent = `${prefix}${n}${suffix}`; };
  show(from);
  later(delay, () => {
    const start = performance.now();
    const frame = (now) => {
      const p = reducedMotion ? 1 : Math.min(1, (now - start) / 650);
      show(Math.round(from + (count - from) * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

// 치수 체계 — 중심 표시가 튀어나오고, 보조선이 자라고, 치수선이 가운데서 양쪽으로, 화살촉, 숫자
function playSystem(layer) {
  const t0 = T.system;
  const g = el('g', { fill: 'none', stroke: D.COLORS.ink, 'stroke-width': 1.4 }, layer);
  pop(el('path', { d: `M${D.EMBLEM.x - 12} ${D.EMBLEM.y} H${D.EMBLEM.x + 12} M${D.EMBLEM.x} ${D.EMBLEM.y - 12} V${D.EMBLEM.y + 12}`, 'stroke-width': 2 }, g), t0);
  D.DIMENSIONS.forEach((dim, i) => {
    const t = t0 + 120 + i * 160;
    dim.extensions.forEach((d) => drawStroke(el('path', { d, pathLength: 1, 'stroke-dasharray': 1 }, g), t, 220));
    const mid = { x: (dim.from.x + dim.to.x) / 2, y: (dim.from.y + dim.to.y) / 2 };
    [dim.from, dim.to].forEach((end) => {
      drawStroke(el('path', { d: `M${mid.x} ${mid.y} L${end.x} ${end.y}`, pathLength: 1, 'stroke-dasharray': 1 }, g), t + 220, 320, 'cubic-bezier(.2,.8,.2,1)');
      pop(arrow(g, end, mid), t + 520);
    });
    const text = el('text', { x: dim.text.x, y: dim.text.y, 'text-anchor': dim.text.anchor, class: 'bp-measure' }, layer);
    animate(text, [{ opacity: 0 }, { opacity: 1 }], { delay: t + 480, duration: 200, easing: 'linear' });
    tickNumber(text, dim, t + 480);
  });
}

// 라벨 — 가는 선이 먼저 그어지고, 그 위로 이름이 올라온다
function playLabel(layer) {
  const { rule } = D.LABEL;
  const line = el('path', { d: `M${rule.x1} ${rule.y} H${rule.x2}`, stroke: D.COLORS.ink, 'stroke-width': 1.4, pathLength: 1, 'stroke-dasharray': 1 }, layer);
  drawStroke(line, T.label, 420, 'cubic-bezier(.2,.8,.2,1)');
  el('clipPath', { id: 'bp-label-clip' }, layer).append(el('rect', { x: rule.x1 - 10, y: rule.y - 140, width: 1400, height: 138 }));
  // 잘라내는 영역은 바깥 묶음에 고정 — 글자에 직접 걸면 영역도 글자와 같이 움직여 선 아래에서 보인다
  const clipped = el('g', { 'clip-path': 'url(#bp-label-clip)' }, layer);
  const text = el('text', { x: D.LABEL.x, y: D.LABEL.y, class: 'bp-label' }, clipped);
  text.textContent = D.LABEL.text;
  // 선 아래(잘리는 영역)에 완전히 숨겨 두었다가 올린다
  animate(text, [{ transform: 'translateY(120px)' }, { transform: 'translateY(0)' }], { delay: T.label + 260, duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
}

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'blueprint';
  overlay.setAttribute('aria-hidden', 'true');
  const svg = el('svg', { preserveAspectRatio: 'xMidYMid meet' }, overlay);
  const skip = document.createElement('button');
  skip.className = 'blueprint-skip'; skip.type = 'button'; skip.textContent = '건너뛰기';
  overlay.append(skip);
  document.body.append(overlay);
  return { overlay, svg };
}

// 인트로를 보여 주고, 사라지기 시작할 때 끝난다(그때 사이트 등장을 시작하면 자연스럽게 이어진다)
export function playBlueprintIntro() {
  if (hasSeen()) return Promise.resolve();
  markSeen();
  document.documentElement.classList.add('intro-playing');
  const { overlay, svg } = buildOverlay();
  const view = fitViewBox(svg);
  const { edge, blobs } = buildDefs(svg, view);
  el('rect', { ...view, fill: D.COLORS.paper }, svg);
  el('rect', { ...view, fill: 'url(#bp-grid)' }, svg);
  playSketch(buildSketch(svg));
  const ink = buildInk(svg, view, edge);
  el('rect', { ...view, filter: 'url(#bp-grain)', 'pointer-events': 'none' }, svg); // 종이 결
  playFlood([...blobs, ink.tide], view);
  later(T.flood + 300, () => overlay.classList.add('is-blue'));
  playSystem(ink.g);
  playLabel(ink.g);

  return new Promise((resolve) => {
    let done = false;
    const exit = () => {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      removeEventListener('keydown', exit);
      overlay.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-2vh)' }],
        { duration: T.exitLength, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
        .finished.then(() => overlay.remove());
      document.documentElement.classList.remove('intro-playing');
      resolve();
    };
    overlay.addEventListener('click', exit);
    addEventListener('keydown', exit);
    timers.push(setTimeout(exit, reducedMotion ? 1200 : T.exit)); // 움직임 줄이기면 완성된 도면만 잠깐
  });
}
