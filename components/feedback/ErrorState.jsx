'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  message = 'Failed to load products from DummyJSON.',
  onRetry,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-rose-100 shadow-xs flex flex-col items-center justify-center my-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">
        Unable to Load Products
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
}
