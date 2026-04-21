import { profile } from '../data/profile';
import { media } from '../data/media';
import { socialLinks } from '../data/social';
import { LiquidGlass } from './LiquidGlass';

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative w-full bg-background"
    >
      <div className="relative mx-auto max-w-content px-5 md:px-10 pt-24 md:pt-36 pb-20">
        <div className="relative">
          <video
            className="w-full h-auto block rounded-[24px] md:rounded-[36px]"
            autoPlay
            loop
            muted
            playsInline
            src={media.finalCtaVideo}
          />
          <div className="absolute inset-0 rounded-[24px] md:rounded-[36px] bg-gradient-to-b from-background/10 via-transparent to-background/75 pointer-events-none" />

          {/* text overlay */}
          <div className="absolute inset-0 p-6 md:p-12 lg:p-16 flex flex-col justify-between pointer-events-none">
            <div className="flex items-start justify-end">
              <span className="font-condiment text-neon text-3xl md:text-5xl lg:text-6xl rotate-[-3deg]">
                {profile.finalCta.accent}
              </span>
            </div>

            <div className="max-w-5xl">
              <h2 className="font-grotesk uppercase text-cream leading-[0.9] tracking-[-0.01em] text-[14vw] md:text-[9vw] lg:text-[7vw]">
                {profile.finalCta.heading.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-xl font-mono uppercase tracking-[0.14em] text-[11px] md:text-[12px] text-cream/70">
                {profile.finalCta.note}
              </p>
            </div>
          </div>

          {/* Bottom-left icon stack */}
          <LiquidGlass className="absolute left-6 md:left-10 bottom-6 md:bottom-10 rounded-full p-1.5 md:p-2 flex flex-col gap-1.5 md:gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full grid place-items-center text-cream/90 hover:text-neon transition"
              >
                <Icon size={16} strokeWidth={1.6} />
              </a>
            ))}
          </LiquidGlass>
        </div>

        {/* footer line */}
        <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-mono uppercase tracking-[0.18em] text-[10px] md:text-[11px] text-cream/55">
            © {new Date().getFullYear()} · {profile.name} · {profile.contact.email}
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-[10px] md:text-[11px] text-cream/45">
            {profile.contact.website.replace('https://', '')} · {profile.contact.devEnv.replace('https://', '')}
          </p>
        </div>
      </div>
    </section>
  );
}
