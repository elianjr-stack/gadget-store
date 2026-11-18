'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types';
import { api } from '../../lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);

    api
      .get(`/products?search=${encodeURIComponent(query)}&limit=50`)
      .then((res: any) => {
        if (res.data) {
          const mapped: Product[] = res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            sku: p.sku || '',
            price: Number(p.discountPrice || p.price),
            compareAtPrice: p.discountPrice ? Number(p.price) : null,
            costPrice: null,
            images: p.images?.length > 0 ? p.images.map((img: any, i: number) => ({
              id: img.id || String(i),
              url: img.url,
              alt: img.alt || p.name,
              isPrimary: img.isMain || i === 0,
              sortOrder: i,
            })) : [{ id: 'def', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', alt: p.name, isPrimary: true, sortOrder: 0 }],
            categoryId: p.categoryId,
            category: p.category,
            brandId: p.brandId,
            brand: p.brand,
            variants: p.variants || [],
            specifications: p.specifications || [],
            reviews: [],
            tags: p.tags || [],
            stock: p.stockQuantity ?? 10,
            lowStockThreshold: 5,
            status: 'active',
            isFeatured: Boolean(p.isFeatured),
            isNewArrival: Boolean(p.isNewArrival),
            isBestSeller: Boolean(p.isBestSeller),
            isFlashDeal: Boolean(p.isFlashDeal),
            isPreOrder: false,
            flashDealEndsAt: null,
            preOrderMessage: null,
            averageRating: Number(p.avgRating) || 4.8,
            reviewCount: p.reviewCount || 10,
            weight: null,
            dimensions: null,
            warranty: null,
            metaTitle: null,
            metaDescription: null,
            createdAt: p.createdAt || '',
            updatedAt: p.updatedAt || '',
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Search Results' },
          { label: `"${query}"` },
        ]}
      />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
            Search Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-xs text-gray-400">
            Found {products.length} products
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Searching products...</div>
      ) : (
        <ProductGrid
          products={products}
          emptyTitle={`No gadgets found for "${query}"`}
          emptyDescription="Try checking your spelling or search by brand name like Apple, Samsung, Xiaomi."
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
