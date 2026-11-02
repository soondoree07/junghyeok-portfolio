// 책장 화면 스크롤 — 페이지를 내리면 카메라도 같은 만큼 내려가 책 아랫부분과 맨 아래 연락처가 보인다.
import * as THREE from 'three';

const PAN_DEPTH = 9.66;      // 카메라 ~ 책 줄 거리. 이 거리에서 1px 스크롤 = 화면에서 1px 이동
const BOTTOM_MARGIN = 0.08;  // 책 밑동 아래 여백 (화면 높이 비율)

const spacer = document.querySelector('.shelf-spacer');
const basePosition = new THREE.Vector3();
let pxToWorld = 0;

// 지금 카메라 자리를 기준점으로 저장 (화면 크기가 바뀔 때마다)
export function rememberCameraBase(camera) {
  basePosition.copy(camera.position);
  const visibleH = 2 * PAN_DEPTH * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  pxToWorld = visibleH / innerHeight;
}

// 스크롤만큼 카메라를 화면 위아래 방향으로 평행 이동 (돌리지 않는다)
export function panCamera(camera, scrollPx) {
  camera.position.copy(basePosition);
  camera.translateY(-scrollPx * pxToWorld);
  camera.updateMatrixWorld();
}

const corner = new THREE.Vector3();
const shelfMatrix = new THREE.Matrix4();
const UNIT_SCALE = new THREE.Vector3(1, 1, 1);

// 화면 안에 들어오는 책들의 밑동 중 가장 낮은 곳(px) — 거기까지 내려가도록 스크롤 길이를 정한다
function lowestBookBottom(books, camera) {
  let lowest = 0;
  books.forEach(({ shelf }) => {
    // 펼친 상태에서 불려도 책장 자리 기준으로 잰다
    shelfMatrix.compose(shelf.position, shelf.quaternion, UNIT_SCALE);
    const left = corner.set(-0.5, -0.75, 0.1).applyMatrix4(shelfMatrix).project(camera);
    const leftX = (left.x + 1) / 2 * innerWidth;
    const bottomY = (1 - left.y) / 2 * innerHeight;
    if (leftX > -innerWidth * 0.1 && leftX < innerWidth) lowest = Math.max(lowest, bottomY);
  });
  return lowest;
}

// 가까운 책은 스크롤보다 빨리 움직이므로(원근), 실제로 재 가며 맞는 스크롤 길이를 찾는다
export function fitShelfHeight(books, camera) {
  const target = innerHeight * (1 - BOTTOM_MARGIN);
  let pan = 0;
  for (let k = 0; k < 8; k++) {
    panCamera(camera, pan);
    pan = Math.max(0, pan + (lowestBookBottom(books, camera) - target) * 0.7);
  }
  panCamera(camera, 0);
  spacer.style.height = `${Math.ceil(innerHeight + pan)}px`;
}

// 내린 상태에서는 메뉴 뒤에 그림자를 깔아 책과 글자가 겹쳐 보이지 않게 한다
export function watchScrolled() {
  const update = () => document.documentElement.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', update, { passive: true });
  update();
}
