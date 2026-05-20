// ============================================================
// HOOKS
// ============================================================
const useReducedMotion = () => {
  const [r, setR] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = (e) => setR(e.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
};

const useKey = (handler) => {
  React.useEffect(() => {
    const on = (e) => handler(e);
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [handler]);
};

const useScrollY = () => {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);
  return y;
};

// ============================================================
// TOPBAR
// ============================================================
function Topbar({ lang, setLang, copy, scrolled }) {
  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="tb-left">
        <span className="tb-orb" />
        <span className="tb-badge">{copy.badge}</span>
      </div>
      <div className="tb-mid">
        <span className="tb-status">
          <span className="tb-status-dot" />
          {copy.status}
        </span>
      </div>
      <div className="tb-right">
        <div className="lang" role="group" aria-label="language">
          <button className={lang === 'kor' ? 'on' : ''} onClick={() => setLang('kor')}>{copy.lang.kor}</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>{copy.lang.en}</button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ copy }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="bubble b4" />
        <div className="bubble b5" />
      </div>
      <div className="hero-inner">
        <div className="hero-top">
          <span className="hero-kicker"><span className="hk-orb" />Seoul · 09:42 KST</span>
          <span className="hero-loc">Q3 · 2026 · booking</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-line">{copy.name[0]}<span className="dot">.</span></span>
          <span className="hero-line grad">{copy.name[1]}</span>
        </h1>
        <div className="hero-bottom">
          <div className="hero-role">{copy.role}</div>
          <div className="hero-meta">
            {copy.heroMeta.map((m, i) => (
              <span key={i} className="meta-pill">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CARD
// ============================================================
function ProjectCard({ p, onOpen }) {
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
        <span className="card-cat">{p.categoryLabel}</span>
      </div>
      <div className="card-thumb" style={{ background: p.thumbGrad }}>
        <span className="thumb-num">{p.num}</span>
        <span className="thumb-label">{p.thumbLabel}</span>
        <span className="thumb-mark">↗</span>
        {p.live && <span className="thumb-live">● live</span>}
      </div>
      <h3 className="card-title">{p.title}</h3>
      <div className="card-tagline">{p.tagline}</div>
      <div className="card-foot">
        <div className="card-tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <span className="card-year">{p.y}</span>
      </div>
    </article>
  );
}

// ============================================================
// MARQUEE
// ============================================================
function Marquee({ projects, onOpen, copy }) {
  const reduced = useReducedMotion();
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
          <span className="section-kicker">— {copy.sectionLabel}</span>
          <span className="section-meta">{copy.sectionMeta}</span>
        </div>
        <div className="works-right">
          <div className={`status ${hovered && !reduced ? 'on' : ''}`}>
            <span className="status-dot" />
            {reduced ? '— 수동' : (hovered ? copy.pausedLabel : copy.autoLabel)}
          </div>
          <div className="arrows">
            <button onClick={() => scrollByCard(-1)} aria-label="prev">{copy.arrow.l}</button>
            <button onClick={() => scrollByCard(1)} aria-label="next">{copy.arrow.r}</button>
          </div>
        </div>
      </div>
      <div className="works-nudge">{reduced ? copy.nudgeReduced : copy.nudge}</div>
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
            <ProjectCard key={p._k || p.id} p={p} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// DETAIL
// ============================================================
function Detail({ project, projects, onBack, onNavigate, copy }) {
  const idx = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  useKey(React.useCallback((e) => {
    if (e.key === 'Escape') onBack();
    if (e.key === 'ArrowLeft') onNavigate(prev.id);
    if (e.key === 'ArrowRight') onNavigate(next.id);
  }, [onBack, onNavigate, prev.id, next.id]));

  return (
    <section className="detail" key={project.id} style={{ '--card-accent': project.thumbAccent }}>
      <div className="detail-toolbar">
        <button className="back" onClick={onBack}>
          <span>{copy.arrow.l}</span>
          <span>{copy.actions.back}</span>
        </button>
        <div className="kb-hint">{copy.detail.keyboardHint}</div>
        <div className="prev-next">
          <button onClick={() => onNavigate(prev.id)}>
            <span className="pn-l">{copy.arrow.l}</span>
            <span className="pn-meta">
              <span className="pn-lbl">{copy.actions.prev}</span>
              <span className="pn-title">{prev.title}</span>
            </span>
          </button>
          <button onClick={() => onNavigate(next.id)}>
            <span className="pn-meta align-r">
              <span className="pn-lbl">{copy.actions.next}</span>
              <span className="pn-title">{next.title}</span>
            </span>
            <span className="pn-r">{copy.arrow.r}</span>
          </button>
        </div>
      </div>

      <div className="detail-kicker">
        <span><span className="dk-orb" />Featured · No. {project.num}</span>
        <span className="dk-r">{project.y} · {project.client}</span>
      </div>

      <div className="detail-body">
        <div className="db-left">
          <div className="big-thumb" style={{ background: project.thumbGrad }}>
            <span className="big-num">{project.num}</span>
            <span className="big-label">{project.thumbLabel}</span>
            <span className="big-mark">↗</span>
          </div>
          <div className="big-meta">
            <div className="big-meta-row"><span className="bmk">{copy.detail.year}</span><span className="bmv">{project.y}</span></div>
            <div className="big-meta-row"><span className="bmk">{copy.detail.role}</span><span className="bmv">{project.role}</span></div>
            <div className="big-meta-row"><span className="bmk">—</span><span className="bmv muted">{project.roleSub}</span></div>
            <div className="big-meta-row"><span className="bmk">{copy.detail.client}</span><span className="bmv">{project.client}</span></div>
            <div className="big-meta-row"><span className="bmk">Index</span><span className="bmv">{copy.detail.ofTotal(idx + 1, projects.length)}</span></div>
          </div>
        </div>
        <div className="db-right">
          <div className="db-kicker">{project.categoryLabel} · {project.client}</div>
          <h2 className="db-title">{project.title}</h2>
          <div className="db-tagline">{project.tagline}</div>

          <div className="block">
            <div className="block-label"><span className="bl-num">01</span> {copy.detail.did}</div>
            <ul className="bullets">{project.did.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>

          <div className="block">
            <div className="block-label"><span className="bl-num">02</span> {copy.detail.outcome}</div>
            <div className="outcomes">
              {project.outcome.map(([big, lbl]) => (
                <div className="outcome" key={lbl}>
                  <span className="outcome-big">{big}</span>
                  <span className="outcome-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="block">
            <div className="block-label"><span className="bl-num">03</span> {copy.detail.tags}</div>
            <div className="tag-row">
              {project.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>

          <a className="visit" href="#" onClick={(e) => e.preventDefault()}>
            <span>{copy.actions.visit}</span>
            <span>{copy.arrow.r}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER + TOAST
// ============================================================
function Footer({ copy }) {
  return (
    <footer className="footer">
      <div className="footer-l">{copy.footer.l}</div>
      <div className="footer-c">{copy.footer.c}</div>
      <div className="footer-r">
        <a href={`mailto:${copy.footer.email}`}>{copy.footer.email}</a>
        <span className="footer-sep">·</span>
        <a href={`https://${copy.footer.github}`} target="_blank" rel="noreferrer">{copy.footer.github}</a>
      </div>
    </footer>
  );
}

function Toast({ toast }) {
  return (
    <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">
      <span className="t-dot" />
      <span>{toast || ''}</span>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
function App() {
  const [lang, setLang] = React.useState('kor');
  const [selectedId, setSelectedId] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const toastTimer = React.useRef(0);
  const copy = window.SAMPLE_BUBBLE[lang];
  const project = selectedId ? copy.projects.find((p) => p.id === selectedId) : null;

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };
  const switchLang = (l) => {
    if (l === lang) return;
    setLang(l);
    showToast(window.SAMPLE_BUBBLE[l].toast.lang);
  };
  const open = (id) => { setSelectedId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => { setSelectedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const nav  = (id) => { setSelectedId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const scrollY = useScrollY();
  const scrolled = scrollY > 12;

  return (
    <>
      <Topbar lang={lang} setLang={switchLang} copy={copy} scrolled={scrolled} />
      <main className="view" key={project ? `detail-${selectedId}` : 'index'}>
        {project ? (
          <Detail project={project} projects={copy.projects} onBack={back} onNavigate={nav} copy={copy} />
        ) : (
          <>
            <Hero copy={copy} />
            <Marquee projects={copy.projects} onOpen={open} copy={copy} />
          </>
        )}
      </main>
      <Footer copy={copy} />
      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
