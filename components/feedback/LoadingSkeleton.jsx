'use client';

import React from 'react';

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div>
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100">
                <th className="py-4 px-6 w-20">
                  <div className="h-3 w-10 bg-slate-200 rounded-md animate-pulse" />
                </th>
                <th className="py-4 px-6">
                  <div className="h-3 w-28 bg-slate-200 rounded-md animate-pulse" />
                </th>
                <th className="py-4 px-6">
                  <div className="h-3 w-16 bg-slate-200 rounded-md animate-pulse" />
                </th>
                <th className="py-4 px-6 text-right">
                  <div className="h-3 w-12 bg-slate-200 rounded-md animate-pulse ml-auto" />
                </th>
                <th className="py-4 px-6 text-center">
                  <div className="h-3 w-12 bg-slate-200 rounded-md animate-pulse mx-auto" />
                </th>
                <th className="py-4 px-6">
                  <div className="h-3 w-20 bg-slate-200 rounded-md animate-pulse" />
                </th>
                <th className="py-4 px-6 text-right">
                  <div className="h-3 w-14 bg-slate-200 rounded-md animate-pulse ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: count }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  </td>
                  <td className="py-3.5 px-6 space-y-2">
                    <div className="h-4 w-44 bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="h-5 w-20 bg-slate-100 rounded-lg" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="h-4 w-14 bg-slate-200 rounded ml-auto" />
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="h-6 w-14 bg-slate-100 rounded-lg mx-auto" />
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="h-8 w-20 bg-slate-100 rounded-xl ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs animate-pulse space-y-3"
          >
            <div className="w-full h-44 rounded-xl bg-slate-100" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-5 w-20 bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="h-8 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
