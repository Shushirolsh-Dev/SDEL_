import React, { useState } from 'react';
import { User, CustomReminder, SubscriptionPlan } from '../types';
import { Bell, Clock, Calendar, ArrowLeft, Shield, Check, HelpCircle, Lock, Trash2, Plus, Zap } from 'lucide-react';

interface ReminderSettingsViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  onUpgradeClick: (targetPlan: 'basic' | 'premium') => void;
}

export default function ReminderSettingsView({
  currentUser,
  onUpdateUser,
  onBack,
  onUpgradeClick,
}: ReminderSettingsViewProps) {
  // Read state from user
  const plan = currentUser.plan || 'free';
  const settings = currentUser.reminderSettings || {
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
    remindersSent: 0,
  };

  const [masterToggle, setMasterToggle] = useState(settings.masterWhatsAppReminders);
  const [dailySummary, setDailySummary] = useState(settings.dailySummaryEnabled);
  const [dailySummaryTime, setDailySummaryTime] = useState(settings.dailySummaryTime);
  const [classStart, setClassStart] = useState(settings.classStartReminderEnabled);
  const [classStartTime, setClassStartTime] = useState(settings.classStartReminderTime);
  const [attendanceNotMarked, setAttendanceNotMarked] = useState(settings.attendanceNotMarkedEnabled);
  const [streakRisk, setStreakRisk] = useState(settings.streakAtRiskEnabled);
  const [venueChange, setVenueChange] = useState(settings.venueChangeEnabled);

  // Custom reminder form state
  const [customMsg, setCustomMsg] = useState('');
  const [customCourse, setCustomCourse] = useState('SWE301');
  const [customDateTime, setCustomDateTime] = useState('');
  const [customRemindersList, setCustomRemindersList] = useState<CustomReminder[]>(settings.customReminders);

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper to save settings back to user
  const handleSaveSettings = (updates: Partial<typeof settings>) => {
    const updatedSettings = {
      ...settings,
      masterWhatsAppReminders: masterToggle,
      dailySummaryEnabled: dailySummary,
      dailySummaryTime,
      classStartReminderEnabled: classStart,
      classStartReminderTime: classStartTime,
      attendanceNotMarkedEnabled: attendanceNotMarked,
      streakAtRiskEnabled: streakRisk,
      venueChangeEnabled: venueChange,
      customReminders: customRemindersList,
      ...updates,
    };

    onUpdateUser({
      ...currentUser,
      reminderSettings: updatedSettings,
    });
  };

  // Handle toggles
  const toggleMaster = () => {
    const newValue = !masterToggle;
    setMasterToggle(newValue);
    handleSaveSettings({ masterWhatsAppReminders: newValue });
    triggerNotification(newValue ? 'Master WhatsApp reminders enabled!' : 'Master WhatsApp reminders paused.');
  };

  const toggleDailySummary = () => {
    if (plan === 'free') return;
    const newValue = !dailySummary;
    setDailySummary(newValue);
    handleSaveSettings({ dailySummaryEnabled: newValue });
    triggerNotification(newValue ? 'Daily academic summary enabled!' : 'Daily academic summary disabled.');
  };

  const handleTimeChange = (time: string) => {
    setDailySummaryTime(time);
    handleSaveSettings({ dailySummaryTime: time });
  };

  const toggleClassStart = () => {
    if (plan !== 'premium') return;
    const newValue = !classStart;
    setClassStart(newValue);
    handleSaveSettings({ classStartReminderEnabled: newValue });
  };

  const handleClassStartTimeChange = (mins: number) => {
    setClassStartTime(mins);
    handleSaveSettings({ classStartReminderTime: mins });
  };

  const toggleAttendanceNotMarked = () => {
    if (plan !== 'premium') return;
    const newValue = !attendanceNotMarked;
    setAttendanceNotMarked(newValue);
    handleSaveSettings({ attendanceNotMarkedEnabled: newValue });
  };

  const toggleStreakRisk = () => {
    if (plan !== 'premium') return;
    const newValue = !streakRisk;
    setStreakRisk(newValue);
    handleSaveSettings({ streakAtRiskEnabled: newValue });
  };

  const toggleVenueChange = () => {
    if (plan !== 'premium') return;
    const newValue = !venueChange;
    setVenueChange(newValue);
    handleSaveSettings({ venueChangeEnabled: newValue });
  };

  // Quick snooze actions for custom reminders
  const applyQuickTime = (type: '2mins' | 'tomorrow' | '3days') => {
    const now = new Date();
    let targetTime: Date;

    if (type === '2mins') {
      targetTime = new Date(now.getTime() + 2 * 60 * 1000);
    } else if (type === 'tomorrow') {
      targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else {
      targetTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    // Format to local ISO string YYYY-MM-DDTHH:MM
    const year = targetTime.getFullYear();
    const month = String(targetTime.getMonth() + 1).padStart(2, '0');
    const day = String(targetTime.getDate()).padStart(2, '0');
    const hours = String(targetTime.getHours()).padStart(2, '0');
    const minutes = String(targetTime.getMinutes()).padStart(2, '0');
    
    setCustomDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    triggerNotification(`Set time to ${type === '2mins' ? '2 minutes from now' : type === 'tomorrow' ? 'tomorrow' : '3 days from now'}`);
  };

  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan !== 'premium') return;
    if (!customMsg.trim() || !customDateTime) {
      triggerNotification('Please complete all custom reminder fields.');
      return;
    }

    // Check allowance
    if (settings.remindersSent >= settings.reminderAllowance) {
      triggerNotification('You have reached your monthly reminder allowance limit (100 reminders).');
      return;
    }

    const newRem: CustomReminder = {
      id: `rem_${Date.now()}`,
      message: customMsg.trim(),
      course: customCourse,
      dateTime: customDateTime,
    };

    const newList = [...customRemindersList, newRem];
    setCustomRemindersList(newList);
    setCustomMsg('');
    
    // Increment remindersSent as part of the demo allowance tracking
    const updatedSent = settings.remindersSent + 1;
    
    const updatedSettings = {
      ...settings,
      customReminders: newList,
      remindersSent: updatedSent,
    };

    onUpdateUser({
      ...currentUser,
      reminderSettings: updatedSettings,
    });

    triggerNotification('Custom reminder added successfully!');
  };

  const handleDeleteCustomReminder = (id: string) => {
    const newList = customRemindersList.filter((item) => item.id !== id);
    setCustomRemindersList(newList);
    
    const updatedSettings = {
      ...settings,
      customReminders: newList,
    };

    onUpdateUser({
      ...currentUser,
      reminderSettings: updatedSettings,
    });

    triggerNotification('Reminder removed.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-1 text-zinc-900 dark:text-zinc-100" id="reminder-settings-dashboard">
      
      {/* Header back button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 font-bold">
            Plan: {plan.toUpperCase()}
          </span>
          {plan !== 'free' && (
            <span className="text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 border border-emerald-200 dark:border-emerald-900/40 font-bold">
              WhatsApp Active
            </span>
          )}
        </div>
      </div>

      {/* Floating dynamic notification banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-zinc-950 text-white text-xs font-mono px-4 py-2.5 shadow-lg border border-zinc-800 animate-slide-in">
          {notification}
        </div>
      )}

      {/* Intro Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-sans font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
              WhatsApp Reminder Settings
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Configure automated notifications delivered straight to your WhatsApp account. Keep your academic timetable and venue changes updated on your active device.
            </p>
          </div>
        </div>

        {/* Saved reminder number note */}
        {currentUser.whatsappNumber ? (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-sans flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400 dark:text-zinc-500 block font-bold">Configured WhatsApp Number</span>
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {currentUser.whatsappNumber.slice(0, 5)}******{currentUser.whatsappNumber.slice(-4)}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block text-[9px] uppercase font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 font-bold">
                🔒 LOCKED Number
              </span>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5">Cannot be changed while plan is active.</p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-400 font-sans">
            ⚠️ No WhatsApp reminder number configured yet. Upgrade to Basic or Premium to assign your WhatsApp reminder delivery line.
          </div>
        )}
      </div>

      {/* 1. Master Toggle Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <h3 className="font-sans font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              Master WhatsApp Reminders Toggle
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              When disabled, all Thesdel automated WhatsApp notifications are paused globally.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              id="master-whatsapp-toggle"
              type="checkbox"
              checked={masterToggle}
              onChange={toggleMaster}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-600"></div>
          </label>
        </div>

        {!masterToggle && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-800 dark:text-red-400 text-xs font-sans">
            🚨 <strong>WhatsApp Deliveries Paused:</strong> You will not receive any notifications until this master switch is toggled ON.
          </div>
        )}
      </div>

      {/* 2. Basic Plan Controls: Daily Summary */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 relative overflow-hidden">
        {plan === 'free' && (
          <div className="absolute inset-0 bg-zinc-50/80 dark:bg-zinc-950/85 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Lock className="w-6 h-6 text-zinc-400" />
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Basic or Premium Plan Required</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-sm">
                Get a daily academic summary containing today's classes, relocated venues, and active deadlines on WhatsApp.
              </p>
            </div>
            <button
              onClick={() => onUpgradeClick('basic')}
              className="px-4 py-1.5 bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-200 font-mono text-[10px] uppercase font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              Upgrade to Basic • ₦500/mo
            </button>
          </div>
        )}

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            Daily Academic Summary (Basic & Premium)
          </h3>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">
            Basic Features
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
          <div className="space-y-1 max-w-lg">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Daily WhatsApp Academic Summary</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Includes today’s classes, exact venues, timetable changes, and outstanding task deadlines delivered in a structured WhatsApp brief.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-daily-summary"
                type="checkbox"
                disabled={plan === 'free'}
                checked={dailySummary}
                onChange={toggleDailySummary}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-650"></div>
            </label>
          </div>
        </div>

        {dailySummary && plan !== 'free' && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 text-xs font-mono">
            <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <label className="text-zinc-600 dark:text-zinc-400">Select summary delivery hour:</label>
            <input
              id="delivery-time-input"
              type="time"
              value={dailySummaryTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-800 dark:focus:border-zinc-650 outline-none text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-950 font-sans"
            />
          </div>
        )}
      </div>

      {/* 3. Premium Plan Controls: Reminders, Alerts & Custom reminders */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-6 relative overflow-hidden">
        {plan !== 'premium' && (
          <div className="absolute inset-0 bg-zinc-50/85 dark:bg-zinc-950/85 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Lock className="w-6 h-6 text-zinc-400" />
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">⭐ Premium Plan Required</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-sm">
                Unlock instant 15-minute class pings, attendance risk alerts, venue change push logs, and custom academic reminder snoozes.
              </p>
            </div>
            <button
              onClick={() => onUpgradeClick('premium')}
              className="px-5 py-2 bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-200 font-mono text-xs uppercase font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              Upgrade to Premium • ₦1,500/mo
            </button>
          </div>
        )}

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            Premium Reminder Controls & Alerts
          </h3>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-bold shrink-0">
            Premium Features
          </span>
        </div>

        {/* Allowance display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-sans">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">Monthly Reminder Allowance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-100">{100 - customRemindersList.length}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">/ 100 remaining</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              To keep systems clean, each student account has a capped allowance. Limit does not imply unlimited bulk spam.
            </p>
          </div>
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">Active Custom Reminders</span>
            <div className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {customRemindersList.length} set
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-4">
          
          {/* Toggle 1: Class starts */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
            <div className="space-y-0.5">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Class starting reminders</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Get notified before class starts so you never run late.</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {classStart && (
                <select
                  value={classStartTime}
                  onChange={(e) => handleClassStartTimeChange(Number(e.target.value))}
                  className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-mono rounded-none focus:outline-none"
                >
                  <option value={5}>5 mins before</option>
                  <option value={15}>15 mins before</option>
                  <option value={30}>30 mins before</option>
                </select>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={classStart}
                  onChange={toggleClassStart}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-600"></div>
              </label>
            </div>
          </div>

          {/* Toggle 2: Attendance not marked */}
          <div className="pt-4 flex items-center justify-between text-xs font-sans">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Attendance not marked alerts</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Alert when a completed class is missing an attendance verification log.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={attendanceNotMarked}
                onChange={toggleAttendanceNotMarked}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-650"></div>
            </label>
          </div>

          {/* Toggle 3: Streak risk */}
          <div className="pt-4 flex items-center justify-between text-xs font-sans">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Streak-at-risk warnings</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Urgent notice if skipping an upcoming lecture would break your attendance streak.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={streakRisk}
                onChange={toggleStreakRisk}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-650"></div>
            </label>
          </div>

          {/* Toggle 4: Venue shifts */}
          <div className="pt-4 flex items-center justify-between text-xs font-sans">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Relocation & Cancellation alerts</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Instant push notification when class representatives change venues or hours.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={venueChange}
                onChange={toggleVenueChange}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-650"></div>
            </label>
          </div>
        </div>

        {/* Custom Reminder Form */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className="space-y-1">
            <h4 className="font-mono text-xs uppercase font-bold text-zinc-855 dark:text-zinc-200">
              Set Personal Academic Reminders
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
              Create specific customized reminders (e.g. “Remind me to read PHY 201 in 3 days”) with custom dates and courses.
            </p>
          </div>

          <form onSubmit={handleAddCustomReminder} className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Course / Context</label>
              <select
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                className="w-full px-2.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 focus:outline-none font-bold"
              >
                <option value="SWE301">SWE301 (Software Eng)</option>
                <option value="PHY201">PHY201 (Physics)</option>
                <option value="COMP301">COMP301 (Architecture)</option>
                <option value="MTH302">MTH302 (Mathematics)</option>
                <option value="GENERAL">General Study</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Reminder Note / Message</label>
              <input
                type="text"
                required
                placeholder="e.g., Read PHY 201 lecture material"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-2.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-650 font-medium"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Trigger Date & Time</label>
              <input
                type="datetime-local"
                required
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="w-full px-2.5 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 font-mono"
              />
            </div>

            {/* Quick Snooze Actions */}
            <div className="flex flex-col justify-end">
              <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block mb-1">Quick Snooze presets:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyQuickTime('2mins')}
                  className="px-2 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-600 dark:hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 font-mono transition-colors"
                >
                  2 mins
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTime('tomorrow')}
                  className="px-2 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-600 dark:hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 font-mono transition-colors"
                >
                  1 Day
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTime('3days')}
                  className="px-2 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-600 dark:hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 font-mono transition-colors"
                >
                  3 Days
                </button>
              </div>
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-zinc-950 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Academic Reminder
              </button>
            </div>
          </form>
        </div>

        {/* List of custom reminders */}
        {customRemindersList.length > 0 && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">Active Personal Reminders:</span>
            <div className="space-y-2">
              {customRemindersList.map((rem) => {
                const triggerDate = new Date(rem.dateTime);
                return (
                  <div key={rem.id} className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5">
                          {rem.course}
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{rem.message}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Will notify at: {triggerDate.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCustomReminder(rem.id)}
                      className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-405 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
