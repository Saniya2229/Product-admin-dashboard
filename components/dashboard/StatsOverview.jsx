'use client';

import React from 'react';
import { Package, AlertCircle, Star, Layers } from 'lucide-react';

export default function StatsOverview({
  totalProducts = 0,
  products = [],
  totalCategories = 0,
}) {
  // Compute metrics from current dataset
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const avgRating =
    products.length > 0
      ? (
          products.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          products.length
        ).toFixed(1)
      : '0.0';

  const stats = [
    {
      title: 'Total Catalog',
      value: totalProducts.toLocaleString(),
      subtext: 'Products in current view',
      icon: Package,
      color: 'blue',
      change: 'Catalog count',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: 'Items with stock ≤ 5',
      icon: AlertCircle,
      color: lowStockCount > 0 ? 'amber' : 'emerald',
      change: lowStockCount > 0 ? 'Requires attention' : 'Inventory healthy',
    },
    {
      title: 'Avg. Rating',
      value: `${avgRating} ★`,
      subtext: 'Based on current items',
      icon: Star,
      color: 'amber',
      change: 'Calculated average',
    },
    {
      title: 'Categories',
      value: totalCategories,
      subtext: 'Available categories',
      icon: Layers,
      color: 'indigo',
      change: 'Catalog taxonomy',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h4 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                  {stat.value}
                </h4>
              </div>
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  stat.color === 'blue'
                    ? 'bg-blue-50 text-blue-600'
                    : stat.color === 'amber'
                    ? 'bg-amber-50 text-amber-600'
                    : stat.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{stat.subtext}</span>
              <span
                className={`font-semibold ${
                  stat.color === 'amber' && lowStockCount > 0
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
