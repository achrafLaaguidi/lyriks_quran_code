import { useCallback, useState } from 'react';

export function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}
export default function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback));
  const update = useCallback((next) => {
    setValue((previous) => {
      const result = typeof next === 'function' ? next(previous) : next;
      try { localStorage.setItem(key, JSON.stringify(result)); } catch { /* Storage is optional. */ }
      return result;
    });
  }, [key]);
  return [value, update];
}
