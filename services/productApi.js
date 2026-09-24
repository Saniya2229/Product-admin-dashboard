import api from './api';

/**
 * Product API Service
 * Encapsulates all product-related calls to DummyJSON.
 * UI components call these methods instead of executing axios directly.
 */
export const productApi = {
  /**
   * Fetch paginated products with optional sorting and artificial delay
   */
  async getProducts({
    limit = 20,
    skip = 0,
    sortBy = '',
    order = '',
    delay = 0,
    signal,
  } = {}) {
    const params = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await api.get('/products', {
      params,
      signal,
    });
    return response.data;
  },

  /**
   * Search products by query string with pagination and optional artificial delay
   */
  async searchProducts({
    q = '',
    limit = 20,
    skip = 0,
    sortBy = '',
    order = '',
    delay = 0,
    signal,
  } = {}) {
    const params = { q: q.trim(), limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await api.get('/products/search', {
      params,
      signal,
    });
    return response.data;
  },

  /**
   * Fetch all product categories
   */
  async getCategories({ signal } = {}) {
    const response = await api.get('/products/categories', { signal });
    // DummyJSON v2 returns array of objects [{slug, name, url}] or array of strings in v1
    // Normalize to uniform format: { slug: string, name: string }
    const rawCategories = response.data || [];
    return rawCategories.map((item) => {
      if (typeof item === 'string') {
        const readable = item
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { slug: item, name: readable };
      }
      return {
        slug: item.slug || item.name,
        name: item.name || item.slug,
      };
    });
  },

  /**
   * Fetch products by category with pagination
   */
  async getProductsByCategory({
    category,
    limit = 20,
    skip = 0,
    sortBy = '',
    order = '',
    delay = 0,
    signal,
  } = {}) {
    const params = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const encodedCategory = encodeURIComponent(category);
    const response = await api.get(`/products/category/${encodedCategory}`, {
      params,
      signal,
    });
    return response.data;
  },

  /**
   * Fetch a single product's details by ID
   */
  async getProductById(id, { delay = 0, signal } = {}) {
    const params = {};
    if (delay) params.delay = delay;

    const response = await api.get(`/products/${id}`, {
      params,
      signal,
    });
    return response.data;
  },

  /**
   * Add a new product (DummyJSON simulates and returns new product with generated ID)
   */
  async addProduct(productData) {
    const response = await api.post('/products/add', productData);
    return response.data;
  },

  /**
   * Update an existing product by ID (simulated by DummyJSON)
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product by ID (simulated by DummyJSON)
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productApi;
