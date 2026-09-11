import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { HomeRepStrings } from '../../i18n/types.app';

interface HomeRepBroadcastProps {
  strings: HomeRepStrings;
  activeClassId: string;
  onSubmit: (
    classId: string,
    description: string
  ) => Promise<boolean>;
}

const HomeRepBroadcast: React.FC<HomeRepBroadcastProps> = ({
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
    } catch (error) {
      console.error('Failed to send class broadcast:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <Send className="h-4 w-4 text-zinc-500" />

        <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
          {strings.title}
        </h2>
      </div>

      <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {strings.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={strings.textareaPlaceholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
        />

        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Send className="h-3.5 w-3.5" />

          {isSubmitting
            ? strings.sending
            : strings.broadcast}
        </button>
      </form>

      {success && (
        <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {strings.successMessage}
        </p>
      )}
    </section>
  );
};

export default HomeRepBroadcast;