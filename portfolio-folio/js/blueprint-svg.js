// 청사진 인트로의 SVG 만들기 — 종이 · 격자 · 결 필터, 잉크 번짐 마스크, 그래파이트 스케치 층, 흰 잉크 도면 층.
// 시간표와 움직임은 blueprint-intro.js 가 맡는다.
import * as D from './blueprint-drawing.js';

const NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  parent?.append(node);
  return node;
}

// 화면 비율에 맞춰 그림 영역이 다 들어오게 viewBox 를 넓힌다
function fitViewBox(svg, box = D.CONTENT_BOX) {
  const pad = 60;
  const aspect = innerWidth / innerHeight;
  let w = box.w + pad * 2; let h = box.h + pad * 2;
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
  const x = box.x + box.w / 2 - w / 2; const y = box.y + box.h / 2 - h / 2;
  svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  return { x, y, width: w, height: h }; // SVG 속성 이름 그대로 — rect · mask 에 바로 펼쳐 쓴다
}

// 잉크 가장자리 — 고르지 않은 원 (반지름 1 기준)
function wetEdgePath() {
  const points = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 1 + 0.06 * Math.sin(a * 5 + 1.3) + 0.035 * Math.sin(a * 11 + 0.4) + 0.02 * Math.sin(a * 23);
    points.push(`${(Math.cos(a) * r).toFixed(4)} ${(Math.sin(a) * r).toFixed(4)}`);
  }
  return `M${points.join(' L')} Z`;
}

function buildDefs(svg, view) {
  const defs = el('defs', {}, svg);
  const grid = el('pattern', { id: 'bp-grid', width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, defs);
  el('path', { d: 'M24 0 H0 V24', fill: 'none', stroke: D.COLORS.grid, 'stroke-width': 0.6, opacity: 0.35 }, grid);
  const tooth = el('filter', { id: 'bp-tooth', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 2, result: 'n' }, tooth);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 1.6 }, tooth);
  const grain = el('filter', { id: 'bp-grain' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.75, numOctaves: 3, stitchTiles: 'stitch' }, grain);
  el('feColorMatrix', { values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0' }, grain);
  const edge = wetEdgePath();
  const inside = el('mask', { id: 'bp-inside', maskUnits: 'userSpaceOnUse', ...view }, defs);
  const outside = el('mask', { id: 'bp-outside', maskUnits: 'userSpaceOnUse', ...view }, defs);
  el('rect', { ...view, fill: '#fff' }, outside);
  const blobIn = el('path', { d: edge, fill: '#fff' }, inside);
  const blobOut = el('path', { d: edge, fill: '#000' }, outside);
  return { edge, blobs: [blobIn, blobOut] };
}

function buildSketch(svg) {
  const g = el('g', { mask: 'url(#bp-outside)', filter: 'url(#bp-tooth)', fill: 'none', stroke: D.COLORS.graphite, 'stroke-linecap': 'round' }, svg);
  return D.sketchStrokes().map((s) => ({ ...s, node: el('path', { d: s.d, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, 'stroke-width': 1.7, opacity: 0.85 * s.weight }, g) }));
}

function buildInk(svg, view, edge) {
  const g = el('g', { mask: 'url(#bp-inside)' }, svg);
  el('rect', { ...view, fill: D.COLORS.blue }, g);
  el('rect', { ...view, filter: 'url(#bp-grain)', opacity: 0.6 }, g);
  const tide = el('path', { d: edge, fill: 'none', stroke: D.COLORS.tide, 'stroke-width': 22, 'vector-effect': 'non-scaling-stroke' }, g);
  const lines = el('g', { fill: 'none', stroke: D.COLORS.ink, 'stroke-width': 2.2, 'stroke-linecap': 'square' }, g);
  D.INK_LINES.forEach((d) => el('path', { d }, lines));
  // 휜 채로 나타났다 곧게 펴질 외곽선 — 처음 모양은 blueprint-intro.js 가 정한다
  const segments = D.OUTLINE_SEGMENTS.map((seg) => ({ seg, node: el('path', {}, lines) }));
  el('circle', { cx: D.INK_CIRCLE.x, cy: D.INK_CIRCLE.y, r: D.INK_CIRCLE.r }, lines);
  D.CENTER_LINES.forEach((d) => el('path', { d, 'stroke-width': 1.2, 'stroke-dasharray': '26 6 3 6' }, lines));
  return { g, lines, tide, segments };
}

export { el, fitViewBox, buildDefs, buildSketch, buildInk };
