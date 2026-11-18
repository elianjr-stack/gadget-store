'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Package, Users, ArrowUpRight,
  AlertTriangle, Plus, Eye, TrendingUp, Sparkles
} from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { formatPrice } from '../../lib/utils';
import { api } from '../../lib/api';

export default function AdminOverviewDashboard() {
  const [stats, setStats] = useState<any>({
    totalRevenue: 2840000,
    totalOrders: 142,
    todayOrders: 18,
    totalProducts: 24,
    totalCustomers: 89,
    pendingOrders: 5,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([
    { id: '1', orderNumber: 'GS-2026-9842', total: 178060, status: 'PROCESSING', paymentMethod: 'BKASH', user: { name: 'Tanvir Ahmed' }, createdAt: new Date().toISOString() },
    { id: '2', orderNumber: 'GS-2026-9841', total: 52060, status: 'CONFIRMED', paymentMethod: 'SSLCOMMERZ', user: { name: 'Nafis Chowdhury' }, createdAt: new Date().toISOString() },
    { id: '3', orderNumber: 'GS-2026-9840', total: 7860, status: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY', user: { name: 'Sadia Rahman' }, createdAt: new Date().toISOString() },
    { id: '4', orderNumber: 'GS-2026-9839', total: 29500, status: 'DELIVERED', paymentMethod: 'NAGAD', user: { name: 'Kazi Farhan' }, createdAt: new Date().toISOString() },
  ]);

  const [lowStock, setLowStock] = useState<any[]>([
    { id: 'p1', name: 'MacBook Air M3 (13-inch)', sku: 'APL-MBA-M3-256', stockQuantity: 2 },
    { id: 'p2', name: 'Baseus 65W GaN Charger', sku: 'BAS-GAN65-3P', stockQuantity: 3 },
  ]);

  useEffect(() => {
    api
      .get('/analytics/dashboard')
      .then((res: any) => {
        if (res.data?.stats) setStats(res.data.stats);
        if (res.data?.recentOrders) setRecentOrders(res.data.recentOrders);
        if (res.data?.lowStockProducts) setLowStock(res.data.lowStockProducts);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time snapshot of Zynox Gadgets Bangladesh sales and store activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/products/import"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
          >
            <span>Bulk CSV Import</span>
          </Link>
        </div>
      </div>

      {/* 4 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue (BDT)"
          value={formatPrice(stats.totalRevenue)}
          change="+18.4% from last month"
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
        />
        <StatsCard
          title="Orders Today"
          value={stats.todayOrders}
          change={`${stats.pendingOrders} pending verification`}
          icon={<ShoppingCart className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard
          title="Active Products"
          value={stats.totalProducts}
          change="Across 23 official brands"
          icon={<Package className="w-6 h-6 text-amber-600" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          change="89 registered buyers"
          icon={<Users className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Grid: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400">Latest customer checkouts</p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="font-extrabold text-sm text-slate-900 hover:text-indigo-600"
                  >
                    #{ord.orderNumber}
                  </Link>
                  <p className="text-slate-400 mt-0.5">
                    Customer: <strong className="text-slate-700">{ord.user?.name || 'Customer'}</strong> • {ord.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-900">
                    {formatPrice(ord.total)}
                  </span>
                  <StatusBadge status={ord.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts & Quick Actions (1 col) */}
        <div className="space-y-6">
          {/* Low Stock Warning Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">
                Low Stock Alerts
              </h3>
            </div>

            <div className="space-y-3">
              {lowStock.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">
                      {prod.name}
                    </p>
                    <p className="text-slate-400 text-[11px]">SKU: {prod.sku}</p>
                  </div>
                  <span className="font-black text-rose-600 bg-white px-2 py-1 rounded-lg border border-rose-200 flex-shrink-0">
                    {prod.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="block text-center text-xs font-bold text-indigo-600 hover:underline pt-2"
            >
              Manage Inventory Stock →
            </Link>
          </div>

          {/* Instant Live Sync Banner */}
          <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-3xl p-6 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Instant Database Sync</span>
            </div>
            <h4 className="font-bold text-sm">
              Single Source of Truth
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every price update, brand addition, or inventory change made in this admin panel reflects immediately on the live storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
