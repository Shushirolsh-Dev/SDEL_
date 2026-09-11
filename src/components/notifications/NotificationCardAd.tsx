import React from 'react';
import { Megaphone, ChevronRight } from 'lucide-react';
import type { NotificationsCardStrings } from '../../i18n/types.app';

interface NotificationCardAdProps {
  strings: NotificationsCardStrings;
  adImageUrl?: string;
  adTitle?: string;
  adDescription?: string;
  adUrl?: string;
  adActionText?: string;
}

const NotificationCardAd: React.FC<NotificationCardAdProps> = ({
  strings,
  adImageUrl,
  adTitle,
  adDescription,
  adUrl,
  adActionText,
}) => {
  return (
    <div className="space-y-4">
      {adImageUrl && (
        <div className="overflow-hidden border border-amber-200 dark:border-amber-900/30">
          <img
            src={adImageUrl}
            alt="Campaign promotion"
            referrerPolicy="no-referrer"
            className="max-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>
      )}

      <div>
        {adTitle && (
          <h2 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
            {adTitle}
          </h2>
        )}

        {adDescription && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {adDescription}
          </p>
        )}
      </div>

      {adUrl && (
        <a
          href={adUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-zinc-950 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {adActionText || strings.adLearnMore}
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
};

export default NotificationCardAd;