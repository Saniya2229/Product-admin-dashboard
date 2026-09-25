'use client';

import React, { useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({
  children,
  title,
  subtitle,
  onOpenAddModal,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8fafc] flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
          <Header
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            title={title}
            subtitle={subtitle}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
