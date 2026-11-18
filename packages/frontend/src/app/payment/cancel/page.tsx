'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ShoppingBag } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-md">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
          Payment Cancelled
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          You cancelled the payment transaction. Your items are safe in your cart and you can complete checkout whenever you are ready.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/cart"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm shadow hover:bg-primary-700 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Go to Cart</span>
        </Link>
      </div>
    </div>
  );
}
