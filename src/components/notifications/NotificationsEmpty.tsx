import React from 'react';
import { Bell } from 'lucide-react';
import type { NotificationsEmptyStrings } from '../../i18n/types.app';

interface NotificationsEmptyProps {
  strings: NotificationsEmptyStrings;
}

const NotificationsEmpty: React.FC<NotificationsEmptyProps> = ({
  strings,
}) => {
  return (
    <div
      id="notifications-empty"
      className="border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <Bell className="h-5 w-5 text-zinc-400" />
      </div>

      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {strings.title}
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">
        {strings.subtitle}
      </p>
    </div>
  );
};

export default NotificationsEmpty;