/**
 * useIsMobile Hook
 * Reactive viewport detection hook matching the $mobile-breakpoint: 812px token.
 * Pre-initializes state synchronously to avoid layout shifts on mobile devices.
 */
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 812;

const useIsMobile = () => {
  // Synchronous initialization prevents flash of desktop layout on mobile clients
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
