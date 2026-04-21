export interface Profile {
  name: string;
  logoText: string;
  currentPosition: string;
  institution: string;
  aspiration: string;

  hero: {
    heading: string[];
    accent: string;
  };

  about: {
    heading: string[];
    accent: string;
    statement: string[];
    keywords: string[];
  };

  featuredWork: {
    heading: string[];
    accent: string;
    ctaLabel: string;
    ctaHref: string;
  };

  finalCta: {
    heading: string[];
    accent: string;
    note: string;
  };

  vision: {
    ko: string;
    en: string;
    tagline: string;
  };

  contact: {
    email: string;
    phone: string;
    website: string;
    github: string;
    instagram?: string;
    devEnv: string;
  };
}

export const profile: Profile = {
  name: 'Park Junghyeok',
  logoText: 'Junghyeok.',
  currentPosition: 'Undergraduate · UX & Content Planner',
  institution: 'Hanyang University · ICT Convergence · Design Technology',
  aspiration: 'Aspiring Game Designer',

  hero: {
    heading: [
      'DESIGNING SYSTEMS,',
      'PLANNING PLAY.',
      'FROM UX FLOWS',
      'TO GAME LOOPS.',
    ],
    accent: 'Aspiring game designer',
  },

  about: {
    heading: ['JUNGHYEOK,', 'DESIGNER', '& PLANNER.'],
    accent: 'Planner',
    statement: [
      'UNDERGRADUATE AT HANYANG UNIVERSITY — ICT CONVERGENCE, DESIGN TECHNOLOGY.',
      'I PLAN AROUND SYSTEMS, USER FLOW, AND CONTENT ARCHITECTURE —',
      'LEARNING TO JUDGE DECISIONS NOT QUICKLY, BUT CORRECTLY.',
    ],
    keywords: [
      'UX RESEARCH',
      'SYSTEM DESIGN',
      'GAME LOOPS',
      'SERVICE DESIGN',
      'IMMERSIVE MEDIA',
      'CONTENT PLANNING',
      'FRONTEND',
      'AI-ASSISTED DEV',
    ],
  },

  featuredWork: {
    heading: ['SELECTED', 'WORK &', 'DIRECTIONS.'],
    accent: 'Selected',
    ctaLabel: 'EXPLORE PROJECTS',
    ctaHref: 'https://junghyeok.com',
  },

  finalCta: {
    heading: [
      "LET'S BUILD",
      'WHAT COMES',
      'NEXT.',
    ],
    accent: "Let's connect",
    note: 'FROM UX FLOWS TO GAME LOOPS — OPEN TO COLLABORATIONS, MENTORSHIP, AND STUDIOS.',
  },

  vision: {
    ko: '빠르게가 아니라 정확하게.',
    en: 'Not quickly — but correctly.',
    tagline:
      "A good planner's judgment isn't speed. It's the structure behind the question.",
  },

  contact: {
    email: 'soondoree07@gmail.com',
    phone: '010-5003-2782',
    website: 'https://junghyeok.com',
    github: 'https://github.com/soondoree07',
    devEnv: 'https://ai.junghyeok.com',
  },
};
