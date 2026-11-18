'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Eye } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';
import EmptyState from '../../../components/EmptyState';
import { formatPrice } from '../../../lib/utils';
import { api } from '../../../lib/api';

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res: any) => {
        if (res.data) setOrders(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Account', href: '/account' },
          { label: 'Order History' },
        ]}
      />

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Order History
          </h1>
          <p className="text-xs text-gray-400">
            Track, view invoice, and inspect status updates of your purchases
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading your orders...</div>
      ) : orders.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm overflow-hidden">
          {orders.map((order) => (
            <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()} • Payment: {order.paymentMethod} ({order.paymentStatus})
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400">Total Amount</p>
                  <p className="font-extrabold text-sm sm:text-base text-primary-600 dark:text-primary-400">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/50 text-gray-700 dark:text-gray-300 hover:text-primary-600 text-xs font-bold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Orders Placed Yet"
          description="You haven't ordered any gadgets yet. Check out our latest smartphones and audio devices!"
          actionText="Browse Catalog"
          actionHref="/products"
          icon={<Package className="w-8 h-8" />}
        />
      )}
    </div>
  );
}
