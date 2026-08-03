import React, { useState } from 'react';
import { RevenueStats } from '../types';
import { LineChart } from '../charts/SimpleCharts';
import { AlertCircle, CreditCard, RefreshCw, TrendingUp, HelpCircle } from 'lucide-react';

interface RevenueProps {
  revenue: RevenueStats | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  dateFilter: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onDateFilterChange: (filter: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export default function Revenue({
  revenue,
  loading,
  error,
  onRefresh,
  dateFilter,
  onDateFilterChange,
}: RevenueProps) {
  const [selectedSubRange, setSelectedSubRange] = useState<'all' | 'custom'>('all');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3" id="revenue-loading">
        <div className="w-8 h-8 border-2 border-zinc-950 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-zinc-500">Retrieving verified Paystack ledger sheets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/10 p-6 rounded-lg text-center" id="revenue-error">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-mono text-sm font-bold text-red-800 dark:text-red-400 mb-1">PAYST SDK DISCONNECTED</h3>
        <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold animate-pulse"
        >
          RECONNECT ENDPOINT
        </button>
      </div>
    );
  }

  if (!revenue) return null;

  // Prepare chart data based on date filter selection
  let chartPoints = [];
  if (dateFilter === 'daily') {
    chartPoints = revenue.verifiedRevenue.daily.map(d => ({
      label: d.date.substring(5), // MM-DD
      value: d.total,
    }));
  } else if (dateFilter === 'weekly') {
    chartPoints = revenue.verifiedRevenue.weekly.map(w => ({
      label: w.week,
      value: w.amount,
    }));
  } else if (dateFilter === 'monthly') {
    chartPoints = revenue.verifiedRevenue.monthly.map(m => ({
      label: m.month,
      value: m.amount,
    }));
  } else {
    chartPoints = revenue.verifiedRevenue.yearly.map(y => ({
      label: y.year,
      value: y.amount,
    }));
  }

  return (
    <div className="space-y-6" id="admin-revenue-page">
      {/* Date filter picker header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Verified Revenue Ledger</h2>
          <p className="text-xs text-zinc-400">Server-authoritative records derived from the Paystack payment gateway.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800 rounded">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(f => (
            <button
              key={f}
              onClick={() => onDateFilterChange(f)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                dateFilter === f
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Health Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="revenue-metrics-grid">
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <span>MRR (USD)</span>
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          </p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">${revenue.mrr.toLocaleString()}</p>
          <p className="text-[9px] text-zinc-500 mt-2 font-mono">Monthly Recurring Revenue</p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Renewal Rate</p>
          <p className="text-2xl font-mono font-bold mt-1 text-emerald-600 dark:text-emerald-400">{revenue.renewalRate}%</p>
          <p className="text-[9px] text-zinc-500 mt-2 font-mono">Monthly subscription renewals</p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Churn Rate</p>
          <p className="text-2xl font-mono font-bold mt-1 text-red-600 dark:text-red-400">{revenue.churnRate}%</p>
          <p className="text-[9px] text-zinc-500 mt-2 font-mono">Monthly subscriber attrition</p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Subscribers</p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">
            {revenue.activeSubscribers.basic + revenue.activeSubscribers.premium}
          </p>
          <p className="text-[9px] text-zinc-500 mt-2 font-mono">Paying student tiers</p>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-zinc-500" />
          <span>Paystack Verified Cash Inflow ({dateFilter})</span>
        </h3>
        <LineChart data={chartPoints} height={220} color="#10b981" />
      </div>

      {/* Subscription Splits & Payment Failures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier breakdown */}
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-zinc-500" />
            <span>Active Subscription Plan Segmentation</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-500">Premium Tier ($3/mo)</span>
                <span className="font-bold">{revenue.activeSubscribers.premium} students</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2">
                <div 
                  className="bg-zinc-950 dark:bg-white h-2 transition-all duration-500" 
                  style={{ width: `${(revenue.activeSubscribers.premium / (revenue.activeSubscribers.free + revenue.activeSubscribers.basic + revenue.activeSubscribers.premium)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-500">Basic Tier ($1/mo)</span>
                <span className="font-bold">{revenue.activeSubscribers.basic} students</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2">
                <div 
                  className="bg-emerald-500 h-2 transition-all duration-500" 
                  style={{ width: `${(revenue.activeSubscribers.basic / (revenue.activeSubscribers.free + revenue.activeSubscribers.basic + revenue.activeSubscribers.premium)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-500">Free Tier ($0)</span>
                <span className="font-bold">{revenue.activeSubscribers.free} students</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2">
                <div 
                  className="bg-zinc-300 dark:bg-zinc-700 h-2 transition-all duration-500" 
                  style={{ width: `${(revenue.activeSubscribers.free / (revenue.activeSubscribers.free + revenue.activeSubscribers.basic + revenue.activeSubscribers.premium)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Successful vs Failed pay summary */}
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-zinc-500" />
            <span>Paystack Transaction Audit</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950/20">
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Successful Payments</p>
              <p className="text-lg font-mono font-bold text-emerald-600 mt-1">{revenue.paymentsSummary.successful}</p>
            </div>

            <div className="border border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950/20">
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Failed Payments</p>
              <p className="text-lg font-mono font-bold text-red-600 mt-1">{revenue.paymentsSummary.failed}</p>
            </div>

            <div className="border border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950/20">
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Refunded Credits</p>
              <p className="text-lg font-mono font-bold text-amber-600 mt-1">{revenue.paymentsSummary.refunded}</p>
            </div>

            <div className="border border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950/20">
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Cancellations</p>
              <p className="text-lg font-mono font-bold text-zinc-600 dark:text-zinc-400 mt-1">{revenue.paymentsSummary.cancelled}</p>
            </div>
          </div>

          <div className="mt-4 p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
              Paystack webhooks automatically trigger subscription records in public.profiles. No client-side price variables can modify these tiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
