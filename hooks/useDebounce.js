import { useState, useEffect } from 'react';

/**
 * Custom useDebounce hook
 * Delays updating the debounced value until after the specified delay has passed
 * since the last time the input value changed.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 450ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 450) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
