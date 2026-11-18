'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import { DELIVERY_ZONES } from '../../lib/constants';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    deliveryZone,
    setDeliveryZone,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const zoneInfo = DELIVERY_ZONES[deliveryZone];
  const deliveryFee = subtotal >= zoneInfo.freeAbove ? 0 : zoneInfo.charge;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);

    try {
      const res: any = await api.post('/coupons/validate', {
        code: inputCoupon.trim().toUpperCase(),
        orderAmount: subtotal,
      });

      if (res.data?.valid) {
        applyCoupon(inputCoupon.trim().toUpperCase(), res.data.discount);
        toast.success(`Coupon applied! You saved ${formatPrice(res.data.discount)}`);
        setInputCoupon('');
      } else {
        toast.error(res.data?.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not validate coupon');
    } finally {
      setApplying(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-8">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you have not added any gadgets to your cart yet. Explore our latest deals and best sellers!"
          actionText="Start Shopping"
          actionHref="/products"
          icon={<ShoppingBag className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm overflow-hidden">
            {cart.map((item) => {
              const image = item.variant?.image || item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
              return (
                <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 hover:text-primary-600 truncate block transition"
                    >
                      {item.product.name}
                    </Link>

                    {item.variant && (
                      <p className="text-xs text-gray-400">
                        Variant: <strong className="text-gray-600 dark:text-gray-300">{item.variant.name}</strong>
                      </p>
                    )}

                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {formatPrice(item.price)} each
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-primary-600 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Delivery */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-5 shadow-sm">
            <h2 className="font-black text-lg text-gray-900 dark:text-gray-100">
              Order Summary
            </h2>

            {/* Delivery Zone Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Delivery Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('DHAKA')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    deliveryZone === 'DHAKA'
                      ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Inside Dhaka (৳60)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('OUTSIDE_DHAKA')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    deliveryZone === 'OUTSIDE_DHAKA'
                      ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Outside Dhaka (৳120)
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Estimated Delivery: {zoneInfo.estimated}
              </p>
            </div>

            {/* Coupon Application */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Coupon or Voucher
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <Tag className="w-4 h-4" />
                    <span>{couponCode} (-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-500 hover:underline font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-primary-500 font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-700 hover:bg-black text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    {applying ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-gray-800 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black pt-3 border-t border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                <span>Total Amount</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secure Trust Box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3 text-xs text-gray-500">
            <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <span>
              SSL encrypted secure payment. 100% money-back guarantee if goods are damaged in transit.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
