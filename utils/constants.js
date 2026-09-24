export const AUTH_STORAGE_KEY = 'product_dashboard_auth';
export const TOKEN_STORAGE_KEY = 'product_dashboard_token';

export const API_BASE_URL = 'https://dummyjson.com';

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
};

export const SORT_OPTIONS = [
  { label: 'Default', value: 'default', sortBy: '', order: '' },
  { label: 'Price: Low to High', value: 'price-asc', sortBy: 'price', order: 'asc' },
  { label: 'Price: High to Low', value: 'price-desc', sortBy: 'price', order: 'desc' },
  { label: 'Rating: High to Low', value: 'rating-desc', sortBy: 'rating', order: 'desc' },
  { label: 'Rating: Low to High', value: 'rating-asc', sortBy: 'rating', order: 'asc' },
  { label: 'Title: A to Z', value: 'title-asc', sortBy: 'title', order: 'asc' },
  { label: 'Title: Z to A', value: 'title-desc', sortBy: 'title', order: 'desc' },
];
