import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Most popular phones, audio gear and smartwatches in Bangladesh
            </p>
          </div>
        </div>
        <Link
          href="/products?sort=popular"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <ProductGrid products={products.slice(0, 8)} />
    </section>
  );
}
