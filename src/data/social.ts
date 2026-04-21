import type { LucideIcon } from 'lucide-react';
import { Github, Globe, Mail, Terminal } from 'lucide-react';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  {
    label: 'Email',
    href: 'mailto:soondoree07@gmail.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/soondoree07',
    icon: Github,
  },
  {
    label: 'Website',
    href: 'https://junghyeok.com',
    icon: Globe,
  },
  {
    label: 'Dev Environment',
    href: 'https://ai.junghyeok.com',
    icon: Terminal,
  },
];
