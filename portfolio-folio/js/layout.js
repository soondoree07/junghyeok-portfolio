// 펼치기 — 화면(캔버스)이 먼저 검게 어두워져 책장을 지우고(view.js), 그 뒤 격자(한 줄 4권, 휴대폰 2권)에 책이 한 권씩 나타난다.
// 돌아갈 때도 먼저 어두워진 뒤, 책장 책들이 첫 등장처럼 아래에서 한 권씩 솟아오른다.
import * as THREE from 'three';
import { HIDDEN_Y } from './scene.js';
import { SWITCH_SECONDS } from './view.js';

const DEPTH = 9;           // 격자가 놓이는 카메라 앞 거리
const FADE_OUT = 7;          // 사라지는 빠르기 (1/초) — 한꺼번에 빠르게
const FADE_IN = 3.2;         // 나타나는 빠르기 (1/초) — 한 권씩 부드럽게
const GRID_DELAY = 0.1;      // 화면이 어두워진 뒤 첫 책이 나타날 때까지 (초)
const GRID_STAGGER = 0.08;   // 격자에서 다음 책이 나타나는 간격 (초)
const SHELF_DELAY = 0.1;      // 화면이 어두워진 뒤 첫 책이 솟기 시작할 때까지 (초)
const SHELF_STAGGER = 0.06;  // 책장으로 돌아올 때 뒤에서부터 한 권씩
const APPEAR_RISE = 0.25;    // 나타날 때 아래에서 올라오는 거리 (책 높이 비율)
const MAX_CONTENT_PX = 1100;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 화면 크기에 맞춘 격자 치수 (월드 단위) + 스크롤 높이(px)
export function gridMetrics(camera, bookCount) {
  const visibleH = 2 * DEPTH * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const visibleW = visibleH * camera.aspect;
  const pxToWorld = visibleH / innerHeight;
  const columns = innerWidth <= 760 ? 2 : 4;
  const contentW = Math.min(visibleW * 0.86, MAX_CONTENT_PX * pxToWorld);
  const cellW = contentW / columns;
  const scale = cellW * 0.74;
  const bookH = 1.5 * scale;
  const rowH = bookH + cellW * 0.26;
  const top = innerHeight * 0.17 * pxToWorld;
  const rows = Math.ceil(bookCount / columns);
  const contentH = top + rows * rowH + innerHeight * 0.1 * pxToWorld;
  return { visibleH, pxToWorld, columns, contentW, cellW, scale, bookH, rowH, top, contentPx: contentH / pxToWorld };
}

const gridPosition = new THREE.Vector3();
const cameraUp = new THREE.Vector3();

function placeOnGrid(number, metrics, scrollPx, camera) {
  const col = number % metrics.columns;
  const row = Math.floor(number / metrics.columns);
  const x = -metrics.contentW / 2 + metrics.cellW * (col + 0.5);
  const y = metrics.visibleH / 2 - metrics.top - metrics.rowH * row - metrics.bookH / 2 + scrollPx * metrics.pxToWorld;
  return gridPosition.set(x, y, -DEPTH).applyMatrix4(camera.matrixWorld);
}

function fade(value, target, dt) {
  if (reducedMotion) return target;
  const rate = target > value ? FADE_IN : FADE_OUT;
  return value + (target - value) * (1 - Math.exp(-rate * Math.min(dt, 0.05)));
}

// 책 겉면을 투명하게 — 다 보일 때는 투명 처리를 꺼서 겹친 책이 깨끗하게 그려지게 한다
function setOpacity(mesh, opacity) {
  mesh.visible = opacity > 0.005;
  const transparent = opacity < 0.995;
  mesh.material.forEach((m) => {
    if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true; }
    m.opacity = opacity;
  });
}

let shownLayout = 'shelf'; // 지금 실제로 그려지고 있는 배치

// 화면이 어두워진 동안(SWITCH_SECONDS)은 이전 배치를 그대로 두고, 그 뒤 새 배치로 바꾼다
function currentLayout(view, time) {
  if (time - view.changedAt >= SWITCH_SECONDS) return view.mode;
  return view.mode === 'grid' ? 'shelf' : 'grid';
}

// 새 배치로 바뀌는 순간 — 격자는 전부 안 보이게, 책장은 전부 바닥으로 내려 두고 한 권씩 다시 솟게
function onLayoutChange(books, layout, time) {
  books.forEach((book) => {
    book.spread.grid = 0;
    if (layout !== 'shelf') return;
    book.lift.y = HIDDEN_Y;
    book.lift.vy = 0;
    book.holdUntil = time + SHELF_DELAY + (books.length - 1 - book.number) * SHELF_STAGGER; // motion.js 가 이때까지 바닥에 둔다
  });
}

function placeGridBook(book, metrics, scrollPx, camera, ready, dt) {
  const { spread, group } = book;
  spread.grid = fade(spread.grid, ready ? 1 : 0, dt);
  // 격자 자리에서 아래로부터 살짝 올라오며 나타난다
  const rise = (1 - spread.grid) * APPEAR_RISE * metrics.bookH;
  group.position.copy(placeOnGrid(book.number, metrics, scrollPx, camera));
  group.position.addScaledVector(cameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion), -rise);
  group.quaternion.copy(camera.quaternion);
  group.scale.setScalar(metrics.scale);
  setOpacity(book.mesh, spread.grid);
}

function placeShelfBook(book) {
  const { group, shelf } = book;
  group.position.copy(shelf.position);
  group.quaternion.copy(shelf.quaternion);
  group.scale.setScalar(1);
  setOpacity(book.mesh, 1);
}

export function updateSpread(books, camera, metrics, view, scrollPx, time, dt) {
  const layout = currentLayout(view, time);
  if (layout !== shownLayout) { onLayoutChange(books, layout, time); shownLayout = layout; }
  const gridStart = view.changedAt + SWITCH_SECONDS + GRID_DELAY;
  books.forEach((book) => {
    if (layout === 'grid') placeGridBook(book, metrics, scrollPx, camera, time > gridStart + book.number * GRID_STAGGER, dt);
    else placeShelfBook(book);
  });
}
