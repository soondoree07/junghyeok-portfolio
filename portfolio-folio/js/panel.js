// 상세 화면 — 책을 누르면 화면 전체를 덮는 프로젝트 페이지가 올라온다. About 도 같은 화면을 쓴다.
import { PROJECTS } from './projects.js';

const SHOT_COUNT = 3; // 프로젝트마다 기본 캡처 자리 수 (shots 를 따로 적으면 그 수만큼)

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

function projectHtml(project) {
  const number = String(PROJECTS.indexOf(project) + 1).padStart(2, '0');
  const points = project.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  return `
    <header class="detail-head">
      <p class="detail-eyebrow"><span style="background:${project.color}"></span>${number} / ${PROJECTS.length}</p>
      <h2 id="panel-title" class="detail-title">${escapeHtml(project.title)}</h2>
      <p class="detail-sub">${escapeHtml(project.sub)}</p>
      <p class="detail-lead">${escapeHtml(project.oneLine)}</p>
      ${metaHtml(project)}
    </header>
    <section class="detail-shots" aria-label="작업 화면">${shotsOf(project).map((s) => shotHtml(project, s)).join('')}</section>
    <section class="detail-notes">
      <div><h3>한 일</h3><ul>${points}</ul></div>
      <div><h3>배운 것</h3><blockquote>${escapeHtml(project.insight)}</blockquote></div>
    </section>
    <nav class="detail-steps" aria-label="다른 프로젝트">
      <button type="button" data-step="-1">← 이전 프로젝트</button>
      <button type="button" data-step="1">다음 프로젝트 →</button>
    </nav>`;
}

function aboutHtml() {
  return `
    <header class="detail-head">
      <p class="detail-eyebrow">About</p>
      <h2 id="panel-title" class="detail-title">박정혁</h2>
      <p class="detail-sub">한양대학교 ICT융합학부 디자인테크놀로지전공</p>
      <p class="detail-lead">시스템과 UX 흐름을 중심으로 기획하고, 디자인과 개발까지 직접 만들어 끝까지 끌고 가요.</p>
    </header>
    <section class="detail-notes">
      <div><h3>방향</h3><p class="detail-text">장기적으로는 "이 결정이 맞는가?"를 빠르게가 아니라 정확하게 판단하는 게임 기획자가 되고 싶어요.
      프로젝트로 사고방식을 정리하고, 멘토링으로 판단 기준을 검증하고 있어요.</p></div>
      <div><h3>잘하는 것</h3><ul><li>UX 리서치 · 서비스 설계 · 시스템 설계</li><li>유저 플로우 · 정보 구조 · 페르소나 / 고객 여정 지도</li>
      <li>Figma 프로토타입 · 비주얼 디렉션</li><li>React · Next.js 웹 개발, AI 활용 개발</li></ul></div>
    </section>`;
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
export function openAbout() { currentProject = null; show(aboutHtml()); }

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
