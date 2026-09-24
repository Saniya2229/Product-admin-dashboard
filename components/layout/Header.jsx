'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, Bell, ShieldCheck } from 'lucide-react';

export default function Header({ onToggleSidebar, title, subtitle }) {
  const { user, logout } = useAuth();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {title || (
                <>
                  Welcome, {user?.firstName || user?.username || 'Admin'} <span className="animate-wave inline-block">👋</span>
                </>
              )}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {subtitle || 'Manage your product inventory, pricing, and stock.'}
            </p>
          </div>
        </div>

        {/* Right: Date, Status, User & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Formatted Date */}
          <span className="hidden md:inline-block text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            {formattedDate}
          </span>

          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin Mode</span>
          </div>

          {/* Mobile Logout Quick Icon */}
          <button
            onClick={logout}
            title="Log Out"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
