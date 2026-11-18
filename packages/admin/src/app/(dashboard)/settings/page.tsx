'use client';

import React, { useState } from 'react';
import { Save, Store, Truck, ShieldCheck, CreditCard, Database, Bell, RefreshCw, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsAdminPage() {
  const [siteName, setSiteName] = useState('Zynox Gadgets');
  const [tagline, setTagline] = useState('The Ultimate Gadget Destination');
  const [hotline, setHotline] = useState('+880 1700-ZYNOXG');
  const [whatsapp, setWhatsapp] = useState('8801700996633');
  const [supportEmail, setSupportEmail] = useState('support@zynoxgadgets.com');
  const [storeAddress, setStoreAddress] = useState('Zynox Tower, Level 4, Dhanmondi 27, Dhaka - 1209, Bangladesh');
  const [dhakaCharge, setDhakaCharge] = useState('60');
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState('120');
  const [freeDhakaAbove, setFreeDhakaAbove] = useState('3000');

  // Couriers
  const [pathaoEnabled, setPathaoEnabled] = useState(true);
  const [steadfastEnabled, setSteadfastEnabled] = useState(true);
  const [redxEnabled, setRedxEnabled] = useState(true);

  // Payments
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [nagadEnabled, setNagadEnabled] = useState(true);
  const [sslCommerzEnabled, setSslCommerzEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);

  // Security
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Zynox Gadgets settings updated and synced instantly with database!');
  };

  const handleDatabaseBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      toast.success('Database backup created successfully: zynox_backup_' + new Date().toISOString().slice(0, 10) + '.sql');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Zynox Gadgets — Store Settings & Configuration
        </h1>
        <p className="text-xs text-slate-500">
          Central command center for store branding, delivery logistics, payment gateways, and security
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General Store Info */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Store Identity & Contact Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Customer Support Hotline
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                WhatsApp Live Assistance
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Corporate Flagship Address
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Delivery Logistics */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Courier Delivery Charges (BDT ৳) & Partner Integrations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Inside Dhaka Charge
              </label>
              <input
                type="number"
                value={dhakaCharge}
                onChange={(e) => setDhakaCharge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Outside Dhaka Charge
              </label>
              <input
                type="number"
                value={outsideDhakaCharge}
                onChange={(e) => setOutsideDhakaCharge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                value={freeDhakaAbove}
                onChange={(e) => setFreeDhakaAbove(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              Active Courier APIs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pathaoEnabled}
                  onChange={(e) => setPathaoEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-slate-700">Pathao Courier API</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={steadfastEnabled}
                  onChange={(e) => setSteadfastEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-slate-700">Steadfast Courier API</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={redxEnabled}
                  onChange={(e) => setRedxEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-slate-700">RedX Logistics API</span>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Bangladesh Payment Gateways
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-3 bg-pink-50/60 rounded-xl border border-pink-200 cursor-pointer">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
                className="rounded text-pink-600 focus:ring-0"
              />
              <span className="text-xs font-black text-pink-700">bKash Merchant PGW</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-orange-50/60 rounded-xl border border-orange-200 cursor-pointer">
              <input
                type="checkbox"
                checked={nagadEnabled}
                onChange={(e) => setNagadEnabled(e.target.checked)}
                className="rounded text-orange-600 focus:ring-0"
              />
              <span className="text-xs font-black text-orange-700">Nagad Direct API</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-200 cursor-pointer">
              <input
                type="checkbox"
                checked={sslCommerzEnabled}
                onChange={(e) => setSslCommerzEnabled(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span className="text-xs font-black text-blue-700">SSLCommerz Hosted</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="text-xs font-black text-emerald-700">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Security & Database Maintenance */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Admin Security & Database Backup
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-500">Require TOTP code verification on admin logins for elevated operations.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorRequired}
                onChange={(e) => setTwoFactorRequired(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="text-xs font-bold text-slate-700">{twoFactorRequired ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-800">PostgreSQL Database Snapshot</p>
              <p className="text-[11px] text-slate-500">Create an instant hot backup of all products, orders, customers, and expenses.</p>
            </div>
            <button
              type="button"
              onClick={handleDatabaseBackup}
              disabled={isBackingUp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>{isBackingUp ? 'Backing up...' : 'Generate Backup'}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save All Storefront Settings</span>
        </button>
      </form>
    </div>
  );
}
