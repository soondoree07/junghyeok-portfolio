// 움직임 — 포인터 웨이브로 목표 높이를 정하고, 책마다 스프링으로 따라간다.
import * as THREE from 'three';
import { HIDDEN_Y } from './scene.js';

const STIFFNESS = 42;
const DAMPING = 12;   // 감쇠비 약 0.93 — 거의 튀지 않고 부드럽게 멈춘다
const SUBSTEPS = 4;
const MAX_LIFT = 1.0;
const STRIP_SPREAD = 0.7;    // 물결 폭 (보이는 띠 너비 배수) — 옆 책은 약 13%만 올라온다
const VERTICAL_SPREAD = 0.3; // 위아래로 얼마나 떨어져도 반응할지 (화면 높이 비율)
const FORWARD_RATIO = 0.85;  // 올라갈 때 앞으로 나오는 비율 — 앞 책보다 앞에 서서 제목이 가려지지 않게
const CURSOR_SMOOTHING = 10; // 커서 따라가기 속도 (클수록 빠름) — 책 사이를 지날 때 툭 끊기지 않게
const SELECTED_LIFT = 0.95;
const GRID_HOVER_PUSH = 0.35; // 펼친 화면에서 가리킨 책이 앞으로 나오는 정도
const GRID_FILLER_Y = -7;     // 펼친 화면에서 장식 책이 가라앉는 깊이 (화면 밖까지)
const IDLE_AFTER = 4; // 초
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;

export const pointer = { x: 0, y: 0, inside: false, lastMove: -Infinity };

export function trackPointer() {
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.inside = true; pointer.lastMove = performance.now() / 1000;
  });
  document.documentElement.addEventListener('pointerleave', () => { pointer.inside = false; });
  addEventListener('blur', () => { pointer.inside = false; });
}

const probe = new THREE.Vector3();
const restCorner = new THREE.Vector3();

// 책장에 가만히 서 있을 때(들림 제외) 각 책의 보이는 띠 — 앞 책에 가려지지 않는 왼쪽 부분
// 들린 위치가 아니라 제자리 기준이라, 책이 올라가도 가리키는 책이 바뀌며 떨리지 않는다
function visibleStrips(books, camera) {
  const leftEdges = books.map(({ group }) => {
    restCorner.set(-0.5, 0, 0.1).applyMatrix4(group.matrixWorld).project(camera);
    return (restCorner.x + 1) / 2 * innerWidth;
  });
  return books.map(({ group }, i) => {
    const right = i === 0
      ? leftEdges[0] + (leftEdges[0] - leftEdges[1]) * 3
      : leftEdges[i - 1];
    restCorner.set(0, 0, 0.1).applyMatrix4(group.matrixWorld).project(camera);
    return {
      centerX: (leftEdges[i] + right) / 2,
      width: Math.max(1, right - leftEdges[i]),
      centerY: (1 - restCorner.y) / 2 * innerHeight,
    };
  });
}
function toScreen(mesh, camera) {
  probe.set(0, 0.1, 0);
  mesh.localToWorld(probe).project(camera);
  return { x: (probe.x + 1) / 2 * innerWidth, y: (1 - probe.y) / 2 * innerHeight };
}

// 손을 안 움직이거나 터치 화면이면 가상 커서가 책 줄을 천천히 오간다
function virtualCursor(books, camera, time) {
  const back = toScreen(books[Math.min(16, books.length - 1)].mesh, camera);
  const front = toScreen(books[2].mesh, camera);
  const u = (Math.sin(time * 0.45) + 1) / 2;
  return { x: back.x + (front.x - back.x) * u, y: back.y + (front.y - back.y) * u };
}

function activeCursor(books, camera, time) {
  const idle = time - pointer.lastMove > IDLE_AFTER;
  if (coarsePointer || (idle && !reducedMotion)) return virtualCursor(books, camera, time);
  return pointer.inside ? pointer : null;
}

// 펼친 화면: 프로젝트 책은 제자리, 장식 책은 아래로 가라앉는다
function gridTargets(books, focusIndex) {
  return books.map((book) => ({
    y: book.project ? 0 : GRID_FILLER_Y,
    z: book.index === focusIndex ? GRID_HOVER_PUSH : 0,
  }));
}

function shelfTargets(books, camera, time, dt, selectedIndex) {
  return waveTargets(books, camera, time, dt, selectedIndex).map((lift) => ({ y: lift, z: lift * FORWARD_RATIO }));
}

// 실제 커서를 바로 쓰지 않고 부드럽게 따라가는 점을 쓴다
const smoothCursor = { x: 0, y: 0, ready: false };
function followCursor(cursor, dt) {
  if (!cursor) { smoothCursor.ready = false; return null; }
  if (!smoothCursor.ready || reducedMotion) Object.assign(smoothCursor, { x: cursor.x, y: cursor.y, ready: true });
  const k = 1 - Math.exp(-CURSOR_SMOOTHING * Math.min(dt, 0.05));
  smoothCursor.x += (cursor.x - smoothCursor.x) * k;
  smoothCursor.y += (cursor.y - smoothCursor.y) * k;
  return smoothCursor;
}

function waveTargets(books, camera, time, dt, selectedIndex) {
  if (selectedIndex !== null) return books.map((b) => (b.index === selectedIndex ? SELECTED_LIFT : 0));
  const cursor = followCursor(activeCursor(books, camera, time), dt);
  if (!cursor) return books.map(() => 0);
  const spreadY = innerHeight * VERTICAL_SPREAD;
  return visibleStrips(books, camera).map((strip) => {
    const dx = (strip.centerX - cursor.x) / (strip.width * STRIP_SPREAD);
    const dy = (strip.centerY - cursor.y) / spreadY;
    return MAX_LIFT * Math.exp(-(dx * dx + dy * dy));
  });
}

// 뒤에서부터 한 권씩 올라온다
function introReady(book, count, time) {
  if (reducedMotion) return true;
  return time > 0.25 + (count - book.index) * 0.035;
}

function stepSpring(state, key, velocityKey, target, h) {
  state[velocityKey] += ((target - state[key]) * STIFFNESS - state[velocityKey] * DAMPING) * h;
  state[key] += state[velocityKey] * h;
}

// state: { mode: 'shelf' | 'grid', selectedIndex, hoverIndex }
export function updateBooks(books, camera, time, dt, state) {
  const targets = state.mode === 'grid'
    ? gridTargets(books, state.selectedIndex ?? state.hoverIndex)
    : shelfTargets(books, camera, time, dt, state.selectedIndex);
  const h = Math.min(dt, 0.05) / SUBSTEPS;
  books.forEach((book, i) => {
    const ready = introReady(book, books.length, time);
    const targetY = ready ? targets[i].y : HIDDEN_Y;
    const targetZ = ready ? targets[i].z : 0;
    const s = book.lift;
    if (reducedMotion && ready) { s.y = targetY; s.z = targetZ; s.vy = 0; }
    else for (let k = 0; k < SUBSTEPS; k++) {
      stepSpring(s, 'y', 'vy', targetY, h);
      stepSpring(s, 'z', 'vz', targetZ, h);
    }
    book.mesh.position.y = s.y;
    book.mesh.position.z = s.z;
    book.mesh.rotation.x = -s.vy * 0.012;
  });
}
