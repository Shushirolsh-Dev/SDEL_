import { useState, useEffect } from 'react';
import { AdminService } from '../services/adminService';
import { supabase } from '../../src/lib/supabase';
import { 
  AdminUser, 
  AdminAuditLog, 
  InvestorInvitation, 
  RevenueStats, 
  AnalyticsSummary, 
  ManagedUserProfile 
} from '../types';

export function useAdmin() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const loggedInStr = localStorage.getItem('thesdel_logged_in');
      const isLoggedIn = loggedInStr ? JSON.parse(loggedInStr) : false;
      if (!isLoggedIn) return null;

      const userCachedStr = localStorage.getItem('thesdel_cache_user');
      const cachedUser = userCachedStr ? JSON.parse(userCachedStr) : null;
      if (cachedUser && (cachedUser.role === 'admin' || cachedUser.role === 'investor')) {
        return {
          id: cachedUser.id,
          name: cachedUser.name,
          email: cachedUser.email,
          role: cachedUser.role as 'admin' | 'investor',
          allowedPages: cachedUser.allowedPages,
          adminLevel: cachedUser.adminLevel || (cachedUser.email === 'philipjonathanpeter24@gmail.com' ? 'super_admin' : 'junior_admin'),
          canCreateAdmins: cachedUser.canCreateAdmins ?? (cachedUser.email === 'philipjonathanpeter24@gmail.com' || cachedUser.adminLevel === 'junior_admin'),
          investorExpiresAt: cachedUser.investorExpiresAt,
        };
      }
    } catch (e) {
      console.error('Error initializing currentAdmin:', e);
    }
    return null;
  });

  const [activePage, setActivePage] = useState<'dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs' | 'ads' | 'clickstream'>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Stats States
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  
  // User Management
  const [users, setUsers] = useState<ManagedUserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersPage, setUsersPage] = useState<number>(1);
  const [userFilters, setUserFilters] = useState({ search: '', status: '', role: '', plan: '' });
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({
    admin: 0,
    assistant: 0,
    representative: 0,
    member: 0,
    investor: 0,
  });

  // Invitations
  const [invitations, setInvitations] = useState<InvestorInvitation[]>([]);
  
  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [logsPage, setLogsPage] = useState<number>(1);
  const [totalLogs, setTotalLogs] = useState<number>(0);

  // Time filters
  const [dateFilter, setDateFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // Active Classes list for Broadcast Channel
  const [activeClasses, setActiveClasses] = useState<{ id: string; name: string; code: string }[]>([]);

  // Trigger login (sync with main session as fallback)
  const handleAdminLogin = async (email: string, role: 'admin' | 'investor'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const userSession: AdminUser = {
        id: role === 'admin' ? 'user_1' : 'user_5',
        name: role === 'admin' ? 'Philip Jonathan' : 'Efe Omowole',
        email,
        role,
      };

      setCurrentAdmin(userSession);
      localStorage.setItem('thesdel_logged_in', 'true');
      localStorage.setItem('thesdel_cache_user', JSON.stringify({
        id: userSession.id,
        name: userSession.name,
        email: userSession.email,
        role: userSession.role,
        phone: role === 'admin' ? '+2348100240137' : '+2348123456789',
        plan: 'premium',
      }));

      if (role === 'admin') {
        await AdminService.logAdminAction(userSession.id, email, 'login', undefined, {
          timestamp: new Date().toISOString()
        });
      }

      return true;
    } catch (e: any) {
      setError(e.message || 'Login failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    if (currentAdmin) {
      AdminService.logAdminAction(currentAdmin.id, currentAdmin.email, 'login', undefined, {
        status: 'logged_out'
      }).catch(console.error);
    }
    
    // Clear Admin state
    setCurrentAdmin(null);
    
    // Clear all browser session variables
    localStorage.clear();
    sessionStorage.clear();
    
    // Fire Supabase signout async (no need to block redirect)
    supabase.auth.signOut().catch(console.error);
    
    // Clean URL parameters / hashes & force reload redirect to landing view
    window.location.href = window.location.origin + '/';
  };

  // Load Data based on active page
  const loadActivePageData = async () => {
    if (!currentAdmin) return;
    setLoading(true);
    setError(null);
    try {
      if (activePage === 'dashboard' || activePage === 'ads' || activePage === 'clickstream') {
        if (activePage === 'dashboard' || activePage === 'clickstream') {
          const sum = await AdminService.getAnalyticsSummary(currentAdmin.role);
          setAnalytics(sum);
        }
        try {
          const { data } = await supabase.from('classes').select('id, name, code').order('name');
          if (data) {
            setActiveClasses(data.map(d => ({ id: d.id, name: d.name, code: d.code })));
          }
        } catch (err) {
          console.warn('[useAdmin] Failed to load classes:', err);
        }
      } else if (activePage === 'revenue') {
        const rev = await AdminService.getRevenueStats(currentAdmin.role);
        setRevenue(rev);
      } else if (activePage === 'users') {
        const res = await AdminService.getManagedUsers(userFilters, usersPage, 8);
        setUsers(res.data);
        setTotalUsers(res.total);
        const counts = await AdminService.getRoleCounts();
        setRoleCounts(counts);
      } else if (activePage === 'investors') {
        // Fetch investor info and general analytics
        const sum = await AdminService.getAnalyticsSummary(currentAdmin.role);
        const invs = await AdminService.getInvestorInvitations();
        setAnalytics(sum);
        setInvitations(invs);
      } else if (activePage === 'audit_logs') {
        const res = await AdminService.getAuditLogs(logsPage, 10);
        setAuditLogs(res.data);
        setTotalLogs(res.total);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivePageData();
  }, [currentAdmin, activePage, usersPage, logsPage, userFilters]);

  // Actions
  const handleModerateUser = async (userId: string, status: ManagedUserProfile['status'], reason?: string, expiryDate?: string) => {
    if (!currentAdmin || currentAdmin.role !== 'admin') return false;
    setLoading(true);
    try {
      const ok = await AdminService.updateProfileStatus(currentAdmin.id, currentAdmin.email, userId, status, reason, expiryDate);
      if (ok) {
        await loadActivePageData();
        return true;
      }
      return false;
    } catch (e: any) {
      setError(e.message || 'Moderation action failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleInviteInvestor = async (email: string) => {
    if (!currentAdmin || currentAdmin.role !== 'admin') return false;
    setLoading(true);
    try {
      await AdminService.inviteInvestor(currentAdmin.id, currentAdmin.email, email);
      await loadActivePageData();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to send investor invitation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdminOrInvestor = async (payload: { 
    name: string; 
    email: string; 
    password?: string; 
    role: 'admin' | 'investor'; 
    phone?: string; 
    allowedPages?: ('dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs')[];
    adminLevel?: 'super_admin' | 'junior_admin' | 'minor_admin';
    canCreateAdmins?: boolean;
    investorExpiresAt?: string;
  }) => {
    if (!currentAdmin || currentAdmin.role !== 'admin') return false;
    setLoading(true);
    setError(null);
    try {
      await AdminService.createAdminOrInvestorAccount(currentAdmin.id, currentAdmin.email, payload);
      await loadActivePageData();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to create account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePostBroadcast = async (
    classId: string,
    type: 'venue_change' | 'cancellation' | 'entry_added',
    description: string
  ): Promise<boolean> => {
    if (!currentAdmin) return false;
    setLoading(true);
    setError(null);
    try {
      let targetClassIds = [classId];
      if (classId === 'global') {
        targetClassIds = activeClasses.map(c => c.id);
      }
      
      const insertRows = targetClassIds.map(cId => ({
        class_id: cId,
        user_id: currentAdmin.id,
        user_name: `System Admin (${currentAdmin.name})`,
        type,
        description,
        timestamp: new Date().toISOString()
      }));

      const { error: insErr } = await supabase.from('updates').insert(insertRows);
      if (insErr) throw insErr;

      // Log action
      await AdminService.logAdminAction(currentAdmin.id, currentAdmin.email, 'permission_change', undefined, {
        action: 'system_broadcast',
        classId,
        type,
        snippet: description.substring(0, 100)
      });

      await loadActivePageData();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to publish system broadcast.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
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
    handleAdminLogin,
    handleAdminLogout,
    handleModerateUser,
    handleInviteInvestor,
    handleCreateAdminOrInvestor,
    handlePostBroadcast,
    refreshData: loadActivePageData
  };
}
