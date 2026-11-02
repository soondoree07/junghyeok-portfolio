// 보기 전환 — 책장(shelf) ↔ 펼치기(grid). 버튼 글자, 화면 클래스, 스크롤 영역을 맡는다.
const scroller = document.querySelector('.grid-scroll');
const spacer = scroller.querySelector('.grid-spacer');
const toggle = document.querySelector('.view-toggle');
const LABELS = { shelf: '11권 펼쳐 보기', grid: '책장으로 돌아가기' };

export const view = { mode: 'shelf', changedAt: -Infinity };
let frozenScroll = 0; // 책장으로 돌아가는 동안 격자 위치가 튀지 않게 마지막 스크롤을 붙잡아 둔다

export function setMode(mode, time) {
  if (view.mode === mode) return;
  frozenScroll = mode === 'grid' ? 0 : scroller.scrollTop;
  view.mode = mode;
  view.changedAt = time;
  document.body.classList.toggle('grid-mode', mode === 'grid');
  scroller.scrollTop = 0;
  toggle.textContent = LABELS[mode];
  toggle.setAttribute('aria-pressed', String(mode === 'grid'));
}

export function scrollPx() {
  return view.mode === 'grid' ? scroller.scrollTop : frozenScroll;
}

export function setContentHeight(px) {
  spacer.style.height = `${Math.ceil(px)}px`;
}

export function onToggle(callback) {
  toggle.textContent = LABELS.shelf;
  toggle.addEventListener('click', callback);
}

// 3D 책을 누를 수 있는 곳 — 캔버스(책장) 또는 스크롤 영역(펼치기)
export function isStageTarget(target) {
  return target instanceof Element && (target.matches('.stage') || target.closest('.grid-scroll') !== null);
}
