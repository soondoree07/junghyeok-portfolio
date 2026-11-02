// 첫 화면 등장 — 이름 · 메뉴 · 키워드 줄이 차례로 나타난다.
const EASE = 'cubic-bezier(.2,.8,.2,1)';
// 윈도우 '애니메이션 효과 끄기'(움직임 줄이기)는 따르지 않는다 — 사용자 결정(2026-11-02, 모아툴과 같음)

function reveal(selector, fromY, delay, duration, blur = 0) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.animate(
    [
      { opacity: 0, transform: `translateY(${fromY})`, filter: `blur(${blur}px)` },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
    ],
    { duration, delay, easing: EASE, fill: 'both' },
  );
}

export function playIntro() {
  reveal('.wordmark', '4vh', 150, 1400, 14);
  reveal('.nav', '-1.2vh', 700, 900);
  reveal('.keywords', '1.2vh', 850, 900);
}
