'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null, // if provided, we are editing; otherwise adding
  categories = [],
}) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        category: product.category || '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        brand: product.brand || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: categories[0]?.slug || '',
        stock: '10',
        brand: '',
      });
    }
    setErrors({});
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Product title is required';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Price must be a valid positive number';
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'Stock must be a non-negative integer';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide a short description';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-clicking

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save product. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? 'Update product pricing, stock, and descriptions'
                : 'Create and list a new item in your inventory catalog'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all capitalize cursor-pointer"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug} className="capitalize">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="299.99"
                disabled={isSubmitting}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.price ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.price && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="15"
                disabled={isSubmitting}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.stock ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.stock && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of features, materials, and specifications..."
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.description}</p>
            )}
          </div>

          {/* Footer Actions with Spam Click Protection */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="product-save-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
