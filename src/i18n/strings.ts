import type { AppStrings } from './types';
import EN from './locales/en';

export type {
  AppStrings,
  HeaderStrings,
  NavStrings,
  ToastStrings,
  ConfirmStrings,
  BroadcastStrings,
} from './types';

export const APP_LOCALES: Record<string, AppStrings> = {
  en: EN,
};

export const DEFAULT_APP_LOCALE = 'en';

export function getAppStrings(
  locale: string | undefined
): AppStrings {
  if (!locale) return APP_LOCALES[DEFAULT_APP_LOCALE];
  return (
    APP_LOCALES[locale] ?? APP_LOCALES[DEFAULT_APP_LOCALE]
  );
}