// 청사진 인트로 시간표와 공용 움직임 도구 — 다른 인트로 파일들이 같은 시계를 쓴다.
export const HAND = 'cubic-bezier(.45,0,.25,1)'; // 손처럼 천천히 시작해 천천히 멈춤
export const POP = 'cubic-bezier(.3,1.6,.5,1)';  // 작게 튀어나옴
// 윈도우 '애니메이션 효과 끄기'(움직임 줄이기)는 따르지 않는다 — 사용자 결정(2026-11-02, 모아툴과 같음)

// 시간표 (ms)
export const T = { outline: 260, joint: 800, hatch: 1000, flood: 1700, floodLength: 1000, system: 2450, label: 3000, exit: 5400, exitLength: 650 };
export const SKETCH = { // 단계별 시작 · 한 획 길이 · 다음 획 간격
  construction: { start: 0, length: 300, step: 120 }, outline: { start: T.outline, length: 240, step: 80 },
  joint: { start: T.joint, length: 340, step: 140 }, hatch: { start: T.hatch, length: 90, step: 22 },
};

export const timers = [];
export const later = (ms, fn) => timers.push(setTimeout(fn, ms));
export const animate = (node, keyframes, options) => node.animate(keyframes, { fill: 'both', ...options });
export const drawStroke = (node, delay, duration, easing = HAND) => animate(node, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay, duration, easing });
