// 청사진 인트로의 치수 · 라벨 — 번짐이 끝난 뒤 중심 표시, 보조선, 치수선, 화살촉, 숫자, 그리고 이름 라벨.
import * as D from './blueprint-drawing.js';
import { el } from './blueprint-svg.js';
import { T, POP, later, animate, drawStroke } from './blueprint-timing.js';

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
      const p = Math.min(1, (now - start) / 650);
      show(Math.round(from + (count - from) * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

// 치수 체계 — 중심 표시가 튀어나오고, 보조선이 자라고, 치수선이 가운데서 양쪽으로, 화살촉, 숫자
export function playSystem(layer) {
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
export function playLabel(layer, labelWidth) {
  const { rule } = D.LABEL;
  const line = el('path', { d: `M${rule.x1} ${rule.y} H${rule.x1 + labelWidth}`, stroke: D.COLORS.ink, 'stroke-width': 1.4, pathLength: 1, 'stroke-dasharray': 1 }, layer);
  drawStroke(line, T.label, 420, 'cubic-bezier(.2,.8,.2,1)');
  el('clipPath', { id: 'bp-label-clip' }, layer).append(el('rect', { x: rule.x1 - 10, y: rule.y - 140, width: labelWidth + 40, height: 138 }));
  // 잘라내는 영역은 바깥 묶음에 고정 — 글자에 직접 걸면 영역도 글자와 같이 움직여 선 아래에서 보인다
  const clipped = el('g', { 'clip-path': 'url(#bp-label-clip)' }, layer);
  const text = el('text', { x: D.LABEL.x, y: D.LABEL.y, class: 'bp-label' }, clipped);
  text.textContent = D.LABEL.text;
  // 선 아래(잘리는 영역)에 완전히 숨겨 두었다가 올린다
  animate(text, [{ transform: 'translateY(120px)' }, { transform: 'translateY(0)' }], { delay: T.label + 260, duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
}
