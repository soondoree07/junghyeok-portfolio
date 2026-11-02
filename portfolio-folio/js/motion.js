// 움직임 — 책마다 목표 높이를 정하고(책장은 wave.js 의 파도), 스프링으로 따라간다.
import * as THREE from 'three';
import { HIDDEN_Y } from './scene.js';
import { waveLifts } from './wave.js';

const STIFFNESS = 22;
const DAMPING = 8.9;  // 감쇠비 약 0.95 — 느긋하게 올라와 튀지 않고 멈춘다
const SUBSTEPS = 4;
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

// 책장: 위로만 올라온다 (앞으로 나오지 않는다). 패널이 열린 책은 그 책만 올라와 있다
function shelfTargets(books, camera, time, dt, selectedIndex) {
  const lifts = selectedIndex !== null
    ? books.map((b) => (b.index === selectedIndex ? SELECTED_LIFT : 0))
    : waveLifts(books, camera, activeCursor(books, camera, time), dt);
  return lifts.map((lift) => ({ y: lift, z: 0 }));
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
