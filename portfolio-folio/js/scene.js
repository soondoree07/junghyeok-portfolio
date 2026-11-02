// 3D 장면 — 렌더러 · 조명 · 카메라 · 책 줄 만들기
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PROJECTS } from './projects.js';
import { drawProjectCover, drawPageTexture } from './covers.js';
import { createBookModel } from './book-model.js';

export const HIDDEN_Y = -3; // 등장 전 책 높이
const BASE_Y = -1.42; // 책 줄 높이 — 이름 아래에 머물도록
// 책 줄 배치 — 맨 앞 책이 화면 오른쪽 아래에 걸리게 두 칸 뒤에서 시작하고, 11권이 화면 너비를 채우게 간격을 둔다
const ROW_START = 2;
const ROW_SPAN_X = 6.8;   // 책 줄 전체 가로 길이 — 권수가 바뀌어도 화면 너비를 채운다
const ROW_SPAN_Z = 2.64;
const STEP_X = ROW_SPAN_X / PROJECTS.length;
const STEP_Z = ROW_SPAN_Z / PROJECTS.length;

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

export function createScene(renderer) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const key = new THREE.DirectionalLight('#fff3e4', 2.4); key.position.set(-4, 6, 6);
  const rim = new THREE.DirectionalLight('#bfd2ff', 1.1); rim.position.set(6, 3, -4);
  scene.add(key, rim, new THREE.AmbientLight('#ffffff', 0.12));
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(19.5, 1, 0.1, 100);
  camera.position.set(3.6, 2.15, 7.4);
  camera.lookAt(-1.4, 0.05, -0.6);
  return camera;
}

export function fitCamera(camera, renderer) {
  const w = innerWidth;
  const h = innerHeight;
  camera.fov = w < h ? 40 : 19.5;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  renderer.setSize(w, h, false);
}

export function createBooks(scene, renderer) {
  const pages = { horizontal: drawPageTexture(true), vertical: drawPageTexture(false) };

  // 앞에서부터 프로젝트 순서대로 한 권씩
  return PROJECTS.map((project, i) => {
    const cover = drawProjectCover(project, i, renderer);
    // mesh = 책 한 권(양장본 모양 Group). 올라가고 기우는 움직임은 이 안쪽 묶음에 준다 (motion.js)
    const { book: mesh, materials } = createBookModel(cover, project.color, pages);
    const group = new THREE.Group();
    const slot = i + ROW_START;
    group.position.set(1.55 - slot * STEP_X, BASE_Y, 0.9 - slot * STEP_Z);
    group.rotation.y = 0.32;
    group.add(mesh);
    scene.add(group);
    mesh.position.y = HIDDEN_Y;
    mesh.traverse((part) => { part.userData.bookIndex = i; }); // 어느 부분을 눌러도 이 책
    return {
      index: i, mesh, materials, group, project, number: i,
      lift: { y: HIDDEN_Y, vy: 0, z: 0, vz: 0 },
      shelf: { position: group.position.clone(), quaternion: group.quaternion.clone() }, // 책장 자리
      spread: { grid: 0 }, // 격자에서 보이는 정도 (layout.js)
      holdUntil: 0, // 책장으로 돌아올 때 이 시각까지 바닥에 머문다 (layout.js → motion.js)
    };
  });
}
