/**
 * Expertise Component
 * Displays the core design and engineering capabilities offered by XY Combinator.
 * Features an ambient background video texture with automatic poster fallback,
 * and intersection-observed list reveal transitions.
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import styles from '@src/pages/components/expertise/styles/expertise.module.scss';

const services = [
  {
    name: 'Brand Strategy & Identity',
    desc: 'Positioning, naming and a visual system built to last.',
  },
  {
    name: 'Creative & Art Direction',
    desc: 'One eye across every surface the brand touches.',
  },
  {
    name: 'Digital Experience Design',
    desc: 'Sites shaped around the story people came for.',
  },
  {
    name: 'Product & Interface Design',
    desc: 'Interfaces that stay clear as the product grows.',
  },
  {
    name: 'Web Development & CMS',
    desc: 'Fast, editable builds on modern foundations.',
  },
  {
    name: 'Application Development',
    desc: 'Web and mobile products made for daily use.',
  },
  {
    name: 'Search & Performance Optimization',
    desc: 'Speed and structure that compound over time.',
  },
  {
    name: 'Accessibility & Experience Optimization',
    desc: 'Experiences everyone can use, on any device.',
  },
];

function Expertise() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  // Reveal list items on scroll entrance
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const rows = Array.from(root.querySelectorAll('li'));

    if (typeof IntersectionObserver === 'undefined') {
      rows.forEach((row) => row.classList.add(styles.visible));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    rows.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, []);

  // Ambient video playback controller with performance lazy loading
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || failed) return undefined;

    let stopped = false;
    let ready = false;
    video.muted = true;

    const tryPlay = () => {
      if (stopped || !ready) return;
      const attempt = video.play();
      if (attempt?.catch) attempt.catch(() => {});
    };

    const start = () => {
      ready = true;
      if (!video.src) {
        video.src = '/videos/expertise.mp4';
        video.load();
      }
      tryPlay();
    };

    const onCanPlay = () => tryPlay();
    video.addEventListener('canplay', onCanPlay);

    let observer;

    if (typeof IntersectionObserver === 'undefined') {
      start();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) start();
          });
        },
        { rootMargin: '400px 0px' },
      );
      observer.observe(root);
    }

    return () => {
      stopped = true;
      video.removeEventListener('canplay', onCanPlay);
      observer?.disconnect();
      video.pause();
    };
  }, [failed]);

  return (
    <section ref={rootRef} id="expertise" className={styles.root} data-header-theme="dark" aria-label="Studio expertise">
      {/* Decorative Background Video / Poster */}
      <div className={styles.media} aria-hidden="true">
        {failed ? (
          <img className={styles.source} src="/videos/expertise-poster.jpg" alt="" decoding="async" />
        ) : (
          <video
            ref={videoRef}
            className={styles.source}
            poster="/videos/expertise-poster.jpg"
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            tabIndex={-1}
            onError={() => setFailed(true)}
          />
        )}
        <span className={styles.overlay} />
      </div>

      <div className={clsx(styles.inner, 'layout-block-inner')}>
        <header className={styles.head}>
          <div className={styles.headMain}>
            <span className={styles.kicker}>Design X Engineering</span>
            <AppearTitle>
              <h2 className={styles.title}>Our Expertise</h2>
            </AppearTitle>
          </div>
          <AppearTitle>
            <p className={styles.story}>
              Eight disciplines under one roof. Strategy, design and engineering move together, so nothing gets lost
              between the idea and the release.
            </p>
          </AppearTitle>
        </header>

        <ol className={styles.list}>
          {services.map((service, i) => (
            <li key={service.name} className={styles.row} style={{ '--i': i }}>
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.name}>{service.name}</span>
              <span className={styles.desc}>{service.desc}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Expertise;
