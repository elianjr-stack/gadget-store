'use client';

import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { CATEGORIES_LIST } from '../../lib/constants';
import {
  Smartphone, Watch, Headphones, Laptop, Tablet,
  BatteryCharging, Zap, ShieldCheck, Camera, Gamepad2, ArrowRight
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-8 h-8" />,
  Watch: <Watch className="w-8 h-8" />,
  Headphones: <Headphones className="w-8 h-8" />,
  Laptop: <Laptop className="w-8 h-8" />,
  Tablet: <Tablet className="w-8 h-8" />,
  BatteryCharging: <BatteryCharging className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Camera: <Camera className="w-8 h-8" />,
  Gamepad2: <Gamepad2 className="w-8 h-8" />,
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
          Browse by Categories
        </h1>
        <p className="text-sm text-gray-500">
          Explore smartphones, smartwatches, earbuds, audio gear, and lifestyle tech
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES_LIST.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center justify-between p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {ICON_MAP[cat.icon] || <Smartphone className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{cat.nameBn}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
