// ============================================================
// APP · NEON DARK
// Slim coordinator. All copy lives in data.js (DATA_NEON).
// Layout components are in ./components/*.jsx:
//   LangToggle, Hero, ProjectCard, Carousel, ProjectDetail
// ============================================================

// ---------- Hooks (shared) ----------
window.useReducedMotion = function () {
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

// ---------- Topbar (uses LangToggle) ----------
function Topbar({ lang, setLang, ui, scrolled }) {
  const t = window.t;
  const LangToggle = window.LangToggle;
  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="tb-left">
        <span className="tb-glow">●</span>
        <span className="tb-badge">{t(ui.badge, lang)}</span>
      </div>
      <div className="tb-mid">
        <span className="tb-status">
          <span className="tb-status-dot" />
          {t(ui.status, lang)}
        </span>
      </div>
      <div className="tb-right">
        <LangToggle lang={lang} setLang={setLang} ui={ui} />
      </div>
    </header>
  );
}

// ---------- Footer + Toast ----------
function Footer({ ui, lang }) {
  const t = window.t;
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

function Toast({ toast }) {
  return (
    <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">
      <span className="t-dot" />
      <span>{toast || ''}</span>
    </div>
  );
}

// ---------- App ----------
function App() {
  const t = window.t;
  const data = window.DATA_NEON;
  const { ui, projects } = data;

  const [lang, setLang] = React.useState('kor');
  const [selectedId, setSelectedId] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const toastTimer = React.useRef(0);

  const project = selectedId ? projects.find((p) => p.id === selectedId) : null;

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };
  const switchLang = (l) => {
    if (l === lang) return;
    setLang(l);
    showToast(t(ui.toastLang, l));
  };
  const open = (id) => { setSelectedId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => { setSelectedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const nav  = (id) => { setSelectedId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const scrollY = useScrollY();
  const scrolled = scrollY > 12;

  const Hero = window.Hero;
  const Carousel = window.Carousel;
  const ProjectDetail = window.ProjectDetail;

  return (
    <>
      <Topbar lang={lang} setLang={switchLang} ui={ui} scrolled={scrolled} />
      <main className="view" key={project ? `detail-${selectedId}` : 'index'}>
        {project ? (
          <ProjectDetail
            project={project} projects={projects} lang={lang} ui={ui}
            onBack={back} onNavigate={nav}
          />
        ) : (
          <>
            <Hero lang={lang} ui={ui} />
            <Carousel projects={projects} lang={lang} ui={ui} onOpen={open} />
          </>
        )}
      </main>
      <Footer ui={ui} lang={lang} />
      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
