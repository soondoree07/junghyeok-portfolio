// 해시 라우트 정의. 주소 문자열은 여기서만 만들고 해석한다.
// 이 사이트는 공부 사이트라 빈 주소(/)는 "오늘 공부"로, 예전 포트폴리오 홈은 #/work 로 간다.
import { isToolId } from './data/tools';
import { isValidDate } from './lib/seoulDate';
import type { ToolId } from './types';

export type Route =
  | { name: 'home' }
  | { name: 'roadmap' }
  | { name: 'overview' }
  | { name: 'today' }
  | { name: 'day'; date: string }
  | { name: 'tool'; tool: ToolId }
  | { name: 'lesson'; tool: ToolId; day: number }
  | { name: 'review' }
  | { name: 'log' };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [section, page, param, extra] = parts;

  if (!section) return { name: 'today' };
  if (section === 'work') return { name: 'home' };
  if (section === 'roadmap') return { name: 'roadmap' };
  if (section !== 'study') return { name: 'today' };

  if (!page) return { name: 'overview' };
  if (page === 'today') return { name: 'today' };
  if (page === 'review') return { name: 'review' };
  if (page === 'log') return { name: 'log' };
  if (page === 'day' && param && isValidDate(param)) return { name: 'day', date: param };
  if (page === 'tool' && param && isToolId(param)) return { name: 'tool', tool: param };
  if (page === 'lesson' && param && isToolId(param) && /^\d{1,2}$/.test(extra ?? '')) {
    return { name: 'lesson', tool: param, day: Number(extra) };
  }
  return { name: 'overview' };
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/work';
    case 'roadmap':
      return '#/roadmap';
    case 'overview':
      return '#/study';
    case 'today':
      return '#/study/today';
    case 'day':
      return `#/study/day/${route.date}`;
    case 'tool':
      return `#/study/tool/${route.tool}`;
    case 'lesson':
      return `#/study/lesson/${route.tool}/${route.day}`;
    case 'review':
      return '#/study/review';
    case 'log':
      return '#/study/log';
  }
}
