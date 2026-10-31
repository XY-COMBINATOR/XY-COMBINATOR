/**
 * Home (Hero) Component
 * Main landing view for XY Combinator.
 * Contains headline statement with background image.
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from '@src/pages/components/home/styles/home.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Home() {
  const rootRef = useRef(null);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

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
      aria-label="Studio mission and hero"
    >
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
