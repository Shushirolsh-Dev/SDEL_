import type { AppStrings } from './types.app';
import type { LandingStrings } from './types.landing';

import {
  APP_LOCALES,
  LANDING_LOCALES,
  AVAILABLE_LOCALES,
  DEFAULT_APP_LOCALE,
  DEFAULT_LANDING_LOCALE,
} from './discover';

export type {
  AppStrings,
  HeaderStrings,
  NavStrings,
  ToastStrings,
  ConfirmStrings,
  BroadcastStrings,
  ProfileStrings,
  NotificationsStrings,
  NotificationsHeaderStrings,
  NotificationsEmptyStrings,
  NotificationsCardStrings,
  NotificationsRepStrings,
  HomeStrings,
  HomeHeaderStrings,
  HomeNextClassStrings,
  HomeScheduleStrings,
  HomeAttendanceStrings,
  HomeUpdatesStrings,
  HomeRepStrings,
  HomeAdStrings,
  TimetableStrings,
  TimetableHeaderStrings,
  TimetablePermissionStrings,
  TimetableEmptyStrings,
  TimetableDayStrings,
  TimetableEntryCardStrings,
  TimetableFormStrings,
  TimetableDeleteStrings,
  AttendanceStrings,
  AttendanceHeaderStrings,
  AttendanceSummaryStrings,
  AttendanceStreakStrings,
  AttendanceWeekStrings,
  AttendanceStatusStrings,
  AttendanceEmptyStrings,
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

export type { LocaleMeta } from './discover';

export {
  APP_LOCALES,
  LANDING_LOCALES,
  AVAILABLE_LOCALES,
  DEFAULT_APP_LOCALE,
  DEFAULT_LANDING_LOCALE,
};

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