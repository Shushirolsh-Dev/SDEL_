import type { AppStrings } from './types.app';
import type { LandingStrings } from './types.landing';

export interface LocaleMeta {
  code: string;
  nativeName: string;
}

interface AppModule {
  default: AppStrings;
  meta: LocaleMeta;
}

interface LandingModule {
  default: LandingStrings;
  meta: LocaleMeta;
}

const appModules = import.meta.glob<AppModule>(
  './locales/*.app.ts',
  { eager: true }
);

const landingModules = import.meta.glob<LandingModule>(
  './locales/*.landing.ts',
  { eager: true }
);

const appLocales: Record<string, AppStrings> = {};
const landingLocales: Record<string, LandingStrings> = {};
const discovered: LocaleMeta[] = [];

for (const path in appModules) {
  const mod = appModules[path];
  if (!mod?.meta?.code) continue;
  appLocales[mod.meta.code] = mod.default;
  if (!discovered.some((l) => l.code === mod.meta.code)) {
    discovered.push({
      code: mod.meta.code,
      nativeName: mod.meta.nativeName,
    });
  }
}

for (const path in landingModules) {
  const mod = landingModules[path];
  if (!mod?.meta?.code) continue;
  landingLocales[mod.meta.code] = mod.default;
}

export const APP_LOCALES: Record<string, AppStrings> =
  appLocales;

export const LANDING_LOCALES: Record<
  string,
  LandingStrings
> = landingLocales;

export const AVAILABLE_LOCALES: LocaleMeta[] = discovered;

export const DEFAULT_APP_LOCALE = 'en';
export const DEFAULT_LANDING_LOCALE = 'en';