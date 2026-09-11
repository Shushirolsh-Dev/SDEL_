import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { HomeAdStrings } from '../../i18n/types.app';

interface HomeAdCardProps {
  strings: HomeAdStrings;
  imageUrl?: string;
  title?: string;
  description?: string;
  onClick: () => void;
}

const HomeAdCard: React.FC<HomeAdCardProps> = ({
  strings,
  imageUrl,
  title,
  description,
  onClick,
}) => {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      onClick={onClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title || strings.altFallback}
          className="h-36 w-full object-cover"
        />
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            {strings.sponsoredLabel}
          </span>

          <ArrowUpRight className="h-4 w-4 text-zinc-400" />
        </div>

        {title && (
          <h3 className="mt-3 text-sm font-bold text-zinc-950 dark:text-white">
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default HomeAdCard;