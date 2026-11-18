'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone, Watch, Headphones, Laptop, Tablet,
  BatteryCharging, Zap, ShieldCheck, Camera, Gamepad2, ArrowRight
} from 'lucide-react';
import { CATEGORIES_LIST } from '../lib/constants';
import { useLanguage } from '../hooks/useLanguage';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6" />,
  Watch: <Watch className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Tablet: <Tablet className="w-6 h-6" />,
  BatteryCharging: <BatteryCharging className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
};

export default function CategoryGrid() {
  const { lang } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
            {lang === 'bn' ? 'শীর্ষ ক্যাটাগরি' : 'Explore Top Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Browse through all gadget categories from top global brands
          </p>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORIES_LIST.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {ICON_MAP[cat.icon] || <Smartphone className="w-6 h-6" />}
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition">
              {lang === 'bn' ? cat.nameBn : cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
