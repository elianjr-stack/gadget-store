'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign, Plus, Trash2, Calendar, TrendingDown,
  Layers, CreditCard, RefreshCw, FileText, CheckCircle2
} from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

const EXPENSE_CATEGORIES = [
  'Rent',
  'Salaries',
  'Utilities',
  'Packaging',
  'Marketing',
  'Shipping',
  'Maintenance',
  'Other',
];

export default function ExpensesAdminPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const [expRes, breakRes]: any = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/breakdown'),
      ]);

      if (expRes.data) {
        setExpenses(expRes.data.data || expRes.data);
        if (expRes.data.meta?.totalAmount !== undefined) {
          setTotalAmount(expRes.data.meta.totalAmount);
        } else {
          const sum = (expRes.data || []).reduce((acc: number, item: any) => acc + Number(item.amount), 0);
          setTotalAmount(sum);
        }
      }

      if (breakRes.data) {
        setBreakdown(breakRes.data.data || breakRes.data);
      }
    } catch {
      toast.error('Failed to load expense records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      await api.post('/expenses', {
        title,
        category,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        paymentMethod,
        referenceNo,
        notes,
      });

      toast.success('Business expense recorded successfully!');
      setIsAdding(false);
      setTitle('');
      setAmount('');
      setReferenceNo('');
      setNotes('');
      fetchExpenses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record expense');
    }
  };

  const handleDelete = async (id: string, expTitle: string) => {
    if (!confirm(`Are you sure you want to delete expense "${expTitle}"?`)) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const columns = [
    {
      header: 'Expense Item',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{row.title}</p>
            {row.referenceNo && (
              <p className="text-[11px] text-slate-400 font-mono">Ref: {row.referenceNo}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row: any) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Amount',
      cell: (row: any) => (
        <span className="font-black text-rose-600 text-sm">
          - ৳{Number(row.amount).toLocaleString('en-BD')}
        </span>
      ),
    },
    {
      header: 'Payment Method',
      cell: (row: any) => (
        <span className="text-xs font-medium text-slate-600">
          {row.paymentMethod || 'Cash'}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (row: any) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(row.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <button
          onClick={() => handleDelete(row.id, row.title)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          title="Delete expense"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Business Expenses & Cash Flow
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              P&L Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track operational overheads, salaries, rent, marketing, and packaging for accurate automated profit calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchExpenses}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded Expenses</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ৳{totalAmount.toLocaleString('en-BD')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Categories</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {breakdown.length} Categories
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense Records</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {expenses.length} Entries
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expense Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl border border-rose-100 p-6 space-y-4 shadow-xl shadow-rose-500/5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-rose-600" />
              <span>Record New Business Expense</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expense Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Showroom Electricity Bill"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (BDT) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="bKash">bKash</option>
                <option value="Card">Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice / Ref No.</label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. INV-2026-904"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or supplier details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table */}
      <DataTable
        columns={columns}
        data={expenses}
        searchPlaceholder="Search expenses by title or category..."
      />
    </div>
  );
}
