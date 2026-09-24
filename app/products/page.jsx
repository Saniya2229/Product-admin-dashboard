'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import productApi from '@/services/productApi';
import { parseQueryParams, buildQueryString } from '@/utils/urlHelpers';
import { useToast } from '@/context/ToastContext';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import FilterControls from '@/components/dashboard/FilterControls';
import ProductList from '@/components/dashboard/ProductList';
import Pagination from '@/components/dashboard/Pagination';

import LoadingSkeleton from '@/components/feedback/LoadingSkeleton';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';

import ProductModal from '@/components/modals/ProductModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { PlusCircle, Loader2 } from 'lucide-react';

function ProductsDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { success, error: showError, info } = useToast();

  // Parse safe sanitized parameters from URL
  const queryParams = parseQueryParams(searchParams);
  const { page, limit, search, category, sortBy, order } = queryParams;

  // State
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Testing helper: artificial delay (for testing race conditions with &delay=2000)
  const [simulatedDelay, setSimulatedDelay] = useState(0);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Race condition prevention: Request ID and AbortController references
  const latestRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  // Sync URL query helper
  const updateUrlParams = useCallback(
    (updates) => {
      const newQueryString = buildQueryString(queryParams, updates);
      router.push(`${pathname}${newQueryString}`, { scroll: false });
    },
    [queryParams, pathname, router]
  );

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const catList = await productApi.getCategories();
        if (isMounted) setCategories(catList);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Main Data Fetching Logic with Race Condition Prevention & AbortController
  const fetchProductsData = useCallback(async () => {
    // 1. Cancel any prior pending network request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 2. Increment monotonically increasing request ID
    const currentRequestId = ++latestRequestIdRef.current;

    setLoading(true);
    setFetchError(null);

    const skip = (page - 1) * limit;

    try {
      let result;

      // Handle combined Search + Category or specific endpoints
      if (search) {
        // DummyJSON Search API
        result = await productApi.searchProducts({
          q: search,
          limit: category ? 0 : limit, // if filtering locally by category, fetch all matches (limit=0)
          skip: category ? 0 : skip,
          sortBy,
          order,
          delay: simulatedDelay,
          signal: controller.signal,
        });

        // Edge Case: If category is also selected during search, filter search results locally by category
        if (category && result?.products) {
          const filtered = result.products.filter(
            (p) => p.category?.toLowerCase() === category.toLowerCase()
          );
          const paginatedSlice = filtered.slice(skip, skip + limit);
          result = {
            products: paginatedSlice,
            total: filtered.length,
            skip,
            limit,
          };
        }
      } else if (category) {
        // DummyJSON Category API
        result = await productApi.getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          delay: simulatedDelay,
          signal: controller.signal,
        });
      } else {
        // Standard paginated products list
        result = await productApi.getProducts({
          limit,
          skip,
          sortBy,
          order,
          delay: simulatedDelay,
          signal: controller.signal,
        });
      }

      // 3. Race condition verification:
      // Only commit to React state if this response corresponds to the latest dispatched request ID
      if (currentRequestId === latestRequestIdRef.current) {
        setProducts(result.products || []);
        setTotalProducts(result.total || 0);
        setLoading(false);
      }
    } catch (err) {
      if (err.isCanceled) {
        // Expected when a newer search request preempts an older in-flight request
        return;
      }
      if (currentRequestId === latestRequestIdRef.current) {
        setFetchError(err.message || 'Failed to retrieve products.');
        setLoading(false);
      }
    }
  }, [page, limit, search, category, sortBy, order, simulatedDelay]);

  useEffect(() => {
    fetchProductsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProductsData]);

  // Handlers for URL State Changes
  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize) => {
    // When changing page size, reset to page 1 to prevent out-of-bound skip
    updateUrlParams({ limit: newSize, page: 1 });
  };

  const handleSearchChange = (newSearch) => {
    // Assignment Rule: Go back to page 1 when search changes
    updateUrlParams({ search: newSearch, page: 1 });
  };

  const handleCategoryChange = (newCat) => {
    updateUrlParams({ category: newCat, page: 1 });
  };

  const handleSortChange = ({ sortBy: newSort, order: newOrder }) => {
    updateUrlParams({ sortBy: newSort, order: newOrder, page: 1 });
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const handleToggleDelay = () => {
    setSimulatedDelay((prev) => {
      const next = prev === 0 ? 2000 : 0;
      info(
        next > 0
          ? 'Simulated 2000ms delay active. Fast typing will prove older requests never overwrite newer ones.'
          : 'Normal network delay restored.'
      );
      return next;
    });
  };

  // CRUD Handlers with Local State Synchronization (Simulated Mutations)
  const handleOpenAddModal = () => {
    setSelectedProductForEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProductForEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleOpenDeleteModal = (prod) => {
    setProductToDelete(prod);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (selectedProductForEdit) {
      // Edit Product
      const updated = await productApi.updateProduct(
        selectedProductForEdit.id,
        formData
      );
      // Synchronize in local UI state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProductForEdit.id ? { ...item, ...formData } : item
        )
      );
      success(`"${formData.title}" updated successfully!`);
    } else {
      // Add Product
      const added = await productApi.addProduct(formData);
      // DummyJSON generates mock id (e.g. 195)
      const newProductItem = {
        ...formData,
        id: added.id || Date.now(),
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
      };
      // Prepend to visible products and increment count
      setProducts((prev) => [newProductItem, ...prev]);
      setTotalProducts((prev) => prev + 1);
      success(`New product "${formData.title}" added successfully!`);
    }
  };

  const handleDeleteProduct = async (prod) => {
    await productApi.deleteProduct(prod.id);
    // Remove from visible products and decrement count
    setProducts((prev) => prev.filter((item) => item.id !== prod.id));
    setTotalProducts((prev) => Math.max(0, prev - 1));
    success(`"${prod.title}" deleted.`);
  };

  return (
    <DashboardLayout onOpenAddModal={handleOpenAddModal}>
      {/* Top Banner with Add Product Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Products Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your store&apos;s active inventory, pricing, ratings, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Top Stats Overview Cards (Inspired by Reference Design) */}
      <StatsOverview
        totalProducts={totalProducts}
        products={products}
        totalCategories={categories.length}
      />

      {/* Search, Filter, Sort Controls */}
      <FilterControls
        categories={categories}
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        isSearching={loading}
        simulatedDelay={simulatedDelay}
        onToggleDelay={handleToggleDelay}
      />

      {/* Main Content: Loading, Error, Empty, or Table/Cards */}
      {loading ? (
        <LoadingSkeleton count={limit > 10 ? 8 : limit} />
      ) : fetchError ? (
        <ErrorState message={fetchError} onRetry={fetchProductsData} />
      ) : products.length === 0 ? (
        <EmptyState
          search={search}
          category={category}
          onReset={handleResetFilters}
        />
      ) : (
        <>
          <ProductList
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />

          {/* Custom Pagination */}
          <Pagination
            currentPage={page}
            pageSize={limit}
            totalItems={totalProducts}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disabled={loading}
          />
        </>
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={selectedProductForEdit}
        categories={categories}
      />

      {/* Confirm Delete Popup Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        product={productToDelete}
      />
    </DashboardLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ProductsDashboardContent />
    </Suspense>
  );
}
