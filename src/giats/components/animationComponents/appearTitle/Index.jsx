import { forwardRef, useRef } from 'react';

import clsx from 'clsx';
import styles from '@src/components/animationComponents/appearTitle/appearTitle.module.scss';
import useIntersected from '@src/hooks/useIntersected';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

const AppearTitle = forwardRef(({ children, index = -1, optionIndex = -1, isFooter = false }, ref) => {
  const containerRef = useRef();

  const intersected = useIntersected(containerRef);

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current) {
      const childArray = Array.from(containerRef.current.children);

      childArray.forEach((child, i) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty('--i', isFooter ? i : i + 1);

          if (!isFooter) {
            const wrapper = document.createElement('div');
            wrapper.appendChild(child.cloneNode(true));
            containerRef.current.replaceChild(wrapper, child);
          }
        }
      });
    }
  }, [isFooter]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (ref && index !== -1 && optionIndex !== -1) {
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
