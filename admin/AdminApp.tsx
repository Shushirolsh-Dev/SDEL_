import React from 'react';
import { useAdmin } from './hooks/useAdmin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Revenue from './pages/Revenue';
import Users from './pages/Users';
import Investors from './pages/Investors';
import AuditLogs from './pages/AuditLogs';
import Ads from './pages/Ads';
import ClickstreamMatrix from './pages/ClickstreamMatrix';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AdminApp() {
  const {
    currentAdmin,
    activePage,
    setActivePage,
    loading,
    error,
    analytics,
    revenue,
    users,
    totalUsers,
    roleCounts,
    usersPage,
    setUsersPage,
    userFilters,
    setUserFilters,
    invitations,
    auditLogs,
    logsPage,
    setLogsPage,
    totalLogs,
    dateFilter,
    setDateFilter,
    activeClasses,
    handleAdminLogout,
    handleModerateUser,
    handleInviteInvestor,
    handleCreateAdminOrInvestor,
    handlePostBroadcast,
    refreshData,
  } = useAdmin();

  // If not authenticated, render restricted access screen (no separate login page as requested)
  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto rounded-full">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-white">Admin Console Access Denied</h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              This panel is strictly restricted. No separate administrator login exists. You must sign in through the primary login screen using an authorized Admin or Investor credential.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.hash = '';
              window.location.pathname = '/';
            }}
            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-zinc-900"
          >
            <LogIn className="w-4 h-4" /> Go to Login Screen
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate child page based on selection state
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            analytics={analytics}
            loading={loading}
            error={error}
            onRefresh={refreshData}
            isAdmin={currentAdmin.role === 'admin'}
            activeClasses={activeClasses}
            onPostBroadcast={handlePostBroadcast}
          />
        );
      case 'clickstream':
        return (
          <ClickstreamMatrix
            analytics={analytics}
            loading={loading}
            onRefresh={refreshData}
          />
        );
      case 'revenue':
        return (
          <Revenue
            revenue={revenue}
            loading={loading}
            error={error}
            onRefresh={refreshData}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        );
      case 'users':
        return (
          <Users
            currentAdmin={currentAdmin}
            users={users}
            totalUsers={totalUsers}
            roleCounts={roleCounts}
            currentPage={usersPage}
            onPageChange={setUsersPage}
            filters={userFilters}
            onFiltersChange={setUserFilters}
            onModerateUser={handleModerateUser}
            onCreateUser={handleCreateAdminOrInvestor}
            loading={loading}
          />
        );
      case 'investors':
        return (
          <Investors
            currentAdmin={currentAdmin}
            invitations={invitations}
            onInvite={handleInviteInvestor}
            loading={loading}
            analytics={analytics}
            isAdmin={currentAdmin.role === 'admin'}
          />
        );
      case 'audit_logs':
        return (
          <AuditLogs
            logs={auditLogs}
            totalLogs={totalLogs}
            currentPage={logsPage}
            onPageChange={setLogsPage}
            loading={loading}
          />
        );
      case 'ads':
        return (
          <Ads
            loading={loading}
            activeClasses={activeClasses}
            onPostAd={(classId, adPayload) => handlePostBroadcast(classId, 'entry_added', adPayload)}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-zinc-400 font-mono text-xs">
            Module view parameter mismatch.
          </div>
        );
    }
  };

  return (
    <AdminLayout
      currentAdmin={currentAdmin}
      activePage={activePage}
      onPageChange={setActivePage}
      onLogout={handleAdminLogout}
    >
      {renderPageContent()}
    </AdminLayout>
  );
}
