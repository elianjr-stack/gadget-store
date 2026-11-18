'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [streetAddress, setStreetAddress] = useState('');

  useEffect(() => {
    api
      .get('/users/addresses')
      .then((res: any) => {
        if (res.data) setAddresses(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/users/addresses', {
        label: 'Home',
        fullName,
        phone,
        division: 'Dhaka',
        district,
        area: district,
        streetAddress,
        deliveryZone: district.toLowerCase().includes('dhaka') ? 'DHAKA' : 'OUTSIDE_DHAKA',
        isDefault: true,
      });
      setAddresses([...addresses, res.data]);
      setIsAdding(false);
      setFullName('');
      setPhone('');
      setStreetAddress('');
      toast.success('Address saved successfully');
    } catch {
      toast.error('Failed to save address');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Account', href: '/account' },
          { label: 'Saved Addresses' },
        ]}
      />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-gray-400">
            Manage your delivery locations for 1-click checkout
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 shadow-sm animate-fade-in">
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
            Add Shipping Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary-500"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary-500"
            />
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District (e.g. Dhaka)"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary-500"
            />
            <input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="House, Road, Area"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold text-xs"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 space-y-2 relative shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/60 font-bold text-xs">
                  {addr.label || 'Default Address'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                {addr.fullName}
              </h4>
              <p className="text-xs text-gray-500">{addr.phone}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {addr.streetAddress}, {addr.district}, Bangladesh
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 md:col-span-2">
            No saved addresses. Click &ldquo;Add New Address&rdquo; to save one.
          </div>
        )}
      </div>
    </div>
  );
}
