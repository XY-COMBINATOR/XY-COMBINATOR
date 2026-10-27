/**
 * useScroll Hook
 * Subscribes a callback to active Lenis scroll events using a stable mutable ref,
 * preventing unnecessary unbind/rebind cycles on re-renders.
 */
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function useScroll(callback) {
  const [lenis] = useStore(useShallow((state) => [state.lenis]));
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useIsomorphicLayoutEffect(() => {
    if (!lenis) return undefined;

    const listener = (event) => callbackRef.current(event);

    lenis.on('scroll', listener);
    lenis.emit();

    return () => {
      lenis.off('scroll', listener);
    };
  }, [lenis]);
}

export default useScroll;
