import clsx from 'clsx';
import styles from '@src/components/animationComponents/appearByWords/appearByWords.module.scss';
import useIntersected from '@src/hooks/useIntersected';
import { useRef } from 'react';
import useSplitAnimation from '@src/hooks/useSplitAnimation';

function AppearByWords({ children }) {
  const animationContainerRef = useRef();
  const intersected = useIntersected(animationContainerRef);
  useSplitAnimation(animationContainerRef, styles);

  return (
    <span ref={animationContainerRef} className={clsx(styles.title, intersected && styles.visible)} aria-hidden="true">
      {children}
    </span>
  );
}

export default AppearByWords;
