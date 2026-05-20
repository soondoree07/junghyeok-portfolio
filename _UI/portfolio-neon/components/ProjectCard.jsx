// ============================================================
// ProjectCard · NEON
// Each card carries its own thumbAccent color via CSS var.
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
      style={{ '--card-accent': p.thumbAccent }}
    >
      <div className="card-head">
        <span className="card-num">{p.num}</span>
        <span className="card-cat">{t(p.categoryLabel, lang)}</span>
      </div>

      <div className="card-thumb" style={{ background: p.thumbBg }}>
        <div className="thumb-grid" />
        <span className="thumb-num">{p.num}</span>
        <span className="thumb-label">{p.thumbLabel}</span>
        <span className="thumb-mark">↗</span>
        {p.live && <span className="thumb-live">● LIVE</span>}
      </div>

      <h3 className="card-title">{t(p.title, lang)}</h3>
      <div className="card-tagline">{t(p.tagline, lang)}</div>

      <div className="card-foot">
        <div className="card-tags">
          {tags.map((tag, i) => <span key={i}>{tag}</span>)}
        </div>
        <span className="card-year">{p.y}</span>
      </div>
    </article>
  );
}

window.ProjectCard = ProjectCard;
