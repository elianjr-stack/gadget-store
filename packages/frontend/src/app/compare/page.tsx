'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Scale, ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import EmptyState from '../../components/EmptyState';
import PriceDisplay from '../../components/PriceDisplay';
import RatingStars from '../../components/RatingStars';
import { useStore } from '../../lib/store';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useStore();

  if (compareList.length === 0) {
    return (
      <div className="py-8">
        <Breadcrumb items={[{ label: 'Product Comparison' }]} />
        <EmptyState
          title="No Products Selected for Comparison"
          description="You can compare up to 4 gadgets side-by-side to review specs, battery, cameras, prices, and warranties."
          actionText="Browse Products"
          actionHref="/products"
          icon={<Scale className="w-8 h-8" />}
        />
      </div>
    );
  }

  // Collect all unique spec labels
  const allSpecGroups: Record<string, string[]> = {};
  compareList.forEach((product) => {
    product.specifications?.forEach((s) => {
      const grp = s.group || 'General';
      if (!allSpecGroups[grp]) allSpecGroups[grp] = [];
      const label = s.label;
      if (label && !allSpecGroups[grp].includes(label)) {
        allSpecGroups[grp].push(label);
      }
    });
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Product Comparison' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Compare Gadgets ({compareList.length}/4)
          </h1>
          <p className="text-xs text-gray-400">
            Compare prices, specifications, and warranty details side-by-side
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs text-rose-500 hover:underline font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full min-w-[700px] border-collapse bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <tbody>
            {/* Products Header Row */}
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="p-4 w-44 font-bold text-xs uppercase text-gray-400 align-top">
                Gadget
              </td>
              {compareList.map((product) => {
                const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
                return (
                  <td key={product.id} className="p-4 align-top text-center relative w-64 border-l border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="w-28 h-28 mx-auto mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                      <img src={img} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <p className="text-xs text-gray-400 font-bold uppercase">{product.brand?.name}</p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-primary-600 line-clamp-2 mb-2 transition"
                    >
                      {product.name}
                    </Link>

                    <div className="mb-3 flex justify-center">
                      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success('Added to cart!');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                );
              })}
            </tr>

            {/* Ratings Row */}
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <td className="p-3.5 font-bold text-xs uppercase text-gray-500">Rating</td>
              {compareList.map((product) => (
                <td key={product.id} className="p-3.5 text-center border-l border-gray-100 dark:border-gray-800">
                  <div className="flex justify-center">
                    <RatingStars rating={product.averageRating || 4.8} reviewCount={product.reviewCount || 10} size="sm" />
                  </div>
                </td>
              ))}
            </tr>

            {/* Stock Row */}
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="p-3.5 font-bold text-xs uppercase text-gray-500">Availability</td>
              {compareList.map((product) => (
                <td key={product.id} className="p-3.5 text-center text-xs font-bold border-l border-gray-100 dark:border-gray-800">
                  <span className={product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Warranty Row */}
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <td className="p-3.5 font-bold text-xs uppercase text-gray-500">Warranty</td>
              {compareList.map((product) => (
                <td key={product.id} className="p-3.5 text-center text-xs font-medium text-gray-700 dark:text-gray-300 border-l border-gray-100 dark:border-gray-800">
                  {product.warranty || '12 Months Official Warranty'}
                </td>
              ))}
            </tr>

            {/* Dynamic Grouped Specs Rows */}
            {Object.entries(allSpecGroups).map(([groupTitle, labels]) => (
              <React.Fragment key={groupTitle}>
                <tr className="bg-primary-50/60 dark:bg-primary-950/40">
                  <td colSpan={compareList.length + 1} className="p-3 font-extrabold text-xs text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                    {groupTitle}
                  </td>
                </tr>

                {labels.map((lbl) => (
                  <tr key={lbl} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {lbl}
                    </td>
                    {compareList.map((product) => {
                      const spec = product.specifications?.find((s) => s.label === lbl);
                      return (
                        <td key={product.id} className="p-3 text-center text-xs text-gray-800 dark:text-gray-200 font-medium border-l border-gray-100 dark:border-gray-800">
                          {spec?.value || '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
