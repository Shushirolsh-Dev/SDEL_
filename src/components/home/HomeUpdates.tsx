import React from 'react';
import { Check, Megaphone, ThumbsUp } from 'lucide-react';
import { ClassUpdate } from '../../types';
import type { HomeUpdatesStrings } from '../../i18n/types.app';

interface HomeUpdatesProps {
  strings: HomeUpdatesStrings;
  updates: ClassUpdate[];
  visibleUpdates: ClassUpdate[];
  isAnnouncementOpen: boolean;
  hasUnread: boolean;
  canExpand: boolean;
  userVotes: Record<string, { votes: number; hasVoted: boolean }>;
  pollVotes: Record<
    string,
    {
      votedChoice: string;
      textResponse?: string;
      submittedAt?: number;
    }
  >;
  parseUpdate: (update: ClassUpdate) => any;
  getUpdateLabel: (
    update: ClassUpdate
  ) => { text: string; className: string };
  onToggleAnnouncements: () => void;
  onRegisterPollVote: (pollId: string, choice: string) => void;
  onRegisterVote: (updateId: string) => void;
}

const HomeUpdates: React.FC<HomeUpdatesProps> = ({
  strings,
  updates,
  visibleUpdates,
  isAnnouncementOpen,
  hasUnread,
  canExpand,
  userVotes,
  pollVotes,
  parseUpdate,
  getUpdateLabel,
  onToggleAnnouncements,
  onRegisterPollVote,
  onRegisterVote,
}) => {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-zinc-500" />

          <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
            {strings.sectionTitle}
          </h2>

          {hasUnread && (
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          )}
        </div>

        {canExpand && (
          <button
            type="button"
            onClick={onToggleAnnouncements}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            {isAnnouncementOpen
              ? strings.showLess
              : strings.viewAll}
          </button>
        )}
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {visibleUpdates.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {strings.noUpdates}
            </p>
          </div>
        ) : (
          visibleUpdates.map((update) => {
            const parsed = parseUpdate(update);
            const label = getUpdateLabel(update);

            const poll = parsed?.isPoll ? parsed : null;
            const vote = pollVotes[update.id];

            return (
              <div
                key={update.id}
                className="px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-bold tracking-wide ${label.className}`}
                  >
                    {label.text}
                  </span>

                  <span className="text-[10px] text-zinc-400">
                    {new Date(update.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {poll?.question ||
                    parsed?.message ||
                    update.description}
                </p>

                {poll && (
                  <div className="mt-4 space-y-2">
                    {poll.options?.map((option: string) => (
                      <button
                        key={option}
                        type="button"
                        disabled={!!vote}
                        onClick={() =>
                          onRegisterPollVote(update.id, option)
                        }
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${
                          vote?.votedChoice === option
                            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                        }`}
                      >
                        <span>{option}</span>

                        {vote?.votedChoice === option && (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {!poll && (
                  <button
                    type="button"
                    disabled={userVotes[update.id]?.hasVoted}
                    onClick={() => onRegisterVote(update.id)}
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950 disabled:cursor-default disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />

                    {userVotes[update.id]?.hasVoted
                      ? strings.reacted
                      : strings.acknowledge}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default HomeUpdates;