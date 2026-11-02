// 3D 장면 — 렌더러 · 조명 · 카메라 · 책 줄 만들기
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PROJECTS, FILLER_COLORS } from './projects.js';
import { drawProjectCover, drawFillerCover, drawPageTexture } from './covers.js';

const BOOK_COUNT = 26;
export const HIDDEN_Y = -3; // 등장 전 책 높이
const BASE_Y = -1.42; // 책 줄 높이 — 이름 아래에 머물도록

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

// 화면에 보이는 자리(앞에서 2~15번째)에 프로젝트를 모으고, 사이사이와 나머지는 장식 책
const FILLER_SLOTS = new Set([0, 1, 4, 8, 12]);

function bookSlots() {
  const slots = [];
  let projectIndex = 0;
  let fillerIndex = 0;
  for (let i = 0; i < BOOK_COUNT; i++) {
    const useProject = !FILLER_SLOTS.has(i) && projectIndex < PROJECTS.length;
    slots.push(useProject
      ? { project: PROJECTS[projectIndex], number: projectIndex++ }
      : { filler: FILLER_COLORS[fillerIndex++ % FILLER_COLORS.length] });
  }
  return slots;
}

function bookMaterials(coverTexture, baseColor, pages) {
  const spine = new THREE.Color(baseColor).multiplyScalar(0.62);
  const page = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.9 });
  return [
    page(pages.horizontal),
    new THREE.MeshPhysicalMaterial({ color: spine, roughness: 0.55, clearcoat: 0.3 }),
    page(pages.vertical),
    page(pages.vertical),
    new THREE.MeshPhysicalMaterial({ map: coverTexture, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.35 }),
    new THREE.MeshPhysicalMaterial({ color: spine, roughness: 0.6 }),
  ];
}

export function createBooks(scene, renderer) {
  const geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  const pages = { horizontal: drawPageTexture(true), vertical: drawPageTexture(false) };

  return bookSlots().map((slot, i) => {
    const project = slot.project ?? null;
    const cover = project
      ? drawProjectCover(project, slot.number, renderer)
      : drawFillerCover(slot.filler, renderer);
    const mesh = new THREE.Mesh(geometry, bookMaterials(cover, project ? project.color : slot.filler, pages));
    const group = new THREE.Group();
    group.position.set(1.55 - i * 0.5, BASE_Y, 0.9 - i * 0.2);
    group.rotation.y = 0.32;
    group.add(mesh);
    scene.add(group);
    mesh.position.y = HIDDEN_Y;
    mesh.userData.bookIndex = i;
    return {
      index: i, mesh, group, project, number: slot.number ?? null,
      lift: { y: HIDDEN_Y, vy: 0, z: 0, vz: 0 },
      shelf: { position: group.position.clone(), quaternion: group.quaternion.clone() }, // 책장 자리
      spread: { t: 0, v: 0, target: 0 }, // 0 책장 ↔ 1 격자 (layout.js)
    };
  });
}
