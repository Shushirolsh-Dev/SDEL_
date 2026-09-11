import type { AppStrings } from './types.app';
import type { LandingStrings } from './types.landing';

import EN_APP from './locales/en.app';
import EN_LANDING from './locales/en.landing';

export type {
  AppStrings,
  HeaderStrings,
  NavStrings,
  ToastStrings,
  ConfirmStrings,
  BroadcastStrings,
} from './types.app';

export type {
  LandingStrings,
  LandingHeaderStrings,
  LandingHeroStrings,
  LandingFeatureGridStrings,
  LandingFooterStrings,
  LoginStrings,
  ForgotStrings,
  SignUpStrings,
  LegalSectionItem,
  LegalScreenStrings,
  LegalStrings,
} from './types.landing';

export const APP_LOCALES: Record<string, AppStrings> = {
  en: EN_APP,
};

export const LANDING_LOCALES: Record<string, LandingStrings> = {
  en: EN_LANDING,
};

export const DEFAULT_APP_LOCALE = 'en';
export const DEFAULT_LANDING_LOCALE = 'en';

export function getAppStrings(
  locale: string | undefined
): AppStrings {
  if (!locale) return APP_LOCALES[DEFAULT_APP_LOCALE];
  return (
    APP_LOCALES[locale] ?? APP_LOCALES[DEFAULT_APP_LOCALE]
  );
}

export function getLandingStrings(
  locale: string | undefined
): LandingStrings {
  if (!locale) return LANDING_LOCALES[DEFAULT_LANDING_LOCALE];
  return (
    LANDING_LOCALES[locale] ??
    LANDING_LOCALES[DEFAULT_LANDING_LOCALE]
  );
}