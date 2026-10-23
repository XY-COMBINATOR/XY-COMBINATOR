import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import styles from '@src/components/dom/styles/scrollbar.module.scss';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Scrollbar() {
  const progressBar = useRef();
  const scrollbarRef = useRef();
  const fadeTimeout = useRef();
  const visible = useRef(false);
  const [isLoading, isMenuOpen, introOut] = useStore(useShallow((state) => [state.isLoading, state.isMenuOpen, state.introOut]));

  useScroll(({ scroll, limit }) => {
    if (isLoading || isMenuOpen) return;
    if (!progressBar.current || !scrollbarRef.current) return;

    const progress = limit > 0 ? scroll / limit : 0;
    const maxTopValueInVh = 80 - 6;
    const newTopValueInVh = Math.min(maxTopValueInVh, progress * maxTopValueInVh);
    const nextTop = `${newTopValueInVh}svh`;
    if (progressBar.current.style.top !== nextTop) {
      progressBar.current.style.top = nextTop;
    }

    if (!visible.current) {
      visible.current = true;
      gsap.to(scrollbarRef.current, { opacity: 1, duration: 0.3, overwrite: true });
    }

    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      if (scrollbarRef.current) {
        visible.current = false;
        gsap.to(scrollbarRef.current, { opacity: 0, duration: 0.5, overwrite: true });
      }
    }, 1500);
  });

  useEffect(() => () => clearTimeout(fadeTimeout.current), []);

  if (isLoading && introOut) {
    return null;
  }

  return (
    <div id="scrollbar" ref={scrollbarRef} className={styles.scrollbar} aria-hidden="true">
      <div ref={progressBar} className={styles.inner} />
    </div>
  );
}

export default Scrollbar;
