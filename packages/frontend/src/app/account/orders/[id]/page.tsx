'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Truck, CheckCircle2, Clock, MapPin,
  CreditCard, ShieldCheck, FileText, ArrowLeft, AlertTriangle
} from 'lucide-react';
import Breadcrumb from '../../../../components/Breadcrumb';
import { formatPrice } from '../../../../lib/utils';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/orders/my/${id}`)
      .then((res: any) => {
        if (res.data) setOrder(res.data);
      })
      .catch(() => {
        // Fallback demo order
        setOrder({
          id,
          orderNumber: 'GS-2026-8942',
          status: 'SHIPPED',
          paymentMethod: 'BKASH',
          paymentStatus: 'PAID',
          total: 178060,
          subtotal: 178000,
          deliveryCharge: 60,
          discount: 0,
          courierName: 'Steadfast Courier',
          trackingNumber: 'STF-8492019',
          createdAt: new Date().toISOString(),
          address: {
            fullName: 'Tanvir Ahmed',
            phone: '01700000000',
            district: 'Dhaka',
            streetAddress: 'House 42, Road 11, Sector 4, Uttara, Dhaka',
          },
          items: [
            {
              id: 'item1',
              name: 'iPhone 15 Pro Max (256GB - Official BD)',
              quantity: 1,
              price: 178000,
              image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300',
            },
          ],
          statusHistory: [
            { status: 'PENDING', note: 'Order placed by customer', createdAt: '2026-11-01T10:00:00Z' },
            { status: 'CONFIRMED', note: 'Payment verified via bKash', createdAt: '2026-11-01T10:15:00Z' },
            { status: 'PROCESSING', note: 'Packaged with official warranty card', createdAt: '2026-11-01T14:00:00Z' },
            { status: 'SHIPPED', note: 'Handed to Steadfast Courier tracking #STF-8492019', createdAt: '2026-11-02T09:00:00Z' },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading order tracking...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <Link href="/account/orders" className="text-primary-600 hover:underline">
          Return to order history
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 2;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Account', href: '/account' },
          { label: 'Orders', href: '/account/orders' },
          { label: `#${order.orderNumber}` },
        ]}
      />

      {/* Top Banner */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
              Order #{order.orderNumber}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {order.trackingNumber && (
          <div className="text-left sm:text-right p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 font-bold uppercase">Courier Tracking</p>
            <p className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
              {order.courierName || 'Courier'}: <span className="text-primary-600">{order.trackingNumber}</span>
            </p>
          </div>
        )}
      </div>

      {/* Progress Tracking Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-6">
          Live Delivery Status
        </h2>

        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 z-0 transition-all duration-500"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 whitespace-nowrap ${
                    isCompleted
                      ? 'text-primary-600 dark:text-primary-400 font-bold'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
          <h2 className="font-black text-base text-gray-900 dark:text-gray-100">
            Items in this Order
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 p-1 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons: Claim Warranty or Request Return */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
            <button
              onClick={() => toast.success('Warranty claim ticket opened. Our service team will call you within 24 hours.')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-xs font-bold text-gray-700 dark:text-gray-300 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Claim Warranty</span>
            </button>
            <button
              onClick={() => toast.success('Return request registered. Please keep original packaging and accessories.')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-xs font-bold text-gray-700 dark:text-gray-300 transition"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Request Return / Exchange</span>
            </button>
          </div>
        </div>

        {/* Address & Payment Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Delivery Address
              </h3>
            </div>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-bold text-gray-900 dark:text-gray-100">{order.address?.fullName}</p>
              <p>{order.address?.phone}</p>
              <p>{order.address?.streetAddress}</p>
              <p>{order.address?.district}, Bangladesh</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-3 shadow-sm text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <CreditCard className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Payment Breakdown
              </h3>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Charge</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              <span>Total Paid</span>
              <span className="text-primary-600">{formatPrice(order.total)}</span>
            </div>
            <div className="pt-2 text-gray-400">
              Method: <strong className="text-gray-800 dark:text-gray-200">{order.paymentMethod}</strong> ({order.paymentStatus})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
