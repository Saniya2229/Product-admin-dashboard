'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import productApi from '@/services/productApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductNotFound from '@/components/feedback/ProductNotFound';
import {
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Loader2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const data = await productApi.getProductById(id, {
          signal: controller.signal,
        });

        if (isMounted) {
          setProduct(data);
          const firstImage = data.images?.[0] || data.thumbnail || '';
          setActiveImage(firstImage);
        }
      } catch (err) {
        if (err.isCanceled) return;
        if (isMounted) {
          // DummyJSON throws 404 for nonexistent IDs like 999999
          if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
            setNotFound(true);
          } else {
            setError(err.message || 'Failed to load product details.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Product Details" subtitle="Loading inventory information...">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading product #{id}...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout title="Product Details" subtitle="Resource not found">
        <ProductNotFound id={id} />
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout title="Product Details" subtitle="Error loading details">
        <div className="p-8 text-center max-w-lg mx-auto bg-white rounded-3xl border border-rose-100 shadow-xs">
          <p className="text-base font-semibold text-rose-600 mb-2">Error</p>
          <p className="text-sm text-slate-600 mb-6">{error || 'Could not load product.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const allImages = product.images?.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <DashboardLayout
      title={product.title}
      subtitle={`Category: ${product.category} • SKU: ${product.sku || 'N/A'}`}
    >
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Main Product Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary Featured Image */}
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain transition-all duration-300"
                />
              ) : (
                <span className="text-slate-400 text-xs">No image preview</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 shrink-0 bg-slate-50 transition-all cursor-pointer overflow-hidden ${
                      activeImage === img
                        ? 'border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Pricing (7 cols) */}
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
                  ${Number(product.price).toFixed(2)}
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
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
              <p className="text-xs text-slate-400">
                Verified buyer ratings and authentic customer feedback
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{Number(product.rating || 0).toFixed(1)} / 5.0</span>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((review, idx) => (
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
            <p className="text-sm text-slate-400 italic py-4">No reviews recorded yet for this product.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
