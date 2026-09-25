import React from 'react';
import Link from 'next/link';
import { Star, Eye, Edit2, Trash2, PackageCheck, AlertTriangle } from 'lucide-react';
import { getProductImage, formatPrice, getStockStatus } from '@/utils/productHelpers';

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-4 px-6 w-20">Image</th>
              <th className="py-4 px-6">Product Title</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Price</th>
              <th className="py-4 px-6 text-center">Rating</th>
              <th className="py-4 px-6">Stock Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const { isOutOfStock, isLowStock } = getStockStatus(product.stock);
              const imageUrl = getProductImage(product);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="py-3.5 px-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-[10px] text-slate-300">N/A</div>
                      )}
                    </div>
                  </td>

                  {/* Title & Brand */}
                  <td className="py-3.5 px-6">
                    <div className="max-w-xs">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-1 transition-colors block"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                      <span className="text-xs text-slate-400 capitalize block truncate">
                        {product.brand ? `Brand: ${product.brand}` : product.category}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/50">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-3.5 px-6">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {product.stock} in stock
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        title="View Details"
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        title="Delete Product"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
