// ============================================================
// ProjectCard — used inside Carousel
// Props: { project, lang, onOpen }
// ============================================================
function ProjectCard({ project, lang, onOpen }) {
  const t = window.t;
  const p = project;
  const tags = t(p.tags, lang) || [];

  return (
    <article
      className="card"
      onClick={() => onOpen(p.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(p.id); }}
    >
      <div className="card-meta-top">
        <span className="card-cat">{t(p.categoryLabel, lang)}</span>
        <span className="card-year">{p.y}</span>
      </div>

      <div
        className={`card-thumb ${p.thumbLight ? 'light' : 'dark'}`}
        style={{ background: p.thumbBg }}
      >
        <span className="card-thumb-num">{p.num}</span>
        <span className="card-thumb-label">{p.thumbLabel}</span>
        <span className="card-thumb-corner" style={{ background: p.thumbCorner }} />
        {p.live && <span className="card-live">● FEATURED</span>}
      </div>

      <h3 className="card-title">
        {t(p.title, lang)}<span className="accent">.</span>
      </h3>
      <div className="card-tagline">{t(p.tagline, lang)}</div>

      <div className="card-tags">
        {tags.map((tag, i) => <span key={i}>{tag}</span>)}
      </div>
    </article>
  );
}

window.ProjectCard = ProjectCard;
