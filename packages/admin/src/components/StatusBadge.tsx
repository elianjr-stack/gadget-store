import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const styles: Record<string, string> = {
    // Orders
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
    RETURNED: 'bg-orange-50 text-orange-700 border-orange-200',
    REFUNDED: 'bg-slate-100 text-slate-700 border-slate-200',

    // Payments
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-200',

    // Stock
    IN_STOCK: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    OUT_OF_STOCK: 'bg-rose-50 text-rose-700 border-rose-200',
    PRE_ORDER: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const currentStyle = styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}
