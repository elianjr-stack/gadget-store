'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, Truck, RotateCcw, CreditCard, ShoppingBag, Heart,
  Scale, Share2, Check, ArrowRight
} from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';
import ProductGallery from '../../../components/ProductGallery';
import ProductVariantSelector from '../../../components/ProductVariantSelector';
import ProductSpecs from '../../../components/ProductSpecs';
import ProductReviews from '../../../components/ProductReviews';
import PriceDisplay from '../../../components/PriceDisplay';
import RatingStars from '../../../components/RatingStars';
import Badge from '../../../components/Badge';
import ProductGrid from '../../../components/ProductGrid';
import { useStore } from '../../../lib/store';
import { useLanguage } from '../../../hooks/useLanguage';
import { formatPrice } from '../../../lib/utils';
import { api } from '../../../lib/api';
import { Product, ProductVariant } from '../../../types';
import { BRAND_COLOR_MAP } from '../../../lib/constants';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { lang, t } = useLanguage();

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, addToCompare, addRecentlyViewed } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'warranty' | 'reviews'>('specs');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api
      .get(`/products/${slug}`)
      .then((res: any) => {
        if (res.data) {
          const p = res.data;
          const mapped: Product = {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            sku: p.sku,
            price: Number(p.discountPrice || p.price),
            compareAtPrice: p.discountPrice ? Number(p.price) : null,
            costPrice: null,
            images: p.images?.length > 0 ? p.images.map((img: any, i: number) => ({
              id: img.id || String(i),
              url: img.url,
              alt: img.alt || p.name,
              isPrimary: img.isMain || i === 0,
              sortOrder: i,
            })) : [{ id: 'def', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: p.name, isPrimary: true, sortOrder: 0 }],
            categoryId: p.categoryId,
            category: p.category,
            brandId: p.brandId,
            brand: p.brand,
            variants: p.variants?.map((v: any) => ({
              id: v.id,
              name: v.name,
              type: v.type?.toLowerCase() || 'storage',
              value: v.value,
              price: Number(v.price || p.price),
              compareAtPrice: null,
              stock: v.stock ?? 10,
              sku: v.sku || '',
              image: v.image || null,
            })) || [],
            specifications: p.specifications?.map((s: any) => ({
              id: s.id,
              group: s.group,
              label: s.name,
              value: s.value,
              sortOrder: s.sortOrder || 0,
            })) || [],
            reviews: p.reviews?.map((r: any) => ({
              id: r.id,
              productId: p.id,
              userId: r.user?.id || '',
              user: { id: r.user?.id || '', name: r.user?.name || 'Customer', avatar: null },
              rating: r.rating,
              title: r.title || '',
              comment: r.comment || '',
              pros: [],
              cons: [],
              isVerified: true,
              helpfulCount: r.helpfulCount || 0,
              images: [],
              createdAt: r.createdAt || '',
              updatedAt: '',
            })) || [],
            tags: p.tags || [],
            stock: p.stockQuantity ?? 15,
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
            reviewCount: p.reviewCount || 15,
            weight: null,
            dimensions: null,
            warranty: p.warrantyMonths ? `${p.warrantyMonths} Months Official Warranty` : '12 Months Official Warranty',
            metaTitle: null,
            metaDescription: null,
            createdAt: p.createdAt || '',
            updatedAt: p.updatedAt || '',
          };

          setProduct(mapped);
          addRecentlyViewed(mapped);

          if (mapped.variants && mapped.variants.length > 0) {
            setSelectedVariant(mapped.variants[0]);
          }

          // Extract related products
          if (p.relatedFrom && p.relatedFrom.length > 0) {
            const rel = p.relatedFrom.map((rf: any) => rf.related);
            setRelatedProducts(rel);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <Link href="/products" className="text-primary-600 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;
  const emiMonthly = Math.round(currentPrice / 12);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (isWished) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Saved to wishlist');
    }
  };

  const handleCompare = () => {
    const ok = addToCompare(product);
    if (ok) toast.success('Added to comparison');
    else toast.error('Already in comparison or maximum 4 items');
  };

  return (
    <div className="space-y-10">
      <Breadcrumb
        items={[
          { label: product.category?.name || 'Category', href: `/categories/${product.category?.slug}` },
          { label: product.brand?.name || 'Brand', href: `/brands/${product.brand?.slug}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details & Purchase Actions */}
        <div className="space-y-5">
          {/* Brand & Stock */}
          <div className="flex items-center justify-between">
            {(() => {
              const bSlug = product.brand?.slug || product.brand?.name?.toLowerCase().replace(/\s+/g, '-') || '';
              const bPalette = BRAND_COLOR_MAP[bSlug] || {
                brandColor: (product.brand as any)?.brandColor || '#4F46E5',
                badgeColor: (product.brand as any)?.badgeColor || '#EEF2FF',
                textColor: (product.brand as any)?.textColor || '#FFFFFF',
              };
              const activeColor = (product.brand as any)?.brandColor || bPalette.brandColor;
              const activeBadge = (product.brand as any)?.badgeColor || bPalette.badgeColor;
              return (
                <Link
                  href={`/brands/${bSlug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition hover:opacity-90 shadow-xs"
                  style={{ backgroundColor: activeBadge, color: activeColor }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }} />
                  <span>{product.brand?.name || 'Brand'}</span>
                </Link>
              );
            })()}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                product.stock > 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {product.stock > 0 ? 'In Stock (Available)' : 'Out of Stock'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>

          {/* SKU & Ratings */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pb-2 border-b border-gray-100 dark:border-gray-800">
            <span>SKU: <strong className="text-gray-800 dark:text-gray-200">{product.sku}</strong></span>
            <span>•</span>
            <RatingStars
              rating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          </div>

          {/* Price & EMI */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-2">
            <PriceDisplay
              price={currentPrice}
              compareAtPrice={product.compareAtPrice}
              size="xl"
            />
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CreditCard className="w-4 h-4 text-primary-600" />
              <span>
                0% EMI available starting from <strong className="text-gray-900 dark:text-white">{formatPrice(emiMonthly)}/month</strong> (Up to 12 months)
              </span>
            </div>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          <ProductVariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          {/* Quantity & CTA */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Quick Actions (Wishlist & Compare) */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={handleWishlist}
                className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                  isWished ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500' : ''}`} />
                <span>{isWished ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleCompare}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Specs</span>
              </button>
            </div>
          </div>

          {/* Delivery & Warranty Trust Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Official Warranty</span>
                <span className="text-[11px] text-gray-400">{product.warranty || '1 Year Coverage'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">Fast Delivery</span>
                <span className="text-[11px] text-gray-400">Dhaka 24H | Outside 48H</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-bold block text-gray-900 dark:text-gray-100">7 Days Return</span>
                <span className="text-[11px] text-gray-400">If damaged or defective</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Tabs */}
      <div className="pt-6">
        <div className="flex border-b border-gray-200 dark:border-gray-800 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
              activeTab === 'specs'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Full Specifications
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
              activeTab === 'desc'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Description & Overview
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
              activeTab === 'warranty'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Warranty & Policy
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
              activeTab === 'reviews'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Customer Reviews ({product.reviewCount || 0})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'specs' && (
            <ProductSpecs specifications={product.specifications} />
          )}

          {activeTab === 'desc' && (
            <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{product.description || product.shortDescription}</p>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Key Highlights:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>100% Genuine and Authentic gadget from {product.brand?.name}</li>
                  <li>Eligible for nationwide courier home delivery and cash on delivery</li>
                  <li>Support for EMI installment with 20+ major Bangladeshi banks</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Official Warranty Policy & Support
              </h3>
              <p>
                This product comes with <strong className="text-gray-900 dark:text-white">{product.warranty || '12 Months Official Warranty'}</strong> coverage.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>Hardware defect warranty supported by authorized brand service centers.</li>
                <li>7 Days Replacement warranty for dead-on-arrival or unrepairable factory defects.</li>
                <li>Physical damage, water damage, or unauthorized modifications void warranty coverage.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviews
              productId={product.id}
              reviews={product.reviews}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
