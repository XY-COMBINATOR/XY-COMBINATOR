/**
 * Home (Hero) Component
 * Main landing view for XY Combinator.
 * Contains ambient 3D binary streams, hardware console box, and headline statement.
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import BinaryStreams from '@src/pages/components/home/components/hero/BinaryStreams';
import ProductBox from '@src/pages/components/home/components/hero/ProductBox';
import styles from '@src/pages/components/home/styles/home.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

const ANCHOR_DESKTOP = { x: 0.69, y: 0.52 };
const ANCHOR_MOBILE = { x: 0.5, y: 0.66 };

function Home() {
  const isMobile = useIsMobile();
  const rootRef = useRef(null);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const anchor = isMobile ? ANCHOR_MOBILE : ANCHOR_DESKTOP;

  useEffect(() => {
    const section = rootRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('on-dark-hero', entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      document.body.classList.remove('on-dark-hero');
    };
  }, []);

  const entered = !isLoading;

  return (
    <section
      ref={rootRef}
      id="top"
      className={clsx(styles.root, entered && styles.entered)}
      style={{ '--anchor-x': anchor.x, '--anchor-y': anchor.y }}
      aria-label="Studio mission and hero"
    >
      <div className={styles.glow} aria-hidden="true" />
      <BinaryStreams anchor={anchor} isMobile={isMobile} variant="back" className={styles.streams} />
      <ProductBox className={styles.product} />
      <BinaryStreams anchor={anchor} isMobile={isMobile} variant="front" className={styles.streamsFront} />

      <div className={clsx(styles.content, 'layout-block-inner')}>
        <span className={styles.badge}>Mission</span>
        <h2 className={styles.headline}>
          <span className={styles.line}>Design &amp; engineering</span>
          <span className={styles.line}>
            that <em>ships</em> every week
          </span>
        </h2>
      </div>
    </section>
  );
}

export default Home;
