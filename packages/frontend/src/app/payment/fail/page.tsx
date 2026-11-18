'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import { HOTLINE_NUMBER } from '../../../lib/constants';

export default function PaymentFailPage() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-md">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Payment Unsuccessful
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Your transaction could not be processed. No money was deducted from your account. You can retry with bKash, Nagad, Card, or choose Cash on Delivery.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm shadow hover:bg-primary-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-200 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
      </div>

      <p className="text-xs text-gray-400">
        If amount was debited, it will be refunded within 24-72 hours. Need help? Call {HOTLINE_NUMBER}.
      </p>
    </div>
  );
}
