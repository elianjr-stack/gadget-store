'use client';

import React, { useState } from 'react';
import { ProductImage } from '../types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const defaultImages = images && images.length > 0 ? images : [
    {
      id: 'default',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      alt: productName,
      isPrimary: true,
      sortOrder: 0,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = defaultImages[activeIndex]?.url || defaultImages[0].url;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Bar */}
      {defaultImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-96 py-1">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-gray-800 flex-shrink-0 transition ${
                activeIndex === idx
                  ? 'border-primary-600 shadow-md'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image View */}
      <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-center p-6 group cursor-crosshair">
        <img
          src={activeImage}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}
