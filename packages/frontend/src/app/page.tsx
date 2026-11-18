'use client';

import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import BrandCarousel from '../components/BrandCarousel';
import CategoryGrid from '../components/CategoryGrid';
import FlashDeals from '../components/FlashDeals';
import BestSellers from '../components/BestSellers';
import NewArrivals from '../components/NewArrivals';
import FeaturedProducts from '../components/FeaturedProducts';
import { api } from '../lib/api';
import { Product } from '../types';

// Curated Bangladesh Market Sample Products fallback
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'A17 Pro chip, titanium design, 48MP main camera with 5x telephoto optical zoom.',
    shortDescription: 'The most powerful iPhone yet with aerospace-grade titanium design.',
    sku: 'APL-IP15PM-256',
    price: 178000,
    compareAtPrice: 185000,
    costPrice: 160000,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', alt: 'iPhone 15 Pro Max', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Smartphones', namebn: 'স্মার্টফোন', slug: 'smartphones', description: null, image: null, icon: '📱', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b1',
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logo: null, description: null, website: null, productCount: 20, isActive: true, createdAt: '', updatedAt: '' },
    variants: [
      { id: 'v1', name: '256GB - Official BD', type: 'storage', value: '256gb', price: 178000, compareAtPrice: 185000, stock: 12, sku: 'APL-256-BD', image: null },
      { id: 'v2', name: '512GB - Official BD', type: 'storage', value: '512gb', price: 198000, compareAtPrice: 205000, stock: 8, sku: 'APL-512-BD', image: null },
    ],
    specifications: [
      { id: 's1', group: 'Display', label: 'Screen', value: '6.7" Super Retina XDR OLED 120Hz', sortOrder: 1 },
      { id: 's2', group: 'Processor', label: 'Chipset', value: 'Apple A17 Pro (3nm)', sortOrder: 2 },
      { id: 's3', group: 'Camera', label: 'Main', value: '48MP + 12MP + 12MP', sortOrder: 3 },
      { id: 's4', group: 'Battery', label: 'Capacity', value: '4422 mAh with 27W Charging', sortOrder: 4 },
    ],
    reviews: [],
    tags: ['iphone', 'apple', 'flagship'],
    stock: 25,
    lowStockThreshold: 5,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isFlashDeal: false,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.9,
    reviewCount: 38,
    weight: 0.221,
    dimensions: null,
    warranty: '12 Months Official Apple Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Galaxy AI is here. 200MP camera, built-in S-Pen, and Snapdragon 8 Gen 3 for Galaxy.',
    shortDescription: 'Galaxy AI flagship with titanium body and 200MP camera.',
    sku: 'SAM-S24U-256',
    price: 158000,
    compareAtPrice: 165000,
    costPrice: 140000,
    images: [
      { id: 'img2', url: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=800', alt: 'Galaxy S24 Ultra', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Smartphones', namebn: 'স্মার্টফোন', slug: 'smartphones', description: null, image: null, icon: '📱', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b2',
    brand: { id: 'b2', name: 'Samsung', slug: 'samsung', logo: null, description: null, website: null, productCount: 20, isActive: true, createdAt: '', updatedAt: '' },
    variants: [
      { id: 'v3', name: '12GB/256GB - Official', type: 'storage', value: '256gb', price: 158000, compareAtPrice: 165000, stock: 15, sku: 'SAM-256-BD', image: null },
    ],
    specifications: [
      { id: 's5', group: 'Display', label: 'Screen', value: '6.8" Dynamic AMOLED 2X QHD+ 120Hz', sortOrder: 1 },
      { id: 's6', group: 'Processor', label: 'Processor', value: 'Snapdragon 8 Gen 3 (4nm)', sortOrder: 2 },
      { id: 's7', group: 'Camera', label: 'Quad Camera', value: '200MP + 50MP + 12MP + 10MP', sortOrder: 3 },
      { id: 's8', group: 'Battery', label: 'Battery', value: '5000 mAh with 45W Fast Charge', sortOrder: 4 },
    ],
    reviews: [],
    tags: ['samsung', 'galaxy', 's24'],
    stock: 20,
    lowStockThreshold: 5,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isFlashDeal: false,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.8,
    reviewCount: 29,
    weight: 0.232,
    dimensions: null,
    warranty: '12 Months Official Samsung Bangladesh Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description: 'Smarter. Brighter. Mightier. Apple S9 SiP with double tap gesture and precision finding.',
    shortDescription: 'Latest Apple Watch with Double Tap and brighter Always-On Retina display.',
    sku: 'APL-AWS9-45',
    price: 52000,
    compareAtPrice: 55000,
    costPrice: 45000,
    images: [
      { id: 'img3', url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', alt: 'Apple Watch Series 9', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c2',
    category: { id: 'c2', name: 'Smart Watches', namebn: 'স্মার্টওয়াচ', slug: 'smart-watches', description: null, image: null, icon: '⌚', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 2, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b1',
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logo: null, description: null, website: null, productCount: 20, isActive: true, createdAt: '', updatedAt: '' },
    variants: [
      { id: 'v4', name: '45mm Midnight', type: 'size', value: '45mm', price: 52000, compareAtPrice: 55000, stock: 15, sku: 'AW-45-MID', image: null },
      { id: 'v5', name: '41mm Starlight', type: 'size', value: '41mm', price: 48000, compareAtPrice: 51000, stock: 10, sku: 'AW-41-STA', image: null },
    ],
    specifications: [
      { id: 's9', group: 'Display', label: 'Screen', value: 'Always-On Retina LTPO OLED 2000 nits', sortOrder: 1 },
      { id: 's10', group: 'Chip', label: 'Processor', value: 'Apple S9 SiP 64-bit dual core', sortOrder: 2 },
      { id: 's11', group: 'Health', label: 'Sensors', value: 'ECG, Blood Oxygen, Heart Rate, Temp', sortOrder: 3 },
    ],
    reviews: [],
    tags: ['apple', 'watch', 'smartwatch'],
    stock: 35,
    lowStockThreshold: 5,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isFlashDeal: false,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.8,
    reviewCount: 22,
    weight: 0.039,
    dimensions: null,
    warranty: '12 Months Official Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'AirPods Pro (2nd Generation)',
    slug: 'airpods-pro-2nd-generation',
    description: 'Up to 2x more Active Noise Cancellation. Adaptive Audio. Transparency mode.',
    shortDescription: 'Pro-level Active Noise Cancellation and immersive Spatial Audio.',
    sku: 'APL-APP2-USB',
    price: 29500,
    compareAtPrice: 32000,
    costPrice: 25000,
    images: [
      { id: 'img4', url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800', alt: 'AirPods Pro 2nd Gen', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c3',
    category: { id: 'c3', name: 'Earbuds & Audio', namebn: 'ইয়ারবাড ও অডিও', slug: 'earbuds-headphones', description: null, image: null, icon: '🎧', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 3, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b1',
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logo: null, description: null, website: null, productCount: 20, isActive: true, createdAt: '', updatedAt: '' },
    variants: [],
    specifications: [
      { id: 's12', group: 'Audio', label: 'Noise Cancellation', value: 'Active Noise Cancellation with Adaptive Audio', sortOrder: 1 },
      { id: 's13', group: 'Battery', label: 'Battery Life', value: 'Up to 6 hours listening, 30 hours with MagSafe case', sortOrder: 2 },
    ],
    reviews: [],
    tags: ['airpods', 'apple', 'anc'],
    stock: 50,
    lowStockThreshold: 5,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isFlashDeal: true,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.9,
    reviewCount: 45,
    weight: 0.05,
    dimensions: null,
    warranty: '12 Months Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Anker 737 Power Bank (PowerCore 26K)',
    slug: 'anker-737-powercore-26k',
    description: '140W ultra-fast two-way charging with digital smart display. Charge laptops and phones.',
    shortDescription: '26,800mAh capacity with 140W high-speed charging output.',
    sku: 'ANK-737-26K',
    price: 7800,
    compareAtPrice: 8500,
    costPrice: 6200,
    images: [
      { id: 'img5', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800', alt: 'Anker 737 Power Bank', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c6',
    category: { id: 'c6', name: 'Power Banks', namebn: 'পাওয়ার ব্যাংক', slug: 'power-banks', description: null, image: null, icon: '🔋', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 6, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b3',
    brand: { id: 'b3', name: 'Anker', slug: 'anker', logo: null, description: null, website: null, productCount: 10, isActive: true, createdAt: '', updatedAt: '' },
    variants: [],
    specifications: [
      { id: 's14', group: 'Power', label: 'Capacity', value: '26,800 mAh', sortOrder: 1 },
      { id: 's15', group: 'Output', label: 'Max Output', value: '140W PD 3.1', sortOrder: 2 },
    ],
    reviews: [],
    tags: ['anker', 'power bank', 'fast charging'],
    stock: 80,
    lowStockThreshold: 10,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isFlashDeal: true,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.8,
    reviewCount: 33,
    weight: 0.635,
    dimensions: null,
    warranty: '18 Months Anker Official Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    name: 'Baseus 65W GaN Charger',
    slug: 'baseus-65w-gan-charger',
    description: 'GaN II fast charging technology with 3 ports (2x USB-C + 1x USB-A). Simultaneous fast charging.',
    shortDescription: 'Compact 65W GaN wall charger for laptops and smartphones.',
    sku: 'BAS-GAN65-3P',
    price: 2500,
    compareAtPrice: 2800,
    costPrice: 1900,
    images: [
      { id: 'img6', url: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800', alt: 'Baseus 65W GaN Charger', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c7',
    category: { id: 'c7', name: 'Chargers & Cables', namebn: 'চার্জার ও ক্যাবল', slug: 'chargers-cables', description: null, image: null, icon: '🔌', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 7, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b4',
    brand: { id: 'b4', name: 'Baseus', slug: 'baseus', logo: null, description: null, website: null, productCount: 15, isActive: true, createdAt: '', updatedAt: '' },
    variants: [],
    specifications: [
      { id: 's16', group: 'Power', label: 'Max Output', value: '65W GaN II', sortOrder: 1 },
      { id: 's17', group: 'Ports', label: 'Interface', value: '2x Type-C, 1x USB-A', sortOrder: 2 },
    ],
    reviews: [],
    tags: ['baseus', 'gan', 'charger'],
    stock: 120,
    lowStockThreshold: 15,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isFlashDeal: true,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.7,
    reviewCount: 42,
    weight: 0.12,
    dimensions: null,
    warranty: '12 Months Replacement Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '7',
    name: 'MacBook Air M3 (13-inch)',
    slug: 'macbook-air-m3-13-inch',
    description: 'Supercharged by M3 chip. Strikingly thin design with up to 18 hours of battery life.',
    shortDescription: 'M3 chip ultrabook with 13.6-inch Liquid Retina display.',
    sku: 'APL-MBA-M3-256',
    price: 138000,
    compareAtPrice: 145000,
    costPrice: 122000,
    images: [
      { id: 'img7', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', alt: 'MacBook Air M3', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c4',
    category: { id: 'c4', name: 'Laptops', namebn: 'ল্যাপটপ', slug: 'laptops', description: null, image: null, icon: '💻', parentId: null, parent: null, children: [], productCount: 10, sortOrder: 4, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b1',
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logo: null, description: null, website: null, productCount: 20, isActive: true, createdAt: '', updatedAt: '' },
    variants: [
      { id: 'v6', name: '8GB/256GB - Midnight', type: 'storage', value: '256gb', price: 138000, compareAtPrice: 145000, stock: 10, sku: 'MBA-256-MID', image: null },
      { id: 'v7', name: '16GB/512GB - Starlight', type: 'storage', value: '512gb', price: 168000, compareAtPrice: 175000, stock: 6, sku: 'MBA-512-STA', image: null },
    ],
    specifications: [
      { id: 's18', group: 'Processor', label: 'Chip', value: 'Apple M3 8-core CPU, 10-core GPU', sortOrder: 1 },
      { id: 's19', group: 'Display', label: 'Display', value: '13.6" Liquid Retina 2560x1664', sortOrder: 2 },
    ],
    reviews: [],
    tags: ['macbook', 'apple', 'm3', 'laptop'],
    stock: 16,
    lowStockThreshold: 3,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isFlashDeal: false,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.9,
    reviewCount: 18,
    weight: 1.24,
    dimensions: null,
    warranty: '12 Months Official Apple Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '8',
    name: 'Realme GT 6',
    slug: 'realme-gt-6',
    description: 'Flagship killer with Snapdragon 8s Gen 3, 120W SuperVOOC charging, and 6000 nits display.',
    shortDescription: 'Snapdragon 8s Gen 3 gaming flagship with 120W charging.',
    sku: 'REL-GT6-256',
    price: 62000,
    compareAtPrice: 65000,
    costPrice: 54000,
    images: [
      { id: 'img8', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', alt: 'Realme GT 6', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Smartphones', namebn: 'স্মার্টফোন', slug: 'smartphones', description: null, image: null, icon: '📱', parentId: null, parent: null, children: [], productCount: 15, sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' },
    brandId: 'b5',
    brand: { id: 'b5', name: 'Realme', slug: 'realme', logo: null, description: null, website: null, productCount: 12, isActive: true, createdAt: '', updatedAt: '' },
    variants: [],
    specifications: [
      { id: 's20', group: 'Processor', label: 'Chipset', value: 'Snapdragon 8s Gen 3 (4nm)', sortOrder: 1 },
      { id: 's21', group: 'Battery', label: 'Charging', value: '5500 mAh + 120W SuperVOOC', sortOrder: 2 },
    ],
    reviews: [],
    tags: ['realme', 'gaming', 'fast charging'],
    stock: 30,
    lowStockThreshold: 5,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    isFlashDeal: true,
    isPreOrder: false,
    flashDealEndsAt: null,
    preOrderMessage: null,
    averageRating: 4.7,
    reviewCount: 19,
    weight: 0.199,
    dimensions: null,
    warranty: '12 Months Official Realme Bangladesh Warranty',
    metaTitle: null,
    metaDescription: null,
    createdAt: '',
    updatedAt: '',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    api
      .get('/products?limit=24')
      .then((res: any) => {
        if (res.data && res.data.length > 0) {
          // Normalize API data to match frontend Product interface
          const mapped: Product[] = res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || p.shortDescription || '',
            shortDescription: p.shortDescription || '',
            sku: p.sku || '',
            price: Number(p.discountPrice || p.price),
            compareAtPrice: p.discountPrice ? Number(p.price) : null,
            costPrice: null,
            images: p.images?.length > 0 ? p.images.map((img: any, idx: number) => ({
              id: img.id || String(idx),
              url: img.url,
              alt: img.alt || p.name,
              isPrimary: img.isMain || idx === 0,
              sortOrder: idx,
            })) : [
              { id: 'def', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: p.name, isPrimary: true, sortOrder: 0 }
            ],
            categoryId: p.categoryId || 'c1',
            category: p.category || { id: 'c1', name: 'Gadgets', namebn: 'গ্যাজেট', slug: 'gadgets', description: null, image: null, icon: null, parentId: null, parent: null, children: [], productCount: 0, sortOrder: 0, isActive: true, createdAt: '', updatedAt: '' },
            brandId: p.brandId || 'b1',
            brand: p.brand || { id: 'b1', name: 'Brand', slug: 'brand', logo: null, description: null, website: null, productCount: 0, isActive: true, createdAt: '', updatedAt: '' },
            variants: p.variants || [],
            specifications: p.specifications || [],
            reviews: p.reviews || [],
            tags: p.tags || [],
            stock: p.stockQuantity ?? 10,
            lowStockThreshold: 5,
            status: 'active',
            isFeatured: Boolean(p.isFeatured),
            isNewArrival: Boolean(p.isNewArrival),
            isBestSeller: Boolean(p.isBestSeller),
            isFlashDeal: Boolean(p.isFlashDeal),
            isPreOrder: false,
            flashDealEndsAt: p.flashDealEnds,
            preOrderMessage: null,
            averageRating: Number(p.avgRating) || 4.8,
            reviewCount: p.reviewCount || 10,
            weight: null,
            dimensions: null,
            warranty: p.warrantyMonths ? `${p.warrantyMonths} Months Official Warranty` : null,
            metaTitle: null,
            metaDescription: null,
            createdAt: p.createdAt || '',
            updatedAt: p.updatedAt || '',
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  const flashDealProducts = products.filter((p) => p.isFlashDeal || p.compareAtPrice);
  const bestSellerProducts = products.filter((p) => p.isBestSeller);
  const newArrivalProducts = products.filter((p) => p.isNewArrival);
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Banner with Trust Highlights */}
      <HeroBanner />

      {/* 2. Brand Carousel (Apple, Samsung, Xiaomi, etc.) */}
      <BrandCarousel />

      {/* 3. Top Categories Grid */}
      <CategoryGrid />

      {/* 4. Flash Deals Countdown & Highlights */}
      <FlashDeals products={flashDealProducts.length > 0 ? flashDealProducts : products.slice(0, 4)} />

      {/* 5. Featured Gadgets */}
      <FeaturedProducts products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)} />

      {/* 6. Best Sellers */}
      <BestSellers products={bestSellerProducts.length > 0 ? bestSellerProducts : products.slice(2, 6)} />

      {/* 7. New Arrivals */}
      <NewArrivals products={newArrivalProducts.length > 0 ? newArrivalProducts : products.slice(0, 4)} />
    </div>
  );
}
