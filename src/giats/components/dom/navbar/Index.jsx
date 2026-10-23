import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import useIsMobile from '@src/hooks/useIsMobile';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Navbar() {
  const isMobile = useIsMobile();
  const headerRef = useRef();
  const [lenis, isMenuOpen] = useStore(useShallow((state) => [state.lenis, state.isMenuOpen]));

  useScroll(({ scroll, direction }) => {
    if (!headerRef.current) return;
    const shouldHide = !isMenuOpen && scroll > 240 && direction === 1;
    headerRef.current.classList.toggle(styles.hidden, shouldHide);
  });

  useEffect(() => {
    if (isMenuOpen) {
      headerRef.current?.classList.remove(styles.hidden);
    }
  }, [isMenuOpen]);

  const scrollToPosition = useCallback(
    (position, duration = 1.5) => {
      if (lenis) {
        lenis.scrollTo(position, {
          duration,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis.start();
          },
        });
      }
    },
    [lenis],
  );

  const goToTop = useCallback(
    (event) => {
      event.preventDefault();
      scrollToPosition(0);
    },
    [scrollToPosition],
  );

  return (
    <>
      <MenuLinks />

      <header ref={headerRef} className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="Go home" scroll={false} href="#top">
            <h4 className={clsx('bold', 'h4')}>XY COMBINATOR</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile && <ButtonLink href="mailto:contact@xycombinator.com" label="GET IN TOUCH" />}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
