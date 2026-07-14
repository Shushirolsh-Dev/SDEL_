import React, { useState, useEffect } from 'react';
import { User, NotificationPreferences, ClassGroup, Role, SubscriptionPlan } from '../types';
import { Bell, UserCheck, ShieldAlert, Clock, RefreshCw, Key, AlertCircle, Check, Lock, AlertTriangle, ArrowRight, HelpCircle, Shield, CreditCard, Eye, EyeOff, Globe } from 'lucide-react';
import { getCountryFromPhone } from '../utils/countries';
import { fetchExchangeRates, convertUsdTo } from '../utils/exchangeRates';
import { fetchBasePrices } from '../lib/supabase';

interface ProfileViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  joinedClasses: ClassGroup[];
  notificationPrefs: NotificationPreferences;
  onUpdatePrefs: (prefs: Partial<NotificationPreferences>) => void;
  onResetApp: () => void;
  // Dev simulation props
  simulatedTime: string;
  onUpdateSimulatedTime: (time: string) => void;
  currentUserRole: Role;
  onUpdateRole: (role: Role) => void;
  onLogout?: () => void;
  onNavigate: (view: 'home' | 'timetable' | 'attendance' | 'class' | 'profile' | 'reminders') => void;
  theme?: 'system' | 'dark';
  onUpdateTheme?: (theme: 'system' | 'dark') => void;
}

export default function ProfileView({
  currentUser,
  onUpdateUser,
  joinedClasses,
  notificationPrefs,
  onUpdatePrefs,
  onResetApp,
  simulatedTime,
  onUpdateSimulatedTime,
  currentUserRole,
  onUpdateRole,
  onLogout,
  onNavigate,
  theme = 'system',
  onUpdateTheme,
 }: ProfileViewProps) {
  // Plan manager states
  const [isPlanComparisonOpen, setIsPlanComparisonOpen] = useState(true);
  const [basePrices, setBasePrices] = useState<{ basic: number; premium: number }>({ basic: 1.00, premium: 3.00 });
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  const [upgradeWizardTarget, setUpgradeWizardTarget] = useState<null | 'basic' | 'premium'>(null);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [useDifferentNumber, setUseDifferentNumber] = useState(false);
  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState('');
  const [explicitOptIn, setExplicitOptIn] = useState(false);
  const [wizardError, setWizardError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [dbPrices, liveRates] = await Promise.all([
          fetchBasePrices(),
          fetchExchangeRates()
        ]);
        if (isMounted) {
          setBasePrices(dbPrices);
          setRates(liveRates);
          setIsLoadingRates(false);
        }
      } catch (err) {
        console.error('Error loading dynamic pricing/rates:', err);
        if (isMounted) {
          setIsLoadingRates(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const userCountry = getCountryFromPhone(currentUser.phone || currentUser.whatsappNumber);
  const basicConverted = convertUsdTo(basePrices.basic, rates, userCountry.currency);
  const premiumConverted = convertUsdTo(basePrices.premium, rates, userCountry.currency);


  const getMaskedValue = (value: string) => {
    if (!value) return '';
    if (value.length <= 6) {
      return value.slice(0, 3) + '****' + value.slice(-1);
    }
    return value.slice(0, 3) + '****' + value.slice(-3);
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    onUpdatePrefs({
      [key]: !notificationPrefs[key],
    });
  };

  // Helper to partially mask phone numbers
  const maskPhoneNumber = (num: string) => {
    if (!num) return '';
    if (num.length <= 7) return '***' + num.slice(-3);
    const prefix = num.slice(0, 4);
    const lastFour = num.slice(-4);
    const maskedLength = num.length - 8 > 0 ? num.length - 8 : 4;
    return `${prefix}${'*'.repeat(maskedLength)}${lastFour}`;
  };

  const handleOpenUpgradeWizard = (target: 'basic' | 'premium') => {
    setUpgradeWizardTarget(target);
    setWizardStep(1);
    setUseDifferentNumber(false);
    setCustomWhatsAppNumber('');
    setExplicitOptIn(false);
    setWizardError('');
  };

  const handleWizardNext = () => {
    if (useDifferentNumber) {
      const trimmed = customWhatsAppNumber.trim();
      const phoneRegex = /^\+[1-9]\d{6,14}$/;
      if (!phoneRegex.test(trimmed)) {
        setWizardError('Please enter a valid WhatsApp number with country code (e.g., +2348100240137).');
        return;
      }
    }
    setWizardError('');
    setWizardStep(2);
  };

  const handleWizardBack = () => {
    setWizardError('');
    setWizardStep(1);
  };

  const handleWizardCancel = () => {
    setUpgradeWizardTarget(null);
  };

  const handleWizardConfirm = () => {
    if (!explicitOptIn) {
      setWizardError('You must explicitly opt-in to receive WhatsApp reminders.');
      return;
    }

    const targetNumber = useDifferentNumber ? customWhatsAppNumber.trim() : (currentUser.phone || '+2348100240137');
    
    // Auto-enable notifications for a great first-run experience
    const updatedSettings = currentUser.reminderSettings || {
      masterWhatsAppReminders: true,
      dailySummaryEnabled: true,
      dailySummaryTime: '08:00',
      classStartReminderEnabled: true,
      classStartReminderTime: 15,
      attendanceNotMarkedEnabled: true,
      streakAtRiskEnabled: true,
      venueChangeEnabled: true,
      customReminders: [],
      reminderAllowance: 100,
      remindersSent: 0
    };

    // Make sure we enable master and daily summaries
    const finalSettings = {
      ...updatedSettings,
      masterWhatsAppReminders: true,
      dailySummaryEnabled: true,
      // If premium, turn on others as well
      classStartReminderEnabled: upgradeWizardTarget === 'premium',
      attendanceNotMarkedEnabled: upgradeWizardTarget === 'premium',
      streakAtRiskEnabled: upgradeWizardTarget === 'premium',
      venueChangeEnabled: upgradeWizardTarget === 'premium',
    };

    const updatedUser: User = {
      ...currentUser,
      plan: upgradeWizardTarget as SubscriptionPlan,
      whatsappNumber: targetNumber,
      isReminderNumberLocked: true,
      reminderSettings: finalSettings,
    };

    onUpdateUser(updatedUser);
    setUpgradeWizardTarget(null);
    alert(`Success! Your account has been upgraded to ${upgradeWizardTarget === 'basic' ? 'Basic' : 'Premium'} plan!`);
  };

  const handleDowngradeToFree = () => {
    if (confirm('Are you sure you want to revert to the Free plan? Your active WhatsApp reminder number and premium alerts will be disabled.')) {
      const updatedUser: User = {
        ...currentUser,
        plan: 'free',
        whatsappNumber: '',
        isReminderNumberLocked: false,
        reminderSettings: {
          ...(currentUser.reminderSettings || {
            masterWhatsAppReminders: false,
            dailySummaryEnabled: false,
            dailySummaryTime: '08:00',
            classStartReminderEnabled: false,
            classStartReminderTime: 15,
            attendanceNotMarkedEnabled: false,
            streakAtRiskEnabled: false,
            venueChangeEnabled: false,
            customReminders: [],
            reminderAllowance: 100,
            remindersSent: 0
          }),
          masterWhatsAppReminders: false,
          dailySummaryEnabled: false,
        }
      };
      onUpdateUser(updatedUser);
    }
  };

  return (
    <div className="space-y-8" id="profile-view-container">
      {/* 1. Account Identity */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-none space-y-4" id="profile-identity">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
            Student Identity Account
          </h3>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">ID: {currentUser.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold block">Full Name</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-sans text-base font-bold">{currentUser.name}</span>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold block">Registered Email</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-zinc-900 dark:text-zinc-100 font-sans text-base font-bold">
                {showEmail ? currentUser.email : getMaskedValue(currentUser.email)}
              </span>
              <button
                type="button"
                onClick={() => setShowEmail(!showEmail)}
                className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                title={showEmail ? "Hide email" : "Show email"}
              >
                {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {currentUser.phone && (
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold block">Login Phone Number</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-zinc-900 dark:text-zinc-100 font-mono text-base font-bold">
                  {showPhone ? currentUser.phone : getMaskedValue(currentUser.phone)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                  title={showPhone ? "Hide phone number" : "Show phone number"}
                >
                  {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1B. Plan & Reminders Experience Section */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-none space-y-5" id="plan-and-reminders-section">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-700 dark:text-zinc-400" />
            Plan & Reminders
          </h3>
          <span className="text-[10px] font-mono uppercase bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 font-bold border border-amber-200 dark:border-amber-900/40">
            Coming Soon
          </span>
        </div>

        {/* Feature Coming Soon Banner */}
        <div className="p-4 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/40 text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 animate-pulse shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-800 dark:text-amber-400 mb-0.5">WHATSAPP REMINDERS & SUBSCRIPTIONS ARE COMING SOON</strong>
            Our automated WhatsApp delivery engine and custom subscription tiers are currently in staging. Real-time class alerts and streak recovery logs will go live soon!
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono opacity-60">
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase text-[9px] font-bold block">Current Plan</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-sans text-lg font-extrabold capitalize flex items-center gap-1.5">
              Free Trial
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px] block mt-1">
              ₦0 / month — Preview access enabled
            </span>
          </div>

          <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase text-[9px] font-bold block">WhatsApp Reminder Number</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-mono text-xs font-bold block">
              {currentUser.phone ? maskPhoneNumber(currentUser.phone) : 'Not Configured'}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500 text-[9px] block mt-1 font-sans">
              Line auto-mapped from profile.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => alert("WhatsApp Reminders are coming soon!")}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 font-mono text-xs font-bold border border-zinc-200 dark:border-zinc-800 cursor-not-allowed flex items-center gap-1.5"
            disabled
          >
            <Bell className="w-3.5 h-3.5" /> Manage Reminders (Coming Soon)
          </button>
          
          <button
            onClick={() => setIsPlanComparisonOpen(!isPlanComparisonOpen)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs font-bold border border-zinc-800 dark:border-zinc-200 flex items-center gap-1.5 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" /> {isPlanComparisonOpen ? 'Hide Membership Plans' : 'Compare Membership Plans'}
          </button>
        </div>

        {/* Plan Comparison Matrix */}
        {isPlanComparisonOpen && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4 space-y-4 animate-fade-in" id="plans-comparison-grid">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 text-center">
              <h4 className="font-mono text-xs uppercase font-bold text-zinc-800 dark:text-zinc-200">
                Thesdel Membership Plan Comparison
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                Choose a demo plan below to evaluate academic summaries and WhatsApp notifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Free Plan */}
              <div className={`p-4 bg-white dark:bg-zinc-900 border rounded-none space-y-3 flex flex-col justify-between ${currentUser.plan === 'free' || !currentUser.plan ? 'border-zinc-950 dark:border-zinc-100 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-sans">Free</span>
                    {(currentUser.plan === 'free' || !currentUser.plan) && (
                      <span className="text-[9px] uppercase font-mono font-bold bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">₦0 / month</div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                    Access to universally synchronized academic timetables, class rosters, and manual attendance check-ins.
                  </p>
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 font-sans">
                    🚫 No notification subscriptions available on Free Tier.
                  </div>
                </div>

                <div className="pt-3">
                  {(currentUser.plan === 'free' || !currentUser.plan) ? (
                    <button disabled className="w-full py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono uppercase font-bold cursor-not-allowed">
                      ✓ Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleDowngradeToFree}
                      className="w-full py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-800 dark:hover:border-zinc-400 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-[10px] font-mono uppercase font-bold transition-colors"
                    >
                      Revert to Free
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Plan */}
              <div className={`p-4 bg-white dark:bg-zinc-900 border rounded-none space-y-3 flex flex-col justify-between ${currentUser.plan === 'basic' ? 'border-zinc-950 dark:border-zinc-100 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-sans">Basic</span>
                    {currentUser.plan === 'basic' && (
                      <span className="text-[9px] uppercase font-mono font-bold bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 space-y-0.5">
                    <div>${basePrices.basic.toFixed(2)} USD / month</div>
                    {userCountry.currency !== 'USD' && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1">
                        <span>{userCountry.flag}</span>
                        <span>{userCountry.symbol}{basicConverted.amount.toLocaleString()} {userCountry.currency}</span>
                        {isLoadingRates ? (
                          <span className="text-[8px] text-zinc-400 shrink-0">(loading rates...)</span>
                        ) : (
                          <span className="text-[8px] text-zinc-400 shrink-0 font-mono">(1 USD = {basicConverted.rate.toFixed(2)} {userCountry.currency})</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                    Everything in Free, plus:
                  </p>
                  <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans space-y-1 list-disc pl-3">
                    <li>One daily WhatsApp academic summary briefing today’s classes, venues, cancel logs, and upcoming assignments.</li>
                  </ul>

                  {/* Option toggle for Basic */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {currentUser.plan === 'basic' ? (
                      <div className="p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 rounded-none">
                        <span className="text-[9px] font-bold text-zinc-700 dark:text-zinc-300 block uppercase font-mono">Notification Options:</span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-sans">Daily summary on WhatsApp</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentUser.reminderSettings?.dailySummaryEnabled || false}
                              onChange={() => {
                                const settings = currentUser.reminderSettings || {
                                  masterWhatsAppReminders: true,
                                  dailySummaryEnabled: false,
                                  dailySummaryTime: '08:00',
                                  classStartReminderEnabled: false,
                                  classStartReminderTime: 15,
                                  attendanceNotMarkedEnabled: false,
                                  streakAtRiskEnabled: false,
                                  venueChangeEnabled: false,
                                  customReminders: [],
                                  reminderAllowance: 100,
                                  remindersSent: 0,
                                };
                                onUpdateUser({
                                  ...currentUser,
                                  reminderSettings: {
                                    ...settings,
                                    dailySummaryEnabled: !settings.dailySummaryEnabled,
                                    masterWhatsAppReminders: true,
                                  }
                                });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                          </label>
                        </div>
                        {currentUser.reminderSettings?.dailySummaryEnabled && (
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[9px]">
                            <span className="text-zinc-500 dark:text-zinc-400 font-sans">Delivery Time</span>
                            <select
                              value={currentUser.reminderSettings?.dailySummaryTime || '08:00'}
                              onChange={(e) => {
                                const settings = currentUser.reminderSettings || {
                                  masterWhatsAppReminders: true,
                                  dailySummaryEnabled: false,
                                  dailySummaryTime: '08:00',
                                  classStartReminderEnabled: false,
                                  classStartReminderTime: 15,
                                  attendanceNotMarkedEnabled: false,
                                  streakAtRiskEnabled: false,
                                  venueChangeEnabled: false,
                                  customReminders: [],
                                  reminderAllowance: 100,
                                  remindersSent: 0,
                                };
                                onUpdateUser({
                                  ...currentUser,
                                  reminderSettings: {
                                    ...settings,
                                    dailySummaryTime: e.target.value,
                                  }
                                });
                              }}
                              className="border border-zinc-200 dark:border-zinc-800 text-[9px] py-0.5 px-1 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-mono focus:outline-none focus:border-zinc-800"
                            >
                              <option value="07:00">07:00</option>
                              <option value="08:00">08:00</option>
                              <option value="09:00">09:00</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans leading-relaxed">
                        Upgrade to Basic to configure the Daily WhatsApp Summary option.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3">
                  {currentUser.plan === 'basic' ? (
                    <button disabled className="w-full py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono uppercase font-bold cursor-not-allowed">
                      ✓ Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenUpgradeWizard('basic')}
                      className="w-full py-1.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-[10px] font-mono uppercase font-bold transition-colors"
                    >
                      Upgrade to Basic
                    </button>
                  )}
                </div>
              </div>

              {/* Premium Plan */}
              <div className={`p-4 bg-white dark:bg-zinc-900 border rounded-none space-y-3 flex flex-col justify-between ${currentUser.plan === 'premium' ? 'border-zinc-950 dark:border-zinc-100 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-sans flex items-center gap-1">
                      Premium ★
                    </span>
                    {currentUser.plan === 'premium' && (
                      <span className="text-[9px] uppercase font-mono font-bold bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 space-y-0.5">
                    <div>${basePrices.premium.toFixed(2)} USD / month</div>
                    {userCountry.currency !== 'USD' && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1">
                        <span>{userCountry.flag}</span>
                        <span>{userCountry.symbol}{premiumConverted.amount.toLocaleString()} {userCountry.currency}</span>
                        {isLoadingRates ? (
                          <span className="text-[8px] text-zinc-400 shrink-0">(loading rates...)</span>
                        ) : (
                          <span className="text-[8px] text-zinc-400 shrink-0 font-mono">(1 USD = {premiumConverted.rate.toFixed(2)} {userCountry.currency})</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                    Everything in Basic, plus:
                  </p>
                  <ul className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans space-y-1 list-disc pl-3">
                    <li>15-minute class starting push reminders</li>
                    <li>Attendance-not-marked alert warnings</li>
                    <li>Streak-at-risk urgent alerts</li>
                    <li>Relocation venue shifts & cancel triggers</li>
                    <li>Personalized "Remind me to read" notes</li>
                    <li>Monthly 100-reminder delivery allowance limit</li>
                  </ul>

                  {/* Option toggles for Premium */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {currentUser.plan === 'premium' ? (
                      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 rounded-none">
                        <span className="text-[9px] font-bold text-zinc-700 dark:text-zinc-300 block uppercase font-mono">Notification Options:</span>
                        
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-sans">Class starting soon (15m)</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationPrefs.classStartingSoon}
                              onChange={() => handleTogglePref('classStartingSoon')}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-sans">Attendance not marked</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationPrefs.attendanceNotMarked}
                              onChange={() => handleTogglePref('attendanceNotMarked')}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-sans">Streak at risk alert</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationPrefs.streakAtRisk}
                              onChange={() => handleTogglePref('streakAtRisk')}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-300 font-sans">Venue & cancel alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationPrefs.timetableOrVenueChanges}
                              onChange={() => handleTogglePref('timetableOrVenueChanges')}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans leading-relaxed">
                        Upgrade to Premium to activate custom push reminders, missed check-ins, and streak risk warnings.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3">
                  {currentUser.plan === 'premium' ? (
                    <button disabled className="w-full py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono uppercase font-bold cursor-not-allowed">
                      ✓ Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenUpgradeWizard('premium')}
                      className="w-full py-1.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-[10px] font-mono uppercase font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 1C. App Visual Theme */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-none space-y-4 animate-fade-in" id="profile-theme-section">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono flex items-center gap-2">
            App Visual Theme
          </h3>
          <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 font-bold border border-zinc-200 dark:border-zinc-700">
            {theme === 'dark' ? 'Dark Theme' : 'System Theme'}
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          Choose between our focused dark theme or respect your operating system's settings (where light theme acts as the default).
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => onUpdateTheme && onUpdateTheme('system')}
            className={`p-3 border text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-none ${
              theme === 'system'
                ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <span>System Default</span>
            <span className="text-[9px] font-sans font-normal opacity-75">Light is default fallback</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateTheme && onUpdateTheme('dark')}
            className={`p-3 border text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-none ${
              theme === 'dark'
                ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <span>Dark Mode</span>
            <span className="text-[9px] font-sans font-normal opacity-75">Always high-contrast dark</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP REMINDER NUMBER FLOW MODAL */}
      {upgradeWizardTarget && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" id="whatsapp-activation-wizard">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6 max-w-md w-full shadow-lg space-y-5 animate-fade-in text-xs">
            
            {/* Step Header */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">
                Activation Wizard: Step {wizardStep} of 2
              </span>
              <h3 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-zinc-100 mt-1">
                {wizardStep === 1 ? 'Choose your WhatsApp number' : 'Confirm & Explicit Opt-In'}
              </h3>
            </div>

            {wizardError && (
              <div className="p-3 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400 font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{wizardError}</span>
              </div>
            )}

            {/* STEP 1: Select recipient line */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Thesdel will deliver your Daily Academic Summaries and real-time alerts to a single, verified WhatsApp number. Choose your number below:
                </p>

                <div className="space-y-2.5">
                  {/* Option A: Use sign-up number */}
                  <label className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700">
                    <input
                      type="radio"
                      name="whatsapp-choice"
                      checked={!useDifferentNumber}
                      onChange={() => {
                        setUseDifferentNumber(false);
                        setWizardError('');
                      }}
                      className="mt-0.5 accent-zinc-900 dark:accent-zinc-100"
                    />
                    <div className="font-sans space-y-0.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs">Use my academic account number</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {currentUser.phone ? maskPhoneNumber(currentUser.phone) : '+234******0137'} (Default)
                      </span>
                    </div>
                  </label>

                  {/* Option B: Use different number */}
                  <label className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700">
                    <input
                      type="radio"
                      name="whatsapp-choice"
                      checked={useDifferentNumber}
                      onChange={() => {
                        setUseDifferentNumber(true);
                        setWizardError('');
                      }}
                      className="mt-0.5 accent-zinc-900 dark:accent-zinc-100"
                    />
                    <div className="font-sans space-y-0.5 w-full">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs">Use a different WhatsApp number</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Deliver notifications to another phone line.</span>
                    </div>
                  </label>
                </div>

                {/* Conditional custom number input */}
                {useDifferentNumber && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">WhatsApp Number with Country Code</label>
                    <input
                      id="custom-whatsapp-input"
                      type="tel"
                      placeholder="e.g., +2348100240137"
                      value={customWhatsAppNumber}
                      onChange={(e) => {
                        setCustomWhatsAppNumber(e.target.value);
                        setWizardError('');
                      }}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-400 font-mono text-xs"
                    />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans block leading-relaxed">
                      Must start with "+" followed by country code and local digits.
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 font-mono">
                  <button
                    onClick={handleWizardCancel}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-600 dark:hover:border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent font-bold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWizardNext}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold uppercase cursor-pointer flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Explicit Opt-In Confirmation */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="p-3 border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400 space-y-1 font-sans">
                  <h4 className="font-bold text-xs">Final Notice</h4>
                  <p className="text-[11px] leading-relaxed">
                    <strong>“This is the one WhatsApp number that will receive your reminders from Thesdel.”</strong>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Once activated, your reminder line is locked. You will be able to customize specific summaries and alerts in your settings dashboard.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 block">Recipient WhatsApp Line:</span>
                  <span className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {useDifferentNumber ? maskPhoneNumber(customWhatsAppNumber) : maskPhoneNumber(currentUser.phone || '+2348100240137')}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-sans">
                    Never displayed in full on public profile panels.
                  </span>
                </div>

                <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-none space-y-1">
                  <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">Subscription Rate Summary:</span>
                  <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                    <span className="capitalize">{upgradeWizardTarget} Plan</span>
                    <span>${(upgradeWizardTarget === 'basic' ? basePrices.basic : basePrices.premium).toFixed(2)} USD / month</span>
                  </div>
                  {userCountry.currency !== 'USD' && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-bold pt-1.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 mt-1.5">
                      <span className="flex items-center gap-1">{userCountry.flag} Local Conversion ({userCountry.name}):</span>
                      <span>
                        {userCountry.symbol}
                        {upgradeWizardTarget === 'basic' ? basicConverted.amount.toLocaleString() : premiumConverted.amount.toLocaleString()} {userCountry.currency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Explicit Opt-In Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="wizard-opt-in-check"
                    type="checkbox"
                    checked={explicitOptIn}
                    onChange={(e) => {
                      setExplicitOptIn(e.target.checked);
                      setWizardError('');
                    }}
                    className="mt-0.5 w-4 h-4 rounded-none accent-zinc-950 dark:accent-zinc-100 cursor-pointer"
                  />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-snug">
                    I explicitly opt-in to receive academic alerts, timetable venue shift notices, and daily summary briefings from Thesdel on this verified WhatsApp number.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800 font-mono">
                  <button
                    onClick={handleWizardBack}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-600 dark:hover:border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent font-bold uppercase cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleWizardConfirm}
                    className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold uppercase cursor-pointer flex items-center gap-1"
                  >
                    ✓ Confirm & Activate
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}



      {/* 3. Developer Sandbox Simulation Center (Acceptance Tests Helper & Mock switching) */}
      <div className="border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-6 rounded-none space-y-4" id="developer-sandbox">
        <div className="border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-mono flex items-center gap-1.5">
            <Key className="w-4 h-4 text-zinc-700 dark:text-zinc-400" />
            Developer Simulation Control (Tests Helper)
          </h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans mt-1">
            This dashboard is configured for sandbox testing of user roles, time-based countdowns, and check-in windows. Changes update the simulation scope immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dev-controls">
          {/* Role Switching */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 font-mono block">Simulate Student Role:</span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                id="dev-role-member"
                onClick={() => onUpdateRole('member')}
                className={`px-3 py-1.5 border text-center cursor-pointer transition-colors ${
                  currentUserRole === 'member'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350'
                }`}
              >
                Member
              </button>
              <button
                id="dev-role-assistant"
                onClick={() => onUpdateRole('assistant')}
                className={`px-3 py-1.5 border text-center cursor-pointer transition-colors ${
                  currentUserRole === 'assistant'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350'
                }`}
              >
                Assistant
              </button>
              <button
                id="dev-role-rep"
                onClick={() => onUpdateRole('representative')}
                className={`px-3 py-1.5 border text-center cursor-pointer transition-colors ${
                  currentUserRole === 'representative'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350'
                }`}
              >
                Representative
              </button>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 space-y-1">
              <span className="block">• **Member**: View timetable and record personal manual attendance.</span>
              <span className="block">• **Class Representative**: Create class, invite, and manage entries/venues/roles.</span>
              <span className="block">• **Assistant**: View-edit timetable entries, but cannot delete class or manage roles.</span>
            </div>
          </div>

          {/* Time Travel Simulation */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 font-mono block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Simulate Current Time (Monday July 13, 2026):
            </span>
            <div className="flex items-center gap-2">
              <input
                id="dev-time-input"
                type="time"
                value={simulatedTime}
                onChange={(e) => onUpdateSimulatedTime(e.target.value)}
                className="border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-bold text-sm text-center font-mono focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-400 rounded-none"
              />
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => onUpdateSimulatedTime('08:30')}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] font-mono cursor-pointer"
                >
                  08:30 (Before Class)
                </button>
                <button
                  onClick={() => onUpdateSimulatedTime('10:00')}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] font-mono cursor-pointer"
                >
                  10:00 (Live entry_1)
                </button>
                <button
                  onClick={() => onUpdateSimulatedTime('11:30')}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] font-mono cursor-pointer"
                >
                  11:30 (Live entry_2)
                </button>
                <button
                  onClick={() => onUpdateSimulatedTime('16:00')}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] font-mono cursor-pointer"
                >
                  16:00 (All Completed)
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Use time-travel to test the countdown state on Home, live active checkers, or automatic missed logs for past classes.
            </p>
          </div>
        </div>

        {/* Reset app state helper */}
        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono">
          <span className="text-zinc-500 dark:text-zinc-400">Reset Local Storage to defaults:</span>
          <button
            id="dev-reset-btn"
            onClick={() => {
              if (confirm('Are you sure you want to restore the app to the initial seed state? This will restore all default schedules, classes, and logs.')) {
                onResetApp();
              }
            }}
            className="px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-red-700 dark:hover:text-red-400 hover:border-red-600 dark:hover:border-red-600 border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restore Starter Seed
          </button>
        </div>
      </div>

      {/* 4. Simple Logout Dialog button */}
      <div className="flex justify-end pt-4" id="logout-footer">
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              alert('Logout action simulated.');
            }
          }}
          className="px-5 py-2 border border-zinc-300 dark:border-zinc-750 hover:border-zinc-800 dark:hover:border-zinc-300 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-transparent font-mono text-xs font-bold transition-colors cursor-pointer"
        >
          Logout of Account
        </button>
      </div>
    </div>
  );
}
