'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '@/utils/constants';

export default function SortDropdown({
  sortBy = '',
  order = '',
  onChange,
  disabled = false,
}) {
  // Find matching option value
  const currentValue =
    SORT_OPTIONS.find((opt) => opt.sortBy === sortBy && opt.order === order)
      ?.value || 'default';

  const handleSelect = (e) => {
    const selectedVal = e.target.value;
    const option = SORT_OPTIONS.find((opt) => opt.value === selectedVal);
    if (option) {
      onChange({ sortBy: option.sortBy, order: option.order });
    }
  };

  return (
    <div className="relative min-w-[190px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>

      <select
        id="sort-select"
        value={currentValue}
        onChange={handleSelect}
        disabled={disabled}
        aria-label="Sort products"
        className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs cursor-pointer disabled:opacity-50 appearance-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
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
