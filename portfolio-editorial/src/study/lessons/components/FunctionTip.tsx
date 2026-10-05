// 레슨 코드 속 함수 이름(.ls-fn)의 뜻 말풍선.
// 마우스가 있는 기기는 올리면 뜨고, 휴대폰은 누르면 뜬다. 바깥을 누르거나 스크롤·Esc 로 닫는다.
// 화면 아래 공간이 모자라면 위로 띄워 잘리지 않게 한다.
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { FunctionEntry, FunctionGlossary } from '../functionGlossary';

const GAP = 8;
const EDGE = 12;

interface OpenTip {
  name: string;
  entry: FunctionEntry;
  anchor: HTMLElement;
}

function findFunctionTarget(target: EventTarget): HTMLElement | null {
  return (target as HTMLElement).closest<HTMLElement>('[data-fn]');
}

function canHover(): boolean {
  return window.matchMedia('(hover: hover)').matches;
}

/** 레슨 본문에 붙일 이벤트 처리기와 지금 열린 말풍선 */
export function useFunctionTip(glossary: FunctionGlossary) {
  const [tip, setTip] = useState<OpenTip | null>(null);
  const close = () => setTip(null);

  const openFor = (anchor: HTMLElement) => {
    const name = anchor.dataset.fn ?? '';
    const entry = glossary[name];
    if (entry) setTip({ name, entry, anchor });
  };

  useEffect(() => {
    if (!tip) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!tip.anchor.contains(target) && !document.querySelector('.ls-fn-tip')?.contains(target)) close();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && close();
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [tip]);

  const handlers = {
    onClick: (event: MouseEvent<HTMLElement>) => {
      const anchor = findFunctionTarget(event.target);
      if (!anchor) return;
      if (tip?.anchor === anchor && !canHover()) close();
      else openFor(anchor);
    },
    onMouseOver: (event: MouseEvent<HTMLElement>) => {
      const anchor = findFunctionTarget(event.target);
      if (anchor && canHover()) openFor(anchor);
    },
    onMouseOut: (event: MouseEvent<HTMLElement>) => {
      const anchor = findFunctionTarget(event.target);
      if (anchor && canHover() && !anchor.contains(event.relatedTarget as Node)) close();
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      const anchor = findFunctionTarget(event.target);
      if (!anchor || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      if (tip?.anchor === anchor) close();
      else openFor(anchor);
    },
  };

  return { tip, handlers };
}

export function FunctionTip({ tip }: { tip: OpenTip }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // 말풍선 크기를 잰 뒤 자리를 정한다: 아래가 모자라면 위로, 좌우는 화면 안쪽으로.
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const anchor = tip.anchor.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = box;
    // 휴대폰에서는 window.innerWidth/Height 가 실제 보이는 화면보다 클 수 있어 clientWidth/Height 를 쓴다
    const { clientWidth: viewWidth, clientHeight: viewHeight } = document.documentElement;
    const fitsBelow = anchor.bottom + GAP + height <= viewHeight - EDGE;
    const top = fitsBelow ? anchor.bottom + GAP : Math.max(EDGE, anchor.top - GAP - height);
    const left = Math.min(Math.max(EDGE, anchor.left), viewWidth - width - EDGE);
    setPosition({ top, left });
  }, [tip]);

  // 유리 면(backdrop-filter) 안에서는 fixed 위치가 틀어지므로 body 에 바로 붙인다
  return createPortal(
    <div
      ref={ref}
      className="ls-fn-tip"
      role="tooltip"
      style={position ? { top: position.top, left: position.left } : { visibility: 'hidden', top: 0, left: 0 }}
    >
      <p className="ls-fn-tip-syntax">{tip.entry.syntax}</p>
      <p className="ls-fn-tip-meaning">{tip.entry.meaning}</p>
      <p className="ls-fn-tip-example">{tip.entry.example}</p>
    </div>,
    document.body,
  );
}
