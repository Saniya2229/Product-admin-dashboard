/**
 * Shared product helper utilities for formatting, stock status, and image resolution
 */

export function getProductImage(product) {
  return product?.thumbnail || product?.images?.[0] || null;
}

export function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`;
}

export function getStockStatus(stock) {
  const stockNum = Number(stock) || 0;
  const isOutOfStock = stockNum === 0;
  const isLowStock = stockNum > 0 && stockNum <= 5;

  return {
    isOutOfStock,
    isLowStock,
    count: stockNum,
  };
}
