/* ============================================================
   LANDING TRANSLATIONS
   ------------------------------------------------------------
   Single source of truth for every visible string on the
   landing page. To add a language, copy the EN object, rename
   it, translate the values, and add it to LANDING_LOCALES.
   ============================================================ */

export interface LandingHeaderStrings {
  brand: string;
  signIn: string;
  joinFree: string;
  backToLogin: string;
  backToHome: string;
}

export interface LandingHeroStrings {
  badge: string;
  headlinePrefix: string;
  headlineSuffix: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  replacesWords: string[];
}

export interface LandingPillarStrings {
  sectionLabel: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
}

export interface LandingFooterStrings {
  builtBy: string;
  terms: string;
  privacy: string;
  about: string;
}

export interface LandingStrings {
  header: LandingHeaderStrings;
  hero: LandingHeroStrings;
  pillars: LandingPillarStrings;
  footer: LandingFooterStrings;
}

/* ---------------- ENGLISH ---------------- */
const EN: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Sign In',
    joinFree: 'Join Free',
    backToLogin: '← Back to Login',
    backToHome: '← Back to Home',
  },
  hero: {
    badge: 'Universally Synchronized Timetables',
    headlinePrefix: 'No more',
    headlineSuffix: 'schedule clutter.',
    subtitle:
      'Thesdel is a smart, real-time timetable organizer built specifically for university classes. Spot room shifts, track cancellations, and safeguard your attendance streaks instantly.',
    ctaPrimary: 'Create Student Account',
    ctaSecondary: 'Sign In to Class',
    replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
  },
  pillars: {
    sectionLabel: 'EXPLAINED IN 10 SECONDS',
    step1Title: 'Centralized Schedule',
    step1Body:
      'Representatives list active courses, dates, and hours. No more scouring messy pinned chat history for PDFs.',
    step2Title: 'Instant Venue Alerts',
    step2Body:
      'Class relocated or cancelled? Receive dynamic live warnings before the session starts, saving wasted campus trips.',
    step3Title: 'Streak Safe-Guards',
    step3Body:
      'Track daily logs & class counts. Safeguard attendance requirements automatically through mock verification.',
  },
  footer: {
    builtBy: 'Built by Litheral',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    about: 'About',
  },
};

/* ---------------- LOCALES REGISTRY ---------------- */

export const LANDING_LOCALES: Record<string, LandingStrings> = {
  en: EN,
};

export const DEFAULT_LANDING_LOCALE = 'en';

/** Resolve a locale safely, falling back to the default. */
export function getLandingStrings(
  locale: string | undefined
): LandingStrings {
  if (!locale) return LANDING_LOCALES[DEFAULT_LANDING_LOCALE];
  return (
    LANDING_LOCALES[locale] ??
    LANDING_LOCALES[DEFAULT_LANDING_LOCALE]
  );
}