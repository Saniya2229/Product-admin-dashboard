import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, SORT_OPTIONS } from './constants';

/**
 * Safely parse and sanitize URL search parameters
 * Prevents invalid inputs like ?page=abc or ?limit=9999 from breaking the application.
 */
export function parseQueryParams(searchParams) {
  // Safe page parsing (must be integer >= 1)
  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Safe limit parsing (must be in PAGE_SIZE_OPTIONS: 10, 20, 50)
  const rawLimit = searchParams.get('limit');
  let limit = parseInt(rawLimit, 10);
  if (!PAGE_SIZE_OPTIONS.includes(limit)) {
    limit = DEFAULT_PAGE_SIZE;
  }

  // Search query (trimmed string)
  const search = (searchParams.get('search') || '').trim();

  // Category filter
  const category = (searchParams.get('category') || '').trim();

  // SortBy and Order
  const sortBy = (searchParams.get('sortBy') || '').trim();
  const rawOrder = (searchParams.get('order') || '').trim().toLowerCase();
  const order = rawOrder === 'desc' ? 'desc' : rawOrder === 'asc' ? 'asc' : '';

  return {
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  };
}

/**
 * Build a sanitized query string from current parameters and updates
 */
export function buildQueryString(currentParams, updates = {}) {
  const merged = { ...currentParams, ...updates };
  const params = new URLSearchParams();

  // Only append non-default or non-empty parameters
  if (merged.page && merged.page > 1) {
    params.set('page', merged.page.toString());
  }

  if (merged.limit && merged.limit !== DEFAULT_PAGE_SIZE) {
    params.set('limit', merged.limit.toString());
  }

  if (merged.search) {
    params.set('search', merged.search);
  }

  if (merged.category && merged.category !== 'all') {
    params.set('category', merged.category);
  }

  if (merged.sortBy) {
    params.set('sortBy', merged.sortBy);
  }

  if (merged.order) {
    params.set('order', merged.order);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
