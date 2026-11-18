// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

// ─── Common ──────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
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
    pages: number;
  };
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface ProductVariant {
  name: string;
  options: string[];
  priceAdjustment?: number;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  sku: string;
  brand: Brand | string;
  category: Category | string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  description: string;
  shortDescription?: string;
  specifications: ProductSpec[];
  variants: ProductVariant[];
  images: string[];
  thumbnail?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured: boolean;
  isActive: boolean;
  isNewArrival: boolean;
  tags?: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: Category | string | null;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Brand ───────────────────────────────────────────────────────────────────
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card' | 'bank';

export interface OrderItem {
  product: Product | string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export interface OrderTimeline {
  status: string;
  note?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  district: string;
  postalCode?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer | string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  shippingAddress: ShippingAddress;
  coupon?: string;
  notes?: string;
  timeline: OrderTimeline[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses?: ShippingAddress[];
  isActive: boolean;
  isVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Coupon ──────────────────────────────────────────────────────────────────
export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Banner ──────────────────────────────────────────────────────────────────
export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: 'hero' | 'sidebar' | 'popup' | 'category' | 'footer';
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Page (CMS) ──────────────────────────────────────────────────────────────
export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  template?: string;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  product: Product | string;
  customer: Customer | string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface StoreSettings {
  _id: string;
  storeName: string;
  storeNameBn?: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  email: string;
  phone: string;
  altPhone?: string;
  address?: string;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  freeDeliveryThreshold?: number;
  currency: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  bankDetails?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Staff User ──────────────────────────────────────────────────────────────
export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity Log ────────────────────────────────────────────────────────────
export interface ActivityLog {
  _id: string;
  user: StaffUser | string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  ordersToday: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  productGrowth: number;
  customerGrowth: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  image?: string;
  totalSold: number;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface AnalyticsData {
  revenueOverTime: RevenueDataPoint[];
  ordersByStatus: OrdersByStatus[];
  topBrands: { name: string; revenue: number }[];
  topCategories: { name: string; revenue: number }[];
  paymentMethods: { method: string; count: number }[];
}
