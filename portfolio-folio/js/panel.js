// 상세 화면 — 책을 누르면 화면 전체를 덮는 프로젝트 페이지가 올라온다.
import { PROJECTS } from './projects.js';
import { RETROS } from './project-retros.js';

const SHOT_COUNT = 3; // 프로젝트마다 기본 캡처 자리 수 (shots 를 따로 적으면 그 수만큼)
const RETRO_LABELS = [['miss', '아쉬운 점'], ['learned', '배운 점'], ['next', '다음엔']];

const panel = document.querySelector('.panel');
const body = panel.querySelector('.panel-body');
let lastFocus = null;
let currentProject = null;

const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

// 캡처 목록 — shots: [{ file: '1.png', caption: '설명' }] 를 적으면 그대로, 없으면 1.png ~ 3.png 자리
function shotsOf(project) {
  return project.shots ?? Array.from({ length: SHOT_COUNT }, (_, i) => ({ file: `${i + 1}.png`, caption: '' }));
}

function shotHtml(project, shot) {
  const path = `images/${project.id}/${shot.file}`;
  const caption = shot.caption ? `<figcaption>${escapeHtml(shot.caption)}</figcaption>` : '';
  return `
    <figure class="shot">
      <div class="shot-frame">
        <img src="${path}" alt="${escapeHtml(shot.caption || `${project.title} 화면`)}" loading="lazy" data-placeholder="${path}">
      </div>${caption}
    </figure>`;
}

function metaHtml(project) {
  const link = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener">${escapeHtml(project.link.replace(/^https?:\/\//, ''))} ↗</a>`
    : '<span class="detail-muted">비공개</span>';
  return `
    <dl class="detail-meta">
      <div><dt>역할</dt><dd>${escapeHtml(project.role)}</dd></div>
      <div><dt>기간</dt><dd>${escapeHtml(project.year)}</dd></div>
      <div><dt>링크</dt><dd>${link}</dd></div>
    </dl>`;
}

// 돌아보기 — project-retros.js 에 글이 있는 프로젝트만 아쉬운 점 · 배운 점 · 다음엔을 붙인다
function retroHtml(project) {
  const retro = RETROS[project.id];
  if (!retro) return '';
  const items = RETRO_LABELS.map(([key, label]) => `<div><dt>${label}</dt><dd>${escapeHtml(retro[key])}</dd></div>`).join('');
  return `<dl class="detail-retro">${items}</dl>`;
}

function projectHtml(project) {
  const number = String(PROJECTS.indexOf(project) + 1).padStart(2, '0');
  const points = project.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  return `
    <header class="detail-head">
      <p class="detail-eyebrow"><span style="background:${project.color}"></span>${number} / ${PROJECTS.length}${project.school ? '<em class="detail-tag">학교 프로젝트</em>' : ''}</p>
      <h2 id="panel-title" class="detail-title">${escapeHtml(project.title)}</h2>
      <p class="detail-sub">${escapeHtml(project.sub)}</p>
      <p class="detail-lead">${escapeHtml(project.oneLine)}</p>
      ${metaHtml(project)}
    </header>
    <section class="detail-shots" aria-label="작업 화면">${shotsOf(project).map((s) => shotHtml(project, s)).join('')}</section>
    <section class="detail-notes">
      <div><h3>한 일</h3><ul>${points}</ul></div>
      <div><h3>돌아보기</h3><blockquote>${escapeHtml(project.insight)}</blockquote>${retroHtml(project)}</div>
    </section>
    <nav class="detail-steps" aria-label="다른 프로젝트">
      <button type="button" data-step="-1">← 이전 프로젝트</button>
      <button type="button" data-step="1">다음 프로젝트 →</button>
    </nav>`;
}

// 캡처 파일이 아직 없으면 "넣을 자리" 표시로 바꾼다
function markMissingShots() {
  body.querySelectorAll('img[data-placeholder]').forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.parentElement;
      frame.classList.add('is-empty');
      frame.innerHTML = `<span>캡처를 넣을 자리</span><code>${escapeHtml(img.dataset.placeholder)}</code>`;
    }, { once: true });
  });
}

function show(html) {
  if (!isPanelOpen()) lastFocus = document.activeElement;
  body.innerHTML = html;
  markMissingShots();
  panel.scrollTop = 0;
  document.body.classList.add('panel-open');
  panel.setAttribute('aria-hidden', 'false');
  panel.querySelector('.panel-close').focus({ preventScroll: true });
}

export function openProject(project) { currentProject = project; show(projectHtml(project)); }

function stepProject(direction) {
  const current = PROJECTS.indexOf(currentProject);
  openProject(PROJECTS[(current + direction + PROJECTS.length) % PROJECTS.length]);
}

export function isPanelOpen() { return document.body.classList.contains('panel-open'); }

export function closePanel() {
  if (!isPanelOpen()) return;
  document.body.classList.remove('panel-open');
  panel.setAttribute('aria-hidden', 'true');
  lastFocus?.focus?.({ preventScroll: true });
}

panel.querySelector('.panel-close').addEventListener('click', closePanel);
body.addEventListener('click', (e) => {
  const button = e.target.closest('[data-step]');
  if (button) stepProject(Number(button.dataset.step));
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
