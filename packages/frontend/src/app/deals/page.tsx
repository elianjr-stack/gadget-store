'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types';
import { api } from '../../lib/api';
import { Flame } from 'lucide-react';

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?isFlashDeal=true&limit=24')
      .then((res: any) => {
        if (res.data && res.data.length > 0) {
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
            isFlashDeal: true,
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
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Flash Deals' }]} />

      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase">
            <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Exclusive Promo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Flash Deals & Mega Discounts
          </h1>
          <p className="text-sm text-white/90 max-w-lg">
            Save up to 35% on genuine smartphones, smartwatches, earbuds, and premium charging accessories.
          </p>
        </div>
      </div>

      <ProductGrid
        products={products}
        emptyTitle="No flash deals active right now"
        emptyDescription="Check back soon! New flash deals are launched every week."
      />
    </div>
  );
}
