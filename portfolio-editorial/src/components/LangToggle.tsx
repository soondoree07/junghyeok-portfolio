import { t } from '../helpers/t';
import type { Lang, UIStrings } from '../types';

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: UIStrings;
}

export function LangToggle({ lang, setLang, ui }: Props) {
  return (
    <div className="lang" role="group" aria-label="language">
      <button className={lang === 'kor' ? 'on' : ''} onClick={() => setLang('kor')}>
        {t(ui.langKo, lang)}
      </button>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
        {t(ui.langEn, lang)}
      </button>
    </div>
  );
}
