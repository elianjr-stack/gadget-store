'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Package, FileText, Phone } from 'lucide-react';
import { HOTLINE_NUMBER } from '../../../lib/constants';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('orderNumber') || 'GS-2026-9482';

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
          Order Confirmed!
        </h1>
        <p className="text-sm text-gray-500">
          Thank you for choosing Zynox Gadgets. Your order has been placed and is being processed for courier dispatch.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 text-left shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Order Reference
          </span>
          <span className="font-extrabold text-sm text-primary-600 dark:text-primary-400">
            #{orderNumber}
          </span>
        </div>

        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p>
            ✅ A confirmation SMS and Invoice PDF have been dispatched to your provided mobile number and email.
          </p>
          <p>
            🚚 Inside Dhaka deliveries will arrive within 24-48 hours. Outside Dhaka orders will be handed over to Steadfast / Pathao courier.
          </p>
        </div>
      </div>

      {/* Help / Hotline */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Phone className="w-4 h-4 text-emerald-500" />
        <span>Need urgent assistance? Call our hotline at <strong>{HOTLINE_NUMBER}</strong></span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/account/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-gray-800 text-white font-bold text-sm hover:bg-black transition shadow"
        >
          <Package className="w-4 h-4" />
          <span>Track Order</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition shadow"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading order details...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
