/**
 * Product form validation rules
 */

export function validateProductForm(formData) {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Product title is required';
  }

  const priceNum = parseFloat(formData.price);
  if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Price must be a valid positive number';
  }

  if (!formData.category) {
    errors.category = 'Please select a category';
  }

  const stockNum = parseInt(formData.stock, 10);
  if (formData.stock === '' || formData.stock === undefined || isNaN(stockNum) || stockNum < 0) {
    errors.stock = 'Stock must be a non-negative integer';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Please provide a short description';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
