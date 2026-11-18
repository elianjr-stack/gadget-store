'use client';

import React from 'react';
import { formatPrice, formatPriceBn, calculateDiscount } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export default function PriceDisplay({
  price,
  compareAtPrice,
  size = 'md',
  showBadge = true,
}: PriceDisplayProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const discount = calculateDiscount(price, compareAtPrice);

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-extrabold',
    xl: 'text-2xl sm:text-3xl font-extrabold',
  };

  const oldSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
  };

  return (
    <div className="flex items-baseline flex-wrap gap-2">
      <span className={`text-primary-600 dark:text-primary-400 ${sizeClasses[size]}`}>
        {isBn ? formatPriceBn(price) : formatPrice(price)}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <span className={`text-gray-400 dark:text-gray-500 line-through font-normal ${oldSizeClasses[size]}`}>
          {isBn ? formatPriceBn(compareAtPrice) : formatPrice(compareAtPrice)}
        </span>
      )}

      {showBadge && discount > 0 && (
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
          -{isBn ? `${discount}%` : `${discount}% OFF`}
        </span>
      )}
    </div>
  );
}
