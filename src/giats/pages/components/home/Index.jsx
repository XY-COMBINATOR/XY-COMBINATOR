/**
 * Home (Hero) Component
 * Integrated with React Bits <ShapeWaves /> WebGL background:
 * - GPU interactive wave field with 'XYC' carved glyph cutout
 * - Kinetic unmasked statement: Mission / Design & engineering that ships every week
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import ShapeWaves from '@src/pages/components/home/components/hero/ShapeWaves';
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
      {/* React Bits ShapeWaves WebGL background with 'XYC' text cutout */}
      <div className={styles.shapeWavesWrapper}>
        <ShapeWaves
          text="XYC"
          fontFamily='Geist, "Geist Sans", "Neue Haas Grotesk Display Pro", system-ui, sans-serif'
          fontWeight={600}
          textSize={0.65}
          cellSize={12}
          dotSize={0.75}
          color="#929292"
          hoverColor="#ffffff"
          backgroundColor="#000000"
          speed={1}
        />
      </div>

      {/* Centered Statement with Kinetic Unmask */}
      <div className={styles.content}>
        <div className={styles.mask}>
          <span className={styles.badge}>Mission</span>
        </div>
        <h1 className={styles.headline}>
          <span className={styles.mask}>
            <span className={clsx(styles.line, styles.line1)}>Design &amp; engineering</span>
          </span>
          <span className={styles.mask}>
            <span className={clsx(styles.line, styles.line2)}>
              that <em>ships</em> every week
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}

export default Home;
