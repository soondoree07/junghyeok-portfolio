import { href, type Route } from '../routes';

const LINKS: { route: Route; label: string }[] = [
  { route: { name: 'roadmap' }, label: '로드맵' },
  { route: { name: 'overview' }, label: '학습 계획' },
  { route: { name: 'today' }, label: '오늘 공부' },
  { route: { name: 'review' }, label: '복습' },
  { route: { name: 'log' }, label: '기록' },
];

function isActive(link: Route, current: Route): boolean {
  if (link.name === 'overview') return current.name === 'overview' || current.name === 'tool';
  if (link.name === 'today') return current.name === 'today' || current.name === 'day';
  return link.name === current.name;
}

export function StudyNav({ route }: { route: Route }) {
  return (
    <nav className="st-nav" aria-label="학습 섹션">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={href(link.route)}
          className={isActive(link.route, route) ? 'on' : ''}
          aria-current={isActive(link.route, route) ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
