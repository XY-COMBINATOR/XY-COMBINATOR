/**
 * ProductBox Component
 * Premium 3D device showcase with responsive pointer tilt, realistic materials,
 * soft ambient shadows, and a sophisticated slate-gray color palette.
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from '@src/pages/components/home/components/hero/productBox.module.scss';

function ProductBox({ className }) {
  const deviceRef = useRef(null);

  useEffect(() => {
    const device = deviceRef.current;
    if (!device) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let rafId = 0;
    let active = true;
    let inView = true;
    let dirty = true;

    // Subtle pointer-driven perspective tilt
    const handlePointer = (event) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      target.x = nx * 6;
      target.y = ny * -4;
      dirty = true;
    };

    const write = () => {
      device.style.setProperty('--rx', `${current.y.toFixed(3)}deg`);
      device.style.setProperty('--ry', `${current.x.toFixed(3)}deg`);
    };

    const loop = () => {
      if (!active) return;
      rafId = requestAnimationFrame(loop);
      if (!inView || document.hidden || !dirty) return;

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      if (Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01) {
        current.x = target.x;
        current.y = target.y;
        write();
        dirty = false;
        return;
      }

      write();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    observer.observe(device);

    window.addEventListener('pointermove', handlePointer, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  return (
    <div className={clsx(styles.stage, className)} aria-hidden="true">
      <div className={styles.ground}>
        <span className={styles.shadow} />
      </div>
      <div className={styles.float}>
        <div className={styles.device} ref={deviceRef}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <img className={styles.mark} src="/logo.png" alt="" draggable={false} />
              <span className={styles.wordmark}>XY COMBINATOR</span>
            </div>
            <span className={styles.serial}>XY · 2026</span>
          </div>
          <div className={styles.front}>
            <div className={styles.bezel}>
              <div className={styles.screen} />
              <div className={styles.statusBar} />
            </div>
            <div className={styles.chin} />
          </div>
          <div className={styles.left} />
          <div className={styles.right} />
        </div>
      </div>
    </div>
  );
}

export default ProductBox;
