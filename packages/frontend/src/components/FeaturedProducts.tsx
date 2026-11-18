import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
              Featured Gadgets
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Curated by our tech experts with best value for money
            </p>
          </div>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <ProductGrid products={products.slice(0, 8)} />
    </section>
  );
}
