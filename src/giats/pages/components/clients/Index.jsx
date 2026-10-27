/**
 * Clients / Studio Component
 * Presents the studio manifesto and execution philosophy.
 * Features smooth scroll-triggered sequential reveal across all devices,
 * providing a premium, cinematic reading experience on both high-end and low-end hardware.
 */
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import useScroll from '@src/hooks/useScroll';
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
  const [entered, setEntered] = useState(() => new Set());
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const checkBeats = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const trigger = window.innerHeight * 0.62;
    const beatElements = root.querySelectorAll('[class*="beat"]');

    setEntered((prev) => {
      let changed = false;
      const next = new Set(prev);

      beatElements.forEach((el, index) => {
        if (!next.has(index)) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= trigger) {
            next.add(index);
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });
  }, []);

  // Listen to Lenis smooth scroll updates
  useScroll(checkBeats);

  // Fallback to window scroll, resize, and initial trigger
  useEffect(() => {
    if (isLoading) return undefined;

    checkBeats();

    window.addEventListener('scroll', checkBeats, { passive: true });
    window.addEventListener('resize', checkBeats, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkBeats);
      window.removeEventListener('resize', checkBeats);
    };
  }, [isLoading, checkBeats]);

  return (
    <section
      ref={rootRef}
      id="studio"
      className={styles.root}
      data-header-theme="dark"
      aria-label="About XY Combinator studio"
    >
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
