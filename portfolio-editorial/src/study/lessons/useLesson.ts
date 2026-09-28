import { useEffect, useState } from 'react';
import type { ToolId } from '../types';
import { loadLesson } from './loadLesson';
import type { Lesson } from './types';

type LessonState = { status: 'loading' } | { status: 'ready'; lesson: Lesson } | { status: 'error'; message: string };

export function useLesson(tool: ToolId, dayIndex: number): LessonState {
  const [state, setState] = useState<LessonState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    loadLesson(tool, dayIndex)
      .then((lesson) => active && setState({ status: 'ready', lesson }))
      .catch((error: unknown) => {
        if (active) setState({ status: 'error', message: error instanceof Error ? error.message : String(error) });
      });
    return () => {
      active = false;
    };
  }, [tool, dayIndex]);

  return state;
}

/** 여러 레슨을 한 번에 불러온다 (복습 페이지의 틀린 문제 목록용). 실패한 레슨은 빠진다 */
export function useLessons(targets: { tool: ToolId; dayIndex: number }[]): Lesson[] {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const signature = targets.map((target) => `${target.tool}-${target.dayIndex}`).join(',');

  useEffect(() => {
    let active = true;
    Promise.allSettled(targets.map((target) => loadLesson(target.tool, target.dayIndex))).then((results) => {
      if (!active) return;
      setLessons(results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])));
    });
    return () => {
      active = false;
    };
    // targets 배열은 매번 새로 만들어지므로 내용(signature)이 바뀔 때만 다시 불러온다
  }, [signature]);

  return lessons;
}
