import React, { useState } from 'react';
import { Megaphone, Send, Check } from 'lucide-react';
import type { NotificationsRepStrings } from '../../i18n/types.app';

interface ClassRepBroadcastProps {
  strings: NotificationsRepStrings;
  activeClassId: string;
  onSubmit: (
    classId: string,
    description: string
  ) => Promise<boolean>;
}

const MAX_LENGTH = 250;

const ClassRepBroadcast: React.FC<ClassRepBroadcastProps> = ({
  strings,
  activeClassId,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const ok = await onSubmit(activeClassId, message.trim());

      if (ok) {
        setMessage('');
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              {strings.title}
            </h2>

            <p className="text-[9px] text-zinc-400">
              {strings.subtitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={strings.textareaPlaceholder}
          maxLength={MAX_LENGTH}
          rows={3}
          required
          className="w-full resize-none border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium text-zinc-400">
              {strings.counterLabel(message.length, MAX_LENGTH)}
            </span>

            <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />

            <span className="text-[9px] text-zinc-400">
              {strings.visibleToMembers}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Send className="h-3.5 w-3.5" />

            {isSubmitting
              ? strings.postingButton
              : strings.postButton}
          </button>
        </div>

        {success && (
          <div className="mt-3 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/10">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {strings.successMessage}
            </span>
          </div>
        )}
      </form>
    </section>
  );
};

export default ClassRepBroadcast;