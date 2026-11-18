'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, FolderTree, Tag, ShoppingCart,
  Users, Ticket, Image as ImageIcon, MessageSquare, BarChart3,
  Settings, History, LogOut, ChevronLeft, ChevronRight, DollarSign, ShieldCheck
} from 'lucide-react';
import { useAdminStore } from '../lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, logout, admin } = useAdminStore();

  const navItems = [
    { label: 'Overview', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Products & Barcodes', href: '/products', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Categories', href: '/categories', icon: <FolderTree className="w-5 h-5" /> },
    { label: 'Brands & Colors', href: '/brands', icon: <Tag className="w-5 h-5" /> },
    { label: 'Orders & Courier', href: '/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'Expenses & P&L', href: '/expenses', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Customers', href: '/customers', icon: <Users className="w-5 h-5" /> },
    { label: 'Coupons', href: '/coupons', icon: <Ticket className="w-5 h-5" /> },
    { label: 'Banners & CMS', href: '/banners', icon: <ImageIcon className="w-5 h-5" /> },
    { label: 'Reviews', href: '/reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Sales & Profit', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Security & Logs', href: '/settings/activity-logs', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Logo & Toggle Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              Z
            </div>
            {sidebarOpen && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-extrabold text-white text-sm tracking-tight">Zynox Gadgets</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Admin Portal</span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 uppercase">
              {admin?.name?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="font-bold text-xs text-white truncate">{admin?.name || 'Store Owner'}</p>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{admin?.role || 'OWNER'}</span>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
