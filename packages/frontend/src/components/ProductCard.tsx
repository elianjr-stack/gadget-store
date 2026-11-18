'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Scale, Check } from 'lucide-react';
import { Product } from '../types';
import PriceDisplay from './PriceDisplay';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useStore } from '../lib/store';
import { useLanguage } from '../hooks/useLanguage';
import { BRAND_COLOR_MAP } from '../lib/constants';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, formatText } = useLanguage();
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToCompare,
    setQuickViewProduct,
  } = useStore();

  const isWished = isInWishlist(product.id);
  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600';

  // Dynamic Brand Color Resolution (DB primary, fallback to Bangladesh map)
  const brandSlug = product.brand?.slug || product.brand?.name?.toLowerCase().replace(/\s+/g, '-') || '';
  const brandFallback = BRAND_COLOR_MAP[brandSlug] || {
    brandColor: (product.brand as any)?.brandColor || '#4F46E5',
    badgeColor: (product.brand as any)?.badgeColor || '#EEF2FF',
    textColor: (product.brand as any)?.textColor || '#FFFFFF',
    accentColor: (product.brand as any)?.accentColor || '#06B6D4',
  };
  const activeBrandColor = (product.brand as any)?.brandColor || brandFallback.brandColor;
  const activeBadgeColor = (product.brand as any)?.badgeColor || brandFallback.badgeColor;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Saved to wishlist');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addToCompare(product);
    if (added) {
      toast.success('Added to comparison');
    } else {
      toast.error('Max 4 products or already in compare list');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 sm:p-4 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.isFlashDeal && (
            <Badge variant="warning" size="sm">
              Deal
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="info" size="sm">
              New
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="primary" size="sm">
              Hot
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
            isWished
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-gray-800 shadow-sm'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 mb-3 group-hover:scale-105 transition-transform duration-300">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />

          {/* Hover Quick Action Buttons */}
          <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickView}
              className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white text-gray-700 dark:text-gray-200 shadow-md transition"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleCompare}
              className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white text-gray-700 dark:text-gray-200 shadow-md transition"
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Brand & Stock Status with Dynamic Brand Color */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <Link
            href={`/brands/${brandSlug}`}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-transform hover:scale-105 shadow-2xs"
            style={{ backgroundColor: activeBadgeColor, color: activeBrandColor }}
            title={`Explore official ${product.brand?.name} catalog`}
          >
            {product.brand?.name || 'Gadget'}
          </Link>
          <span className={product.stock > 0 ? 'text-emerald-500 font-bold text-[11px]' : 'text-rose-500 font-bold text-[11px]'}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="block mb-2 group/title">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2 group-hover/title:text-primary-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="mb-2">
          <RatingStars
            rating={product.averageRating || 4.8}
            reviewCount={product.reviewCount || 12}
            size="sm"
          />
        </div>
      </div>

      {/* Price & Add to Cart */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
        />

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
