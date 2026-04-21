import { profile } from '../data/profile';
import { media } from '../data/media';

export function About() {
  return (
    <section
      id="about"
      className="relative w-full min-h-[100svh] overflow-hidden"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={media.aboutVideo}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/45 to-background/90" />

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-10 py-24 md:py-32 min-h-[100svh] flex flex-col">
        {/* top row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <div className="relative lg:col-span-7">
            <span className="font-condiment text-neon text-3xl md:text-5xl absolute -top-10 md:-top-14 left-0 rotate-[-4deg]">
              {profile.about.accent}
            </span>
            <h2 className="font-grotesk uppercase text-cream leading-[0.95] tracking-[-0.01em] text-[12vw] md:text-[8vw] lg:text-[6.2vw]">
              {profile.about.heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-16">
            <p className="font-mono uppercase tracking-[0.14em] text-[11px] md:text-[12px] text-cream/80 leading-[1.9] max-w-xl">
              {profile.about.statement.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>

            <div className="mt-10 pt-6 border-t border-cream/10">
              <p className="font-condiment text-neon text-3xl md:text-4xl leading-tight">
                {profile.vision.ko}
              </p>
              <p className="mt-3 font-mono uppercase tracking-[0.16em] text-[11px] text-cream/55 max-w-md">
                {profile.vision.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* bottom decorative keyword row */}
        <div className="mt-auto pt-24 md:pt-32">
          <div
            aria-hidden
            className="font-grotesk uppercase tracking-[0.02em] leading-[0.95] text-cream/10 text-[10vw] md:text-[6vw] whitespace-nowrap overflow-hidden"
          >
            {[...profile.about.keywords, ...profile.about.keywords].join('   /   ')}
          </div>
          <div
            aria-hidden
            className="mt-2 font-grotesk uppercase tracking-[0.02em] leading-[0.95] text-cream/[0.06] text-[9vw] md:text-[5vw] whitespace-nowrap overflow-hidden"
          >
            {[...profile.about.keywords].reverse().join('   /   ')}
          </div>
        </div>
      </div>
    </section>
  );
}
