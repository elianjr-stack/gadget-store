'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '../../../components/Breadcrumb';
import ProductGrid from '../../../components/ProductGrid';
import FilterSidebar from '../../../components/FilterSidebar';
import SortDropdown from '../../../components/SortDropdown';
import Pagination from '../../../components/Pagination';
import { Product } from '../../../types';
import { api } from '../../../lib/api';
import { BRAND_COLOR_MAP } from '../../../lib/constants';
import { ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export default function BrandProductsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Resolve dynamic brand color identity
  const brandFallback = BRAND_COLOR_MAP[slug.toLowerCase()] || {
    brandColor: '#4F46E5',
    accentColor: '#06B6D4',
    textColor: '#FFFFFF',
    badgeColor: '#EEF2FF',
  };

  const primaryColor = brand?.brandColor || brandFallback.brandColor;
  const accentColor = brand?.accentColor || brandFallback.accentColor;
  const textColor = brand?.textColor || brandFallback.textColor;
  const badgeColor = brand?.badgeColor || brandFallback.badgeColor;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    // Fetch brand details & products in parallel
    Promise.all([
      api.get(`/brands/${slug}`).catch(() => null),
      api.get(`/products?brandSlug=${slug}&limit=100`).catch(() => null),
    ])
      .then(([brandRes, productsRes]: any) => {
        if (brandRes?.data) {
          setBrand(brandRes.data);
        }

        const rawList = productsRes?.data || [];
        if (rawList.length > 0) {
          const mapped: Product[] = rawList.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            sku: p.sku || '',
            price: Number(p.discountPrice || p.price),
            compareAtPrice: p.discountPrice ? Number(p.price) : null,
            costPrice: null,
            images:
              p.images?.length > 0
                ? p.images.map((img: any, i: number) => ({
                    id: img.id || String(i),
                    url: img.url,
                    alt: img.alt || p.name,
                    isPrimary: img.isMain || i === 0,
                    sortOrder: i,
                  }))
                : [
                    {
                      id: 'def',
                      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
                      alt: p.name,
                      isPrimary: true,
                      sortOrder: 0,
                    },
                  ],
            categoryId: p.categoryId,
            category: p.category,
            brandId: p.brandId,
            brand: p.brand || brandRes?.data,
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
            warranty: p.warrantyMonths ? `${p.warrantyMonths} Months Warranty` : null,
            metaTitle: null,
            metaDescription: null,
            createdAt: p.createdAt || '',
            updatedAt: p.updatedAt || '',
          }));
          setProducts(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const brandDisplayName =
    brand?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(0);
    setInStockOnly(false);
    setMinRating(0);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (minPrice > 0 && p.price < minPrice) return false;
        if (maxPrice > 0 && p.price > maxPrice) return false;
        if (inStockOnly && p.stock <= 0) return false;
        if (minRating > 0 && p.averageRating < minRating) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'soldCount_desc')
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (sortBy === 'avgRating_desc')
          return b.averageRating - a.averageRating;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [products, minPrice, maxPrice, inStockOnly, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Brands', href: '/brands' },
          { label: brandDisplayName },
        ]}
      />

      {/* Dynamic Brand Identity Hero Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-black/20"
              style={{
                backgroundColor: badgeColor,
                color: primaryColor,
              }}
            >
              {brandDisplayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: textColor }}
                >
                  {brandDisplayName}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs"
                  style={{ backgroundColor: badgeColor, color: primaryColor }}
                >
                  Official Brand Portal
                </span>
              </div>
              <p
                className="text-xs sm:text-sm mt-1 max-w-xl opacity-90 leading-relaxed"
                style={{ color: textColor }}
              >
                {brand?.description ||
                  `Explore official ${brandDisplayName} smartphones, smart wearables, earbuds, audio and accessories with authorized warranty across Bangladesh.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold backdrop-blur-md shadow-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: textColor,
              }}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Official BD & Global Warranty</span>
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold backdrop-blur-md shadow-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: textColor,
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>100% Authentic Guaranteed</span>
            </span>
          </div>
        </div>

        {/* Ambient subtle decorative glow */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: badgeColor }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar
            selectedBrands={[]}
            onBrandToggle={() => {}}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
              setCurrentPage(1);
            }}
            inStockOnly={inStockOnly}
            onInStockToggle={() => setInStockOnly(!inStockOnly)}
            minRating={minRating}
            onRatingChange={(r) => {
              setMinRating(r);
              setCurrentPage(1);
            }}
            onReset={handleReset}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                {brandDisplayName} Catalog
              </h2>
              <p className="text-xs text-gray-400">
                Showing {filteredProducts.length} authentic {brandDisplayName} gadgets
              </p>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <ProductGrid
            products={paginatedProducts}
            emptyTitle={`No products currently available for ${brandDisplayName}`}
            emptyDescription={`We are restocking authentic ${brandDisplayName} products right now. Check back shortly!`}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
