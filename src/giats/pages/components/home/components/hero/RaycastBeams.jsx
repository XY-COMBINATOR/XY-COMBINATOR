/**
 * RaycastBeams Component
 * High-fidelity reproduction of the Raycast Windows diagonal illuminated red slats:
 * - Proportional vmin scaling for responsive framing on all devices
 * - Deep vermilion-to-scarlet luminous core with rich contrast
 * - Distinctive indigo/navy shadow fringing at the bottom-left cutoff
 * - Authentic high-frequency analog grain overlay
 * - Subtle 3D mouse parallax response
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './raycastBeams.module.scss';

// 8 calibrated slats matching the Raycast hero cluster density and proportions
const SLATS = [
  { id: 1, width: 24, height: '54vmin', offset: -250, shiftY: -35, opacity: 0.45, blur: 10 },
  { id: 2, width: 54, height: '70vmin', offset: -185, shiftY: -15, opacity: 0.8, blur: 12 },
  { id: 3, width: 96, height: '85vmin', offset: -100, shiftY: 10, opacity: 0.96, blur: 14 },
  { id: 4, width: 138, height: '94vmin', offset: 15, shiftY: 0, opacity: 1.0, blur: 16 },
  { id: 5, width: 112, height: '88vmin', offset: 135, shiftY: -10, opacity: 0.95, blur: 14 },
  { id: 6, width: 68, height: '75vmin', offset: 230, shiftY: 20, opacity: 0.82, blur: 12 },
  { id: 7, width: 34, height: '60vmin', offset: 295, shiftY: -20, opacity: 0.52, blur: 10 },
  { id: 8, width: 18, height: '46vmin', offset: 340, shiftY: 30, opacity: 0.32, blur: 8 },
];

function RaycastBeams({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let rafId = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let dirty = true;
    let inView = true;

    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      target.x = nx;
      target.y = ny;
      dirty = true;
    };

    const update = () => {
      rafId = requestAnimationFrame(update);
      if (!inView || !dirty) return;

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      el.style.setProperty('--tilt-x', current.x.toFixed(4));
      el.style.setProperty('--tilt-y', current.y.toFixed(4));

      if (Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001) {
        dirty = false;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    observer.observe(el);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={clsx(styles.stage, className)} aria-hidden="true">
      {/* Ambient background bloom */}
      <div className={styles.ambientGlow} />

      {/* 3D Tilt perspective wrapper */}
      <div className={styles.tiltWrapper}>
        <div className={styles.slatsCluster}>
          {SLATS.map((slat) => (
            <div
              key={slat.id}
              className={styles.slat}
              style={{
                '--width': `${slat.width}px`,
                '--height': slat.height,
                '--offset': `${slat.offset}px`,
                '--shift-y': `${slat.shiftY}px`,
                '--opacity': slat.opacity,
                '--blur': `${slat.blur}px`,
              }}
            >
              <div className={styles.slatBody} />
              <div className={styles.slatCore} />
              <div className={styles.slatNavyFringe} />
            </div>
          ))}
        </div>
      </div>

      {/* Analog film grain / dither texture overlay */}
      <div className={styles.grainOverlay} />

      {/* Edge vignette fading into pure black */}
      <div className={styles.vignette} />
    </div>
  );
}

export default RaycastBeams;
