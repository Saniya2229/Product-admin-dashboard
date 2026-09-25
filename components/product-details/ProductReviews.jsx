import React from 'react';
import { Star, Calendar } from 'lucide-react';

export default function ProductReviews({ reviews = [], rating = 0 }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
          <p className="text-xs text-slate-400">
            Customer ratings and feedback
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{Number(rating || 0).toFixed(1)} / 5.0</span>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                {/* Review Stars & Date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 italic leading-relaxed mb-3">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                  {review.reviewerName?.[0] || 'U'}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate">
                    {review.reviewerName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {review.reviewerEmail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic py-4">
          No reviews recorded yet for this product.
        </p>
      )}
    </div>
  );
}
