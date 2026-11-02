// 펼치기 — 프로젝트 책을 카메라 정면의 격자(한 줄 4권, 휴대폰 2권)로 옮긴다.
// 책마다 0(책장) ↔ 1(격자) 진행값을 스프링으로 움직이고, 두 자리 사이를 섞어서 놓는다.
import * as THREE from 'three';

const DEPTH = 9;           // 격자가 놓이는 카메라 앞 거리
const STIFFNESS = 130;     // 반응 약 0.55초
const DAMPING = 22.8;      // 감쇠비 1 — 넘치지 않고 멈춘다
const STAGGER = 0.035;     // 한 권씩 차례로 출발
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

function placeOnGrid(number, metrics, scrollPx, camera) {
  const col = number % metrics.columns;
  const row = Math.floor(number / metrics.columns);
  const x = -metrics.contentW / 2 + metrics.cellW * (col + 0.5);
  const y = metrics.visibleH / 2 - metrics.top - metrics.rowH * row - metrics.bookH / 2 + scrollPx * metrics.pxToWorld;
  return gridPosition.set(x, y, -DEPTH).applyMatrix4(camera.matrixWorld);
}

// 출발 차례가 된 책만 목표를 바꾼다 — 중간에 되돌려도 각자 지금 자리에서 돌아간다
function updateTarget(book, view, time, projectCount) {
  const order = view.mode === 'grid' ? book.number : projectCount - 1 - book.number;
  if (time - view.changedAt > order * STAGGER) book.spread.target = view.mode === 'grid' ? 1 : 0;
}

function stepSpread(spread, dt) {
  if (reducedMotion) { spread.t = spread.target; spread.v = 0; return; }
  const h = Math.min(dt, 0.05) / 4;
  for (let k = 0; k < 4; k++) {
    spread.v += ((spread.target - spread.t) * STIFFNESS - spread.v * DAMPING) * h;
    spread.t += spread.v * h;
  }
}

export function updateSpread(books, camera, metrics, view, scrollPx, time, dt) {
  const projectBooks = books.filter((b) => b.project);
  projectBooks.forEach((book) => {
    updateTarget(book, view, time, projectBooks.length);
    stepSpread(book.spread, dt);
    const t = book.spread.t;
    const { group, shelf } = book;
    if (Math.abs(t) < 1e-4) {
      group.position.copy(shelf.position);
      group.quaternion.copy(shelf.quaternion);
      group.scale.setScalar(1);
      return;
    }
    group.position.lerpVectors(shelf.position, placeOnGrid(book.number, metrics, scrollPx, camera), t);
    group.quaternion.slerpQuaternions(shelf.quaternion, camera.quaternion, t);
    group.scale.setScalar(THREE.MathUtils.lerp(1, metrics.scale, t));
  });
}
