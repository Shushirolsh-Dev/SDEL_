import React from 'react';
import {
  Check,
  AlertCircle,
  MapPin,
  Megaphone,
  ThumbsUp,
} from 'lucide-react';
import { ClassUpdate } from '../../types';
import type { NotificationsCardStrings } from '../../i18n/types.app';
import NotificationCardAd from './NotificationCardAd';
import NotificationCardPoll from './NotificationCardPoll';

interface PollVote {
  votedChoice: string;
  textResponse?: string;
  submittedAt?: number;
}

interface NotificationCardProps {
  strings: NotificationsCardStrings;
  update: ClassUpdate;
  userVote: { votes: number; hasVoted: boolean } | undefined;
  pollVote: PollVote | undefined;
  selectedChoice: string | undefined;
  pollTextInput: string;
  pollToast: string | undefined;
  onSelectPollChoice: (choice: string) => void;
  onChangePollText: (text: string) => void;
  onSubmitPoll: (
    pollId: string,
    choice: string,
    textResponse?: string
  ) => void;
  onAgree: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  strings,
  update,
  userVote,
  pollVote,
  selectedChoice,
  pollTextInput,
  pollToast,
  onSelectPollChoice,
  onChangePollText,
  onSubmitPoll,
  onAgree,
}) => {
  let isAd = false;
  let isPoll = false;
  let parsedData: any = null;

  if (
    update.description.startsWith('{') &&
    update.description.endsWith('}')
  ) {
    try {
      parsedData = JSON.parse(update.description);
      if (parsedData.isAd) isAd = true;
      if (parsedData.isPoll) isPoll = true;
    } catch {}
  }

  const getPillsForUpdate = (): string[] => {
    if (update.type === 'cancellation') {
      return [strings.labelCancelled, strings.labelUrgent];
    }

    if (update.type === 'venue_change') {
      return [strings.labelVenueChanged, strings.labelUrgent];
    }

    return [strings.labelInfo];
  };

  const pills = isAd
    ? [strings.labelSponsored, strings.labelAdSpace]
    : isPoll
    ? []
    : getPillsForUpdate();

  const hasVoted = userVote?.hasVoted ?? false;

  const voteCount =
    userVote?.votes ??
    Math.floor(Math.abs(update.id.charCodeAt(0) % 15) + 3);

  const isClassRepAnnouncement =
    !!update.userId &&
    (update.userId.startsWith('user_rep') ||
      update.userId.includes('rep') ||
      update.userId.includes('asst') ||
      update.userName.toLowerCase().includes('rep') ||
      update.userName.toLowerCase().includes('asst'));

  const renderIcon = () => {
    if (update.type === 'cancellation') {
      return <AlertCircle className="h-4 w-4" />;
    }

    if (update.type === 'venue_change') {
      return <MapPin className="h-4 w-4" />;
    }

    return <Megaphone className="h-4 w-4" />;
  };

  return (
    <article
      id={`notification-item-${update.id}`}
      className={`group overflow-hidden border bg-white transition-all dark:bg-zinc-950 ${
        isAd
          ? 'border-amber-200 dark:border-amber-900/40'
          : isPoll
          ? 'border-zinc-300 dark:border-zinc-700'
          : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <div
        className={`h-0.5 w-full ${
          isAd
            ? 'bg-amber-500'
            : isPoll
            ? 'bg-zinc-900 dark:bg-white'
            : update.type === 'cancellation'
            ? 'bg-rose-500'
            : update.type === 'venue_change'
            ? 'bg-zinc-500'
            : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      />

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                isAd
                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400'
                  : isPoll
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
              }`}
            >
              {isAd ? (
                <Megaphone className="h-3.5 w-3.5" />
              ) : (
                renderIcon()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {pills.map((pill) => (
                  <span
                    key={pill}
                    className={`border px-1.5 py-0.5 text-[8px] font-bold tracking-wider ${
                      pill === strings.labelUrgent
                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400'
                        : pill === strings.labelAdSpace ||
                          pill === strings.labelSponsored
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                    }`}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {isAd && (
                <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {strings.sponsoredSpotlight}
                </p>
              )}
            </div>
          </div>

          <time className="shrink-0 text-[9px] font-medium text-zinc-400">
            {new Date(update.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </div>

        {isAd && parsedData && (
          <NotificationCardAd
            strings={strings}
            adImageUrl={parsedData.adImageUrl}
            adTitle={parsedData.adTitle}
            adDescription={parsedData.description}
            adUrl={parsedData.adUrl}
            adActionText={parsedData.adActionText}
          />
        )}

        {isPoll && parsedData && (
          <NotificationCardPoll
            strings={strings}
            updateId={update.id}
            parsedData={parsedData}
            vote={pollVote}
            selectedChoice={selectedChoice}
            textInput={pollTextInput}
            toast={pollToast}
            onSelect={onSelectPollChoice}
            onChangeText={onChangePollText}
            onSubmit={onSubmitPoll}
          />
        )}

        {!isAd && !isPoll && (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
              {update.description}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-900">
          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
            {isPoll ? (
              strings.teamLabel
            ) : (
              <>
                {strings.byLabel}{' '}
                <span className="font-bold text-zinc-600 dark:text-zinc-300">
                  {update.userName}
                </span>
              </>
            )}
          </span>

          {!isAd && !isPoll && !isClassRepAnnouncement && (
            <button
              onClick={onAgree}
              disabled={hasVoted}
              className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all ${
                hasVoted
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-400'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white'
              }`}
            >
              <ThumbsUp
                className={`h-3 w-3 ${hasVoted ? 'fill-current' : ''}`}
              />

              <span>
                {hasVoted
                  ? strings.agreedButton(voteCount)
                  : strings.agreeButton(voteCount)}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;