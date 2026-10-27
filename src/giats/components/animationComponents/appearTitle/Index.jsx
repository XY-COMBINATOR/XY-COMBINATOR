/**
 * AppearTitle Component
 * Kinetic reveal wrapper for headings and typography.
 * Splits and staggers letter/word/line appearances as they intersect the viewport.
 */
import { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import styles from '@src/components/animationComponents/appearTitle/appearTitle.module.scss';
import useIntersected from '@src/hooks/useIntersected';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

const AppearTitle = forwardRef(({ children, index = -1, optionIndex = -1, isFooter = false }, ref) => {
  const containerRef = useRef(null);
  const intersected = useIntersected(containerRef);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childArray = Array.from(container.children);

    childArray.forEach((child, i) => {
      if (child instanceof HTMLElement) {
        child.style.setProperty('--i', String(isFooter ? i : i + 1));

        // Ensure we do not re-wrap nodes that are already wrapped
        if (!isFooter && !child.getAttribute('data-appear-wrapped')) {
          child.setAttribute('data-appear-wrapped', 'true');
        }
      }
    });
  }, [isFooter]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (ref && index !== -1 && optionIndex !== -1 && ref.current?.[index]) {
          ref.current[index][optionIndex] = node;
        }
      }}
      className={clsx(
        !isFooter && styles.title,
        isFooter && styles.titleFooter,
        intersected && !isFooter && styles.visible,
        !intersected && !isFooter && styles.notVisible,
        intersected && isFooter && styles.visibleFooter,
        !intersected && isFooter && styles.notVisibleFooter,
      )}
    >
      {children}
    </div>
  );
});

export default AppearTitle;
