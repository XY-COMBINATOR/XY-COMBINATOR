/**
 * usePrefersReducedMotion Hook
 * Synchronizes with user operating system motion preferences.
 * Helps prevent motion sickness and adheres to accessibility standards (WCAG 2.1).
 */
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export default function usePrefersReducedMotion() {
  // Derive the initial state directly during the render pass without cascading renders
  const [reduced, setReduced] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia(QUERY).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);

    // Subscribe to system preference updates
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      // Legacy Safari / mobile fallback
      mediaQuery.addListener(onChange);
      return () => mediaQuery.removeListener(onChange);
    }

    return undefined;
  }, []);

  return reduced;
}
