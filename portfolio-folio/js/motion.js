// 움직임 — 포인터 웨이브로 목표 높이를 정하고, 책마다 스프링으로 따라간다.
import * as THREE from 'three';
import { HIDDEN_Y } from './scene.js';

const STIFFNESS = 70;
const DAMPING = 13; // 감쇠비 약 0.78 — 살짝만 튄다
const SUBSTEPS = 4;
const MAX_LIFT = 0.78;
const SELECTED_LIFT = 0.95;
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

function waveTargets(books, camera, time, selectedIndex) {
  if (selectedIndex !== null) return books.map((b) => (b.index === selectedIndex ? SELECTED_LIFT : 0));
  const cursor = activeCursor(books, camera, time);
  if (!cursor) return books.map(() => 0);
  const spread = Math.max(innerWidth, innerHeight) * 0.085;
  return books.map((book) => {
    const s = toScreen(book.mesh, camera);
    const dx = s.x - cursor.x;
    const dy = (s.y - cursor.y) * 0.55;
    return MAX_LIFT * Math.exp(-(dx * dx + dy * dy) / (spread * spread));
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

export function updateBooks(books, camera, time, dt, selectedIndex) {
  const targets = waveTargets(books, camera, time, selectedIndex);
  const h = Math.min(dt, 0.05) / SUBSTEPS;
  books.forEach((book, i) => {
    const ready = introReady(book, books.length, time);
    const targetY = ready ? targets[i] : HIDDEN_Y;
    const targetZ = ready ? targets[i] * 0.35 : 0;
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
