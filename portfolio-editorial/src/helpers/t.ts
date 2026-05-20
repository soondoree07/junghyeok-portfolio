import type { Lang, Localized } from '../types';

function isLocalized<T>(value: unknown): value is Localized<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('ko' in (value as object) || 'en' in (value as object))
  );
}

export function t<T>(field: Localized<T> | T, lang: Lang): T {
  if (isLocalized<T>(field)) {
    return field[lang === 'kor' ? 'ko' : 'en'];
  }
  return field as T;
}
