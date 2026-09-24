'use client';

import React from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import SortDropdown from './SortDropdown';
import { RotateCcw, X, Layers, AlertCircle } from 'lucide-react';

export default function FilterControls({
  categories = [],
  search = '',
  category = '',
  sortBy = '',
  order = '',
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  isSearching = false,
  simulatedDelay = 0,
  onToggleDelay,
}) {
  const hasActiveFilters = Boolean(search || category || sortBy || order);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4 mb-6">
      {/* Top Bar: Search & Selectors */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input with 2s Delay testing button */}
        <div className="flex-1">
          <SearchBar
            initialValue={search}
            onSearch={onSearchChange}
            isSearching={isSearching}
            simulatedDelay={simulatedDelay}
            onToggleDelay={onToggleDelay}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onChange={onCategoryChange}
            disabled={isSearching}
            activeSearch={search}
          />

          <SortDropdown
            sortBy={sortBy}
            order={order}
            onChange={onSortChange}
            disabled={isSearching}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Special Context Banner for Search + Category combination (Handling assignment edge case) */}
      {search && category && (
        <div className="px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200/60 text-blue-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>
              Searching <span className="font-semibold">&ldquo;{search}&rdquo;</span> refined within category{' '}
              <span className="font-semibold capitalize">&ldquo;{category}&rdquo;</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Clear category filter
          </button>
        </div>
      )}
    </div>
  );
}
