import React from 'react';
import { Check, Send } from 'lucide-react';
import type { NotificationsCardStrings } from '../../i18n/types.app';

interface PollVote {
  votedChoice: string;
  textResponse?: string;
  submittedAt?: number;
}

interface NotificationCardPollProps {
  strings: NotificationsCardStrings;
  updateId: string;
  parsedData: any;
  vote: PollVote | undefined;
  selectedChoice: string | undefined;
  textInput: string;
  toast: string | undefined;
  onSelect: (choice: string) => void;
  onChangeText: (text: string) => void;
  onSubmit: (
    choice: string,
    textResponse?: string
  ) => void;
}

const NotificationCardPoll: React.FC<NotificationCardPollProps> = ({
  strings,
  updateId,
  parsedData,
  vote,
  selectedChoice,
  textInput,
  toast,
  onSelect,
  onChangeText,
  onSubmit,
}) => {
  if (!parsedData) return null;

  return (
    <div className="space-y-4">
      <div className="border-l-2 border-zinc-900 pl-4 dark:border-white">
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          {strings.pollSectionLabel}
        </p>

        <h2 className="mt-1 text-base font-semibold leading-snug tracking-tight text-zinc-950 dark:text-white">
          {parsedData.question}
        </h2>
      </div>

      {vote ? (
        <div className="border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/10">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-600 text-white">
              <Check className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {strings.pollResponseRegistered}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                {strings.pollResponseRecorded}
              </p>

              {vote.votedChoice && (
                <div className="mt-2 inline-flex border border-emerald-200 bg-white px-2 py-1 dark:border-emerald-900/40 dark:bg-zinc-950">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    {strings.pollSelected}
                  </span>

                  <span className="ml-1.5 text-[9px] font-bold text-zinc-900 dark:text-white">
                    {vote.votedChoice}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {parsedData.pollType === 'word' ? (
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    {strings.pollYourResponse}
                  </span>

                  <span className="text-[9px] font-medium text-zinc-400">
                    {strings.pollLineCounter(
                      (textInput.match(/\n/g) || []).length + 1,
                      5
                    )}
                  </span>
                </div>

                <textarea
                  placeholder={strings.pollTextareaPlaceholder}
                  rows={4}
                  value={textInput}
                  onChange={(e) => {
                    const text = e.target.value;
                    const lines = text.split('\n');

                    if (lines.length <= 5) {
                      onChangeText(text);
                    }
                  }}
                  className="w-full resize-none border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
                />
              </div>

              <button
                onClick={() => {
                  const value = textInput.trim();
                  if (value) {
                    onSubmit(updateId, value, value);
                  }
                }}
                disabled={!textInput.trim()}
                className="inline-flex items-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Send className="h-3.5 w-3.5" />
                {strings.pollSubmitResponse}
              </button>
            </div>
          ) : (
            (() => {
              const choices: string[] =
                parsedData.choices && parsedData.choices.length > 0
                  ? parsedData.choices
                  : parsedData.pollType === 'single'
                  ? [strings.pollDefaultYes, strings.pollDefaultNo]
                  : [];

              return (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {choices.map((choice) => {
                      const isSelected = selectedChoice === choice;

                      return (
                        <button
                          key={choice}
                          onClick={() => onSelect(choice)}
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
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {toast && (
                    <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />

                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {toast}
                      </span>
                    </div>
                  )}

                  {selectedChoice && !toast && (
                    <button
                      onClick={() => onSubmit(updateId, selectedChoice)}
                      className="inline-flex items-center gap-2 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {strings.pollSubmitAnswer}
                    </button>
                  )}
                </div>
              );
            })()
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCardPoll;