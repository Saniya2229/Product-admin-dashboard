'use client';

import React from 'react';
import { Filter, Layers } from 'lucide-react';

export default function CategoryFilter({
  categories = [],
  selectedCategory = '',
  onChange,
  disabled = false,
  activeSearch = '',
}) {
  return (
    <div className="relative min-w-[190px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Filter className="w-3.5 h-3.5" />
      </div>

      <select
        id="category-filter-select"
        value={selectedCategory || 'all'}
        onChange={(e) => onChange(e.target.value === 'all' ? '' : e.target.value)}
        disabled={disabled}
        aria-label="Filter by category"
        className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs cursor-pointer disabled:opacity-50 appearance-none capitalize"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug} className="capitalize">
            {cat.name}
          </option>
        ))}
      </select>

      {/* Custom Chevron Indicator */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
