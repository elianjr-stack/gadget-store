'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import ProductGrid from '../../components/ProductGrid';
import FilterSidebar from '../../components/FilterSidebar';
import SortDropdown from '../../components/SortDropdown';
import Pagination from '../../components/Pagination';
import { Product } from '../../types';
import { api } from '../../lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    api
      .get('/products?limit=100')
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
            category: p.category || { id: 'c1', name: 'Gadgets', slug: 'gadgets' },
            brandId: p.brandId,
            brand: p.brand || { id: 'b1', name: 'Brand', slug: 'brand' },
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(0);
    setInStockOnly(false);
    setMinRating(0);
    setCurrentPage(1);
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrands.length > 0) {
        const brandName = p.brand?.name?.toLowerCase() || '';
        const brandSlug = p.brand?.slug?.toLowerCase() || '';
        const matchesBrand = selectedBrands.some(
          (b) => brandName.includes(b) || brandSlug.includes(b)
        );
        if (!matchesBrand) return false;
      }
      if (minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice > 0 && p.price > maxPrice) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (minRating > 0 && p.averageRating < minRating) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'soldCount_desc') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'avgRating_desc') return b.averageRating - a.averageRating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedBrands, minPrice, maxPrice, inStockOnly, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'All Products' }]} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                All Products
              </h1>
              <p className="text-xs text-gray-400">
                Showing {filteredProducts.length} items
              </p>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <ProductGrid products={paginatedProducts} />

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
