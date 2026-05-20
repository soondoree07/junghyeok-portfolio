// ============================================================
// ProjectDetail — same-screen view replacing the index
// Props: { project, projects, lang, ui, onBack, onNavigate }
// ============================================================
function ProjectDetail({ project, projects, lang, ui, onBack, onNavigate }) {
  const t = window.t;
  const p = project;
  const idx = projects.findIndex((x) => x.id === p.id);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  // ←/→/Esc keyboard
  React.useEffect(() => {
    const on = (e) => {
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowLeft') onNavigate(prev.id);
      if (e.key === 'ArrowRight') onNavigate(next.id);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onBack, onNavigate, prev.id, next.id]);

  const did = t(p.did, lang) || [];
  const outcomes = t(p.outcome, lang) || [];
  const tags = t(p.tags, lang) || [];

  const arrowL = t(ui.arrowL, lang);
  const arrowR = t(ui.arrowR, lang);

  return (
    <section className="detail" key={p.id}>
      <div className="detail-toolbar">
        <button className="back" onClick={onBack}>
          <span>{arrowL}</span>
          <span>{t(ui.back, lang)}</span>
        </button>
        <div className="kb-hint">{t(ui.keyboardHint, lang)}</div>
        <div className="prev-next">
          <button onClick={() => onNavigate(prev.id)}>
            <span className="pn-l">{arrowL}</span>
            <span className="pn-meta">
              <span className="pn-lbl">{t(ui.prev, lang)}</span>
              <span className="pn-title">{t(prev.title, lang)}</span>
            </span>
          </button>
          <button onClick={() => onNavigate(next.id)}>
            <span className="pn-meta align-r">
              <span className="pn-lbl">{t(ui.next, lang)}</span>
              <span className="pn-title">{t(next.title, lang)}</span>
            </span>
            <span className="pn-r">{arrowR}</span>
          </button>
        </div>
      </div>

      <div className="detail-kicker">
        <span><span className="accent">● </span>FEATURED · No. {p.num}</span>
        <span className="detail-kicker-r">{p.y} · {String(t(p.client, lang)).toUpperCase()}</span>
      </div>

      <div className="detail-body">
        <div className="db-left">
          <div className={`big-thumb ${p.thumbLight ? '' : 'invert'}`} style={{ background: p.thumbBg }}>
            <div className="big-grid" />
            <span className="big-num">{p.num}</span>
            <span className="big-label" style={{ color: p.thumbLight ? '#F4F1EA' : '#15171A' }}>
              {p.thumbLabel}
            </span>
            <div className="big-corner" style={{ background: p.thumbCorner }} />
          </div>
          <div className="big-meta">
            <div className="big-meta-row"><span className="bmk">{t(ui.detailYear, lang)}</span><span className="bmv">{p.y}</span></div>
            <div className="big-meta-row"><span className="bmk">{t(ui.detailRole, lang)}</span><span className="bmv">{t(p.role, lang)}</span></div>
            <div className="big-meta-row"><span className="bmk">—</span><span className="bmv muted">{t(p.roleSub, lang)}</span></div>
            <div className="big-meta-row"><span className="bmk">{t(ui.detailClient, lang)}</span><span className="bmv">{t(p.client, lang)}</span></div>
            <div className="big-meta-row"><span className="bmk">INDEX</span><span className="bmv">{String(idx + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span></div>
          </div>
        </div>

        <div className="db-right">
          <div className="db-kicker">{t(p.categoryLabel, lang)} · {t(p.client, lang)}</div>
          <h2 className="db-title">{t(p.title, lang)}<span className="accent">.</span></h2>
          <div className="db-tagline">{t(p.tagline, lang)}</div>

          <div className="block">
            <div className="block-label">
              <span><span className="accent">↳ </span>{t(ui.detailDid, lang)}</span>
              <span>01</span>
            </div>
            <ul className="bullets">
              {did.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className="block">
            <div className="block-label">
              <span><span className="accent">↳ </span>{t(ui.detailOutcome, lang)}</span>
              <span>02</span>
            </div>
            <div className="outcomes">
              {outcomes.map(([big, lbl], i) => (
                <div className="outcome" key={i}>
                  <span className="outcome-big">{big}</span>
                  <span className="outcome-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="block">
            <div className="block-label">
              <span><span className="accent">↳ </span>{t(ui.detailTags, lang)}</span>
              <span>03</span>
            </div>
            <div className="tag-row">
              {tags.map((tag, i) => <span key={i}>{tag}</span>)}
            </div>
          </div>

          <a className="visit" href="#" onClick={(e) => e.preventDefault()}>
            <span>{t(ui.visit, lang)}</span>
            <span>{arrowR}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

window.ProjectDetail = ProjectDetail;
