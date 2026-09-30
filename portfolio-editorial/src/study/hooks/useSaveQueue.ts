// 서버 저장 대기열. 입력이 몰리면 모아서 한 번에 보내고, 실패하면 다음 저장 때 다시 보낸다.
import { useCallback, useEffect, useRef } from 'react';
import { saveRecordsPatch, type RecordsPatch } from '../lib/recordsApi';

const FLUSH_DELAY_MS = 800;

function mergePatch(base: RecordsPatch, next: RecordsPatch): RecordsPatch {
  return {
    days: { ...base.days, ...next.days },
    reviews: { ...base.reviews, ...next.reviews },
    quiz: { ...base.quiz, ...next.quiz },
    postponed: { ...base.postponed, ...next.postponed },
  };
}

function isEmpty(patch: RecordsPatch): boolean {
  return [patch.days, patch.reviews, patch.quiz, patch.postponed].every((entries) => Object.keys(entries ?? {}).length === 0);
}

export function useSaveQueue(onError: () => void) {
  const pending = useRef<RecordsPatch>({});
  const timer = useRef<number>(0);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const flush = useCallback(async (keepalive = false) => {
    window.clearTimeout(timer.current);
    const patch = pending.current;
    if (isEmpty(patch)) return;
    pending.current = {};
    try {
      await saveRecordsPatch(patch, keepalive);
    } catch {
      pending.current = mergePatch(patch, pending.current);
      onErrorRef.current();
    }
  }, []);

  const enqueue = useCallback(
    (patch: RecordsPatch) => {
      pending.current = mergePatch(pending.current, patch);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void flush(), FLUSH_DELAY_MS);
    },
    [flush],
  );

  // 탭을 닫거나 백그라운드로 보낼 때 남은 변경을 바로 보낸다
  useEffect(() => {
    const flushNow = () => {
      if (document.visibilityState === 'hidden') void flush(true);
    };
    document.addEventListener('visibilitychange', flushNow);
    window.addEventListener('pagehide', flushNow);
    return () => {
      document.removeEventListener('visibilitychange', flushNow);
      window.removeEventListener('pagehide', flushNow);
    };
  }, [flush]);

  return enqueue;
}
