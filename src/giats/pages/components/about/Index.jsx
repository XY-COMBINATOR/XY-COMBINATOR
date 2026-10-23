import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Image from 'next/image';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/about/styles/about.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import studioImg from '@/assets/work-imgs/slr-playground.webp';

function About() {
  const isMobile = useIsMobile();
  const rootRef = useRef();
  const animatedImageRef = useRef();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      gsap.set(animatedImageRef.current, { top: !isMobile ? '-20vw' : '0' });
      if (!isMobile) {
        gsap.to(animatedImageRef.current, {
          top: '20vw',
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            scroller: document?.querySelector('main'),
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation();
    return () => ctx.kill();
  }, [isMobile]);

  const renderImageContainer = () => (
    <div className={styles.imageContainer}>
      <Image priority src={studioImg} sizes="100%" fill alt="A product shipped by XY Combinator" />
    </div>
  );

  return (
    <section ref={rootRef} id="studio" className={styles.root}>
      <div className={clsx(styles.nameContainer, 'layout-block-inner')}>
        <AppearTitle>
          <h1 className={clsx('h1', 'medium')}>Hey, we&apos;re</h1>
          <h1 className={clsx('h1', 'medium')}>XY Combinator!</h1>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, 'layout-grid-inner')}>
        {isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <p className="p-l">
              “We design and build web products end to end — from the first sketch to launch day, and the iterations after. One
              team, no handoffs into the void, shipping every single week.”
            </p>
          </AppearTitle>
        </div>
        {!isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapperBottom)}>
          <AppearTitle>
            <p className="h6">
              A design &amp; engineering studio for founders who move fast. We turn ideas into live products with clean,
              efficient code and an eye for the details that make software feel effortless — then we stay through launch and
              beyond.
            </p>
          </AppearTitle>
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="mailto:contact@xycombinator.com" label="START A PROJECT" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
