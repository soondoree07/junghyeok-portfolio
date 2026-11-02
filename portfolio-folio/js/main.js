// 시작점 — 장면을 만들고, 책을 누르면 패널을 열고, 매 프레임 움직임을 갱신한다.
import * as THREE from 'three';
import { createRenderer, createScene, createCamera, fitCamera, createBooks } from './scene.js';
import { trackPointer, updateBooks } from './motion.js';
import { openProject, openAbout, closePanel } from './panel.js';
import { playIntro } from './intro.js';

const canvas = document.querySelector('.stage');
const renderer = createRenderer(canvas);
const scene = createScene(renderer);
const camera = createCamera();

// 표지 글꼴이 들어온 뒤에 그린다 (글꼴을 못 받아도 기본 글꼴로 진행)
await Promise.all([
  document.fonts.load('400 120px "Libre Caslon Display"'),
  document.fonts.load('500 24px Inter'),
]).catch(() => {});
const books = createBooks(scene, renderer);
let selectedIndex = null;

fitCamera(camera, renderer);
addEventListener('resize', () => fitCamera(camera, renderer));
trackPointer();

// 누를 수 있는 책 찾기
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function bookAt(x, y) {
  ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(books.map((b) => b.mesh))[0];
  return hit ? books[hit.object.userData.bookIndex] : null;
}

addEventListener('pointermove', (e) => {
  if (selectedIndex !== null) return;
  canvas.style.cursor = bookAt(e.clientX, e.clientY)?.project ? 'pointer' : '';
});

// 패널에서 프로젝트가 바뀌면 그 책을 올린다
const panelCallbacks = {
  onSelect: (project) => { selectedIndex = books.find((b) => b.project === project).index; },
  onClose: () => { selectedIndex = null; },
};

canvas.addEventListener('click', (e) => {
  const book = bookAt(e.clientX, e.clientY);
  if (!book?.project) return;
  canvas.style.cursor = '';
  openProject(book.project, panelCallbacks);
});

document.querySelectorAll('[data-open="about"]').forEach((el) =>
  el.addEventListener('click', (e) => { e.preventDefault(); selectedIndex = null; openAbout(); }));
document.querySelector('[data-open="first"]').addEventListener('click', (e) => {
  e.preventDefault();
  closePanel();
  openProject(books.find((b) => b.project).project, panelCallbacks);
});

const clock = new THREE.Clock();
playIntro();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  updateBooks(books, camera, clock.elapsedTime, dt, selectedIndex);
  renderer.render(scene, camera);
});
