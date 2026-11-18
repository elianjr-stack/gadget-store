'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { POPULAR_BRANDS, BRAND_COLOR_MAP } from '../../lib/constants';
import { ArrowRight, Tag, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/brands')
      .then((res: any) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
        } else {
          fallbackBrands();
        }
      })
      .catch(() => {
        fallbackBrands();
      })
      .finally(() => setLoading(false));
  }, []);

  const fallbackBrands = () => {
    const list = POPULAR_BRANDS.map((name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const palette = BRAND_COLOR_MAP[slug] || {
        brandColor: '#4F46E5',
        accentColor: '#06B6D4',
        textColor: '#FFFFFF',
        badgeColor: '#EEF2FF',
      };
      return {
        id: slug,
        name,
        slug,
        brandColor: palette.brandColor,
        accentColor: palette.accentColor,
        textColor: palette.textColor,
        badgeColor: palette.badgeColor,
        productCount: 8,
      };
    });
    setBrands(list);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Official Brands' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dynamic Brand Ecosystem</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
          Official Brands in Bangladesh
        </h1>
        <p className="text-sm text-gray-500">
          Explore authentic gadgets from top global & local manufacturers with 100% official warranty
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {brands.map((brand) => {
          const slug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');
          const palette = BRAND_COLOR_MAP[slug] || {
            brandColor: brand.brandColor || '#4F46E5',
            accentColor: brand.accentColor || '#06B6D4',
            textColor: brand.textColor || '#FFFFFF',
            badgeColor: brand.badgeColor || '#EEF2FF',
          };
          const activeColor = brand.brandColor || palette.brandColor;
          const activeBadge = brand.badgeColor || palette.badgeColor;

          return (
            <Link
              key={brand.id || brand.slug}
              href={`/brands/${slug}`}
              className="group flex flex-col items-center justify-between p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
              style={{
                borderColor: undefined,
              }}
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:h-2 transition-all duration-200"
                style={{ backgroundColor: activeColor }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mb-3 shadow-xs transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: activeBadge,
                  color: activeColor,
                }}
              >
                {brand.name.charAt(0)}
              </div>

              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition">
                  {brand.name}
                </h3>
                <span className="text-[11px] text-gray-400 block font-medium">
                  {brand.country ? `${brand.country}` : 'Official Warranty'}
                </span>
              </div>

              <div
                className="mt-3 text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors"
                style={{
                  backgroundColor: activeBadge,
                  color: activeColor,
                }}
              >
                Explore Catalog &rarr;
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
