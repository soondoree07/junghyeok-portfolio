// 상세 패널 — 책을 누르면 오른쪽에서 프로젝트 설명이 나온다. About 도 같은 패널을 쓴다.
import { PROJECTS } from './projects.js';

const panel = document.querySelector('.panel');
const scrim = document.querySelector('.scrim');
const body = panel.querySelector('.panel-body');
let onClose = () => {};
let onSelect = () => {};
let lastFocus = null;
let currentProject = null;

const escapeHtml = (text) => text.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

function projectHtml(project) {
  const number = String(PROJECTS.indexOf(project) + 1).padStart(2, '0');
  const points = project.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  const link = project.link
    ? `<a class="panel-link" href="${project.link}" target="_blank" rel="noopener">사이트 보러 가기 <span aria-hidden="true">↗</span></a>`
    : '';
  return `
    <p class="panel-eyebrow"><span style="background:${project.color}"></span>${number} · ${escapeHtml(project.year)}</p>
    <h2 id="panel-title" class="panel-title">${escapeHtml(project.title)}</h2>
    <p class="panel-sub">${escapeHtml(project.sub)}</p>
    <p class="panel-lead">${escapeHtml(project.oneLine)}</p>
    <dl class="panel-meta"><dt>역할</dt><dd>${escapeHtml(project.role)}</dd></dl>
    <h3>한 일</h3><ul>${points}</ul>
    <h3>배운 것</h3><blockquote>${escapeHtml(project.insight)}</blockquote>
    ${link}
    <nav class="panel-steps" aria-label="다른 프로젝트">
      <button type="button" data-step="-1">← 이전 프로젝트</button>
      <button type="button" data-step="1">다음 프로젝트 →</button>
    </nav>`;
}

function aboutHtml() {
  return `
    <p class="panel-eyebrow">About</p>
    <h2 id="panel-title" class="panel-title">박정혁</h2>
    <p class="panel-sub">한양대학교 ICT융합학부 디자인테크놀로지전공</p>
    <p class="panel-lead">시스템과 UX 흐름을 중심으로 기획하고, 디자인과 개발까지 직접 만들어 끝까지 끌고 가요.</p>
    <p class="panel-text">장기적으로는 "이 결정이 맞는가?"를 빠르게가 아니라 정확하게 판단하는 게임 기획자가 되고 싶어요.
    프로젝트로 사고방식을 정리하고, 멘토링으로 판단 기준을 검증하고 있어요.</p>
    <h3>잘하는 것</h3>
    <ul><li>UX 리서치 · 서비스 설계 · 시스템 설계</li><li>유저 플로우 · 정보 구조 · 페르소나 / 고객 여정 지도</li>
    <li>Figma 프로토타입 · 비주얼 디렉션</li><li>React · Next.js 웹 개발, AI 활용 개발</li></ul>
    <h3>연락처</h3>
    <ul class="panel-contact"><li><a href="mailto:soondoree07@gmail.com">soondoree07@gmail.com</a></li>
    <li><a href="https://github.com/soondoree07" target="_blank" rel="noopener">github.com/soondoree07</a></li></ul>`;
}

function show(html, callbacks = {}) {
  if (!isPanelOpen()) lastFocus = document.activeElement;
  onClose = callbacks.onClose ?? (() => {});
  onSelect = callbacks.onSelect ?? (() => {});
  body.innerHTML = html;
  body.scrollTop = 0;
  document.body.classList.add('panel-open');
  panel.setAttribute('aria-hidden', 'false');
  panel.querySelector('.panel-close').focus({ preventScroll: true });
}

// callbacks: { onClose, onSelect(project) } — 3D 쪽에서 어떤 책을 올릴지 알 수 있게
export function openProject(project, callbacks = {}) {
  currentProject = project;
  show(projectHtml(project), callbacks);
  callbacks.onSelect?.(project);
}
export function openAbout() { currentProject = null; show(aboutHtml()); }

function stepProject(direction) {
  const current = PROJECTS.indexOf(currentProject);
  const next = PROJECTS[(current + direction + PROJECTS.length) % PROJECTS.length];
  openProject(next, { onClose, onSelect });
}

export function closePanel() {
  if (!document.body.classList.contains('panel-open')) return;
  document.body.classList.remove('panel-open');
  panel.setAttribute('aria-hidden', 'true');
  onClose();
  lastFocus?.focus?.({ preventScroll: true });
}

export function isPanelOpen() { return document.body.classList.contains('panel-open'); }

panel.querySelector('.panel-close').addEventListener('click', closePanel);
body.addEventListener('click', (e) => {
  const button = e.target.closest('[data-step]');
  if (button) stepProject(Number(button.dataset.step));
});
scrim.addEventListener('click', closePanel);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
