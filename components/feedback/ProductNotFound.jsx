'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound({ id }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm mb-5">
        <PackageX className="w-10 h-10" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
        Product Not Found
      </h1>

      <p className="text-sm text-slate-500 max-w-md mb-8">
        We could not find any product matching ID{' '}
        <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
          {id}
        </span>
        . It may have been removed, or the URL might contain an invalid identifier.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    </div>
  );
}
