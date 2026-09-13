import React, { useState } from 'react';
import {
  Check,
  Megaphone,
  Pencil,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';
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
  currentUserId: string;
  onEditBroadcast: (
    updateId: string,
    description: string
  ) => Promise<boolean>;
  onDeleteBroadcast: (
    updateId: string
  ) => Promise<boolean>;
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
  currentUserId,
  onEditBroadcast,
  onDeleteBroadcast,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isWithinEditWindow = (timestamp: string) => {
    const createdAt = new Date(timestamp).getTime();
    const elapsed = Date.now() - createdAt;

    return elapsed >= 0 && elapsed <= 15 * 60 * 1000;
  };

  const startEditing = (update: ClassUpdate) => {
    const cleanDescription = update.description.replace(
      /^\[Edited\]\s*/i,
      ''
    );

    setEditingId(update.id);
    setEditText(cleanDescription);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (updateId: string) => {
    const cleanText = editText.trim();

    if (!cleanText) return;

    const success = await onEditBroadcast(
      updateId,
      cleanText
    );

    if (success) {
      cancelEditing();
    }
  };

  const handleDelete = (updateId: string) => {
    setDeleteId(updateId);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!deleteId || isDeleting) return;

    setIsDeleting(true);

    try {
      const success = await onDeleteBroadcast(deleteId);

      if (success) {
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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

              const isBroadcast =
                update.type === 'broadcast';

              const isOwner =
                update.userId === currentUserId;

              const canEdit =
                isBroadcast &&
                isOwner &&
                isWithinEditWindow(update.timestamp);

              const isEditing =
                editingId === update.id;

              const isEdited =
                isBroadcast &&
                /^\[Edited\]\s*/i.test(
                  update.description
                );

              const displayDescription = isEdited
                ? update.description.replace(
                    /^\[Edited\]\s*/i,
                    ''
                  )
                : update.description;

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

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-400">
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(
                          new Date(update.timestamp)
                        )}
                      </span>

                      {isBroadcast && isOwner && (
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(update)
                              }
                              className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
                              aria-label={
                                strings.editBroadcast
                              }
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(update.id)
                            }
                            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            aria-label={
                              strings.deleteBroadcast
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <textarea
                        value={editText}
                        onChange={(event) =>
                          setEditText(event.target.value)
                        }
                        rows={3}
                        autoFocus
                        className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm leading-6 text-zinc-800 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-200 dark:focus:border-white"
                      />

                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                          <X className="h-3.5 w-3.5" />
                          {strings.cancel}
                        </button>

                        <button
                          type="button"
                          disabled={!editText.trim()}
                          onClick={() =>
                            saveEdit(update.id)
                          }
                          className="rounded-md bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-zinc-950"
                        >
                          {strings.save}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {poll?.question ||
                          parsed?.message ||
                          displayDescription}
                      </p>

                      {isEdited && (
                        <span className="mt-1 block text-[10px] text-zinc-400">
                          {strings.edited}
                        </span>
                      )}
                    </>
                  )}

                  {poll && (
                    <div className="mt-4 space-y-2">
                      {poll.options?.map(
                        (option: string) => (
                          <button
                            key={option}
                            type="button"
                            disabled={!!vote}
                            onClick={() =>
                              onRegisterPollVote(
                                update.id,
                                option
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${
                              vote?.votedChoice === option
                                ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                                : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                            }`}
                          >
                            <span>{option}</span>

                            {vote?.votedChoice ===
                              option && (
                              <Check className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {!poll && !isEditing && (
                    <button
                      type="button"
                      disabled={
                        userVotes[update.id]?.hasVoted
                      }
                      onClick={() =>
                        onRegisterVote(update.id)
                      }
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

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelDelete();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-broadcast-title"
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
              </div>

              <div>
                <h3
                  id="delete-broadcast-title"
                  className="text-sm font-bold text-zinc-950 dark:text-white"
                >
                  {strings.deleteBroadcastTitle}
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {strings.deleteBroadcastMessage}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-900"
              >
                {strings.cancel}
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? strings.delete
                  : strings.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeUpdates;