import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Clock, MapPin, ChevronRight, Bell, Megaphone, ThumbsUp, Send, ArrowLeft } from 'lucide-react';
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

  // Upvotes for ordinary announcements
  const [userVotes, setUserVotes] = useState<Record<string, { votes: number; hasVoted: boolean }>>(() => {
    const saved = localStorage.getItem('thesdel_bulletin_votes');
    return saved ? JSON.parse(saved) : {};
  });

  // Submitted votes for polls
  const [pollVotes, setPollVotes] = useState<Record<string, { votedChoice: string; textResponse?: string; submittedAt?: number }>>(() => {
    try {
      const stored = localStorage.getItem('thesdel_poll_votes');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // Selection state before submission
  const [selectedPollChoices, setSelectedPollChoices] = useState<Record<string, string>>({});
  const [pollToasts, setPollToasts] = useState<Record<string, string>>({});
  const [pollTextInput, setPollTextInput] = useState<Record<string, string>>({});

  const handleRegisterPollVote = (pollId: string, choice: string, textResponse?: string) => {
    const updated = {
      ...pollVotes,
      [pollId]: {
        votedChoice: choice,
        textResponse,
        submittedAt: Date.now() // Track submission time to expire in 24 hours
      }
    };
    setPollVotes(updated);
    localStorage.setItem('thesdel_poll_votes', JSON.stringify(updated));

    // Show a temporary success feedback toast
    setPollToasts(prev => ({ ...prev, [pollId]: 'Thanks for your feedback!' }));
    setTimeout(() => {
      setPollToasts(prev => {
        const copy = { ...prev };
        delete copy[pollId];
        return copy;
      });
    }, 4000);
  };

  const handleRegisterVote = (updateId: string) => {
    const current = userVotes[updateId] || { votes: Math.floor(Math.abs(updateId.charCodeAt(0) % 15) + 3), hasVoted: false };
    if (current.hasVoted) return;

    const updated = {
      ...userVotes,
      [updateId]: {
        votes: current.votes + 1,
        hasVoted: true
      }
    };
    setUserVotes(updated);
    localStorage.setItem('thesdel_bulletin_votes', JSON.stringify(updated));
  };

  const handleClassRepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRepMsg.trim() || !onAddBroadcast || !activeClassId) return;

    setIsSubmittingRepMsg(true);
    try {
      const ok = await onAddBroadcast(activeClassId, classRepMsg.trim());
      if (ok) {
        setClassRepMsg('');
        setRepSuccess(true);
        setTimeout(() => setRepSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingRepMsg(false);
    }
  };

  // Filter bulletin updates and hide completed polls older than 24 hours
  const bulletinUpdates = updates.filter((up) => {
    if (up.description.startsWith('{') && up.description.endsWith('}')) {
      try {
        const parsed = JSON.parse(up.description);
        if (parsed.isAd) return true;
        if (parsed.isPoll) {
          const userVoteRecord = pollVotes[up.id];
          if (userVoteRecord && userVoteRecord.submittedAt) {
            const elapsed = Date.now() - userVoteRecord.submittedAt;
            // If submitted more than 24 hours ago, hide the poll from notifications view
            if (elapsed >= 24 * 60 * 60 * 1000) {
              return false;
            }
          }
          return true;
        }
      } catch (e) {}
    }
    if (up.type === 'entry_added' || up.type === 'entry_edited' || up.type === 'entry_deleted') {
      return false;
    }
    return true;
  });

  // Mark all as read when this page is loaded
  useEffect(() => {
    if (bulletinUpdates.length > 0) {
      localStorage.setItem('thesdel_last_read_update_id', bulletinUpdates[0].id);
    }
  }, [updates, pollVotes]);

  const getPillsForUpdate = (update: any): string[] => {
    if (update.type === 'cancellation') return ['CANCELLED', 'URGENT'];
    if (update.type === 'venue_change') return ['VENUE CHANGED', 'URGENT'];
    return ['INFO'];
  };

  return (
    <div className="space-y-6" id="notifications-standalone-view">
      {/* Standalone Header Section with Close Button */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between" id="notifications-header">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center rounded-none"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold font-mono tracking-wide text-zinc-900 dark:text-zinc-100 uppercase flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              Notifications
            </h1>
          </div>
        </div>
      </div>

      {/* Main Notifications Content Card */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-6" id="notifications-main-card">
        {bulletinUpdates.length === 0 ? (
          <div className="py-12 text-center space-y-3" id="notifications-empty">
            <Bell className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto animate-pulse" />
            <p className="text-sm font-mono text-zinc-500">No official announcements have been dispatched yet for this class group.</p>
          </div>
        ) : (
          <div className="space-y-6" id="notifications-list-wrapper">
            {bulletinUpdates.map((up) => {
              let isAd = false;
              let isPoll = false;
              let parsedData: any = null;

              if (up.description.startsWith('{') && up.description.endsWith('}')) {
                try {
                  parsedData = JSON.parse(up.description);
                  if (parsedData.isAd) isAd = true;
                  if (parsedData.isPoll) isPoll = true;
                } catch (e) {}
              }

              // Removed "INTERACTIVE POLL / ADMIN DECISION" pills as requested
              const pills = isAd 
                ? ['SPONSORED', 'AD SPACE'] 
                : isPoll 
                ? [] 
                : getPillsForUpdate(up);

              const hasVoted = userVotes[up.id]?.hasVoted;
              const voteCount = userVotes[up.id]?.votes ?? Math.floor(Math.abs(up.id.charCodeAt(0) % 15) + 3);
              
              const isClassRepAnnouncement = up.userId && (
                up.userId.startsWith('user_rep') || 
                up.userId.includes('rep') || 
                up.userId.includes('asst') ||
                up.userName.toLowerCase().includes('rep') ||
                up.userName.toLowerCase().includes('asst')
              );

              return (
                <div 
                  key={up.id} 
                  className={`border p-5 transition-all hover:shadow-[1px_1px_3px_rgba(0,0,0,0.05)] ${
                    isAd 
                      ? 'bg-amber-50/35 dark:bg-amber-950/5 border-amber-200 dark:border-amber-900/30' 
                      : isPoll
                      ? 'bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800'
                      : 'bg-zinc-50/50 dark:bg-zinc-950/30 border-zinc-250 dark:border-zinc-800'
                  }`}
                  id={`notification-item-${up.id}`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {pills.map((p, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none border ${
                          p === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
                            : p === 'AD SPACE' || p === 'SPONSORED'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800'
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                    {isAd && (
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-wider ml-1">
                        • SPONSORED SPOTLIGHT
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                      {new Date(up.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Ad Payload Rendering */}
                  {isAd && parsedData && (
                    <div className="space-y-3 font-sans">
                      {parsedData.adImageUrl && (
                        <img 
                          src={parsedData.adImageUrl} 
                          alt="Campaign Promotion" 
                          referrerPolicy="no-referrer"
                          className="w-full max-h-48 object-cover border border-amber-200 dark:border-amber-900/30"
                        />
                      )}
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight leading-snug">
                        {parsedData.adTitle}
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                        {parsedData.description}
                      </p>
                      {parsedData.adUrl && (
                        <a 
                          href={parsedData.adUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[11px] font-bold px-3 py-1.5 transition-all uppercase tracking-wider border border-amber-700 cursor-pointer"
                        >
                          {parsedData.adActionText || 'Learn More'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Poll Payload Rendering */}
                  {isPoll && parsedData && (
                    <div className="space-y-4 font-sans border-l-2 border-zinc-400 dark:border-zinc-600 pl-4 py-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-start gap-1.5 font-sans leading-snug">
                        <Megaphone className="w-4 h-4 text-zinc-800 dark:text-zinc-200 shrink-0 mt-0.5" />
                        {parsedData.question}
                      </h4>

                      {/* Interactive anonymous poll block */}
                      {(() => {
                        const choices: string[] = parsedData.choices && parsedData.choices.length > 0 
                          ? parsedData.choices 
                          : parsedData.pollType === 'single' 
                          ? ['Yes', 'No'] 
                          : [];

                        const userVoteRecord = pollVotes[up.id];

                        // If response is already registered, only show success message (totally anonymous, no results shown)
                        if (userVoteRecord) {
                          return (
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs space-y-1.5">
                              <p className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[10px] flex items-center gap-1">
                                <Check className="w-4 h-4" /> Response Registered
                              </p>
                              <p className="italic font-sans text-xs text-zinc-650 dark:text-zinc-350">
                                "Thanks for your feedback! Your response has been securely and anonymously registered with the school administrator."
                              </p>
                              {userVoteRecord.votedChoice && (
                                <p className="text-[11px] text-zinc-550 dark:text-zinc-450">
                                  Your selection: <strong className="font-mono">{userVoteRecord.votedChoice}</strong>
                                </p>
                              )}
                            </div>
                          );
                        }

                        // Text input type of poll
                        if (parsedData.pollType === 'word') {
                          const currentTextVal = pollTextInput[up.id] || '';
                          // Count line breaks to enforce max of 5 lines limit
                          const lineCount = (currentTextVal.match(/\n/g) || []).length + 1;

                          return (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                                  Line breaks max of 5 lines ({lineCount}/5 used)
                                </span>
                                <textarea
                                  placeholder="Type your open-ended response..."
                                  rows={5}
                                  value={currentTextVal}
                                  onChange={(e) => {
                                    const text = e.target.value;
                                    const lines = text.split('\n');
                                    if (lines.length <= 5) {
                                      setPollTextInput({ ...pollTextInput, [up.id]: text });
                                    }
                                  }}
                                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 p-2.5 text-sm font-mono text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-300 resize-none"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const val = currentTextVal.trim();
                                  if (val) {
                                    handleRegisterPollVote(up.id, val, val);
                                  }
                                }}
                                disabled={!currentTextVal.trim()}
                                className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-mono text-[11px] font-bold px-4 py-2 border border-zinc-950 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider transition-all"
                              >
                                Submit Feedback
                              </button>
                            </div>
                          );
                        }

                        // Multiple choice/single choice poll
                        const currentSelected = selectedPollChoices[up.id];

                        return (
                          <div className="space-y-3">
                            <div className="flex flex-col gap-2">
                              {choices.map((c) => {
                                const isSelected = currentSelected === c;
                                return (
                                  <button
                                    key={c}
                                    onClick={() => setSelectedPollChoices({ ...selectedPollChoices, [up.id]: c })}
                                    className={`w-full text-left p-3 border font-mono text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-zinc-900 border-zinc-950 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                                        : 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                                    }`}
                                  >
                                    <span>{c}</span>
                                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Toast message display inside the card on submit */}
                            {pollToasts[up.id] && (
                              <div className="p-2 border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold animate-fade-in">
                                ✓ {pollToasts[up.id]}
                              </div>
                            )}

                            {currentSelected && !pollToasts[up.id] && (
                              <button
                                onClick={() => handleRegisterPollVote(up.id, currentSelected)}
                                className="bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-mono text-[11px] font-bold px-4 py-2 border border-zinc-950 cursor-pointer uppercase tracking-wider transition-all"
                              >
                                Submit Answer
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Regular Plaintext Broadcast Rendering */}
                  {!isAd && !isPoll && (
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans select-text">
                      {up.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
                      {isPoll ? 'From Thesdel team' : <>By: <span className="font-bold text-zinc-600 dark:text-zinc-300">{up.userName}</span></>}
                    </span>

                    {/* Standard Upvoting (Omit for Class Representative Broadcasts, only available for admin plain broadcasts) */}
                    {!isAd && !isPoll && !isClassRepAnnouncement ? (
                      <button
                        onClick={() => handleRegisterVote(up.id)}
                        disabled={hasVoted}
                        className={`px-3 py-1 text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                          hasVoted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                            : 'bg-zinc-55 hover:bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800 cursor-pointer'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                        <span>{hasVoted ? `Vote Counted (${voteCount})` : `Upvote / Agree (${voteCount})`}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Class Representative Broadcaster Input Form (only show if rep/admin and feature is active) */}
        {userRole === 'representative' && onAddBroadcast && activeClassId && (
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Class Rep Broadcaster Console
            </h4>
            <form onSubmit={handleClassRepSubmit} className="space-y-2">
              <textarea
                value={classRepMsg}
                onChange={(e) => setClassRepMsg(e.target.value)}
                placeholder="Post a study tip, schedule reminder, or important classroom notice to your members..."
                maxLength={250}
                rows={2}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>Max 250 characters. Broadcast updates feed instantly.</span>
                <button
                  type="submit"
                  disabled={isSubmittingRepMsg || !classRepMsg.trim()}
                  className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-800 dark:border-zinc-300 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmittingRepMsg ? 'Transmitting...' : 'Post Broadcast'}</span>
                </button>
              </div>
            </form>
            {repSuccess && (
              <div className="mt-2 p-2.5 border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-mono text-xs">
                ✓ Broadcast dispatched successfully!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
