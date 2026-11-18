'use client';

import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { Sparkles, Bell, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UPCOMING_GADGETS = [
  {
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    expectedDate: 'September 2026',
    estimatedPrice: '৳1,85,000 - ৳1,95,000',
    description: 'Next-generation Apple Intelligence flagship with A18 Pro chip and new capture button.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
  },
  {
    name: 'Samsung Galaxy Z Fold 6',
    brand: 'Samsung',
    expectedDate: 'August 2026',
    estimatedPrice: '৳2,10,000',
    description: 'Slimmer, lighter foldable with Snapdragon 8 Gen 3 and Galaxy AI enhanced dual-screen multitasking.',
    image: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=600',
  },
  {
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    expectedDate: 'October 2026',
    estimatedPrice: '৳1,20,000',
    description: 'Tensor G4 silicon with Gemini Nano on-device AI and pro triple camera setup.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
  },
];

export default function PreOrderPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleNotify = (productName: string) => {
    if (!emailOrPhone.trim()) {
      toast.error('Please enter your phone number or email first');
      return;
    }
    toast.success(`You will be notified as soon as ${productName} pre-orders open!`);
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Pre-Order' }]} />

      <div className="bg-gradient-to-r from-indigo-900 to-primary-900 rounded-3xl p-8 text-white space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase text-primary-200">
          <Sparkles className="w-4 h-4" />
          <span>Upcoming Flagships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          Pre-Order & Early Stock Alerts
        </h1>
        <p className="text-sm text-gray-300 max-w-xl">
          Be the first in Bangladesh to own the newest gadgets. Register your interest to get guaranteed delivery on launch day with exclusive pre-order gifts.
        </p>

        <div className="max-w-md pt-2 flex gap-2">
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter your phone or email"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {UPCOMING_GADGETS.map((item) => (
          <div
            key={item.name}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition"
          >
            <div>
              <div className="w-full aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <span className="text-xs font-bold uppercase text-primary-600">
                {item.brand}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
                <p>Expected: <strong className="text-gray-900 dark:text-gray-200">{item.expectedDate}</strong></p>
                <p>Est. Price: <strong className="text-primary-600 dark:text-primary-400 font-bold">{item.estimatedPrice}</strong></p>
              </div>
            </div>

            <button
              onClick={() => handleNotify(item.name)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow transition active:scale-95"
            >
              <Bell className="w-4 h-4" />
              <span>Get Notified on Launch</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
