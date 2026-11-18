'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Scale } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatPrice } from '../lib/utils';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 hidden sm:inline">
              Compare Products ({compareList.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {compareList.map((product) => {
              const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200';
              return (
                <div
                  key={product.id}
                  className="relative group flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 pr-6"
                >
                  <div className="relative w-8 h-8 rounded overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                      {product.name}
                    </p>
                    <p className="text-primary-600 dark:text-primary-400 font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 p-0.5 rounded-full"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline hidden sm:inline"
          >
            Clear All
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow transition"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
