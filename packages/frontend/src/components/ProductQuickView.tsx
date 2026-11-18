'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store';
import PriceDisplay from './PriceDisplay';
import RatingStars from './RatingStars';
import Badge from './Badge';
import toast from 'react-hot-toast';

export default function ProductQuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, addToWishlist, isInWishlist } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWished = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;
  const mainImage = selectedVariant?.image || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600';

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    toast.success(`${product.name} added to cart!`);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800/40">
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-72 object-contain rounded-2xl"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">
                {product.brand?.name || 'Gadget'}
              </Badge>
              {product.stock > 0 ? (
                <span className="text-xs text-emerald-500 font-semibold">In Stock</span>
              ) : (
                <span className="text-xs text-rose-500 font-semibold">Out of Stock</span>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {product.name}
            </h2>

            <div className="mb-3">
              <RatingStars
                rating={product.averageRating || 4.8}
                reviewCount={product.reviewCount || 10}
              />
            </div>

            <div className="mb-4">
              <PriceDisplay
                price={currentPrice}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />
            </div>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
              {product.shortDescription || product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        selectedVariant?.id === v.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => {
                  addToWishlist(product);
                  toast.success('Added to wishlist');
                }}
                className={`p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-rose-500 transition ${
                  isWished ? 'text-rose-500 fill-rose-500' : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                href={`/products/${product.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline font-semibold"
              >
                <span>View Full Specifications & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
