'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import RatingStars from './RatingStars';
import { Review } from '../types';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export default function ProductReviews({
  productId,
  reviews = [],
  averageRating = 4.8,
  reviewCount = 12,
}: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setComment('');
      setTitle('');
      toast.success('Thank you! Your review has been submitted for approval.');
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100">
            {averageRating.toFixed(1)}
          </div>
          <div className="my-2 flex justify-center md:justify-start">
            <RatingStars rating={averageRating} size="lg" showCount={false} />
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Based on {reviewCount} verified ratings
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="w-full md:w-1/2 space-y-1.5 text-xs sm:text-sm">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : 2;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-12 text-gray-600 dark:text-gray-400 font-medium">
                  {star} Star
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400 text-xs font-semibold">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <span>Write a Customer Review</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      rating >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best flagship phone in Bangladesh!"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Review Comments
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience regarding performance, battery, build quality..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    {rev.user?.name || 'Customer'}
                  </span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <RatingStars rating={rev.rating} size="sm" showCount={false} />

              {rev.title && (
                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {rev.title}
                </h4>
              )}

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            No customer reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
}
