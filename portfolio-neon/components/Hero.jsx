// ============================================================
// Hero · NEON
// Props: { lang, ui }
// Background grid + two soft glow blobs + huge name title.
// ============================================================
function Hero({ lang, ui }) {
  const t = window.t;
  const meta = t(ui.heroMeta, lang) || [];
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow a" />
        <div className="hero-glow b" />
      </div>
      <div className="hero-inner">
        <div className="hero-top">
          <span className="hero-kicker"><span className="hk-dot" />{t(ui.heroKicker, lang)}</span>
          <span className="hero-loc">{t(ui.heroLoc, lang)}</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-line">{t(ui.nameA, lang)}</span>
          <span className="hero-line accent-line">{t(ui.nameB, lang)}</span>
        </h1>
        <div className="hero-bottom">
          <div className="hero-role">{t(ui.role, lang)}</div>
          <div className="hero-meta">
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                <span>{m}</span>
                {i < meta.length - 1 && <span className="meta-sep">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
