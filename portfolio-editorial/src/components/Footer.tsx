import { t } from '../helpers/t';
import type { Lang, UIStrings } from '../types';

interface Props {
  ui: UIStrings;
  lang: Lang;
}

export function Footer({ ui, lang }: Props) {
  const email = t(ui.footerEmail, lang);
  const git = t(ui.footerGit, lang);
  return (
    <footer className="footer">
      <div className="footer-l">{t(ui.footerL, lang)}</div>
      <div className="footer-c">{t(ui.footerC, lang)}</div>
      <div className="footer-r">
        <a href={`mailto:${email}`}>{email}</a>
        <span className="footer-sep">·</span>
        <a href={`https://${git}`} target="_blank" rel="noreferrer">{git}</a>
      </div>
    </footer>
  );
}
