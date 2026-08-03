import React from 'react';
import { AdminUser } from '../types';
import { LayoutDashboard, CreditCard, Users2, ShieldAlert, FileCode2, LogOut, Terminal, User, Megaphone, Fingerprint } from 'lucide-react';

interface AdminLayoutProps {
  currentAdmin: AdminUser | null;
  activePage: 'dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs' | 'ads' | 'clickstream';
  onPageChange: (page: 'dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs' | 'ads' | 'clickstream') => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  currentAdmin,
  activePage,
  onPageChange,
  onLogout,
  children,
}: AdminLayoutProps) {
  if (!currentAdmin) return <>{children}</>;

  const isInvestor = currentAdmin.role === 'investor';
  const isSuperAdmin = currentAdmin.email === 'philipjonathanpeter24@gmail.com';
  const allowedPages = currentAdmin.allowedPages || ['dashboard', 'revenue', 'users', 'investors', 'audit_logs', 'ads', 'clickstream'];

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard, visible: isSuperAdmin || allowedPages.includes('dashboard') },
    { id: 'clickstream', label: 'Clickstream Matrix', icon: Fingerprint, visible: isSuperAdmin || allowedPages.includes('clickstream') },
    { id: 'revenue', label: 'Revenue Ledger', icon: CreditCard, visible: isSuperAdmin || allowedPages.includes('revenue') },
    { id: 'users', label: 'User Registry', icon: Users2, visible: !isInvestor && (isSuperAdmin || allowedPages.includes('users')) }, // STRICTLY hide users table from investors
    { id: 'ads', label: 'Ads Manager', icon: Megaphone, visible: !isInvestor && (isSuperAdmin || currentAdmin.allowAds || allowedPages.includes('ads')) },
    { id: 'investors', label: 'Investor Portal', icon: ShieldAlert, visible: isSuperAdmin || allowedPages.includes('investors') },
    { id: 'audit_logs', label: 'Audit Records', icon: Terminal, visible: !isInvestor && (isSuperAdmin || allowedPages.includes('audit_logs')) }, // STRICTLY hide raw logs from investors
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row" id="thesdel-admin-layout">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 text-white border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        {/* Title branding */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white text-zinc-950 font-bold font-mono text-sm flex items-center justify-center rounded">
              T
            </div>
            <div>
              <h1 className="text-xs font-mono font-bold tracking-widest uppercase">Thesdel Admin</h1>
              <p className="text-[9px] text-zinc-500 font-mono">Workspace Console</p>
            </div>
          </div>
        </div>

        {/* Current Operator card */}
        <div className="p-4 border-b border-zinc-900 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate flex items-center gap-1">
                {currentAdmin.name}
                {isSuperAdmin && (
                  <span className="inline-flex items-center justify-center bg-white text-zinc-950 rounded-full p-0.5 select-none shrink-0" title="Verified Super Admin">
                    <svg className="w-2 h-2 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                  currentAdmin.role === 'admin'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {currentAdmin.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {/* Section 1: Live Stream & Click Matrix */}
          <div className="space-y-1">
            <h4 className="px-3 text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-2">
              Live Stream & Click Matrix
            </h4>
            {navItems
              .filter((item) => item.visible && ['dashboard', 'clickstream', 'revenue'].includes(item.id))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all rounded cursor-pointer text-left ${
                      isActive
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>

          {/* Section 2: Management Console */}
          <div className="space-y-1 pt-2 border-t border-zinc-900/45">
            <h4 className="px-3 text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-2">
              Management Console
            </h4>
            {navItems
              .filter((item) => item.visible && !['dashboard', 'clickstream', 'revenue'].includes(item.id))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all rounded cursor-pointer text-left ${
                      isActive
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-zinc-900 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-red-950/20 rounded transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            <span>Sign out session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top workspace bar */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 uppercase tracking-wider font-bold">
              Secure Session
            </span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
              Operator: {currentAdmin.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-2 py-1 flex items-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Student Interface</span>
            </a>
          </div>
        </header>

        {/* Dynamic page container */}
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
