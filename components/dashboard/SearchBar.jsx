'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({
  initialValue = '',
  onSearch,
  isSearching = false,
  simulatedDelay = 0,
  onToggleDelay,
}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, 450);

  // Sync internal state if initialValue changes externally (e.g. back/forward navigation or URL reset)
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // When debounced value changes, trigger search callback
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, initialValue, onSearch]);

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const isDebouncing = inputValue !== debouncedValue;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full max-w-xl">
      <div className="relative flex-1">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products by title, brand, description..."
          className="w-full pl-10 pr-20 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
        />

        {/* Right Action Icons: Spinner & Clear */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {(isSearching || isDebouncing) && (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          )}

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Assignment Testing Helper: Toggle 2000ms delay to test race conditions */}
      {onToggleDelay && (
        <button
          type="button"
          onClick={onToggleDelay}
          title="Toggles &delay=2000 to test that fast typing never lets old responses overwrite new ones"
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
            simulatedDelay > 0
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{simulatedDelay > 0 ? '+2s Delay Active' : 'Test Race Condition'}</span>
        </button>
      )}
    </div>
  );
}
