import { useRef, useState } from 'react';
import { Topbar } from './components/Topbar';
import { Hero } from './components/Hero';
import { Carousel } from './components/Carousel';
import { ProjectDetail } from './components/ProjectDetail';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { useScrollY } from './hooks/useScrollY';
import { t } from './helpers/t';
import { DATA_EDITORIAL } from './data';
import type { Lang } from './types';

export default function App() {
  const { ui, projects } = DATA_EDITORIAL;

  const [lang, setLang] = useState<Lang>('kor');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>(0);

  const project = selectedId ? projects.find((p) => p.id === selectedId) ?? null : null;

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  };
  const switchLang = (l: Lang) => {
    if (l === lang) return;
    setLang(l);
    showToast(t(ui.toastLang, l));
  };
  const open = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => {
    setSelectedId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nav = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollY = useScrollY();
  const scrolled = scrollY > 12;

  return (
    <>
      <Topbar lang={lang} setLang={switchLang} ui={ui} scrolled={scrolled} />
      <main className="view" key={project ? `detail-${selectedId}` : 'index'}>
        {project ? (
          <ProjectDetail
            project={project}
            projects={projects}
            lang={lang}
            ui={ui}
            onBack={back}
            onNavigate={nav}
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
