import { useRef, useState, type CSSProperties } from 'react';
import { ProjectCard } from './ProjectCard';
import { t } from '../helpers/t';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Lang, Project, UIStrings } from '../types';

interface Props {
  projects: Project[];
  lang: Lang;
  ui: UIStrings;
  onOpen: (id: string) => void;
}

type StripItem = Project & { _k: string };

export function Carousel({ projects, lang, ui, onOpen }: Props) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const strip: StripItem[] = [
    ...projects.map((p, i) => ({ ...p, _k: 'a-' + i })),
    ...projects.map((p, i) => ({ ...p, _k: 'b-' + i })),
  ];

  const scrollByCard = (dir: -1 | 1) => {
    if (!wrapRef.current) return;
    const card = wrapRef.current.querySelector<HTMLElement>('.card');
    if (!card) return;
    wrapRef.current.scrollBy({ left: (card.offsetWidth + 24) * dir, behavior: 'smooth' });
  };

  const distance = `calc(-1 * (var(--card-w) + var(--gap)) * ${projects.length})`;
  const dur = `${Math.max(80, projects.length * 20)}s`;
  const marqueeStyle: CSSProperties | undefined = reduced
    ? undefined
    : ({ '--distance': distance, animationDuration: dur } as CSSProperties);

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
            {reduced ? '— MANUAL' : hovered ? t(ui.pausedLabel, lang) : t(ui.autoLabel, lang)}
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
          style={marqueeStyle}
        >
          {(reduced ? projects.map((p, i) => ({ ...p, _k: 'r-' + i })) : strip).map((p) => (
            <ProjectCard key={p._k ?? p.id} project={p} lang={lang} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
