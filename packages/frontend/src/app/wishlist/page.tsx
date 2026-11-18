'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import EmptyState from '../../components/EmptyState';
import PriceDisplay from '../../components/PriceDisplay';
import { useStore } from '../../lib/store';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="py-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <EmptyState
          title="Your Wishlist is Empty"
          description="Explore your favorite smartphones, smartwatches, and accessories and click the heart icon to save them here."
          actionText="Discover Gadgets"
          actionHref="/products"
          icon={<Heart className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          My Wishlist ({wishlist.length} Items)
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => {
          const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400';
          return (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <button
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.success('Removed from wishlist');
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-rose-500 transition z-10"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  className="block relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/40 mb-3"
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                  />
                </Link>

                <p className="text-xs text-gray-400 uppercase font-semibold">
                  {product.brand?.name}
                </p>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-primary-600 truncate transition">
                    {product.name}
                  </h3>
                </Link>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 mt-3">
                <PriceDisplay
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  size="sm"
                />

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toast.success('Added to cart!');
                  }}
                  className="p-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition"
                  title="Add to Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
