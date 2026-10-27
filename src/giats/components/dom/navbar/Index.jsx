/**
 * Navbar Component
 * Fixed top banner navigation with instant smooth top scroll,
 * contact CTA, and full-screen menu overlay trigger.
 */
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Link from 'next/link';
import MenuButton from '@src/components/dom/navbar/components/MenuButton';
import MenuLinks from '@src/components/dom/navbar/components/MenuLinks';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/index.module.scss';
import { useCallback } from 'react';
import useIsMobile from '@src/hooks/useIsMobile';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Navbar() {
  const isMobile = useIsMobile();
  const [lenis] = useStore(useShallow((state) => [state.lenis]));

  /**
   * Programmatic smooth scroll to viewport position using exponential easing.
   */
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

  /**
   * Smoothly scrolls to the top of the page when clicking the brand wordmark.
   */
  const goToTop = useCallback(
    (event) => {
      event.preventDefault();
      scrollToPosition(0);
    },
    [scrollToPosition],
  );

  return (
    <>
      {/* Fullscreen Mobile & Desktop Navigation Overlay */}
      <MenuLinks />

      <header className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="Go home" scroll={false} href="#top">
            <h4 className={clsx('bold', 'h4')}>XY COMBINATOR</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile && (
              <ButtonLink 
                href="mailto:contact@xycombinator.com" 
                label="GET IN TOUCH" 
                aria-label="Send email to XY Combinator"
              />
            )}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
