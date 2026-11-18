'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../../../lib/store';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAdminStore();
  const [email, setEmail] = useState('admin@zynoxgadgets.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res: any = await api.post('/auth/login', {
        email,
        password,
      });

      if (res.data?.user) {
        if (!['OWNER', 'MANAGER', 'STAFF'].includes(res.data.user.role)) {
          toast.error('Access denied. Administrator privileges required.');
          return;
        }

        setAuth(res.data.user, res.data.accessToken);
        toast.success(`Welcome to Zynox Gadgets Admin, ${res.data.user.name}`);
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 text-white shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 text-white font-black text-2xl">
          Z
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Zynox Gadgets Admin Portal
        </h1>
        <p className="text-xs text-slate-400">
          Single Source of Truth Storefront Management & Control
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Master Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Restricted Access: Store Owners, Managers & Staff</span>
      </div>
    </div>
  );
}
