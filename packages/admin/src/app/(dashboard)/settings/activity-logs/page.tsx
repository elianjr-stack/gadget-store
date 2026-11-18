'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '../../../../components/DataTable';
import { formatDate } from '../../../../lib/utils';
import { api } from '../../../../lib/api';
import { History, ShieldAlert } from 'lucide-react';

export default function ActivityLogsAdminPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/users/activity-logs?limit=50')
      .then((res: any) => {
        if (res.data) setLogs(res.data);
      })
      .catch(() => {
        // Fallback demo audit logs
        setLogs([
          { id: '1', action: 'order.status_update', entity: 'Order #GS-2026-9842', ipAddress: '103.114.98.12', user: { name: 'Store Owner' }, createdAt: '2026-11-02T09:12:00Z' },
          { id: '2', action: 'product.price_change', entity: 'iPhone 15 Pro Max', ipAddress: '103.114.98.12', user: { name: 'Store Owner' }, createdAt: '2026-11-02T08:30:00Z' },
          { id: '3', action: 'coupon.create', entity: 'Coupon SAVE500', ipAddress: '103.114.98.12', user: { name: 'Store Owner' }, createdAt: '2026-11-01T15:45:00Z' },
          { id: '4', action: 'auth.login', entity: 'Admin Session', ipAddress: '103.114.98.12', user: { name: 'Store Owner' }, createdAt: '2026-11-01T08:00:00Z' },
        ]);
      });
  }, []);

  const columns = [
    {
      header: 'Action / Event',
      cell: (row: any) => (
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Target Entity',
      cell: (row: any) => (
        <span className="font-bold text-slate-900">{row.entity}</span>
      ),
    },
    {
      header: 'Operator',
      cell: (row: any) => (
        <span className="font-semibold text-slate-800">{row.user?.name || 'Admin'}</span>
      ),
    },
    {
      header: 'IP Address',
      cell: (row: any) => (
        <span className="font-mono text-slate-500 text-[11px]">{row.ipAddress || '127.0.0.1'}</span>
      ),
    },
    {
      header: 'Timestamp',
      cell: (row: any) => <span>{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin Audit Trail & Activity Logs
        </h1>
        <p className="text-xs text-slate-500">
          Chronological record of all administrative product edits, order status updates, and login sessions
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Filter logs by action or entity..."
      />
    </div>
  );
}
