import React from 'react';
import Link from 'next/link';
import { Star, Eye, Edit2, Trash2, PackageCheck, AlertTriangle } from 'lucide-react';
import { getProductImage, formatPrice, getStockStatus } from '@/utils/productHelpers';

export default function ProductCard({ product, onEdit, onDelete }) {
  const { isOutOfStock, isLowStock } = getStockStatus(product.stock);
  const imageUrl = getProductImage(product);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top: Image & Badges */}
        <div className="relative w-full h-44 rounded-xl bg-slate-50 overflow-hidden mb-3.5 flex items-center justify-center border border-slate-100">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-slate-300 text-xs">No Image</div>
          )}

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200/60 capitalize">
            {product.category}
          </span>

          {/* Rating Pill */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-50/95 backdrop-blur-xs text-amber-700 text-xs font-bold flex items-center gap-1 shadow-xs border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.id}`}
          className="font-bold text-slate-900 text-base hover:text-blue-600 line-clamp-1 transition-colors"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Brand / Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">
          {product.description || (product.brand ? `Brand: ${product.brand}` : 'No description available.')}
        </p>
      </div>

      {/* Bottom: Price, Stock, & Actions */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Low Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <PackageCheck className="w-3 h-3 text-emerald-600" />
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View</span>
          </Link>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200/60 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200/60 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
