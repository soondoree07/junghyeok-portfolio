export type ProjectType =
  | 'industry'
  | 'personal'
  | 'client'
  | 'academic'
  | 'capstone'
  | 'tool';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  year: string;
  type: ProjectType;
  featured: boolean;
  overlayLabel?: string;
  overlayValue?: string;
  videoUrl?: string;
  description: string;
  role?: string;
  stack?: string[];
  url?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    id: 'zellopang',
    title: 'Zellopang',
    subtitle: 'WAVLE · Reward App',
    year: '2026 · Pre-Launch',
    type: 'industry',
    featured: true,
    overlayLabel: 'TYPE',
    overlayValue: 'INDUSTRY · PRE-LAUNCH',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    description:
      "WAVLE's next reward-based mobile app for Gen-Z — attendance, referrals, ad missions, cash-out.",
    role: 'Planning 50% · Design 100%',
  },
  {
    id: 'pokenova-pochams',
    title: 'pokenova × pochams',
    subtitle: 'Pokémon Champions Ecosystem',
    year: '2026',
    type: 'personal',
    featured: true,
    overlayLabel: 'FOCUS',
    overlayValue: 'SYSTEM DESIGN · 1,285 POKÉMON',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    description:
      'A two-layer product: a dex + quiz client and an API-first team builder community. Solo planning, data, and full-stack.',
    role: 'Solo Product · System + Data Design',
    stack: ['Next.js', 'Neon Postgres', 'Firebase', 'Vercel'],
    url: 'https://pochams.com',
    repo: 'https://github.com/soondoree07/pokenova_project',
  },
  {
    id: 'jbae-portfolio',
    title: 'jbae-portfolio',
    subtitle: 'Artist Archive · Client Work',
    year: '2026',
    type: 'client',
    featured: true,
    overlayLabel: 'SCOPE',
    overlayValue: '134 ARTWORKS · 19 YEARS',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    description:
      "A 30-year painter's archive — 134 works across 2007–2026, served from a single data.json no-build architecture.",
    role: 'IA + Full-Stack',
    stack: ['HTML/CSS/JS', 'GitHub Pages'],
    url: 'https://soondoree07.github.io/jbae-portfolio',
    repo: 'https://github.com/soondoree/jbae-portfolio',
  },
  {
    id: 'encore',
    title: 'ENCORE',
    subtitle: 'Virtual Legend Concert Platform',
    year: '2026 · Ongoing',
    type: 'academic',
    featured: false,
    overlayLabel: 'AREA',
    overlayValue: 'IMMERSIVE MEDIA',
    description:
      'AI/VR concert platform bridging K-pop fandoms and Korean classical artists — concept, architecture, visual direction.',
    role: 'Concept · Platform Architecture · Visual Direction',
  },
  {
    id: 'ohouse-ux',
    title: 'Single-Household UX',
    subtitle: 'Service Redesign · Ohouse',
    year: '2026 · Ongoing',
    type: 'academic',
    featured: false,
    overlayLabel: 'METHOD',
    overlayValue: 'USER RESEARCH · 5+ INTERVIEWS',
    description:
      'A service redesign for single-household users grounded in 5+ depth interviews, profile sheets, and research logs.',
    role: 'UX Research · Service Design',
  },
  {
    id: 'remote-claude-dashboard',
    title: 'Remote Claude Code',
    subtitle: 'Personal Dev Tool',
    year: '2026',
    type: 'tool',
    featured: false,
    overlayLabel: 'ROLE',
    overlayValue: 'SOLO · INFRASTRUCTURE',
    description:
      'Browser-based remote terminal for vibe-coding into my home machine from anywhere. Next.js · xterm.js · WebSocket · node-pty.',
    role: 'Solo · Full-Stack + Infra',
    stack: ['Next.js', 'xterm.js', 'WebSocket', 'node-pty', 'Cloudflare Tunnel'],
    url: 'https://ai.junghyeok.com',
  },
  {
    id: 'lopa',
    title: 'LOPA',
    subtitle: 'Path-of-Experience Map App',
    year: '2025',
    type: 'capstone',
    featured: false,
    overlayLabel: 'FOCUS',
    overlayValue: 'SERVICE ARCHITECTURE',
    description:
      'A locals-validated path app moving beyond POI-centric maps — survey n=54, persona, customer journey, service flow.',
    role: 'Problem Definition · Service Architecture · UX Flow',
  },
  {
    id: 'rescue-dog-platform',
    title: 'Rescue Dog Platform',
    subtitle: 'Startup Capstone',
    year: '2025',
    type: 'capstone',
    featured: false,
    overlayLabel: 'ROLE',
    overlayValue: 'PLANNING + DESIGN',
    description:
      'A trust-first rescue-dog adoption platform reimagined against shelter-centric information structures.',
    role: 'Planning 30% · Design 100%',
    stack: ['Figma'],
  },
  {
    id: 'smart-highway',
    title: 'Smart Highway',
    subtitle: 'Night Accident Prevention',
    year: '2025',
    type: 'academic',
    featured: false,
    overlayLabel: 'FLOW',
    overlayValue: 'SENSE → JUDGE → WARN → CONTROL',
    description:
      'A connected-mobility system that fuses driver state, road conditions, and V2I cues into a single decision loop.',
    role: 'System Concept · Research · UX Flow',
  },
  {
    id: 'doniidweji-analysis',
    title: '돈이돼지 Analysis',
    subtitle: 'WAVLE · Industry Research',
    year: '2025',
    type: 'industry',
    featured: false,
    overlayLabel: 'LOOP',
    overlayValue: 'ENTRY → ACT → REWARD → RETURN',
    description:
      "Deconstructed a reward-app's retention loop for WAVLE — the analysis that became the brief for Zellopang.",
    role: 'UX Analysis · Retention Loop',
  },
];
