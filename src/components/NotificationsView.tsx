import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertCircle,
  MapPin,
  ChevronRight,
  Bell,
  Megaphone,
  ThumbsUp,
  Send,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { ClassUpdate } from '../types';

interface NotificationsViewProps {
  updates: ClassUpdate[];
  onForceRefresh?: () => Promise<void>;
  onClose: () => void;
  userRole: string;
  activeClassId?: string;
  onAddBroadcast?: (classId: string, description: string) => Promise<boolean>;
}

export default function NotificationsView({
  updates,
  onForceRefresh,
  onClose,
  userRole,
  activeClassId,
  onAddBroadcast,
}: NotificationsViewProps) {
  const [classRepMsg, setClassRepMsg] = useState('');
  const [isSubmittingRepMsg, setIsSubmittingRepMsg] = useState(false);
  const [repSuccess, setRepSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userVotes, setUserVotes] = useState<
    Record<string, { votes: number; hasVoted: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem('thesdel_bulletin_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [pollVotes, setPollVotes] = useState<
    Record<
      string,
      {
        votedChoice: string;
        textResponse?: string;
        submittedAt?: number;
      }
    >
  >(() => {
    try {
      const stored = localStorage.getItem('thesdel_poll_votes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [selectedPollChoices, setSelectedPollChoices] = useState<
    Record<string, string>
  >({});

  const [pollToasts, setPollToasts] = useState<Record<string, string>>({});
  const [pollTextInput, setPollTextInput] = useState<Record<string, string>>(
    {}
  );

  const handleRegisterPollVote = (
    pollId: string,
    choice: string,
    textResponse?: string
  ) => {
    const updated = {
      ...pollVotes,
      [pollId]: {
        votedChoice: choice,
        textResponse,
        submittedAt: Date.now(),
      },
    };

    setPollVotes(updated);
    localStorage.setItem('thesdel_poll_votes', JSON.stringify(updated));

    setPollToasts((prev) => ({
      ...prev,
      [pollId]: 'Response registered',
    }));

    setTimeout(() => {
      setPollToasts((prev) => {
        const copy = { ...prev };
        delete copy[pollId];
        return copy;
      });
    }, 4000);
  };

  const handleRegisterVote = (updateId: string) => {
    const current = userVotes[updateId] || {
      votes: Math.floor(Math.abs(updateId.charCodeAt(0) % 15) + 3),
      hasVoted: false,
    };

    if (current.hasVoted) return;

    const updated = {
      ...userVotes,
      [updateId]: {
        votes: current.votes + 1,
        hasVoted: true,
      },
    };

    setUserVotes(updated);

    localStorage.setItem(
      'thesdel_bulletin_votes',
      JSON.stringify(updated)
    );
  };

  const handleClassRepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classRepMsg.trim() || !onAddBroadcast || !activeClassId) return;

    setIsSubmittingRepMsg(true);

    try {
      const ok = await onAddBroadcast(
        activeClassId,
        classRepMsg.trim()
      );

      if (ok) {
        setClassRepMsg('');
        setRepSuccess(true);

        setTimeout(() => {
          setRepSuccess(false);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingRepMsg(false);
    }
  };

  const handleRefresh = async () => {
    if (!onForceRefresh || isRefreshing) return;

    setIsRefreshing(true);

    try {
      await onForceRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const bulletinUpdates = updates.filter((up) => {
    if (
      up.description.startsWith('{') &&
      up.description.endsWith('}')
    ) {
      try {
        const parsed = JSON.parse(up.description);

        if (parsed.isAd) return true;

        if (parsed.isPoll) {
          const userVoteRecord = pollVotes[up.id];

          if (userVoteRecord?.submittedAt) {
            const elapsed =
              Date.now() - userVoteRecord.submittedAt;

            if (elapsed >= 24 * 60 * 60 * 1000) {
              return false;
            }
          }

          return true;
        }
      } catch {}
    }

    if (
      up.type === 'entry_added' ||
      up.type === 'entry_edited' ||
      up.type === 'entry_deleted'
    ) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    if (bulletinUpdates.length > 0) {
      localStorage.setItem(
        'thesdel_last_read_update_id',
        bulletinUpdates[0].id
      );
    }
  }, [updates, pollVotes]);

  const getPillsForUpdate = (update: ClassUpdate): string[] => {
    if (update.type === 'cancellation') {
      return ['CANCELLED', 'URGENT'];
    }

    if (update.type === 'venue_change') {
      return ['VENUE CHANGED', 'URGENT'];
    }

    return ['INFO'];
  };

  const getUpdateIcon = (update: ClassUpdate) => {
    if (update.type === 'cancellation') {
      return <AlertCircle className="h-4 w-4" />;
    }

    if (update.type === 'venue_change') {
      return <MapPin className="h-4 w-4" />;
    }

    return <Megaphone className="h-4 w-4" />;
  };

  return (
    <div
      id="notifications-standalone-view"
      className="min-h-full bg-zinc-50 dark:bg-black"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <header
          id="notifications-header"
          className="mb-5 flex items-center justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onClose}
              title="Back"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Bell className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h1 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                  Notifications
                </h1>

                <p className="text-[11px] text-zinc-500">
                  Class announcements and updates
                </p>
              </div>
            </div>
          </div>

          {onForceRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh notifications"
              className="flex h-9 items-center gap-2 border border-zinc-200 bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />

              <span className="hidden sm:inline">
                {isRefreshing ? 'Refreshing' : 'Refresh'}
              </span>
            </button>
          )}
        </header>

        {/* Main */}
        <main id="notifications-main-card">
          {bulletinUpdates.length === 0 ? (
            <div
              id="notifications-empty"
              className="border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <Bell className="h-5 w-5 text-zinc-400" />
              </div>

              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Nothing new
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">
                Official announcements and important class updates
                will appear here.
              </p>
            </div>
          ) : (
            <div
              id="notifications-list-wrapper"
              className="space-y-3"
            >
              {bulletinUpdates.map((up) => {
                let isAd = false;
                let isPoll = false;
                let parsedData: any = null;

                if (
                  up.description.startsWith('{') &&
                  up.description.endsWith('}')
                ) {
                  try {
                    parsedData = JSON.parse(up.description);

                    if (parsedData.isAd) isAd = true;
                    if (parsedData.isPoll) isPoll = true;
                  } catch {}
                }

                const pills = isAd
                  ? ['SPONSORED', 'AD SPACE']
                  : isPoll
                  ? []
                  : getPillsForUpdate(up);

                const hasVoted =
                  userVotes[up.id]?.hasVoted ?? false;

                const voteCount =
                  userVotes[up.id]?.votes ??
                  Math.floor(
                    Math.abs(up.id.charCodeAt(0) % 15) + 3
                  );

                const isClassRepAnnouncement =
                  !!up.userId &&
                  (
                    up.userId.startsWith('user_rep') ||
                    up.userId.includes('rep') ||
                    up.userId.includes('asst') ||
                    up.userName.toLowerCase().includes('rep') ||
                    up.userName.toLowerCase().includes('asst')
                  );

                return (
                  <article
                    key={up.id}
                    id={`notification-item-${up.id}`}
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
                          : up.type === 'cancellation'
                          ? 'bg-rose-500'
                          : up.type === 'venue_change'
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
                              getUpdateIcon(up)
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {pills.map((pill) => (
                                <span
                                  key={pill}
                                  className={`border px-1.5 py-0.5 text-[8px] font-bold tracking-wider ${
                                    pill === 'URGENT'
                                      ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400'
                                      : pill === 'AD SPACE' ||
                                        pill === 'SPONSORED'
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
                                Sponsored spotlight
                              </p>
                            )}
                          </div>
                        </div>

                        <time className="shrink-0 text-[9px] font-medium text-zinc-400">
                          {new Date(up.timestamp).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </time>
                      </div>
                      {isAd && parsedData && (
                        <div className="space-y-4">
                          {parsedData.adImageUrl && (
                            <div className="overflow-hidden border border-amber-200 dark:border-amber-900/30">
                              <img
                                src={parsedData.adImageUrl}
                                alt="Campaign promotion"
                                referrerPolicy="no-referrer"
                                className="max-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                              />
                            </div>
                          )}

                          <div>
                            <h2 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                              {parsedData.adTitle}
                            </h2>

                            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                              {parsedData.description}
                            </p>
                          </div>

                          {parsedData.adUrl && (
                            <a
                              href={parsedData.adUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-zinc-950 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                            >
                              {parsedData.adActionText || 'Learn More'}

                              <ChevronRight className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      )}

                      {isPoll && parsedData && (
                        <div className="space-y-4">
                          <div className="border-l-2 border-zinc-900 pl-4 dark:border-white">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                              Class poll
                            </p>

                            <h2 className="mt-1 text-base font-semibold leading-snug tracking-tight text-zinc-950 dark:text-white">
                              {parsedData.question}
                            </h2>
                          </div>

                          {(() => {
                            const choices: string[] =
                              parsedData.choices &&
                              parsedData.choices.length > 0
                                ? parsedData.choices
                                : parsedData.pollType === 'single'
                                ? ['Yes', 'No']
                                : [];

                            const userVoteRecord = pollVotes[up.id];

                            if (userVoteRecord) {
                              return (
                                <div className="border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-600 text-white">
                                      <Check className="h-4 w-4" />
                                    </div>

                                    <div>
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                        Response registered
                                      </p>

                                      <p className="mt-1 text-xs leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                                        Your response has been recorded.
                                      </p>

                                      {userVoteRecord.votedChoice && (
                                        <div className="mt-2 inline-flex border border-emerald-200 bg-white px-2 py-1 dark:border-emerald-900/40 dark:bg-zinc-950">
                                          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                                            Selected:
                                          </span>

                                          <span className="ml-1.5 text-[9px] font-bold text-zinc-900 dark:text-white">
                                            {userVoteRecord.votedChoice}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (parsedData.pollType === 'word') {
                              const currentTextVal =
                                pollTextInput[up.id] || '';

                              const lineCount =
                                (currentTextVal.match(/\n/g) || []).length + 1;

                              return (
                                <div className="space-y-3">
                                  <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                        Your response
                                      </span>

                                      <span className="text-[9px] font-medium text-zinc-400">
                                        {lineCount}/5 lines
                                      </span>
                                    </div>

                                    <textarea
                                      placeholder="Write your response..."
                                      rows={4}
                                      value={currentTextVal}
                                      onChange={(e) => {
                                        const text = e.target.value;
                                        const lines = text.split('\n');

                                        if (lines.length <= 5) {
                                          setPollTextInput({
                                            ...pollTextInput,
                                            [up.id]: text,
                                          });
                                        }
                                      }}
                                      className="w-full resize-none border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
                                    />
                                  </div>

                                  <button
                                    onClick={() => {
                                      const value = currentTextVal.trim();

                                      if (value) {
                                        handleRegisterPollVote(
                                          up.id,
                                          value,
                                          value
                                        );
                                      }
                                    }}
                                    disabled={!currentTextVal.trim()}
                                    className="inline-flex items-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                    Submit response
                                  </button>
                                </div>
                              );
                            }

                            const currentSelected =
                              selectedPollChoices[up.id];

                            return (
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  {choices.map((choice) => {
                                    const isSelected =
                                      currentSelected === choice;

                                    return (
                                      <button
                                        key={choice}
                                        onClick={() =>
                                          setSelectedPollChoices({
                                            ...selectedPollChoices,
                                            [up.id]: choice,
                                          })
                                        }
                                        className={`group flex w-full items-center justify-between border p-3 text-left transition-all ${
                                          isSelected
                                            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-600'
                                        }`}
                                      >
                                        <span className="text-xs font-semibold">
                                          {choice}
                                        </span>

                                        <span
                                          className={`flex h-5 w-5 items-center justify-center border ${
                                            isSelected
                                              ? 'border-white/30 dark:border-zinc-900/20'
                                              : 'border-zinc-200 dark:border-zinc-700'
                                          }`}
                                        >
                                          {isSelected && (
                                            <Check className="h-3 w-3" />
                                          )}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {pollToasts[up.id] && (
                                  <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-400">
                                    <Check className="h-3.5 w-3.5" />

                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      {pollToasts[up.id]}
                                    </span>
                                  </div>
                                )}

                                {currentSelected &&
                                  !pollToasts[up.id] && (
                                    <button
                                      onClick={() =>
                                        handleRegisterPollVote(
                                          up.id,
                                          currentSelected
                                        )
                                      }
                                      className="inline-flex items-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      Submit answer
                                    </button>
                                  )}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {!isAd && !isPoll && (
                        <div className="space-y-2">
                          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                            {up.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-900">
                        <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                          {isPoll ? (
                            'THESDEL TEAM'
                          ) : (
                            <>
                              By{' '}
                              <span className="font-bold text-zinc-600 dark:text-zinc-300">
                                {up.userName}
                              </span>
                            </>
                          )}
                        </span>

                        {!isAd &&
                          !isPoll &&
                          !isClassRepAnnouncement && (
                            <button
                              onClick={() =>
                                handleRegisterVote(up.id)
                              }
                              disabled={hasVoted}
                              className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all ${
                                hasVoted
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-400'
                                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white'
                              }`}
                            >
                              <ThumbsUp
                                className={`h-3 w-3 ${
                                  hasVoted ? 'fill-current' : ''
                                }`}
                              />

                              <span>
                                {hasVoted
                                  ? `Agreed · ${voteCount}`
                                  : `Agree · ${voteCount}`}
                              </span>
                            </button>
                          )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {userRole === 'representative' &&
            onAddBroadcast &&
            activeClassId && (
              <section
                id="class-representative-console"
                className="mt-6 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-900">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <Megaphone className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                        Representative broadcast
                      </h2>

                      <p className="text-[9px] text-zinc-400">
                        Send an official update to your class
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleClassRepSubmit}
                  className="p-4"
                >
                  <textarea
                    value={classRepMsg}
                    onChange={(e) =>
                      setClassRepMsg(e.target.value)
                    }
                    placeholder="Share a study tip, reminder, schedule change, or important class notice..."
                    maxLength={250}
                    rows={3}
                    required
                    className="w-full resize-none border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
                  />

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-medium text-zinc-400">
                        {classRepMsg.length}/250
                      </span>

                      <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />

                      <span className="text-[9px] text-zinc-400">
                        Visible to class members
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isSubmittingRepMsg ||
                        !classRepMsg.trim()
                      }
                      className="inline-flex items-center justify-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <Send className="h-3.5 w-3.5" />

                      {isSubmittingRepMsg
                        ? 'Posting'
                        : 'Post broadcast'}
                    </button>
                  </div>

                  {repSuccess && (
                    <div className="mt-3 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Broadcast posted successfully
                      </span>
                    </div>
                  )}
                </form>
              </section>
            )}
        </main>
      </div>
    </div>
  );
}