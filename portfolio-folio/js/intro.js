// 첫 화면 등장 — 이름 · 메뉴 · 키워드 줄이 차례로 나타난다.
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function reveal(selector, fromY, delay, duration, blur = 0) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (reducedMotion) {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'both' });
    return;
  }
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
  reveal('.hint', '1.2vh', 1400, 900);
}
