// 보기 전환 — 책장(shelf) ↔ 펼치기(grid). 버튼 글자, 화면 클래스, 스크롤 영역, 연락처 위치를 맡는다.
const scroller = document.querySelector('.grid-scroll');
const spacer = scroller.querySelector('.grid-spacer');
const page = document.querySelector('.page');
const contact = document.querySelector('.contact');
const toggle = document.querySelector('.view-toggle');
const LABELS = { shelf: '프로젝트 펼쳐 보기', grid: '책장으로 돌아가기' }; // 아이콘 버튼의 읽어 주는 이름

export const view = { mode: 'shelf', changedAt: -Infinity };
let frozenGridScroll = 0;  // 책장으로 돌아가는 동안 격자 위치가 튀지 않게 마지막 격자 스크롤을 붙잡아 둔다
let frozenShelfScroll = 0; // 펼친 동안 책장 화면 스크롤(카메라 위치)을 그대로 둔다

export function setMode(mode, time) {
  if (view.mode === mode) return;
  if (mode === 'grid') {
    frozenShelfScroll = scrollY;
    frozenGridScroll = 0;
  } else {
    frozenGridScroll = scroller.scrollTop;
  }
  view.mode = mode;
  view.changedAt = time;
  document.documentElement.classList.toggle('grid-mode', mode === 'grid');
  // 연락처는 지금 보이는 스크롤 영역 맨 아래로 옮긴다
  (mode === 'grid' ? scroller : page).append(contact);
  scroller.scrollTop = 0;
  if (mode === 'shelf') scrollTo({ top: frozenShelfScroll, behavior: 'instant' });
  setToggleLabel(mode);
  toggle.setAttribute('aria-pressed', String(mode === 'grid'));
}

// 격자 스크롤(px)
export function scrollPx() {
  return view.mode === 'grid' ? scroller.scrollTop : frozenGridScroll;
}

// 책장 화면 스크롤(px) — 카메라를 이만큼 내린다
export function shelfScrollPx() {
  return view.mode === 'grid' ? frozenShelfScroll : scrollY;
}

export function setContentHeight(px) {
  spacer.style.height = `${Math.ceil(px)}px`;
}

function setToggleLabel(mode) {
  toggle.setAttribute('aria-label', LABELS[mode]);
  toggle.title = LABELS[mode];
}

export function onToggle(callback) {
  setToggleLabel('shelf');
  toggle.addEventListener('click', callback);
}

// "연락하기" — 지금 화면의 맨 아래 연락처로 부드럽게 내려간다
export function scrollToContact() {
  contact.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

// 3D 책을 누를 수 있는 곳 — 캔버스(책장) 또는 스크롤 영역(펼치기)
export function isStageTarget(target) {
  return target instanceof Element && (target.matches('.stage, .shelf-spacer') || target.closest('.grid-scroll') !== null);
}
