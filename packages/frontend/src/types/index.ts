// ─── Product ────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  images: ProductImage[];
  categoryId: string;
  category: Category;
  brandId: string;
  brand: Brand;
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  reviews: Review[];
  tags: string[];
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFlashDeal: boolean;
  isPreOrder: boolean;
  flashDealEndsAt: string | null;
  preOrderMessage: string | null;
  averageRating: number;
  reviewCount: number;
  weight: number | null;
  dimensions: string | null;
  warranty: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'storage' | 'ram' | 'size' | 'region' | 'model';
  value: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string;
  image: string | null;
}

export interface ProductSpecification {
  id: string;
  group: string;
  label: string;
  value: string;
  sortOrder: number;
}

// ─── Category ───────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  namebn: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  parent: Category | null;
  children: Category[];
  productCount: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Brand ──────────────────────────────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ─────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: UserSummary;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  isVerified: boolean;
  helpfulCount: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  avatar: string | null;
}

// ─── Cart ───────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string | null;
  variant: ProductVariant | null;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
}

// ─── Order ──────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  shippingAddress: Address;
  billingAddress: Address | null;
  notes: string | null;
  couponCode: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string | null;
  variant: ProductVariant | null;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  note: string;
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod =
  | 'cod'
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'card'
  | 'bank_transfer'
  | 'sslcommerz';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'customer' | 'admin';
  addresses: Address[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  district: string;
  division: string;
  postalCode: string;
  isDefault: boolean;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// ─── Banner ─────────────────────────────────────────────────────────────────
export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  link: string | null;
  buttonText: string | null;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
}

// ─── CMS Page ───────────────────────────────────────────────────────────────
export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Coupon ─────────────────────────────────────────────────────────────────
export interface Coupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount: number;
  maxDiscount: number | null;
  message: string;
}

// ─── API Response ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ─── Filter & Sort ──────────────────────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashDeal?: boolean;
  isPreOrder?: boolean;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'popular'
  | 'rating'
  | 'name_asc'
  | 'name_desc';

// ─── Search ─────────────────────────────────────────────────────────────────
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price?: number;
}

// ─── i18n ───────────────────────────────────────────────────────────────────
export type Language = 'en' | 'bn';

export interface Translations {
  [key: string]: string;
}
