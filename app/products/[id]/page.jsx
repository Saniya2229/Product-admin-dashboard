'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import productApi from '@/services/productApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductNotFound from '@/components/feedback/ProductNotFound';
import ProductGallery from '@/components/product-details/ProductGallery';
import ProductInfo from '@/components/product-details/ProductInfo';
import ProductReviews from '@/components/product-details/ProductReviews';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (signal) => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setError(null);

    try {
      const data = await productApi.getProductById(id, { signal });
      setProduct(data);
      const firstImage = data.images?.[0] || data.thumbnail || '';
      setActiveImage(firstImage);
    } catch (err) {
      if (err.isCanceled) return;
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load product details.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProduct(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProduct]);

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
            type="button"
            onClick={() => fetchProduct()}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
          <ProductGallery
            title={product.title}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            allImages={allImages}
          />
          <ProductInfo product={product} />
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews reviews={product.reviews} rating={product.rating} />
      </div>
    </DashboardLayout>
  );
}
