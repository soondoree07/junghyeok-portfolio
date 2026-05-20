export type Lang = 'kor' | 'en';

export type Localized<T> = { ko: T; en: T };

export type LocalizedString = Localized<string>;
export type LocalizedStringArray = Localized<string[]>;
export type LocalizedOutcomes = Localized<[string, string][]>;

export interface Project {
  id: string;
  num: string;
  y: string;
  category: 'company' | 'personal' | 'student' | 'client';
  live?: boolean;
  thumbBg: string;
  thumbLight: boolean;
  thumbCorner: string;
  thumbLabel: string;
  categoryLabel: LocalizedString;
  client: LocalizedString;
  title: LocalizedString;
  tagline: LocalizedString;
  role: LocalizedString;
  roleSub: LocalizedString;
  tags: LocalizedStringArray;
  did: LocalizedStringArray;
  outcome: LocalizedOutcomes;
}

export interface UIStrings {
  issue: LocalizedString;
  location: LocalizedString;
  booking: LocalizedString;
  nameA: LocalizedString;
  nameB: LocalizedString;
  langKo: LocalizedString;
  langEn: LocalizedString;
  role: LocalizedString;
  heroMeta: LocalizedStringArray;
  sectionLabel: LocalizedString;
  sectionMeta: LocalizedString;
  autoLabel: LocalizedString;
  pausedLabel: LocalizedString;
  nudge: LocalizedString;
  nudgeReduced: LocalizedString;
  back: LocalizedString;
  visit: LocalizedString;
  prev: LocalizedString;
  next: LocalizedString;
  arrowL: LocalizedString;
  arrowR: LocalizedString;
  detailYear: LocalizedString;
  detailRole: LocalizedString;
  detailClient: LocalizedString;
  detailDid: LocalizedString;
  detailOutcome: LocalizedString;
  detailTags: LocalizedString;
  keyboardHint: LocalizedString;
  footerL: LocalizedString;
  footerC: LocalizedString;
  footerEmail: LocalizedString;
  footerGit: LocalizedString;
  toastLang: LocalizedString;
}

export interface PortfolioData {
  ui: UIStrings;
  projects: Project[];
}
