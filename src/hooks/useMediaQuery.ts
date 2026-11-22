import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query. Returns `false` during server rendering and
 * hydration, then the real value, so prerendered HTML always matches.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
