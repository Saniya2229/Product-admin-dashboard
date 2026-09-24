'use client';

import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';

export default function EmptyState({
  search = '',
  category = '',
  onReset,
}) {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
        <PackageSearch className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">
        No Products Found
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {search && category
          ? `We couldn't find any products matching "${search}" in the "${category}" category. Try adjusting your search keywords or clearing the category filter.`
          : search
          ? `No products matched your search "${search}". Please verify spelling or try more general terms.`
          : category
          ? `There are no products listed under the "${category}" category.`
          : 'Your product catalog is currently empty.'}
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
