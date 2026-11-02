// 시작점 — 장면을 만들고, 책을 누르면 패널을 열고, 매 프레임 움직임을 갱신한다.
import * as THREE from 'three';
import { createRenderer, createScene, createCamera, fitCamera, createBooks } from './scene.js';
import { pointer, trackPointer, updateBooks } from './motion.js';
import { gridMetrics, updateSpread } from './layout.js';
import { view, setMode, scrollPx, shelfScrollPx, setContentHeight, isStageTarget, scrollToContact } from './view.js';
import { rememberCameraBase, panCamera, fitShelfHeight, watchScrolled } from './page.js';
import { openProject, openAbout, closePanel, isPanelOpen } from './panel.js';
import { playIntro } from './intro.js';
import { playBlueprintIntro } from './blueprint-intro.js';

const canvas = document.querySelector('.stage');
const renderer = createRenderer(canvas);
const scene = createScene(renderer);
const camera = createCamera();
const clock = new THREE.Clock();

// 표지 글꼴이 들어온 뒤에 그린다 (글꼴을 못 받아도 기본 글꼴로 진행)
await Promise.all([
  document.fonts.load('400 120px "Libre Caslon Display"'),
  document.fonts.load('500 24px Inter'),
]).catch(() => {});
const books = createBooks(scene, renderer);
const projectCount = books.filter((b) => b.project).length;
let hoverIndex = null;
let metrics = null;

function handleResize() {
  fitCamera(camera, renderer);
  rememberCameraBase(camera);
  fitShelfHeight(books, camera);
  metrics = gridMetrics(camera, projectCount);
  setContentHeight(metrics.contentPx);
}
handleResize();
addEventListener('resize', handleResize);
trackPointer();
watchScrolled();

// 누를 수 있는 책 찾기
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function projectBookAt(x, y) {
  ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(books.map((b) => b.mesh), true)[0];
  const book = hit ? books[hit.object.userData.bookIndex] : null;
  return book?.project ? book : null;
}

addEventListener('click', (e) => {
  if (!isStageTarget(e.target)) return;
  const book = projectBookAt(e.clientX, e.clientY);
  if (book) openProject(book.project);
});

function toggleView(mode) {
  closePanel();
  setMode(mode ?? (view.mode === 'grid' ? 'shelf' : 'grid'), clock.elapsedTime);
}
// Projects: 누르면 펼치고, 펼친 상태에서 다시 누르면 책장으로
document.querySelector('[data-open="projects"]').addEventListener('click', (e) => {
  e.preventDefault();
  toggleView();
});
// 로고: 펼친 상태라면 책장으로 돌아간다
document.querySelector('.logo').addEventListener('click', (e) => {
  if (view.mode !== 'grid') return;
  e.preventDefault();
  toggleView('shelf');
});
document.querySelectorAll('[data-open="contact"]').forEach((el) =>
  el.addEventListener('click', (e) => { e.preventDefault(); closePanel(); scrollToContact(); }));
document.querySelectorAll('[data-open="about"]').forEach((el) =>
  el.addEventListener('click', (e) => { e.preventDefault(); openAbout(); }));

// Esc: 패널이 열려 있으면 패널만 닫고(panel.js), 아니면 책장으로 돌아간다
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !isPanelOpen() && view.mode === 'grid') toggleView('shelf');
}, { capture: true });

function updateCursor() {
  hoverIndex = null;
  if (!pointer.inside || isPanelOpen()) { document.body.style.cursor = ''; return; }
  const book = projectBookAt(pointer.x, pointer.y);
  hoverIndex = book ? book.index : null;
  document.body.style.cursor = book ? 'pointer' : '';
}

// 첫 접속이면 청사진 인트로가 끝나 갈 때 사이트 등장을 시작한다
await playBlueprintIntro();
playIntro();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  const time = clock.elapsedTime;
  panCamera(camera, shelfScrollPx());
  updateCursor();
  updateSpread(books, camera, metrics, view, scrollPx(), time, dt);
  updateBooks(books, camera, time, dt, { mode: view.mode, hoverIndex });
  renderer.render(scene, camera);
});
