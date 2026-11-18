import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function RatingStars({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}: RatingStarsProps) {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <Star
          key={i}
          className={`${starSizes[size]} fill-amber-400 text-amber-400`}
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          className={`${starSizes[size]} fill-amber-400 text-amber-400`}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`${starSizes[size]} text-gray-300 dark:text-gray-600`}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">{stars}</div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
