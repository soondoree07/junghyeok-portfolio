// ============================================================
// Carousel — auto-scrolling marquee of ProjectCard
// Props: { projects, lang, ui, onOpen }
// Notes:
//   - Strip is exactly 2x for seamless loop.
//   - Pause is pure CSS (:has) — see editorial.html.
//   - Reduced-motion: scroll-snap manual mode with arrows.
// ============================================================
function Carousel({ projects, lang, ui, onOpen }) {
  const t = window.t;
  const ProjectCard = window.ProjectCard;
  const reduced = window.useReducedMotion();
  const wrapRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(false);

  const strip = [
    ...projects.map((p, i) => ({ ...p, _k: 'a-' + i })),
    ...projects.map((p, i) => ({ ...p, _k: 'b-' + i })),
  ];

  const scrollByCard = (dir) => {
    if (!wrapRef.current) return;
    const card = wrapRef.current.querySelector('.card');
    if (!card) return;
    wrapRef.current.scrollBy({ left: (card.offsetWidth + 24) * dir, behavior: 'smooth' });
  };

  const distance = `calc(-1 * (var(--card-w) + var(--gap)) * ${projects.length})`;
  const dur = `${Math.max(80, projects.length * 20)}s`;

  return (
    <section className="works">
      <div className="works-head">
        <div className="works-left">
          <span className="works-kicker">
            <span className="accent">● </span>{t(ui.sectionLabel, lang)}
          </span>
          <span className="works-meta">{t(ui.sectionMeta, lang)}</span>
        </div>
        <div className="works-right">
          <div className={`status ${hovered && !reduced ? 'on' : ''}`}>
            <span className="status-dot" />
            {reduced ? '— MANUAL' : (hovered ? t(ui.pausedLabel, lang) : t(ui.autoLabel, lang))}
          </div>
          <div className="arrows">
            <button onClick={() => scrollByCard(-1)} aria-label="prev">{t(ui.arrowL, lang)}</button>
            <button onClick={() => scrollByCard(1)} aria-label="next">{t(ui.arrowR, lang)}</button>
          </div>
        </div>
      </div>

      <div className="works-nudge">
        {reduced ? t(ui.nudgeReduced, lang) : t(ui.nudge, lang)}
      </div>

      <div
        className={`marquee-wrap ${reduced ? 'scroll-mode' : ''}`}
        ref={wrapRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`marquee ${reduced ? 'no-anim' : ''}`}
          style={!reduced ? { '--distance': distance, animationDuration: dur } : undefined}
        >
          {(reduced ? projects : strip).map((p) => (
            <ProjectCard key={p._k || p.id} project={p} lang={lang} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

window.Carousel = Carousel;
