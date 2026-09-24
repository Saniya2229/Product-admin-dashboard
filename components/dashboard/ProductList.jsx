'use client';

import React from 'react';
import ProductTable from './ProductTable';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <ProductTable
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
