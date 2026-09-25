import React from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatPrice, getStockStatus } from '@/utils/productHelpers';

export default function ProductInfo({ product }) {
  const { isOutOfStock, isLowStock } = getStockStatus(product.stock);

  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      <div>
        {/* Category & Rating */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold capitalize border border-blue-100">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(product.rating || 0).toFixed(1)}</span>
            <span className="text-amber-600 font-normal">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          {product.brand && (
            <span className="text-xs text-slate-500 font-medium">
              Brand: <span className="font-semibold text-slate-800">{product.brand}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
          {product.title}
        </h1>

        {/* Pricing section */}
        <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-3xl font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-sm font-semibold text-rose-500 line-through">
                $
                {(
                  Number(product.price) /
                  (1 - Number(product.discountPercentage) / 100)
                ).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Description
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock & Operational Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-slate-400 block mb-1">Availability</span>
            {isOutOfStock ? (
              <span className="font-semibold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Out of stock
              </span>
            ) : isLowStock ? (
              <span className="font-semibold text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({product.stock})
              </span>
            ) : (
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {product.stock} in stock
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-slate-400 block mb-1">Shipping</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              {product.shippingInformation || 'Standard Delivery'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-slate-400 block mb-1">Warranty</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {product.warrantyInformation || '1 Year Guarantee'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
