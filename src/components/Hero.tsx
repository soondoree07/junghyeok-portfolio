import { Menu } from 'lucide-react';
import { profile } from '../data/profile';
import { navItems } from '../data/nav';
import { socialLinks } from '../data/social';
import { media } from '../data/media';
import { LiquidGlass } from './LiquidGlass';

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full h-[100svh] min-h-[640px] overflow-hidden rounded-b-[28px] md:rounded-b-[48px]"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster=""
        src={media.heroVideo}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/80" />

      <div className="relative z-10 mx-auto max-w-content h-full px-5 md:px-10 flex flex-col">
        {/* Top bar */}
        <header className="pt-6 md:pt-8 flex items-center justify-between gap-4">
          <a
            href="#home"
            className="font-grotesk text-cream tracking-[0.08em] text-xl md:text-2xl"
          >
            {profile.logoText}
          </a>

          <LiquidGlass
            as="nav"
            className="hidden lg:flex items-center gap-1 rounded-full px-2 py-2"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-grotesk tracking-[0.18em] text-[13px] text-cream/85 hover:text-cream px-4 py-2 rounded-full transition"
              >
                {item.label}
              </a>
            ))}
          </LiquidGlass>

          <div className="hidden md:flex items-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <LiquidGlass
                key={label}
                as="a"
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-full w-11 h-11 grid place-items-center text-cream/90 hover:text-neon transition"
              >
                <Icon size={17} strokeWidth={1.6} />
              </LiquidGlass>
            ))}
          </div>

          <LiquidGlass
            as="button"
            type="button"
            aria-label="Menu"
            className="md:hidden rounded-full w-11 h-11 grid place-items-center text-cream"
          >
            <Menu size={18} strokeWidth={1.6} />
          </LiquidGlass>
        </header>

        {/* Accent */}
        <div className="flex-1 flex flex-col justify-end pb-10 md:pb-16">
          <div className="relative">
            <span className="font-condiment text-neon text-3xl md:text-5xl lg:text-6xl absolute -top-14 md:-top-20 left-[-6px] rotate-[-4deg]">
              {profile.hero.accent}
            </span>
          </div>

          <h1 className="font-grotesk text-cream uppercase tracking-[-0.01em] leading-[0.95] text-[13vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw]">
            {profile.hero.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Social row on mobile */}
          <div className="md:hidden mt-8 flex items-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <LiquidGlass
                key={label}
                as="a"
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-full w-10 h-10 grid place-items-center text-cream/90"
              >
                <Icon size={16} strokeWidth={1.6} />
              </LiquidGlass>
            ))}
          </div>

          <div className="mt-10 md:mt-14 flex flex-wrap items-end justify-between gap-6">
            <p className="font-mono uppercase tracking-[0.14em] text-[11px] md:text-[12px] text-cream/70 max-w-md">
              {profile.currentPosition}
              <br />
              {profile.institution}
            </p>
            <p className="font-mono uppercase tracking-[0.14em] text-[11px] md:text-[12px] text-cream/50">
              {profile.vision.en}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
