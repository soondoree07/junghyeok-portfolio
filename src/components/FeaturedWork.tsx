import { ArrowUpRight } from 'lucide-react';
import { profile } from '../data/profile';
import { projects, type Project } from '../data/projects';
import { LiquidGlass } from './LiquidGlass';

function ProjectCard({ project }: { project: Project }) {
  const href = project.url ?? project.repo;
  return (
    <LiquidGlass
      as="article"
      className="group rounded-[22px] overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {project.videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
            autoPlay
            loop
            muted
            playsInline
            src={project.videoUrl}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #0a1550 0%, #010828 55%, #1a0540 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-cream/80 bg-background/40 px-2.5 py-1 rounded-full backdrop-blur">
            {project.year}
          </span>
          <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-neon/90 bg-background/40 px-2.5 py-1 rounded-full backdrop-blur">
            {project.type}
          </span>
        </div>

        {/* overlay bar */}
        <LiquidGlass className="absolute left-4 right-4 bottom-4 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-cream/55">
              {project.overlayLabel ?? 'ROLE'}
            </p>
            <p className="font-grotesk uppercase tracking-[0.04em] text-[13px] md:text-[14px] text-cream truncate">
              {project.overlayValue ?? project.role ?? project.subtitle ?? ''}
            </p>
          </div>

          <a
            aria-label={`Open ${project.title}`}
            href={href ?? '#'}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noreferrer' : undefined}
            className="shrink-0 w-10 h-10 rounded-full grid place-items-center text-cream transition"
            style={{
              background:
                'linear-gradient(135deg, rgba(140, 90, 255, 0.95), rgba(85, 45, 210, 0.95))',
              boxShadow: '0 8px 22px rgba(100, 60, 240, 0.35)',
            }}
          >
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </LiquidGlass>
      </div>

      <div className="px-5 pt-5 pb-6">
        <h3 className="font-grotesk uppercase tracking-[0.02em] text-cream text-2xl md:text-[26px] leading-[1.05]">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="mt-1 font-mono uppercase tracking-[0.14em] text-[10px] text-cream/55">
            {project.subtitle}
          </p>
        )}
        <p className="mt-3 font-mono text-[12px] leading-[1.7] text-cream/70">
          {project.description}
        </p>
      </div>
    </LiquidGlass>
  );
}

export function FeaturedWork() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section
      id="work"
      className="relative w-full bg-background"
    >
      <div className="mx-auto max-w-content px-5 md:px-10 py-24 md:py-36">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-8">
          <div className="relative">
            <span className="font-condiment text-neon text-3xl md:text-5xl absolute -top-10 md:-top-14 left-0 rotate-[-4deg]">
              {profile.featuredWork.accent}
            </span>
            <h2 className="font-grotesk uppercase text-cream leading-[0.95] tracking-[-0.01em] text-[12vw] md:text-[8vw] lg:text-[5.8vw]">
              {profile.featuredWork.heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="shrink-0">
            <a
              href={profile.featuredWork.ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-col items-start gap-2"
            >
              <span className="font-grotesk uppercase tracking-[0.18em] text-cream text-sm md:text-base neon-underline">
                {profile.featuredWork.ctaLabel}
              </span>
              <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-cream/55">
                {profile.contact.website.replace('https://', '')}
              </span>
            </a>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
