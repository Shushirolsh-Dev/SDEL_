import { AVAILABLE_LOCALES } from './discover';

export function detectLocale(): string {
  const supported = AVAILABLE_LOCALES.map((l) => l.code);

  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('thesdel_locale');
    if (saved && supported.includes(saved)) return saved;
  }

  if (typeof navigator !== 'undefined') {
    const langs =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];

    for (const lang of langs) {
      const base = lang.toLowerCase().split('-')[0];
      if (supported.includes(base)) return base;
    }
  }

  return 'en';
}