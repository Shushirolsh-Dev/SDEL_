import React, { useState } from 'react';
import { AdminAuditLog } from '../types';
import { ShieldAlert, Terminal, ArrowRight, UserCheck, Calendar, Clock } from 'lucide-react';

interface AuditLogsProps {
  logs: AdminAuditLog[];
  totalLogs: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function AuditLogs({
  logs,
  totalLogs,
  currentPage,
  onPageChange,
  loading,
}: AuditLogsProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const formatActionName = (action: AdminAuditLog['action']) => {
    return action.toUpperCase().replace(/_/g, ' ');
  };

  const actionColors: Record<AdminAuditLog['action'], string> = {
    login: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400',
    moderation: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
    investor_invite: 'text-purple-700 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400',
    permission_change: 'text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
    export: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400',
    suspend_user: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
    ban_user: 'text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400',
    restore_user: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
  };

  return (
    <div className="space-y-6" id="admin-audit-logs-page">
      {/* Title block */}
      <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-sm flex items-start gap-3">
        <Terminal className="w-5 h-5 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Immutable Security Audit Logs</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            All administrative procedures, moderation updates, user suspensions, session blocks, and credential revisions are logged on an immutable ledger. These events cannot be modified or cleared by any account profile.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40">
              <th className="p-3 font-normal">Timestamp</th>
              <th className="p-3 font-normal">Admin Operator</th>
              <th className="p-3 font-normal">Action Event</th>
              <th className="p-3 font-normal">Target User ID</th>
              <th className="p-3 font-normal text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-400">
                  Accessing security ledger...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-400">
                  Ledger is empty.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 text-zinc-700 dark:text-zinc-300">
                      <td className="p-3 whitespace-nowrap text-zinc-400 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          <Clock className="w-3.5 h-3.5 shrink-0 ml-1" />
                          <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-zinc-900 dark:text-white">{log.adminEmail}</span>
                        <p className="text-[9px] text-zinc-400">ID: {log.adminId || 'System'}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded ${actionColors[log.action]}`}>
                          {formatActionName(log.action)}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-zinc-500">
                        {log.targetUserId ? (
                          <span className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-800 dark:text-zinc-300">
                            {log.targetUserId}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-mono cursor-pointer transition-colors text-zinc-700 dark:text-zinc-300"
                        >
                          {isExpanded ? 'Hide Parameters' : 'View Parameters'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-50 dark:bg-zinc-950/30">
                        <td colSpan={5} className="p-4 font-mono text-[10px]">
                          <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900/40 rounded">
                            <p className="text-zinc-400 mb-2 uppercase text-[9px] tracking-wider font-bold">Transaction Attributes JSON</p>
                            <pre className="text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalLogs > 10 && (
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs font-mono">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            PREVIOUS PAGE
          </button>
          <span className="text-zinc-500">
            Page {currentPage} of {Math.ceil(totalLogs / 10)} ({totalLogs} records)
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalLogs / 10)}
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            NEXT PAGE
          </button>
        </div>
      )}
    </div>
  );
}
