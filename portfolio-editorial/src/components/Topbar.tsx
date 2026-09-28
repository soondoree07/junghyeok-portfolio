import { LangToggle } from './LangToggle';
import { t } from '../helpers/t';
import { href, type Route } from '../study/routes';
import type { Lang, UIStrings } from '../types';

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: UIStrings;
  scrolled: boolean;
  route: Route;
}

export function Topbar({ lang, setLang, ui, scrolled, route }: Props) {
  const links = [
    { label: ui.navWork, target: { name: 'home' } as Route, active: route.name === 'home' },
    { label: ui.navRoadmap, target: { name: 'roadmap' } as Route, active: route.name === 'roadmap' },
    {
      label: ui.navStudy,
      target: { name: 'overview' } as Route,
      active: route.name !== 'home' && route.name !== 'roadmap',
    },
  ];

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <a className="tb-left" href={href({ name: 'home' })}>
        <span className="tb-mark">PJ<span className="dot">·</span></span>
        <span className="tb-full">Park Junghyeok</span>
      </a>
      <div className="tb-mid">
        <span className="tb-issue">{t(ui.issue, lang)}</span>
      </div>
      <div className="tb-right">
        <nav className="tb-nav" aria-label="main">
          {links.map((link) => (
            <a key={link.target.name} href={href(link.target)} className={link.active ? 'on' : ''}>
              {t(link.label, lang)}
            </a>
          ))}
        </nav>
        <span className="tb-tick">
          <span className="tb-tick-dot" />
          {t(ui.booking, lang)}
        </span>
        <LangToggle lang={lang} setLang={setLang} ui={ui} />
      </div>
    </header>
  );
}
