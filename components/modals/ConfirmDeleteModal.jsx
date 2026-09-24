'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  product = null,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    if (isDeleting) return; // Prevent double clicks
    setIsDeleting(true);
    try {
      await onConfirm(product);
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Delete Product
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to remove{' '}
              <span className="font-semibold text-slate-800">&ldquo;{product.title}&rdquo;</span>?
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
