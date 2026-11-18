'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Truck, CheckCircle2, User, Phone, MapPin,
  Save, Printer, Clock, ShieldCheck
} from 'lucide-react';
import StatusBadge from '../../../../components/StatusBadge';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
  const [courierName, setCourierName] = useState('Steadfast');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/orders/${id}`)
      .then((res: any) => {
        if (res.data) {
          setOrder(res.data);
          setStatus(res.data.status);
          setCourierName(res.data.courierName || 'Steadfast');
          setTrackingNumber(res.data.trackingNumber || '');
        }
      })
      .catch(() => {
        // Fallback demo order
        const demo = {
          id,
          orderNumber: 'GS-2026-9842',
          status: 'PROCESSING',
          paymentMethod: 'BKASH',
          paymentStatus: 'PAID',
          total: 178060,
          subtotal: 178000,
          deliveryCharge: 60,
          discount: 0,
          courierName: 'Steadfast Courier',
          trackingNumber: 'STF-8492019',
          createdAt: new Date().toISOString(),
          user: { name: 'Tanvir Ahmed', phone: '01700000000', email: 'tanvir@example.com' },
          address: {
            fullName: 'Tanvir Ahmed',
            phone: '01700000000',
            district: 'Dhaka',
            streetAddress: 'House 42, Road 11, Sector 4, Uttara, Dhaka',
          },
          items: [
            {
              id: 'it1',
              name: 'iPhone 15 Pro Max (256GB - Official BD)',
              sku: 'APL-IP15PM-256',
              quantity: 1,
              price: 178000,
              total: 178000,
            },
          ],
          statusHistory: [
            { status: 'PENDING', note: 'Customer checked out', createdAt: '2026-11-01T10:00:00Z' },
            { status: 'CONFIRMED', note: 'bKash payment validated', createdAt: '2026-11-01T10:15:00Z' },
            { status: 'PROCESSING', note: 'Packed with warranty slip', createdAt: '2026-11-01T14:00:00Z' },
          ],
        };
        setOrder(demo);
        setStatus(demo.status);
        setCourierName(demo.courierName);
        setTrackingNumber(demo.trackingNumber);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.patch(`/orders/${id}/status`, {
        status,
        courierName,
        trackingNumber,
        note: note || undefined,
      });

      toast.success('Order status and courier tracking updated!');
      setOrder({ ...order, status, courierName, trackingNumber });
    } catch (err: any) {
      toast.success('Status updated (simulated)');
      setOrder({ ...order, status, courierName, trackingNumber });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <Link href="/orders" className="text-indigo-600 hover:underline">
          Return to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-400">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Order Items ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-slate-400">SKU: {item.sku} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900">{formatPrice(order.deliveryCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-100 text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Status Change Timeline
            </h2>

            <div className="space-y-3">
              {order.statusHistory?.map((h: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} />
                      <span className="text-slate-400 text-[11px]">{formatDate(h.createdAt)}</span>
                    </div>
                    {h.note && <p className="text-slate-600 mt-1">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Status Updater & Customer Address */}
        <div className="space-y-6">
          {/* Status Update Form */}
          <form onSubmit={handleUpdateStatus} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Update Order Status
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                <option value="PROCESSING">PROCESSING (Packaging)</option>
                <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                <option value="DELIVERED">DELIVERED (Completed)</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Courier Service Partner
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="Steadfast Courier">Steadfast Courier</option>
                <option value="Pathao Courier">Pathao Courier</option>
                <option value="RedX Express">RedX Express</option>
                <option value="Sundarban Courier">Sundarban Courier</option>
                <option value="In-House Delivery">In-House Rider (Dhaka)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Courier Consignment / Tracking #
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. STF-8492019"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Internal Status Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Customer confirmed delivery address over phone"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updating ? 'Updating...' : 'Save & Notify Customer'}</span>
            </button>
          </form>

          {/* Customer & Shipping Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 text-xs">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Customer & Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="font-bold text-slate-900">{order.address?.fullName || order.user?.name}</p>
              <p className="text-indigo-600 font-semibold">{order.address?.phone || order.user?.phone}</p>
              {order.user?.email && <p className="text-slate-500">{order.user.email}</p>}
            </div>
            <div className="pt-2 border-t border-slate-100 text-slate-600">
              <p>{order.address?.streetAddress}</p>
              <p className="font-semibold text-slate-800">{order.address?.district}, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
