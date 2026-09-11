import React, { useState, useEffect } from 'react';
import { ClassUpdate } from '../types';
import type { NotificationsStrings } from '../i18n/types.app';
import NotificationsHeader from './notifications/NotificationsHeader';
import NotificationsEmpty from './notifications/NotificationsEmpty';
import NotificationCard from './notifications/NotificationCard';
import ClassRepBroadcast from './notifications/ClassRepBroadcast';

interface NotificationsViewProps {
  updates: ClassUpdate[];
  strings: NotificationsStrings;
  onForceRefresh?: () => Promise<void>;
  onClose: () => void;
  userRole: string;
  activeClassId?: string;
  onAddBroadcast?: (
    classId: string,
    description: string
  ) => Promise<boolean>;
}

export default function NotificationsView({
  updates,
  strings,
  onForceRefresh,
  onClose,
  userRole,
  activeClassId,
  onAddBroadcast,
}: NotificationsViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userVotes, setUserVotes] = useState<
    Record<string, { votes: number; hasVoted: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem(
        'thesdel_bulletin_votes'
      );
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

  const [selectedPollChoices, setSelectedPollChoices] =
    useState<Record<string, string>>({});

  const [pollToasts, setPollToasts] = useState<
    Record<string, string>
  >({});

  const [pollTextInput, setPollTextInput] = useState<
    Record<string, string>
  >({});

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
    localStorage.setItem(
      'thesdel_poll_votes',
      JSON.stringify(updated)
    );

    setPollToasts((prev) => ({
      ...prev,
      [pollId]: strings.card.pollResponseRegistered,
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
      votes: Math.floor(
        Math.abs(updateId.charCodeAt(0) % 15) + 3
      ),
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

  const canBroadcast =
    userRole === 'representative' &&
    !!onAddBroadcast &&
    !!activeClassId;

  return (
    <div
      id="notifications-standalone-view"
      className="min-h-full bg-zinc-50 dark:bg-black"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <NotificationsHeader
          strings={strings.header}
          isRefreshing={isRefreshing}
          onBack={onClose}
          onRefresh={onForceRefresh ? handleRefresh : undefined}
        />

        <main id="notifications-main-card">
          {bulletinUpdates.length === 0 ? (
            <NotificationsEmpty strings={strings.empty} />
          ) : (
            <div
              id="notifications-list-wrapper"
              className="space-y-3"
            >
              {bulletinUpdates.map((up) => (
                <NotificationCard
                  key={up.id}
                  strings={strings.card}
                  update={up}
                  userVote={userVotes[up.id]}
                  pollVote={pollVotes[up.id]}
                  selectedChoice={selectedPollChoices[up.id]}
                  pollTextInput={pollTextInput[up.id] || ''}
                  pollToast={pollToasts[up.id]}
                  onSelectPollChoice={(choice) =>
                    setSelectedPollChoices({
                      ...selectedPollChoices,
                      [up.id]: choice,
                    })
                  }
                  onChangePollText={(text) =>
                    setPollTextInput({
                      ...pollTextInput,
                      [up.id]: text,
                    })
                  }
                  onSubmitPoll={handleRegisterPollVote}
                  onAgree={() => handleRegisterVote(up.id)}
                />
              ))}
            </div>
          )}

          {canBroadcast && (
            <ClassRepBroadcast
              strings={strings.rep}
              activeClassId={activeClassId!}
              onSubmit={onAddBroadcast!}
            />
          )}
        </main>
      </div>
    </div>
  );
}