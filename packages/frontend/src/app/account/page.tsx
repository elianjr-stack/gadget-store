'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Package, MapPin, Heart, ShieldCheck, LogOut,
  ChevronRight, Clock, CheckCircle
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import { api } from '../../lib/api';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, token, logout, wishlist } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token && !user) {
      router.push('/auth/login');
      return;
    }

    api
      .get('/orders/my?limit=5')
      .then((res: any) => {
        if (res.data) setOrders(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, user]);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center uppercase shadow-md">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p className="text-xs text-gray-400">
              {user?.phone || user?.email || 'Valued Zynox Gadgets Member'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/account/orders"
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-400 shadow-sm transition space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
              {orders.length}
            </span>
            <p className="text-xs text-gray-400 font-semibold">Total Orders</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-rose-400 shadow-sm transition space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
              {wishlist.length}
            </span>
            <p className="text-xs text-gray-400 font-semibold">Saved Items</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-emerald-400 shadow-sm transition space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">1</span>
            <p className="text-xs text-gray-400 font-semibold">Saved Addresses</p>
          </div>
        </Link>

        <Link
          href="/account/profile"
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-400 shadow-sm transition space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">100%</span>
            <p className="text-xs text-gray-400 font-semibold">Profile Settings</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-primary-600 hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                    #{ord.orderNumber}
                  </span>
                  <p className="text-gray-400 mt-0.5">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-primary-600 dark:text-primary-400">
                    {formatPrice(ord.total)}
                  </span>

                  <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {ord.status}
                  </span>

                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>You have not placed any orders yet.</p>
            <Link
              href="/products"
              className="mt-3 inline-block font-semibold text-primary-600 hover:underline text-xs"
            >
              Start shopping gadgets →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
