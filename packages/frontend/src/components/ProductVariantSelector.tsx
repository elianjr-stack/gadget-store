'use client';

import React from 'react';
import { ProductVariant } from '../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function ProductVariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  // Group variants by type (e.g. storage, color, region)
  const grouped: Record<string, ProductVariant[]> = {};
  variants.forEach((v) => {
    const type = v.type || 'option';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(v);
  });

  return (
    <div className="space-y-4 my-4">
      {Object.entries(grouped).map(([typeName, items]) => (
        <div key={typeName}>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Select {typeName}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {items.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelect(variant)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 ring-2 ring-primary-600/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <span>{variant.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
