'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { POPULAR_BRANDS, BRAND_COLOR_MAP } from '../lib/constants';

export default function BrandCarousel() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Official Brand Showcase
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Discover authorized gadgets with individual brand color identities
          </p>
        </div>
        <Link
          href="/brands"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>All 25 Brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {POPULAR_BRANDS.map((brand) => {
          const slug = brand.toLowerCase();
          const colorInfo = BRAND_COLOR_MAP[slug] || {
            brandColor: '#4F46E5',
            badgeColor: '#EEF2FF',
            textColor: '#FFFFFF',
          };

          return (
            <Link
              key={brand}
              href={`/brands/${slug}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-200 group hover:-translate-y-0.5"
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10 transition-transform group-hover:scale-125"
                style={{ backgroundColor: colorInfo.brandColor }}
              />
              <span className="font-extrabold text-xs sm:text-sm text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition whitespace-nowrap">
                {brand}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
