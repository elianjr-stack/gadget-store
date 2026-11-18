import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 animate-pulse">
      <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2" />
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-4/5 mb-3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-8 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
