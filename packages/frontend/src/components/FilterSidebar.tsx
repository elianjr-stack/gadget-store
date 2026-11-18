'use client';

import React, { useState } from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { POPULAR_BRANDS } from '../lib/constants';

interface FilterSidebarProps {
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  inStockOnly: boolean;
  onInStockToggle: () => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  selectedBrands,
  onBrandToggle,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onInStockToggle,
  minRating,
  onRatingChange,
  onReset,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : '');
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : '');

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(Number(localMin) || 0, Number(localMax) || 0);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onInStockToggle}
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Price Range (BDT)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold transition"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Brands
        </h4>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-sm">
          {POPULAR_BRANDS.map((brand) => {
            const isSelected = selectedBrands.includes(brand.toLowerCase());
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary-600 transition"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onBrandToggle(brand.toLowerCase())}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="text-xs font-medium">{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(minRating === r ? 0 : r)}
              className={`flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                minRating === r
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span>{r} Stars & Above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
