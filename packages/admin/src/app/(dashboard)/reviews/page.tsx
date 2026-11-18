'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, MessageSquare } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { formatDate } from '../../../lib/utils';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = () => {
    api
      .get('/reviews/admin?limit=50')
      .then((res: any) => {
        if (res.data) setReviews(res.data);
      })
      .catch(() => {
        // Fallback demo reviews
        setReviews([
          { id: '1', rating: 5, title: 'Authentic iPhone with Official Warranty', comment: 'Battery backup is incredible. Received same day in Dhaka via express delivery.', user: { name: 'Tanvir Ahmed' }, product: { name: 'iPhone 15 Pro Max' }, isApproved: true, createdAt: new Date().toISOString() },
          { id: '2', rating: 5, title: 'S-Pen performance is legendary', comment: 'Camera quality is mind-blowing, best for photography lovers.', user: { name: 'Nafis Chowdhury' }, product: { name: 'Samsung Galaxy S24 Ultra' }, isApproved: true, createdAt: new Date().toISOString() },
          { id: '3', rating: 4, title: 'Great sound, decent ANC', comment: 'ANC works nicely in traffic, microphone quality is crisp.', user: { name: 'Sadia Rahman' }, product: { name: 'AirPods Pro 2' }, isApproved: false, createdAt: new Date().toISOString() },
        ]);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/approve`);
      toast.success('Review approved and visible to customers');
      setReviews(reviews.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
    } catch {
      toast.error('Failed to approve review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success('Review removed');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const columns = [
    {
      header: 'Product',
      cell: (row: any) => (
        <span className="font-bold text-slate-900">{row.product?.name || 'Gadget'}</span>
      ),
    },
    {
      header: 'Customer',
      cell: (row: any) => (
        <span className="font-semibold text-slate-800">{row.user?.name || 'Customer'}</span>
      ),
    },
    {
      header: 'Rating',
      cell: (row: any) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{row.rating} / 5</span>
        </div>
      ),
    },
    {
      header: 'Review Content',
      cell: (row: any) => (
        <div className="max-w-xs">
          <p className="font-bold text-slate-800 truncate">{row.title || 'Review'}</p>
          <p className="text-slate-500 line-clamp-1 text-[11px]">{row.comment}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${row.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {row.isApproved ? 'Approved' : 'Pending Approval'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          {!row.isApproved && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
              title="Approve Review"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Delete Review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Review Moderation
        </h1>
        <p className="text-xs text-slate-500">
          Moderate, verify, and approve customer ratings and reviews
        </p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        searchPlaceholder="Search reviews..."
      />
    </div>
  );
}
