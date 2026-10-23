import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const getMatch = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY).matches : false);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);

    setReduced(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', onChange);

    return () => mediaQuery.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
