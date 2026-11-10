import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import InfiniteText from '@src/components/animationComponents/infiniteText/Index';
import Link from 'next/link';
import arishImg from '@/assets/hero/arish.webp';
import clsx from 'clsx';
import { gsap } from 'gsap';
import heroImg from '@/assets/slr-hero.jpg';
import idiotBoxImg from '@/assets/hero/idiotbox.webp';
import jcreationImg from '@/assets/hero/jcreation.webp';
import styles from '@src/pages/components/home/styles/home.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

const SLIDE_DURATION = 5600;

const SHOWCASE = [
  {
    id: 'slr-playground',
    name: 'SLR Playground',
    tag: 'Catalog site',
    url: 'https://slrplaygroundmalaysia.com/',
    image: heroImg,
    blurb: 'A supplier catalog and project gallery for playground equipment.',
    stat: { value: '+120%', label: 'inbound leads after launch' },
  },
  {
    id: 'j-creation',
    name: 'J Creation',
    tag: 'E-commerce',
    url: 'https://jcreationbd.com/shop',
    image: jcreationImg,
    blurb: 'Grooms’ exclusive wear — catalog, product pages and a checkout that actually completes.',
    stat: { value: '2 wks', label: 'from sketch to first release' },
  },
  {
    id: 'arish-travels',
    name: 'Arish Travels',
    tag: 'Website',
    url: 'https://arishbd.com/',
    image: arishImg,
    blurb: 'Hajj & Umrah agency site with packages, visa guidance and pre-registration.',
    stat: { value: '4.9★', label: 'average client rating' },
  },
  {
    id: 'idiot-box',
    name: 'Idiot Box',
    tag: 'Desktop IDE',
    url: 'https://thewonderlandstudio.github.io/Idiot_Box/',
    image: idiotBoxImg,
    blurb: 'Free & open-source code editor for Windows. One calm window.',
    stat: { value: '50+', label: 'products shipped' },
  },
];

function Home() {
  const isMobile = useIsMobile();
  const rootRef = useRef();
  const infiniteTextRef = useRef();
  const mediaRef = useRef();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const current = SHOWCASE[active];

  useEffect(() => {
    if (paused || isLoading) return undefined;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SHOWCASE.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [paused, isLoading]);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top+=3%',
            end: 'top+=5%',
            toggleActions: 'play none reverse none',
            scroller: document.querySelector('main'),
            invalidateOnRefresh: true,
          },
        })
        .to(infiniteTextRef.current, {
          opacity: 0,
          duration: 0.6,
        });

      gsap.fromTo(
        mediaRef.current,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            scroller: document.querySelector('main'),
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => ctx.kill();
  }, []);

  return (
    <section ref={rootRef} id="top" className={clsx(styles.root)}>
      <div className={clsx(styles.topContainer, 'layout-grid-inner')}>
        <div className={styles.leftContainer}>
          <h1 className="h2">Design &amp; engineering</h1>
          <h1 className={clsx('h2', 'bold')}>that ships every week</h1>
        </div>
        {!isMobile && (
          <h6 className={clsx('h6', styles.rightContainer)}>
            We take an idea from a rough sketch to a live product — websites, apps and e-commerce. Fixed scope, something clickable every week, and we stick around after launch.
          </h6>
        )}
      </div>
      {isMobile && (
        <div className={styles.rightContainerMobile}>
          <h6 className="h6"> We take an idea from a rough sketch to a live product — websites, apps and e-commerce. Fixed scope, something clickable every week, and we stick around after launch.</h6>
        </div>
      )}

      <div
        className={clsx(styles.bottomContainer, paused && styles.isPaused)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Link
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${current.name} — designed and built by XY Combinator`}
          href={current.url}
          className={styles.heroMedia}
        >
          <div ref={mediaRef} className={styles.mediaStack}>
            {SHOWCASE.map((item, index) => (
              <div key={item.id} className={clsx(styles.slide, index === active && styles.slideActive)}>
                <Image
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  src={item.image}
                  alt={`${item.name} — designed and built by XY Combinator`}
                  fill
                  sizes="100%"
                />
              </div>
            ))}
          </div>
          <div className={styles.scrim} />
        </Link>

        <div key={current.id} className={styles.caption}>
          <span className={styles.captionTag}>{current.tag}</span>
          <h3 className={styles.captionTitle}>{current.name}</h3>
          <p className={styles.captionText}>{current.blurb}</p>
          <a className={styles.captionLink} href={current.url} target="_blank" rel="noreferrer">
            Visit live site <span>↗</span>
          </a>
        </div>

        <div key={`${current.id}-stat`} className={styles.statChip}>
          <strong className={styles.statValue}>{current.stat.value}</strong>
          <span className={styles.statLabel}>{current.stat.label}</span>
        </div>

        <div className={styles.pagination}>
          {SHOWCASE.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={clsx(styles.dot, index === active && styles.dotActive)}
            >
              <span className={styles.dotTrack}>
                <span className={styles.dotFill} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div ref={infiniteTextRef} className={styles.infiniteContainer}>
        <InfiniteText text="Scroll Down" length={5} />
      </div>
    </section>
  );
}

export default Home;
