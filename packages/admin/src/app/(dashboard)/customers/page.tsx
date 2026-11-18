'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/DataTable';
import { formatDate } from '../../../lib/utils';
import { api } from '../../../lib/api';
import { Users, Mail, Phone } from 'lucide-react';

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/users?role=CUSTOMER&limit=50')
      .then((res: any) => {
        if (res.data) setCustomers(res.data);
      })
      .catch(() => {
        // Fallback demo customers
        setCustomers([
          { id: '1', name: 'Tanvir Ahmed', phone: '01700000000', email: 'tanvir@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2026-10-15T10:00:00Z', _count: { orders: 4 } },
          { id: '2', name: 'Nafis Chowdhury', phone: '01811111111', email: 'nafis@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2026-10-18T12:00:00Z', _count: { orders: 2 } },
          { id: '3', name: 'Sadia Rahman', phone: '01922222222', email: 'sadia@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2026-10-20T14:00:00Z', _count: { orders: 1 } },
          { id: '4', name: 'Kazi Farhan', phone: '01633333333', email: 'farhan@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2026-10-22T16:00:00Z', _count: { orders: 3 } },
        ]);
      });
  }, []);

  const columns = [
    {
      header: 'Customer',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-[11px] text-slate-400">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      cell: (row: any) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">{row.phone || '—'}</p>
          <p className="text-slate-400 text-[11px]">{row.email || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Orders Placed',
      cell: (row: any) => (
        <span className="font-bold text-slate-800">{row._count?.orders ?? 0} orders</span>
      ),
    },
    {
      header: 'Joined Date',
      cell: (row: any) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Account Status',
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {row.isActive ? 'Active' : 'Deactivated'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer Accounts
        </h1>
        <p className="text-xs text-slate-500">
          List of registered gadget buyers with order histories and contact credentials
        </p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search customer by name, email or phone..."
      />
    </div>
  );
}
