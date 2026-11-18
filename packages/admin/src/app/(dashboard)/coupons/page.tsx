'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, CheckCircle } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { formatPrice, formatDate } from '../../../lib/utils';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('2000');
  const [maxDiscount, setMaxDiscount] = useState('1000');

  const fetchCoupons = () => {
    api
      .get('/coupons')
      .then((res: any) => {
        if (res.data) setCoupons(res.data);
      })
      .catch(() => {
        // Fallback demo coupons
        setCoupons([
          { id: '1', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrderAmount: 2000, maxDiscount: 1000, usageCount: 42, isActive: true },
          { id: '2', code: 'SAVE500', type: 'FIXED_AMOUNT', value: 500, minOrderAmount: 5000, maxDiscount: null, usageCount: 19, isActive: true },
          { id: '3', code: 'GADGET20', type: 'PERCENTAGE', value: 20, minOrderAmount: 10000, maxDiscount: 3000, usageCount: 8, isActive: true },
        ]);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    try {
      const res: any = await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount) || null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      });

      setCoupons([...coupons, res.data || { id: String(Date.now()), code: code.toUpperCase(), type, value: Number(value), minOrderAmount: Number(minOrderAmount), maxDiscount: Number(maxDiscount), usageCount: 0, isActive: true }]);
      setIsAdding(false);
      setCode('');
      setValue('');
      toast.success('Coupon created successfully!');
    } catch {
      toast.error('Failed to create coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c.id !== id));
      toast.success('Coupon removed');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const columns = [
    {
      header: 'Coupon Code',
      cell: (row: any) => (
        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Discount Value',
      cell: (row: any) => (
        <span className="font-bold text-slate-900">
          {row.type === 'PERCENTAGE' ? `${row.value}% OFF` : `${formatPrice(row.value)} OFF`}
        </span>
      ),
    },
    {
      header: 'Min. Order',
      cell: (row: any) => (
        <span className="text-slate-600">{row.minOrderAmount ? formatPrice(row.minOrderAmount) : 'No Minimum'}</span>
      ),
    },
    {
      header: 'Usage Count',
      cell: (row: any) => (
        <span className="font-semibold text-slate-800">{row.usageCount ?? 0} times</span>
      ),
    },
    {
      header: 'Status',
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Coupons & Discounts
          </h1>
          <p className="text-xs text-slate-500">
            Create promotional coupon codes with percentage or flat BDT discounts
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs animate-fade-in">
          <h3 className="font-bold text-sm text-slate-900">
            Create Promotional Coupon
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Code (e.g. FLASH50)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-indigo-500"
            />
            <select
              value={type}
              onChange={(e: any) => setType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (BDT ৳)</option>
            </select>
            <input
              type="number"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Discount Value (e.g. 10 or 500)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold"
            />
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              placeholder="Min Order Amount (BDT)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Save Coupon
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <DataTable
        columns={columns}
        data={coupons}
        searchPlaceholder="Search coupons..."
      />
    </div>
  );
}
