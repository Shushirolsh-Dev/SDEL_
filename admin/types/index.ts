export type AdminRole = 'admin' | 'investor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  token?: string;
  allowedPages?: ('dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs' | 'ads')[];
  adminLevel?: 'super_admin' | 'junior_admin' | 'minor_admin';
  canCreateAdmins?: boolean;
  allowAds?: boolean;
  investorExpiresAt?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: 'login' | 'moderation' | 'investor_invite' | 'permission_change' | 'export' | 'suspend_user' | 'ban_user' | 'restore_user';
  targetUserId?: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface InvestorInvitation {
  id: string;
  email: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'revoked';
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface DailyRevenue {
  date: string;
  free: number;
  basic: number;
  premium: number;
  total: number;
}

export interface RevenueStats {
  mrr: number;
  renewalRate: number; // percentage
  churnRate: number; // percentage
  activeSubscribers: {
    free: number;
    basic: number;
    premium: number;
  };
  paymentsSummary: {
    successful: number;
    failed: number;
    refunded: number;
    cancelled: number;
  };
  verifiedRevenue: {
    daily: DailyRevenue[];
    weekly: { week: string; amount: number }[];
    monthly: { month: string; amount: number }[];
    yearly: { year: string; amount: number }[];
  };
}

export interface AnalyticsSummary {
  thresholdMet: boolean;
  totalSignups: number;
  dau: number;
  wau: number;
  mau: number;
  retentionRate: number; // e.g. 78.5%
  avgSessionsPerUser: number;
  totalClicks: number;
  screenUsage: { screenName: string; viewCount: number; avgTimeSec: number }[];
  timeSpentMinutes: number;
  funnels: { step: string; count: number; percentage: number }[];
  activeClassesCount: number;
}

export interface ManagedUserProfile {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'assistant' | 'representative' | 'admin' | 'investor';
  plan: 'free' | 'basic' | 'premium';
  phone?: string;
  whatsappNumber?: string;
  status: 'active' | 'suspended' | 'banned' | 'deleted';
  statusReason?: string;
  statusExpiry?: string; // ISO string
  createdAt: string;
  allowedPages?: ('dashboard' | 'revenue' | 'users' | 'investors' | 'audit_logs')[];
  adminLevel?: 'super_admin' | 'junior_admin' | 'minor_admin';
  canCreateAdmins?: boolean;
  allowAds?: boolean;
  investorExpiresAt?: string;
}
