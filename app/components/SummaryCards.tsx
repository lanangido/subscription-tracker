import React from 'react';
import { Subscription } from '@prisma/client';
import { CreditCard, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  subscriptions: Subscription[];
}

export const SummaryCards = ({ subscriptions }: SummaryCardsProps) => {
  const total = subscriptions.length;
  const activeCount = subscriptions.filter(s => s.status === 'Active').length;
  const expiringSoonCount = subscriptions.filter(s => s.status === 'Expiring Soon').length;
  const expiredCount = subscriptions.filter(s => s.status === 'Expired').length;
  
  // Exclude cancelled from active monthly cost optionally, but let's include active + expiring soon
  const activeSpend = subscriptions
    .filter(s => s.status === 'Active' || s.status === 'Expiring Soon')
    .reduce((acc, curr) => acc + curr.monthlyCost, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Card */}
      <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-500/20 rounded-md p-3">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Total Active Spend</dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(activeSpend)}<span className="text-sm font-normal text-slate-500">/mo</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Active Card */}
      <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-md p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscriptions</dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {activeCount} <span className="text-sm font-normal text-slate-500">of {total}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Soon Card */}
      <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-500/20 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Expiring Soon (≤ 7 days)</dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white">{expiringSoonCount}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Expired Card */}
      <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-rose-100 dark:bg-rose-500/20 rounded-md p-3">
              <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">Expired Subscriptions</dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white">{expiredCount}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
