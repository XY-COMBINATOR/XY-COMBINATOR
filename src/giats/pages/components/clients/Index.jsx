/**
 * Clients / Studio Component
 * Presents the studio manifesto and execution philosophy.
 * Optimized with high-efficiency IntersectionObserver reveal triggers,
 * completely eliminating layout thrashing and scroll stutter.
 */
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import styles from '@src/pages/components/clients/styles/clients.module.scss';

const beats = [
  {
    lead: "Hey, we're XY Combinator!",
    sub: 'We design and build websites, apps and commerce.',
    accent: 'One team, from idea to launch.',
  },
  {
    lead: 'Most agencies sell screens.',
    sub: 'The risk sits in timing, scope and follow through.',
    accent: 'We engineer around it.',
  },
  {
    lead: 'One team from first sketch to launch day.',
    sub: 'Fixed scope, weekly releases, no endless decks.',
    accent: 'We stay through launch.',
  },
];

function Clients() {
  const rootRef = useRef(null);
  const [entered, setEntered] = useState(() => {
    if (typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined') {
      return new Set(beats.map((_, i) => i));
    }
    return new Set();
  });
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  useEffect(() => {
    if (isLoading) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const beatElements = Array.from(root.querySelectorAll('[class*="beat"]'));
    if (!beatElements.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!Number.isNaN(index)) {
              setEntered((prev) => {
                const next = new Set(prev);
                next.add(index);
                return next;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    beatElements.forEach((el, index) => {
      el.setAttribute('data-index', String(index));
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <section ref={rootRef} id="studio" className={styles.root} data-header-theme="dark" aria-label="About XY Combinator studio">
      <div className={styles.stage}>
        <span className={styles.bgMark} aria-hidden="true" />

        <div className={styles.track}>
          {beats.map((beat, i) => (
            <div
              key={beat.lead}
              className={clsx(styles.beat, entered.has(i) && styles.entered)}
            >
              <span className={styles.lead}>{beat.lead}</span>
              {beat.sub ? <span className={styles.sub}>{beat.sub}</span> : null}
              <span className={styles.accent}>{beat.accent}</span>
            </div>
          ))}
        </div>

        <span className={styles.label}>Studio</span>
      </div>
    </section>
  );
}

export default Clients;
