import { LangToggle } from './LangToggle';
import { t } from '../helpers/t';
import type { Lang, UIStrings } from '../types';

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: UIStrings;
  scrolled: boolean;
}

export function Topbar({ lang, setLang, ui, scrolled }: Props) {
  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="tb-left">
        <span className="tb-mark">PJ<span className="dot">·</span></span>
        <span className="tb-full">Park Junghyeok</span>
      </div>
      <div className="tb-mid">
        <span className="tb-issue">{t(ui.issue, lang)}</span>
      </div>
      <div className="tb-right">
        <span className="tb-tick">
          <span className="tb-tick-dot" />
          {t(ui.booking, lang)}
        </span>
        <LangToggle lang={lang} setLang={setLang} ui={ui} />
      </div>
    </header>
  );
}
