// 책장 파도 — 마우스가 올라간 책 100%, 바로 양옆 45%, 그 바깥 양옆 15% 만큼 위로 올라온다.
// 파도의 중심은 마우스로 순간이동하지 않고 정해진 속도로 따라간다.
// 그래서 마우스가 빠르게 지나가면 그 길에 있던 책들이 차례로 천천히 출렁인다.
import * as THREE from 'three';

const PROFILE = [1, 0.45, 0.15, 0]; // 중심에서 0 · 1 · 2 · 3권 떨어진 책의 높이 비율
const MAX_LIFT = 1.0;
const CENTER_SPEED = 4;  // 파도 중심이 따라가는 최대 속도 (권/초)
const CENTER_EASE = 3;   // 목표에 가까워질수록 천천히 멈추는 정도
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

// 파도 세기(0~1) — 들어올 때 서서히 커지고 나갈 때 서서히 잦아든다. 높이가 한 번에 바뀌지 않게 한다
const FADE_IN = 1.8;   // 클수록 빨리 커진다 (1/초)
const FADE_OUT = 1.4;  // 클수록 빨리 잦아든다 (1/초)
const wave = { center: 0, strength: 0 };

// 파도 중심을 목표 책 쪽으로 옮긴다 — 멀면 최대 속도로, 가까우면 천천히
// 파도가 거의 잦아든 뒤 다시 들어오면, 보이지 않는 동안 중심만 그 자리로 옮겨 둔다
function moveCenter(target, dt) {
  if (wave.strength < 0.02) { wave.center = target; return; }
  const diff = target - wave.center;
  const eased = diff * (1 - Math.exp(-CENTER_EASE * dt));
  const limit = CENTER_SPEED * dt;
  wave.center += THREE.MathUtils.clamp(eased, -limit, limit);
}

function fadeStrength(goal, dt) {
  const rate = goal > wave.strength ? FADE_IN : FADE_OUT;
  wave.strength += (goal - wave.strength) * (1 - Math.exp(-rate * dt));
}

// 책마다 올라갈 높이 (월드 단위)
// 마우스가 책 구간을 벗어나도 파도는 마지막 자리에서 서서히 잦아든다
export function waveLifts(books, camera, cursor, dt) {
  const step = Math.min(dt, 0.05);
  const target = bookUnderCursor(books, camera, cursor);
  if (target !== null) moveCenter(target, step);
  fadeStrength(target === null ? 0 : 1, step);
  return books.map((_, i) => MAX_LIFT * wave.strength * profileAt(Math.abs(i - wave.center)));
}
