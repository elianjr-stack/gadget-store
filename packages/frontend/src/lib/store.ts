import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '../types';

export interface CartStoreItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  quantity: number;
  price: number;
}

interface StoreState {
  // Language & Theme
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;

  // Cart
  cart: CartStoreItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  deliveryZone: 'DHAKA' | 'OUTSIDE_DHAKA';
  setDeliveryZone: (zone: 'DHAKA' | 'OUTSIDE_DHAKA') => void;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare (max 4 products)
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // User auth state
  token: string | null;
  user: any | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),

      cart: [],
      addToCart: (product, quantity = 1, variant = null) => {
        const currentCart = get().cart;
        const variantId = variant ? variant.id : null;
        const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;

        const existingIndex = currentCart.findIndex((item) => item.id === cartItemId);
        const itemPrice = variant?.price || product.price;

        if (existingIndex > -1) {
          const newCart = [...currentCart];
          newCart[existingIndex].quantity += quantity;
          set({ cart: newCart });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                id: cartItemId,
                productId: product.id,
                product,
                variantId,
                variant,
                quantity,
                price: itemPrice,
              },
            ],
          });
        }
      },
      removeFromCart: (cartItemId) => {
        set({ cart: get().cart.filter((item) => item.id !== cartItemId) });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [], couponCode: null, discountAmount: 0 }),

      couponCode: null,
      discountAmount: 0,
      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      deliveryZone: 'DHAKA',
      setDeliveryZone: (zone) => set({ deliveryZone: zone }),

      wishlist: [],
      addToWishlist: (product) => {
        if (!get().wishlist.some((item) => item.id === product.id)) {
          set({ wishlist: [...get().wishlist, product] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      compareList: [],
      addToCompare: (product) => {
        const current = get().compareList;
        if (current.some((p) => p.id === product.id)) return false;
        if (current.length >= 4) return false;
        set({ compareList: [...current, product] });
        return true;
      },
      removeFromCompare: (productId) => {
        set({ compareList: get().compareList.filter((p) => p.id !== productId) });
      },
      clearCompare: () => set({ compareList: [] }),

      recentlyViewed: [],
      addRecentlyViewed: (product) => {
        const filtered = get().recentlyViewed.filter((p) => p.id !== product.id);
        set({ recentlyViewed: [product, ...filtered].slice(0, 10) });
      },

      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      token: null,
      user: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: 'gadgetstore-storage',
      partialize: (state) => ({
        lang: state.lang,
        cart: state.cart,
        wishlist: state.wishlist,
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed,
        token: state.token,
        user: state.user,
        deliveryZone: state.deliveryZone,
      }),
    }
  )
);
