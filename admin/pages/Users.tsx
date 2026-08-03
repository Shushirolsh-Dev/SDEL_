import React, { useState } from 'react';
import { ManagedUserProfile } from '../types';
import { Search, Ban, Shield, ShieldAlert, CheckCircle2, RotateCcw, ShieldCheck, AlertCircle, Calendar, UserPlus, Trash2, ArrowUp, ArrowDown, Key, Download } from 'lucide-react';
import { AdminService } from '../services/adminService';

interface UsersProps {
  currentAdmin?: any;
  users: ManagedUserProfile[];
  totalUsers: number;
  roleCounts?: Record<string, number>;
  currentPage: number;
  onPageChange: (page: number) => void;
  filters: { search: string; status: string; role: string; plan: string };
  onFiltersChange: (filters: { search: string; status: string; role: string; plan: string }) => void;
  onModerateUser: (userId: string, status: ManagedUserProfile['status'], reason?: string, expiryDate?: string) => Promise<boolean>;
  onCreateUser: (payload: { 
    name: string; 
    email: string; 
    password?: string; 
    role: 'admin' | 'investor'; 
    phone?: string; 
    allowedPages?: ('dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs')[];
    adminLevel?: 'super_admin' | 'junior_admin' | 'minor_admin';
    canCreateAdmins?: boolean;
    allowAds?: boolean;
    investorExpiresAt?: string;
  }) => Promise<boolean>;
  loading: boolean;
}

export default function Users({
  currentAdmin,
  users,
  totalUsers,
  roleCounts,
  currentPage,
  onPageChange,
  filters,
  onFiltersChange,
  onModerateUser,
  onCreateUser,
  loading,
}: UsersProps) {
  // Current admin roles
  const adminEmail = currentAdmin?.email || '';
  const adminLevel = currentAdmin?.adminLevel || (adminEmail === 'philipjonathanpeter24@gmail.com' ? 'super_admin' : 'junior_admin');
  const isSuperAdmin = adminLevel === 'super_admin' || adminEmail === 'philipjonathanpeter24@gmail.com';
  const canCreate = isSuperAdmin || currentAdmin?.canCreateAdmins === true;

  const [selectedUser, setSelectedUser] = useState<ManagedUserProfile | null>(null);
  const [modStatus, setModStatus] = useState<ManagedUserProfile['status']>('suspended');
  const [modReason, setModReason] = useState<string>('');
  const [modExpiry, setModExpiry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Promoting / Demoting States (Super Admin Only)
  const [targetAdminLevel, setTargetAdminLevel] = useState<'super_admin' | 'junior_admin' | 'minor_admin'>('minor_admin');
  const [targetCanCreate, setTargetCanCreate] = useState<boolean>(false);
  const [isUpdatingHierarchy, setIsUpdatingHierarchy] = useState<boolean>(false);

  // User Creation States
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [createName, setCreateName] = useState<string>('');
  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [createRole, setCreateRole] = useState<'admin' | 'investor'>('admin');
  const [createAdminLevel, setCreateAdminLevel] = useState<'super_admin' | 'junior_admin' | 'minor_admin'>('minor_admin');
  const [createCanCreateAdmins, setCreateCanCreateAdmins] = useState<boolean>(false);
  const [createAllowAds, setCreateAllowAds] = useState<boolean>(false);
  const [createPhone, setCreatePhone] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createAllowedPages, setCreateAllowedPages] = useState<('dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs')[]>([
    'dashboard',
    'revenue',
    'users',
    'investors',
    'audit_logs',
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
    onPageChange(1);
  };

  const handleFilterChange = (key: 'status' | 'role' | 'plan', val: string) => {
    onFiltersChange({ ...filters, [key]: val });
    onPageChange(1);
  };

  const handleCSVExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'WhatsApp', 'Role', 'Plan', 'Status', 'CreatedAt'];
    const rows = users.map(u => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.email,
      u.phone || '',
      u.whatsappNumber || '',
      u.role,
      u.plan,
      u.status,
      u.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `thesdel_user_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if current logged-in admin has permissions to moderate target user
  const checkCanModerate = (target: ManagedUserProfile): boolean => {
    if (!currentAdmin) return false;
    // Super Admin can moderate absolutely anyone (except themselves)
    if (isSuperAdmin) {
      return target.id !== currentAdmin.id;
    }

    const targetLevel = target.adminLevel || 'minor_admin';

    // Junior Admin can moderate:
    // - Normal students (role !== admin & role !== investor)
    // - Minor Admins (role === admin & admin_level === minor_admin)
    if (adminLevel === 'junior_admin') {
      if (target.role === 'admin') {
        return targetLevel === 'minor_admin';
      }
      if (target.role === 'investor') {
        return true; // Junior can manage investors
      }
      return true; // Junior can manage all normal students
    }

    // Minor Admin can ONLY moderate students (cannot moderate any admin or investor)
    if (adminLevel === 'minor_admin') {
      return target.role !== 'admin' && target.role !== 'investor';
    }

    return false;
  };

  // Check if current logged-in admin can specifically delete target user
  const checkCanDelete = (target: ManagedUserProfile): boolean => {
    if (!currentAdmin) return false;
    if (target.id === currentAdmin.id) return false; // cannot delete self

    if (isSuperAdmin) return true; // Super Admin can delete anyone

    // "and the junior admin can delete account for minor admin"
    if (adminLevel === 'junior_admin') {
      const targetLevel = target.adminLevel || 'minor_admin';
      return target.role === 'admin' && targetLevel === 'minor_admin';
    }

    return false;
  };

  const handleOpenModeration = (user: ManagedUserProfile) => {
    setSelectedUser(user);
    setModStatus(user.status === 'suspended' || user.status === 'banned' ? 'active' : 'suspended');
    setModReason('');
    setModExpiry('');
    setTargetAdminLevel(user.adminLevel || 'minor_admin');
    setTargetCanCreate(!!user.canCreateAdmins);
  };

  const handleSubmitModeration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const ok = await onModerateUser(
        selectedUser.id,
        modStatus,
        modStatus === 'active' ? undefined : modReason,
        modStatus === 'suspended' && modExpiry ? modExpiry : undefined
      );
      if (ok) {
        setSelectedUser(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Promoting / Demoting Handler (Super Admin Only)
  const handleUpdateHierarchy = async () => {
    if (!selectedUser || !isSuperAdmin) return;
    setIsUpdatingHierarchy(true);
    try {
      const ok = await AdminService.updateAdminLevel(
        currentAdmin.id,
        adminEmail,
        selectedUser.id,
        targetAdminLevel,
        targetCanCreate
      );
      if (ok) {
        // Update local object immediately to reflect in table
        selectedUser.adminLevel = targetAdminLevel;
        selectedUser.canCreateAdmins = targetCanCreate;
        setSelectedUser(null);
        // Soft refresh
        onPageChange(currentPage);
      }
    } catch (e) {
      console.error('Failed to change level:', e);
    } finally {
      setIsUpdatingHierarchy(false);
    }
  };

  // Delete account action
  const handleDeleteAccount = async () => {
    if (!selectedUser) return;
    const isAllowed = checkCanDelete(selectedUser);
    if (!isAllowed) return;

    if (!window.confirm(`Are you absolutely sure you want to delete the account for ${selectedUser.name}? This action is permanent and logs administrative audit metadata.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await AdminService.deleteUserAccount(
        currentAdmin.id,
        adminEmail,
        selectedUser.id
      );
      if (ok) {
        setSelectedUser(null);
        // Refresh
        onPageChange(currentPage);
      }
    } catch (e) {
      console.error('Failed to delete account:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateName('');
    setCreateEmail('');
    setCreatePassword('');
    setCreateRole('admin');
    setCreateAdminLevel('minor_admin');
    setCreateCanCreateAdmins(false);
    setCreateAllowAds(false);
    setCreatePhone('');
    setCreateAllowedPages(['dashboard', 'revenue', 'users', 'investors', 'audit_logs']);
    setCreateError(null);
    setIsOpenCreateModal(true);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createEmail.trim()) {
      setCreateError('Name and Email are required.');
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      const payload = {
        name: createName,
        email: createEmail,
        password: createPassword || undefined,
        role: createRole,
        phone: createPhone || undefined,
        allowedPages: createAllowedPages,
        // Only provide these if role is admin
        adminLevel: createRole === 'admin' ? createAdminLevel : undefined,
        canCreateAdmins: createRole === 'admin' ? createCanCreateAdmins : undefined,
        allowAds: createRole === 'admin' ? createAllowAds : undefined,
      };

      const ok = await onCreateUser(payload);
      if (ok) {
        setIsOpenCreateModal(false);
      } else {
        setCreateError('Failed to create account. Please ensure the email is unique.');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Error occurred during account creation.');
    } finally {
      setIsCreating(false);
    }
  };

  const statusPills: Record<ManagedUserProfile['status'], React.ReactNode> = {
    active: (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 rounded-full">
        <ShieldCheck className="w-3 h-3" /> ACTIVE
      </span>
    ),
    suspended: (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 rounded-full">
        <AlertCircle className="w-3 h-3" /> SUSPENDED
      </span>
    ),
    banned: (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-full">
        <Ban className="w-3 h-3" /> BANNED
      </span>
    ),
    deleted: (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-full">
        <Trash2 className="w-3 h-3" /> DELETED
      </span>
    ),
  };

  return (
    <div className="space-y-6" id="admin-users-page">
      {/* Page Header with Creator Verification Check */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-mono font-bold tracking-widest uppercase">User Registry</h2>
          <p className="text-[10px] text-zinc-500 font-mono">
            Logged in as: <span className="text-zinc-800 dark:text-white font-bold uppercase">{adminLevel.replace('_', ' ')}</span> 
            {currentAdmin?.canCreateAdmins && ' (with Creator Privileges)'}
          </p>
        </div>
        
        {/* Hide create button entirely if current admin doesn't have creation rights */}
        {canCreate && (
          <button
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-mono text-xs font-bold px-4 py-2 border border-zinc-900 dark:border-zinc-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Admin/Investor</span>
          </button>
        )}
      </div>

      {/* Role Counts Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" id="role-counts-summary-grid">
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[7.5rem]">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate" title="Total Admins">Total Admins</p>
            <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{roleCounts?.admin || 0}</p>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5 mt-2">Platform Managers</div>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[7.5rem]">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate" title="Total Assistants">Total Assistants</p>
            <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{roleCounts?.assistant || 0}</p>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5 mt-2">Class Assistants</div>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[7.5rem]">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate" title="Representatives">Representatives</p>
            <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{roleCounts?.representative || 0}</p>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5 mt-2">Class Creators</div>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[7.5rem]">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate" title="Students & Members">Students/Members</p>
            <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{roleCounts?.member || 0}</p>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5 mt-2">Active Learners</div>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[7.5rem]">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider truncate" title="Total Investors">Total Investors</p>
            <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{roleCounts?.investor || 0}</p>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5 mt-2">Partners & Board</div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name, email, or id..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none"
            >
              <option value="">ALL STATUSES</option>
              <option value="active">ACTIVE</option>
              <option value="suspended">SUSPENDED</option>
              <option value="banned">BANNED</option>
              <option value="deleted">DELETED</option>
            </select>

            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none"
            >
              <option value="">ALL ROLES</option>
              <option value="member">MEMBER</option>
              <option value="assistant">ASSISTANT</option>
              <option value="representative">REPRESENTATIVE</option>
              <option value="admin">ADMIN</option>
              <option value="investor">INVESTOR</option>
            </select>

            <select
              value={filters.plan}
              onChange={(e) => handleFilterChange('plan', e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none"
            >
              <option value="">ALL PLANS</option>
              <option value="free">FREE</option>
              <option value="basic">BASIC ($1)</option>
              <option value="premium">PREMIUM ($3)</option>
            </select>

            <button
              onClick={handleCSVExport}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-mono text-xs font-bold px-3 py-2 border border-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              title="Export matching student registry list to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40">
              <th className="p-3 font-normal">Student User</th>
              <th className="p-3 font-normal">Contact info</th>
              <th className="p-3 font-normal">Role / Level</th>
              <th className="p-3 font-normal">Sub Tier</th>
              <th className="p-3 font-normal">Status</th>
              <th className="p-3 font-normal text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-400">
                  Retrieving registry index...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-400">
                  No registered student matches this filter criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isModeratable = checkCanModerate(u);
                const level = u.adminLevel || 'minor_admin';
                return (
                  <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 text-zinc-700 dark:text-zinc-300">
                    <td className="p-3">
                      <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <span title="Verified System Admin"><ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" /></span>
                        )}
                        {u.role === 'investor' && (
                          <span title="Verified Investor Partner"><Shield className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" /></span>
                        )}
                        {u.role === 'representative' && (
                          <span title="Verified Class Representative"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /></span>
                        )}
                        {u.role !== 'admin' && u.role !== 'investor' && u.role !== 'representative' && u.plan === 'premium' && (
                          <span title="Verified Premium Student"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /></span>
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{u.email}</p>
                      <p className="text-[9px] text-zinc-500 font-mono">ID: {u.id}</p>
                    </td>
                    <td className="p-3 space-y-1 text-[10px]">
                      <p className="text-zinc-500">Phone: <span className="text-zinc-800 dark:text-zinc-200 font-mono">{u.phone || 'N/A'}</span></p>
                      {u.whatsappNumber && (
                        <p className="text-zinc-500">WhatsApp: <span className="text-zinc-800 dark:text-zinc-200 font-mono">{u.whatsappNumber}</span></p>
                      )}
                      {(u.whatsappNumber || u.phone) && (
                        <a
                          href={`https://wa.me/${(u.whatsappNumber || u.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-mono font-bold hover:underline"
                          title="Contact user on WhatsApp"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                          <span>💬 Chat Now</span>
                        </a>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="uppercase text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-400 font-bold">
                          {u.role}
                        </span>
                        {u.role === 'admin' && (
                          <span className={`text-[9px] font-bold px-1 rounded uppercase tracking-wide border ${
                            level === 'super_admin' 
                              ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' 
                              : level === 'junior_admin'
                              ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/20 dark:border-sky-900/40 dark:text-sky-400'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-950/20 dark:border-zinc-800 dark:text-zinc-400'
                          }`}>
                            {level.replace('_', ' ')}
                            {u.canCreateAdmins && ' (+creator)'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="uppercase text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-3 space-y-1">
                      <div>{statusPills[u.status]}</div>
                      {u.statusExpiry && (
                        <p className="text-[9px] text-amber-600 dark:text-amber-400">
                          Expires: {new Date(u.statusExpiry).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {isModeratable ? (
                        <button
                          onClick={() => handleOpenModeration(u)}
                          className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                            u.status === 'active'
                              ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/20'
                          }`}
                        >
                          Manage
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-mono italic">Access Blocked</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalUsers > 8 && (
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs font-mono">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            PREVIOUS PAGE
          </button>
          <span className="text-zinc-500">
            Page {currentPage} of {Math.ceil(totalUsers / 8)} ({totalUsers} users)
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalUsers / 8)}
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            NEXT PAGE
          </button>
        </div>
      )}

      {/* Custom Moderation Dialog / Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg p-6 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex justify-between items-start">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase text-zinc-950 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-zinc-950 dark:text-white" />
                  <span>Control Center: {selectedUser.name}</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">{selectedUser.email} (Role: {selectedUser.role.toUpperCase()})</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-mono text-lg"
              >
                &times;
              </button>
            </div>

            {/* SUPER ADMIN HIERARCHY SECTOR (Only visible to super admins for admin target accounts) */}
            {isSuperAdmin && selectedUser.role === 'admin' && (
              <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950/20 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Modify Administrator Hierarchy (Super Admin Control)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Administrative Level</label>
                    <select
                      value={targetAdminLevel}
                      onChange={(e) => setTargetAdminLevel(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-xs font-mono focus:outline-none"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="junior_admin">Junior Admin</option>
                      <option value="minor_admin">Minor Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                      <input
                        type="checkbox"
                        checked={targetCanCreate}
                        onChange={(e) => setTargetCanCreate(e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">Can Create other admins</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleUpdateHierarchy}
                    disabled={isUpdatingHierarchy}
                    className="px-3 py-1.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono font-bold uppercase border border-zinc-900 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingHierarchy ? 'Re-keying...' : 'Save Hierarchy Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* GENERAL DISCIPLINARY ACTIONS FORM */}
            <form onSubmit={handleSubmitModeration} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Moderation Action Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['suspended', 'banned', 'active'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModStatus(s)}
                      className={`py-2 text-[10px] font-mono font-bold uppercase border cursor-pointer ${
                        modStatus === s
                          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {modStatus !== 'active' && (
                <>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Reason / Infraction Details</label>
                    <textarea
                      required
                      rows={3}
                      value={modReason}
                      onChange={(e) => setModReason(e.target.value)}
                      placeholder="Specify the reason or citation for this disciplinary moderation action..."
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono focus:outline-none"
                    />
                  </div>

                  {modStatus === 'suspended' && (
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Suspension Expiry Date</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          value={modExpiry}
                          onChange={(e) => setModExpiry(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 pl-9 pr-4 py-2 text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1">Leave blank for indefinite suspension.</p>
                    </div>
                  )}
                </>
              )}

              {/* ACTION FOOTER */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 justify-between items-center">
                {/* Red delete button (Super Admins, or Junior Admins specifically deleting Minor Admins) */}
                {checkCanDelete(selectedUser) ? (
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950/40 dark:hover:bg-red-950/20 text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 self-end">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-600 uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-mono font-bold uppercase disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Executing...' : 'Commit Status'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h3 className="font-sans font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">Create Authorized Account</h3>
              </div>
              <button 
                onClick={() => setIsOpenCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-mono text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4">
              {createError && (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-3 text-[11px] font-mono border border-red-200 dark:border-red-900/40">
                  {createError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="e.g. user@thesdel.edu.ng"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">Access Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['admin', 'investor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreateRole(r)}
                      className={`py-2 text-[10px] font-mono font-bold uppercase border cursor-pointer ${
                        createRole === r
                          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional parameters when role === 'admin' */}
              {createRole === 'admin' && (
                <div className="space-y-3 border border-dashed border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block">
                    Administrative Level & Write Access
                  </span>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase">Professional Status Role</label>
                    <select
                      value={createAdminLevel}
                      onChange={(e) => setCreateAdminLevel(e.target.value as any)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-xs font-mono focus:outline-none"
                    >
                      {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                      <option value="junior_admin">Junior Admin</option>
                      <option value="minor_admin">Minor Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                      <input
                        type="checkbox"
                        checked={createCanCreateAdmins}
                        onChange={(e) => setCreateCanCreateAdmins(e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[10px]">Can create other admins</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                      <input
                        type="checkbox"
                        checked={createAllowAds}
                        onChange={(e) => setCreateAllowAds(e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[10px]">Allow user to run ads</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 border border-dashed border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/10">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Page Access / Permissions</label>
                <p className="text-[9px] text-zinc-500 font-sans leading-tight">
                  {createRole === 'investor' 
                    ? "Investors are strictly limited to selected views with anonymized data."
                    : "Select which modules this administrator is permitted to access:"}
                </p>
                <div className="space-y-2 pt-1">
                  {[
                    { id: 'dashboard', label: 'Overview Metrics' },
                    { id: 'revenue', label: 'Revenue Ledger' },
                    { id: 'users', label: 'User Registry', restricted: createRole === 'investor' },
                    { id: 'investors', label: 'Investor Portal' },
                    { id: 'audit_logs', label: 'Audit Records', restricted: createRole === 'investor' },
                  ].map((p) => {
                    const isChecked = createAllowedPages.includes(p.id as any);
                    const isDisabled = p.restricted;
                    return (
                      <label 
                        key={p.id} 
                        className={`flex items-center gap-2 cursor-pointer text-xs font-mono select-none ${isDisabled ? 'opacity-45 cursor-not-allowed' : 'hover:text-zinc-900 dark:hover:text-white'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked && !isDisabled}
                          disabled={isDisabled}
                          onChange={() => {
                            if (isDisabled) return;
                            if (isChecked) {
                              setCreateAllowedPages(createAllowedPages.filter((page) => page !== p.id));
                            } else {
                              setCreateAllowedPages([...createAllowedPages, p.id as any]);
                            }
                          }}
                          className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-[11px] text-zinc-700 dark:text-zinc-300">{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">Password</label>
                <input
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Leave blank for DefaultPassword123!"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  placeholder="e.g. +2348100240137"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpenCreateModal(false)}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-600 uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-mono font-bold uppercase disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
