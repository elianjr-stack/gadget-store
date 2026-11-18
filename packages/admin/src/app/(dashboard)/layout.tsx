'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { useAdminStore } from '../../lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, sidebarOpen } = useAdminStore();

  useEffect(() => {
    // If no token in localstorage, redirect to admin login
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!savedToken && !token) {
      router.push('/login');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Topbar />
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
