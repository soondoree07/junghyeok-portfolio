// 책장 파도 — 마우스가 올라간 책 100%, 바로 양옆 66%, 그 바깥 양옆 15% 만큼 위로 올라온다.
// 파도의 중심은 마우스로 순간이동하지 않고 정해진 속도로 따라간다.
// 그래서 마우스가 빠르게 지나가면 그 길에 있던 책들이 차례로 천천히 출렁인다.
import * as THREE from 'three';

const PROFILE = [1, 0.66, 0.15, 0]; // 중심에서 0 · 1 · 2 · 3권 떨어진 책의 높이 비율
const MAX_LIFT = 1.0;
const CENTER_SPEED = 6;  // 파도 중심이 따라가는 최대 속도 (권/초)
const CENTER_EASE = 4;   // 목표에 가까워질수록 천천히 멈추는 정도
const BAND_ABOVE = 0.6;  // 책 위쪽으로 이만큼(책 높이 비율)까지는 그 책을 가리킨 것으로 본다

const corner = new THREE.Vector3();

function toScreen(local, matrix, camera) {
  corner.copy(local).applyMatrix4(matrix).project(camera);
  return { x: (corner.x + 1) / 2 * innerWidth, y: (1 - corner.y) / 2 * innerHeight };
}

const TOP_LEFT = new THREE.Vector3(-0.5, 0.75, 0.1);
const BOTTOM_LEFT = new THREE.Vector3(-0.5, -0.75, 0.1);

// 제자리(들림 제외) 기준으로 각 책의 보이는 띠 — 앞 책에 가려지지 않는 왼쪽 부분
// 책이 올라가도 띠는 그대로라, 가리키는 책이 바뀌며 떨리지 않는다
function visibleStrips(books, camera) {
  const edges = books.map(({ group }) => ({
    top: toScreen(TOP_LEFT, group.matrixWorld, camera),
    bottom: toScreen(BOTTOM_LEFT, group.matrixWorld, camera),
  }));
  return edges.map((edge, i) => {
    const right = i === 0 ? innerWidth * 2 : edges[i - 1].top.x;
    const height = edge.bottom.y - edge.top.y;
    return { left: edge.top.x, right, top: edge.top.y - height * BAND_ABOVE, bottom: edge.bottom.y };
  });
}

function bookUnderCursor(books, camera, cursor) {
  if (!cursor) return null;
  const strips = visibleStrips(books, camera);
  const index = strips.findIndex((s) => cursor.x >= s.left && cursor.x < s.right && cursor.y >= s.top && cursor.y <= s.bottom);
  return index === -1 ? null : index;
}

function profileAt(distance) {
  if (distance >= PROFILE.length - 1) return 0;
  const lower = Math.floor(distance);
  return THREE.MathUtils.lerp(PROFILE[lower], PROFILE[lower + 1], distance - lower);
}

const wave = { center: 0, active: false };

// 파도 중심을 목표 책 쪽으로 옮긴다 — 멀면 최대 속도로, 가까우면 천천히
function moveCenter(target, dt) {
  if (!wave.active) { wave.center = target; wave.active = true; return; }
  const diff = target - wave.center;
  const eased = diff * (1 - Math.exp(-CENTER_EASE * dt));
  const limit = CENTER_SPEED * dt;
  wave.center += THREE.MathUtils.clamp(eased, -limit, limit);
}

// 책마다 올라갈 높이 (월드 단위)
export function waveLifts(books, camera, cursor, dt) {
  const target = bookUnderCursor(books, camera, cursor);
  if (target === null) { wave.active = false; return books.map(() => 0); }
  moveCenter(target, Math.min(dt, 0.05));
  return books.map((_, i) => MAX_LIFT * profileAt(Math.abs(i - wave.center)));
}
