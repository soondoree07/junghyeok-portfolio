import { Fragment } from 'react';
import { t } from '../helpers/t';
import type { Lang, UIStrings } from '../types';

interface Props {
  lang: Lang;
  ui: UIStrings;
}

export function Hero({ lang, ui }: Props) {
  const nameB = t(ui.nameB, lang);
  const nameBParts = nameB.split('—');
  const meta = t(ui.heroMeta, lang) || [];

  return (
    <section className="hero">
      <div className="hero-top">
        <span className="hero-issue">{t(ui.issue, lang)}</span>
        <span className="hero-loc">{t(ui.location, lang)}</span>
      </div>

      <h1 className="hero-title">
        <span className="hero-line a">{t(ui.nameA, lang)}</span>
        <span className="hero-line b">
          {nameBParts[0]}
          <span className="accent">—</span>
          {nameBParts[1] || ''}
        </span>
      </h1>

      <div className="hero-bottom">
        <div className="hero-bottom-label">↳ designer / product · brand · interfaces</div>
        <div className="hero-bottom-role">{t(ui.role, lang)}</div>
        <div className="hero-bottom-meta">
          {meta.map((m, i) => (
            <Fragment key={i}>
              <span>{m}</span>
              {i < meta.length - 1 && <span className="hero-bottom-sep">—</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
