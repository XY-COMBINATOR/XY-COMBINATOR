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
      <Image priority src={studioImg} sizes="100%" fill alt="A product shipped by XY Combinators" />
    </div>
  );

  return (
    <section ref={rootRef} id="studio" className={styles.root}>
      <div className={clsx(styles.nameContainer, 'layout-block-inner')}>
        <AppearTitle>
          <h1 className={clsx('h1', 'medium')}>Hey, we&apos;re</h1>
          <h1 className={clsx('h1', 'medium')}>XY Combinators!</h1>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, 'layout-grid-inner')}>
        {isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <div className="p-l">“We design and build web products end to end —</div>
            <div className="p-l">from the first sketch to launch day, and the</div>
            <div className="p-l">fixes after. One team, no middlemen, and</div>
            <div className="p-l">something clickable every single week.”</div>
          </AppearTitle>
        </div>
        {!isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapperBottom)}>
          {!isMobile ? (
            <AppearTitle key="desktop-descWrapperBottom">
              <h6 className="h6">A design &amp; engineering studio for founders</h6>
              <h6 className="h6">who move fast. We turn ideas into live products</h6>
              <h6 className="h6">with clean, quick code and an eye for the little</h6>
              <h6 className="h6">details that make software easy to use —</h6>
              <h6 className="h6">then we stick around through launch.</h6>
            </AppearTitle>
          ) : (
            <AppearTitle key="mobile-descWrapperBottom">
              <h6 className="h6"> A design &amp; engineering studio for founders who move</h6>
              <h6 className="h6">fast. We turn ideas into live products with clean, quick</h6>
              <h6 className="h6">code and an eye for the little details that make software</h6>
              <h6 className="h6">easy to use — then we stick around through launch.</h6>
            </AppearTitle>
          )}
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="mailto:contact@xycombinator.com" label="START A PROJECT" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
