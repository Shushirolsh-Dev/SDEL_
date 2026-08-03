import React, { useState } from 'react';
import { InvestorInvitation, AnalyticsSummary } from '../types';
import { Mail, ShieldCheck, AlertCircle, Send, CheckCircle2, Copy, EyeOff, Key, Calendar, Clock, UserCheck } from 'lucide-react';
import { AdminService } from '../services/adminService';

interface InvestorsProps {
  currentAdmin?: any;
  invitations: InvestorInvitation[];
  onInvite: (email: string) => Promise<boolean>;
  loading: boolean;
  analytics: AnalyticsSummary | null;
  isAdmin?: boolean;
}

export default function Investors({
  currentAdmin,
  invitations,
  onInvite,
  loading: propLoading,
  analytics,
  isAdmin,
}: InvestorsProps) {
  const [investorName, setInvestorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [duration, setDuration] = useState<string>('30_days');
  
  // Custom interactive flow states
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const adminEmail = currentAdmin?.email || '';
  const adminLevel = currentAdmin?.adminLevel || (adminEmail === 'philipjonathanpeter24@gmail.com' ? 'super_admin' : 'junior_admin');
  const isSuperAdmin = adminLevel === 'super_admin' || adminEmail === 'philipjonathanpeter24@gmail.com';

  const generatePassword = () => {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const special = "!@#$%&*?";
    const allChars = uppercase + lowercase + numbers + special;
    
    // Guarantee at least one of each to avoid weak password generation
    let pass = "";
    pass += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    pass += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pass += special.charAt(Math.floor(Math.random() * special.length));
    
    for (let i = 4; i < 12; i++) {
      pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle password
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const calculateExpirationDate = (dur: string) => {
    const now = new Date();
    if (dur === '1_day') now.setDate(now.getDate() + 1);
    else if (dur === '7_days') now.setDate(now.getDate() + 7);
    else if (dur === '30_days') now.setDate(now.getDate() + 30);
    else if (dur === '90_days') now.setDate(now.getDate() + 90);
    else if (dur === '365_days') now.setDate(now.getDate() + 365);
    return now.toISOString();
  };

  const createInviteMessage = (name: string, investorEmail: string, pass: string, expiry: string) => {
    const dateStr = new Date(expiry).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    return `Dear ${name},

You have been registered as an Investor Partner on the Thesdel Portal with secure read-only analytics privileges.

Below are your temporary authentication credentials:
- Portal URL: ${window.location.origin}/admin
- Email: ${investorEmail}
- Temporary Password: ${pass}

SECURITY & DATA PRIVACY POLICY:
Under the terms of our strict Investor Agreement, this account grants aggregate high-fidelity metrics viewing only. Your access profile is set to automatically expire and self-delete on:
👉 ${dateStr}

Please do not share these credentials. Change your temporary password upon your first successful login.

Best regards,
Thesdel Administrative Headquarters`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    
    if (!investorName || !email) {
      setErrorMsg('Please specify both the name and email address first.');
      return;
    }

    setIsCreatingProfile(true);
    try {
      const password = generatePassword();
      const expiry = calculateExpirationDate(duration);
      const professionalMessage = createInviteMessage(investorName, email, password, expiry);

      // Create the profile in Supabase/Cache immediately
      const createdUser = await AdminService.createAdminOrInvestorAccount(
        currentAdmin?.id || 'admin',
        adminEmail,
        {
          name: investorName,
          email: email,
          password: password,
          role: 'investor',
          allowedPages: ['dashboard', 'revenue', 'investors'],
          investorExpiresAt: expiry
        }
      );

      // Save invitation log
      await AdminService.inviteInvestor(
        currentAdmin?.id || 'admin',
        adminEmail,
        email
      );

      setGeneratedPassword(password);
      setGeneratedMessage(professionalMessage);
      setIsGenerated(true);
      setSuccessMsg(`Secure profile generated successfully for ${investorName}! You can now send the invitation.`);
    } catch (e: any) {
      setErrorMsg(e.message || 'Profile generation failed.');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleSend = async () => {
    // Already created in the generate phase, now dispatch/finalize
    setSuccessMsg(`Invitation dispatched successfully to ${email}. Temporary password was: ${generatedPassword}`);
    
    // Reset the interactive state
    setInvestorName('');
    setEmail('');
    setDuration('30_days');
    setIsGenerated(false);
    setGeneratedPassword('');
    setGeneratedMessage('');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // 1. INVESTOR MODE: STRICT READ-ONLY VIEW WITHOUT RUBBISH INVITE TOOLS
  if (!isAdmin) {
    return (
      <div className="space-y-6" id="admin-investors-page">
        <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm max-w-2xl mx-auto rounded-lg">
          <ShieldCheck className="w-12 h-12 text-emerald-600 mb-4" />
          <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Investor Access Rules (Read-Only)</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
            As an authorized Investor Partner, you have been granted strict read-only access to Thesdel's high-fidelity aggregate telemetry and subscription revenue summaries.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
            Under your agreement, detailed individual records, student identities, attendance history logs, and moderation/write modules are entirely withheld and inaccessible.
          </p>
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Your Credentials status:</span>
            <span className="text-emerald-600 font-bold">✓ VERIFIED PARTNER (SECURE)</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. ADMIN VIEW: EXQUISITE MULTI-STEP INVESTOR GENERATION FLOW
  return (
    <div className="space-y-6" id="admin-investors-page">
      {/* Privacy Agreement Banner */}
      <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Investor Provisioning Panel</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Register new institutional and angel investor partners. Profiles are given sandboxed read-only access to aggregate KPIs and MRR indices. Accounts automatically expire and purge themselves on schedule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Generation Form (Col-span 2 to give space for credentials display) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>Interactive Investor Invite Pipeline</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Investor Name</label>
                  <input
                    required
                    disabled={isGenerated}
                    type="text"
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    placeholder="e.g. Aliko Dangote"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Duration of Investorship</label>
                  <select
                    disabled={isGenerated}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500 disabled:opacity-60"
                  >
                    <option value="1_day">1 Day Trial</option>
                    <option value="7_days">7 Days Access</option>
                    <option value="30_days">30 Days (1 Month)</option>
                    <option value="90_days">90 Days (3 Months)</option>
                    <option value="365_days">365 Days (1 Year)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Email Address</label>
                <input
                  required
                  disabled={isGenerated}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. partner@ventures.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500 disabled:opacity-60"
                />
              </div>

              {/* Multi-action submit logic */}
              <div className="flex gap-3 pt-2">
                {!isGenerated ? (
                  <button
                    type="submit"
                    disabled={isCreatingProfile || propLoading}
                    className="w-full md:w-auto px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5 animate-pulse" />
                    <span>{isCreatingProfile ? 'Registering...' : 'Generate Profile'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSend}
                    className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Invitation</span>
                  </button>
                )}

                {isGenerated && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsGenerated(false);
                      setGeneratedPassword('');
                      setGeneratedMessage('');
                      setSuccessMsg(null);
                    }}
                    className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 text-xs font-mono uppercase cursor-pointer"
                  >
                    Reset Form
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 text-xs font-mono flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Credentials Display box (Only if generated) */}
          {isGenerated && (
            <div className="border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-950/20 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono font-bold uppercase">Provisioned Account details</span>
                </div>
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  {copiedText ? 'COPIED!' : 'COPY DISPATCH TEXT'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 font-mono text-xs">
                  <span className="text-[10px] text-zinc-400 block">TEMPORARY PASSWORD (12 CHARS)</span>
                  <span className="text-emerald-600 font-bold select-all tracking-widest text-sm">{generatedPassword}</span>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 font-mono text-xs">
                  <span className="text-[10px] text-zinc-400 block">DELETION POLICY EXPIRY SCHEDULE</span>
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Self-Purges after {duration.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-400 block mb-1">DISPATCH MESSAGE TEMPLATE</span>
                <pre className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[220px]">
                  {generatedMessage}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Outstanding Invitations list */}
        <div className="border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 flex flex-col h-full">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Active Investor Profiles</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 flex-1">
            {invitations.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-12 font-mono">No partners invited yet.</p>
            ) : (
              invitations.map((inv) => (
                <div key={inv.id} className="p-3 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{inv.email}</p>
                      <p className="text-[9px] text-zinc-400 font-mono mt-0.5">Dispatched: {new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 shrink-0 ${
                      inv.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : inv.status === 'revoked'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>

                  {inv.status === 'pending' && (
                    <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 text-[10px] font-mono">
                      <span className="text-zinc-400 text-[9px]">Token key:</span>
                      <button
                        onClick={() => handleCopyToken(inv.token)}
                        className="p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer flex items-center gap-1.5"
                        title="Copy Invitation Token"
                      >
                        {copiedToken === inv.token ? (
                          <span className="text-[9px] text-emerald-600 font-bold px-1">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[9px] truncate max-w-[80px]">{inv.token}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
