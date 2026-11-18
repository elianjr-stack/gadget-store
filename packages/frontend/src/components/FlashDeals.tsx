'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface FlashDealsProps {
  products: Product[];
}

export default function FlashDeals({ products }: FlashDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent rounded-3xl p-5 sm:p-7 border border-amber-500/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
              Flash Deals
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Limited time offers on top gadgets & accessories
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-gray-900 text-amber-400 font-black text-sm flex items-center justify-center shadow">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">HOURS</span>
          </div>
          <span className="text-gray-400 font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-gray-900 text-amber-400 font-black text-sm flex items-center justify-center shadow">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">MINS</span>
          </div>
          <span className="text-gray-400 font-bold mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-gray-900 text-amber-400 font-black text-sm flex items-center justify-center shadow">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">SECS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <span>View All Flash Deals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
