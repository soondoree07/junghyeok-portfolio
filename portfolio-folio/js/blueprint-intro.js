// 첫 접속 인트로 — 연필 스케치가 그려지고, 잉크가 안쪽에서 번지며 흰 선의 청사진으로 바뀐 뒤 사이트가 열린다.
// 순서(프롬프트 Part 1 · 10 기준): 스케치 → 약 1.7초에 잉크 번짐(지나간 선은 흰 선으로 튕기듯 펴짐) → 치수 · 라벨 → 1.5초 멈춤 → 사이트
// 한 세션에 한 번만 나오고, 화면을 클릭하면 건너뛴다. 로고를 누르면 처음부터 다시 (replayFromStart).
// 3D 를 기다리지 않게 intro-entry.js 가 가장 먼저 시작한다. 그 전까지는 index.html 의 종이색 가림막(.intro-cover)이 덮는다.
import * as D from './blueprint-drawing.js';
import { el, fitViewBox, buildDefs, buildSketch, buildInk } from './blueprint-svg.js';
import { T, SKETCH, timers, later, drawStroke } from './blueprint-timing.js';
import { playSystem, playLabel } from './blueprint-annotations.js';


const SEEN_KEY = 'folio-blueprint-seen';
// 주소에 ?intro 를 붙이면 이미 봤어도 다시 보여 준다 (확인용)
function hasSeen() {
  if (new URLSearchParams(location.search).has('intro')) return false;
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
// 로고 — 탭에 처음 들어온 것처럼 인트로부터 다시 시작한다
export function replayFromStart() {
  try { sessionStorage.removeItem(SEEN_KEY); } catch { /* 저장이 막혀 있으면 주소로 강제 */ }
  location.href = `${location.pathname}?intro`;
}

function markSeen() { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* 저장이 막혀도 인트로는 동작 */ } }

function playSketch(strokes) {
  const counters = {};
  strokes.forEach(({ group, node }) => {
    const plan = SKETCH[group];
    const index = (counters[group] = (counters[group] ?? -1) + 1);
    drawStroke(node, plan.start + Math.floor(index / 2) * plan.step + (index % 2) * 60, plan.length);
  });
}

// 잉크가 가장 먼 모서리까지 닿는 반지름
function floodRadius(view) {
  const o = D.FLOOD_ORIGIN;
  return Math.max(...[[view.x, view.y], [view.x + view.width, view.y], [view.x, view.y + view.height], [view.x + view.width, view.y + view.height]]
    .map(([x, y]) => Math.hypot(x - o.x, y - o.y))) * 1.12;
}
const floodEase = (p) => 1 - (1 - p) ** 4;
// 번짐 가장자리가 점 (x, y) 에 닿는 시각(ms) — floodEase 를 거꾸로 풀어 구한다
function floodArrival(x, y, maxR) {
  const frac = Math.min(1, Math.hypot(x - D.FLOOD_ORIGIN.x, y - D.FLOOD_ORIGIN.y) / maxR);
  return T.flood + (1 - (1 - frac) ** 0.25) * T.floodLength;
}

// 잉크 번짐 — 빠르게 퍼지다 천천히 멈춘다
function playFlood(targets, view) {
  const o = D.FLOOD_ORIGIN;
  const maxR = floodRadius(view);
  const set = (s) => targets.forEach((t) => t.setAttribute('transform', `translate(${o.x} ${o.y}) scale(${Math.max(s, 0.001)})`));
  set(0);
  later(T.flood, () => {
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - start) / T.floodLength);
      set(maxR * floodEase(p));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

// 흰 선이 휜 채로 나타나 튕기듯 곧게 펴진다 — 번짐 가장자리가 선 가운데에 닿는 순간부터
function playStraighten(segments, view) {
  const maxR = floodRadius(view);
  segments.forEach(({ seg, node }, i) => {
    const mx = (seg.x1 + seg.x2) / 2; const my = (seg.y1 + seg.y2) / 2;
    const len = Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1);
    const nx = -(seg.y2 - seg.y1) / len; const ny = (seg.x2 - seg.x1) / len; // 선의 수직 방향
    const bow = (i % 2 ? -1 : 1) * Math.min(14, len * 0.04);                 // 처음 휜 정도
    const draw = (offset) => node.setAttribute('d', `M${seg.x1} ${seg.y1} Q${mx + nx * offset} ${my + ny * offset} ${seg.x2} ${seg.y2}`);
    draw(bow);
    later(floodArrival(mx, my, maxR), () => {
      const start = performance.now();
      const frame = (now) => {
        const t = (now - start) / 1000;
        draw(bow * Math.exp(-7 * t) * Math.cos(16 * t)); // 감쇠 진동 — 곧은 선을 살짝 지나쳤다 돌아온다
        if (t < 0.9) requestAnimationFrame(frame); else draw(0);
      };
      requestAnimationFrame(frame);
    });
  });
}

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'blueprint';
  overlay.setAttribute('aria-hidden', 'true');
  const svg = el('svg', { preserveAspectRatio: 'xMidYMid meet' }, overlay);
  document.body.append(overlay);
  return { overlay, svg };
}

// 라벨 글자 폭을 재서, 그림 영역이 라벨까지 다 들어오게 넓힌다
async function measureLabel(svg) {
  await document.fonts.load('600 84px "Barlow Semi Condensed"').catch(() => {});
  const probe = el('text', { x: 0, y: 0, class: 'bp-label' }, svg);
  probe.textContent = D.LABEL.text;
  const width = probe.getComputedTextLength();
  probe.remove();
  const box = { ...D.CONTENT_BOX };
  box.w = Math.max(box.w, D.LABEL.x + width + 20 - box.x);
  return { width, box };
}

// 인트로를 보여 주고, 사라지기 시작할 때 끝난다(그때 사이트 등장을 시작하면 자연스럽게 이어진다)
export async function playBlueprintIntro() {
  if (hasSeen()) { document.documentElement.classList.remove('intro-pending'); return; }
  markSeen();
  history.replaceState(null, '', location.pathname); // ?intro 는 주소에 남기지 않는다
  document.documentElement.classList.add('intro-playing');
  const { overlay, svg } = buildOverlay();
  const label = await measureLabel(svg);
  const view = fitViewBox(svg, label.box);
  const { edge, blobs } = buildDefs(svg, view);
  el('rect', { ...view, fill: D.COLORS.paper }, svg);
  el('rect', { ...view, fill: 'url(#bp-grid)' }, svg);
  playSketch(buildSketch(svg));
  const ink = buildInk(svg, view, edge);
  el('rect', { ...view, filter: 'url(#bp-grain)', 'pointer-events': 'none' }, svg); // 종이 결
  playFlood([...blobs, ink.tide], view);
  playStraighten(ink.segments, view);
  playSystem(ink.g);
  playLabel(ink.g, label.width);

  return new Promise((resolve) => {
    let done = false;
    const exit = () => {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      overlay.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-2vh)' }],
        { duration: T.exitLength, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
        .finished.then(() => overlay.remove());
      document.documentElement.classList.remove('intro-playing', 'intro-pending'); // 가림막도 함께 걷는다
      resolve();
    };
    overlay.addEventListener('click', exit);
    timers.push(setTimeout(exit, T.exit));
  });
}
