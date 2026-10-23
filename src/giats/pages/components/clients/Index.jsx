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
  const rafRef = useRef(null);
  const [entered, setEntered] = useState(new Set());
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  useEffect(() => {
    if (isLoading) return undefined;
    const trigger = window.innerHeight * 0.52;
    const check = () => {
      const root = rootRef.current;
      if (!root) return;
      let changed = false;
      const next = new Set(entered);
      root.querySelectorAll('[class*="beat"]').forEach((el, i) => {
        if (!entered.has(i) && el.getBoundingClientRect().top <= trigger) {
          next.add(i);
          changed = true;
        }
      });
      if (changed) setEntered(next);
      rafRef.current = requestAnimationFrame(check);
    };
    rafRef.current = requestAnimationFrame(check);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoading]);

  return (
    <section ref={rootRef} id="studio" className={styles.root} data-header-theme="dark">
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
