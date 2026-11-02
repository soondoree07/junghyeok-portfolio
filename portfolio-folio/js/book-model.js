// 양장본 책 모양 — 앞 · 뒤 표지(판지)가 속지보다 살짝 크고, 책등은 둥글게 말려 있고, 속지는 안쪽으로 들어가 있다.
// 책 한 권 = Group(표지 2 + 책등 + 속지). 크기는 예전 상자와 같다: 가로 1 · 세로 1.5 · 두께 0.2.
// 앞표지가 +z 를 보고, 책등은 -x 쪽, 종이 옆면(앞마구리)은 +x 쪽이다.
import * as THREE from 'three';

const WIDTH = 1;
const HEIGHT = 1.5;
const THICKNESS = 0.2;
const BOARD = 0.022;          // 표지 판지 두께
const SPINE_DEPTH = 0.06;     // 둥근 책등이 차지하는 가로 폭
const BOARD_OVERHANG = 0.025; // 표지가 속지보다 튀어나온 정도 (위 · 아래 · 앞쪽)

// 모든 책이 같이 쓰는 모양 — 한 번만 만든다
function sharedGeometries() {
  const boardWidth = WIDTH - SPINE_DEPTH;
  const spine = new THREE.CylinderGeometry(THICKNESS / 2, THICKNESS / 2, HEIGHT, 24, 1, false, Math.PI, Math.PI);
  spine.scale(SPINE_DEPTH / (THICKNESS / 2), 1, 1); // 반원을 납작하게 눌러 살짝만 둥근 책등으로
  return {
    boardWidth,
    board: new THREE.BoxGeometry(boardWidth, HEIGHT, BOARD),
    spine,
    pages: new THREE.BoxGeometry(boardWidth - BOARD_OVERHANG, HEIGHT - BOARD_OVERHANG * 2, THICKNESS - BOARD * 2 - 0.004),
  };
}
let geometries = null;

function makeMaterials(coverTexture, baseColor, pageTextures) {
  const cloth = new THREE.Color(baseColor).multiplyScalar(0.62); // 책등 · 판지 옆면 · 뒤표지 색
  const page = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.92 });
  // 책등 반원의 위 · 아래 마개가 안쪽에서 보여도 비지 않게 양면으로 그린다
  const binding = new THREE.MeshPhysicalMaterial({ color: cloth, roughness: 0.55, clearcoat: 0.3, side: THREE.DoubleSide });
  return {
    cover: new THREE.MeshPhysicalMaterial({ map: coverTexture, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.35 }),
    binding,
    back: new THREE.MeshPhysicalMaterial({ color: cloth, roughness: 0.6 }),
    foreEdge: page(pageTextures.horizontal),
    headTail: page(pageTextures.vertical),
    pageFace: new THREE.MeshStandardMaterial({ color: '#efe7d6', roughness: 0.95 }),
  };
}

// 상자 면 순서: +x, -x, +y, -y, +z, -z
export function createBookModel(coverTexture, baseColor, pageTextures) {
  geometries ??= sharedGeometries();
  const m = makeMaterials(coverTexture, baseColor, pageTextures);
  const g = geometries;
  const boardX = SPINE_DEPTH / 2; // 판지는 책등 끝(-0.5 + 책등 폭)부터 앞쪽 끝(+0.5)까지
  const boardZ = THICKNESS / 2 - BOARD / 2;

  const front = new THREE.Mesh(g.board, [m.binding, m.binding, m.binding, m.binding, m.cover, m.binding]);
  front.position.set(boardX, 0, boardZ);
  const back = new THREE.Mesh(g.board, [m.binding, m.binding, m.binding, m.binding, m.binding, m.back]);
  back.position.set(boardX, 0, -boardZ);
  const spine = new THREE.Mesh(g.spine, m.binding);
  spine.position.set(-WIDTH / 2 + SPINE_DEPTH, 0, 0);
  const pages = new THREE.Mesh(g.pages, [m.foreEdge, m.pageFace, m.headTail, m.headTail, m.pageFace, m.pageFace]);
  pages.position.set(boardX - BOARD_OVERHANG / 2, 0, 0);

  const book = new THREE.Group();
  book.add(front, back, spine, pages);
  return { book, materials: Object.values(m) };
}
