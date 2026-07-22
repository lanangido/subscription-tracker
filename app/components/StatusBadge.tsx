import React from 'react';
import { cn } from '@/lib/utils';

export type Status = "Active" | "Expiring Soon" | "Expired" | "Cancelled";

export const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  const getStatusStyles = (s: string) => {
    switch (s) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";
      case "Expiring Soon":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
      case "Expired":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
      case "Cancelled":
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};
