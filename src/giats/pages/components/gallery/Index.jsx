/**
 * Gallery Component
 * Presents conceptual design applications across physical and outdoor media.
 * Employs subtle parallax scroll displacement via GSAP ScrollTrigger and responsive image plates.
 */
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import useIsMobile from '@src/hooks/useIsMobile';
import usePrefersReducedMotion from '@src/hooks/usePrefersReducedMotion';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import styles from '@src/pages/components/gallery/styles/gallery.module.scss';

const shots = [
  {
    img: '/gallery/a-frame-sign.webp',
    width: 1125,
    height: 1398,
    title: 'Sidewalk sign',
    caption: 'Open hours and oversized type for the first impression at street level.',
    alt: 'A-frame sidewalk sign for XY Combinator in blue and white on a tiled pavement',
  },
  {
    img: '/gallery/city-billboard.webp',
    width: 1086,
    height: 1448,
    title: 'City billboard',
    caption: 'The identity at building scale, seen from across the plaza.',
    alt: 'City building billboard showing XY Combinator with black and white photography and Design X Engineering',
  },
  {
    img: '/gallery/storefront-lightbox.webp',
    width: 1086,
    height: 1448,
    title: 'Storefront lightbox',
    caption: 'A lit wall for the studio door after dark.',
    alt: 'Illuminated storefront lightbox displaying XY Combinator branding at night',
  },
];

function Gallery() {
  const isMobile = useIsMobile();
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef(null);

  // IntersectionObserver for entrance reveal animations
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const figures = Array.from(root.querySelectorAll('figure'));

    if (typeof IntersectionObserver === 'undefined') {
      figures.forEach((figure) => figure.classList.add(styles.visible));
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

    figures.forEach((figure) => observer.observe(figure));

    return () => observer.disconnect();
  }, []);

  // Parallax image displacement on desktop devices
  useIsomorphicLayoutEffect(() => {
    if (isMobile || reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const figures = gsap.utils.toArray(rootRef.current?.querySelectorAll('figure') || []);

      figures.forEach((figure) => {
        const img = figure.querySelector('img');
        if (!img) return;

        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: figure,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              scroller: document?.querySelector('main'),
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.kill();
  }, [isMobile, reduceMotion]);

  return (
    <section ref={rootRef} id="gallery" className={styles.root} data-header-theme="dark" aria-label="Design gallery">
      <header className={clsx(styles.head, 'layout-block-inner')}>
        <div className={styles.headMain}>
          <span className={styles.kicker}>Gallery</span>
          <AppearTitle>
            <h2 className={styles.title}>The Design Gallery</h2>
          </AppearTitle>
        </div>
        <AppearTitle>
          <p className={styles.story}>
            Take the identity off the screen and it still has to hold. These concepts place XY Combinator on sidewalks,
            skyline screens and studio doors. One system, three surfaces.
          </p>
        </AppearTitle>
      </header>

      <div className={clsx(styles.plates, 'layout-block-inner')}>
        {shots.map((shot, i) => (
          <figure
            key={shot.img}
            className={clsx(styles.plate, styles[`plate${i + 1}`])}
            style={{ '--aspect': `${shot.width} / ${shot.height}` }}
          >
            <div className={styles.frame}>
              <img 
                src={shot.img} 
                alt={shot.alt} 
                width={shot.width} 
                height={shot.height} 
                loading="lazy" 
                decoding="async" 
              />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.captionText}>
                <span className={styles.captionTitle}>{shot.title}</span>
                <p className={styles.captionBody}>{shot.caption}</p>
              </div>
              <span className={styles.tag}>Conceptual mockup</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
